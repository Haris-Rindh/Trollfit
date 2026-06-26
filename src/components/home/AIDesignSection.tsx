"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Wand2, Sparkles, Loader2, ArrowRight, Cpu, Zap } from "lucide-react";

const DEMO_PROMPTS = [
  "A cyberpunk samurai with neon cherry blossoms",
  "Gigachad meditating on a mountain of memes",
  "Retro synthwave sunset with anime girl silhouette",
  "A glitch art portrait of a cat in a suit",
  "Doge riding a rocket through space",
];

export function AIDesignSection() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerated(false);
    setGeneratedImageUrl(null);
    try {
      // Use our own server-side proxy to avoid all browser CORS issues
      const response = await fetch(`/api/generate-image?prompt=${encodeURIComponent(prompt)}`);
      if (!response.ok) {
        throw new Error("Generation failed");
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImageUrl(imageUrl);
      setGenerated(true);
    } catch (error) {
      console.error("Image generation failed:", error);
      alert("Failed to generate design. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const fillDemo = () => {
    const random = DEMO_PROMPTS[Math.floor(Math.random() * DEMO_PROMPTS.length)];
    setPrompt(random);
    setGenerated(false);
  };

  return (
    <section id="ai-design" className="relative overflow-hidden py-24 md:py-32">
      {/* Futuristic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        {/* Circuit-like grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px, 100px 100px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <ScrollReveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
            <Cpu className="h-3.5 w-3.5" />
            <span className="font-semibold">AI-Powered</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={0.1}>
          <h2 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">
            Design Your Own{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Custom Tee
            </span>
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Describe your dream design and our AI will bring it to life.
            <br className="hidden sm:block" />
            Unique. Personal. One of a kind.
          </p>
        </ScrollReveal>

        {/* Input area */}
        <ScrollReveal delay={0.2}>
          <div className="mx-auto max-w-2xl">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/80 p-2 backdrop-blur-sm transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-[0_0_40px_rgba(168,85,247,0.15)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    setGenerated(false);
                  }}
                  placeholder="Describe your dream t-shirt design..."
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none sm:text-base"
                />
                <motion.button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-all disabled:opacity-50 sm:px-6"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Creating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Generate</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Demo prompts */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">Try:</span>
              <button
                onClick={fillDemo}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
              >
                <Zap className="mr-1 inline-block h-3 w-3" />
                Random prompt
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Generated preview */}
        <AnimatePresence>
          {(isGenerating || generated) && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10"
            >
              <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-card">
                {/* Preview area */}
                <div className="relative aspect-square bg-gradient-to-br from-muted to-card">
                  {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <motion.div
                        className="h-16 w-16 rounded-full border-2 border-primary/30 border-t-primary"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <p className="text-sm text-muted-foreground">
                        AI is designing your tee...
                      </p>
                    </div>
                  ) : generatedImageUrl ? (
                    <div className="absolute inset-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={generatedImageUrl} 
                        alt={prompt} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                      <div className="rounded-full bg-primary/20 p-4">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-center text-sm text-foreground">
                        {generated ? `Your custom "${prompt}" design is ready!` : "Ready to create"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {generated ? "(Full AI generation coming soon)" : "Enter a prompt to start"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action */}
                {generated && (
                  <div className="p-4">
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90">
                      Order This Design
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
