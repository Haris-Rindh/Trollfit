import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const FALLBACK_COUPONS = {
  TROLL10: { type: "PERCENTAGE", value: 10 },
  MEME20:  { type: "PERCENTAGE", value: 20 },
  DRIP50:  { type: "FIXED",      value: 50 },
  FIRST:   { type: "PERCENTAGE", value: 15 },
};

async function getOrCreateCoupon(code: string) {
  const normalizedCode = code.trim().toUpperCase();
  let coupon = await db.coupon.findUnique({
    where: { code: normalizedCode },
  });

  if (!coupon) {
    const fallback = FALLBACK_COUPONS[normalizedCode as keyof typeof FALLBACK_COUPONS];
    if (fallback) {
      coupon = await db.coupon.create({
        data: {
          code: normalizedCode,
          type: fallback.type as "PERCENTAGE" | "FIXED",
          value: fallback.value,
          active: true,
        },
      });
    }
  }
  return coupon;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await getOrCreateCoupon(code);

    if (!coupon || !coupon.active) {
      return NextResponse.json({ valid: false, error: "Invalid or inactive coupon" }, { status: 200 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, error: "Coupon has expired" }, { status: 200 });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, error: "Coupon usage limit reached" }, { status: 200 });
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type, // "PERCENTAGE" or "FIXED"
        value: Number(coupon.value),
        minOrder: coupon.minOrder ? Number(coupon.minOrder) : null,
        maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
      },
    });
  } catch (error) {
    console.error("Coupon query error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
