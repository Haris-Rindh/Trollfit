"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { DEMO_COLLECTIONS } from "@/lib/demo-data";
import { ArrowRight, Flame, Star, Swords, TrendingUp, Crown } from "lucide-react";

const COLLECTION_ICONS: Record<string, React.ReactNode> = {
  meme: <Flame className="h-5 w-5" />,
  anime: <Swords className="h-5 w-5" />,
  oversized: <Star className="h-5 w-5" />,
  trending: <TrendingUp className="h-5 w-5" />,
  limited: <Crown className="h-5 w-5" />,
};

const COLLECTION_GRADIENTS: Record<string, string> = {
  meme: "from-orange-500/20 to-red-500/20",
  anime: "from-blue-500/20 to-purple-500/20",
  oversized: "from-emerald-500/20 to-teal-500/20",
  trending: "from-primary/20 to-pink-500/20",
  limited: "from-amber-500/20 to-yellow-500/20",
};

export function FeaturedCollections() {
  return (
    <section id="collections" className="relative py-24 md:py-32">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
            Collections
          </span>
          <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            Shop By{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Vibe
            </span>
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            From meme lords to anime fans — find your tribe.
          </p>
        </ScrollReveal>

        {/* Collection Grid */}
        <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 md:gap-6">
          {DEMO_COLLECTIONS.map((collection) => (
            <StaggerItem key={collection.id}>
              <Link href={`/collections/${collection.slug}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex h-[280px] flex-col items-center justify-end overflow-hidden rounded-2xl border border-white/5 bg-card p-6 transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] sm:h-[320px]"
                >
                  {/* Subtle hover background */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  {/* Icon */}
                  <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-primary backdrop-blur-sm transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110"
                      whileHover={{ rotate: 5 }}
                    >
                      {COLLECTION_ICONS[collection.slug] || (
                        <Star className="h-5 w-5" />
                      )}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <h3 className="mb-1 text-lg font-bold tracking-tight">
                      {collection.name}
                    </h3>
                    <p className="mb-3 text-xs text-muted-foreground">
                      {collection.productCount} Products
                    </p>
                    <motion.div
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100"
                      initial={false}
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3" />
                    </motion.div>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 group-hover:w-3/4" />
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
