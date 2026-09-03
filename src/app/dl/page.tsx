"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  fetchLatestRelease,
  FALLBACK_RELEASE,
  InfynDlRelease,
} from "@/lib/github-releases";
import {
  Download,
  Smartphone,
  Monitor,
  Zap,
  HardDrive,
  Bell,
  Music,
  RefreshCw,
  WifiOff,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Layers,
  CheckSquare,
  ListMusic,
  Info,
  Check,
  Globe,
  Filter,
  CheckSquare2,
  FolderCheck
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
    q: "Can I download full YouTube and YouTube Music playlists at once?",
    a: "Yes! Simply paste any playlist or album URL. Infyn DL will instantly scan and fetch all tracks in the playlist, showing the song title, artist, and duration for every single item.",
  },
  {
    q: "Can I select or deselect specific songs from a playlist before downloading?",
    a: "Yes. You have granular control with interactive checkboxes for every track. Use 'Select All' or 'Deselect All' to quickly cherry-pick only the songs you actually want, saving time and storage space.",
  },
  {
    q: "What makes infyn-dl different from online web downloaders?",
    a: "Online downloader websites inject spammy popup ads, throttle download speeds, and often cap playlist downloads at 5–10 songs. Infyn DL runs natively on your machine or phone without limits. It downloads parallel chunks directly to your storage at full connection speed with zero ads.",
  },
  {
    q: "How do I install the Android APK?",
    a: "Download the universal .apk file directly to your phone. Tap the download notification or locate it in your 'Files' app. When prompted by Android to allow installs from unknown sources, toggle 'Allow from this source'. Once installed, grant storage permission so it can save media to your Downloads or Music directory.",
  },
  {
    q: "Why does Windows SmartScreen show a blue warning during install?",
    a: "Windows SmartScreen displays an alert for newly published open-source programs that have not paid thousands of dollars for Microsoft enterprise code signing certificates. Simply click 'More info' and then click 'Run anyway'. The app is clean, virus-free, and fully open-source for community inspection.",
  },
  {
    q: "Do I need to install Python, FFmpeg, or yt-dlp separately on Windows?",
    a: "No! Both the Windows installer and the portable ZIP bundle come pre-packaged with an embedded yt-dlp engine and FFmpeg binaries. Everything works out of the box with zero command-line configuration.",
  },
  {
    q: "How do updates work if YouTube changes its format extraction?",
    a: "You don't need to wait for a new app release. Open infyn-dl, navigate to the Settings tab, and tap 'Check for Engine Updates'. It will update the underlying yt-dlp extractor to the latest version in seconds.",
  },
];

export default function DlPage() {
  const [release, setRelease] = useState<InfynDlRelease>(FALLBACK_RELEASE);
  const [activeTab, setActiveTab] = useState<"android" | "windows">("android");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchLatestRelease().then((data) => {
      setRelease(data);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#E8E6DE] selection:text-black bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20">
        
        {/* ── 1. Hero Section ────────────────────────────────────────── */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-2 sm:pt-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-tight">
              <Sparkles className="h-3.5 w-3.5" />
              Open Source Media & Playlist Downloader
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 border border-[#EAEAE5] dark:border-zinc-700">
              {release.version}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
              Android & Windows
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-[#111111] dark:text-white leading-[1.1]">
            High-Speed Media, Audio & Playlist Downloader
          </h1>

          <p className="text-[16px] sm:text-[18px] text-[#6E6D68] dark:text-zinc-400 leading-[1.6] max-w-2xl mx-auto">
            Download single videos, extract 320kbps MP3s, or grab entire playlists with granular song selection. <span className="font-semibold text-[#111111] dark:text-zinc-200">100% free, ad-free & offline.</span>
          </p>

          {/* Value Badges */}
          <div className="pt-2 flex flex-wrap justify-center gap-4 sm:gap-8 text-xs font-semibold text-[#6E6D68] dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Batch & Playlist Downloads
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Select / Deselect Songs
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              8 Parallel Streams
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              320kbps MP3 Audio
            </span>
          </div>
        </section>

        {/* ── 2. Primary OS Download Cards ─────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Android Card */}
          <div className="group relative rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-400 dark:hover:border-emerald-600/60 hover:shadow-lg transition-all duration-200">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <Smartphone className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 border border-[#EAEAE5] dark:border-zinc-700">
                  Android 8.0+
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#111111] dark:text-white">
                  Infyn DL for Android
                </h3>
                <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 mt-1">
                  Universal APK for phones, tablets & Android TV. Full playlist downloader with granular song checkboxes and background notification.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 text-[12px] text-[#6E6D68] dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Saves to <code className="bg-[#F5F4EE] dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px]">Download/infyn-dl/</code> or Music folder</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Batch download playlists with song-by-song selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Persistent background notification service</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#EAEAE5] dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <a
                href={release.androidApk.downloadUrl}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs sm:text-sm font-bold hover:bg-black dark:hover:bg-zinc-100 active:scale-[0.98] transition-all shadow-sm group/btn"
              >
                <Download className="h-4 w-4" />
                <span>Download Android APK</span>
              </a>
              <div className="text-center sm:text-right text-[11px] text-[#9E9D98] dark:text-zinc-500 font-mono">
                <div>{release.androidApk.formattedSize}</div>
                <div>{release.version}</div>
              </div>
            </div>
          </div>

          {/* Windows Card */}
          <div className="group relative rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-8 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-600/60 hover:shadow-lg transition-all duration-200">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-700 dark:text-blue-400">
                  <Monitor className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 border border-[#EAEAE5] dark:border-zinc-700">
                  Windows 10 / 11 (64-bit)
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#111111] dark:text-white">
                  Infyn DL for Windows
                </h3>
                <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 mt-1">
                  High-speed desktop app with zero setup required. Bundled with native yt-dlp and FFmpeg binaries.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 text-[12px] text-[#6E6D68] dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Setup installer with Start Menu & Desktop shortcuts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Multi-thread parallel playlist downloads with song selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Portable ZIP option (runs off USB drive)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#EAEAE5] dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={release.windowsSetup.downloadUrl}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs sm:text-sm font-bold hover:bg-black dark:hover:bg-zinc-100 active:scale-[0.98] transition-all shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Windows Setup (.exe)</span>
                </a>

                <a
                  href={release.windowsPortable.downloadUrl}
                  title="Portable ZIP bundle — extract & run"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-[#6E6D68] dark:text-zinc-300 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-all"
                >
                  <span>Portable (.zip)</span>
                </a>
              </div>

              <div className="text-center sm:text-right text-[11px] text-[#9E9D98] dark:text-zinc-500 font-mono">
                <div>{release.windowsSetup.formattedSize}</div>
                <div>{release.version}</div>
              </div>
            </div>
          </div>

        </section>

        {/* GitHub Live Meta Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#6E6D68] dark:text-zinc-400 bg-white dark:bg-[#121214] border border-[#EAEAE5] dark:border-zinc-800 rounded-2xl py-3 px-5 max-w-2xl mx-auto shadow-2xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Latest Release: <strong className="text-[#111111] dark:text-white">{release.version}</strong></span>
          </span>
          <span className="text-[#EAEAE5] dark:text-zinc-700">•</span>
          <span>Updated: {release.formattedDate}</span>
          <span className="text-[#EAEAE5] dark:text-zinc-700">•</span>
          <a
            href="https://github.com/imvicky69/infyn-dl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#111111] dark:text-white hover:underline"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>imvicky69/infyn-dl</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>

        {/* ── 3. Batch & Playlist Spotlight Section ────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-rose-600 dark:text-rose-400">
              Batch & Playlist Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
              Full Playlists with Granular Song Selection
            </h2>
            <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Don&apos;t waste bandwidth or disk storage downloading entire playlists blindly. Infyn DL lets you inspect the complete tracklist and cherry-pick only the tracks you want.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/50 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <ListMusic className="h-5 w-5" />
              </div>
              <h3 className="text-[15px] font-bold text-[#111111] dark:text-white">
                1-Paste Playlist Parsing
              </h3>
              <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Paste any YouTube, YouTube Music, or SoundCloud playlist link. The app extracts track titles, artists, thumbnails, and durations in seconds.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/50 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckSquare2 className="h-5 w-5" />
              </div>
              <h3 className="text-[15px] font-bold text-[#111111] dark:text-white">
                Select & Deselect Easily
              </h3>
              <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Check or uncheck individual songs with one tap. Use &ldquo;Select All&rdquo; or &ldquo;Deselect All&rdquo; to quickly filter out tracks you don&apos;t need.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/50 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-[15px] font-bold text-[#111111] dark:text-white">
                Parallel Batch Acceleration
              </h3>
              <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Downloads run in parallel streams with smart duplicate skipping, ensuring you never download the same song twice.
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. Core Pillars & Architecture Features ─────────────── */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
              Built for Speed, Privacy & Simplicity
            </h2>
            <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400">
              Everything you need in a modern media downloader without intrusive ads or cloud subscriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Zap,
                color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/80",
                title: "8 Parallel Streams",
                desc: "Downloads files in 8 concurrent byte chunks (`-N 8`) ensuring your internet connection bandwidth is completely saturated.",
              },
              {
                icon: HardDrive,
                color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/80",
                title: "Direct Storage Save",
                desc: "Downloads save straight to your phone's standard Downloads or Music folder with instant MediaScanner library indexing.",
              },
              {
                icon: Bell,
                color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800/80",
                title: "Background Service",
                desc: "Runs a persistent foreground service with real-time progress notification so you can switch apps or lock your phone mid-download.",
              },
              {
                icon: Music,
                color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/80",
                title: "320kbps MP3 Extraction",
                desc: "Local FFmpeg converts and extracts pristine audio with full bitrate control (320k, 256k, 192k, 128k) and cover art preservation.",
              },
              {
                icon: RefreshCw,
                color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/80",
                title: "1-Tap Engine Updates",
                desc: "YouTube updated their format? Update the underlying yt-dlp core directly from Settings with a single tap in 2 seconds.",
              },
              {
                icon: WifiOff,
                color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800/80",
                title: "100% Offline Playback",
                desc: "Once downloaded, files belong to you. Play offline in VLC, Apple Music, Poweramp, or your favorite local media player.",
              },
              {
                icon: ShieldCheck,
                color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/80",
                title: "Zero Ads & Telemetry",
                desc: "No third-party ad networks, no telemetry trackers, no cookies, and no accounts required. Complete user privacy by design.",
              },
              {
                icon: Globe,
                color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800/80",
                title: "1,000+ Supported Sites",
                desc: "Powered by yt-dlp, supporting YouTube, SoundCloud, Reddit, X (Twitter), TikTok, Vimeo, Twitch, and hundreds more.",
              },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-5 space-y-3 shadow-2xs hover:border-[#BEBDB9] dark:hover:border-zinc-700 transition-colors"
                >
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${feat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#111111] dark:text-white leading-tight">
                    {feat.title}
                  </h3>
                  <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-[1.6]">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 5. Installation Guides (Tabbed: Android | Windows) ───── */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Installation Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
              Quick Setup in Under 1 Minute
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="inline-flex p-1 rounded-2xl bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("android")}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === "android"
                      ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-sm"
                      : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Android (APK)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("windows")}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === "windows"
                      ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-sm"
                      : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                  <span>Windows (Setup & Portable)</span>
                </button>
              </div>
            </div>

            {activeTab === "android" ? (
              <div className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#EAEAE5] dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#111111] dark:text-white">
                      Android Installation Steps
                    </h3>
                    <p className="text-xs text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                      Standard sideload procedure for open-source Android apps
                    </p>
                  </div>
                  <a
                    href={release.androidApk.downloadUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold hover:scale-105 active:scale-95 transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Get APK ({release.androidApk.formattedSize})</span>
                  </a>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      step: "01",
                      title: "Download the APK",
                      desc: "Click 'Download Android APK' above. Your browser will download the universal APK directly from GitHub releases.",
                    },
                    {
                      step: "02",
                      title: "Open & Confirm Sideload",
                      desc: "Tap the download notification or open your Files app → Downloads → tap Infyn-DL-*-android.apk.",
                    },
                    {
                      step: "03",
                      title: "Allow 'Install Unknown Apps'",
                      desc: "If Android displays 'For your security, your phone is not allowed to install unknown apps from this source', tap Settings and toggle 'Allow from this source'.",
                    },
                    {
                      step: "04",
                      title: "Grant Storage Access & Enjoy",
                      desc: "Launch Infyn DL and grant storage access so it can save your media to the Download/ or Music/ folder.",
                    },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-4">
                      <span className="h-8 w-8 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 text-xs font-mono font-bold flex items-center justify-center text-[#111111] dark:text-white shrink-0 mt-0.5">
                        {s.step}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#111111] dark:text-white">{s.title}</h4>
                        <p className="text-xs text-[#6E6D68] dark:text-zinc-400 mt-0.5 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#EAEAE5] dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#111111] dark:text-white">
                      Windows Installation Options
                    </h3>
                    <p className="text-xs text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                      Windows 10 / Windows 11 (64-bit) with pre-bundled FFmpeg & yt-dlp
                    </p>
                  </div>
                  <a
                    href={release.windowsSetup.downloadUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold hover:scale-105 active:scale-95 transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Setup ({release.windowsSetup.formattedSize})</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/60 space-y-2">
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Option A: Setup Installer (Recommended)
                    </div>
                    <div className="text-sm font-bold text-[#111111] dark:text-white">
                      Infyn-DL-*-windows-setup.exe
                    </div>
                    <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                      Single-file installer that automatically creates Desktop and Start Menu shortcuts, manages app updates, and registers default file associations.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/60 space-y-2">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Option B: Portable ZIP Bundle
                    </div>
                    <div className="text-sm font-bold text-[#111111] dark:text-white">
                      Infyn-DL-windows-portable.zip
                    </div>
                    <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                      No installation required. Extract the ZIP archive anywhere on your disk or USB drive and run <code className="bg-white dark:bg-zinc-800 px-1 rounded text-[11px]">media_downloader.exe</code>.
                    </p>
                  </div>
                </div>

                {/* SmartScreen note */}
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                  <Info className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                    <strong>Windows SmartScreen Notice:</strong> If Windows displays <em>&ldquo;Windows protected your PC&rdquo;</em>, click <strong>&ldquo;More info&rdquo;</strong> and then <strong>&ldquo;Run anyway&rdquo;</strong>. Infyn DL is open-source and free, so it does not buy expensive corporate signing certificates.
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── 6. Supported Platforms & Formats ─────────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Compatibility
            </span>
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
              Works Across Your Favorite Media Platforms
            </h2>
            <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400">
              Powered by an optimized, updated yt-dlp backend with support for thousands of video, audio, and playlist services.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: "YouTube", tag: "Playlists & 4K" },
              { name: "YouTube Music", tag: "Albums & 320k" },
              { name: "Twitter / X", tag: "Original MP4" },
              { name: "Reddit", tag: "Audio + Video Merged" },
              { name: "TikTok", tag: "Clean Videos" },
              { name: "SoundCloud", tag: "Sets & HQ Audio" },
              { name: "Vimeo", tag: "Full HD Streams" },
              { name: "Twitch", tag: "Clips & VODs" },
              { name: "Facebook", tag: "HD Videos" },
              { name: "Instagram", tag: "Reels & Videos" },
              { name: "Bilibili", tag: "HD Streams" },
              { name: "1,000+ More", tag: "Universal Extractor" },
            ].map((site) => (
              <div
                key={site.name}
                className="p-3 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/50 text-center space-y-1"
              >
                <div className="font-bold text-xs sm:text-sm text-[#111111] dark:text-white">
                  {site.name}
                </div>
                <div className="text-[10px] text-[#9E9D98] dark:text-zinc-500 truncate">
                  {site.tag}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. FAQ Section ───────────────────────────────────────── */}
        <section className="space-y-4 max-w-3xl mx-auto">
          <div className="border-b border-[#EAEAE5] dark:border-zinc-800 pb-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Questions
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              const num = String(idx + 1).padStart(2, "0");
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] overflow-hidden shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center gap-4 hover:bg-[#FBFBFA] dark:hover:bg-zinc-900/60 transition-colors cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-[#BEBDB9] dark:text-zinc-600 shrink-0 tabular-nums">
                      {num}
                    </span>
                    <span className="text-sm font-semibold text-[#111111] dark:text-white flex-1 tracking-[-0.01em]">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-[#9E9D98] dark:text-zinc-500"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-4 text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-[1.7] border-t border-[#F5F4EE] dark:border-zinc-800/80 pt-3 pl-12 sm:pl-14">
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

        {/* ── 8. Bottom CTA Banner ─────────────────────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#111111] dark:bg-[#121214] text-white p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              100% Free & Open Source
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em]">
              Ready to Download at Full Speed?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Experience fast, ad-free downloads for single media files and complete playlists on Android and Windows.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={release.androidApk.downloadUrl}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#111111] text-xs sm:text-sm font-bold hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
            >
              <Smartphone className="h-4 w-4 text-emerald-600" />
              <span>Download Android APK</span>
              <span className="text-[10px] font-mono text-zinc-500">
                ({release.androidApk.formattedSize})
              </span>
            </a>

            <a
              href={release.windowsSetup.downloadUrl}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-800 text-white text-xs sm:text-sm font-bold hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98] transition-all border border-zinc-700"
            >
              <Monitor className="h-4 w-4 text-blue-400" />
              <span>Download Windows Setup</span>
              <span className="text-[10px] font-mono text-zinc-400">
                ({release.windowsSetup.formattedSize})
              </span>
            </a>

            <a
              href="https://github.com/imvicky69/infyn-dl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-transparent border border-zinc-700 text-zinc-300 text-xs sm:text-sm font-semibold hover:text-white hover:border-zinc-500 transition-all"
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
