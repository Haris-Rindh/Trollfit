"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { ProductCard } from "@/components/shared/ProductCard";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import { ArrowRight, Flame } from "lucide-react";

export function TrendingProducts() {
  const trendingProducts = DEMO_PRODUCTS.filter((p) => p.trending).slice(0, 8);

  return (
    <section id="trending" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="mb-12 flex flex-col items-center justify-between gap-4 md:mb-16 md:flex-row">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Trending Now
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              What&apos;s{" "}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Hot
              </span>{" "}
              Right Now
            </h2>
          </div>
          <Link
            href="/shop?sort=trending"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium transition-all hover:border-primary/30 hover:bg-primary/10"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>

        {/* Product Grid */}
        <StaggerContainer className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {trendingProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
