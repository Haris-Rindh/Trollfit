"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useUIStore } from "@/store/ui-store";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, selectedSize);
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-card transition-all duration-500 hover:border-primary/20 hover:shadow-[0_8px_40px_rgba(168,85,247,0.1)] ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {/* Primary Image */}
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-card">
              <div className="text-center text-muted-foreground/30">
                <ShoppingBag className="mx-auto mb-2 h-12 w-12" />
                <span className="text-xs">{product.name}</span>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Monogram Watermark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHovered ? { opacity: 0.15, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img src="/monogram.png" alt="TF Watermark" className="h-48 w-48 object-contain" />
            </motion.div>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4" />
              Quick Add
            </motion.button>
          </motion.div>

          {/* Badges */}
          <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
            {product.isNew && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                New
              </span>
            )}
            {hasDiscount && (
              <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                -{discountPercent}%
              </span>
            )}
            {product.trending && (
              <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                🔥 Hot
              </span>
            )}
            {product.totalStock <= 10 && product.totalStock > 0 && (
              <span className="rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                Low Stock
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                wishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-white"
              }`}
            />
          </button>

          {/* Quick view on mobile */}
          <motion.div
            className="absolute bottom-3 right-3 z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <Eye className="h-4 w-4 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {product.category.name}
            </p>
          )}

          {/* Name */}
          <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-tight tracking-tight transition-colors group-hover:text-primary">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg font-black text-foreground">
              Rs. {price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Sizes Preview */}
          <div className="flex flex-wrap gap-1">
            {product.sizes.slice(0, 5).map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`rounded-md border px-2 py-0.5 text-[10px] font-medium transition-all ${
                  selectedSize === size
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-white/10 text-muted-foreground hover:border-white/30"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Rating */}
          {product.averageRating && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-yellow-500">★</span>
              <span>{product.averageRating}</span>
              <span>({product.reviewCount})</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Skeleton ────────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
      <div className="aspect-[3/4] animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 w-8 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
