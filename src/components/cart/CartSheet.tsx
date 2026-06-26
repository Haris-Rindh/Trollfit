"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";

export function CartSheet() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, totalItems, subtotal, shipping, total } =
    useCartStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Cart panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col border-l border-white/5 bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">Your Cart</h2>
                {totalItems() > 0 && (
                  <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {totalItems()}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="rounded-full bg-muted p-6">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="mb-1 text-lg font-semibold">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">
                      Add some fire fits to get started 🔥
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => {
                      const price = item.product.salePrice || item.product.price;
                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                          className="flex gap-4 rounded-xl border border-white/5 bg-card p-3"
                        >
                          {/* Product Image */}
                          <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {item.product.images[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <h3 className="text-sm font-semibold leading-tight line-clamp-2">
                                {item.product.name}
                              </h3>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                Size: {item.size}
                                {item.color && ` • Color: ${item.color}`}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              {/* Quantity */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 transition-colors hover:bg-white/10"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="flex h-7 w-8 items-center justify-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 transition-colors hover:bg-white/10"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              {/* Price & Remove */}
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold">
                                  Rs. {(price * item.quantity).toLocaleString()}
                                </span>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-muted-foreground transition-colors hover:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="border-t border-white/5 px-6 py-4">
                {/* Summary */}
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>Rs. {subtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping() === 0 ? "text-emerald-400" : ""}>
                      {shipping() === 0
                        ? "FREE"
                        : `Rs. ${shipping().toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2 text-base font-bold">
                    <span>Total</span>
                    <span>Rs. {total().toLocaleString()}</span>
                  </div>
                </div>

                {/* Free shipping progress */}
                {shipping() > 0 && (
                  <div className="mb-4">
                    <p className="mb-1.5 text-xs text-muted-foreground">
                      Add Rs. {(3000 - subtotal()).toLocaleString()} more for{" "}
                      <span className="text-emerald-400">FREE shipping</span>
                    </p>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((subtotal() / 3000) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* Checkout button */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <p className="mt-3 text-center text-[10px] text-muted-foreground">
                  🔒 Secure checkout • Cash on Delivery available
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
