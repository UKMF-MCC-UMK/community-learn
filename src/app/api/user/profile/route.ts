import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    // // Ambil data user dari database
    // const user = await prisma.user.findUnique({
    //   where: { id: session.user.id },
    //   select: {
    //     id: true,
    //     username: true,
    //     createdAt: true,
    //     updatedAt: true,
    //     _count: {
    //       select: {
    //         createdCourses: true,
    //       },
    //     },
    //   },
    // });

    // if (!user) {
    //   return NextResponse.json(
    //     { error: "User not found" },
    //     { status: 404 }
    //   );
    // }

    // Format response
    return NextResponse.json({
      // id: user.id,
      // username: user.username,
      // createdAt: user.createdAt,
      // updatedAt: user.updatedAt,
      // materiCount: user._count.createdCourses,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
