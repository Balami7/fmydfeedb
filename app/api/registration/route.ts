import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const registrationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  age: z.string().optional(),
  occupation: z.string().optional(),
  state: z.string().optional(),
  lga: z.string().optional(),
  address: z.string().optional(),
  gender: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registrationSchema.parse(body);

    const registration = await prisma.registration.create({
      data,
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const registrations = await prisma.registration.findMany();
    return NextResponse.json(registrations);
  } catch (error: any) {
    console.error("Registration fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
