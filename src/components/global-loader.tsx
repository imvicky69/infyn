"use client";

import React from "react";
import { AnimatedLogo } from "@/components/animatedLogo";

interface GlobalLoaderProps {
  /** Optional loading message displayed under the infinity loop */
  text?: string;
  /** Whether to render as a full-screen fixed backdrop overlay */
  fullScreen?: boolean;
  /** Size scale of the loader */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

export function GlobalLoader({
  text = "Processing...",
  fullScreen = false,
  size = "md",
  className = "",
}: GlobalLoaderProps) {
  const widthMap = {
    sm: 44,
    md: 64,
    lg: 88,
  };

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center select-none ${className}`}
      style={{ animation: "fade-in-up 0.25s ease-out" }}
    >
      <div className="relative flex items-center justify-center">
        {/* Ambient background glow ring */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 blur-xl opacity-80 animate-pulse pointer-events-none" />
        
        {/* Animated Infinity Loader */}
        <AnimatedLogo variant="loader" width={widthMap[size]} speed="normal" />
      </div>

      {text && (
        <div className="space-y-1">
          <p className="text-sm font-bold text-[#111111] dark:text-white tracking-tight">
            {text}
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-md transition-all"
        role="status"
        aria-live="polite"
      >
        <div className="p-8 rounded-3xl bg-white/90 dark:bg-[#141417]/90 border border-[#EAEAE5] dark:border-zinc-800 shadow-2xl max-w-sm w-[90%] mx-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

export default GlobalLoader;
