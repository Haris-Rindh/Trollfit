"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { DEMO_REVIEWS } from "@/lib/demo-data";
import { Star, Quote, Users, Award, ThumbsUp } from "lucide-react";

const STATS = [
  { icon: Users, value: "10,000+", label: "Happy Customers" },
  { icon: Award, value: "4.9★", label: "Average Rating" },
  { icon: ThumbsUp, value: "500+", label: "5-Star Reviews" },
];

export function SocialProof() {
  return (
    <section id="social-proof" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
            Customer Love
          </span>
          <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            Don&apos;t Take Our Word For It
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Real reviews from real trolls. See why thousands trust TrollFit.
          </p>
        </ScrollReveal>

        {/* Stats */}
        <StaggerContainer className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
          {STATS.map((stat) => (
            <StaggerItem key={stat.label}>
              <motion.div
                whileHover={{ y: -4 }}
                className="flex flex-col items-center rounded-2xl border border-white/5 bg-card p-6 text-center transition-all hover:border-primary/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
              >
                <stat.icon className="mb-3 h-6 w-6 text-primary" />
                <AnimatedCounter value={stat.value} />
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Reviews Grid */}
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {DEMO_REVIEWS.map((review) => (
            <StaggerItem key={review.id}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-card via-card/90 to-background p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_4px_30px_rgba(168,85,247,0.15)]"
              >
                {/* Quote icon */}
                <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10 transition-colors group-hover:text-primary/20" />

                {/* Stars */}
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="mb-4 text-sm leading-relaxed text-foreground/80">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Reviewer */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground">
                    {review.userName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.userName}</p>
                    {review.verified && (
                      <p className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Verified Purchase
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom glow */}
                <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 group-hover:w-full" />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── Animated Counter ────────────────────────────────────

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-2xl font-black text-foreground sm:text-3xl"
    >
      {value}
    </motion.span>
  );
}
