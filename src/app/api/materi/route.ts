import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomUUID } from "crypto";
import { parseFolderContents } from "@/lib/googleDrive";
import { extractGoogleDriveFolderId } from '@/lib/driveUtils';

const materiSchema = z.object({
  title: z.string().min(1, "Judul materi harus diisi"),
  description: z.string().min(1, "Deskripsi materi harus diisi"),
  contentUrl: z.string().url("URL konten harus berupa link yang valid"),
  contentType: z.enum(["link", "folder", "document", "video"]).default("link"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = materiSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { title, description, contentUrl, contentType } = validation.data;

    let metadata: string | null = null;
    if (contentType === "folder") {
      try {
        const folderId = extractGoogleDriveFolderId(contentUrl);        

        if (!folderId) {
          return NextResponse.json(
            { error: "Invalid Google Drive folder URL" },
            { status: 400 }
          );
        }

        const { structure, error } = await parseFolderContents(folderId);

        if (error) {
          return NextResponse.json(
            { error: `Google Drive API Error: ${error}` },
            { status: 500 }
          );
        }

        metadata = JSON.stringify({
          folderTree: structure
        });

      } catch (error) {
        console.error("Error fetching Google Drive folder structure:", error);
        return NextResponse.json(
          { error: "Failed to fetch Google Drive folder structure" },
          { status: 500 }
        );
      }
    }

    // Workaround: Use raw SQL until Prisma client is updated
    const materiId = randomUUID();

    await prisma.$executeRaw`
      INSERT INTO Materi (id, title, description, contentUrl, contentType, metadata, authorId, createdAt, updatedAt)
      VALUES (${materiId}, ${title}, ${description}, ${contentUrl}, ${contentType}, ${metadata}, ${session.user.username}, NOW(), NOW())
    `;

    // Fetch the created materi with author
    const materi = await prisma.materi.findUnique({
      where: { id: materiId }
    });

    return NextResponse.json({
      success: true,
      data: materi,
    });
  } catch (error) {
    console.error("Error creating materi:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const materi = await prisma.materi.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: materi,
    });
  } catch (error) {
    console.error("Error fetching materi:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
