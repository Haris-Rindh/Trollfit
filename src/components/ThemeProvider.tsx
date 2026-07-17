"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().checkSession();
  }, []);

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemesProvider>
  );
}

