"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 rounded-full bg-muted p-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-3xl font-black">YOUR CART IS EMPTY</h1>
        <p className="mb-8 text-muted-foreground">
          Looks like you haven't added any drops to your cart yet.
        </p>
        <Link
          href="/shop"
          className="rounded-xl bg-primary px-8 py-4 font-bold text-primary-foreground transition-all hover:bg-primary/90"
        >
          EXPLORE DROPS
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">SECURE CHECKOUT</h1>
        <img src="/logo.png" alt="TrollFit Logo" className="h-10 w-28 object-cover object-center hidden sm:block invert dark:invert-0 mix-blend-multiply dark:mix-blend-screen" />
      </div>
      <div className="flex flex-col-reverse gap-12 lg:flex-row lg:gap-16">
        {/* Left Column: Form */}
        <div className="flex-1">
          <CheckoutForm />
        </div>
        
        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-[400px] xl:w-[450px]">
          <div className="sticky top-24">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
