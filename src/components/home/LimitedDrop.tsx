"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Clock, Flame, Zap } from "lucide-react";

// Set drop date to 7 days from now for demo
const DROP_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const now = new Date().getTime();
  const diff = target.getTime() - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export function LimitedDrop() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(DROP_DATE));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(DROP_DATE));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <section className="relative py-24 md:py-32">
        <div className="h-[400px] animate-pulse bg-muted/20" />
      </section>
    );
  }

  return (
    <section id="limited-drop" className="relative overflow-hidden py-24 md:py-32">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-accent/5" />
        {/* Border glow */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <ScrollReveal>
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-400"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="h-4 w-4" />
            <span className="font-semibold">Limited Edition Drop</span>
            <Flame className="h-4 w-4" />
          </motion.div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={0.1}>
          <h2 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-primary via-pink-400 to-accent bg-clip-text text-transparent">
              EXCLUSIVE DROP
            </span>
          </h2>
          <p className="mb-10 text-lg text-muted-foreground">
            Once they&apos;re gone, they&apos;re gone forever.
            <br className="hidden sm:block" />
            Don&apos;t be the one who missed out.
          </p>
        </ScrollReveal>

        {/* Countdown */}
        <ScrollReveal delay={0.2}>
          <div className="mb-10 flex items-center justify-center gap-3 sm:gap-5">
            <CountdownUnit value={timeLeft.days} label="Days" />
            <Separator />
            <CountdownUnit value={timeLeft.hours} label="Hours" />
            <Separator />
            <CountdownUnit value={timeLeft.minutes} label="Mins" />
            <Separator />
            <CountdownUnit value={timeLeft.seconds} label="Secs" />
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.3}>
          <MagneticButton>
            <Link
              href="/collections/limited"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_50px_rgba(168,85,247,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span>SHOP BEFORE IT&apos;S GONE</span>
              </span>
              <motion.span
                className="relative z-10"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary via-pink-500 to-accent bg-[length:200%_100%] transition-all duration-700 group-hover:bg-[position:100%_0]" />
            </Link>
          </MagneticButton>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ─── Countdown Unit ──────────────────────────────────────

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-card/80 text-2xl font-black tabular-nums backdrop-blur-sm sm:h-20 sm:w-20 sm:text-3xl"
      >
        {String(value).padStart(2, "0")}
      </motion.div>
      <span className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <div className="flex flex-col gap-1.5 pb-6">
      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
    </div>
  );
}
