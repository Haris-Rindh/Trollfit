"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Heart } from "lucide-react";

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Unique Designs" },
  { value: "4.9★", label: "Average Rating" },
  { value: "2+", label: "Years Running" },
];

const values = [
  {
    icon: "🎯",
    title: "Premium Quality",
    desc: "We use 240-300GSM premium cotton with HD DTF printing that lasts wash after wash. No compromises.",
  },
  {
    icon: "🌐",
    title: "Internet Culture First",
    desc: "We live on the internet and our designs show it. From viral memes to iconic anime moments — we capture what the culture loves.",
  },
  {
    icon: "🇵🇰",
    title: "Made For Pakistan",
    desc: "Cash on delivery, nationwide shipping, local sizing — we built TrollFit specifically for the Pakistani Gen-Z market.",
  },
];

export function AboutClient() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center bg-background py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary"
          >
            <Zap className="h-3.5 w-3.5" />
            <span className="font-semibold">Pakistan&apos;s Most Viral Streetwear Brand</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl"
          >
            WEAR THE{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              INTERNET™
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-muted-foreground"
          >
            We started as a meme page. Now we&apos;re the tee brand that actually gets it.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-black text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-8 text-4xl font-black tracking-tight">Our Story</h2>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                It started in a Karachi apartment with a meme page, a heat press, and one very
                questionable &quot;This Is Fine&quot; graphic. We saw the gap — Pakistani Gen-Z
                were spending on imported streetwear when nobody was making stuff that actually
                spoke to their culture, their humour, their internet brain.
              </p>
              <p>
                So we built TrollFit. A brand that lives where our generation lives — online, on
                TikTok, in meme group chats. We took the things people actually love (Doge, anime,
                sigma grindsets, glitch art) and put them on premium cotton because you deserve
                better than a low-quality print that cracks after three washes.
              </p>
              <p>
                Today, TrollFit ships to every corner of Pakistan. Cash on delivery, no
                minimums, no pretentious nonsense. Just premium tees for the culture.
              </p>
              <p className="font-semibold text-foreground">
                We&apos;re not just a clothing brand. We&apos;re Pakistan&apos;s first internet-native streetwear brand. 🔥
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-card/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-4xl font-black tracking-tight"
          >
            What We Stand For
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-8"
              >
                <div className="mb-4 text-4xl">{value.icon}</div>
                <h3 className="mb-3 text-xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="mx-auto mb-6 h-12 w-12 text-primary" />
            <h2 className="mb-4 text-4xl font-black">Join the Movement</h2>
            <p className="mb-8 text-xl text-muted-foreground">
              10,000+ Pakistanis are already wearing the internet. Time to join the drip.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-lg font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
            >
              SHOP NOW
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
