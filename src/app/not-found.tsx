"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import SplitText from "@/components/SplitText";

const QUICK_TOOLS = [
  {
    name: "Remove Background",
    href: "/image/bg-remover",
    badge: "AI 1.4",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    name: "Image Compressor",
    href: "/image/compressor",
    badge: "90% Save",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M4 10h6m0 0V4m0 6L3 3m17 7h-6m0 0V4m0 6l7-7" />
      </svg>
    ),
  },
  {
    name: "Image Resizer",
    href: "/image/resizer",
    badge: "Crop Studio",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
  },
  {
    name: "Universal Converter",
    href: "/image/converter",
    badge: "5 Formats",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
];

export default function NotFound() {
  const [isHoveringNumber, setIsHoveringNumber] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#E8E6DE] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center text-center space-y-10">
        
        {/* ── Cool Animated 404 Visual ─────────────────────────────────── */}
        <div className="relative flex items-center justify-center select-none py-4">
          
          {/* Animated Background Aura */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.35, 0.6, 0.35],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -inset-10 rounded-full bg-gradient-to-tr from-emerald-400/25 via-indigo-400/20 to-amber-300/20 blur-3xl pointer-events-none -z-10"
          />

          {/* Floating Kinetic "404" Numerals */}
          <div
            className="flex items-center gap-3 sm:gap-6 cursor-pointer"
            onMouseEnter={() => setIsHoveringNumber(true)}
            onMouseLeave={() => setIsHoveringNumber(false)}
          >
            {/* Left 4 */}
            <motion.div
              animate={{
                y: isHoveringNumber ? [-4, 4, -4] : [-6, 6, -6],
                rotate: isHoveringNumber ? -6 : -2,
              }}
              transition={{
                y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 0.3 },
              }}
              className="text-7xl sm:text-9xl font-black tracking-tighter text-[#111111] drop-shadow-sm font-mono"
            >
              4
            </motion.div>

            {/* Center Animated Infinity / Portal Ring */}
            <motion.div
              animate={{
                scale: isHoveringNumber ? 1.15 : [1, 1.05, 1],
                rotate: [0, 360],
              }}
              transition={{
                scale: { duration: 0.3 },
                rotate: { duration: 18, repeat: Infinity, ease: "linear" },
              }}
              className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-3xl sm:rounded-4xl border-2 border-[#111111] bg-white shadow-xl flex items-center justify-center p-3 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-indigo-50/50 to-amber-50/30 opacity-80" />
              
              {/* Inner Rotating Dashed Ring */}
              <motion.svg
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] text-[#BEBDB9]"
                fill="none"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                />
              </motion.svg>

              {/* Center Infinity Glyph */}
              <svg
                className="relative z-10 w-10 h-10 sm:w-14 sm:h-14 text-[#111111] group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.581 0-4.581 8 0 8 5.606 0 7.644-8 12.74-8z" />
              </svg>
            </motion.div>

            {/* Right 4 */}
            <motion.div
              animate={{
                y: isHoveringNumber ? [4, -4, 4] : [6, -6, 6],
                rotate: isHoveringNumber ? 6 : 2,
              }}
              transition={{
                y: { duration: 3.6, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 0.3 },
              }}
              className="text-7xl sm:text-9xl font-black tracking-tighter text-[#111111] drop-shadow-sm font-mono"
            >
              4
            </motion.div>
          </div>
        </div>

        {/* ── Text Content ────────────────────────────────────────────── */}
        <div className="space-y-3 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EAEAE5] text-[11px] font-bold text-[#6E6D68] shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Page Not Found • Zero Server Errors</span>
          </div>

          <SplitText
            text="Lost in the Infinite Void."
            className="text-2xl sm:text-4xl font-extrabold text-[#111111] tracking-tight"
            delay={30}
            duration={0.8}
            splitType="words, chars"
            tag="h1"
            textAlign="center"
          />

          <p className="text-xs sm:text-sm text-[#6E6D68] leading-relaxed">
            The tool or page you are looking for has been moved, renamed, or never uploaded to our client-side cache.
          </p>
        </div>

        {/* ── Primary Action Buttons ──────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          <Link
            href="/"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-2xl bg-[#111111] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#262626] active:scale-95 transition-all shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span>Back to Home</span>
          </Link>

          <Link
            href="/image"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-2xl border border-[#EAEAE5] bg-white px-6 py-3 text-xs sm:text-sm font-bold text-[#111111] hover:bg-[#F5F4EE] hover:border-[#BEBDB9] active:scale-95 transition-all shadow-2xs"
          >
            <span>Explore All Tools</span>
            <svg className="h-4 w-4 text-[#6E6D68]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* ── Popular Image Tools Grid ─────────────────────────────────── */}
        <div className="w-full max-w-2xl pt-6 border-t border-[#EAEAE5] space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E9D98]">
            Popular In-Browser Tools
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
            {QUICK_TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="p-3.5 rounded-2xl border border-[#EAEAE5] bg-white/80 hover:bg-white hover:border-[#BEBDB9] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-[#F5F4EE] text-[#111111] border border-[#EAEAE5] group-hover:scale-105 transition-transform">
                    {t.icon}
                  </div>
                  <span className="font-bold text-xs text-[#111111] truncate">
                    {t.name}
                  </span>
                </div>

                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${t.badgeColor}`}>
                  {t.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
