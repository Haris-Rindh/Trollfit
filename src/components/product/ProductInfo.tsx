"use client";

import { useState } from "react";
import { type Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCcw, Heart } from "lucide-react";
import toast from "react-hot-toast";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  
  const isWishlisted = isInWishlist(product.id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || "");
  const [isAdding, setIsAdding] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const handleWishlistToggle = () => {
    toggleItem(product.id);
    if (isWishlisted) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist! 💖");
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }

    setIsAdding(true);

    // Slight delay for premium feel
    setTimeout(() => {
      addItem(product, selectedSize, selectedColor);
      setIsAdding(false);
      toast.success("Added to cart! 🔥");
      openCart();
    }, 400);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* Header Info */}
        <div>
          {product.featured && (
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3 w-3" />
              PREMIUM DROP
            </div>
          )}
          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-bold">
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span className="mb-1 text-lg text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <p className="mt-6 text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Color Selector */}
        {product.colors.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Color
            </h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-primary scale-110"
                      : "border-transparent hover:border-border"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size Selector */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Size
            </h3>
            <button 
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-xs font-semibold text-primary underline underline-offset-4"
            >
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {product.sizes.map((size) => {
              const stock = product.stockBySize?.[size] || 0;
              const isOutOfStock = stock === 0;

              return (
                <button
                  key={size}
                  disabled={isOutOfStock}
                  onClick={() => setSelectedSize(size)}
                  className={`group relative flex h-12 items-center justify-center rounded-xl border text-sm font-bold transition-all ${
                    isOutOfStock
                      ? "cursor-not-allowed border-border/50 text-muted-foreground/50 bg-muted/10"
                      : selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  {size}
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                      <div className="h-px w-[140%] rotate-45 bg-border/50" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add to Cart & Wishlist Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="group relative flex h-14 flex-1 items-center justify-center overflow-hidden rounded-xl bg-foreground text-background font-bold transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.98] disabled:opacity-80"
          >
            {isAdding ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent"
              />
            ) : (
              <>
                <span className="flex items-center gap-2">
                  ADD TO CART <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white/20 mix-blend-overlay translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
              </>
            )}
          </button>

          <button
            onClick={handleWishlistToggle}
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 transition-all active:scale-95 ${
              isWishlisted
                ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                : "border-border hover:border-primary/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Toggle Wishlist"
          >
            <Heart className={`h-5 w-5 transition-transform ${isWishlisted ? "fill-primary text-primary scale-110" : ""}`} />
          </button>
        </div>

        {/* Value Props */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-border bg-card/50 p-5 text-sm sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
            <Truck className="h-5 w-5 text-primary" />
            <span>Fast Nationwide Delivery</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
            <RefreshCcw className="h-5 w-5 text-primary" />
            <span>7 Days Easy Returns</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>Premium Quality Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsSizeGuideOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-black">Size Guide</h2>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="rounded-full bg-muted p-2 hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 font-bold">Size</th>
                      <th className="p-3 font-bold">Chest (in)</th>
                      <th className="p-3 font-bold">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="p-3 font-semibold">S</td><td className="p-3 text-muted-foreground">38</td><td className="p-3 text-muted-foreground">27</td></tr>
                    <tr><td className="p-3 font-semibold">M</td><td className="p-3 text-muted-foreground">40</td><td className="p-3 text-muted-foreground">28</td></tr>
                    <tr><td className="p-3 font-semibold">L</td><td className="p-3 text-muted-foreground">42</td><td className="p-3 text-muted-foreground">29</td></tr>
                    <tr><td className="p-3 font-semibold">XL</td><td className="p-3 text-muted-foreground">44</td><td className="p-3 text-muted-foreground">30</td></tr>
                    <tr><td className="p-3 font-semibold">2XL</td><td className="p-3 text-muted-foreground">46</td><td className="p-3 text-muted-foreground">31</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-muted-foreground text-center">
                Measurements are approximate and may vary slightly. Fits true to size. For an oversized look, we recommend sizing up.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
