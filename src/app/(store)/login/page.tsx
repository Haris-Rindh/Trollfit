"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/profile";
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);

    setTimeout(() => {
      setIsLoading(false);
      if (success) {
        toast.success("Welcome back! 🔥");
        router.push(redirect);
      } else {
        toast.error("Invalid email or password. Try guest@trollfit.pk / password123 🧐");
      }
    }, 800);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-24">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[80px]"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card/50 p-8 shadow-2xl backdrop-blur-xl"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Log in to view orders, edit addresses and get that drip.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <button
                type="button"
                onClick={() => toast("Type any password for demo accounts! 🤫")}
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-12 text-sm outline-none transition-colors focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>
                LOG IN <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Hint */}
        <div className="mt-6 space-y-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-xs text-yellow-500/80 leading-relaxed">
          <div className="text-center font-bold mb-1">
            <Sparkles className="mr-1 inline-block h-3.5 w-3.5" />
            Quick Demo Access:
          </div>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => {
                setEmail("guest@trollfit.pk");
                setPassword("password123");
              }}
              className="px-2.5 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 font-bold border border-yellow-500/20 transition-all text-[10px]"
            >
              Guest Customer
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@trollfit.pk");
                setPassword("admin123");
              }}
              className="px-2.5 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 font-bold border border-yellow-500/20 transition-all text-[10px]"
            >
              Admin Panel
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href={`/signup?redirect=${encodeURIComponent(redirect)}`} className="font-bold text-primary hover:underline">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
