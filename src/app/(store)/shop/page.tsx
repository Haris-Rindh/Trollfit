"use client";

import { useState } from "react";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import { SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShopPage() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Filter logic
  let filteredProducts = [...DEMO_PRODUCTS];

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter((p) => p.categoryId === selectedCategory);
  }

  if (selectedSize) {
    filteredProducts = filteredProducts.filter(
      (p) => p.sizes.includes(selectedSize) && (p.stockBySize?.[selectedSize] ?? 1) > 0
    );
  }

  // Sort logic
  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (sortBy === "newest") {
    filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else {
    // Featured first
    filteredProducts.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">ALL DROPS</h1>
          <p className="mt-2 text-muted-foreground">Premium streetwear for the culture.</p>
        </div>
        
        {/* Mobile Filter Toggle & Desktop Sort */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          
          <div className="hidden items-center gap-2 md:flex">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden w-64 shrink-0 md:block">
          <FilterSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs border-l border-border bg-background p-6 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="rounded-full bg-muted p-2"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6">
                <span className="mb-2 block text-sm font-semibold text-muted-foreground">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Drops</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <FilterSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />
              
              <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background p-4">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
