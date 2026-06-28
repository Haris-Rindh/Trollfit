"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Truck, MapPin, ArrowRight, Copy, Check } from "lucide-react";

function generateOrderNumber() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = Math.floor(Math.random() * 999).toString().padStart(3, "0");
  return `TF-${date}-${random}`;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderParam = searchParams.get("order");
  const [orderNumber, setOrderNumber] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderParam) {
      setOrderNumber(orderParam);
    } else {
      setOrderNumber(generateOrderNumber());
    }
  }, [orderParam]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { icon: CheckCircle2, label: "Order Confirmed", desc: "We've received your order", done: true },
    { icon: Package, label: "Processing", desc: "Being packed with care", done: false },
    { icon: Truck, label: "Shipped", desc: "On the way to you", done: false },
    { icon: MapPin, label: "Delivered", desc: "At your doorstep", done: false },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="mb-8 flex justify-center"
      >
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-primary/20">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
          <CheckCircle2 className="h-16 w-16 text-primary" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h1 className="text-4xl font-black tracking-tight">ORDER PLACED! 🔥</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Your drip is on its way. We'll call you before delivery.
        </p>

        {/* Order number */}
        <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Order Number
            </p>
            <p className="text-2xl font-black text-primary">{orderNumber}</p>
          </div>
          <button
            onClick={copyOrderNumber}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 transition-all hover:bg-primary/30"
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4 text-primary" />
            )}
          </button>
        </div>

        {/* What's next */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-left">
          <h2 className="mb-6 text-lg font-bold">What happens next?</h2>
          <div className="space-y-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${step.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`mt-1 h-10 w-px ${step.done ? "bg-primary/40" : "bg-border"}`} />
                    )}
                  </div>
                  <div className="pb-6 pt-1">
                    <p className={`font-semibold ${step.done ? "text-primary" : "text-foreground"}`}>
                      {step.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COD reminder */}
        <div className="mt-6 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
          <p className="text-sm font-semibold text-amber-400">💵 Cash on Delivery</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please keep the exact amount ready. Our rider will collect payment upon delivery.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-primary-foreground transition-all hover:bg-primary/90"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/track-order?order=${orderNumber}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3.5 font-bold transition-all hover:bg-muted"
          >
            Track Order
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Questions? Reach us on{" "}
          <a href="https://wa.me/923001234567" className="text-primary underline underline-offset-4">
            WhatsApp
          </a>
        </p>
      </motion.div>
    </div>
  );
}
