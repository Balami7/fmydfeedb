import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { handleFileUpload } from "@/lib/upload";
import { z } from "zod";

const gallerySchema = z.object({
  title: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const galleries = await prisma.gallery.findMany();
    return NextResponse.json(galleries);
  } catch (error: any) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;

    gallerySchema.parse({ title });

    const image = await handleFileUpload(formData, "image", "gallery");

    const gallery = await prisma.gallery.create({
      data: {
        title,
        image,
      },
    });

    return NextResponse.json(gallery, { status: 201 });
  } catch (error: any) {
    console.error("Gallery creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    await prisma.gallery.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Gallery deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
