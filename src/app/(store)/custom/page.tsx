"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Wand2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShoppingCart,
  Palette,
  ImageIcon,
  Layers,
  Eye,
  Download,
  Eraser,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types";

// ─── Types ───────────────────────────────────────────────

interface DesignPlacement {
  x: number;
  y: number;
  scale: number;
}

type ShirtColor = {
  name: string;
  hex: string;
  darkText: boolean;
};

// ─── Constants ───────────────────────────────────────────

const SHIRT_COLORS: ShirtColor[] = [
  { name: "White", hex: "#FFFFFF", darkText: true },
  { name: "Black", hex: "#111111", darkText: false },
  { name: "Navy", hex: "#1B2A4A", darkText: false },
  { name: "Charcoal", hex: "#36454F", darkText: false },
  { name: "Sand", hex: "#C2B280", darkText: true },
  { name: "Olive", hex: "#556B2F", darkText: false },
  { name: "Maroon", hex: "#4A0E0E", darkText: false },
  { name: "Slate", hex: "#708090", darkText: false },
];

const STEPS = [
  { id: 1, label: "Design", icon: ImageIcon },
  { id: 2, label: "Edit", icon: Layers },
  { id: 3, label: "Color", icon: Palette },
  { id: 4, label: "Preview", icon: Eye },
  { id: 5, label: "Order", icon: ShoppingCart },
];

const CUSTOM_PRICE = 2490;

// ─── Realistic Shirt SVG Component ────────────────────────

function ShirtMockup({
  color,
  designUrl,
  placement,
  className = "",
}: {
  color: ShirtColor;
  designUrl?: string | null;
  placement?: DesignPlacement;
  className?: string;
}) {
  const isDark = !color.darkText;
  const shadowColor = isDark ? "rgba(255,255,255," : "rgba(0,0,0,";

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 600 700" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Fabric texture gradient */}
          <linearGradient id="fabricLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`${shadowColor}0.04)`} />
            <stop offset="50%" stopColor={`${shadowColor}0)`} />
            <stop offset="100%" stopColor={`${shadowColor}0.06)`} />
          </linearGradient>
          {/* Body shadow for 3D effect */}
          <radialGradient id="bodyGrad" cx="0.5" cy="0.3" r="0.7">
            <stop offset="0%" stopColor={`${shadowColor}0)`} />
            <stop offset="70%" stopColor={`${shadowColor}0)`} />
            <stop offset="100%" stopColor={`${shadowColor}0.12)`} />
          </radialGradient>
          {/* Left sleeve shadow */}
          <linearGradient id="sleeveL" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%" stopColor={`${shadowColor}0.15)`} />
            <stop offset="100%" stopColor={`${shadowColor}0)`} />
          </linearGradient>
          {/* Right sleeve shadow */}
          <linearGradient id="sleeveR" x1="1" y1="0" x2="0" y2="0.5">
            <stop offset="0%" stopColor={`${shadowColor}0.15)`} />
            <stop offset="100%" stopColor={`${shadowColor}0)`} />
          </linearGradient>
          {/* Drop shadow for shirt */}
          <filter id="shirtShadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(0,0,0,0.3)" />
          </filter>
          {/* Collar shadow */}
          <filter id="collarShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={`${shadowColor}0.2)`} />
          </filter>
          <clipPath id="shirtClip">
            <path
              d={`
                M 220 55
                C 240 38, 260 30, 300 28
                C 340 30, 360 38, 380 55
                L 460 85
                C 500 100, 530 130, 540 165
                L 520 230
                C 515 240, 508 245, 498 248
                L 475 252
                L 475 610
                C 470 625, 440 638, 300 645
                C 160 638, 130 625, 125 610
                L 125 252
                L 102 248
                C 92 245, 85 240, 80 230
                L 60 165
                C 70 130, 100 100, 140 85
                Z
              `}
            />
          </clipPath>
        </defs>

        {/* Background */}
        <rect width="600" height="700" fill="transparent" />

        {/* Main shirt body */}
        <path
          d={`
            M 220 55
            C 240 38, 260 30, 300 28
            C 340 30, 360 38, 380 55
            L 460 85
            C 500 100, 530 130, 540 165
            L 520 230
            C 515 240, 508 245, 498 248
            L 475 252
            L 475 610
            C 470 625, 440 638, 300 645
            C 160 638, 130 625, 125 610
            L 125 252
            L 102 248
            C 92 245, 85 240, 80 230
            L 60 165
            C 70 130, 100 100, 140 85
            Z
          `}
          fill={color.hex}
          filter="url(#shirtShadow)"
        />

        {/* Left sleeve */}
        <path
          d={`
            M 140 85
            L 220 55
            L 220 60
            L 125 242
            L 102 248
            C 92 245, 85 240, 80 230
            L 60 165
            C 70 130, 100 100, 140 85
          `}
          fill={color.hex}
        />
        <path
          d={`
            M 140 85
            L 220 55
            L 220 60
            L 125 242
            L 102 248
            C 92 245, 85 240, 80 230
            L 60 165
            C 70 130, 100 100, 140 85
          `}
          fill="url(#sleeveL)"
        />

        {/* Right sleeve */}
        <path
          d={`
            M 460 85
            L 380 55
            L 380 60
            L 475 242
            L 498 248
            C 508 245, 515 240, 520 230
            L 540 165
            C 530 130, 500 100, 460 85
          `}
          fill={color.hex}
        />
        <path
          d={`
            M 460 85
            L 380 55
            L 380 60
            L 475 242
            L 498 248
            C 508 245, 515 240, 520 230
            L 540 165
            C 530 130, 500 100, 460 85
          `}
          fill="url(#sleeveR)"
        />

        {/* Body shadow overlay */}
        <path
          d={`
            M 220 60
            L 380 60
            L 475 252
            L 475 610
            C 470 625, 440 638, 300 645
            C 160 638, 130 625, 125 610
            L 125 252
            Z
          `}
          fill="url(#bodyGrad)"
        />

        {/* Fabric texture overlay */}
        <path
          d={`
            M 220 55
            C 240 38, 260 30, 300 28
            C 340 30, 360 38, 380 55
            L 460 85 C 500 100, 530 130, 540 165 L 520 230 C 515 240, 508 245, 498 248
            L 475 252 L 475 610 C 470 625, 440 638, 300 645
            C 160 638, 130 625, 125 610 L 125 252
            L 102 248 C 92 245, 85 240, 80 230 L 60 165 C 70 130, 100 100, 140 85 Z
          `}
          fill="url(#fabricLight)"
        />

        {/* Design overlay inside SVG to use clipPath */}
        {designUrl && placement && (() => {
          const cxPct = 10 + (placement.x / 100) * 60;
          const cyPct = 15 + (placement.y / 100) * 65;
          const wSvg = (30 / 100) * 600 * placement.scale;
          const hSvg = wSvg; // aspect ratio 1:1
          const xSvg = (cxPct / 100) * 600 - wSvg / 2;
          const ySvg = (cyPct / 100) * 700 - hSvg / 2;

          return (
            <g clipPath="url(#shirtClip)">
              <image
                href={designUrl}
                x={xSvg}
                y={ySvg}
                width={wSvg}
                height={hSvg}
                preserveAspectRatio="xMidYMid meet"
                style={{ mixBlendMode: "multiply", opacity: 0.95 }}
              />
              {!color.darkText && (
                <image
                  href={designUrl}
                  x={xSvg}
                  y={ySvg}
                  width={wSvg}
                  height={hSvg}
                  preserveAspectRatio="xMidYMid meet"
                  style={{ mixBlendMode: "screen", opacity: 0.6 }}
                />
              )}
            </g>
          );
        })()}

        {/* Collar */}
        <path
          d={`
            M 230 58
            C 250 48, 270 42, 300 40
            C 330 42, 350 48, 370 58
            C 350 72, 330 80, 300 82
            C 270 80, 250 72, 230 58
          `}
          fill={color.hex}
          filter="url(#collarShadow)"
        />
        {/* Collar inner */}
        <path
          d={`
            M 245 60
            C 260 52, 278 47, 300 46
            C 322 47, 340 52, 355 60
            C 340 70, 325 75, 300 76
            C 275 75, 260 70, 245 60
          `}
          fill={`${shadowColor}0.08)`}
        />

        {/* Seam lines */}
        <line x1="300" y1="82" x2="300" y2="640" stroke={`${shadowColor}0.04)`} strokeWidth="1" />
        <path d="M 125 250 L 475 250" stroke={`${shadowColor}0.05)`} strokeWidth="1" strokeDasharray="4 6" />

        {/* Subtle wrinkle lines */}
        <path d="M 200 300 Q 250 310 300 305" stroke={`${shadowColor}0.03)`} strokeWidth="1" fill="none" />
        <path d="M 400 320 Q 350 315 310 325" stroke={`${shadowColor}0.03)`} strokeWidth="1" fill="none" />
        <path d="M 180 500 Q 240 510 300 505" stroke={`${shadowColor}0.02)`} strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

// ─── Background Removal ───────────────────────────────────

function removeBackground(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No canvas context"));

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Sample corners to detect background color
      const corners = [
        { x: 0, y: 0 },
        { x: canvas.width - 1, y: 0 },
        { x: 0, y: canvas.height - 1 },
        { x: canvas.width - 1, y: canvas.height - 1 },
      ];

      let bgR = 0, bgG = 0, bgB = 0;
      corners.forEach(({ x, y }) => {
        const idx = (y * canvas.width + x) * 4;
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      });
      bgR = Math.round(bgR / 4);
      bgG = Math.round(bgG / 4);
      bgB = Math.round(bgB / 4);

      // Remove pixels similar to background color
      const threshold = 60;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dist = Math.sqrt(
          (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2
        );
        if (dist < threshold) {
          data[i + 3] = 0; // Make transparent
        } else if (dist < threshold + 30) {
          // Smooth edge transition
          const alpha = Math.round(((dist - threshold) / 30) * 255);
          data[i + 3] = Math.min(data[i + 3], alpha);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

// ─── Page Component ──────────────────────────────────────

export default function CustomDesignPage() {
  const [step, setStep] = useState(1);
  const [designSource, setDesignSource] = useState<"upload" | "ai" | null>(null);
  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [originalDesignUrl, setOriginalDesignUrl] = useState<string | null>(null);
  const [bgRemoved, setBgRemoved] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [shirtColor, setShirtColor] = useState<ShirtColor>(SHIRT_COLORS[0]);
  const [placement, setPlacement] = useState<DesignPlacement>({ x: 50, y: 40, scale: 1 });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCreatingPreview, setIsCreatingPreview] = useState(false);
  const [selectedSize, setSelectedSize] = useState("L");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  // ─── File Upload ─────────────────────────────────────

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.match(/^image\/(png|jpe?g|svg\+xml)$/)) {
      alert("Please upload a PNG, JPG, JPEG, or SVG file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setDesignUrl(url);
      setOriginalDesignUrl(url);
      setBgRemoved(false);
      setDesignSource("upload");
      setStep(2);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  // ─── AI Generation ──────────────────────────────────

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/generate-image?prompt=${encodeURIComponent(aiPrompt)}`);
      if (!response.ok) throw new Error("Generation failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDesignUrl(url);
      setOriginalDesignUrl(url);
      setBgRemoved(false);
      setDesignSource("ai");
      setStep(2);
    } catch (error) {
      console.error("AI generation failed:", error);
      alert("Failed to generate design. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── Background Removal ─────────────────────────────

  const handleRemoveBg = async () => {
    if (!designUrl) return;
    setIsRemovingBg(true);
    try {
      const result = await removeBackground(designUrl);
      setDesignUrl(result);
      setBgRemoved(true);
    } catch (error) {
      console.error("Background removal failed:", error);
      alert("Failed to remove background.");
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleRestoreBg = () => {
    if (originalDesignUrl) {
      setDesignUrl(originalDesignUrl);
      setBgRemoved(false);
    }
  };

  // ─── Design Placement ──────────────────────────────

  const handlePlacementDrag = (e: React.MouseEvent | React.TouchEvent) => {
    const container = (e.target as HTMLElement).closest("[data-shirt-area]");
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setPlacement((p) => ({
      ...p,
      x: Math.max(20, Math.min(80, x)),
      y: Math.max(20, Math.min(75, y)),
    }));
  };

  const generatePreview = useCallback(async () => {
    if (!designUrl || !canvasRef.current) return;
    setIsCreatingPreview(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use exact same dimensions as the SVG mockup
    const W = 600;
    const H = 700;
    canvas.width = W;
    canvas.height = H;

    // Clear canvas with neutral bg
    ctx.fillStyle = "#e8e8e8";
    ctx.fillRect(0, 0, W, H);

    // Draw subtle radial gradient background
    const bgGrad = ctx.createRadialGradient(W / 2, H * 0.35, 100, W / 2, H * 0.35, 400);
    bgGrad.addColorStop(0, "#f0f0f0");
    bgGrad.addColorStop(1, "#d5d5d5");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ─── Draw Shirt ───────────────────
    const shirtPathD = `
      M 220 55 C 240 38, 260 30, 300 28 C 340 30, 360 38, 380 55
      L 460 85 C 500 100, 530 130, 540 165 L 520 230 C 515 240, 508 245, 498 248
      L 475 252 L 475 610 C 470 625, 440 638, 300 645
      C 160 638, 130 625, 125 610 L 125 252 L 102 248 C 92 245, 85 240, 80 230
      L 60 165 C 70 130, 100 100, 140 85 Z
    `;
    const shirtPath = new Path2D(shirtPathD);

    // Shadow under shirt
    ctx.save();
    ctx.translate(0, 8);
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    // Basic blur for drop shadow
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 15;
    ctx.fill(shirtPath);
    ctx.restore();

    // Main shirt fill
    ctx.fillStyle = shirtColor.hex;
    ctx.fill(shirtPath);

    // Collar
    const collarPathD = `
      M 230 58 C 250 48, 270 42, 300 40 C 330 42, 350 48, 370 58
      C 350 72, 330 80, 300 82 C 270 80, 250 72, 230 58
    `;
    const collarPath = new Path2D(collarPathD);
    ctx.fillStyle = shirtColor.hex;
    ctx.fill(collarPath);
    ctx.strokeStyle = shirtColor.darkText ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    ctx.stroke(collarPath);

    // ─── Draw Design on Shirt ─────────
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = designUrl;
      });

      // Exactly the same layout math as the UI
      const cxPct = 10 + (placement.x / 100) * 60;
      const cyPct = 15 + (placement.y / 100) * 65;
      const wSvg = (30 / 100) * 600 * placement.scale;
      const hSvg = wSvg; // aspect ratio 1:1
      const xSvg = (cxPct / 100) * 600 - wSvg / 2;
      const ySvg = (cyPct / 100) * 700 - hSvg / 2;

      ctx.save();
      // Clip to shirt boundaries so design never bleeds out!
      ctx.clip(shirtPath);

      // Slight multiply blend effect for realism
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = 0.95;
      ctx.drawImage(img, xSvg, ySvg, wSvg, hSvg);

      // Overlay pass for vibrancy
      if (!shirtColor.darkText) {
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.6;
        ctx.drawImage(img, xSvg, ySvg, wSvg, hSvg);
      }

      ctx.restore();
    } catch (err) {
      console.error("Failed to draw design:", err);
    }

    // TrollFit branding watermark
    ctx.save();
    ctx.font = "11px Inter, system-ui, sans-serif";
    ctx.fillStyle = shirtColor.darkText ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)";
    ctx.textAlign = "center";
    ctx.fillText("TrollFit™ Custom", W / 2, H - 20);
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/png");
    setPreviewUrl(dataUrl);
    setIsCreatingPreview(false);
    setStep(5);
  }, [designUrl, shirtColor, placement]);

  // ─── Add to Cart ────────────────────────────────────

  const handleAddToCart = () => {
    const customProduct: Product = {
      id: `custom-${Date.now()}`,
      name: "Custom Design Tee",
      slug: `custom-design-${Date.now()}`,
      description: designSource === "ai" ? `AI Generated: "${aiPrompt}"` : "Custom uploaded design",
      price: CUSTOM_PRICE,
      images: [previewUrl || ""],
      sizes: ["S", "M", "L", "XL", "2XL"],
      colors: [shirtColor.name],
      stockBySize: { S: 99, M: 99, L: 99, XL: 99, "2XL": 99 },
      totalStock: 99,
      featured: false,
      trending: false,
      isNew: true,
      published: true,
      tags: ["custom"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addItem(customProduct, selectedSize, shirtColor.name);
    alert("Custom design added to cart!");
  };

  // ─── Render ─────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <canvas ref={canvasRef} className="hidden" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="mb-3 text-4xl font-black tracking-tight sm:text-5xl">
            Custom{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Designer
            </span>
          </h1>
          <p className="text-muted-foreground">
            Upload your design or let AI create one — we&apos;ll put it on a premium tee.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="mb-12">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (s.id <= step) setStep(s.id);
                  }}
                  className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                    step >= s.id ? "text-foreground" : "text-muted-foreground/40"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      step > s.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : step === s.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/10 bg-card"
                    }`}
                  >
                    {step > s.id ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                  </div>
                  <span className="hidden text-xs font-medium sm:block">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-px w-8 transition-all duration-300 sm:w-16 ${
                      step > s.id ? "bg-primary" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* ── Step 1: Choose Design ─────────────────── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Upload Card */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="group cursor-pointer rounded-2xl border-2 border-dashed border-white/10 bg-card/60 p-10 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-[0_0_50px_rgba(168,85,247,0.08)]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20"
                  >
                    <Upload className="h-9 w-9" />
                  </motion.div>
                  <h3 className="mb-2 text-xl font-bold">Upload Design</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Drag & drop or click to upload</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["PNG", "JPG", "JPEG", "SVG"].map((fmt) => (
                      <span key={fmt} className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Generator Card */}
                <div className="rounded-2xl border border-white/10 bg-card/60 p-10 backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 text-accent"
                  >
                    <Wand2 className="h-9 w-9" />
                  </motion.div>
                  <h3 className="mb-2 text-center text-xl font-bold">AI Generator</h3>
                  <p className="mb-5 text-center text-sm text-muted-foreground">
                    Describe your design and AI will create it
                  </p>
                  <div className="space-y-3">
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. A cyberpunk wolf howling at a neon moon..."
                      rows={3}
                      className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                    <motion.button
                      onClick={handleAIGenerate}
                      disabled={!aiPrompt.trim() || isGenerating}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-bold text-background transition-all disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating (~15s)...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate Design
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Edit Design ──────────────────── */}
          {step === 2 && designUrl && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid gap-8 md:grid-cols-2">
                {/* Design Preview + BG Removal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Your Design</h3>
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-card">
                    <div className="relative aspect-square bg-[repeating-conic-gradient(#80808015_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={designUrl} alt="Your design" className="h-full w-full object-contain p-4" />
                    </div>
                  </div>

                  {/* Background Removal Controls */}
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      onClick={handleRemoveBg}
                      disabled={isRemovingBg || bgRemoved}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                        bgRemoved
                          ? "border-green-500/30 bg-green-500/10 text-green-400"
                          : "border-white/10 hover:border-primary/30 hover:bg-primary/5"
                      }`}
                    >
                      {isRemovingBg ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Removing...
                        </>
                      ) : bgRemoved ? (
                        <>
                          <Check className="h-4 w-4" />
                          Background Removed
                        </>
                      ) : (
                        <>
                          <Eraser className="h-4 w-4" />
                          Remove Background
                        </>
                      )}
                    </motion.button>

                    {bgRemoved && (
                      <button
                        onClick={handleRestoreBg}
                        className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Restore Original
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setDesignUrl(null);
                      setOriginalDesignUrl(null);
                      setDesignSource(null);
                      setBgRemoved(false);
                      setStep(1);
                    }}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    ← Change design
                  </button>
                </div>

                {/* Placement Controls */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold">Placement & Size</h3>

                  {/* Shirt Preview with design */}
                  <div
                    data-shirt-area
                    className="relative mx-auto w-full max-w-xs cursor-crosshair"
                    onClick={handlePlacementDrag}
                  >
                    <ShirtMockup
                      color={shirtColor}
                      designUrl={designUrl}
                      placement={placement}
                    />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-white backdrop-blur-sm">
                      <Move className="h-3 w-3" />
                      Click to position
                    </div>
                  </div>

                  {/* Scale Controls */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">Design Scale</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPlacement((p) => ({ ...p, scale: Math.max(0.3, p.scale - 0.1) }))}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-card transition-colors hover:bg-white/5"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <input
                        type="range"
                        min="0.3"
                        max="2"
                        step="0.05"
                        value={placement.scale}
                        onChange={(e) => setPlacement((p) => ({ ...p, scale: parseFloat(e.target.value) }))}
                        className="flex-1 accent-primary"
                      />
                      <button
                        onClick={() => setPlacement((p) => ({ ...p, scale: Math.min(2, p.scale + 0.1) }))}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-card transition-colors hover:bg-white/5"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-center text-xs text-muted-foreground">
                      {Math.round(placement.scale * 100)}%
                    </div>
                  </div>

                  <button
                    onClick={() => setPlacement({ x: 50, y: 40, scale: 1 })}
                    className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset position
                  </button>

                  <motion.button
                    onClick={() => setStep(3)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-bold text-background"
                  >
                    Continue to Color
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Shirt Color ──────────────────── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Choose Shirt Color</h3>
                  <ShirtMockup
                    color={shirtColor}
                    designUrl={designUrl}
                    placement={placement}
                    className="mx-auto max-w-sm"
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold">Available Colors</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {SHIRT_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setShirtColor(color)}
                        className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all duration-200 ${
                          shirtColor.name === color.name
                            ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                            : "border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div
                          className={`h-12 w-12 rounded-full border-2 transition-transform group-hover:scale-110 ${
                            shirtColor.name === color.name
                              ? "border-primary ring-2 ring-primary/30"
                              : "border-white/20"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-medium">{color.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium transition-colors hover:bg-white/5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                    <motion.button
                      onClick={() => setStep(4)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-bold text-background"
                    >
                      Generate Preview
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Generate Preview ─────────────── */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-lg text-center"
            >
              <div className="rounded-2xl border border-white/10 bg-card/60 p-10 backdrop-blur-sm">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                    <Eye className="h-9 w-9 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">Ready to Preview</h3>
                <p className="mb-8 text-sm text-muted-foreground">
                  We&apos;ll generate a premium mockup of your custom {shirtColor.name.toLowerCase()} tee
                  with your design placed exactly how you positioned it.
                </p>

                <div className="mb-6 flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full border border-white/20" style={{ backgroundColor: shirtColor.hex }} />
                    <span className="text-muted-foreground">{shirtColor.name}</span>
                  </div>
                  <span className="text-white/20">•</span>
                  <span className="text-muted-foreground">Scale: {Math.round(placement.scale * 100)}%</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium transition-colors hover:bg-white/5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <motion.button
                    onClick={generatePreview}
                    disabled={isCreatingPreview}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-bold text-background disabled:opacity-50"
                  >
                    {isCreatingPreview ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Mockup...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Create Custom Tee Preview
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 5: Order ─────────────────────────── */}
          {step === 5 && previewUrl && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Your Custom Tee</h3>
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Custom tee preview" className="h-full w-full object-contain" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = previewUrl;
                        a.download = "trollfit-custom-tee.png";
                        a.click();
                      }}
                      className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Download className="h-3 w-3" />
                      Download Preview
                    </button>
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Edit Design
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold">Order Summary</h3>
                  <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-sm">
                    <div className="mb-6 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Product</span>
                        <span className="font-medium">Premium Custom Tee</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Material</span>
                        <span className="font-medium">100% Premium Cotton</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GSM</span>
                        <span className="font-medium">240 GSM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Print</span>
                        <span className="font-medium">HD DTF Print</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Color</span>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: shirtColor.hex }} />
                          <span className="font-medium">{shirtColor.name}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Design</span>
                        <span className="font-medium capitalize">{designSource}</span>
                      </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    <div className="my-6">
                      <label className="mb-3 block text-sm font-medium">Select Size</label>
                      <div className="flex flex-wrap gap-2">
                        {["S", "M", "L", "XL", "2XL"].map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                              selectedSize === size
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-white/10 hover:border-white/20"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    <div className="mt-6 flex items-baseline justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="text-3xl font-black">Rs. {CUSTOM_PRICE.toLocaleString()}</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleAddToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-4 text-base font-bold text-background transition-all hover:opacity-90"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart — Rs. {CUSTOM_PRICE.toLocaleString()}
                  </motion.button>

                  <p className="text-center text-xs text-muted-foreground">
                    Free shipping on orders over Rs. 3,000 • Cash on Delivery available
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
