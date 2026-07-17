"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight, Tag, Loader2 } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import type { Product } from "@/types";

// ─── Search Logic ────────────────────────────────────────
function searchProducts(query: string): Product[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return DEMO_PRODUCTS.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(q);
    const descMatch = p.description.toLowerCase().includes(q);
    const shortDescMatch = p.shortDesc?.toLowerCase().includes(q) ?? false;
    const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
    return nameMatch || descMatch || shortDescMatch || tagMatch;
  });
}

// ─── Quick-tag suggestions ───────────────────────────────
const QUICK_TAGS = [
  "anime",
  "meme",
  "oversized",
  "gojo",
  "sigma",
  "naruto",
  "retro",
  "trending",
];

export function SearchModal() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Debouncing query updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  const results = searchProducts(debouncedQuery);
  const hasQuery = query.trim().length > 0;
  const isSearching = query.trim() !== debouncedQuery.trim();

  // Autofocus when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    } else {
      setQuery("");
      setDebouncedQuery("");
    }
  }, [isSearchOpen]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    },
    [closeSearch],
  );

  useEffect(() => {
    if (isSearchOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isSearchOpen, handleKeyDown]);

  const handleResultClick = () => {
    closeSearch();
    setQuery("");
    setDebouncedQuery("");
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSearch}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            key="search-panel"
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="fixed left-0 right-0 top-0 z-[70] mx-auto flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-b-3xl border-b border-x border-white/10 bg-background shadow-2xl shadow-black/50 sm:top-8 sm:rounded-3xl"
          >
            {/* Search Input Row */}
            <div className="flex items-center gap-4 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
              <Search className="h-5 w-5 shrink-0 text-primary" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for tees, anime, memes..."
                className="flex-1 bg-transparent text-lg font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                onClick={closeSearch}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {hasQuery ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="p-4 sm:p-6"
                  >
                    {isSearching ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-3 text-sm text-muted-foreground">Searching...</p>
                      </div>
                    ) : results.length > 0 ? (
                      <>
                        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{debouncedQuery}&quot;
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {results.map((product, i) => (
                            <SearchResultCard
                              key={product.id}
                              product={product}
                              index={i}
                              onClick={handleResultClick}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <NoResults query={debouncedQuery} />
                    )}
                  </motion.div>
                ) : (
                  /* Suggestions empty state */
                  <motion.div
                    key="suggestions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="p-5 sm:p-6"
                  >
                    <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Popular searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-sm font-medium text-foreground/70 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </button>
                      ))}
                    </div>

                    {/* Trending previews */}
                    <p className="mb-4 mt-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Trending now 🔥
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {DEMO_PRODUCTS.filter((p) => p.trending)
                        .slice(0, 3)
                        .map((product, i) => (
                          <SearchResultCard
                            key={product.id}
                            product={product}
                            index={i}
                            onClick={handleResultClick}
                          />
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[11px] text-muted-foreground sm:px-6">
              <span>
                Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">ESC</kbd> to close
              </span>
              <Link
                href="/products"
                onClick={handleResultClick}
                className="flex items-center gap-1 font-semibold text-primary transition-opacity hover:opacity-80"
              >
                Browse all products <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Search Result Card ───────────────────────────────────
function SearchResultCard({
  product,
  index,
  onClick,
}: {
  product: Product;
  index: number;
  onClick: () => void;
}) {
  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <Link
        href={`/products/${product.slug}`}
        onClick={onClick}
        className="group flex flex-col overflow-hidden rounded-xl border border-white/5 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(168,85,247,0.12)]"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 40vw, 200px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-card">
              <span className="text-2xl">👕</span>
            </div>
          )}
          {hasDiscount && (
            <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-bold uppercase text-white">
              Sale
            </span>
          )}
          {product.isNew && !hasDiscount && (
            <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase text-primary-foreground">
              New
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-2.5">
          <p className="line-clamp-2 text-xs font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-xs font-black text-foreground">
              Rs. {price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-muted-foreground line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── No Results ────────────────────────────────────────────
function NoResults({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center py-12 text-center"
    >
      <span className="mb-4 text-5xl">🔍</span>
      <p className="mb-2 text-lg font-bold text-foreground">
        No results for &quot;{query}&quot;
      </p>
      <p className="max-w-xs text-sm text-muted-foreground">
        We couldn't find any TrollFit pieces matching your search. Try a different keyword like "anime", "meme", or "oversized".
      </p>
      <Link
        href="/products"
        className="mt-6 flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Browse All Drops <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}
