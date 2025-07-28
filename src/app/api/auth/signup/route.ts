import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/schema/signUpSchema";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod schema
    const validationResult = signupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { name, username, password } = validationResult.data;

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // TODO: Add password hashing with bcrypt
    // For now, storing plain text password (NOT RECOMMENDED for production)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: password, // TODO: Hash this password
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: newUser
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
