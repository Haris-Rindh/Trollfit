import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-sfpy-signature");
    
    // Read raw body for signature verification
    const rawBody = await req.text();
    console.log("Safepay Webhook received. Raw Body:", rawBody);

    const webhookSecret = process.env.SAFEPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      // Perform signature verification
      const hmac = crypto.createHmac("sha256", webhookSecret);
      hmac.update(rawBody);
      const computedSignature = hmac.digest("hex");

      if (computedSignature !== signature) {
        console.warn("Safepay Webhook signature verification failed!");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 }
      );
      }
      console.log("Safepay Webhook signature verified successfully!");
    } else {
      console.log("Safepay Webhook: Bypassing signature verification (webhook secret or signature missing)");
    }

    // Parse the body
    const payload = JSON.parse(rawBody);
    
    // Safepay webhook payload usually has the tracker token or order_id
    const orderId = payload.order_id || payload.data?.order_id;
    const tracker = payload.tracker || payload.data?.tracker;
    const success = payload.state === "completed" || payload.data?.state === "completed" || payload.state === "paid" || payload.data?.state === "paid";

    console.log(`Processing webhook: OrderId=${orderId}, Tracker=${tracker}, Success=${success}`);

    if (orderId && success) {
      // Find and update order status in database
      const order = await db.order.findUnique({
        where: { number: orderId },
      });

      if (order) {
        await db.order.update({
          where: { number: orderId },
          data: {
            status: "CONFIRMED",
            paymentStatus: "PAID",
          },
        });
        console.log(`Order ${orderId} successfully marked as PAID/CONFIRMED via Webhook`);
      } else {
        console.warn(`Order ${orderId} not found in database for webhook update`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Safepay Webhook Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
