"use client";

import { Marquee } from "@/components/animations/Marquee";

const MARQUEE_ITEMS = [
  "🔥 FREE SHIPPING OVER RS. 3,000",
  "⚡ NEW DROPS EVERY WEEK",
  "💀 CASH ON DELIVERY AVAILABLE",
  "🎮 PREMIUM 280GSM COTTON",
  "✨ 10K+ HAPPY CUSTOMERS",
  "🫠 NATIONWIDE DELIVERY",
  "🚀 TRENDING IN PAKISTAN",
  "💯 7-DAY EASY RETURNS",
];

export function MarqueeBanner() {
  return (
    <div className="relative border-y border-white/5 bg-muted/30 py-3">
      <Marquee speed={40} gap={60}>
        {MARQUEE_ITEMS.map((item, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-sm font-medium text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
