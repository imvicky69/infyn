"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eraser,
  Minimize2,
  Maximize2,
  ArrowLeftRight,
  FileImage,
  ShieldCheck,
  FileOutput,
  Images,
  Lock,
  Combine,
  Unlock,
  Scissors,
  QrCode,
  Download,
  Heart,
  Binary,
  LayoutDashboard,
  Sparkles,
  Code2,
  Smartphone,
  Film,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedLogo } from "@/components/animatedLogo";

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

interface NavTool {
  name: string;
  href: string;
  desc: string;
  icon: React.ReactNode;
  badge?: string;
}

const IMAGE_TOOLS: NavTool[] = [
  {
    name: "PNG → SVG Converter",
    href: "/image/png-to-svg",
    badge: "Vector",
    desc: "Potrace & ImageTracer vectorizer",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    name: "QR Code Generator",
    href: "/image/qr-code",
    badge: "Vector",
    desc: "Custom shapes, logos & frames",
    icon: <QrCode className="h-4 w-4" />,
  },
  {
    name: "Background Remover",
    href: "/image/bg-remover",
    badge: "AI",
    desc: "Instant transparent cutouts",
    icon: <Eraser className="h-4 w-4" />,
  },

  {
    name: "Image Compressor",
    href: "/image/compressor",
    badge: "Batch",
    desc: "Lossless & quality control",
    icon: <Minimize2 className="h-4 w-4" />,
  },
  {
    name: "Image Resizer",
    href: "/image/resizer",
    desc: "Framing & social aspect ratios",
    icon: <Maximize2 className="h-4 w-4" />,
  },
  {
    name: "Universal Converter",
    href: "/image/converter",
    badge: "Batch",
    desc: "JPG · PNG · WEBP · AVIF · HEIC",
    icon: <ArrowLeftRight className="h-4 w-4" />,
  },
  {
    name: "HEIC to JPG",
    href: "/image/heic-to-jpg",
    desc: "Batch iPhone photo conversion",
    icon: <FileImage className="h-4 w-4" />,
  },
  {
    name: "Metadata Remover",
    href: "/image/exif-remover",
    badge: "Privacy",
    desc: "Strip GPS, camera & timestamps",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
];

const PDF_TOOLS_NAV: NavTool[] = [
  {
    name: "PDF Compressor",
    href: "/pdf/compressor",
    badge: "Batch",
    desc: "Shrink PDF file size up to 90%",
    icon: <Minimize2 className="h-4 w-4" />,
  },
  {
    name: "Image to PDF",
    href: "/image/img-to-pdf",
    desc: "Convert photos to PDF with page reorder",
    icon: <FileOutput className="h-4 w-4" />,
  },
  {
    name: "PDF to Image",
    href: "/pdf/pdf-to-image",
    desc: "Extract pages to HD JPG, PNG, WEBP",
    icon: <Images className="h-4 w-4" />,
  },
  {
    name: "PDF Protector",
    href: "/pdf/protector",
    badge: "New",
    desc: "Secure PDFs with an AES-256 password",
    icon: <Lock className="h-4 w-4" />,
  },
  {
    name: "PDF Merger",
    href: "/pdf/merger",
    badge: "New",
    desc: "Combine multiple PDFs into a single file",
    icon: <Combine className="h-4 w-4" />,
  },
  {
    name: "PDF Unlocker",
    href: "/pdf/unlocker",
    badge: "New",
    desc: "Remove passwords from your PDFs",
    icon: <Unlock className="h-4 w-4" />,
  },
  {
    name: "PDF Splitter",
    href: "/pdf/splitter",
    badge: "New",
    desc: "Extract or split pages from a PDF",
    icon: <Scissors className="h-4 w-4" />,
  },
];

const DEV_TOOLS_NAV: NavTool[] = [
  {
    name: "Base64 Studio",
    href: "/dev/base64",
    badge: "New",
    desc: "Convert assets to Base64 & CSS Data URI",
    icon: <Binary className="h-4 w-4" />,
  },
  {
    name: "SVG Cleaner",
    href: "/dev/svg-cleaner",
    badge: "New",
    desc: "Clean & minify SVG vector markup",
    icon: <Code2 className="h-4 w-4" />,
  },
];

const APPS_NAV: NavTool[] = [
  {
    name: "Infyn DL",
    href: "/dl",
    badge: "App",
    desc: "Universal music & video downloader for PC & Android",
    icon: <Download className="h-4 w-4" />,
  },
  {
    name: "Infyn Home Tab",
    href: "/home-tab",
    badge: "Extension",
    desc: "Bookmarks, weather & focus Pomodoro new tab",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
];

interface MobileNavItem {
  id: string;
  name: string;
  href: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBoxClass: string;
  badge?: string;
  badgeClass?: string;
  tools?: NavTool[];
}

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  {
    id: "image",
    name: "Image Tools",
    href: "/image",
    subtitle: "8 tools · Compress, convert, resize & AI",
    icon: <Sparkles className="h-4 w-4" />,
    iconBoxClass:
      "bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/70 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400",
    badge: "Suite",
    badgeClass:
      "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/60",
    tools: IMAGE_TOOLS,
  },
  {
    id: "pdf",
    name: "PDF Tools",
    href: "/pdf",
    subtitle: "7 tools · Compress, merge, split & protect",
    icon: <FileOutput className="h-4 w-4" />,
    iconBoxClass:
      "bg-rose-50 dark:bg-rose-950/50 border border-rose-200/70 dark:border-rose-800/50 text-rose-600 dark:text-rose-400",
    badge: "Suite",
    badgeClass:
      "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60",
    tools: PDF_TOOLS_NAV,
  },
  {
    id: "dev",
    name: "Developer Tools",
    href: "/dev",
    subtitle: "3 tools · Base64, SVG cleaner & API docs",
    icon: <Code2 className="h-4 w-4" />,
    iconBoxClass:
      "bg-amber-50 dark:bg-amber-950/50 border border-amber-200/70 dark:border-amber-800/50 text-amber-600 dark:text-amber-400",
    badge: "Suite",
    badgeClass:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
    tools: DEV_TOOLS_NAV,
  },
  {
    id: "apps",
    name: "Apps & Extensions",
    href: "/apps",
    subtitle: "Infyn DL & Home Tab",
    icon: <Smartphone className="h-4 w-4" />,
    iconBoxClass:
      "bg-sky-50 dark:bg-sky-950/50 border border-sky-200/70 dark:border-sky-800/50 text-sky-600 dark:text-sky-400",
    badge: "Apps",
    badgeClass:
      "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/60",
    tools: APPS_NAV,
  },
  {
    id: "movies",
    name: "Movies & Shows",
    href: "/movies",
    subtitle: "Direct 1080p FHD downloads & streaming",
    icon: <Film className="h-4 w-4" />,
    iconBoxClass:
      "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400",
    badge: "1080p FHD",
    badgeClass:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-700/60",
  },
  {
    id: "sponsor",
    name: "Sponsor & Donate",
    href: "/sponsor",
    subtitle: "Keep Infyn 100% free, private & open",
    icon: <Heart className="h-4 w-4 fill-rose-500/20 text-rose-500" />,
    iconBoxClass:
      "bg-rose-50 dark:bg-rose-950/50 border border-rose-200/70 dark:border-rose-800/50 text-rose-600 dark:text-rose-400",
    badge: "100% Free",
    badgeClass:
      "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-300/80 dark:border-rose-700/60",
  },
];

function MoviePopcornIcon() {
  return (
    <motion.div
      key="route-icon-movies"
      initial={{ scale: 0.6, opacity: 0, x: -4 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      exit={{ scale: 0.6, opacity: 0, x: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 shadow-2xs select-none"
      title="Movies & Entertainment"
    >
      {/* Popcorn SVG with animated popping kernels */}
      <div className="relative h-4 w-4 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          {/* Popcorn box / bucket */}
          <path
            d="M6 10L7.5 21H16.5L18 10H6Z"
            fill="#EF4444"
            stroke="#DC2626"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* White stripes on bucket */}
          <path d="M9 10.5L10 20.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M15 10.5L14 20.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          {/* Popcorn puffs */}
          <circle cx="8" cy="9" r="2.2" fill="#FDE047" stroke="#EAB308" strokeWidth="0.8" />
          <circle cx="12" cy="7.5" r="2.6" fill="#FEF08A" stroke="#EAB308" strokeWidth="0.8" />
          <circle cx="16" cy="9" r="2.2" fill="#FDE047" stroke="#EAB308" strokeWidth="0.8" />
          <circle cx="10" cy="8.5" r="1.8" fill="#FACC15" />
          <circle cx="14" cy="8.5" r="1.8" fill="#FACC15" />
        </svg>

        {/* Popping micro kernel 1 */}
        <motion.span
          animate={{
            y: [0, -3.5, 0],
            x: [0, -1, 0],
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.4,
            ease: "easeInOut",
          }}
          className="absolute -top-0.5 left-0.5 h-1 w-1 rounded-full bg-amber-400 pointer-events-none"
        />
        {/* Popping micro kernel 2 */}
        <motion.span
          animate={{
            y: [0, -4, 0],
            x: [0, 1.2, 0],
            scale: [0.9, 1.25, 0.9],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            delay: 0.5,
            ease: "easeInOut",
          }}
          className="absolute -top-1 right-0.5 h-1 w-1 rounded-full bg-yellow-300 pointer-events-none"
        />
      </div>

      {/* Clapperboard SVG with animated clapping top */}
      <div className="relative h-4 w-4 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          {/* Base of clapper */}
          <rect
            x="4"
            y="9"
            width="16"
            height="11"
            rx="1.5"
            fill="#18181B"
            stroke="#27272A"
            strokeWidth="1.2"
          />
          {/* White stripes on base */}
          <path d="M8 9V20" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" />
          <path d="M12 9V20" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" />
          <path d="M16 9V20" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" />
        </svg>

        {/* Clapper Top arm that snaps open and shut */}
        <motion.svg
          viewBox="0 0 24 24"
          className="absolute inset-0 h-4 w-4 origin-bottom-left"
          animate={{
            rotate: [0, -18, 0],
          }}
          transition={{
            repeat: Infinity,
            repeatDelay: 2.2,
            duration: 0.45,
            ease: "easeInOut",
          }}
          fill="none"
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="4"
            rx="1"
            fill="#18181B"
            stroke="#27272A"
            strokeWidth="1"
          />
          <path d="M7 4L5.5 8" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M11 4L9.5 8" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M15 4L13.5 8" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M19 4L17.5 8" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
        </motion.svg>
      </div>
    </motion.div>
  );
}

function PdfDocIcon() {
  return (
    <motion.div
      key="route-icon-pdf"
      initial={{ scale: 0.6, opacity: 0, x: -4 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      exit={{ scale: 0.6, opacity: 0, x: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 dark:bg-rose-400/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 shadow-2xs select-none"
      title="PDF Tools"
    >
      <div className="relative h-4 w-4 flex items-center justify-center shrink-0">
        <motion.svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          animate={{ y: [0, -1.5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          fill="none"
        >
          <path
            d="M6 3H14L19 8V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V4C5 3.44772 5.44772 3 6 3Z"
            fill="#FFF1F2"
            stroke="#E11D48"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M14 3V8H19"
            fill="#FECDD3"
            stroke="#E11D48"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M8 12H16" stroke="#E11D48" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M8 15H14" stroke="#FB7185" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M8 18H11" stroke="#FDA4AF" strokeWidth="1.2" strokeLinecap="round" />
        </motion.svg>
        <motion.span
          animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-rose-400 pointer-events-none"
        />
      </div>
      <span className="text-[10px] font-bold tracking-wider">PDF</span>
    </motion.div>
  );
}

function ImageToolsIcon() {
  return (
    <motion.div
      key="route-icon-image"
      initial={{ scale: 0.6, opacity: 0, x: -4 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      exit={{ scale: 0.6, opacity: 0, x: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-400 shadow-2xs select-none"
      title="Image Suite"
    >
      <div className="relative h-4 w-4 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="3"
            fill="#EEF2FF"
            stroke="#4F46E5"
            strokeWidth="1.4"
          />
          <circle cx="8" cy="8.5" r="1.8" fill="#FBBF24" />
          <path
            d="M3 17L8.5 11.5L14 17L17.5 13.5L21 17V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V17Z"
            fill="#818CF8"
            fillOpacity="0.5"
          />
        </svg>
        <motion.div
          animate={{ rotate: [0, 90, 180, 270, 360], scale: [0.9, 1.3, 0.9] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute -top-1 -right-1 text-indigo-500 pointer-events-none"
        >
          <Sparkles className="h-2.5 w-2.5 fill-indigo-400" />
        </motion.div>
      </div>
      <span className="text-[10px] font-bold tracking-wider">IMG</span>
    </motion.div>
  );
}

function AppsNavIcon() {
  return (
    <motion.div
      key="route-icon-apps"
      initial={{ scale: 0.6, opacity: 0, x: -4 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      exit={{ scale: 0.6, opacity: 0, x: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-500/10 dark:bg-sky-400/10 border border-sky-500/25 text-sky-600 dark:text-sky-400 shadow-2xs select-none"
      title="Apps & Extensions"
    >
      <div className="relative h-4 w-4 flex items-center justify-center shrink-0">
        <motion.svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          fill="none"
        >
          <rect
            x="6"
            y="2"
            width="12"
            height="20"
            rx="3"
            fill="#F0F9FF"
            stroke="#0284C7"
            strokeWidth="1.4"
          />
          <path d="M10 5H14" stroke="#0284C7" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="12" cy="18.5" r="1" fill="#0284C7" />
          <rect x="8.5" y="8" width="2.5" height="2.5" rx="0.5" fill="#38BDF8" />
          <rect x="13" y="8" width="2.5" height="2.5" rx="0.5" fill="#0284C7" />
          <rect x="8.5" y="12.5" width="2.5" height="2.5" rx="0.5" fill="#0284C7" />
          <rect x="13" y="12.5" width="2.5" height="2.5" rx="0.5" fill="#38BDF8" />
        </motion.svg>
        <motion.span
          animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-sky-400 pointer-events-none"
        />
      </div>
      <span className="text-[10px] font-bold tracking-wider">APP</span>
    </motion.div>
  );
}

function DevToolsIcon() {
  return (
    <motion.div
      key="route-icon-dev"
      initial={{ scale: 0.6, opacity: 0, x: -4 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      exit={{ scale: 0.6, opacity: 0, x: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 shadow-2xs select-none"
      title="Developer Tools"
    >
      <div className="relative h-4 w-4 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="3"
            fill="#ECFDF5"
            stroke="#059669"
            strokeWidth="1.4"
          />
          <path
            d="M8 9L5 12L8 15"
            stroke="#059669"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 9L19 12L16 15"
            stroke="#059669"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 8L11 16"
            stroke="#10B981"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="absolute bottom-1.5 right-2 h-1.5 w-0.8 bg-emerald-500 rounded-xs pointer-events-none"
        />
      </div>
      <span className="text-[10px] font-bold tracking-wider">DEV</span>
    </motion.div>
  );
}

function SponsorNavIcon() {
  return (
    <motion.div
      key="route-icon-sponsor"
      initial={{ scale: 0.6, opacity: 0, x: -4 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      exit={{ scale: 0.6, opacity: 0, x: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 dark:bg-rose-400/10 border border-rose-500/25 text-rose-500 shadow-2xs select-none"
      title="Sponsor & Donate"
    >
      <motion.div
        animate={{ scale: [1, 1.25, 1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        className="h-4 w-4 flex items-center justify-center text-rose-500 shrink-0"
      >
        <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
      </motion.div>
    </motion.div>
  );
}

function ContributingNavIcon() {
  return (
    <motion.div
      key="route-icon-contribute"
      initial={{ scale: 0.6, opacity: 0, x: -4 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      exit={{ scale: 0.6, opacity: 0, x: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-500/10 dark:bg-violet-400/10 border border-violet-500/25 text-violet-600 dark:text-violet-400 shadow-2xs select-none"
      title="Contributing"
    >
      <motion.div
        animate={{ rotate: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="h-4 w-4 flex items-center justify-center shrink-0"
      >
        <Sparkles className="h-3.5 w-3.5" />
      </motion.div>
    </motion.div>
  );
}

function DynamicRouteIcon({ pathname }: { pathname: string }) {
  if (pathname.startsWith("/movies")) {
    return <MoviePopcornIcon />;
  }
  if (pathname.startsWith("/pdf")) {
    return <PdfDocIcon />;
  }
  if (pathname.startsWith("/image")) {
    return <ImageToolsIcon />;
  }
  if (
    pathname.startsWith("/apps") ||
    pathname.startsWith("/dl") ||
    pathname.startsWith("/home-tab")
  ) {
    return <AppsNavIcon />;
  }
  if (pathname.startsWith("/dev")) {
    return <DevToolsIcon />;
  }
  if (pathname.startsWith("/sponsor")) {
    return <SponsorNavIcon />;
  }
  if (pathname.startsWith("/contributing")) {
    return <ContributingNavIcon />;
  }

  return null;
}

export function Navbar() {
  const pathname = usePathname();
  const [imageDropdownOpen, setImageDropdownOpen] = useState(false);
  const [pdfDropdownOpen, setPdfDropdownOpen] = useState(false);
  const [devDropdownOpen, setDevDropdownOpen] = useState(false);
  const [appsDropdownOpen, setAppsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setImageDropdownOpen(false);
    setPdfDropdownOpen(false);
    setDevDropdownOpen(false);
    setAppsDropdownOpen(false);
    setExpandedCategory(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const preventTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-mobile-drawer]")) {
        e.preventDefault();
      }
    };

    const preventWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-mobile-drawer]")) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventTouch, { passive: false });
    window.addEventListener("wheel", preventWheel, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventTouch);
      window.removeEventListener("wheel", preventWheel);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on desktop screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setPdfDropdownOpen(false);
    setDevDropdownOpen(false);
    setAppsDropdownOpen(false);
    setImageDropdownOpen(true);
  };

  const handlePdfMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setImageDropdownOpen(false);
    setDevDropdownOpen(false);
    setAppsDropdownOpen(false);
    setPdfDropdownOpen(true);
  };

  const handleDevMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setImageDropdownOpen(false);
    setPdfDropdownOpen(false);
    setAppsDropdownOpen(false);
    setDevDropdownOpen(true);
  };

  const handleAppsMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setImageDropdownOpen(false);
    setPdfDropdownOpen(false);
    setDevDropdownOpen(false);
    setAppsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setImageDropdownOpen(false);
      setPdfDropdownOpen(false);
      setDevDropdownOpen(false);
      setAppsDropdownOpen(false);
    }, 180);
  };

  return (
    <header className={`${mobileMenuOpen ? "fixed" : "sticky"} top-0 left-0 right-0 z-50 w-full`}>
      {/* Main nav bar */}
      <div className="border-b border-[#EAEAE5]/70 dark:border-zinc-800/80 bg-[#FBFBFA]/90 dark:bg-[#0C0C0E]/90 backdrop-blur-2xl transition-colors">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}

          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="infyn home"
          >
            <div className="relative flex items-center justify-center">
              <AnimatedLogo
                variant="navbar"
                width={32}
                className="text-[#111111] dark:text-white group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex items-center gap-2 leading-none">
              <span className="font-bold text-[#111111] dark:text-white text-lg tracking-tight">
                infyn
              </span>
              <AnimatePresence mode="wait">
                <DynamicRouteIcon key={pathname} pathname={pathname} />
              </AnimatePresence>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {/* Image Tools dropdown */}
            <div
              className="relative"
              onMouseEnter={handleImageMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/image"
                onClick={() => setImageDropdownOpen(false)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer tracking-[-0.01em] ${
                  imageDropdownOpen || pathname.startsWith("/image")
                    ? "bg-[#F0EFEA] text-[#111111]"
                    : "text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE]"
                }`}
              >
                <span>Image Tools</span>
                <motion.svg
                  animate={{ rotate: imageDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className="h-3.5 w-3.5 text-[#9E9D98]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </Link>

              {/* Image Dropdown */}
              <AnimatePresence>
                {imageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 mt-2 w-[320px] rounded-2xl bg-white/98 backdrop-blur-2xl border border-[#EAEAE5] shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] p-2 z-50"
                  >
                    <div className="px-3 py-2 flex items-center justify-between border-b border-[#F5F4EE] mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
                        Image Suite
                      </span>
                      <Link
                        href="/image"
                        onClick={() => setImageDropdownOpen(false)}
                        className="text-[11px] font-bold text-[#111111] hover:underline"
                      >
                        View All →
                      </Link>
                    </div>

                    <div className="space-y-0.5">
                      {IMAGE_TOOLS.map((tool) => {
                        const isActive = pathname === tool.href;
                        return (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={() => setImageDropdownOpen(false)}
                            className={`group/item flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                              isActive ? "bg-[#F5F4EE]" : "hover:bg-[#F8F8F6]"
                            }`}
                          >
                            <div className="h-8 w-8 rounded-lg bg-[#FBFBFA] border border-[#EAEAE5] flex items-center justify-center text-[#111111] shrink-0">
                              {tool.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-[13px] text-[#111111] truncate tracking-[-0.01em]">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5F4EE] text-[#6E6D68] border border-[#EAEAE5] shrink-0">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#9E9D98] truncate mt-0.5">{tool.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PDF Tools dropdown */}
            <div
              className="relative"
              onMouseEnter={handlePdfMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/pdf"
                onClick={() => setPdfDropdownOpen(false)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer tracking-[-0.01em] ${
                  pdfDropdownOpen || pathname.startsWith("/pdf")
                    ? "bg-[#F0EFEA] text-[#111111]"
                    : "text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE]"
                }`}
              >
                <span>PDF Tools</span>
                <motion.svg
                  animate={{ rotate: pdfDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className="h-3.5 w-3.5 text-[#9E9D98]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </Link>

              {/* PDF Dropdown */}
              <AnimatePresence>
                {pdfDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 mt-2 w-[320px] rounded-2xl bg-white/98 backdrop-blur-2xl border border-[#EAEAE5] shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] p-2 z-50"
                  >
                    <div className="px-3 py-2 flex items-center justify-between border-b border-[#F5F4EE] mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
                        PDF Suite
                      </span>
                      <Link
                        href="/pdf"
                        onClick={() => setPdfDropdownOpen(false)}
                        className="text-[11px] font-bold text-[#111111] hover:underline"
                      >
                        View All →
                      </Link>
                    </div>


                    <div className="space-y-0.5">
                      {PDF_TOOLS_NAV.map((tool) => {
                        const isActive = pathname === tool.href;
                        return (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={() => setPdfDropdownOpen(false)}
                            className={`group/item flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                              isActive ? "bg-[#F5F4EE]" : "hover:bg-[#F8F8F6]"
                            }`}
                          >
                            <div className="h-8 w-8 rounded-lg bg-[#FBFBFA] border border-[#EAEAE5] flex items-center justify-center text-[#111111] shrink-0">
                              {tool.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-[13px] text-[#111111] truncate tracking-[-0.01em]">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5F4EE] text-[#6E6D68] border border-[#EAEAE5] shrink-0">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#9E9D98] truncate mt-0.5">{tool.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dev Tools dropdown */}
            <div
              className="relative"
              onMouseEnter={handleDevMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/dev"
                onClick={() => setDevDropdownOpen(false)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer tracking-[-0.01em] ${
                  devDropdownOpen || pathname.startsWith("/dev")
                    ? "bg-[#F0EFEA] text-[#111111]"
                    : "text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE]"
                }`}
              >
                <span>Dev Tools</span>
                <motion.svg
                  animate={{ rotate: devDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className="h-3.5 w-3.5 text-[#9E9D98]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </Link>

              {/* Dev Dropdown */}
              <AnimatePresence>
                {devDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 mt-2 w-[320px] rounded-2xl bg-white/98 backdrop-blur-2xl border border-[#EAEAE5] shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] p-2 z-50"
                  >
                    <div className="px-3 py-2 flex items-center justify-between border-b border-[#F5F4EE] mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
                        Developer Suite
                      </span>
                      <Link
                        href="/dev"
                        onClick={() => setDevDropdownOpen(false)}
                        className="text-[11px] font-bold text-[#111111] hover:underline"
                      >
                        View All →
                      </Link>
                    </div>

                    <div className="space-y-0.5">
                      {DEV_TOOLS_NAV.map((tool) => {
                        const isActive = pathname === tool.href;
                        return (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={() => setDevDropdownOpen(false)}
                            className={`group/item flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                              isActive ? "bg-[#F5F4EE]" : "hover:bg-[#F8F8F6]"
                            }`}
                          >
                            <div className="h-8 w-8 rounded-lg bg-[#FBFBFA] border border-[#EAEAE5] flex items-center justify-center text-[#111111] shrink-0">
                              {tool.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-[13px] text-[#111111] truncate tracking-[-0.01em]">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5F4EE] text-[#6E6D68] border border-[#EAEAE5] shrink-0">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#9E9D98] truncate mt-0.5">{tool.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Apps & Extensions dropdown */}
            <div
              className="relative"
              onMouseEnter={handleAppsMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/apps"
                onClick={() => setAppsDropdownOpen(false)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer tracking-[-0.01em] ${
                  appsDropdownOpen || pathname.startsWith("/apps") || pathname.startsWith("/dl") || pathname.startsWith("/home-tab")
                    ? "bg-[#F0EFEA] text-[#111111]"
                    : "text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE]"
                }`}
              >
                <span>Apps</span>
                <motion.svg
                  animate={{ rotate: appsDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className="h-3.5 w-3.5 text-[#9E9D98]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </Link>

              {/* Apps Dropdown */}
              <AnimatePresence>
                {appsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 mt-2 w-[320px] rounded-2xl bg-white/98 backdrop-blur-2xl border border-[#EAEAE5] shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] p-2 z-50"
                  >
                    <div className="px-3 py-2 flex items-center justify-between border-b border-[#F5F4EE] mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
                        Apps & Extensions
                      </span>
                      <Link
                        href="/apps"
                        onClick={() => setAppsDropdownOpen(false)}
                        className="text-[11px] font-bold text-[#111111] hover:underline"
                      >
                        View All →
                      </Link>
                    </div>

                    <div className="space-y-0.5">
                      {APPS_NAV.map((tool) => {
                        const isActive = pathname === tool.href;
                        return (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={() => setAppsDropdownOpen(false)}
                            className={`group/item flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                              isActive ? "bg-[#F5F4EE]" : "hover:bg-[#F8F8F6]"
                            }`}
                          >
                            <div className="h-8 w-8 rounded-lg bg-[#FBFBFA] border border-[#EAEAE5] flex items-center justify-center text-[#111111] shrink-0">
                              {tool.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-[13px] text-[#111111] truncate tracking-[-0.01em]">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5F4EE] text-[#6E6D68] border border-[#EAEAE5] shrink-0">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#9E9D98] truncate mt-0.5">{tool.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Movies Link */}
            <Link
              href="/movies"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-colors ${
                pathname.startsWith("/movies")
                  ? "text-[#111111] dark:text-white font-semibold bg-[#F5F4EE] dark:bg-zinc-800/80"
                  : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800/50"
              }`}
            >
              <Film className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Movies</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                1080p
              </span>
            </Link>

            {/* Sponsor Link */}
            <Link
              href="/sponsor"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-colors ${
                pathname.startsWith("/sponsor")
                  ? "text-[#111111] dark:text-white font-semibold bg-[#F5F4EE] dark:bg-zinc-800/80"
                  : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800/50"
              }`}
            >
              <Heart className="h-3 w-3 text-rose-500/80" />
              <span>Sponsor</span>
            </Link>

            {/* Divider */}
            <div className="w-px h-4 bg-[#EAEAE5] dark:bg-zinc-800 mx-1" />

            {/* Theme toggle */}
            <ThemeToggle />

            {/* GitHub */}
            <a
              href="https://github.com/imvicky69/infyn"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-[#9E9D98] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          </nav>

          {/* Mobile right controls */}
          <div className="flex md:hidden items-center gap-1.5">
            <ThemeToggle />
            
            <button
              type="button"
              onClick={() => setMobileMenuOpen((p) => !p)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
            >
              <motion.div
                animate={mobileMenuOpen ? "open" : "closed"}
                className="h-4 w-4 flex flex-col justify-center gap-[4px]"
              >
                <motion.span
                  variants={{ open: { rotate: 45, y: 5 }, closed: { rotate: 0, y: 0 } }}
                  className="block h-[1.5px] w-4 bg-current origin-center transition-all"
                />
                <motion.span
                  variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}
                  className="block h-[1.5px] w-4 bg-current transition-all"
                />
                <motion.span
                  variants={{ open: { rotate: -45, y: -5 }, closed: { rotate: 0, y: 0 } }}
                  className="block h-[1.5px] w-4 bg-current origin-center transition-all"
                />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop overlay for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-14 bg-black/25 dark:bg-black/50 backdrop-blur-xs md:hidden z-40"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile slide-down drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-drawer"
            data-mobile-drawer="true"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain custom-scrollbar border-b border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA]/98 dark:bg-[#0C0C0E]/98 backdrop-blur-2xl md:hidden shadow-xl"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="max-w-xl mx-auto px-4 py-3.5 space-y-2.5 pb-6">
              {/* Primary Navigation Items */}
              <div className="space-y-1.5">
                {MOBILE_NAV_ITEMS.map((item) => {
                  const isExpanded = expandedCategory === item.id;
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isExpanded
                          ? "bg-white dark:bg-zinc-900 border-[#BEBDB9] dark:border-zinc-700 shadow-xs"
                          : isActive
                          ? "bg-white dark:bg-zinc-900 border-[#BEBDB9] dark:border-zinc-700"
                          : "bg-white/70 dark:bg-zinc-900/40 border-[#EAEAE5] dark:border-zinc-800/80 hover:bg-white dark:hover:bg-zinc-900 hover:border-[#BEBDB9]"
                      }`}
                    >
                      <div className="flex items-center justify-between p-2.5 sm:p-3 gap-2">
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <div
                            className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${item.iconBoxClass}`}
                          >
                            {item.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[13px] text-[#111111] dark:text-white truncate">
                                {item.name}
                              </span>
                              {item.badge && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border shrink-0 ${item.badgeClass}`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </Link>

                        {item.tools ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCategory(isExpanded ? null : item.id);
                            }}
                            aria-label={isExpanded ? `Collapse ${item.name}` : `Expand ${item.name}`}
                            className={`p-2 rounded-xl text-[#9E9D98] hover:text-[#111111] dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer ${
                              isExpanded ? "bg-[#F5F4EE] dark:bg-zinc-800 text-[#111111] dark:text-white" : ""
                            }`}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-xl text-[#9E9D98] hover:text-[#111111] dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-colors"
                            aria-label={`Open ${item.name}`}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
                      </div>

                      {/* Smooth Collapsible Sub-links */}
                      <AnimatePresence>
                        {isExpanded && item.tools && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden border-t border-[#F5F4EE] dark:border-zinc-800/80 bg-[#FBFBFA]/70 dark:bg-black/30"
                          >
                            <div className="p-2 space-y-1">
                              {item.tools.map((tool) => {
                                const isToolActive = pathname === tool.href;
                                return (
                                  <Link
                                    key={tool.href}
                                    href={tool.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-[12px] transition-all group ${
                                      isToolActive
                                        ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white font-semibold shadow-2xs"
                                        : "text-[#555550] dark:text-zinc-300 hover:text-[#111111] dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800/60"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <span className="text-[#6E6D68] dark:text-zinc-400 group-hover:text-[#111111] dark:group-hover:text-white transition-colors shrink-0">
                                        {tool.icon}
                                      </span>
                                      <span className="truncate font-medium">{tool.name}</span>
                                    </div>
                                    {tool.badge && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-400 border border-[#EAEAE5] dark:border-zinc-700 shrink-0">
                                        {tool.badge}
                                      </span>
                                    )}
                                  </Link>
                                );
                              })}

                              <div className="pt-1 px-1">
                                <Link
                                  href={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-[11px] font-bold text-[#111111] dark:text-white bg-[#F0EFEA] dark:bg-zinc-800/80 hover:bg-[#EAEAE5] dark:hover:bg-zinc-800 transition-colors"
                                >
                                  <span>View all {item.name}</span>
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Quick Links, 3-Mode Theme & GitHub Footer */}
              <div className="pt-2 border-t border-[#EAEAE5] dark:border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between gap-2 px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E9D98] dark:text-zinc-500">
                    Appearance
                  </span>
                  <ThemeToggle variant="segmented" />
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href="/contributing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900 text-[11px] font-semibold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-2xs"
                  >
                    <span>Contribute</span>
                  </Link>

                  <Link
                    href="/sponsor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 text-[11px] font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100/60 dark:hover:bg-rose-900/40 active:scale-[0.98] transition-all shadow-2xs"
                  >
                    <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                    <span>Sponsor</span>
                  </Link>

                  <a
                    href="https://github.com/imvicky69/infyn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900 text-[#6E6D68] dark:text-zinc-300 hover:text-[#111111] dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-2xs shrink-0"
                    aria-label="GitHub"
                  >
                    <GithubIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
