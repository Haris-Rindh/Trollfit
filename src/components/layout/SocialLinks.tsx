"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";

const SOCIAL_ICONS = [
  { icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
  { icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
  { icon: Twitter, href: SOCIAL_LINKS.twitter, label: "Twitter/X" },
  { icon: MessageCircle, href: SOCIAL_LINKS.whatsapp, label: "WhatsApp" },
];

export function SocialLinks() {
  return (
    <div className="flex gap-3">
      {SOCIAL_ICONS.map((social) => (
        <motion.a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={social.label}
        >
          <social.icon className="h-4 w-4" />
        </motion.a>
      ))}
    </div>
  );
}
