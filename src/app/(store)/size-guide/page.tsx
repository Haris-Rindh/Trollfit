"use client";

import { useState } from "react";
import { Ruler, Sparkles, AlertCircle, Info, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface SizeSpec {
  size: string;
  chest: number; // in inches
  length: number; // in inches
  shoulder: number; // in inches
  fit: string;
}

const SIZE_DATA: SizeSpec[] = [
  { size: "S", chest: 38, length: 27, shoulder: 17, fit: "Regular Slim Fit" },
  { size: "M", chest: 40, length: 28, shoulder: 18, fit: "Standard Fit" },
  { size: "L", chest: 42, length: 29, shoulder: 19, fit: "Relaxed Fit" },
  { size: "XL", chest: 44, length: 30, shoulder: 20, fit: "Oversized Look" },
  { size: "2XL", chest: 46, length: 31, shoulder: 21, fit: "Drop Shoulder Drip" },
  { size: "3XL", chest: 48, length: 32, shoulder: 22, fit: "Maximum Baggy Fit" },
];

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<"in" | "cm">("in");

  const convertValue = (val: number) => {
    if (unit === "cm") {
      return Math.round(val * 2.54);
    }
    return val;
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Sizing Chart</span>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            SIZE GUIDE
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Get the perfect fit. Toggle between inches and centimeters to find your exact size.
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-8 flex items-center justify-between border-b border-border pb-6 flex-col gap-4 sm:flex-row">
          <div className="flex gap-2 items-center text-sm font-bold text-muted-foreground">
            <Ruler className="h-4.5 w-4.5 text-primary" />
            <span>Interactive measurement converter</span>
          </div>

          <div className="flex rounded-xl bg-card p-1 border border-border">
            <button
              onClick={() => setUnit("in")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                unit === "in" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit("cm")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                unit === "cm" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Size Chart Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card/30">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 font-black uppercase tracking-wider text-xs">Size</th>
                <th className="p-4 font-black uppercase tracking-wider text-xs">Chest</th>
                <th className="p-4 font-black uppercase tracking-wider text-xs">Length</th>
                <th className="p-4 font-black uppercase tracking-wider text-xs">Shoulder</th>
                <th className="p-4 font-black uppercase tracking-wider text-xs hidden sm:table-cell">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SIZE_DATA.map((row) => (
                <tr key={row.size} className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-black text-foreground">{row.size}</td>
                  <td className="p-4 text-muted-foreground">
                    {convertValue(row.chest)}
                    <span className="text-[10px] ml-0.5">{unit}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {convertValue(row.length)}
                    <span className="text-[10px] ml-0.5">{unit}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {convertValue(row.shoulder)}
                    <span className="text-[10px] ml-0.5">{unit}</span>
                  </td>
                  <td className="p-4 text-xs font-medium text-primary hidden sm:table-cell">{row.fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tips & Recommendations */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card/30 p-6 flex gap-4">
            <Sparkles className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h3 className="font-bold text-sm">Want an Oversized Drip?</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                TrollFit tees are styled slightly relaxed. If you want that heavy streetwear baggy drop-shoulder aesthetic, we recommend sizing up one size!
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/30 p-6 flex gap-4">
            <Info className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h3 className="font-bold text-sm">Measurement Accuracy</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Measurements may deviate by 0.5 to 1 inch due to manual stitch checks. We suggest measuring your current favorite fitting tee flat for comparison.
              </p>
            </div>
          </div>
        </div>

        {/* How to Measure Section */}
        <div className="mt-12 rounded-2xl border border-border bg-card/25 p-8">
          <h2 className="text-xl font-bold uppercase tracking-wide border-b border-border pb-4 mb-6">
            How To Measure
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Chest Measurement",
                desc: "Measure across the chest from armpit to armpit flat on a flat surface.",
              },
              {
                step: "02",
                title: "Length Measurement",
                desc: "Measure from the highest point of the collar shoulder down to the hem edge.",
              },
              {
                step: "03",
                title: "Shoulder Measurement",
                desc: "Measure straight across from one shoulder point seam to the other point seam.",
              },
            ].map((measure) => (
              <div key={measure.step} className="space-y-2 relative">
                <span className="text-3xl font-black text-primary/20 absolute -top-4 -left-2 z-0">
                  {measure.step}
                </span>
                <div className="relative z-10 pt-4">
                  <h4 className="font-bold text-sm text-foreground">{measure.title}</h4>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{measure.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
