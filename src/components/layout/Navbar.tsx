"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, Menu, X, User } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import { NAV_LINKS } from "@/lib/constants";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isMobileNavOpen, toggleMobileNav, closeMobileNav, openSearch, openCart } =
    useUIStore();
  
  // Performance optimization: calculate count directly in selector instead of returning the function
  const totalItemsCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const { isAuthenticated, currentUser } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "border-b border-white/5 bg-background/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileNav}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 lg:hidden"
              aria-label="Toggle menu"
            >
              {isMobileNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2" onClick={closeMobileNav}>
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                {/* Optimized Logo image replacement */}
                <Image
                  src="/logo.png"
                  alt="TrollFit"
                  width={144}
                  height={48}
                  priority
                  className="h-10 sm:h-12 w-28 sm:w-36 object-cover object-center invert dark:invert-0 mix-blend-multiply dark:mix-blend-screen"
                />
              </motion.div>
            </Link>
          </div>

          {/* Center: Nav links (desktop) */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-3/4" />
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={openSearch}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            {/* Wishlist (desktop) */}
            <Link
              href="/wishlist"
              className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="h-[18px] w-[18px]" />
            </Link>

            {/* Account (desktop) */}
            <Link
              href={isAuthenticated ? (currentUser?.role === "ADMIN" ? "/admin" : "/profile") : "/login"}
              className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 sm:flex"
              aria-label="Account"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              aria-label="Cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <AnimatePresence>
                {totalItemsCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                  >
                    {totalItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation */}
      <MobileNavOverlay />
    </>
  );

  function MobileNavOverlay() {
    return (
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileNav}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Menu panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 top-0 z-50 flex w-[85%] max-w-sm flex-col border-r border-white/5 bg-background p-6 lg:hidden"
            >
              {/* Header */}
              <div className="mb-8 flex items-center justify-between">
                <Link href="/" onClick={closeMobileNav}>
                  {/* Optimized Mobile Logo Image replacement */}
                  <Image
                    src="/logo.png"
                    alt="TrollFit"
                    width={112}
                    height={40}
                    className="object-cover object-center invert dark:invert-0 mix-blend-multiply dark:mix-blend-screen"
                  />
                </Link>
                <button
                  onClick={closeMobileNav}
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Functional Search Link trigger (closes overlay & opens search modal) */}
              <div className="mb-6">
                <div
                  onClick={() => {
                    closeMobileNav();
                    openSearch();
                  }}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-muted/50 px-4 py-3 cursor-pointer"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Search products...</span>
                </div>
              </div>

              {/* Nav links */}
              <div className="flex-1 space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobileNav}
                      className="flex items-center rounded-xl px-4 py-3.5 text-lg font-semibold transition-colors hover:bg-white/5 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom actions */}
              <div className="border-t border-white/5 pt-6">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={isAuthenticated ? (currentUser?.role === "ADMIN" ? "/admin" : "/profile") : "/login"}
                    onClick={closeMobileNav}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium transition-colors hover:bg-white/5"
                  >
                    <User className="h-4 w-4" />
                    {isAuthenticated ? "Account" : "Login"}
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={closeMobileNav}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium transition-colors hover:bg-white/5"
                  >
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
}
