import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { extractGoogleDriveFolderId } from '@/lib/driveUtils';
import { parseFolderContents } from "@/lib/googleDrive";

const materiUpdateSchema = z.object({
  title: z.string().min(1, "Judul materi harus diisi"),
  description: z.string().min(1, "Deskripsi materi harus diisi"),
  contentUrl: z.string().url("URL konten harus berupa link yang valid"),
  contentType: z.enum(["link", "folder", "document", "video"]).default("link"),
});

// GET a single materi by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const materi = await prisma.materi.findUnique({
      where: { id },
    });

    if (!materi) {
      return NextResponse.json(
        { error: "Materi not found" },
        { status: 404 }
      );
    }

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

// PUT to update a materi
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if materi exists and belongs to the user
    const existingMateri = await prisma.materi.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!existingMateri) {
      return NextResponse.json(
        { error: "Materi not found" },
        { status: 404 }
      );
    }

    // Check if the user is the author of the materi
    if (existingMateri.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to update this materi" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = materiUpdateSchema.safeParse(body);

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

    // Update the materi
    const updatedMateri = await prisma.materi.update({
      where: { id },
      data: {
        title,
        description,
        contentUrl,
        contentType,
        metadata,
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedMateri,
    });
  } catch (error) {
    console.error("Error updating materi:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE a materi
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if materi exists and belongs to the user
    const existingMateri = await prisma.materi.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!existingMateri) {
      return NextResponse.json(
        { error: "Materi not found" },
        { status: 404 }
      );
    }

    // Check if the user is the author of the materi
    if (existingMateri.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to delete this materi" },
        { status: 403 }
      );
    }

    // Delete the materi
    await prisma.materi.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Materi deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting materi:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}