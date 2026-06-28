import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// CREATE order
export async function POST(req: Request) {
  try {
    const {
      number,
      userId,
      guestName,
      guestEmail,
      guestPhone,
      subtotal,
      shipping,
      discount,
      total,
      paymentMethod,
      paymentStatus,
      shippingName,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingNotes,
      items,
    } = await req.json();

    if (!number || !items || items.length === 0 || !shippingName || !shippingPhone || !shippingAddress || !shippingCity) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    // Build items payload
    const orderItems = items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size,
      color: item.color || null,
      price: item.price,
      name: item.name,
      image: item.image || null,
    }));

    // Create the order and items inside a transaction
    const newOrder = await db.order.create({
      data: {
        number,
        userId: userId || null,
        guestName: userId ? null : guestName || null,
        guestEmail: userId ? null : guestEmail || null,
        guestPhone: userId ? null : guestPhone || null,
        subtotal,
        shipping,
        discount,
        total,
        paymentMethod,
        paymentStatus: paymentStatus || "PENDING",
        shippingName,
        shippingPhone,
        shippingAddress,
        shippingCity,
        shippingNotes: shippingNotes || null,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET orders (either list for user, or check single tracking order)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const orderIdOrNumber = searchParams.get("id") || searchParams.get("number");

    if (orderIdOrNumber) {
      // Find single order for tracking
      const order = await db.order.findFirst({
        where: {
          OR: [
            { id: orderIdOrNumber },
            { number: orderIdOrNumber },
          ],
        },
        include: {
          items: true,
        },
      });

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ order });
    }

    if (userId) {
      // Find all orders for user
      const orders = await db.order.findMany({
        where: { userId },
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({ orders });
    }

    return NextResponse.json(
      { error: "Missing parameters. Provide userId or order number." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Order query error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
