import { prisma } from "./prisma";

export type MateriContentType = "link" | "folder" | "document" | "video";

export interface CreateMateriData {
  title: string;
  description: string;
  contentUrl: string;
  contentType: MateriContentType;
  authorId: string;
}

export async function createMateri(data: CreateMateriData) {
  // Auto-generate metadata for folder type
  let metadata = null;
  if (data.contentType === "folder") {
    metadata = JSON.stringify({
      type: "folder",
      message: "Folder berisi multiple files. Akses folder untuk melihat semua konten.",
      detectedAt: new Date().toISOString()
    });
  }

  return await prisma.materi.create({
    data: {
      title: data.title,
      description: data.description,
      contentUrl: data.contentUrl,
      contentType: data.contentType,
      metadata,
      authorId: data.authorId,
    } as any,
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
}

export async function getAllMateri() {
  return await prisma.materi.findMany({
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
