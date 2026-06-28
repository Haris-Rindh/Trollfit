import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    // 1. Get total sales (sum of all orders that are not CANCELLED or RETURNED)
    const salesAggregate = await db.order.aggregate({
      where: {
        NOT: [
          { status: "CANCELLED" },
          { status: "RETURNED" },
        ],
      },
      _sum: {
        total: true,
      },
    });

    const totalSales = Number(salesAggregate._sum.total || 0);

    // 2. Get total orders count
    const totalOrders = await db.order.count();

    // 3. Get pending/processing/confirmed orders count
    const activeOrders = await db.order.count({
      where: {
        status: {
          in: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"],
        },
      },
    });

    // 4. Calculate average order value
    const avgOrderValue = totalOrders > 0 ? Number((totalSales / totalOrders).toFixed(2)) : 0;

    // 5. Get recent orders (last 5)
    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    });

    // 6. Get orders status counts for chart
    const statusCounts = await db.order.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const formattedStatusCounts = statusCounts.map((group) => ({
      status: group.status,
      count: group._count.id,
    }));

    return NextResponse.json({
      metrics: {
        totalSales,
        totalOrders,
        activeOrders,
        avgOrderValue,
      },
      recentOrders,
      statusCounts: formattedStatusCounts,
    });
  } catch (error: any) {
    console.error("Admin metrics error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
