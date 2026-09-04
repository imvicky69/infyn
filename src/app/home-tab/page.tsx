"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Download,
  Sparkles,
  ChevronDown,
  Layers,
  Code2,
  Flame,
  Timer,
  Search,
  Lock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Palette,
  CheckSquare2,
  Clock,
  Terminal,
  ShieldCheck,
  Zap,
  Monitor,
  Heart,
  Calendar,
  CloudSun,
  LayoutDashboard,
  GitBranch,
  Copy,
  Check,
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

const FAQS = [
  {
    q: "Is Infyn Home Tab 100% free and open source?",
    a: "Yes! Infyn Home Tab is licensed under the MIT License and completely open source. There are no subscriptions, no tracking ads, and no locked features. All code is available on GitHub for community inspection and contributions.",
  },
  {
    q: "Does the extension upload my notes, bookmarks, or project data to any servers?",
    a: "Never. Strict 100% client-side privacy is our core philosophy across all Infyn tools. All your data stays exclusively on your machine via chrome.storage.local and localStorage. No analytics or tracking scripts are ever injected.",
  },
  {
    q: "Which web browsers are supported?",
    a: "Infyn Home Tab is built on Chrome Manifest V3 and runs seamlessly on all modern Chromium desktop browsers including Google Chrome, Brave, Arc Browser, Microsoft Edge, Opera, and Vivaldi.",
  },
  {
    q: "How does the Pomodoro Focus Timer toolbar badge work?",
    a: "A background Manifest V3 service worker and chrome.alarms keep the countdown running smoothly even when you switch tabs or close the new tab window. It updates the extension icon badge in real-time (e.g., '25m', '14m'), and clicking the toolbar icon instantly toggles timer pause/play.",
  },
  {
    q: "Can I customize the widgets, screens, and backgrounds?",
    a: "Yes. You can switch between Home, Productivity, and Dev screens, reorder or resize widgets, choose between curated gradient wallpapers or interactive WebGL particle light shaders (Lightfall), and customize search engines.",
  },
  {
    q: "How do I install or update it?",
    a: "Download the latest release ZIP from our GitHub Releases page, unzip it, navigate to chrome://extensions/, enable Developer Mode, and click 'Load unpacked'. To update, simply download the new release ZIP and hit the reload button on the extension card.",
  },
];

export default function HomeTabPage() {
  const [activeScreenTab, setActiveScreenTab] = useState<"home" | "productivity" | "dev">("home");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [copiedClone, setCopiedClone] = useState(false);

  const handleCopyClone = () => {
    navigator.clipboard.writeText("git clone https://github.com/imvicky69/infyn-home-tab.git");
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0B0B0C] text-[#111111] dark:text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
        {/* ── 1. Hero Section ────────────────────────────────────────── */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-2 sm:pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Open Source Chrome & Chromium Extension</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200">
              v1.0.0
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-[#111111] dark:text-white leading-[1.1]">
            Supercharge Your New Tab. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Built for Developers.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#6E6D68] dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Turn every new tab into an instantaneous command center. Quick-launch your pinned GitHub repositories with 1-click clone, jump into Firebase consoles, stay in the zone with Pomodoro timer badge sync, and search with multi-engine omnisearch.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <a
              href="https://github.com/imvicky69/infyn-home-tab/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md group"
            >
              <Download className="h-4 w-4" />
              <span>Download Extension (.zip / .crx)</span>
            </a>

            <a
              href="https://github.com/imvicky69/infyn-home-tab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-bold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-2xs"
            >
              <GithubIcon className="h-4 w-4" />
              <span>View Source on GitHub</span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
            </a>
          </div>

          {/* Value Verification Badges */}
          <div className="pt-2 flex flex-wrap justify-center gap-4 sm:gap-8 text-xs font-semibold text-[#6E6D68] dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Zero Server Uploads
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              100% Free & Open Source
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Manifest V3 Fast
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Zero Analytics & Ads
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#6E6D68] dark:text-zinc-400 pt-1">
            <span className="font-semibold text-[#111111] dark:text-zinc-300">Supported:</span>
            {["Google Chrome", "Brave", "Arc", "Microsoft Edge", "Opera", "Vivaldi"].map((browser) => (
              <span
                key={browser}
                className="px-2.5 py-1 rounded-lg bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 font-medium text-[11px]"
              >
                {browser}
              </span>
            ))}
          </div>
        </section>

        {/* ── 2. Screenshots & Interactive Tour ───────────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-4 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F4EE] dark:border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white">
                Interactive Workspace Tour
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                Smooth vertical snap between dedicated screens tailored for focus, development, and daily workflow
              </p>
            </div>

            {/* Screen Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveScreenTab("home")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeScreenTab === "home"
                    ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-xs"
                    : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                }`}
              >
                🏠 Screen 1: Home Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveScreenTab("productivity")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeScreenTab === "productivity"
                    ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-xs"
                    : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                }`}
              >
                ⚡ Screen 2: Productivity Suite
              </button>
              <button
                type="button"
                onClick={() => setActiveScreenTab("dev")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeScreenTab === "dev"
                    ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-xs"
                    : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                }`}
              >
                🛠️ Screen 3: Developer Command Center
              </button>
            </div>
          </div>

          {/* Screenshot Display */}
          <div className="relative rounded-2xl overflow-hidden border border-[#EAEAE5] dark:border-zinc-800 shadow-xl bg-black">
            <AnimatePresence mode="wait">
              {activeScreenTab === "home" && (
                <motion.div
                  key="home-screen"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <Image
                    src="/home-tab/screenshot-1.png"
                    alt="Infyn Home Tab - Screen 1 Home Dashboard"
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="p-4 sm:p-5 bg-white dark:bg-[#121214] border-t border-[#EAEAE5] dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
                      <strong className="text-[#111111] dark:text-white font-semibold">Features:</strong> Ambient live clock with seconds, real-time localized weather, calendar view, and quick-launch bookmarks grid with custom favicons.
                    </p>
                    <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                      Screen 1 / 3
                    </span>
                  </div>
                </motion.div>
              )}

              {activeScreenTab === "productivity" && (
                <motion.div
                  key="productivity-screen"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <Image
                    src="/home-tab/screenshot-2.png"
                    alt="Infyn Home Tab - Screen 2 Productivity Board"
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="p-4 sm:p-5 bg-white dark:bg-[#121214] border-t border-[#EAEAE5] dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
                      <strong className="text-[#111111] dark:text-white font-semibold">Features:</strong> Pomodoro Focus Timer with Chrome extension toolbar badge countdown, persistent auto-saving scratchpad notes, and interactive priority task board.
                    </p>
                    <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                      Screen 2 / 3
                    </span>
                  </div>
                </motion.div>
              )}

              {activeScreenTab === "dev" && (
                <motion.div
                  key="dev-screen"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 p-6 sm:p-10 bg-[#121214] text-white"
                >
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-indigo-400" />
                      <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                        Developer Command Center Mockup & Deep-Links
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* GitHub Card Preview */}
                      <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-indigo-400" />
                            <span className="text-sm font-bold text-white">Pinned Repositories</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                            1-Click Clone
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Pin your active repos. View star counts, branches, PRs, and issues.
                        </p>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs">
                          <span className="text-zinc-300 truncate">git clone https://github.com/...</span>
                          <button
                            type="button"
                            onClick={handleCopyClone}
                            className="ml-2 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-sans flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {copiedClone ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedClone ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Firebase Console Preview */}
                      <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-amber-400" />
                            <span className="text-sm font-bold text-white">Firebase Direct Consoles</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                            Shortcuts
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Instant deep-links into Firestore DB, Authentication users, Cloud Storage buckets, and Cloud Functions.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {["Firestore", "Auth", "Storage", "Functions", "Settings"].map((item) => (
                            <span
                              key={item}
                              className="px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700 text-[11px] text-amber-300 font-medium"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
                      <p>
                        <strong className="text-white font-semibold">Screen 3 (Dev):</strong> Dedicated developer hub configured directly with your GitHub username or token and Firebase project IDs.
                      </p>
                      <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                        Screen 3 / 3
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── 3. Key Features Bento Grid ─────────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#111111] dark:text-white">
              Engineered for Speed, Focus & Developers
            </h2>
            <p className="text-sm sm:text-base text-[#6E6D68] dark:text-zinc-400">
              No bloated news feeds, no intrusive sponsor cards. Just pure productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Code2,
                color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/80",
                title: "GitHub Command Center",
                desc: "Switch between your pinned repositories, view active branches, copy git clone command in 1 click, and deep link into PRs, Issues, and Actions.",
              },
              {
                icon: Flame,
                color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/80",
                title: "Firebase Console Deep-Links",
                desc: "One-click shortcuts to project-specific Firestore database, Authentication, Cloud Storage buckets, Cloud Functions, and Project Settings.",
              },
              {
                icon: Timer,
                color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/80",
                title: "Pomodoro Toolbar Badge Sync",
                desc: "25m focus / 5m break / 45m deep work modes. Manifest V3 background worker keeps the countdown ticking and displays live minutes directly on your browser extension icon.",
              },
              {
                icon: Search,
                color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/80",
                title: "Multi-Engine Omnisearch",
                desc: "Hit '/' or 'Cmd+K' to focus. Switch effortlessly between Google, ChatGPT, ChatGPT Anonymous (temporary chat mode), Perplexity AI, DuckDuckGo, and GitHub.",
              },
              {
                icon: CheckSquare2,
                color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80",
                title: "Priority Todo & Milestone Board",
                desc: "Star high-priority sprint tasks, categorize with custom tags (Work, Personal, Dev), edit inline, and track daily progress with a fluid glassmorphic progress bar.",
              },
              {
                icon: Palette,
                color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800/80",
                title: "Live WebGL Particle Shaders",
                desc: "Custom WebGL fluid light particle streaks (Lightfall) responding to mouse movement, plus 12 curated ambient wallpapers and full dark/light modes.",
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-3 shadow-2xs hover:border-[#BEBDB9] dark:hover:border-zinc-700 transition-colors"
                >
                  <div className={`h-10 w-10 rounded-2xl border flex items-center justify-center ${f.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#111111] dark:text-white">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. 1-2-3 Installation Guide ────────────────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-10 space-y-8 shadow-sm">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Quick Setup
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
              Install in Under 60 Seconds
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
              No account, no tracking extension permissions. Clean and simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Download the Release",
                desc: "Grab the latest pre-built 'infyn-home-tab-v*.zip' from our GitHub Releases page and unzip it into a folder on your computer.",
              },
              {
                step: "02",
                title: "Enable Developer Mode",
                desc: "Open 'chrome://extensions/' (or brave://extensions, edge://extensions) in your browser and toggle on 'Developer mode' in the top-right.",
              },
              {
                step: "03",
                title: "Load Unpacked",
                desc: "Click the 'Load unpacked' button in the top toolbar and select the unzipped directory. Press Ctrl+T / Cmd+T and enjoy your new dashboard!",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/50 border border-[#EAEAE5] dark:border-zinc-800 space-y-3 relative"
              >
                <span className="text-2xl sm:text-3xl font-black text-indigo-500/30 dark:text-indigo-400/20 font-mono">
                  {s.step}
                </span>
                <h3 className="text-base font-bold text-[#111111] dark:text-white">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <a
              href="https://github.com/imvicky69/infyn-home-tab/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Get Latest Release on GitHub</span>
            </a>
          </div>
        </section>

        {/* ── 5. Open Source & Contributing Callout + Sister Projects ── */}
        <section className="rounded-3xl border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950/20 dark:via-[#121214] dark:to-purple-950/20 p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 text-xs font-bold">
                <Heart className="h-3.5 w-3.5 text-rose-500 fill-current" />
                100% Free & Open Source
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
                Built in Public for the Infyn Community
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Like all projects in the <strong className="text-[#111111] dark:text-white">Infyn</strong> software family, Infyn Home Tab is licensed under MIT. We welcome pull requests, new developer widgets, bug reports, and suggestions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="https://github.com/imvicky69/infyn-home-tab/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
              >
                <span>Read Contributing Guide</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <a
                href="https://github.com/imvicky69/infyn-home-tab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm font-semibold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <GithubIcon className="h-4 w-4" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>

          {/* Sister Projects Cross-Link Card */}
          <div className="pt-4 border-t border-indigo-100 dark:border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/"
              className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors block group"
            >
              <h4 className="text-xs font-bold text-[#111111] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                ∞ Infyn Web Suite
              </h4>
              <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 mt-1">
                Client-side PDF & Image utilities with zero cloud uploads.
              </p>
            </Link>

            <Link
              href="/dl"
              className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors block group"
            >
              <h4 className="text-xs font-bold text-[#111111] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Infyn DL
              </h4>
              <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 mt-1">
                Universal media & playlist downloader for Windows & Android.
              </p>
            </Link>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 block">
              <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                Infyn Home Tab (You are here)
              </h4>
              <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-1">
                Sleek developer new-tab extension for Chromium browsers.
              </p>
            </div>
          </div>
        </section>

        {/* ── 6. Interactive FAQ Accordion ──────────────────────────── */}
        <section className="space-y-4 max-w-3xl mx-auto">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Questions & Answers
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
              Everything you need to know about Infyn Home Tab
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {FAQS.map((faq, index) => {
              const isOpen = expandedFaq === index;
              const num = String(index + 1).padStart(2, "0");
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] overflow-hidden transition-colors shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#111111] dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-[#BEBDB9] dark:text-zinc-600 font-mono">
                        {num}
                      </span>
                      <span>{faq.q}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : "text-[#9E9D98]"
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed border-t border-[#F5F4EE] dark:border-zinc-800/80 mt-1 pl-10 sm:pl-11">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 7. Bottom CTA Banner ──────────────────────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#111111] dark:bg-[#121214] text-white p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              100% Free & Open Source
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em]">
              Elevate Your Daily Browsing
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Open source, 100% private, zero telemetry. Download the extension today or fork it on GitHub.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://github.com/imvicky69/infyn-home-tab/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#111111] text-xs sm:text-sm font-bold hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download Extension (.zip / .crx)</span>
            </a>

            <a
              href="https://github.com/imvicky69/infyn-home-tab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-700 bg-zinc-900/60 text-xs sm:text-sm font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <GithubIcon className="h-4 w-4" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
