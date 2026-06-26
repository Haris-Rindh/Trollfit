import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, Layers, Flame, Star, Sparkles, Tag, ShoppingBag } from "lucide-react";
import { DEMO_PRODUCTS, DEMO_COLLECTIONS } from "@/lib/demo-data";
import { ProductCard } from "@/components/shared/ProductCard";
import type { CollectionType } from "@/types";

// ─── Type config (server-safe, no JSX icons) ────────────────────────────────

const TYPE_LABELS: Record<CollectionType, string> = {
  MEME: "😂 Meme Drop",
  ANIME: "⚡ Anime",
  OVERSIZED: "Oversized",
  TRENDING: "🔥 Trending",
  LIMITED: "⭐ Limited Edition",
  STREETWEAR: "Streetwear",
  CUSTOM: "Custom",
};

const TYPE_COLORS: Record<CollectionType, string> = {
  MEME: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  ANIME: "text-pink-400 border-pink-400/30 bg-pink-400/10",
  OVERSIZED: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  TRENDING: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  LIMITED: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  STREETWEAR: "text-green-400 border-green-400/30 bg-green-400/10",
  CUSTOM: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
};

const TYPE_GRADIENT: Record<CollectionType, string> = {
  MEME: "from-yellow-500/20 via-transparent to-transparent",
  ANIME: "from-pink-500/20 via-purple-500/10 to-transparent",
  OVERSIZED: "from-blue-500/20 via-transparent to-transparent",
  TRENDING: "from-orange-500/20 via-red-500/10 to-transparent",
  LIMITED: "from-purple-500/25 via-violet-500/10 to-transparent",
  STREETWEAR: "from-green-500/20 via-transparent to-transparent",
  CUSTOM: "from-cyan-500/20 via-transparent to-transparent",
};

// ─── Page ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionSlugPage({ params }: PageProps) {
  const { slug } = await params;

  // Find the matching collection
  const collection = DEMO_COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) notFound();

  // Filter products belonging to this collection
  const products = DEMO_PRODUCTS.filter(
    (p) => p.collectionId === collection.id && p.published
  );

  const typeLabel = TYPE_LABELS[collection.type] ?? collection.type;
  const typeColor = TYPE_COLORS[collection.type] ?? "text-primary border-primary/30 bg-primary/10";
  const typeGradient = TYPE_GRADIENT[collection.type] ?? "from-primary/20 via-transparent to-transparent";

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] overflow-hidden lg:min-h-[70vh]">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={
              collection.image ??
              `/images/collections/${collection.slug}.jpg`
            }
            alt={collection.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Multi-layer overlay */}
          <div className="absolute inset-0 bg-black/60" />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${typeGradient}`}
          />
          {/* Bottom fade into background */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Ambient glow blob */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.8) 0%, transparent 70%)",
          }}
        />

        {/* ── Hero Content ──────────────────────────────────────────────────── */}
        <div className="container relative z-10 mx-auto flex min-h-[60vh] flex-col justify-end px-4 pb-16 pt-24 lg:min-h-[70vh]">
          {/* Back link */}
          <Link
            href="/collections"
            className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 backdrop-blur-sm transition-all hover:border-white/30 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Collections
          </Link>

          {/* Type badge */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${typeColor}`}
            >
              {typeLabel}
            </span>
          </div>

          {/* Collection name */}
          <h1 className="mb-4 max-w-3xl text-5xl font-black uppercase leading-none tracking-tight text-white md:text-7xl lg:text-8xl">
            {collection.name}
          </h1>

          {collection.description && (
            <p className="max-w-xl text-base text-white/70 md:text-lg">
              {collection.description}
            </p>
          )}

          {/* Meta pills */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
              <Package className="h-4 w-4 text-primary" />
              <span className="font-semibold">{products.length}</span>
              <span className="text-white/50">
                {products.length === 1 ? "product" : "products"} in this drop
              </span>
            </div>
            {collection.featured && (
              <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-4 py-2 text-sm text-primary backdrop-blur-sm">
                <Star className="h-4 w-4" />
                Featured Collection
              </div>
            )}
            {collection.type === "LIMITED" && (
              <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                While stocks last
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Products Grid ─────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 pb-20 pt-8">
        {products.length > 0 ? (
          <>
            {/* Section header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {collection.name}
                </p>
                <h2 className="text-2xl font-black uppercase text-foreground">
                  {products.length} Drop{products.length !== 1 ? "s" : ""} 🔥
                </h2>
              </div>

              {/* Sort pill (visual only for now) */}
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-xs text-muted-foreground">Sort by:</span>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Newest
                </span>
              </div>
            </div>

            {/* Product cards grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          /* ── Empty State ────────────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="mb-2 text-2xl font-black uppercase text-foreground">
              Coming Soon
            </h3>
            <p className="mb-8 max-w-sm text-sm text-muted-foreground">
              This collection is being restocked with fire pieces. Stay tuned —
              something big is dropping. 👀
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse Other Collections
            </Link>
          </div>
        )}
      </section>

      {/* ── Cross-sell: Other Collections ─────────────────────────────────── */}
      {products.length > 0 && (
        <section className="border-t border-border/50 bg-card/30 py-14">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-black uppercase text-foreground">
                More Collections
              </h3>
              <Link
                href="/collections"
                className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {DEMO_COLLECTIONS.filter((c) => c.id !== collection.id).map(
                (col) => (
                  <Link
                    key={col.id}
                    href={`/collections/${col.slug}`}
                    className="group flex-shrink-0"
                  >
                    <div className="relative h-28 w-44 overflow-hidden rounded-xl border border-white/5 bg-muted transition-all hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(168,85,247,0.15)]">
                      <Image
                        src={
                          col.image ??
                          `/images/collections/${col.slug}.jpg`
                        }
                        alt={col.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="176px"
                      />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="absolute inset-0 flex items-end p-2.5">
                        <span className="text-xs font-bold uppercase leading-tight text-white transition-colors group-hover:text-primary">
                          {col.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Static params (optional but good for SSG) ──────────────────────────────

export async function generateStaticParams() {
  return DEMO_COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const collection = DEMO_COLLECTIONS.find((c) => c.slug === slug);

  if (!collection) {
    return { title: "Collection Not Found | TrollFit" };
  }

  return {
    title: `${collection.name} | TrollFit`,
    description:
      collection.description ??
      `Shop the ${collection.name} collection at TrollFit — Pakistan's boldest streetwear brand.`,
  };
}
