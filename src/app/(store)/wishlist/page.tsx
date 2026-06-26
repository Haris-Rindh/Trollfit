"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import { ProductCard } from "@/components/shared/ProductCard";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const wishlistProducts = DEMO_PRODUCTS.filter((p) => items.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            MY WISHLIST
          </h1>
          <p className="mt-2 text-muted-foreground">
            {items.length > 0
              ? `${items.length} item${items.length > 1 ? "s" : ""} saved`
              : "Nothing saved yet"}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:border-red-500/50 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {items.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Your wishlist is empty</h2>
            <p className="mb-8 max-w-sm text-muted-foreground">
              Save your favourite drops here. Tap the heart icon on any product to add it.
            </p>
            <Link
              href="/shop"
              className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-primary-foreground transition-all hover:bg-primary/90"
            >
              <ShoppingBag className="h-4 w-4" />
              Explore Drops
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {wishlistProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
