"use client";

import React, { useEffect, useState, useRef } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, Theme } from "./theme-provider";

interface ThemeToggleProps {
  className?: string;
  variant?: "dropdown" | "segmented";
  showLabel?: boolean;
}

export function ThemeToggle({
  className = "",
  variant = "dropdown",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click or escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className={`p-2 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 ${className}`}>
        <span className="h-4 w-4 block" />
      </div>
    );
  }

  // Segmented Variant (used in mobile menu drawer for full touch accessibility)
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

  // Dropdown Variant (used in header navigation bar)
  const currentIcon =
    theme === "system" ? (
      <Laptop className="h-4 w-4 text-[#6E6D68] dark:text-zinc-300" />
    ) : resolvedTheme === "dark" ? (
      <Moon className="h-4 w-4 text-indigo-400" />
    ) : (
      <Sun className="h-4 w-4 text-amber-500" />
    );

  const themeOptions: { id: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Laptop },
  ];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Change theme mode"
        aria-expanded={isOpen}
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)} (Click to switch)`}
        className="relative inline-flex items-center justify-center p-2 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#111111] dark:text-zinc-200 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 hover:border-[#BEBDB9] dark:hover:border-zinc-700 active:scale-95 transition-all cursor-pointer shadow-2xs"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ rotate: -45, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 45, scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            {currentIcon}
          </motion.div>
        </AnimatePresence>

        {showLabel && (
          <span className="ml-2 text-xs font-semibold text-[#111111] dark:text-white capitalize">
            {theme}
          </span>
        )}
      </button>

      {/* Floating 3-Mode Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-[#141417] border border-[#EAEAE5] dark:border-zinc-800 shadow-xl p-1 z-50 overflow-hidden"
          >
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9E9D98] dark:text-zinc-500 border-b border-[#F5F4EE] dark:border-zinc-800/80 mb-1">
              Appearance
            </div>
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#F5F4EE] dark:bg-zinc-800 text-[#111111] dark:text-white font-semibold"
                      : "text-[#6E6D68] dark:text-zinc-400 hover:bg-[#FBFBFA] dark:hover:bg-zinc-800/50 hover:text-[#111111] dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-3.5 w-3.5 ${
                      opt.id === "light"
                        ? "text-amber-500"
                        : opt.id === "dark"
                        ? "text-indigo-400"
                        : "text-[#6E6D68] dark:text-zinc-400"
                    }`} />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-[#111111] dark:text-white" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeToggle;
