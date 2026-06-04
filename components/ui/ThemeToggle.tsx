"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  minimal?: boolean;
}

export default function ThemeToggle({ minimal = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={`rounded-full bg-slate-700 animate-pulse ${
          minimal ? "h-9 w-9 bg-white/10" : "h-6 w-12"
        }`}
      />
    );
  }

  const isDark = theme === "dark";

  if (minimal) {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 focus:outline-none"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-white" />
        ) : (
          <Moon className="h-5 w-5 text-white" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative flex h-6 w-12 items-center rounded-full border border-slate-600 bg-slate-800 p-0.5 transition-colors hover:border-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
    >
      {/* Track fill */}
      <span
        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
          isDark ? "bg-cyan-500/20" : "bg-slate-700"
        }`}
      />

      {/* Thumb */}
      <span
        className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-cyan-600" />
        ) : (
          <Sun className="h-3 w-3 text-amber-500" />
        )}
      </span>
    </button>
  );
}


