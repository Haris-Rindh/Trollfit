"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Grid,
  ArrowLeft,
  LogOut,
  ShieldAlert,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isAuthenticated, logout } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Give a split second for Zustand persist to rehydrate client-side state
    const checkAuth = () => {
      if (!isAuthenticated) {
        router.push("/login?redirect=/admin");
      } else if (currentUser?.role !== "ADMIN") {
        setIsAuthorized(false);
        setIsChecking(false);
      } else {
        setIsAuthorized(true);
        setIsChecking(false);
      }
    };

    const timer = setTimeout(checkAuth, 300);
    return () => clearTimeout(timer);
  }, [isAuthenticated, currentUser, router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Verifying Admin Status...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 text-white">
        <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-red-950/10 p-8 text-center backdrop-blur-md">
          <ShieldAlert className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-black tracking-tight mb-2">ACCESS RESTRICTED</h1>
          <p className="text-sm text-muted-foreground mb-6">
            You do not have administrative privileges to access this area.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                logout();
                router.push("/login?redirect=/admin");
              }}
              className="w-full rounded-xl bg-red-600 py-3 font-bold text-white transition-all hover:bg-red-500"
            >
              Sign In with Admin Account
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Products", href: "/admin/products", icon: Grid },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">
      {/* ─── Desktop Sidebar ─────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#09090b] p-6 shrink-0 justify-between">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="block">
            <span className="text-2xl font-black tracking-tighter uppercase">
              Troll<span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Fit</span> Admin
            </span>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-muted-foreground hover:bg-white/5 hover:text-white transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* ─── Mobile Header ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-6 h-16 border-b border-white/5 bg-[#09090b]">
          <Link href="/admin">
            <span className="text-xl font-black uppercase tracking-tighter">
              Troll<span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Fit</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-muted-foreground hover:text-white rounded-lg hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* ─── Mobile Dropdown Menu ────────────────────────────── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden border-b border-white/5 bg-[#0c0c0e] px-6 py-4 space-y-4 absolute top-16 left-0 right-0 z-50 shadow-xl"
            >
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${
                        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="h-px bg-white/5 my-2" />
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-muted-foreground hover:bg-white/5 hover:text-white transition-all"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Storefront
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  Log Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Main Content Area ───────────────────────────────── */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
