"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "infyn-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from storage, DOM, or system on mount
  useEffect(() => {
    let initialResolved: ResolvedTheme = "light";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "light" || stored === "dark" || stored === "system") {
        setThemeState(stored);
      }

      const isDocDark = document.documentElement.classList.contains("dark");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (stored === "dark" || (!stored && (isDocDark || prefersDark))) {
        initialResolved = "dark";
      } else if (stored === "light") {
        initialResolved = "light";
      } else if (stored === "system") {
        initialResolved = prefersDark ? "dark" : "light";
      }
    } catch {
      // Storage unavailable
    }
    setResolvedTheme(initialResolved);
    setMounted(true);
  }, []);

  // Update resolvedTheme and document classes whenever theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const currentResolved: ResolvedTheme =
        theme === "system" ? (mediaQuery.matches ? "dark" : "light") : theme;

      setResolvedTheme(currentResolved);

      const root = document.documentElement;
      if (currentResolved === "dark") {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
      } else {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
      }

      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", currentResolved === "dark" ? "#0C0C0E" : "#FBFBFA");
      }
    };

    applyTheme();

    const handleSystemChange = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme, mounted]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const next = e.newValue as Theme;
        if (next === "light" || next === "dark" || next === "system") {
          setThemeState(next);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Storage unavailable
    }
  }, []);

  // Direct, instant, bulletproof 1-click toggle
  const toggleTheme = useCallback(() => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    const nextTheme: ResolvedTheme = isCurrentlyDark ? "light" : "dark";

    // 1. Immediately update DOM (0ms latency)
    const root = document.documentElement;
    if (nextTheme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", nextTheme === "dark" ? "#0C0C0E" : "#FBFBFA");
    }

    // 2. Immediately update state and storage
    setThemeState(nextTheme);
    setResolvedTheme(nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Storage unavailable
    }
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
