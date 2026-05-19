import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleFileUpload } from "@/lib/upload";
import { z } from "zod";

const orderSchema = z.object({
  customerName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  deliveryZone: z.string().min(1),
  deliveryFee: z.number().nonnegative(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      price: z.number().positive(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const customerName = formData.get("customerName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const deliveryZone = formData.get("deliveryZone") as string;
    const deliveryFee = parseFloat(formData.get("deliveryFee") as string);
    const itemsStr = formData.get("items") as string;

    const items = JSON.parse(itemsStr);

    const data = {
      customerName,
      email,
      phone,
      deliveryZone,
      deliveryFee,
      items,
    };

    orderSchema.parse(data);

    // Handle payment proof upload
    let paymentProof: string | undefined;
    const proofFile = formData.get("paymentProof") as File;
    if (proofFile && proofFile.size > 0) {
      paymentProof = await handleFileUpload(formData, "paymentProof", "payments");
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        customerName,
        email,
        phone,
        deliveryZone,
        deliveryFee,
        paymentProof,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
