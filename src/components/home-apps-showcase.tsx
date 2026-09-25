"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Download,
  Smartphone,
  LayoutDashboard,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  Compass,
  Smile,
} from "lucide-react";
import {
  fetchLatestRelease,
  FALLBACK_RELEASE,
  InfynDlRelease,
  fetchLatestSmileyPdfRelease,
  FALLBACK_SMILEY_PDF_RELEASE,
  SmileyPdfRelease,
} from "@/lib/github-releases";

export function HomeAppsShowcase() {
  const [dlRelease, setDlRelease] = useState<InfynDlRelease>(FALLBACK_RELEASE);
  const [smileyRelease, setSmileyRelease] = useState<SmileyPdfRelease>(FALLBACK_SMILEY_PDF_RELEASE);

  useEffect(() => {
    fetchLatestRelease()
      .then((data) => setDlRelease(data))
      .catch(() => {});
    fetchLatestSmileyPdfRelease()
      .then((data) => setSmileyRelease(data))
      .catch(() => {});
  }, []);

  return (
    <section className="space-y-6 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAEAE5] dark:border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold tracking-tight">
              <Sparkles className="h-3 w-3" />
              Standalone Suite
            </span>
            <span className="text-[11px] font-semibold text-[#9E9D98] dark:text-zinc-500">
              Zero Ads · 100% Free
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white tracking-[-0.02em]">
            Native Apps & Extensions
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#6E6D68] dark:text-zinc-400">
            Dedicated client-side software designed for speed, privacy, and everyday workflows.
          </p>
        </div>

        <Link
          href="/apps"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors group self-start sm:self-auto shrink-0"
        >
          <span>Explore All Apps</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid of the 3 Apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* App 1: Infyn DL */}
        <div className="relative group flex flex-col justify-between rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] p-6 sm:p-7 hover:border-emerald-500/40 dark:hover:border-emerald-500/30 hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-emerald-500/8 dark:bg-emerald-500/10 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

          <div className="relative space-y-4">
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
                <Smartphone className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
                  Android APK
                </span>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-400 border border-[#EAEAE5] dark:border-zinc-700">
                  Windows
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#111111] dark:text-white tracking-tight">
                  Infyn DL
                </h3>
                <span className="text-[10px] font-semibold text-[#9E9D98] dark:text-zinc-500">
                  {dlRelease.version}
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                High-Speed Media & Playlist Downloader
              </p>
              <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed mt-2.5">
                Download high-bitrate 320kbps MP3 audio and 1080p video directly to phone storage. Zero ads, background playback, and sleep timer.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {["⚡ 320kbps MP3", "📥 Bulk Playlists", "🚫 Zero Ads"].map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-[#F5F4EE] dark:bg-zinc-800/80 text-[#111111] dark:text-zinc-200 border border-[#EAEAE5] dark:border-zinc-700/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mt-6 pt-4 border-t border-[#F5F4EE] dark:border-zinc-800/80 flex flex-wrap items-center gap-2">
            <a
              href={dlRelease.androidApk?.downloadUrl || "https://github.com/imvicky69/infyn-dl/releases"}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-[#111111] hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-[#111111] text-xs font-bold transition-all shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download APK</span>
            </a>
            <Link
              href="/dl"
              className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-[#F5F4EE] hover:bg-[#EAEAE5] dark:bg-zinc-800 dark:hover:bg-zinc-750 text-[#111111] dark:text-white text-xs font-semibold border border-[#EAEAE5] dark:border-zinc-700 transition-colors"
            >
              <span>Details</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* App 2: Smiley PDF */}
        <div className="relative group flex flex-col justify-between rounded-3xl border border-amber-200/80 dark:border-amber-900/50 bg-white dark:bg-[#141417] p-6 sm:p-7 hover:border-amber-500/40 dark:hover:border-amber-500/30 hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-amber-500/10 dark:bg-amber-500/15 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

          <div className="relative space-y-4">
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 p-1 flex items-center justify-center shadow-sm shadow-amber-500/10 overflow-hidden">
                <Image
                  src="/smiley-logo.png"
                  alt="Smiley PDF"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                  Android APK
                </span>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
                  New
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#111111] dark:text-white tracking-tight">
                  Smiley PDF
                </h3>
                <span className="text-[10px] font-semibold text-[#9E9D98] dark:text-zinc-500">
                  {smileyRelease.version}
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                Joyful & Ad-Free Android PDF Reader
              </p>
              <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed mt-2.5">
                Hardware-accelerated PDFium rendering, in-place document rename, offline sandbox storage, and zero sensitive permissions.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {["⚡ PDFium 60fps", "🔒 Zero Permissions", "✨ OCR & Scan Suite"].map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-[#F5F4EE] dark:bg-zinc-800/80 text-[#111111] dark:text-zinc-200 border border-[#EAEAE5] dark:border-zinc-700/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mt-6 pt-4 border-t border-[#F5F4EE] dark:border-zinc-800/80 flex flex-wrap items-center gap-2">
            <a
              href={smileyRelease.arm64Apk?.downloadUrl || "https://github.com/imvicky69/smiley-pdf/releases"}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold transition-all shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download APK</span>
            </a>
            <Link
              href="/smiley-pdf"
              className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-[#F5F4EE] hover:bg-[#EAEAE5] dark:bg-zinc-800 dark:hover:bg-zinc-750 text-[#111111] dark:text-white text-xs font-semibold border border-[#EAEAE5] dark:border-zinc-700 transition-colors"
            >
              <span>Details</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* App 3: Infyn Home Tab */}
        <div className="relative group flex flex-col justify-between rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] p-6 sm:p-7 hover:border-indigo-500/40 dark:hover:border-indigo-500/30 hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-indigo-500/8 dark:bg-indigo-500/10 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

          <div className="relative space-y-4">
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60">
                  Extension
                </span>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-400 border border-[#EAEAE5] dark:border-zinc-700">
                  Chrome · Arc
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#111111] dark:text-white tracking-tight">
                  Infyn Home Tab
                </h3>
                <span className="text-[10px] font-semibold text-[#9E9D98] dark:text-zinc-500">
                  v1.2
                </span>
              </div>
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 mt-0.5">
                Minimalist Productivity & Startpage
              </p>
              <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed mt-2.5">
                Upgrade your browser new tab to a distraction-free command center. Features clean bookmarks, live weather, and Pomodoro timer.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {["🔖 Bookmarks", "🌤️ Live Weather", "⏱️ Pomodoro"].map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-[#F5F4EE] dark:bg-zinc-800/80 text-[#111111] dark:text-zinc-200 border border-[#EAEAE5] dark:border-zinc-700/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mt-6 pt-4 border-t border-[#F5F4EE] dark:border-zinc-800/80 flex flex-wrap items-center gap-2">
            <Link
              href="/home-tab"
              className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-[#111111] hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-[#111111] text-xs font-bold transition-all shadow-xs"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Get Extension</span>
            </Link>
            <Link
              href="/home-tab"
              className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-[#F5F4EE] hover:bg-[#EAEAE5] dark:bg-zinc-800 dark:hover:bg-zinc-750 text-[#111111] dark:text-white text-xs font-semibold border border-[#EAEAE5] dark:border-zinc-700 transition-colors"
            >
              <span>Preview</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
