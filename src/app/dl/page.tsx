"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
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
  Sparkles,
  Music,
  Headphones,
  Timer,
  Moon,
  HardDrive,
  Check,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  FolderDown,
  ListMusic,
  Search,
  Heart,
  Radio,
  Volume2,
  ShieldCheck,
  Zap,
  ArrowRight,
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

interface AppScreen {
  id: string;
  label: string;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  image: string;
  description: string;
  bullets: string[];
}

const APP_SCREENS: AppScreen[] = [
  {
    id: "player",
    label: "Now Playing",
    title: "Audiophile Player & OLED Black Mode",
    badge: "Offline Ready · High Quality",
    badgeColor: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80",
    icon: Music,
    image: "/dl/player.jpeg",
    description:
      "A distraction-free, pitch-black player interface with high-resolution Coke Studio album covers, verified 'OFFLINE READY' audio tag, quick lyrics access, and pure #000000 OLED black theme.",
    bullets: [
      "Offline Ready badge with pristine 320kbps MP3 audio playback",
      "True #000000 OLED theme turns off AMOLED display pixels to save battery",
      "Screen-off background playback with persistent lock-screen media controls",
      "Sleep timer with gentle 2-minute audio fade-out and wake-lock cutoff",
    ],
  },
  {
    id: "download",
    label: "Batch Downloader",
    title: "Full Playlists with 1-Click Download",
    badge: "Direct Phone Storage",
    badgeColor: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/80",
    icon: ListMusic,
    image: "/dl/download.jpeg",
    description:
      "Paste any YouTube or YouTube Music playlist link (e.g. Mellow Pop Classics with 49 songs). Tap 'Download All' for high-speed parallel saving or 'Select' to pick only the tracks you want.",
    bullets: [
      "1-Click 'Download All' for complete albums and 50+ song playlists",
      "Granular track checkboxes so you never waste phone storage on filler tracks",
      "Saves directly into your phone’s standard /Music or /Download folder",
      "Embedded ID3 cover art, artist names, and album tags for all offline players",
    ],
  },
  {
    id: "homeScreen",
    label: "Music Library",
    title: "Clean Music Library & Recent Mixes",
    badge: "Unified Library",
    badgeColor: "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/80",
    icon: Radio,
    image: "/dl/homeScreen.jpeg",
    description:
      "A fast, unified hub for your local music collection and online streaming. Easily toggle between Playlists and Tracks, resume recently played songs, and browse featured mixes.",
    bullets: [
      "Instant library scanning with automatic playlist and track indexing",
      "Dedicated Liked Songs quick-launch card with one-tap play and shuffle",
      "Recently played shelf for seamless continuation across sessions",
      "Clean 4-tab bottom navigation (Music, Search, Library, Settings)",
    ],
  },
  {
    id: "search",
    label: "Fast Search",
    title: "Instant Search with 1-Tap Download",
    badge: "Engine Ready",
    badgeColor: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/80",
    icon: Search,
    image: "/dl/search.jpeg",
    description:
      "Search millions of songs, albums, and acoustic covers across YouTube and YouTube Music. The 'Engine Ready' extractor gives you direct 1-tap download buttons next to every search result.",
    bullets: [
      "Live search across songs, playlists, and acoustic versions",
      "1-tap direct download button on each track in search results",
      "100% zero audio ads, sponsored video clips, or subscription gates",
      "Floating mini-player stays accessible while exploring new music",
    ],
  },
  {
    id: "likedSong",
    label: "Liked Songs",
    title: "Offline Favorites & 1-Tap Shuffle",
    badge: "Offline Favorites",
    badgeColor: "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/80",
    icon: Heart,
    image: "/dl/likedSong.jpeg",
    description:
      "Tap the heart icon on any song to add it to your offline favorites. Features 1-tap 'Play All' and 'Shuffle' mode with instant queue management and persistent background audio.",
    bullets: [
      "Heart any song to cache it instantly into your offline collection",
      "One-tap 'Play All' and 'Shuffle' for hands-free listening",
      "In-playlist search to instantly filter your favorite tracks",
      "Listen anywhere completely offline without mobile data or Wi-Fi",
    ],
  },
];

const FAQS = [
  {
    q: "Does Infyn DL save songs directly to my phone storage for offline playback?",
    a: "Yes! Unlike Spotify or YouTube Music that lock songs inside encrypted proprietary caches, Infyn DL saves unlocked, high-resolution 320kbps MP3 and FLAC files straight into your Android device's standard Music/ or Download/ folder. You can play them in any music player, transfer them to an SD card, or listen anywhere without cellular data or Wi-Fi.",
  },
  {
    q: "How does the Sleep Timer work and how does it save battery?",
    a: "The built-in Sleep Timer allows you to fall asleep to music without your phone playing all night. You can set it for 15, 30, 45, 60 minutes, or 'End of Current Track'. During the final two minutes, Infyn DL applies a gentle exponential volume fade-out so abrupt silence doesn't wake you up. When the timer expires, the app stops playback, releases the Android audio wake lock, and shuts down background audio services completely.",
  },
  {
    q: "Can I download full playlists and pick only the songs I want?",
    a: "Yes! Simply paste any YouTube or YouTube Music playlist link. Infyn DL parses all tracks in seconds and gives you granular checkboxes for every single song. You can select all, deselect all, or cherry-pick only your favorites before starting the high-speed batch download.",
  },
  {
    q: "Does background playback work with the screen turned off?",
    a: "Yes! Infyn DL runs a native Android foreground audio service with persistent lock screen notifications and smartwatch media controls. You can lock your screen, slip your phone into your pocket, or multitask with other apps while your music continues playing uninterrupted.",
  },
  {
    q: "Is Infyn DL completely free and free of ads?",
    a: "100% yes. There are zero audio ads, banner ads, subscription fees, or account logins required. Infyn DL is open-source software built for music lovers who appreciate clean design, audio fidelity, and digital privacy.",
  },
];

export default function DlPage() {
  const [release, setRelease] = useState<InfynDlRelease>(FALLBACK_RELEASE);
  const [selectedScreenIndex, setSelectedScreenIndex] = useState<number>(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchLatestRelease().then((data) => {
      setRelease(data);
    });
  }, []);

  const activeScreen = APP_SCREENS[selectedScreenIndex];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#E8E6DE] selection:text-black bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-20 sm:space-y-28">
        
        {/* ── 1. Hero Section ────────────────────────────────────────── */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-2 sm:pt-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-tight">
              <Sparkles className="h-3.5 w-3.5" />
              Native Android App · 100% Free & Open Source
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 border border-[#EAEAE5] dark:border-zinc-700">
              {release.version}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-[#111111] dark:text-white leading-[1.12]">
            Offline Music Player & Playlist Downloader
          </h1>

          <p className="text-[16px] sm:text-[18px] text-[#6E6D68] dark:text-zinc-400 leading-[1.6] max-w-2xl mx-auto">
            Save high-res <span className="font-semibold text-[#111111] dark:text-zinc-200">320kbps tracks & full playlists</span> directly to your phone storage. Experience a gorgeous player view, background screen-off playback, and a gentle sleep timer.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href={release.androidApk.downloadUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold active:scale-[0.98] transition-all shadow-md group"
            >
              <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              <span>Download Android APK</span>
              <span className="text-xs font-mono text-emerald-200 opacity-90">
                ({release.androidApk.formattedSize})
              </span>
            </a>

            <a
              href="https://github.com/imvicky69/infyn-dl"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm font-semibold text-[#111111] dark:text-zinc-200 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-all shadow-2xs"
            >
              <GithubIcon className="h-4 w-4" />
              <span>Star on GitHub</span>
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          </div>

          {/* Value Micro-Pills */}
          <div className="pt-3 flex flex-wrap justify-center gap-2.5 sm:gap-4 text-xs font-medium text-[#6E6D68] dark:text-zinc-400">
            <span className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-2xs">
              <HardDrive className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Direct Phone Storage
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              100% Zero Ads
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-2xs">
              <Headphones className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Screen-Off Playback
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-2xs">
              <Timer className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              Gentle Sleep Timer
            </span>
          </div>
        </section>

        {/* ── 2. Real App Showcase (Original App Screenshots) ───────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-5 sm:p-8 lg:p-10 shadow-sm space-y-8">
          
          {/* Showcase Header & Screen Switcher Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAEAE5] dark:border-zinc-800 pb-6">
            <div className="space-y-1 max-w-md">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-400">
                Live App Interface
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white">
                Explore the Actual App Screenshots
              </h2>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                Click any tab to view the real interface from the Infyn DL Android app.
              </p>
            </div>

            {/* Screen Switcher Tabs */}
            <div className="flex flex-wrap items-center p-1 rounded-2xl bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 gap-1 self-start md:self-auto">
              {APP_SCREENS.map((screen, idx) => {
                const Icon = screen.icon;
                const isSelected = selectedScreenIndex === idx;
                return (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={() => setSelectedScreenIndex(idx)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-xs"
                        : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-emerald-500" : ""}`} />
                    <span>{screen.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Phone Frame & Feature Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Phone Frame showcasing real screenshot */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-[300px] sm:max-w-[320px] rounded-[44px] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-4 border-zinc-700/80">
                
                {/* Phone screen container */}
                <div className="relative rounded-[36px] overflow-hidden bg-black aspect-[540/1170] shadow-inner">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeScreen.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={activeScreen.image}
                        alt={activeScreen.title}
                        width={540}
                        height={1170}
                        priority
                        className="w-full h-full object-cover select-none"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Subtle bottom home bar */}
                <div className="w-20 h-1 rounded-full bg-zinc-600 mx-auto mt-2" />
              </div>

              {/* Quick Thumbnail Selector under Phone */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {APP_SCREENS.map((screen, idx) => (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={() => setSelectedScreenIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      selectedScreenIndex === idx
                        ? "w-8 bg-emerald-500"
                        : "w-2.5 bg-[#EAEAE5] dark:bg-zinc-700 hover:bg-zinc-400"
                    }`}
                    title={screen.label}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Screen Context & Real Features */}
            <div className="lg:col-span-6 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScreen.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${activeScreen.badgeColor}`}>
                      <Sparkles className="h-3.5 w-3.5" />
                      {activeScreen.badge}
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white tracking-tight">
                      {activeScreen.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                      {activeScreen.description}
                    </p>
                  </div>

                  {/* Feature Bullets */}
                  <div className="space-y-3 pt-2">
                    {activeScreen.bullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/40 shadow-2xs"
                      >
                        <div className="h-5 w-5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-xs sm:text-[13px] font-medium text-[#111111] dark:text-zinc-200 leading-relaxed">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Direct Action Link */}
                  <div className="pt-2">
                    <a
                      href={release.androidApk.downloadUrl}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111111] hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-[#111111] text-xs font-bold active:scale-[0.98] transition-all shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Android APK ({release.androidApk.formattedSize})</span>
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* ── 3. Gallery Strip: All 5 App Screens ──────────────────── */}
        <section className="space-y-6">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Visual Tour
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
              Built with Pure Craftsmanship
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
              Every screen is engineered with a true OLED dark theme, intuitive layout, and zero distractions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {APP_SCREENS.map((screen, idx) => {
              const isSelected = selectedScreenIndex === idx;
              return (
                <div
                  key={screen.id}
                  onClick={() => setSelectedScreenIndex(idx)}
                  className={`group rounded-2xl border p-2 bg-white dark:bg-[#121214] space-y-2 cursor-pointer transition-all shadow-2xs hover:-translate-y-1 ${
                    isSelected
                      ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                      : "border-[#EAEAE5] dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[540/1170] bg-black">
                    <Image
                      src={screen.image}
                      alt={screen.label}
                      width={270}
                      height={585}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                  </div>
                  <div className="text-center px-1 pb-1">
                    <div className="text-xs font-bold text-[#111111] dark:text-white truncate">
                      {screen.label}
                    </div>
                    <div className="text-[10px] text-[#6E6D68] dark:text-zinc-500 truncate">
                      {screen.badge}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. Four Core Pillars (Clean 2x2 Grid) ─────────────────── */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Key Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
              Built for Total Music Freedom
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
              Everything you need in a modern Android music player without subscription paywalls or ads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Offline Phone Downloads */}
            <div className="p-6 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-3.5 shadow-2xs hover:border-[#BEBDB9] dark:hover:border-zinc-700 transition-all">
              <div className="h-11 w-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <HardDrive className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">
                Direct to Phone Storage & Offline Library
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Save songs and full playlists straight to your Android phone’s standard <code className="bg-[#F5F4EE] dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">/Music</code> or <code className="bg-[#F5F4EE] dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">/Download</code> folder. Enjoy offline music anywhere with 320kbps MP3 fidelity, automatic ID3 tags, and high-res album covers.
              </p>
            </div>

            {/* Card 2: Gorgeous Player View */}
            <div className="p-6 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-3.5 shadow-2xs hover:border-[#BEBDB9] dark:hover:border-zinc-700 transition-all">
              <div className="h-11 w-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Music className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">
                Audiophile Player View & OLED Pitch Black
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Immerse yourself in a clean, distraction-free player interface with high-res artwork, verified offline status, and a true #000000 pitch-black OLED dark mode that powers off AMOLED pixels to conserve up to 60% battery.
              </p>
            </div>

            {/* Card 3: Screen-off Background Playback */}
            <div className="p-6 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-3.5 shadow-2xs hover:border-[#BEBDB9] dark:hover:border-zinc-700 transition-all">
              <div className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Headphones className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">
                Background Playback with Screen Locked
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Keep listening while multitasking across other apps or when your phone is locked in your pocket. Persistent lock screen controls and smartwatch integration let you pause and skip tracks with zero ad interruptions.
              </p>
            </div>

            {/* Card 4: Smart Sleep Timer */}
            <div className="p-6 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-3.5 shadow-2xs hover:border-[#BEBDB9] dark:hover:border-zinc-700 transition-all">
              <div className="h-11 w-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Timer className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">
                Smart Sleep Timer with Zero Battery Drain
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Fall asleep to ambient music or favorite tracks with ease. Infyn DL gently lowers the volume over the final 2 minutes and halts all background audio services once finished, allowing your device to enter power-saving deep sleep.
              </p>
            </div>
          </div>
        </section>

        {/* ── 5. 3-Step Simple Android Install Guide ────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-1 max-w-lg mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Quick Setup
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white">
              Install in Under 60 Seconds
            </h2>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
              Standard APK sideload for Android 8.0+ devices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/50 border border-[#EAEAE5] dark:border-zinc-800 space-y-2">
              <span className="h-7 w-7 rounded-xl bg-white dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 text-xs font-mono font-bold flex items-center justify-center text-[#111111] dark:text-white">
                1
              </span>
              <h4 className="text-sm font-bold text-[#111111] dark:text-white">Download APK</h4>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Tap the download button to get the universal APK directly from our GitHub release.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/50 border border-[#EAEAE5] dark:border-zinc-800 space-y-2">
              <span className="h-7 w-7 rounded-xl bg-white dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 text-xs font-mono font-bold flex items-center justify-center text-[#111111] dark:text-white">
                2
              </span>
              <h4 className="text-sm font-bold text-[#111111] dark:text-white">Allow & Sideload</h4>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Tap the downloaded file in your notification bar. If prompted, toggle &ldquo;Allow from this source&rdquo;.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/50 border border-[#EAEAE5] dark:border-zinc-800 space-y-2">
              <span className="h-7 w-7 rounded-xl bg-white dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 text-xs font-mono font-bold flex items-center justify-center text-[#111111] dark:text-white">
                3
              </span>
              <h4 className="text-sm font-bold text-[#111111] dark:text-white">Enjoy Offline</h4>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Open Infyn DL, download your favorite playlists, and enjoy ad-free music anywhere you go.
              </p>
            </div>
          </div>
        </section>

        {/* ── 6. Curated Mobile FAQs ───────────────────────────────── */}
        <section className="space-y-4 max-w-3xl mx-auto">
          <div className="border-b border-[#EAEAE5] dark:border-zinc-800 pb-4 text-center space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Got Questions?
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white">
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
                    <span className="text-xs sm:text-sm font-semibold text-[#111111] dark:text-white flex-1 tracking-[-0.01em]">
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
                        <div className="px-5 pb-4 text-xs sm:text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-[1.7] border-t border-[#F5F4EE] dark:border-zinc-800/80 pt-3 pl-11 sm:pl-14">
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

        {/* ── 7. Bottom Clean Download Banner ──────────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#111111] dark:bg-[#000000] text-white p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              100% Free & Open Source
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em]">
              Start Listening Offline Today
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Download Infyn DL for Android and experience ad-free music, direct phone downloads, background playback, and sleep timer.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={release.androidApk.downloadUrl}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold active:scale-[0.98] transition-all shadow-md"
            >
              <Smartphone className="h-4 w-4" />
              <span>Download Android APK</span>
              <span className="text-[10px] font-mono text-emerald-100 opacity-90">
                ({release.androidApk.formattedSize})
              </span>
            </a>

            <a
              href="https://github.com/imvicky69/infyn-dl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-2xl bg-transparent border border-zinc-700 text-zinc-300 text-xs sm:text-sm font-semibold hover:text-white hover:border-zinc-500 transition-all"
            >
              <GithubIcon className="h-4 w-4" />
              <span>View on GitHub</span>
            </a>
          </div>

          <div className="relative z-10 text-[11px] text-zinc-500 font-medium">
            Android 8.0+ · No Root Required · Zero Telemetry
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
