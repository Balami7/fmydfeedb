import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const registrationSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  age_range: z.string().optional(),
  occupation: z.string().optional(),
  visitor_category: z.string().optional(),
  state_of_residence: z.string().optional(),
  lga: z.string().optional(),
  home_address: z.string().optional(),
  gender: z.string().optional(),
  visit_date: z.string().optional(),
  registration_date: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registrationSchema.parse(body);

    const registration = await prisma.registration.create({
      data: {
        name: data.full_name,
        email: data.email,
        phone: data.phone,
        age: data.age_range,
        occupation: data.occupation,
        visitor_category: data.visitor_category,
        state: data.state_of_residence,
        lga: data.lga,
        address: data.home_address,
        gender: data.gender,
        visit_date: data.visit_date,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error: unknown) {
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
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(registrations);
  } catch (error: unknown) {
    console.error("Registration fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
