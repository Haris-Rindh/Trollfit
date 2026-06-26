"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors relative overflow-hidden group"
      aria-label="Toggle theme"
    >
      <div className="relative flex h-full w-full items-center justify-center transition-transform duration-500">
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        ) : (
          <Moon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </div>
    </button>
  );
}
