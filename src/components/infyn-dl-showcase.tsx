"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  Smartphone,
  Monitor,
  Zap,
  HardDrive,
  Bell,
  Music,
  WifiOff,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  CheckSquare,
  ListMusic,
  FolderDown,
  RefreshCw
} from "lucide-react";
import { fetchLatestRelease, FALLBACK_RELEASE, InfynDlRelease } from "@/lib/github-releases";

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

export function InfynDlShowcase() {
  const [release, setRelease] = useState<InfynDlRelease>(FALLBACK_RELEASE);

  useEffect(() => {
    fetchLatestRelease().then((data) => {
      setRelease(data);
    });
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-10 shadow-sm">
      {/* Subtle ambient gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500/10 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-tight">
                <Sparkles className="h-3.5 w-3.5" />
                New Open Source Project
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 border border-[#EAEAE5] dark:border-zinc-700">
                {release.version}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                Android & Windows
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111111] dark:text-white tracking-[-0.03em] leading-tight">
              infyn-dl — Media, Audio & Playlist Downloader
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#6E6D68] dark:text-zinc-400 leading-[1.6]">
              A free, open-source downloader for Android and Windows. Paste any YouTube, music, or video link → download single files or full playlists with granular song selection → save directly to your phone or PC.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dl"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs sm:text-sm font-bold hover:bg-black dark:hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm group"
            >
              <span>Explore /dl Hub</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {[
            {
              icon: ListMusic,
              color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/80",
              title: "Full Playlist Support",
              desc: "Paste entire YouTube or YouTube Music playlist links and load all tracks in seconds.",
            },
            {
              icon: CheckSquare,
              color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80",
              title: "Select / Deselect Songs",
              desc: "Easily toggle individual songs on or off with 1-click select/deselect all controls.",
            },
            {
              icon: Layers,
              color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/80",
              title: "Parallel Batch Engine",
              desc: "Download multiple playlist songs simultaneously with 8 parallel streams per track.",
            },
            {
              icon: Music,
              color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/80",
              title: "320kbps Pristine MP3",
              desc: "Local FFmpeg conversion with track numbering, artist metadata, and cover art.",
            },
            {
              icon: HardDrive,
              color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/80",
              title: "Direct Storage Save",
              desc: "Saves straight to phone Downloads/Music folder with automatic Android MediaScanner indexing.",
            },
            {
              icon: Bell,
              color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/80",
              title: "Background Service",
              desc: "Persistent notification keeps downloads running seamlessly when switching apps or screen off.",
            },
            {
              icon: RefreshCw,
              color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800/80",
              title: "1-Tap Engine Updates",
              desc: "Update the underlying yt-dlp core directly from Settings without reinstalling the app.",
            },
            {
              icon: WifiOff,
              color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800/80",
              title: "100% Offline & Ad-Free",
              desc: "No accounts, no paywalls, zero cloud tracking. Downloaded files are yours forever.",
            },
          ].map((item, idx) => {
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
            <a
              href={release.androidApk.downloadUrl}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm font-semibold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-2xs"
            >
              <Smartphone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Android APK</span>
              <span className="text-[10px] font-mono text-[#9E9D98] dark:text-zinc-500">
                ({release.androidApk.formattedSize})
              </span>
            </a>

            <a
              href={release.windowsSetup.downloadUrl}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm font-semibold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-2xs"
            >
              <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Windows Setup</span>
              <span className="text-[10px] font-mono text-[#9E9D98] dark:text-zinc-500">
                ({release.windowsSetup.formattedSize})
              </span>
            </a>

            <a
              href={release.windowsPortable.downloadUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-[#6E6D68] dark:text-zinc-300 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-all"
            >
              <span>Portable (.zip)</span>
            </a>
          </div>

          <a
            href="https://github.com/imvicky69/infyn-dl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-transparent hover:border-[#EAEAE5] dark:hover:border-zinc-800 text-xs font-semibold text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition-all"
            aria-label="View on GitHub"
          >
            <GithubIcon className="h-4 w-4" />
            <span>imvicky69/infyn-dl</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>
      </div>
    </section>
  );
}
