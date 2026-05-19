import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [registrations, surveyResponses, orders, products, galleries, services] =
      await Promise.all([
        prisma.registration.findMany(),
        prisma.surveyResponse.findMany(),
        prisma.order.findMany({
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        }),
        prisma.product.findMany(),
        prisma.gallery.findMany(),
        prisma.service.findMany(),
      ]);

    return NextResponse.json({
      registrations,
      surveyResponses,
      orders,
      products,
      galleries,
      services,
      stats: {
        totalRegistrations: registrations.length,
        totalSurveyResponses: surveyResponses.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalGalleries: galleries.length,
        totalServices: services.length,
      },
    });
  } catch (error: any) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, data } = await request.json();

    if (action === "exportRegistrations") {
      const registrations = await prisma.registration.findMany();
      const csv = convertToCSV(registrations);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="registrations.csv"',
        },
      });
    }

    if (action === "exportSurveys") {
      const surveys = await prisma.surveyResponse.findMany();
      const csv = convertToCSV(surveys);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="surveys.csv"',
        },
      });
    }

    if (action === "exportOrders") {
      const orders = await prisma.order.findMany({
        include: { items: true },
      });
      const csv = convertToCSV(orders);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="orders.csv"',
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]);
  const headerRow = headers.join(",");

  const rows = data.map((obj) =>
    headers
      .map((header) => {
        const value = obj[header];
        if (value === null || value === undefined) {
          return "";
        }
        if (typeof value === "object") {
          return JSON.stringify(value).replace(/"/g, '""');
        }
        return String(value).replace(/"/g, '""');
      })
      .join(",")
  );

  return [headerRow, ...rows].join("\n");
}
