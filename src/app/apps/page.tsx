"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import SplitText from "@/components/SplitText";
import {
  Download,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Monitor,
  Smartphone,
  Globe,
  Music,
  Bookmark,
  Calendar,
  CloudSun,
  Timer,
  CheckSquare2,
  FileText,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { triggerPWAInstall } from "@/components/pwa/pwa-installer";

export default function AppsHubPage() {
  return (
    <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-14 space-y-14">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-blue-800 dark:text-blue-300 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Installable Native Apps & Browser Extensions</span>
          </div>

          <SplitText
            text="Apps & Extensions"
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111111] dark:text-white"
            delay={25}
            duration={0.7}
            splitType="words"
          />

          <p className="text-base sm:text-lg text-[#6E6D68] dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Fast, clean, and ad-free software designed for everyone. Built for daily productivity, music, bookmarks, and focus — running directly on your device.
          </p>
        </div>

        {/* Core Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 1. Infyn Web App (PWA) */}
          <div className="group flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] hover:border-[#BEBDB9] dark:hover:border-zinc-700 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center text-blue-700 dark:text-blue-400 shadow-2xs group-hover:scale-105 transition-transform">
                  <Smartphone className="h-7 w-7" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    <span>iOS & Android</span>
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-1">
                    <span>PWA</span>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-[#111111] dark:text-white">
                  Infyn Web App
                </h2>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  Installable Progressive Web App (PWA)
                </p>
                <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed pt-1">
                  Install directly on your iPhone, Android, or PC without app store downloads. Full offline support, instant launches, and zero cloud uploads.
                </p>
              </div>

              {/* Feature Tags */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-medium text-[#6E6D68] dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Works Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Add to Home Screen</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Zero Storage Bloat</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>100% Free & Private</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#F5F4EE] dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-mono text-[#9E9D98]">
                Web Standard · Instant
              </span>
              <button
                type="button"
                onClick={() => triggerPWAInstall()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all cursor-pointer shadow-2xs"
              >
                <span>Install Web App</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Infyn DL */}
          <div className="group flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] hover:border-[#BEBDB9] dark:hover:border-zinc-700 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-2xs group-hover:scale-105 transition-transform">
                  <Download className="h-7 w-7" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-1">
                    <Monitor className="h-3 w-3" />
                    <span>Windows</span>
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    <span>Android</span>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-[#111111] dark:text-white">
                  Infyn DL
                </h2>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Universal Media, Music & Playlist Downloader
                </p>
                <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed pt-1">
                  Download 320kbps pristine MP3 audio, extract songs from YouTube Music, or grab entire 200+ track playlists in parallel. Zero ads, no subscriptions, offline playback.
                </p>
              </div>

              {/* Feature Tags */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-medium text-[#6E6D68] dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <Music className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>320kbps MP3 Audio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Batch Playlist Selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>8 Parallel Streams</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>100% Ad-Free & Offline</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#F5F4EE] dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-mono text-[#9E9D98]">
                Setup Wizard · Portable ZIP · APK
              </span>
              <Link
                href="/dl"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all cursor-pointer shadow-2xs"
              >
                <span>Get Infyn DL</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. Infyn Home Tab */}
          <div className="group flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] hover:border-[#BEBDB9] dark:hover:border-zinc-700 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-center text-indigo-700 dark:text-indigo-400 shadow-2xs group-hover:scale-105 transition-transform">
                  <LayoutDashboard className="h-7 w-7" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    <span>Chrome · Brave · Edge · Arc</span>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-[#111111] dark:text-white">
                  Infyn Home Tab
                </h2>
                <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                  Clean Bookmarks, Weather & Focus Dashboard
                </p>
                <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed pt-1">
                  Replace cluttered browser start pages with a calm, aesthetic new tab. Instant visual bookmarks, live weather & calendar, a deep focus Pomodoro timer, and daily task board.
                </p>
              </div>

              {/* Feature Tags */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-medium text-[#6E6D68] dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Visual Bookmark Organizer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudSun className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Live Weather & Calendar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Focus / Pomodoro Sprint</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Daily Productivity Board</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#F5F4EE] dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-mono text-[#9E9D98]">
                Chrome Extension · Free & Open Source
              </span>
              <Link
                href="/home-tab"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all cursor-pointer shadow-2xs"
              >
                <span>Get Home Tab</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Future Apps Pipeline */}
        <div className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F4EE] dark:border-zinc-800/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#111111] dark:text-white">
                Upcoming Apps & Extensions
              </h3>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                Native tools in active planning for our free and ad-free software suite.
              </p>
            </div>
            <a
              href="https://github.com/imvicky69/infyn/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#111111] dark:text-white hover:underline flex items-center gap-1"
            >
              <span>Suggest an App or Extension</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800/80 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-center text-rose-600">
                <Monitor className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-[#111111] dark:text-white">
                Infyn Screen & Audio Recorder
              </h4>
              <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Lightweight, private desktop screen capture with microphone and system audio without cloud uploads.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800/80 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 flex items-center justify-center text-amber-600">
                <FileText className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-[#111111] dark:text-white">
                Clipboard & Snippets Manager
              </h4>
              <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Local-first clipboard history and custom text expander that never transmits keystrokes online.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800/80 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/60 flex items-center justify-center text-purple-600">
                <Bookmark className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-[#111111] dark:text-white">
                Tab Stash & Session Saver
              </h4>
              <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Save groups of browser tabs with 1 click to free up RAM and restore research sessions anytime.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
