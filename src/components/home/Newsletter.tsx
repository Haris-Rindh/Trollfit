"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Send, Check, Mail, Sparkles } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <section id="newsletter" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal>
          {/* Icon */}
          <motion.div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 p-3"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <img src="/monogram.png" alt="TF" className="h-full w-full object-contain" />
          </motion.div>

          <h2 className="mb-3 text-3xl font-black tracking-tight sm:text-4xl">
            Join the{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Troll Army
            </span>
          </h2>
          <p className="mb-2 text-muted-foreground">
            Get early access to new drops, exclusive discounts, and memes.
          </p>
          <p className="mb-8 text-sm font-semibold text-primary">
            <Sparkles className="mr-1 inline-block h-3.5 w-3.5" />
            Get 10% OFF your first order
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-white/10 bg-card/80 p-2 backdrop-blur-sm transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
          >
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3"
                  >
                    <Check className="h-4 w-4 text-white" />
                  </motion.div>
                ) : (
                  <motion.button
                    key="submit"
                    type="submit"
                    disabled={status === "loading"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-all disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Send className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </form>

          <p className="mt-4 text-xs text-muted-foreground/60">
            No spam, ever. Unsubscribe anytime.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
