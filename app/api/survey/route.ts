import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const surveySchema = z.object({
  full_name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  age_range: z.string().optional(),
  occupation: z.string().optional(),
  visitor_category: z.string().optional(),
  state_of_residence: z.string().optional(),
  lga: z.string().optional(),
  home_address: z.string().optional(),
  gender: z.string().optional(),
  visit_date: z.string().optional(),
  heard_of_ministry: z.string().optional(),
  aware_programmes: z.union([z.array(z.string()), z.string()]).optional(),
  familiarity_score: z.number().optional(),
  priority_areas: z.union([z.array(z.string()), z.string()]).optional(),
  opportunities_opinion: z.string().optional(),
  most_interesting_programme: z.string().optional(),
  programme_to_expand: z.string().optional(),
  improvements: z.string().optional(),
  new_initiatives: z.string().optional(),
  biggest_challenge: z.string().optional(),
  challenge_solutions: z.string().optional(),
  program_types_interest: z.union([z.array(z.string()), z.string()]).optional(),
  would_participate: z.string().optional(),
  has_disability: z.string().optional(),
  disability_details: z.string().optional(),
  accommodation_support: z.string().optional(),
  anything_else: z.string().optional(),
  comments: z.string().optional(),
  submitted_at: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = surveySchema.parse(body);

    const survey = await prisma.surveyResponse.create({
      data: {
        ...data,
        aware_programmes: Array.isArray(data.aware_programmes)
          ? JSON.stringify(data.aware_programmes)
          : data.aware_programmes,
        priority_areas: Array.isArray(data.priority_areas)
          ? JSON.stringify(data.priority_areas)
          : data.priority_areas,
        program_types_interest: Array.isArray(data.program_types_interest)
          ? JSON.stringify(data.program_types_interest)
          : data.program_types_interest,
      },
    });

    return NextResponse.json(survey, { status: 201 });
  } catch (error: unknown) {
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

export async function GET() {
  try {
    const surveys = await prisma.surveyResponse.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(surveys);
  } catch (error: unknown) {
    console.error("Survey fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
