"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export function OrderSummary() {
  const { items, subtotal: getSubtotal, couponDiscount, couponCode } = useCartStore();

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 3000 ? 0 : 200;
  const total = subtotal + shippingFee - couponDiscount;

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm lg:p-8">
      <h2 className="mb-6 text-lg font-bold uppercase tracking-wide">Order Summary</h2>
      
      {/* Items List */}
      <div className="mb-8 flex max-h-[40vh] flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                  No Image
                </div>
              )}
              <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                {item.quantity}
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="line-clamp-1 text-sm font-bold">{item.product.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Size: {item.size} {item.color && `| Color: ${item.color}`}
              </p>
              <p className="mt-1 text-sm font-semibold">
                {formatPrice(Number(item.product.salePrice || item.product.price))}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-4 border-t border-border pt-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-semibold">
            {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
          </span>
        </div>

        {couponCode && couponDiscount > 0 && (
          <div className="flex justify-between text-sm text-emerald-400">
            <span>Discount ({couponCode})</span>
            <span className="font-semibold">-{formatPrice(couponDiscount)}</span>
          </div>
        )}

        <div className="mt-4 border-t border-border pt-4">
          <div className="flex justify-between">
            <span className="text-lg font-black uppercase">Total</span>
            <span className="text-2xl font-black text-primary">{formatPrice(total)}</span>
          </div>
          <p className="mt-1 text-right text-xs text-muted-foreground">
            Includes all taxes
          </p>
        </div>
      </div>
    </div>
  );
}
