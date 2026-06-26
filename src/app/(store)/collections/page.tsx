"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers, Flame, Star, Sparkles, Tag } from "lucide-react";
import { DEMO_COLLECTIONS } from "@/lib/demo-data";
import type { CollectionType } from "@/types";

// ─── Collection type config ──────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  CollectionType,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  MEME: {
    label: "Meme Drop",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
    icon: <span className="text-base">😂</span>,
  },
  ANIME: {
    label: "Anime",
    color: "text-pink-400",
    bg: "bg-pink-400/10 border-pink-400/20",
    icon: <span className="text-base">⚡</span>,
  },
  OVERSIZED: {
    label: "Oversized",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
    icon: <Layers className="h-3.5 w-3.5" />,
  },
  TRENDING: {
    label: "Trending",
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
    icon: <Flame className="h-3.5 w-3.5" />,
  },
  LIMITED: {
    label: "Limited Edition",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
    icon: <Star className="h-3.5 w-3.5" />,
  },
  STREETWEAR: {
    label: "Streetwear",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
    icon: <Tag className="h-3.5 w-3.5" />,
  },
  CUSTOM: {
    label: "Custom",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/20",
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
};

// ─── Animation variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CollectionsPage() {
  const allCollections = DEMO_COLLECTIONS;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/50 py-20 md:py-28">
        {/* Ambient gradient blobs */}
        <div
          className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)",
          }}
        />
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            className="text-center"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.div
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                TrollFit Universe
              </span>
            </motion.div>

            {/* Main heading */}
            <h1 className="mb-5 text-5xl font-black uppercase tracking-tight text-foreground md:text-7xl lg:text-8xl">
              ALL{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                }}
              >
                COLLECTIONS
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-base text-muted-foreground md:text-lg">
              From viral memes to anime legends — we've got every vibe covered.
              Cop what speaks to your soul. 🔥
            </p>

            {/* Stats row */}
            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {[
                { label: "Collections", value: DEMO_COLLECTIONS.length },
                { label: "Total Products", value: "80+" },
                { label: "Cities Shipped", value: "All PK" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-black text-primary">{value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Collections Grid ─────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {allCollections.map((collection, index) => {
            const typeConf = TYPE_CONFIG[collection.type] ?? TYPE_CONFIG.CUSTOM;
            const isBig = index === 0;

            return (
              <motion.div
                key={collection.id}
                variants={cardVariants}
                className={isBig ? "sm:col-span-2 lg:col-span-2" : ""}
              >
                <CollectionCard
                  collection={collection}
                  typeConf={typeConf}
                  tall={isBig}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────────────────── */}
      <section className="border-t border-border/50 py-16">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Can&apos;t decide?
          </p>
          <h2 className="mb-6 text-3xl font-black uppercase text-foreground md:text-4xl">
            Browse everything in{" "}
            <span className="text-primary">THE SHOP</span>
          </h2>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

// ─── Collection Card Component ───────────────────────────────────────────────

interface TypeConf {
  label: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
}

function CollectionCard({
  collection,
  typeConf,
  tall = false,
}: {
  collection: (typeof DEMO_COLLECTIONS)[0];
  typeConf: TypeConf;
  tall?: boolean;
}) {
  return (
    <Link href={`/collections/${collection.slug}`} className="group block">
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-white/5 bg-card transition-all duration-500 hover:border-primary/30 hover:shadow-[0_12px_50px_rgba(168,85,247,0.15)]"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── Image ─────────────────────────────────────────────────────────── */}
        <div
          className={`relative w-full overflow-hidden bg-muted ${
            tall ? "aspect-[16/9] sm:aspect-[2/1]" : "aspect-[4/3]"
          }`}
        >
          <Image
            src={collection.image ?? `/images/collections/${collection.slug}.jpg`}
            alt={collection.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)",
            }}
          />

          {/* Type badge */}
          <div className="absolute left-4 top-4 z-10">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm ${typeConf.bg} ${typeConf.color}`}
            >
              {typeConf.icon}
              {typeConf.label}
            </span>
          </div>

          {/* Featured badge */}
          {collection.featured && (
            <div className="absolute right-4 top-4 z-10">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary backdrop-blur-sm">
                <Star className="h-3 w-3" />
                Featured
              </span>
            </div>
          )}

          {/* Product count pill */}
          <div className="absolute bottom-4 left-4 z-10">
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {collection.productCount ?? 0} Products
            </span>
          </div>
        </div>

        {/* ── Content ───────────────────────────────────────────────────────── */}
        <div className="flex items-end justify-between gap-4 p-5">
          <div className="min-w-0 flex-1">
            <h2 className="mb-1.5 truncate text-xl font-black uppercase tracking-tight text-foreground transition-colors group-hover:text-primary">
              {collection.name}
            </h2>
            {collection.description && (
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {collection.description}
              </p>
            )}
          </div>

          {/* Arrow CTA */}
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-white/5 px-5 py-3">
          <span className="absolute inset-0 flex items-center px-5 text-xs font-semibold uppercase tracking-widest text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View Collection →
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-opacity duration-300 group-hover:opacity-0">
            Tap to explore
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
