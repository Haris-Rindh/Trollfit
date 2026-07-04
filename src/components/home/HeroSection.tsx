"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { ArrowDown, Sparkles, Zap } from "lucide-react";

const HEADLINES = [
  "WEAR THE INTERNET™",
  "MEMES YOU CAN WEAR",
  "DRIP OR DROWN",
  "BUILT DIFFERENT",
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentHeadline, setCurrentHeadline] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Rotate headlines
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % HEADLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background pt-24 sm:pt-28"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-40 dark:opacity-60"
          style={{ 
            backgroundImage: 'url("/images/hero_bg.png")',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 50%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 50%, transparent 100%)'
          }}
        />
        {/* Edges fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background dark:from-background/80 dark:via-background/60 dark:to-background" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>New Collection Just Dropped</span>
          <Zap className="h-3.5 w-3.5" />
        </motion.div>

        {/* Headline */}
        <div className="mb-6 h-[80px] overflow-hidden sm:h-[100px] md:h-[120px] lg:h-[140px]">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentHeadline}
              initial={{ y: 80, opacity: 0, rotateX: -15 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: -80, opacity: 0, rotateX: 15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl text-foreground drop-shadow-md"
            >
              {HEADLINES[currentHeadline]}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Pakistan&apos;s most viral streetwear brand. Meme tees, anime drops, 
          oversized fits — delivered to your doorstep.{" "}
          <span className="text-primary">Cash on delivery</span> nationwide.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton>
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-8 py-4 text-lg font-bold text-background transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]"
            >
              <span className="relative z-10">SHOP NOW</span>
              <motion.span
                className="relative z-10"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
              <div className="absolute inset-0 -z-0 bg-foreground transition-all duration-500 group-hover:bg-foreground/90" />
            </Link>
          </MagneticButton>

          <MagneticButton>
            <Link
              href="/collections"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-lg font-bold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
            >
              EXPLORE DROPS
              <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
            </Link>
          </MagneticButton>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground sm:gap-12"
        >
          <StatItem value="10K+" label="Happy Customers" />
          <div className="h-8 w-px bg-white/10" />
          <StatItem value="4.9★" label="Avg Rating" />
          <div className="h-8 w-px bg-white/10" />
          <StatItem value="500+" label="Designs" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Scroll
          </span>
          <ArrowDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Floating Elements ───────────────────────────────────

function FloatingElements() {
  const elements = [
    { emoji: "🔥", x: "10%", y: "20%", delay: 0, size: 30 },
    { emoji: "💀", x: "85%", y: "15%", delay: 1, size: 26 },
    { emoji: "⚡", x: "75%", y: "70%", delay: 2, size: 28 },
    { emoji: "🎮", x: "15%", y: "75%", delay: 0.5, size: 24 },
    { emoji: "✨", x: "90%", y: "45%", delay: 1.5, size: 22 },
    { emoji: "🫠", x: "5%", y: "50%", delay: 2.5, size: 24 },
  ];

  return (
    <div className="absolute inset-0 z-[1] hidden md:block">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute select-none"
          style={{ left: el.x, top: el.y, fontSize: el.size }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.5, 1, 1, 0.5],
            y: [0, -20, -10, 0],
          }}
          transition={{
            duration: 6,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {el.emoji}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Stat Item ───────────────────────────────────────────

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold text-foreground sm:text-xl">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
