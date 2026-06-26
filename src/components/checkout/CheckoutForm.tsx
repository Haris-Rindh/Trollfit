"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import toast from "react-hot-toast";
import { Banknote, ShieldCheck, MapPin, User, Phone } from "lucide-react";
import { motion } from "framer-motion";

export function CheckoutForm() {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
      toast.success("Order Placed Successfully!");
      router.push("/");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Contact & Shipping */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wide">Shipping Information</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="text"
                placeholder="Ali Khan"
                className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="tel"
                placeholder="0300 1234567"
                pattern="[0-9]*"
                className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Complete Address *
            </label>
            <textarea
              required
              rows={3}
              placeholder="House #, Street #, Phase/Block, Area"
              className="w-full rounded-xl border border-border bg-card p-4 outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              City *
            </label>
            <input
              required
              type="text"
              placeholder="Karachi, Lahore, Islamabad, etc."
              className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Payment Method */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Banknote className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wide">Payment Method</h2>
        </div>

        <div className="relative overflow-hidden rounded-xl border-2 border-primary bg-primary/5 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              </div>
              <span className="font-bold">Cash on Delivery (COD)</span>
            </div>
            <Banknote className="h-6 w-6 text-primary" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Pay with cash directly to the rider upon receiving your parcel. No hidden fees.
          </p>
        </div>
      </section>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/30 py-3 text-sm text-muted-foreground">
        <ShieldCheck className="h-4 w-4" />
        <span>Your information is safely encrypted and secure.</span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground font-bold transition-all active:scale-[0.98] disabled:opacity-80"
      >
        {isSubmitting ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"
          />
        ) : (
          "CONFIRM ORDER"
        )}
      </button>
    </form>
  );
}
