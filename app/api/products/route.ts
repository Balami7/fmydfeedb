import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { handleFileUpload } from "@/lib/upload";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  quantity: z.number().int().nonnegative(),
});

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Products fetch error:", error);
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
    const price = parseFloat(formData.get("price") as string);
    const quantity = parseInt(formData.get("quantity") as string);

    const data = { name, description, price, quantity };
    productSchema.parse(data);

    let image: string | undefined;
    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      image = await handleFileUpload(formData, "image", "products");
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        image,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Product creation error:", error);
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
    const price = parseFloat(formData.get("price") as string);
    const quantity = parseInt(formData.get("quantity") as string);

    const data = { name, description, price, quantity };
    productSchema.parse(data);

    const updateData: any = data;
    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      updateData.image = await handleFileUpload(formData, "image", "products");
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Product update error:", error);
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
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Product deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
