"use client";

import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { Shield, Truck, Banknote, RotateCcw, Printer, Headphones } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "Premium Quality",
    desc: "100% premium cotton, 240-300 GSM. Built to last, designed to impress.",
    color: "from-white/5 to-transparent",
    iconColor: "text-primary",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    desc: "We deliver all across Pakistan. Your drip, delivered to your doorstep.",
    color: "from-white/5 to-transparent",
    iconColor: "text-primary",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery",
    desc: "No online payment stress. Pay when your order arrives. Simple.",
    color: "from-white/5 to-transparent",
    iconColor: "text-primary",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "Not happy? Return within 7 days. No questions asked, no drama.",
    color: "from-white/5 to-transparent",
    iconColor: "text-primary",
  },
  {
    icon: Printer,
    title: "HD Printing",
    desc: "Crystal-clear DTF prints that don't crack or fade. Vibrant forever.",
    color: "from-white/5 to-transparent",
    iconColor: "text-primary",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "WhatsApp us anytime. We're here for you, literally always.",
    color: "from-white/5 to-transparent",
    iconColor: "text-primary",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
            Why TrollFit?
          </span>
          <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            Built Different.{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Literally.
            </span>
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            We&apos;re not your average t-shirt brand. Here&apos;s why thousands choose TrollFit.
          </p>
        </ScrollReveal>

        {/* Features Grid */}
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-card p-8 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_8px_40px_rgba(168,85,247,0.1)]"
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />

                {/* Icon */}
                <div className="relative mb-5">
                  <motion.div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 ${feature.iconColor} transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10`}
                    whileHover={{ rotate: 5 }}
                  >
                    <feature.icon className="h-6 w-6" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="mb-2 text-lg font-bold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>

                {/* Bottom glow */}
                <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 group-hover:w-3/4" />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
