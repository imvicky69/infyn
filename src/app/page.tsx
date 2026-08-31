"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import SplitText from "@/components/SplitText";
import TextLoop from "@/components/TextLoop";

interface ToolItem {
  href: string;
  title: string;
  category: "image" | "pdf" | "converter" | "developer";
  categoryLabel: string;
  badge: string;
  badgeColor: string;
  description: string;
  tags: string[];
  formats: string[];
  icon: React.ReactNode;
  accentFrom: string;
  accentTo: string;
}

const TOOLS: ToolItem[] = [
  {
    href: "/image/bg-remover",
    title: "Background Remover",
    category: "image",
    categoryLabel: "AI Vision Model",
    badge: "Neural AI",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    description:
      "Instantly remove backgrounds from portraits, products, and graphics using on-device neural AI. Add custom colors or studio gradients.",
    tags: ["On-Device AI", "No Watermark", "HD Export"],
    formats: ["PNG", "JPG", "WEBP"],
    accentFrom: "from-emerald-100",
    accentTo: "to-emerald-50",
    icon: (
      <div className="relative h-12 w-12 rounded-[14px] bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_2px_8px_rgba(16,185,129,0.12)] group-hover:scale-105 group-hover:shadow-[0_0_0_1px_rgba(16,185,129,0.14),0_4px_16px_rgba(16,185,129,0.18)] transition-all duration-200">
        <svg className="h-5.5 w-5.5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      </div>
    ),
  },
  {
    href: "/image/compressor",
    title: "Image Compressor",
    category: "image",
    categoryLabel: "Size Optimizer",
    badge: "Up to −90%",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
    description:
      "Drastically shrink image file sizes without quality loss. Supports target KB limits, WebP conversion, and batch ZIP export.",
    tags: ["Target KB Limit", "Batch ZIP", "Visual Slider"],
    formats: ["JPG", "PNG", "WEBP", "AVIF"],
    accentFrom: "from-blue-100",
    accentTo: "to-blue-50",
    icon: (
      <div className="relative h-12 w-12 rounded-[14px] bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_2px_8px_rgba(59,130,246,0.12)] group-hover:scale-105 group-hover:shadow-[0_0_0_1px_rgba(59,130,246,0.14),0_4px_16px_rgba(59,130,246,0.18)] transition-all duration-200">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0 0h4.5m-4.5 0L9 3.75M20.25 3.75h-4.5m0 0v4.5m0-4.5L15 9m5.25 11.25v-4.5m0 0h-4.5m4.5 0L15 20.25M3.75 20.25h4.5m0 0v-4.5m0 4.5L9 15" />
        </svg>
      </div>
    ),
  },
  {
    href: "/image/resizer",
    title: "Image Resizer",
    category: "image",
    categoryLabel: "Scale & Crop",
    badge: "Social Presets",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
    description:
      "Scale pixel dimensions, reposition crop windows, or fit with blurred background. Preconfigured for Instagram, YouTube, and WhatsApp.",
    tags: ["Pan & Zoom", "Aspect Lock", "Blur Fit"],
    formats: ["JPG", "PNG", "WEBP", "HEIC", "AVIF"],
    accentFrom: "from-purple-100",
    accentTo: "to-purple-50",
    icon: (
      <div className="relative h-12 w-12 rounded-[14px] bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-700 shadow-[0_0_0_1px_rgba(139,92,246,0.08),0_2px_8px_rgba(139,92,246,0.12)] group-hover:scale-105 group-hover:shadow-[0_0_0_1px_rgba(139,92,246,0.14),0_4px_16px_rgba(139,92,246,0.18)] transition-all duration-200">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M9 9h6v6H9V9z" />
        </svg>
      </div>
    ),
  },
  {
    href: "/image/converter",
    title: "Universal Image Converter",
    category: "converter",
    categoryLabel: "Format Converter",
    badge: "All Formats",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80",
    description:
      "Batch convert images between HEIC, JPG, PNG, WebP, and AVIF formats with 1-click popular presets and instant ZIP download.",
    tags: ["1-Click Presets", "Batch 50+", "ZIP Download"],
    formats: ["HEIC", "JPG", "PNG", "WEBP", "AVIF"],
    accentFrom: "from-amber-100",
    accentTo: "to-amber-50",
    icon: (
      <div className="relative h-12 w-12 rounded-[14px] bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shadow-[0_0_0_1px_rgba(245,158,11,0.08),0_2px_8px_rgba(245,158,11,0.12)] group-hover:scale-105 group-hover:shadow-[0_0_0_1px_rgba(245,158,11,0.14),0_4px_16px_rgba(245,158,11,0.18)] transition-all duration-200">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </div>
    ),
  },
  {
    href: "/image/heic-to-jpg",
    title: "HEIC to JPG Converter",
    category: "converter",
    categoryLabel: "iPhone Photos",
    badge: "WASM Engine",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200/80",
    description:
      "Decode and convert Apple iPhone .HEIC and .HEIF photos into universally compatible JPG or PNG images with full camera EXIF preserved.",
    tags: ["Apple HEIC", "Full Camera Res", "Batch ZIP"],
    formats: ["HEIC", "HEIF", "JPG", "PNG"],
    accentFrom: "from-rose-100",
    accentTo: "to-rose-50",
    icon: (
      <div className="relative h-12 w-12 rounded-[14px] bg-gradient-to-br from-rose-100 to-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-700 shadow-[0_0_0_1px_rgba(244,63,94,0.08),0_2px_8px_rgba(244,63,94,0.12)] group-hover:scale-105 group-hover:shadow-[0_0_0_1px_rgba(244,63,94,0.14),0_4px_16px_rgba(244,63,94,0.18)] transition-all duration-200">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      </div>
    ),
  },
  {
    href: "/image/exif-remover",
    title: "Metadata & EXIF Remover",
    category: "image",
    categoryLabel: "Privacy & Security",
    badge: "100% Sanitized",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200/80",
    description:
      "Strip hidden GPS location coordinates, camera models, capture timestamps, and personal tracking data from photos before sharing.",
    tags: ["GPS Coordinates", "Camera & Lens", "Zero Uploads"],
    formats: ["JPG", "PNG", "WEBP", "HEIC", "TIFF"],
    accentFrom: "from-teal-100",
    accentTo: "to-teal-50",
    icon: (
      <div className="relative h-12 w-12 rounded-[14px] bg-gradient-to-br from-teal-100 to-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700 shadow-[0_0_0_1px_rgba(20,184,166,0.08),0_2px_8px_rgba(20,184,166,0.12)] group-hover:scale-105 group-hover:shadow-[0_0_0_1px_rgba(20,184,166,0.14),0_4px_16px_rgba(20,184,166,0.18)] transition-all duration-200">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
  },
  {
    href: "/image/img-to-pdf",
    title: "Image to PDF",
    category: "pdf",
    categoryLabel: "Document Builder",
    badge: "Drag & Reorder",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200/80",
    description:
      "Convert one or more images into a PDF. Upload, drag to reorder pages, choose page size (A4, Letter, A5…), set margins, and download instantly.",
    tags: ["Batch Upload", "Drag Reorder", "Custom Size"],
    formats: ["JPG", "PNG", "WEBP → PDF"],
    accentFrom: "from-orange-100",
    accentTo: "to-orange-50",
    icon: (
      <div className="relative h-12 w-12 rounded-[14px] bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-700 shadow-[0_0_0_1px_rgba(249,115,22,0.08),0_2px_8px_rgba(249,115,22,0.12)] group-hover:scale-105 group-hover:shadow-[0_0_0_1px_rgba(249,115,22,0.14),0_4px_16px_rgba(249,115,22,0.18)] transition-all duration-200">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
    ),
  },
  {
    href: "/pdf/pdf-to-image",
    title: "PDF to Image Converter",
    category: "pdf",
    categoryLabel: "Document Extraction",
    badge: "HD 300 DPI",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
    description:
      "Extract every page of your PDF into high-resolution JPG, PNG, or WebP images up to 300 DPI. 1-Click ZIP export.",
    tags: ["HD 300 DPI", "Page Select", "1-Click ZIP"],
    formats: ["PDF → JPG", "PNG", "WEBP"],
    accentFrom: "from-blue-100",
    accentTo: "to-blue-50",
    icon: (
      <div className="relative h-12 w-12 rounded-[14px] bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_2px_8px_rgba(59,130,246,0.12)] group-hover:scale-105 group-hover:shadow-[0_0_0_1px_rgba(59,130,246,0.14),0_4px_16px_rgba(59,130,246,0.18)] transition-all duration-200">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
    ),
  },
];


const UPCOMING = [
  {
    title: "PDF Merger & Splitter",
    category: "PDF Suite",
    desc: "Combine multiple PDF documents or extract page ranges locally with zero upload lag.",
    iconBg: "from-orange-100 to-orange-50 border-orange-200/60 text-orange-700",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "SVG Vector Minifier",
    category: "Developer Suite",
    desc: "Strip unnecessary SVG metadata, minify coordinate precision, and clean vector markup.",
    iconBg: "from-violet-100 to-violet-50 border-violet-200/60 text-violet-700",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Base64 & Data URI Studio",
    category: "Developer Suite",
    desc: "Convert images, fonts, and assets into production-ready Base64 and CSS data URI strings.",
    iconBg: "from-sky-100 to-sky-50 border-sky-200/60 text-sky-700",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
];

const COMPARISONS = [
  {
    feature: "Data Privacy & Security",
    traditional: "Uploads your files to remote cloud servers",
    infyn: "100% On-device execution — 0 KB uploaded",
  },
  {
    feature: "Pricing & Limits",
    traditional: "Freemium traps, paywalls & low-res watermarks",
    infyn: "100% Free Forever with unlimited HD exports",
  },
  {
    feature: "Ads & Trackers",
    traditional: "Heavy banner ads, popups & third-party cookies",
    infyn: "100% Ad-Free, clean, uncluttered interface",
  },
  {
    feature: "Processing Speed",
    traditional: "Bottlenecked by slow upload and download speeds",
    infyn: "Zero network latency — instant WASM compute",
  },
  {
    feature: "Batch Handling",
    traditional: "Limits batch uploads or requires paid pro plans",
    infyn: "Batch upload 50+ files with 1-Click ZIP export",
  },
];

const FAQS = [
  {
    q: "Are my files really processed entirely on my device?",
    a: "Yes, 100%. When you drag files into Infyn, our WebAssembly (WASM) and HTML5 Canvas engines execute all algorithms directly inside your browser tab. Your files never touch any external server or cloud bucket.",
  },
  {
    q: "Is Infyn completely free? Are there hidden paywalls or watermarks?",
    a: "Infyn is 100% free with zero paywalls, zero ads, and zero watermarks on exported files. You get unlimited full-resolution exports without signing up or creating an account.",
  },
  {
    q: "Can I convert or compress multiple images at the same time?",
    a: "Yes! Infyn is built batch-first. You can upload dozens of photos simultaneously and download all processed results in a single, organized ZIP archive with 1 click.",
  },
  {
    q: "What file formats are supported across Infyn tools?",
    a: "We support all major image formats including Apple HEIC/HEIF, PNG, JPG/JPEG, WebP, and AVIF. We also support transparent alpha channels across all compatible formats.",
  },
];

const FILTER_TABS = [
  { id: "all", label: "All Tools" },
  { id: "image", label: "Image Tools" },
  { id: "pdf", label: "PDF Tools" },
  { id: "converter", label: "Converters" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── Inline SVG icons for CTA buttons ───────────────────────── */
function CompressIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0 0h4.5m-4.5 0L9 3.75M20.25 3.75h-4.5m0 0v4.5m0-4.5L15 9m5.25 11.25v-4.5m0 0h-4.5m4.5 0L15 20.25M3.75 20.25h4.5m0 0v-4.5m0 4.5L9 15" />
    </svg>
  );
}
function ResizeIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M9 9h6v6H9V9z" />
    </svg>
  );
}
function ConvertIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

/* ── Check / Cross SVG badges for comparison table ──────────── */
function CheckBadge() {
  return (
    <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-emerald-100 border border-emerald-300/60 shrink-0">
      <svg className="h-2.5 w-2.5 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </span>
  );
}
function CrossBadge() {
  return (
    <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-rose-100 border border-rose-300/60 shrink-0">
      <svg className="h-2.5 w-2.5 text-rose-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  );
}

export default function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory =
        selectedFilter === "all" || tool.category === selectedFilter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.formats.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tool.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedFilter, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#E8E6DE] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 space-y-16">
        {/* ── Hero Section ─────────────────────────────────────────── */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-7 max-w-3xl mx-auto"
        >
          {/* Trust Pill — gradient bg + float animation */}
          <motion.div variants={itemVariants} className="animate-float-badge inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F0FDF8] via-white to-[#EEF4FF] border border-[#EAEAE5] text-xs font-semibold text-[#111111] shadow-[0_2px_12px_rgba(16,185,129,0.10)]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="tracking-[-0.01em]">100% Free Forever · Zero Ads · 0 KB Cloud Uploads</span>
          </motion.div>

          {/* H1 — font-black, tight tracking, editorial weight */}
          <motion.div variants={itemVariants}>
            <SplitText
              text="Fast, Private In-Browser Utilities."
              className="text-[2.6rem] sm:text-[3.4rem] lg:text-[4rem] font-extrabold tracking-[-0.035em] text-[#111111] leading-[1.08]"
              delay={35}
              duration={0.85}
              splitType="words, chars"
              tag="h1"
              textAlign="center"
            />
          </motion.div>

          {/* Subtitle — larger, better line height */}
          <motion.p
            variants={itemVariants}
            className="text-[15px] sm:text-base text-[#6E6D68] leading-[1.7] max-w-xl mx-auto tracking-[-0.005em]"
          >
            All operations execute locally inside your browser via WebAssembly. Remove backgrounds, compress, resize, and convert images — without server uploads.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-2.5 pt-1"
          >
            <Link
              href="/image/bg-remover"
              className="relative overflow-hidden btn-shimmer-hover inline-flex items-center gap-2 rounded-2xl bg-[#111111] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1a1a1a] active:scale-[0.98] transition-all shadow-sm group"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Remove Background</span>
              <svg
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/image/compressor"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[#EAEAE5] bg-white px-4 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#F5F4EE] hover:border-[#BEBDB9] active:scale-[0.98] transition-all shadow-2xs"
            >
              <CompressIcon />
              <span>Compress</span>
            </Link>

            <Link
              href="/image/resizer"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[#EAEAE5] bg-white px-4 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#F5F4EE] hover:border-[#BEBDB9] active:scale-[0.98] transition-all shadow-2xs"
            >
              <ResizeIcon />
              <span>Resize</span>
            </Link>

            <Link
              href="/image/converter"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[#EAEAE5] bg-white px-4 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#F5F4EE] hover:border-[#BEBDB9] active:scale-[0.98] transition-all shadow-2xs"
            >
              <ConvertIcon />
              <span>Convert</span>
            </Link>
          </motion.div>

          {/* 3-stat bar — social proof */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-2 pt-1 text-[11px] font-semibold text-[#9E9D98] tracking-[0.01em]"
          >
            <span>50+ File Batch</span>
            <span className="h-0.5 w-0.5 rounded-full bg-[#BEBDB9]" />
            <span>Zero Cloud Uploads</span>
            <span className="h-0.5 w-0.5 rounded-full bg-[#BEBDB9]" />
            <span>6 Tools & Growing</span>
          </motion.div>
        </motion.section>

        {/* ── Tools Catalog Section ─────────────────────────────────── */}
        <section id="tools" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAEAE5] pb-5">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
                In-Browser Suite
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
                Available Utilities
              </h2>
              <p className="text-[13px] text-[#6E6D68] tracking-[-0.005em]">
                Fast, ad-free, and 100% private in-browser tools
              </p>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools or formats…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 sm:w-56 pl-8 pr-3 py-1.5 rounded-xl border border-[#EAEAE5] bg-white text-xs text-[#111111] placeholder-[#9E9D98] focus:outline-none focus:border-[#111111] shadow-2xs transition-colors"
                />
                <svg
                  className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#9E9D98]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>

              <div className="inline-flex rounded-xl bg-[#F5F4EE] p-1 border border-[#EAEAE5]">
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedFilter(tab.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedFilter === tab.id
                        ? "bg-white text-[#111111] shadow-2xs"
                        : "text-[#6E6D68] hover:text-[#111111]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tool Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.href}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Link
                    href={tool.href}
                    className="group h-full rounded-2xl border border-[#EAEAE5] bg-white p-5 sm:p-6 flex flex-col justify-between hover:border-[#BEBDB9] hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="space-y-4">
                      {/* Icon + badge (badge now below icon) */}
                      <div className="flex items-start justify-between">
                        {tool.icon}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tool.badgeColor} mt-0.5`}
                        >
                          {tool.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-[#111111] tracking-[-0.01em] group-hover:text-black leading-tight">
                          {tool.title}
                        </h3>
                        <p className="text-[13px] text-[#6E6D68] leading-[1.6] line-clamp-2">
                          {tool.description}
                        </p>
                      </div>

                      {/* Capability Tags — dot-separated, no border */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {tool.tags.map((tag, i) => (
                          <React.Fragment key={tag}>
                            <span className="text-[11px] font-medium text-[#9E9D98]">
                              {tag}
                            </span>
                            {i < tool.tags.length - 1 && (
                              <span className="text-[#BEBDB9] text-[10px]">·</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Footer: Formats & hover-only arrow */}
                    <div className="pt-4 mt-4 flex items-center justify-between border-t border-[#F5F4EE]">
                      <div className="text-[10px] font-semibold text-[#BEBDB9] tracking-[0.02em]">
                        {tool.formats.join(" · ")}
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-[#111111] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 transition-all duration-200">
                        <span>Open</span>
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12 rounded-2xl border border-dashed border-[#EAEAE5] bg-white space-y-2">
              <p className="text-sm font-semibold text-[#111111]">No utilities found matching &ldquo;{searchQuery}&rdquo;</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("all");
                }}
                className="mt-2 text-xs font-bold text-[#111111] underline hover:text-[#6E6D68]"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* ── Kinetic Text Loop with fade masks ────────────────────── */}
        <div className="py-2 overflow-hidden select-none marquee-fade-mask">
          <TextLoop
            text="100% IN-BROWSER ✦ ZERO CLOUD UPLOADS ✦ PRIVATE & FREE ✦ BATCH READY"
            shape="line"
            fontSize={26}
            fontWeight={800}
            letterSpacing={3}
            speed={60}
            color="#111111"
            ribbon={false}
            pauseOnHover={true}
            className="w-full opacity-80"
          />
        </div>

        {/* ── Architecture Comparison ───────────────────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] bg-white p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
              Architecture Comparison
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
              Why In-Browser Processing Wins
            </h2>
            <p className="text-[13px] text-[#6E6D68] leading-[1.6]">
              Traditional converters upload your files to remote servers. Infyn computes everything directly in your browser tab with zero cloud latency.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EAEAE5]">
                  <th className="py-3 pr-4 font-bold text-[#6E6D68] text-[11px] uppercase tracking-wider">Capability</th>
                  <th className="py-3 px-4 font-bold text-rose-700 text-[11px] uppercase tracking-wider bg-rose-50/40 rounded-tl-xl">
                    Traditional Cloud
                  </th>
                  <th className="py-3 px-4 font-bold text-emerald-800 text-[11px] uppercase tracking-wider bg-emerald-50/60 rounded-tr-xl">
                    Infyn (In-Browser)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F4EE]">
                {COMPARISONS.map((c) => (
                  <tr key={c.feature} className="hover:bg-[#FBFBFA] transition-colors">
                    <td className="py-3.5 pr-4 font-semibold text-[13px] text-[#111111] tracking-[-0.005em]">{c.feature}</td>
                    <td className="py-3.5 px-4 bg-rose-50/25">
                      <div className="flex items-start gap-2 text-rose-700 text-[12px] leading-relaxed">
                        <CrossBadge />
                        <span>{c.traditional}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 bg-emerald-50/30">
                      <div className="flex items-start gap-2 text-emerald-800 text-[12px] leading-relaxed font-medium">
                        <CheckBadge />
                        <span>{c.infyn}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Upcoming Roadmap ─────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAEAE5] pb-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
                Roadmap
              </span>
              <h2 className="text-base font-bold text-[#111111]">
                Coming Soon
              </h2>
              <p className="text-[12px] text-[#6E6D68]">In active development · 100% Free Forever</p>
            </div>
            <span className="text-xs font-semibold text-[#9E9D98] bg-[#F5F4EE] px-2.5 py-1 rounded-full border border-[#EAEAE5]">
              Free Soon
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {UPCOMING.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-[#EAEAE5] bg-white p-5 space-y-3 shadow-2xs hover:border-[#BEBDB9] transition-all opacity-80 hover:opacity-100"
              >
                <div className="flex items-center justify-between">
                  <div className={`h-10 w-10 rounded-[12px] bg-gradient-to-br ${item.iconBg} border flex items-center justify-center grayscale-[30%]`}>
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F5F4EE] text-[#9E9D98] border border-[#EAEAE5]">
                    Soon
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9E9D98]">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#111111] mt-0.5 tracking-[-0.01em]">{item.title}</h4>
                  <p className="text-[12px] text-[#6E6D68] leading-relaxed mt-1.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* ── FAQ Section ───────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="border-b border-[#EAEAE5] pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">Support</span>
            <h2 className="text-lg sm:text-xl font-bold text-[#111111] mt-0.5">
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
                  className="rounded-2xl border border-[#EAEAE5] bg-white overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center gap-4 hover:bg-[#FBFBFA] transition-colors cursor-pointer"
                  >
                    {/* Question number */}
                    <span className="text-[11px] font-bold text-[#BEBDB9] shrink-0 tabular-nums w-5">
                      {num}
                    </span>
                    <span className="text-sm font-semibold text-[#111111] flex-1 tracking-[-0.01em]">{faq.q}</span>
                    {/* Animated chevron */}
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="shrink-0 text-[#9E9D98]"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-5 pb-4 text-[13px] text-[#6E6D68] leading-[1.7] border-t border-[#F5F4EE] pt-3 pl-14">
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
      </main>

      <Footer />
    </div>
  );
}
