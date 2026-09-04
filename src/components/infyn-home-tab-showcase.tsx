"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code2,
  Flame,
  Timer,
  Search,
  CheckCircle2,
  Lock,
  Layers,
  Palette,
  CheckSquare2,
  FileText,
  Download,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

const KEY_PILLS = [
  { label: "GitHub & Firebase Widgets", icon: Code2 },
  { label: "Pomodoro Badge Sync", icon: Timer },
  { label: "Omnisearch (Cmd+K)", icon: Search },
  { label: "Scratchpad & Todos", icon: CheckSquare2 },
  { label: "WebGL Shaders", icon: Palette },
];

const FEATURES = [
  {
    icon: Code2,
    color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/80",
    title: "GitHub Command Center",
    desc: "Quick-switch pinned repositories, view branch stats, and copy git clone commands in 1 click.",
  },
  {
    icon: Flame,
    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/80",
    title: "Firebase Quick Consoles",
    desc: "Direct deep-links into Firestore, Auth, Storage, Cloud Functions, and Project Settings.",
  },
  {
    icon: Timer,
    color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/80",
    title: "Pomodoro Toolbar Badge",
    desc: "Manifest V3 background worker shows live countdown minutes directly on your browser extension icon.",
  },
  {
    icon: Search,
    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/80",
    title: "Omnisearch (Cmd+K)",
    desc: "Switch instantly between Google, ChatGPT, ChatGPT Anonymous, Perplexity, and GitHub.",
  },
  {
    icon: Layers,
    color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/80",
    title: "Multi-Screen Workspace",
    desc: "Vertical snap glide between Home, Productivity, and Dev screens with customizable layout.",
  },
  {
    icon: CheckSquare2,
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80",
    title: "Priority Todo & Task Board",
    desc: "Star high-priority tasks, organize with custom tags, and manage sprint progress in glassmorphic UI.",
  },
  {
    icon: Palette,
    color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800/80",
    title: "WebGL Live Shaders",
    desc: "Custom WebGL fluid light particle shaders (Lightfall) and curated ambient gradient themes.",
  },
  {
    icon: ShieldCheck,
    color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800/80",
    title: "100% Client-Side Privacy",
    desc: "Zero tracking, zero analytics, zero servers. Everything stays purely inside chrome.storage.local.",
  },
];

export function InfynHomeTabShowcase() {
  const [activeScreen, setActiveScreen] = useState<"home" | "productivity">("home");

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-10 shadow-sm">
      {/* Subtle ambient gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-tight">
                <Sparkles className="h-3.5 w-3.5" />
                New Open Source Project
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 border border-[#EAEAE5] dark:border-zinc-700">
                v1.0.0
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                Chromium • Chrome • Brave • Arc • Edge
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111111] dark:text-white tracking-[-0.03em] leading-tight">
              Infyn Home Tab — Developer Productivity Homescreen
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#6E6D68] dark:text-zinc-400 leading-[1.6]">
              A sleek, 100% private new-tab dashboard for developers and power users. Direct GitHub repos with 1-click clone, Firebase console deep-links, Pomodoro timer with live toolbar badge sync, and multi-engine omnisearch.
            </p>

            {/* Key Feature Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {KEY_PILLS.map((pill) => {
                const Icon = pill.icon;
                return (
                  <span
                    key={pill.label}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 text-[11px] font-medium text-[#111111] dark:text-zinc-300"
                  >
                    <Icon className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                    {pill.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/home-tab"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs sm:text-sm font-bold hover:bg-black dark:hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm group"
            >
              <span>Explore Home Tab & Install</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Dual-Screen Interactive Visual Mockup */}
        <div className="rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/40 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAEAE5] dark:border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-[#111111] dark:text-white uppercase tracking-wider">
                Interactive Screen Tour
              </span>
            </div>

            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveScreen("home")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeScreen === "home"
                    ? "bg-white dark:bg-zinc-900 text-[#111111] dark:text-white shadow-xs"
                    : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                }`}
              >
                Screen 1: Home Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveScreen("productivity")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeScreen === "productivity"
                    ? "bg-white dark:bg-zinc-900 text-[#111111] dark:text-white shadow-xs"
                    : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                }`}
              >
                Screen 2: Productivity Suite
              </button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-[#EAEAE5] dark:border-zinc-800 shadow-md bg-black">
            <AnimatePresence mode="wait">
              {activeScreen === "home" ? (
                <motion.div
                  key="showcase-home"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <Image
                    src="/home-tab/screenshot-1.png"
                    alt="Infyn Home Tab - Screen 1 Home Dashboard"
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="p-3 bg-white dark:bg-[#121214] border-t border-[#EAEAE5] dark:border-zinc-800 flex flex-wrap items-center justify-between text-xs text-[#6E6D68] dark:text-zinc-400">
                    <span>
                      <strong className="text-[#111111] dark:text-white font-semibold">Home Dashboard:</strong> Ambient clock with live seconds, real-time localized weather, calendar, and quick-launch grid.
                    </span>
                    <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      Screen 1
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="showcase-prod"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <Image
                    src="/home-tab/screenshot-2.png"
                    alt="Infyn Home Tab - Screen 2 Productivity Board"
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="p-3 bg-white dark:bg-[#121214] border-t border-[#EAEAE5] dark:border-zinc-800 flex flex-wrap items-center justify-between text-xs text-[#6E6D68] dark:text-zinc-400">
                    <span>
                      <strong className="text-[#111111] dark:text-white font-semibold">Productivity Suite:</strong> Pomodoro timer with extension badge sync, auto-saving scratchpad, and priority sprint task board.
                    </span>
                    <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      Screen 2
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/50 space-y-2 hover:border-[#BEBDB9] dark:hover:border-zinc-700 transition-colors"
              >
                <div className={`h-8 w-8 rounded-xl border flex items-center justify-center ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#111111] dark:text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 mt-1 leading-[1.5]">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action / Download Buttons Row */}
        <div className="pt-2 border-t border-[#F5F4EE] dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/home-tab"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm font-semibold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-2xs"
            >
              <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Download Extension</span>
              <span className="text-[10px] font-mono text-[#9E9D98] dark:text-zinc-500">
                (.zip / .crx)
              </span>
            </Link>

            <a
              href="https://github.com/imvicky69/infyn-home-tab/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-[#6E6D68] dark:text-zinc-300 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
              <span>GitHub Releases</span>
            </a>
          </div>

          <a
            href="https://github.com/imvicky69/infyn-home-tab"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-transparent hover:border-[#EAEAE5] dark:hover:border-zinc-800 text-xs font-semibold text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition-all"
            aria-label="View on GitHub"
          >
            <GithubIcon className="h-4 w-4" />
            <span>imvicky69/infyn-home-tab</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>
      </div>
    </section>
  );
}
