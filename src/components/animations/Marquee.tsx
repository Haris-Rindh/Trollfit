"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // pixels per second
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  gap?: number;
}

export function Marquee({
  children,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  className = "",
  gap = 40,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const firstChild = containerRef.current.children[0] as HTMLElement;
      if (firstChild) {
        setContentWidth(firstChild.offsetWidth + gap);
      }
    }
  }, [children, gap]);

  const duration = contentWidth > 0 ? contentWidth / speed : 10;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <motion.div
        ref={containerRef}
        className="flex w-max"
        animate={
          !isPaused
            ? {
                x:
                  direction === "left"
                    ? [0, -contentWidth]
                    : [-contentWidth, 0],
              }
            : undefined
        }
        transition={{
          x: {
            duration,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          },
        }}
        style={{ gap: `${gap}px` }}
      >
        {/* Original */}
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        {/* Third copy for safety */}
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
