import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
  size: z.string(),
  color: z.string().nullable().optional(),
});

const createOrderSchema = z.object({
  number: z.string(),
  userId: z.string().nullable().optional(),
  guestName: z.string().nullable().optional(),
  guestEmail: z.string().email("Invalid email").nullable().optional(),
  guestPhone: z.string().nullable().optional(),
  paymentMethod: z.enum(["COD", "JAZZCASH", "EASYPAISA", "SAFEPAY"]),
  shippingName: z.string().min(1, "Name is required"),
  shippingPhone: z.string().min(5, "Phone is required"),
  shippingAddress: z.string().min(1, "Address is required"),
  shippingCity: z.string().min(1, "City is required"),
  shippingNotes: z.string().nullable().optional(),
  couponCode: z.string().nullable().optional(),
  items: z.array(orderItemSchema).min(1),
});

async function getSession(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader
    ?.split("; ")
    .find((row) => row.startsWith("trollfit-session="))
    ?.split("=")[1];

  if (!token) return null;
  return await verifyJWT(token);
}

// CREATE order
export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const limiter = rateLimit(ip, 10, 60 * 1000); // Limit order floods

    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    const session = await getSession(req);
    const body = await req.json();
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const orderData = result.data;

    // Secure authentication check: if userId is supplied, it must match session
    if (orderData.userId && (!session || session.userId !== orderData.userId)) {
      return NextResponse.json(
        { error: "Unauthorized user ID in order placement" },
        { status: 403 }
      );
    }

    // Run transaction for database integrity
    const newOrder = await db.$transaction(async (tx) => {
      let subtotalAccumulator = 0;
      const orderItemsToCreate = [];

      for (const item of orderData.items) {
        // Fetch product from DB (pricing source of truth)
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.published) {
          throw new Error(`Product not found or unavailable`);
        }

        // Validate size variant and stock
        const stockMap = product.stockBySize as Record<string, number>;
        const sizeStock = stockMap[item.size] || 0;

        if (sizeStock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name} (Size: ${item.size})`);
        }

        // Deduct stock in DB
        stockMap[item.size] = sizeStock - item.quantity;
        const newTotalStock = product.totalStock - item.quantity;

        await tx.product.update({
          where: { id: product.id },
          data: {
            stockBySize: stockMap,
            totalStock: Math.max(0, newTotalStock),
          },
        });

        const itemPrice = Number(product.salePrice || product.price);
        subtotalAccumulator += itemPrice * item.quantity;

        orderItemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color || null,
          price: itemPrice,
          name: product.name,
          image: product.images[0] || null,
        });
      }

      // Calculate coupon discount
      let calculatedDiscount = 0;
      if (orderData.couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: orderData.couponCode.trim().toUpperCase() },
        });

        if (coupon && coupon.active) {
          const isNotExpired = !coupon.expiresAt || new Date(coupon.expiresAt) > new Date();
          const underUsageLimit = coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit;
          const meetsMinOrder = !coupon.minOrder || subtotalAccumulator >= Number(coupon.minOrder);

          if (isNotExpired && underUsageLimit && meetsMinOrder) {
            if (coupon.type === "PERCENTAGE") {
              calculatedDiscount = Math.round((subtotalAccumulator * Number(coupon.value)) / 100);
            } else {
              calculatedDiscount = Number(coupon.value);
            }

            if (coupon.maxDiscount) {
              calculatedDiscount = Math.min(calculatedDiscount, Number(coupon.maxDiscount));
            }

            // Increment coupon usage
            await tx.coupon.update({
              where: { id: coupon.id },
              data: { usedCount: { increment: 1 } },
            });
          }
        }
      }

      // Shipping calculation
      const calculatedShipping = subtotalAccumulator >= 3000 ? 0 : 200;

      // Final total
      const calculatedTotal = subtotalAccumulator + calculatedShipping - calculatedDiscount;

      // Create actual order record
      const order = await tx.order.create({
        data: {
          number: orderData.number,
          userId: orderData.userId || null,
          guestName: orderData.userId ? null : orderData.guestName || null,
          guestEmail: orderData.userId ? null : orderData.guestEmail || null,
          guestPhone: orderData.userId ? null : orderData.guestPhone || null,
          subtotal: subtotalAccumulator,
          shipping: calculatedShipping,
          discount: calculatedDiscount,
          total: calculatedTotal,
          paymentMethod: orderData.paymentMethod,
          paymentStatus: "PENDING",
          shippingName: orderData.shippingName,
          shippingPhone: orderData.shippingPhone,
          shippingAddress: orderData.shippingAddress,
          shippingCity: orderData.shippingCity,
          shippingNotes: orderData.shippingNotes || null,
          couponCode: orderData.couponCode || null,
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
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

// GET orders (protected)
export async function GET(req: Request) {
  try {
    const session = await getSession(req);
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

      // If owner of order or admin is requesting: return full order payload
      const isOwner = order.userId && session && session.userId === order.userId;
      const isAdmin = session && session.role === "ADMIN";

      if (isOwner || isAdmin) {
        return NextResponse.json({ order });
      }

      // If guest or public tracker: return sanitized order subset to prevent PII leak
      const sanitizedOrder = {
        id: order.id,
        number: order.number,
        status: order.status,
        createdAt: order.createdAt,
        shippingCity: order.shippingCity,
        trackingNumber: order.trackingNumber,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
      };

      return NextResponse.json({ order: sanitizedOrder });
    }

    if (userId) {
      // User must be authenticated to check their own order list
      if (!session || (session.userId !== userId && session.role !== "ADMIN")) {
        return NextResponse.json(
          { error: "Unauthorized access to order history" },
          { status: 403 }
        );
      }

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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
