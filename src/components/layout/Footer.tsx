import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";
import { FOOTER_LINKS, SITE_CONFIG } from "@/lib/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-card/50">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <ScrollReveal className="lg:col-span-1">
            <Link href="/" className="inline-block">
              {/* Optimized Image replacement for logo */}
              <Image 
                src="/logo.png" 
                alt="TrollFit" 
                width={112} 
                height={40} 
                className="object-cover object-center invert dark:invert-0 mix-blend-multiply dark:mix-blend-screen" 
              />
            </Link>
            <p className="mb-6 mt-4 text-sm leading-relaxed text-muted-foreground">
              {SITE_CONFIG.description.slice(0, 120)}...
            </p>

            {/* Social links (Client component island) */}
            <SocialLinks />
          </ScrollReveal>

          {/* Shop Links */}
          <ScrollReveal delay={0.1}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground">
              Shop
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Support Links */}
          <ScrollReveal delay={0.2}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground">
              Support
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Contact */}
          <ScrollReveal delay={0.3}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Karachi, Pakistan 🇵🇰</span>
              </li>
              <li>
                <a
                  href="mailto:hello@trollfit.pk"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  hello@trollfit.pk
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  +92 300 1234567
                </a>
              </li>
            </ul>

            {/* COD Badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Cash on Delivery Available
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TrollFit. All rights reserved. Made with 🔥 in Pakistan 🇵🇰
          </p>
          <div className="flex gap-6">
            {FOOTER_LINKS.company.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
