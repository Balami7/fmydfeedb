import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { handleFileUpload } from "@/lib/upload";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  href: z.string().optional(),
  external: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service.findMany();
    return NextResponse.json(services);
  } catch (error: any) {
    console.error("Services fetch error:", error);
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
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const href = (formData.get("href") as string) || undefined;
    const external = formData.get("external") === "true";

    const data = { name, description, href, external };
    serviceSchema.parse(data);

    let image: string | undefined;
    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      image = await handleFileUpload(formData, "image", "services");
    }

    const service = await prisma.service.create({
      data: {
        ...data,
        image,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    console.error("Service creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const href = (formData.get("href") as string) || undefined;
    const external = formData.get("external") === "true";

    const data = { name, description, href, external };
    serviceSchema.parse(data);

    const updateData: any = data;
    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      updateData.image = await handleFileUpload(formData, "image", "services");
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(service);
  } catch (error: any) {
    console.error("Service update error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Service deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
