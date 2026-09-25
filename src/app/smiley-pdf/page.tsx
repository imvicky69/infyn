"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  fetchLatestSmileyPdfRelease,
  FALLBACK_SMILEY_PDF_RELEASE,
  SmileyPdfRelease,
} from "@/lib/github-releases";
import {
  Download,
  Smartphone,
  Sparkles,
  FileText,
  ShieldCheck,
  Zap,
  Check,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Lock,
  Layers,
  Scan,
  Scissors,
  Bookmark,
  Share2,
  Trash2,
  Undo2,
  Eye,
  Info,
  Clock,
  HardDrive,
  FolderLock,
  Search,
  ArrowRight,
  Smile,
  FileSearch,
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

interface FeatureTab {
  id: string;
  label: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  bullets: { title: string; desc: string }[];
  highlightTag: string;
}

const FEATURE_TABS: FeatureTab[] = [
  {
    id: "viewer",
    label: "PDFium Viewer",
    badge: "Hardware-Accelerated",
    badgeColor: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/80",
    icon: Zap,
    title: "High-Performance PDF Viewer & In-Place Rename",
    subtitle: "Powered by native PDFium (pdfrx) for instantaneous page turns.",
    description:
      "Smiley PDF renders multi-hundred page manuals, textbooks, and scanned invoices with zero stutter. Fluid pan and pinch-to-zoom gestures, instant bookmarking, and native file management built directly into the reading chrome.",
    bullets: [
      {
        title: "Hardware Accelerated Engine",
        desc: "Native PDFium rendering delivers crisp 60fps pan and pinch-to-zoom without fuzzy blurry downscaling.",
      },
      {
        title: "In-Place Document Rename",
        desc: "Tap the document title bar anytime to edit file names directly on storage without leaving your reading flow.",
      },
      {
        title: "Document Metadata Modal",
        desc: "Inspect exact file size, total page count, last modified timestamp, and full sandbox or storage path.",
      },
      {
        title: "1-Tap Save & Unsave",
        desc: "Instant bookmark toggle safely copies files into your offline sandbox or unsaves with a lightweight snackbar toast.",
      },
    ],
    highlightTag: "PDFium Engine · Zero Lag",
  },
  {
    id: "recents",
    label: "Joyful Recents",
    badge: "iOS-Style Gestures",
    badgeColor: "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/80",
    icon: Clock,
    title: "Smart Recents with Swipe-to-Remove & Undo",
    subtitle: "A clean reading history that stays tidy without manual file cleanup.",
    description:
      "Your home screen features the top 10 most recent documents with real page thumbnails, file sizes, and last opened indicators. Easily slide left to dismiss files with instant Undo support, or jump into the dedicated All Recents screen.",
    bullets: [
      {
        title: "iOS-Style Slide to Remove",
        desc: "Smoothly swipe left on any recent document card to dismiss it from history with an instant 1-tap Undo option.",
      },
      {
        title: "Automatic Missing File Purge",
        desc: "Deleted or moved documents are automatically detected and cleanly purged from recents without ugly missing badges.",
      },
      {
        title: "Dedicated Full Recents Screen",
        desc: "Tap 'View all' or 'View Older PDFs & Archive' to search through your entire reading history with live search.",
      },
      {
        title: "Quick Tools Launcher",
        desc: "Direct access to upcoming utility modules (OCR, Scan, Protect) right from the top of the home screen.",
      },
    ],
    highlightTag: "Swipe Gesture · Auto Cleanup",
  },
  {
    id: "library",
    label: "Offline Library",
    badge: "100% Private Sandbox",
    badgeColor: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80",
    icon: FolderLock,
    title: "Dedicated Sandbox Storage & Duplicate Guard",
    subtitle: "Your personal, secure digital filing cabinet isolated on device.",
    description:
      "Smiley PDF creates an offline document safe inside the app sandbox. Store critical receipts, study notes, and legal agreements with duplicate prevention based on path, size, and hash.",
    bullets: [
      {
        title: "Isolated Sandbox Storage",
        desc: "Documents stored in your offline library remain available even if external download folders are cleaned.",
      },
      {
        title: "Smart Duplicate Prevention",
        desc: "Prevents duplicate file clutter by checking matching hashes, sizes, and file paths before saving.",
      },
      {
        title: "Built-in Welcome Guide",
        desc: "Comes preloaded with a friendly Welcome Guide for new users, complete with a restore button if deleted.",
      },
      {
        title: "Live Document Counter",
        desc: "Clean top bar with real-time search input and document counter badge for rapid organization.",
      },
    ],
    highlightTag: "Sandbox Safe · Hash Match",
  },
  {
    id: "privacy",
    label: "Zero Permissions",
    badge: "Play Store Compliant",
    badgeColor: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/80",
    icon: ShieldCheck,
    title: "Zero Sensitive Permissions & 100% Local",
    subtitle: "No invasive file access, no tracking, and no cloud uploads.",
    description:
      "Unlike generic PDF readers that demand dangerous MANAGE_EXTERNAL_STORAGE permissions, Smiley PDF uses modern Android SAF (Storage Access Framework) and system intents. 100% compliant with Google Play Store policies.",
    bullets: [
      {
        title: "No Dangerous Storage Rights",
        desc: "Never requests full device storage access. Your private photos and sensitive media remain untouched.",
      },
      {
        title: "System Intent Integration",
        desc: "Seamlessly opens PDFs from WhatsApp, Gmail, Chrome downloads, or any file manager via 'Open With'.",
      },
      {
        title: "Zero Cloud Telemetry",
        desc: "No analytics trackers, no account logins, and no background sync. Your documents never touch a server.",
      },
      {
        title: "100% Ad-Free Forever",
        desc: "No banner ads, no full-screen video popups, and no paywalls. Completely free open-source software.",
      },
    ],
    highlightTag: "100% Client-Side · Safe",
  },
];

const UPCOMING_TOOLS = [
  {
    icon: FileSearch,
    title: "OCR Text Extractor",
    badge: "In Development",
    badgeColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
    desc: "Extract copyable text from scanned PDFs, receipts, and images using on-device neural OCR with zero cloud uploads.",
  },
  {
    icon: Scan,
    title: "Camera Document Scanner",
    badge: "In Development",
    badgeColor: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60",
    desc: "Snap multi-page documents with automatic edge detection, perspective flattening, and instant PDF compilation.",
  },
  {
    icon: Lock,
    title: "PDF Password Protector",
    badge: "In Development",
    badgeColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60",
    desc: "Encrypt sensitive bank statements and contracts with military-grade AES-256 encryption directly on your phone.",
  },
  {
    icon: Scissors,
    title: "Merge & Split Studio",
    badge: "Planned",
    badgeColor: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60",
    desc: "Reorder pages with visual drag-and-drop, extract specific page ranges, and merge multiple documents into one file.",
  },
];

const FAQS = [
  {
    q: "Is Smiley PDF completely free and ad-free?",
    a: "Yes, 100%! Smiley PDF is free and open-source software. There are zero banner ads, no full-screen video interruptions, no subscription paywalls, and no watermarks on any document. It is built to be a joyful, distraction-free reader for Android.",
  },
  {
    q: "Which APK should I download for my Android device?",
    a: "For almost all modern Android smartphones and tablets (manufactured in 2018 or later), download the 'arm64-v8a' APK. It is optimized for 64-bit ARM processors (Snapdragon, MediaTek, Exynos, Google Tensor) and offers the fastest launch speeds. If you are unsure, the 'Universal APK' works on all Android devices.",
  },
  {
    q: "Why does Smiley PDF not ask for All Files Access (MANAGE_EXTERNAL_STORAGE)?",
    a: "Most commercial PDF apps request dangerous storage permissions to index your entire device, which can put private photos at risk. Smiley PDF follows strict Google Play Store security standards using Android's Storage Access Framework (SAF) and system file pickers, accessing only the documents you explicitly choose to open.",
  },
  {
    q: "Does Smiley PDF upload my documents to any server or cloud?",
    a: "Never. All PDF parsing, rendering, bookmarking, and renaming occur 100% locally on your device hardware using PDFium and Flutter. You can use Smiley PDF completely in Airplane Mode with zero internet access.",
  },
  {
    q: "What new tools are coming to Smiley PDF in future updates?",
    a: "The upcoming release roadmap includes an on-device OCR Text Extractor, a smart Camera Document Scanner with auto edge detection, AES-256 PDF Password Encryption, and visual Merge & Split tools. All will run 100% client-side on Android.",
  },
  {
    q: "Can Smiley PDF open PDFs sent through WhatsApp, Gmail, or Telegram?",
    a: "Yes! Smiley PDF registers standard Android view intent filters for MIME type 'application/pdf'. When you tap any PDF in WhatsApp, Gmail, Chrome, or your file explorer, select 'Smiley PDF' in the 'Open With' dialog.",
  },
];

export default function SmileyPdfPage() {
  const [release, setRelease] = useState<SmileyPdfRelease>(FALLBACK_SMILEY_PDF_RELEASE);
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showAllArchs, setShowAllArchs] = useState<boolean>(false);

  useEffect(() => {
    fetchLatestSmileyPdfRelease()
      .then((data) => setRelease(data))
      .catch(() => {});
  }, []);

  const activeTab = FEATURE_TABS[activeTabIdx];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#FEEAA7] selection:text-black bg-[#FBFBFA] dark:bg-[#0C0C0E] text-[#111111] dark:text-[#EDEDEC]">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-20 sm:space-y-28">
        
        {/* ── 1. Hero Section ────────────────────────────────────────── */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-2 sm:pt-4">
          
          {/* Header Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs font-bold tracking-tight shadow-2xs">
              <Smile className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>Native Android App · 100% Free & Ad-Free</span>
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 border border-[#EAEAE5] dark:border-zinc-700">
              {release.version}
            </span>
          </div>

          {/* App Logo Display */}
          <div className="relative inline-block mx-auto group">
            <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-amber-400/20 via-orange-400/20 to-yellow-300/20 blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-[28px] overflow-hidden bg-white dark:bg-zinc-900 border-2 border-[#EAEAE5] dark:border-zinc-800 p-2 shadow-[0_12px_36px_rgba(245,158,11,0.15)] group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/smiley-logo.png"
                alt="Smiley PDF App Logo"
                width={256}
                height={256}
                priority
                className="w-full h-full object-contain rounded-[20px]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-[#111111] dark:text-white leading-[1.12]">
              Joyful, Fast & Ad-Free <br />
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Android PDF Reader
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#6E6D68] dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto font-medium">
              Engineered with Flutter and native PDFium. Instant hardware rendering, in-place file rename, an isolated offline library, and zero intrusive permissions — built with pure joy.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {/* Recommended ARM64 APK Download */}
            <a
              href={release.arm64Apk.downloadUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-zinc-950 text-sm font-bold active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(245,158,11,0.25)] group"
            >
              <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              <span>Download APK (arm64-v8a)</span>
              <span className="text-xs font-mono text-amber-950/80 bg-amber-400/60 px-2 py-0.5 rounded-md">
                {release.arm64Apk.formattedSize}
              </span>
            </a>

            {/* Universal APK fallback */}
            <a
              href={release.universalApk.downloadUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm font-semibold text-[#111111] dark:text-zinc-200 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-all shadow-2xs"
            >
              <Smartphone className="h-4 w-4 text-[#6E6D68] dark:text-zinc-400" />
              <span>Universal APK</span>
              <span className="text-xs text-[#9E9D98] dark:text-zinc-500">
                ({release.universalApk.formattedSize})
              </span>
            </a>

            {/* GitHub Repo */}
            <a
              href="https://github.com/imvicky69/smiley-pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm font-semibold text-[#111111] dark:text-zinc-200 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-all shadow-2xs"
            >
              <GithubIcon className="h-4 w-4" />
              <span>Source</span>
              <ExternalLink className="h-3 w-3 opacity-40" />
            </a>
          </div>

          {/* Quick Architecture Toggle Link */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setShowAllArchs(!showAllArchs)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
            >
              <span>{showAllArchs ? "Hide architecture split APKs" : "Need armeabi-v7a or x86_64? View all split APKs"}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAllArchs ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Expanded Architecture Download Grid */}
          <AnimatePresence>
            {showAllArchs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left p-4 rounded-3xl bg-[#F5F4EE] dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800">
                  {/* ARM64 */}
                  <a
                    href={release.arm64Apk.downloadUrl}
                    className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-[#EAEAE5] dark:border-zinc-700 hover:border-amber-400 transition-all block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111111] dark:text-white">arm64-v8a</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 mt-1">Modern phones & tablets (64-bit)</p>
                    <div className="mt-2 text-xs font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                      <Download className="h-3 w-3" />
                      <span>{release.arm64Apk.formattedSize}</span>
                    </div>
                  </a>

                  {/* Universal */}
                  <a
                    href={release.universalApk.downloadUrl}
                    className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-[#EAEAE5] dark:border-zinc-700 hover:border-amber-400 transition-all block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111111] dark:text-white">Universal APK</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        Compatible
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 mt-1">Runs on every Android device</p>
                    <div className="mt-2 text-xs font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold">
                      <Download className="h-3 w-3" />
                      <span>{release.universalApk.formattedSize}</span>
                    </div>
                  </a>

                  {/* ARMv7 */}
                  <a
                    href={release.armv7Apk.downloadUrl}
                    className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-[#EAEAE5] dark:border-zinc-700 hover:border-amber-400 transition-all block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111111] dark:text-white">armeabi-v7a</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                        Legacy
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 mt-1">Older 32-bit Android phones</p>
                    <div className="mt-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-1 font-semibold">
                      <Download className="h-3 w-3" />
                      <span>{release.armv7Apk.formattedSize}</span>
                    </div>
                  </a>

                  {/* x86_64 */}
                  <a
                    href={release.x86_64Apk.downloadUrl}
                    className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-[#EAEAE5] dark:border-zinc-700 hover:border-amber-400 transition-all block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111111] dark:text-white">x86_64</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                        Emulator
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 mt-1">Chromebooks & PC emulators</p>
                    <div className="mt-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-1 font-semibold">
                      <Download className="h-3 w-3" />
                      <span>{release.x86_64Apk.formattedSize}</span>
                    </div>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Value Micro-Pills */}
          <div className="pt-3 flex flex-wrap justify-center gap-2.5 sm:gap-3 text-xs font-medium text-[#6E6D68] dark:text-zinc-400">
            <span className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
              100% Ad-Free Forever
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Zero Sensitive Permissions
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-2xs">
              <Zap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              PDFium Native Engine
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-2xs">
              <FolderLock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Private Sandbox Library
            </span>
          </div>
        </section>

        {/* ── 2. Interactive Feature Tabs & UI Walkthrough ───────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-5 sm:p-8 lg:p-10 shadow-sm space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAEAE5] dark:border-zinc-800 pb-6">
            <div className="space-y-1 max-w-md">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-amber-600 dark:text-amber-400">
                Crafted with Joy
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white">
                Everything You Need in a Modern PDF App
              </h2>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                Explore the core architecture and user-first features of Smiley PDF.
              </p>
            </div>

            {/* Feature Tab Buttons */}
            <div className="flex flex-wrap items-center p-1 rounded-2xl bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 gap-1 self-start md:self-auto">
              {FEATURE_TABS.map((tab, idx) => {
                const Icon = tab.icon;
                const isSelected = activeTabIdx === idx;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabIdx(idx)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-xs"
                        : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-amber-500" : ""}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Content Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Visual UI Mockup */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-[38px] p-3 shadow-[0_20px_50px_-15px_rgba(245,158,11,0.18)] bg-gradient-to-b from-amber-50 via-white to-amber-50/50 dark:from-zinc-800 dark:via-zinc-900 dark:to-black border-4 border-amber-200/80 dark:border-zinc-700">
                  
                  {/* Phone Screen Mockup Content */}
                  <div className="relative rounded-[28px] overflow-hidden bg-white dark:bg-[#141417] border border-[#EAEAE5] dark:border-zinc-800 p-4 space-y-4 aspect-[9/16] flex flex-col justify-between select-none">
                    
                    {/* Mock Phone Status & App Bar */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                          <span>5G</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* In-App Header */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#FBFBFA] dark:bg-zinc-800/80 border border-[#EAEAE5] dark:border-zinc-700">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src="/smiley-logo.png"
                              alt="Smiley"
                              width={28}
                              height={28}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#111111] dark:text-white leading-tight">
                              Smiley PDF
                            </div>
                            <div className="text-[9px] text-[#6E6D68] dark:text-zinc-400">
                              Joyful Document Hub
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {activeTab.highlightTag}
                        </span>
                      </div>
                    </div>

                    {/* Middle Mock Element based on active tab */}
                    <div className="flex-1 flex flex-col justify-center space-y-2.5 py-2">
                      {activeTab.id === "viewer" && (
                        <div className="space-y-2 p-3 rounded-2xl bg-[#F5F4EE] dark:bg-zinc-800/60 border border-[#EAEAE5] dark:border-zinc-700">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#111111] dark:text-white truncate">
                              Quarterly_Report_2026.pdf
                            </span>
                            <Bookmark className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-[#6E6D68] dark:text-zinc-400">
                            <span>Page 14 / 86</span>
                            <span>•</span>
                            <span>2.4 MB</span>
                          </div>
                          <div className="h-20 rounded-xl bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 p-2 space-y-1.5 flex flex-col justify-center">
                            <div className="h-2 rounded bg-amber-400/40 w-3/4" />
                            <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-800 w-full" />
                            <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-800 w-5/6" />
                            <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-800 w-2/3" />
                          </div>
                        </div>
                      )}

                      {activeTab.id === "recents" && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
                            Recently Opened (Swipe to Dismiss)
                          </div>
                          <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-amber-600" />
                              <div>
                                <div className="text-[11px] font-bold text-[#111111] dark:text-white">Design_Tokens.pdf</div>
                                <div className="text-[9px] text-[#6E6D68] dark:text-zinc-400">12 pages · 1.1 MB</div>
                              </div>
                            </div>
                            <span className="text-[9px] text-amber-700 dark:text-amber-300 font-semibold">Undo</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[#FBFBFA] dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-zinc-500" />
                              <div>
                                <div className="text-[11px] font-bold text-[#111111] dark:text-white">Apartment_Lease.pdf</div>
                                <div className="text-[9px] text-[#6E6D68] dark:text-zinc-400">4 pages · 680 KB</div>
                              </div>
                            </div>
                            <span className="text-[9px] text-zinc-400">Today</span>
                          </div>
                        </div>
                      )}

                      {activeTab.id === "library" && (
                        <div className="space-y-2 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                              <FolderLock className="h-3.5 w-3.5 text-emerald-600" />
                              Offline App Safe
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                              4 Documents
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-200/60 text-[10px] text-emerald-800 dark:text-emerald-300 space-y-1">
                            <div className="font-semibold">✓ Welcome to Smiley PDF.pdf</div>
                            <div className="text-[9px] text-zinc-500">Stored safely in sandbox</div>
                          </div>
                        </div>
                      )}

                      {activeTab.id === "privacy" && (
                        <div className="space-y-2 p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 text-center">
                          <ShieldCheck className="h-7 w-7 text-blue-600 mx-auto" />
                          <div className="text-xs font-bold text-blue-900 dark:text-blue-200">
                            Zero Dangerous Permissions
                          </div>
                          <p className="text-[10px] text-blue-800/80 dark:text-blue-300 leading-snug">
                            No MANAGE_EXTERNAL_STORAGE. Your photos & personal data are never scanned.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Floating Bar */}
                    <div className="p-2 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 flex items-center justify-around text-zinc-500 text-[10px]">
                      <div className="flex flex-col items-center text-amber-600 font-bold">
                        <Smile className="h-3.5 w-3.5" />
                        <span>Home</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Recents</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <FolderLock className="h-3.5 w-3.5" />
                        <span>Library</span>
                      </div>
                    </div>

                  </div>

                  <div className="w-16 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600 mx-auto mt-2" />
                </div>
              </div>

              {/* Right Column: Tab Feature Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${activeTab.badgeColor}`}>
                    <Sparkles className="h-3.5 w-3.5" />
                    {activeTab.badge}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white tracking-tight">
                    {activeTab.title}
                  </h3>

                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                    {activeTab.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed pt-1">
                    {activeTab.description}
                  </p>
                </div>

                {/* Bullet Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeTab.bullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/50 space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                        <h4 className="text-xs font-bold text-[#111111] dark:text-white truncate">
                          {bullet.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed pl-6">
                        {bullet.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Direct Action Link */}
                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={release.arm64Apk.downloadUrl}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold active:scale-[0.98] transition-all shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download APK ({release.arm64Apk.formattedSize})</span>
                  </a>
                  <a
                    href="https://github.com/imvicky69/smiley-pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white flex items-center gap-1"
                  >
                    <span>View GitHub Release Notes</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ── 3. More Tools Coming Soon (Dedicated Roadmap Grid) ──────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#F5F4EE] dark:border-zinc-800/80 pb-5">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                <Sparkles className="h-3 w-3" />
                Expanding Ecosystem
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white">
                All More Tools Coming to Smiley PDF
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
                Smiley PDF is expanding from a joyfully fast reader into a complete, 100% free and ad-free on-device PDF power suite.
              </p>
            </div>

            <a
              href="https://github.com/imvicky69/smiley-pdf/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Suggest a Feature</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {UPCOMING_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.title}
                  className="p-5 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/50 border border-[#EAEAE5] dark:border-zinc-800 space-y-3 hover:border-amber-400/60 dark:hover:border-amber-500/40 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#111111] dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed mt-1.5">
                      {tool.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. Comparison vs Other PDF Readers ──────────────────────── */}
        <section className="space-y-6">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              The Clear Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white">
              Why Users Choose Smiley PDF
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
              See how Smiley PDF compares to typical ad-heavy store PDF readers.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/60">
                  <th className="p-4 sm:p-5 font-bold text-[#111111] dark:text-white">Feature & Privacy Check</th>
                  <th className="p-4 sm:p-5 font-extrabold text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20">
                    😄 Smiley PDF
                  </th>
                  <th className="p-4 sm:p-5 font-semibold text-[#6E6D68] dark:text-zinc-400">
                    Typical Store PDF Apps
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F4EE] dark:divide-zinc-800/80">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-[#111111] dark:text-white">Advertisements & Popups</td>
                  <td className="p-4 sm:p-5 bg-amber-50/30 dark:bg-amber-950/10 font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ 100% Zero Ads Forever
                  </td>
                  <td className="p-4 sm:p-5 text-rose-600 dark:text-rose-400">
                    ✕ Intrusive banners, interstitials & video ads
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-[#111111] dark:text-white">Storage Permissions</td>
                  <td className="p-4 sm:p-5 bg-amber-50/30 dark:bg-amber-950/10 font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ Scoped SAF (No Dangerous Rights)
                  </td>
                  <td className="p-4 sm:p-5 text-rose-600 dark:text-rose-400">
                    ✕ Demands All-Files-Access (scans whole device)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-[#111111] dark:text-white">Rendering Engine</td>
                  <td className="p-4 sm:p-5 bg-amber-50/30 dark:bg-amber-950/10 font-bold text-[#111111] dark:text-white">
                    ⚡ PDFium Native (Instant 60fps)
                  </td>
                  <td className="p-4 sm:p-5 text-[#6E6D68] dark:text-zinc-400">
                    Slow WebView or heavy laggy renderers
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-[#111111] dark:text-white">Subscription & Watermarks</td>
                  <td className="p-4 sm:p-5 bg-amber-50/30 dark:bg-amber-950/10 font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ 100% Free, Zero Watermarks
                  </td>
                  <td className="p-4 sm:p-5 text-rose-600 dark:text-rose-400">
                    ✕ $29 - $79 / year subscriptions & watermarks
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-[#111111] dark:text-white">App Size & Cleanliness</td>
                  <td className="p-4 sm:p-5 bg-amber-50/30 dark:bg-amber-950/10 font-bold text-[#111111] dark:text-white">
                    📦 Lightweight Split APK (~25 MB)
                  </td>
                  <td className="p-4 sm:p-5 text-[#6E6D68] dark:text-zinc-400">
                    120 MB - 250 MB bloated installs
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 5. Simple 3-Step Sideload Guide ────────────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-1 max-w-lg mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Quick Setup
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white">
              Install Smiley PDF in Under 30 Seconds
            </h2>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
              Standard secure Android sideload directly from GitHub Releases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/50 border border-[#EAEAE5] dark:border-zinc-800 space-y-2">
              <span className="h-7 w-7 rounded-xl bg-amber-100 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-xs font-mono font-bold flex items-center justify-center text-amber-900 dark:text-amber-300">
                1
              </span>
              <h4 className="text-sm font-bold text-[#111111] dark:text-white">Download APK</h4>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Tap the Download button to grab the <code className="bg-[#F5F4EE] dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px]">arm64-v8a</code> APK straight from the official release.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/50 border border-[#EAEAE5] dark:border-zinc-800 space-y-2">
              <span className="h-7 w-7 rounded-xl bg-amber-100 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-xs font-mono font-bold flex items-center justify-center text-amber-900 dark:text-amber-300">
                2
              </span>
              <h4 className="text-sm font-bold text-[#111111] dark:text-white">Allow & Install</h4>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Tap the completed download notification in your browser. If prompted, toggle &ldquo;Allow from this source&rdquo;.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/50 border border-[#EAEAE5] dark:border-zinc-800 space-y-2">
              <span className="h-7 w-7 rounded-xl bg-amber-100 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-xs font-mono font-bold flex items-center justify-center text-amber-900 dark:text-amber-300">
                3
              </span>
              <h4 className="text-sm font-bold text-[#111111] dark:text-white">Read with a Smile</h4>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Open Smiley PDF. View documents, organize recents, bookmark your favorites, and enjoy ad-free reading forever.
              </p>
            </div>
          </div>
        </section>

        {/* ── 6. Curated FAQs ────────────────────────────────────────── */}
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

        {/* ── 7. Bottom Clean Call to Action ─────────────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#111111] dark:bg-[#000000] text-white p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <div className="h-16 w-16 mx-auto rounded-2xl overflow-hidden p-1.5 bg-white/10 border border-white/20 shadow-lg">
              <Image
                src="/smiley-logo.png"
                alt="Smiley PDF"
                width={64}
                height={64}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              100% Free & Open Source Android App
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em]">
              Start Reading PDFs Joyfully Today
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Experience the fast, ad-free, and private document manager for Android. No subscriptions, no tracking, just pure reading.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={release.arm64Apk.downloadUrl}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs sm:text-sm font-bold active:scale-[0.98] transition-all shadow-md"
            >
              <Smartphone className="h-4 w-4" />
              <span>Download Android APK</span>
              <span className="text-[10px] font-mono text-amber-950/80 bg-amber-400/80 px-1.5 py-0.5 rounded">
                {release.arm64Apk.formattedSize}
              </span>
            </a>

            <a
              href="https://github.com/imvicky69/smiley-pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-2xl bg-transparent border border-zinc-700 text-zinc-300 text-xs sm:text-sm font-semibold hover:text-white hover:border-zinc-500 transition-all"
            >
              <GithubIcon className="h-4 w-4" />
              <span>View on GitHub</span>
            </a>
          </div>

          <div className="relative z-10 text-[11px] text-zinc-500 font-medium">
            Android 5.0+ (API 21+) · Package: in.xweet.smileypdf · Zero Cloud Telemetry
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
