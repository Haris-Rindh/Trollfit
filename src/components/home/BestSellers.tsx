"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ProductCard } from "@/components/shared/ProductCard";
import { DEMO_PRODUCTS } from "@/lib/demo-data";

export function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const bestSellers = DEMO_PRODUCTS.filter(
    (p) => (p.reviewCount ?? 0) > 50
  ).slice(0, 8);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="best-sellers"
      className="relative py-24 md:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="mb-12 flex items-end justify-between md:mb-16">
          <div>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
              Fan Favorites
            </span>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Best{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sellers
              </span>
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="hidden gap-2 md:flex">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all hover:border-primary/30 hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all hover:border-primary/30 hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <div className="relative">
          {/* Gradient fade edges */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />
          )}

          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-6"
            style={{ scrollbarWidth: "none" }}
          >
            {bestSellers.map((product) => (
              <motion.div
                key={product.id}
                className="w-[260px] shrink-0 snap-start sm:w-[280px] md:w-[300px]"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
