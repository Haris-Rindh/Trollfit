"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function TextReveal({
  text,
  className = "",
  delay = 0,
  once = true,
  as: Component = "h2",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.5 });

  const words = text.split(" ");

  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      ref={ref}
      className={className}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-block overflow-hidden"
          style={{ marginRight: "0.25em" }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={
              isInView
                ? { y: "0%", opacity: 1 }
                : { y: "100%", opacity: 0 }
            }
            transition={{
              duration: 0.5,
              delay: delay + wordIndex * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
}

// ─── Character Reveal ────────────────────────────────────

interface CharRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function CharReveal({
  text,
  className = "",
  delay = 0,
  once = true,
}: CharRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: 0.5 });

  const chars = text.split("");

  return (
    <span ref={ref} className={className} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={
            isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{
            duration: 0.3,
            delay: delay + i * 0.03,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            display: char === " " ? "inline" : "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
