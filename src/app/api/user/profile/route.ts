import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema untuk validasi update profil
const profileUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Password saat ini harus diisi").optional(),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter").optional(),
});

// GET: Mendapatkan data profil pengguna
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ambil data user dari database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            createdCourses: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Format response
    return NextResponse.json({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      materiCount: user._count.createdCourses,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

// PUT: Update profil pengguna
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validasi input
    const validationResult = profileUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    // Jika user ingin mengubah password
    if (body.newPassword) {
      if (!body.currentPassword) {
        return NextResponse.json(
          { error: "Password saat ini harus diisi" },
          { status: 400 }
        );
      }

      // Verifikasi password saat ini
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      // Verifikasi password (dalam produksi seharusnya menggunakan bcrypt)
      if (user.password !== body.currentPassword) {
        return NextResponse.json(
          { error: "Password saat ini tidak valid" },
          { status: 400 }
        );
      }

      // Update password
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: body.newPassword },
      });

      return NextResponse.json({
        message: "Password berhasil diperbarui",
      });
    }

    // Jika tidak ada yang diupdate
    return NextResponse.json({
      message: "Tidak ada perubahan yang dilakukan",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}