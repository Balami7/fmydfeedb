import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const surveySchema = z.object({
  registrationId: z.string().optional(),
  awareness: z.string().optional(),
  priorities: z.string().optional(),
  challenges: z.string().optional(),
  inclusion: z.string().optional(),
  accessibility: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = surveySchema.parse(body);

    const survey = await prisma.surveyResponse.create({
      data,
    });

    return NextResponse.json(survey, { status: 201 });
  } catch (error: any) {
    console.error("Survey error:", error);
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
    const surveys = await prisma.surveyResponse.findMany();
    return NextResponse.json(surveys);
  } catch (error: any) {
    console.error("Survey fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
