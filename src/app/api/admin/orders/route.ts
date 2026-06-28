import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus, PaymentStatus } from "@prisma/client";

// GET all orders for admin
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const whereClause: any = {};

    // Filter by status if provided
    if (status && status !== "ALL") {
      whereClause.status = status as OrderStatus;
    }

    // Search query
    if (search) {
      whereClause.OR = [
        { number: { contains: search, mode: "insensitive" } },
        { shippingName: { contains: search, mode: "insensitive" } },
        { shippingCity: { contains: search, mode: "insensitive" } },
        { shippingPhone: { contains: search, mode: "insensitive" } },
        { guestEmail: { contains: search, mode: "insensitive" } },
      ];
    }

    const orders = await db.order.findMany({
      where: whereClause,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// UPDATE order details
export async function PUT(req: Request) {
  try {
    const { id, status, paymentStatus, trackingNumber } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status as OrderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus as PaymentStatus;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;

    const updatedOrder = await db.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Admin order update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
