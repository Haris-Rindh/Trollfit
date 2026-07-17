import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const limiter = rateLimit(ip, 10, 60 * 1000); // Prevent checkout flood

    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Secure Price Integrity: Fetch the real order total from the database instead of trusting client input
    const order = await db.order.findUnique({
      where: { number: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found in database" },
        { status: 404 }
      );
    }

    const amount = Number(order.total);

    const safepayApiKey = process.env.SAFEPAY_API_KEY;
    if (!safepayApiKey) {
      return NextResponse.json(
        { error: "Payment gateway key is not configured" },
        { status: 500 }
      );
    }

    // Safepay expects amount in lowest denomination (Paise for PKR, e.g. amount * 100)
    const amountInPaise = Math.round(amount * 100);

    // Call Safepay API to create tracker/session
    console.log("Initializing Safepay tracker for order:", orderId, "Amount (paise):", amountInPaise);
    const sessionRes = await fetch("https://sandbox.api.getsafepay.com/checkout/v1/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant_api_key: safepayApiKey,
        intent: "CYBERSOURCE",
        mode: "payment",
        currency: "PKR",
        amount: amountInPaise,
      }),
    });

    const sessionData = await sessionRes.json();

    if (!sessionRes.ok || !sessionData?.data?.token) {
      return NextResponse.json(
        { error: sessionData?.message || "Failed to initialize payment session" },
        { status: 500 }
      );
    }

    const trackerToken = sessionData.data.token;

    // Open Redirect Mitigation: whitelist allowed redirect origins
    const requestOrigin = req.headers.get("origin") || "";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    
    const allowedOrigins = [
      "http://localhost:3000",
      "https://trollfit.pk",
      "https://www.trollfit.pk",
      siteUrl,
    ];

    const safeOrigin = allowedOrigins.includes(requestOrigin) ? requestOrigin : siteUrl;

    // Build the checkout redirect URL
    const baseUrl = "https://sandbox.api.getsafepay.com/checkout/pay";
    const redirectUrl = `${safeOrigin}/order-success?number=${orderId}&payment=success`;
    const cancelUrl = `${safeOrigin}/checkout?payment=cancelled`;

    const checkoutUrl = `${baseUrl}?env=sandbox&beacon=${trackerToken}&client=${safepayApiKey}&order_id=${orderId}&redirect_url=${encodeURIComponent(redirectUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}&source=custom`;

    return NextResponse.json({ checkoutUrl });
  } catch (error: any) {
    console.error("Safepay checkout session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
