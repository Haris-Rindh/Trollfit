import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, orderId } = await req.json();

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: "Amount and Order ID are required" },
        { status: 400 }
      );
    }

    const safepayApiKey = process.env.SAFEPAY_API_KEY;
    if (!safepayApiKey) {
      return NextResponse.json(
        { error: "Safepay API Key is missing in environment variables" },
        { status: 500 }
      );
    }

    // Safepay expects amount in lowest denomination (Paise for PKR, e.g. amount * 100)
    const amountInPaise = Math.round(Number(amount) * 100);

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
    console.log("Safepay API Response:", sessionData);

    if (!sessionRes.ok || !sessionData?.data?.token) {
      return NextResponse.json(
        { error: sessionData?.message || "Failed to initialize Safepay session" },
        { status: 500 }
      );
    }

    const trackerToken = sessionData.data.token;

    // Get origin dynamically from request headers
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Build the checkout redirect URL
    const baseUrl = "https://sandbox.api.getsafepay.com/checkout/pay";
    const redirectUrl = `${origin}/order-success?number=${orderId}&payment=success`;
    const cancelUrl = `${origin}/checkout?payment=cancelled`;

    const checkoutUrl = `${baseUrl}?env=sandbox&beacon=${trackerToken}&client=${safepayApiKey}&order_id=${orderId}&redirect_url=${encodeURIComponent(redirectUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}&source=custom`;

    return NextResponse.json({ checkoutUrl });
  } catch (error: any) {
    console.error("Safepay checkout session error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
