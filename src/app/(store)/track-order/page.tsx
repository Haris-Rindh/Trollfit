"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import {
  Search,
  CheckCircle2,
  Circle,
  Loader2,
  MessageCircle,
  AlertCircle,
  Clock,
  Truck,
  Home,
  Package,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
type StepStatus = "done" | "active" | "pending";

interface TrackingStep {
  label: string;
  description: string;
  status: StepStatus;
  time?: string;
}

function getOrderTracking(orderNumber: string) {
  const order = useAuthStore.getState().getOrderById(orderNumber);
  
  if (order) {
    const steps: TrackingStep[] = [
      {
        label: "Order Confirmed",
        description: "Your order has been placed and payment verified.",
        status: "done",
        time: new Date(order.createdAt).toLocaleString("en-PK", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        label: "Processing",
        description: "Our team is picking and packing your drip.",
        status: order.status === "DELIVERED" || order.status === "SHIPPED" || order.status === "PROCESSING"
          ? "done"
          : (order.status === "CONFIRMED" || order.status === "PENDING" ? "active" : "pending"),
      },
      {
        label: "Shipped",
        description: "Your order is on its way to your city.",
        status: order.status === "DELIVERED" || order.status === "SHIPPED"
          ? "done"
          : (order.status === "PROCESSING" ? "active" : "pending"),
      },
      {
        label: "Delivered",
        description: "Package arrived — time to flex!",
        status: order.status === "DELIVERED"
          ? "done"
          : (order.status === "SHIPPED" ? "active" : "pending"),
      },
    ];

    return {
      orderNumber: order.number,
      status: order.status,
      estimatedDelivery: order.status === "DELIVERED" ? "Delivered" : "2-3 Business Days",
      placedOn: new Date(order.createdAt).toLocaleDateString("en-PK", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      courier: "TCS Express",
      city: order.shippingCity,
      steps,
    };
  }

  return getMockTracking(orderNumber);
}

// ─── Mock data ──────────────────────────────────────────────────────────────
function getMockTracking(orderNumber: string) {
  const steps: TrackingStep[] = [
    {
      label: "Order Confirmed",
      description: "Your order has been placed and payment verified.",
      status: "done",
      time: "Jun 24, 2026  ·  10:32 AM",
    },
    {
      label: "Processing",
      description: "Our team is picking and packing your drip.",
      status: "active",
      time: "Jun 25, 2026  ·  02:15 PM",
    },
    {
      label: "Shipped",
      description: "Your order is on its way to your city.",
      status: "pending",
    },
    {
      label: "Delivered",
      description: "Package arrived — time to flex!",
      status: "pending",
    },
  ];

  return {
    orderNumber,
    status: "PROCESSING",
    estimatedDelivery: "2-3 Business Days",
    placedOn: "Jun 24, 2026",
    courier: "TCS Express",
    city: "Lahore",
    steps,
  };
}

// ─── Step icon ──────────────────────────────────────────────────────────────
function StepIcon({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 z-10">
        <CheckCircle2 className="w-5 h-5 text-white" />
      </div>
    );
  }
  if (status === "active") {
    return (
      <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/20 z-10">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center z-10">
      <Circle className="w-5 h-5 text-muted-foreground" />
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const orderParam = searchParams.get("order");

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof getOrderTracking> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent, targetOrder?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setResult(null);

    const code = (targetOrder || inputValue).trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    if (!code.startsWith("TF-")) {
      setError("Order not found. Please check your order number.");
      return;
    }

    setResult(getOrderTracking(code));
  };

  useEffect(() => {
    if (orderParam) {
      setInputValue(orderParam);
      handleSubmit(undefined, orderParam);
    }
  }, [orderParam]);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[220px] bg-primary/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-full px-4 py-1.5 mb-6 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Order Tracking
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-3">
              Track Your{" "}
              <span className="text-primary">Order</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
              Enter your TrollFit order number below to see where your drip is at 📦
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">

        {/* Search form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError(null);
                  setResult(null);
                }}
                placeholder="TF-20260624-001"
                spellCheck={false}
                autoComplete="off"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground/50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-sm px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary/25 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Track
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2.5 pl-1">
            Format:{" "}
            <span className="font-mono text-primary/80">TF-YYYYMMDD-XXX</span>
            {" "}— found in your order confirmation SMS/email.
          </p>
        </motion.form>

        {/* ── Animated results area ─────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* Error */}
          {error && !result && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              className="flex items-start gap-4 bg-red-500/10 border border-red-500/25 rounded-xl p-5"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-semibold">Order Not Found</p>
                <p className="text-muted-foreground text-sm mt-0.5">{error}</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Double-check your order number — it should start with{" "}
                  <span className="font-mono text-primary/80">TF-</span>.
                </p>
              </div>
            </motion.div>
          )}

          {/* Success */}
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* ── Order summary card ──────────────────────── */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Card top */}
                <div className="bg-gradient-to-r from-primary/20 to-primary/5 border-b border-border px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-0.5">
                      Order Number
                    </p>
                    <p className="font-mono font-bold text-foreground text-xl">
                      {result.orderNumber}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {result.status}
                  </span>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border">
                  {[
                    { label: "Placed On", value: result.placedOn, Icon: Clock },
                    { label: "Est. Delivery", value: result.estimatedDelivery, Icon: Truck },
                    { label: "Courier", value: result.courier, Icon: Package },
                    { label: "Destination", value: result.city, Icon: Home },
                  ].map(({ label, value, Icon }) => (
                    <div key={label} className="bg-card px-5 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1.5">
                        <Icon className="w-3 h-3" />
                        {label}
                      </div>
                      <p className="text-foreground font-semibold text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Step timeline ────────────────────────────── */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-7">
                  Shipment Progress
                </h2>
                <div className="relative">
                  {/* Connector line */}
                  <div className="absolute left-5 top-5 bottom-0 w-px bg-border" />

                  <div className="space-y-0">
                    {result.steps.map((step, idx) => (
                      <motion.div
                        key={step.label}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + idx * 0.1, duration: 0.4 }}
                        className="relative flex gap-5 pb-8 last:pb-0"
                      >
                        <div className="relative flex-shrink-0">
                          <StepIcon status={step.status} />
                        </div>
                        <div className="flex-1 pt-2">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p
                              className={`font-bold text-sm ${
                                step.status === "active"
                                  ? "text-primary"
                                  : step.status === "done"
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </p>
                            {step.status === "active" && (
                              <span className="text-[10px] uppercase tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold border border-primary/20">
                                Active
                              </span>
                            )}
                            {step.status === "done" && (
                              <span className="text-[10px] uppercase tracking-wider bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-bold border border-green-500/20">
                                Done
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                          {step.time && (
                            <p className="text-[11px] text-muted-foreground/50 mt-1 font-mono">
                              {step.time}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Delivery ETA banner ──────────────────────── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-5 py-4"
              >
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">
                  <span className="font-bold text-primary">Estimated Delivery:</span>{" "}
                  {result.estimatedDelivery} — we will SMS you as soon as your package ships! 🚀
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── WhatsApp CTA ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-green-500/15 border border-green-500/25 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-sm">Cannot find your order?</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Reach out to us on WhatsApp — we reply within minutes, no cap.
            </p>
          </div>
          <a
            href="https://wa.me/923001234567?text=Hey%20TrollFit!%20I%20need%20help%20tracking%20my%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-green-500/20"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Us
            <ChevronRight className="w-3 h-3" />
          </a>
        </motion.div>

        {/* ── Footer note ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-muted-foreground space-y-1 pb-4"
        >
          <p>
            Order numbers are in your{" "}
            <span className="text-primary font-medium">confirmation SMS/email</span>.
          </p>
          <p>
            Delivery across Pakistan 🇵🇰 — COD accepted in all major cities.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
