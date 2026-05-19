import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateToken, hashPassword, verifyPassword } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
