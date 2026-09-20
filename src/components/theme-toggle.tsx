"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme, Theme } from "./theme-provider";

interface ThemeToggleProps {
  className?: string;
  variant?: "dropdown" | "segmented" | "button";
  showLabel?: boolean;
}

export function ThemeToggle({
  className = "",
  variant = "button",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, toggleTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Segmented Variant (used in mobile menu drawer)
  if (variant === "segmented") {
    const options: { id: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
      { id: "light", label: "Light", icon: Sun },
      { id: "dark", label: "Dark", icon: Moon },
      { id: "system", label: "System", icon: Laptop },
    ];

    return (
      <div className={`inline-flex items-center p-1 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800/80 border border-[#EAEAE5] dark:border-zinc-700 gap-1 ${className}`}>
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                isSelected
                  ? "bg-white dark:bg-zinc-900 text-[#111111] dark:text-white shadow-2xs"
                  : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
              }`}
              title={`Switch to ${opt.label} mode`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Determine dark state (resilient on SSR and immediately after mount)
  const isDark = mounted
    ? resolvedTheme === "dark"
    : typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Current: ${isDark ? "Dark" : "Light"} mode (Click to toggle)`}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 hover:border-[#BEBDB9] dark:hover:border-zinc-700 active:scale-90 transition-all cursor-pointer shadow-2xs shrink-0 ${className}`}
    >
      <div className="h-4 w-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 fill-amber-400/20 transition-all duration-200" />
        ) : (
          <Moon className="h-4 w-4 text-indigo-600 fill-indigo-600/20 transition-all duration-200" />
        )}
      </div>

      {showLabel && (
        <span className="ml-2 text-xs font-semibold text-[#111111] dark:text-white capitalize">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
