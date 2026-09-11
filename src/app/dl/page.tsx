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
  CheckSquare2,
  ListMusic,
  Info,
  Check,
  Globe,
  Moon,
  Timer,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  BatteryCharging,
  Eye,
  Volume2,
  Radio,
  Headphones,
  CheckCheck
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

const SAMPLE_TRACKS = [
  {
    title: "Starboy (Official Audio)",
    artist: "The Weeknd ft. Daft Punk",
    album: "Starboy",
    duration: "3:50",
    format: "320 kbps MP3",
    color: "from-amber-500 to-rose-600",
  },
  {
    title: "Midnight City (Synthwave Cut)",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: "4:03",
    format: "320 kbps MP3",
    color: "from-indigo-500 to-cyan-500",
  },
  {
    title: "Chillhop Lo-Fi Study Beats",
    artist: "Lofi Girl & Friends",
    album: "Peaceful Sleep Beats",
    duration: "2:45",
    format: "FLAC / 320 kbps",
    color: "from-emerald-500 to-teal-600",
  },
];

const FAQS = [
  {
    q: "Can I stream unlimited music from YouTube and YouTube Music without ads?",
    a: "Yes! Infyn DL connects directly to YouTube and YouTube Music streams without injecting audio ads, video popups, or sponsor breaks. You can search, browse albums, and stream in the background with your screen locked — completely free without needing YouTube Premium.",
  },
  {
    q: "How does the built-in Sleep Timer work and does it save battery?",
    a: "The built-in Sleep Timer lets you fall asleep to music without your phone playing all night. You can set it to 15, 30, 45, 60 minutes, or 'End of current track'. During the final two minutes, Infyn DL applies a gentle exponential volume fade-out. Once the timer completes, it pauses playback, releases the Android audio wake lock, and shuts down background audio services to save your battery.",
  },
  {
    q: "What is Pure Pitch-Black OLED Dark Mode and how does it save up to 60% battery?",
    a: "Unlike conventional dark themes that use dark gray (#1E1E1E), Infyn DL features a true 100% pitch-black (#000000) OLED mode. On modern smartphone AMOLED/OLED displays, black pixels are physically turned off with zero electrical current, resulting in infinite contrast, zero backlight bleed at night, and up to 60% reduction in display power consumption.",
  },
  {
    q: "Can I download full YouTube and YouTube Music playlists at once with track selection?",
    a: "Yes! Simply paste any playlist, album, or artist link. Infyn DL scans and displays every single song with its title, artist, and duration. You can check or uncheck individual songs, use 'Select All' or 'Deselect All', and download only the tracks you want in parallel.",
  },
  {
    q: "What audio quality formats are supported for downloads?",
    a: "Infyn DL extracts audio in pristine 320kbps MP3, AAC, and native Opus/FLAC audio streams using bundled local FFmpeg. It automatically embeds high-resolution album cover art, artist names, track titles, and album metadata into the ID3 tags for instant indexing in your music library.",
  },
  {
    q: "How do I install the Android APK on my phone?",
    a: "Tap 'Download Android APK' to get the universal .apk file. When prompted by Android, tap the file in your notification bar or Files app, and toggle 'Allow from this source' if asked. Grant storage permission so the app can save songs to your standard Download/ or Music/ folder.",
  },
  {
    q: "Why does Windows SmartScreen show an alert during setup?",
    a: "Windows SmartScreen warns for all newly compiled open-source applications that do not pay Microsoft thousands of dollars each year for corporate code-signing certificates. Simply click 'More info' and then 'Run anyway'. The app is 100% clean, virus-free, and fully open-source on GitHub.",
  },
  {
    q: "Do I need to install Python, FFmpeg, or yt-dlp separately?",
    a: "No! Both the Windows installer and the portable ZIP bundle come pre-packaged with embedded yt-dlp and FFmpeg binaries. Android uses native embedded binaries as well. Everything works out of the box with zero setup.",
  },
];

export default function DlPage() {
  const [release, setRelease] = useState<InfynDlRelease>(FALLBACK_RELEASE);
  const [activeTab, setActiveTab] = useState<"android" | "windows">("android");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Interactive Phone Mockup States
  const [oledMode, setOledMode] = useState<boolean>(true); // true = pure pitch black #000000
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Interactive Sleep Timer Simulator States
  const [timerDuration, setTimerDuration] = useState<number>(30); // in minutes
  const [simulatedTimeLeft, setSimulatedTimeLeft] = useState<number>(30 * 60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  useEffect(() => {
    fetchLatestRelease().then((data) => {
      setRelease(data);
    });
  }, []);

  // Sleep timer ticker simulation
  useEffect(() => {
    if (!isTimerActive) return;
    const interval = setInterval(() => {
      setSimulatedTimeLeft((prev) => (prev > 0 ? prev - 1 : timerDuration * 60));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerActive, timerDuration]);

  const handleSelectTimer = (minutes: number) => {
    setTimerDuration(minutes);
    setSimulatedTimeLeft(minutes * 60);
    setIsTimerActive(true);
  };

  const currentTrack = SAMPLE_TRACKS[currentTrackIndex];

  // Format seconds to mm:ss
  const formattedMinutes = Math.floor(simulatedTimeLeft / 60);
  const formattedSeconds = simulatedTimeLeft % 60;
  const timeString = `${formattedMinutes}:${formattedSeconds < 10 ? "0" : ""}${formattedSeconds}`;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#E8E6DE] selection:text-black bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-24">
        
        {/* ── 1. Hero Section ────────────────────────────────────────── */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-2 sm:pt-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-tight">
              <Sparkles className="h-3.5 w-3.5" />
              Free Music Streaming & YouTube Downloader
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 border border-[#EAEAE5] dark:border-zinc-700">
              {release.version}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
              Android APK & Windows
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-[#111111] dark:text-white leading-[1.1]">
            Unlimited Free Music Streaming & YouTube Downloader
          </h1>

          <p className="text-[16px] sm:text-[18px] text-[#6E6D68] dark:text-zinc-400 leading-[1.6] max-w-2xl mx-auto">
            Stream and download unlimited songs from <span className="font-semibold text-[#111111] dark:text-zinc-200">YouTube & YouTube Music in 320kbps</span>. Enjoy background screen-off playback, a built-in <span className="font-semibold text-emerald-700 dark:text-emerald-400">Sleep Timer</span>, and true <span className="font-semibold text-purple-600 dark:text-purple-400">Pitch-Black OLED dark mode</span>. 100% Free & Ad-Free.
          </p>

          {/* Value Badges */}
          <div className="pt-2 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs font-semibold text-[#6E6D68] dark:text-zinc-400">
            <span className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Unlimited YT Music Streaming
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-2xs">
              <Timer className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Built-in Sleep Timer
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-2xs">
              <Moon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Pure OLED Black (#000000)
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-2xs">
              <Headphones className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              320kbps MP3 Audio
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-2xs">
              <CheckSquare2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Cherry-Pick Playlist Tracks
            </span>
          </div>
        </section>

        {/* ── 2. Primary OS Download Cards ─────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Android Card (Highlight for Mobile) */}
          <div className="group relative rounded-3xl border-2 border-emerald-500/40 dark:border-emerald-600/50 bg-gradient-to-b from-white to-emerald-50/20 dark:from-[#121214] dark:to-emerald-950/10 p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xl transition-all duration-200">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-2xs">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white tracking-wider">
                    Recommended
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 border border-[#EAEAE5] dark:border-zinc-700">
                    Android 8.0+
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#111111] dark:text-white flex items-center gap-2">
                  <span>Infyn DL for Android</span>
                  <span className="text-xs font-mono font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    APK
                  </span>
                </h3>
                <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 mt-1">
                  Universal APK for phones, tablets & Android TV. Ad-free YouTube Music streaming, 320kbps MP3 downloads, Sleep Timer & pure OLED dark mode.
                </p>
              </div>

              <div className="space-y-2 pt-1 text-[12px] text-[#6E6D68] dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Stream & download unlimited YouTube Music tracks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Built-in Sleep Timer with volume fade & battery cutoff</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>100% True OLED Pitch-Black theme (saves ~60% battery)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Batch download playlists with individual song checkboxes</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#EAEAE5] dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <a
                href={release.androidApk.downloadUrl}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold active:scale-[0.98] transition-all shadow-md group/btn"
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
                <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-700 dark:text-blue-400 shadow-2xs">
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
                  Lightning-fast desktop media & playlist workstation. Bundled with native yt-dlp & FFmpeg binaries with zero installation hassle.
                </p>
              </div>

              <div className="space-y-2 pt-1 text-[12px] text-[#6E6D68] dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Setup installer with Start Menu & Desktop shortcuts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>8 parallel stream acceleration (`-N 8`) for gigabit speeds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Inspect complete playlists with granular track selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Portable ZIP option (runs standalone off USB flash drives)</span>
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

        {/* ── 3. Interactive Phone Mockup & OLED Mode Switcher ─────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-10 shadow-sm overflow-hidden space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAEAE5] dark:border-zinc-800 pb-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-400">
                Experience the App Interface
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
                Engineered for Audiophiles & Night Owls
              </h2>
              <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Experience the pure music player interface with high-resolution album art, synchronized lyrics, audio visualizers, and a true battery-saving OLED black mode.
              </p>
            </div>

            {/* OLED Mode Toggle Controller */}
            <div className="flex items-center gap-3 bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 p-1.5 rounded-2xl shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setOledMode(false)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  !oledMode
                    ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-xs"
                    : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111]"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Slate Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setOledMode(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  oledMode
                    ? "bg-black text-white shadow-xs border border-zinc-800"
                    : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111]"
                }`}
              >
                <Moon className="h-3.5 w-3.5 text-purple-400" />
                <span>Pure OLED (#000000)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Phone Player Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[320px] sm:max-w-[350px] rounded-[42px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 border-4 border-zinc-700">
                {/* Simulated Screen Body */}
                <div
                  className={`w-full rounded-[34px] overflow-hidden transition-colors duration-300 p-5 flex flex-col justify-between aspect-[9/18.5] relative ${
                    oledMode ? "bg-[#000000] text-white" : "bg-[#18181B] text-zinc-100"
                  }`}
                >
                  {/* Status Bar & Dynamic Notch */}
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 pt-1 px-1">
                    <span>9:41</span>
                    <div className="h-4 w-20 rounded-full bg-zinc-900 border border-zinc-800/80" />
                    <div className="flex items-center gap-1.5">
                      <BatteryCharging className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{oledMode ? "OLED 98%" : "82%"}</span>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Radio className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-extrabold tracking-tight">Infyn Music</div>
                        <div className="text-[9px] text-zinc-400">YouTube Music Live Stream</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        320K HQ
                      </span>
                    </div>
                  </div>

                  {/* Simulated Album Art with Rotating Disc */}
                  <div className="my-auto py-2 flex flex-col items-center">
                    <div className="relative group cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                      <div
                        className={`w-44 h-44 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-tr ${currentTrack.color} p-1 shadow-2xl flex items-center justify-center relative overflow-hidden`}
                      >
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-2xs" />
                        
                        {/* Animated Vinyl Disc */}
                        <motion.div
                          animate={{ rotate: isPlaying ? 360 : 0 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="relative z-10 w-32 h-32 rounded-full border-4 border-zinc-900/80 bg-zinc-950 flex items-center justify-center shadow-inner"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-black" />
                          </div>
                        </motion.div>

                        {/* Playing wave bars in bottom corner */}
                        {isPlaying && (
                          <div className="absolute bottom-3 left-3 flex items-end gap-0.5 z-20">
                            {[16, 28, 12, 24, 18, 10].map((h, i) => (
                              <motion.div
                                key={i}
                                animate={{ height: [h * 0.4, h, h * 0.3] }}
                                transition={{
                                  duration: 0.7 + i * 0.1,
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                }}
                                className="w-1 bg-white/90 rounded-full"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Track Details */}
                    <div className="text-center mt-4 space-y-0.5 w-full px-2">
                      <h4 className="text-sm font-bold truncate">{currentTrack.title}</h4>
                      <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
                    </div>

                    {/* Active Sleep Timer Badge inside Player */}
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[10px] text-amber-300 font-mono">
                      <Timer className="h-3 w-3 text-amber-400" />
                      <span>Sleep Timer: {timeString} remaining</span>
                    </div>
                  </div>

                  {/* Playback Controls & Waveform */}
                  <div className="space-y-3 pb-1">
                    {/* Scrub bar */}
                    <div className="space-y-1">
                      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden relative">
                        <motion.div
                          className="h-full bg-emerald-500 rounded-full"
                          animate={{ width: isPlaying ? ["35%", "65%", "45%"] : "40%" }}
                          transition={{ duration: 15, repeat: Infinity }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                        <span>1:42</span>
                        <span>{currentTrack.duration}</span>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between px-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentTrackIndex((prev) =>
                            prev === 0 ? SAMPLE_TRACKS.length - 1 : prev - 1
                          )
                        }
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        <SkipBack className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="h-11 w-11 rounded-full bg-white text-black flex items-center justify-center shadow-md active:scale-95 transition-transform"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5 fill-black" />
                        ) : (
                          <Play className="h-5 w-5 fill-black translate-x-0.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentTrackIndex((prev) =>
                            prev === SAMPLE_TRACKS.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        <SkipForward className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Sub-toggles: Shuffle / Repeat / Lyrics */}
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 px-3 pt-1 border-t border-zinc-800/60">
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCheck className="h-3 w-3" /> No Ads
                      </span>
                      <span>Screen-Off Playback</span>
                      <span className="text-zinc-500 font-mono">320kbps</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Features Explaining the Experience */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Feature 1: Pure OLED Black */}
              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/40 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <Moon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#111111] dark:text-white">
                      True OLED Pitch-Black (#000000) Theme
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      Up to 60% Battery Savings on AMOLED Screens
                    </span>
                  </div>
                </div>
                <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  Unlike traditional dark modes that settle for washed-out dark grays, Infyn DL features true 100% pitch black. AMOLED pixels completely power off, giving you infinite contrast, zero eye strain in a dark bedroom, and massive battery life extensions.
                </p>
              </div>

              {/* Feature 2: Background Screen-off Playback */}
              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/40 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Headphones className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#111111] dark:text-white">
                      Background Playback with Screen Locked
                    </h3>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      No YouTube Premium Subscription Needed
                    </span>
                  </div>
                </div>
                <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  Keep listening while browsing Instagram, using Google Maps, texting, or after locking your screen. Persistent Android media controls let you play, pause, and skip tracks right from your lock screen or smartwatch.
                </p>
              </div>

              {/* Feature 3: Track Switcher */}
              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/40 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#9E9D98] dark:text-zinc-500">
                  Sample Tracks Demo (Click to Test)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SAMPLE_TRACKS.map((t, idx) => (
                    <button
                      key={t.title}
                      type="button"
                      onClick={() => {
                        setCurrentTrackIndex(idx);
                        setIsPlaying(true);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        currentTrackIndex === idx
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300"
                          : "border-[#EAEAE5] dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 text-[#6E6D68] dark:text-zinc-400"
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{t.title}</div>
                      <div className="text-[10px] opacity-75 truncate">{t.artist}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ── 4. Built-in Sleep Timer Interactive Feature Section ──── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <Timer className="h-3.5 w-3.5" />
              Gentle Audio Fade-Out
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
              Built-in Sleep Timer with Zero Battery Drain
            </h2>
            <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Fall asleep to your favorite YouTube Music playlists, sleep podcasts, or ambient rain sounds. Infyn DL gently lowers the volume over the final 2 minutes and shuts down all background services so your phone battery remains intact overnight.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Interactive Sleep Timer Simulator */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/60 space-y-6">
              <div className="flex items-center justify-between border-b border-[#EAEAE5] dark:border-zinc-800 pb-4">
                <div>
                  <div className="text-xs font-bold text-[#9E9D98] dark:text-zinc-400 uppercase tracking-wider">
                    Interactive Sleep Timer Simulator
                  </div>
                  <div className="text-lg font-bold text-[#111111] dark:text-white mt-0.5">
                    Select Duration
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                    {timeString}
                  </div>
                  <div className="text-[10px] text-[#9E9D98] dark:text-zinc-500">
                    {isTimerActive ? "Timer Ticking Down" : "Paused"}
                  </div>
                </div>
              </div>

              {/* Duration Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleSelectTimer(mins)}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      timerDuration === mins
                        ? "bg-amber-500 text-white font-bold border-amber-600 shadow-sm"
                        : "bg-white dark:bg-zinc-800 text-[#111111] dark:text-zinc-200 border-[#EAEAE5] dark:border-zinc-700 hover:border-amber-400"
                    }`}
                  >
                    <div className="text-sm font-extrabold">{mins}m</div>
                    <div className="text-[10px] opacity-80 font-medium">Minutes</div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handleSelectTimer(4)} // 4 mins simulation for track end
                  className={`py-3 px-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    timerDuration === 4
                      ? "bg-amber-500 text-white font-bold border-amber-600 shadow-sm"
                      : "bg-white dark:bg-zinc-800 text-[#111111] dark:text-zinc-200 border-[#EAEAE5] dark:border-zinc-700 hover:border-amber-400"
                  }`}
                >
                  <div className="text-sm font-extrabold">End Song</div>
                  <div className="text-[10px] opacity-80 font-medium">Current Track</div>
                </button>
              </div>

              {/* Fade Out Volume Curve Preview */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs font-semibold text-[#6E6D68] dark:text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="h-3.5 w-3.5 text-amber-500" />
                    Smooth Exponential Volume Fade Curve
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    No Abrupt Snapping
                  </span>
                </div>

                <div className="h-4 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500/20 p-0.5 border border-[#EAEAE5] dark:border-zinc-800 relative">
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-zinc-600 dark:text-zinc-400">
                    0% Silence
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-[#9E9D98] dark:text-zinc-500 font-mono">
                  <span>100% Volume</span>
                  <span>75% Volume</span>
                  <span>35% Gentle Fade</span>
                  <span>Audio Stopped</span>
                </div>
              </div>

              {/* What Happens At Zero */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                  <strong>Automatic WakeLock Release:</strong> When the timer reaches zero, Infyn DL unloads the media player service, releases background CPU wake locks, and permits Android to enter low-power deep sleep mode.
                </div>
              </div>
            </div>

            {/* Right: Pillars of Sleep Timer */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/40 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#111111] dark:text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>2-Minute Gentle Fade</span>
                </div>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 pl-6 leading-relaxed">
                  No sudden jumps that wake you up. Volume tapers gradually so your mind transitions peacefully to REM sleep.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/40 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#111111] dark:text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Complete Background Service Kill</span>
                </div>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 pl-6 leading-relaxed">
                  Unlike online streaming websites that spin in the background all night, the Android app shuts down its foreground service completely.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/40 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#111111] dark:text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>End of Current Track Mode</span>
                </div>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 pl-6 leading-relaxed">
                  Don&apos;t want a song cut in half? Set the timer to &ldquo;Finish Track&rdquo; and it will stop the moment the current masterpiece completes.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ── 5. Full Playlist & Cherry-Picking Track Engine ───────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-rose-600 dark:text-rose-400">
              Batch & Playlist Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
              Full Playlists with Granular Song Checkboxes
            </h2>
            <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Don&apos;t waste bandwidth or storage space downloading entire 100-song playlists blindly. Infyn DL scans the complete tracklist and lets you cherry-pick only the songs you love.
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
                Granular Track Checkboxes
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
                8 Parallel Streams
              </h3>
              <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Downloads run in parallel chunks (`-N 8`) with duplicate skipping, ensuring you never download the same song twice.
              </p>
            </div>
          </div>
        </section>

        {/* ── 6. Comparative Matrix (Infyn DL vs YT Premium vs Spotify) ─ */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-400">
              Honest Comparison
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
              Why Users Choose Infyn DL
            </h2>
            <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400">
              Compare Infyn DL against YouTube Premium, Spotify Free, and spammy online downloader sites.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-[#EAEAE5] dark:border-zinc-800 text-[#9E9D98] dark:text-zinc-400">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Feature</th>
                  <th className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50/50 dark:bg-emerald-950/30 rounded-t-xl">
                    Infyn DL (Free)
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">YouTube Premium</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Spotify Free</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Online Web Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAE5] dark:divide-zinc-800">
                {[
                  {
                    feature: "Price",
                    infyn: "$0 (Free Forever)",
                    yt: "$13.99 / mo",
                    spotify: "Free (With Ads)",
                    online: "Free (Spam Ads)",
                  },
                  {
                    feature: "Ad-Free Streaming",
                    infyn: "100% Zero Ads",
                    yt: "Yes ($13.99/mo)",
                    spotify: "No (Frequent Ads)",
                    online: "No (Malware / Popups)",
                  },
                  {
                    feature: "320kbps MP3 Download",
                    infyn: "Direct Unlocked MP3",
                    yt: "Encrypted Cache Only",
                    spotify: "No Downloads",
                    online: "Capped / Low 128k",
                  },
                  {
                    feature: "Screen-Off Playback",
                    infyn: "Yes (Native Service)",
                    yt: "Paid Only",
                    spotify: "Yes (With Ads)",
                    online: "No (Screen Must Stay On)",
                  },
                  {
                    feature: "Built-in Sleep Timer",
                    infyn: "Yes (Gentle Fade Out)",
                    yt: "Basic / None",
                    spotify: "Basic Timer",
                    online: "None",
                  },
                  {
                    feature: "Pure OLED Black (#000000)",
                    infyn: "Yes (60% Battery Saved)",
                    yt: "Dark Gray (#121212)",
                    spotify: "Dark Gray (#121212)",
                    online: "No (Bright Webpages)",
                  },
                  {
                    feature: "Playlist Song Checkboxes",
                    infyn: "Yes (Granular Selection)",
                    yt: "Download All Only",
                    spotify: "Download All Only",
                    online: "5–10 Song Limits",
                  },
                  {
                    feature: "Privacy & Accounts",
                    infyn: "Zero Accounts / Anonymous",
                    yt: "Requires Google Account",
                    spotify: "Requires Account",
                    online: "Tracking Cookies",
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#FBFBFA] dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#111111] dark:text-white">
                      {row.feature}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20">
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        {row.infyn}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#6E6D68] dark:text-zinc-400 font-medium">
                      {row.yt}
                    </td>
                    <td className="py-3 px-4 text-[#6E6D68] dark:text-zinc-400 font-medium">
                      {row.spotify}
                    </td>
                    <td className="py-3 px-4 text-[#6E6D68] dark:text-zinc-400 font-medium">
                      {row.online}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 7. Architecture & Core Features ──────────────────────── */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Technical Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
              Built for Speed, Audio Fidelity & Freedom
            </h2>
            <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400">
              Everything you need in a modern music streaming and batch downloader app without compromises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Music,
                color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/80",
                title: "320kbps MP3 Audio",
                desc: "Local embedded FFmpeg converts audio with full bitrate control (320k, 256k, 192k) with pristine stereo separation.",
              },
              {
                icon: Timer,
                color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/80",
                title: "Smart Sleep Timer",
                desc: "Auto-fades music volume over 2 minutes and shuts down audio services so your phone doesn't drain battery overnight.",
              },
              {
                icon: Moon,
                color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/80",
                title: "OLED Battery Saver",
                desc: "True #000000 black turns off AMOLED pixels completely for maximum nighttime comfort and up to 60% battery preservation.",
              },
              {
                icon: Zap,
                color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/80",
                title: "8 Parallel Streams",
                desc: "Downloads files in 8 concurrent byte chunks (`-N 8`) ensuring full saturation of your 5G or high-speed Wi-Fi.",
              },
              {
                icon: HardDrive,
                color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/80",
                title: "Direct Storage Save",
                desc: "Saves straight to standard Download/ or Music/ folders with instant Android MediaScanner library indexing.",
              },
              {
                icon: Bell,
                color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800/80",
                title: "Background Playback",
                desc: "Persistent background notification service with lock screen controls so you can switch apps or lock your screen.",
              },
              {
                icon: RefreshCw,
                color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800/80",
                title: "1-Tap Engine Updates",
                desc: "When YouTube updates format extractors, update the underlying yt-dlp core directly from Settings with one tap.",
              },
              {
                icon: ShieldCheck,
                color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800/80",
                title: "Zero Ads & Telemetry",
                desc: "No third-party ad networks, no analytics trackers, no account logins, and no fees. Open-source integrity by design.",
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

        {/* ── 8. Installation Guides (Tabbed: Android | Windows) ───── */}
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Get APK ({release.androidApk.formattedSize})</span>
                  </a>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      step: "01",
                      title: "Download the Universal APK",
                      desc: "Tap 'Download Android APK' above. Your phone browser will download the release file directly from GitHub.",
                    },
                    {
                      step: "02",
                      title: "Open the Downloaded File",
                      desc: "Tap the download notification in your status bar or open your Files app → Downloads → tap Infyn-DL-*-android.apk.",
                    },
                    {
                      step: "03",
                      title: "Allow 'Install Unknown Apps'",
                      desc: "If Android asks 'For your security, your phone is not allowed to install unknown apps from this source', tap Settings and enable 'Allow from this source'.",
                    },
                    {
                      step: "04",
                      title: "Launch & Enjoy Ad-Free Music",
                      desc: "Launch Infyn DL, grant storage access, and start streaming YouTube Music and downloading playlists at 320kbps.",
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

        {/* ── 9. FAQ Section ───────────────────────────────────────── */}
        <section className="space-y-4 max-w-3xl mx-auto">
          <div className="border-b border-[#EAEAE5] dark:border-zinc-800 pb-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Questions & Answers
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

        {/* ── 10. Bottom CTA Banner ────────────────────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#111111] dark:bg-[#000000] text-white p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              100% Free & Open Source
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em]">
              Start Streaming & Downloading Today
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Join thousands of listeners enjoying unlimited music from YouTube & YouTube Music at 320kbps with built-in Sleep Timer and true OLED dark mode.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={release.androidApk.downloadUrl}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
            >
              <Smartphone className="h-4 w-4" />
              <span>Download Android APK</span>
              <span className="text-[10px] font-mono text-emerald-100">
                ({release.androidApk.formattedSize})
              </span>
            </a>

            <a
              href={release.windowsSetup.downloadUrl}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-800 text-white text-xs sm:text-sm font-bold hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98] transition-all border border-zinc-700"
            >
              <Monitor className="h-4 w-4 text-blue-400" />
              <span>Windows Setup (.exe)</span>
            </a>

            <a
              href="https://github.com/imvicky69/infyn-dl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-transparent border border-zinc-700 text-zinc-300 text-xs sm:text-sm font-semibold hover:text-white hover:border-zinc-500 transition-all"
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
