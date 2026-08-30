"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import SplitText from "@/components/SplitText";
import TextLoop from "@/components/TextLoop";

interface ToolItem {
  href: string;
  title: string;
  category: "image" | "converter" | "developer";
  categoryLabel: string;
  badge: string;
  badgeColor: string;
  description: string;
  tags: string[];
  formats: string[];
  icon: React.ReactNode;
}

const TOOLS: ToolItem[] = [
  {
    href: "/image/bg-remover",
    title: "Background Remover",
    category: "image",
    categoryLabel: "AI Vision Model",
    badge: "Neural AI",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    description:
      "Instantly remove backgrounds from portraits, products, and graphics using on-device neural AI. Add custom colors or studio gradients.",
    tags: ["On-Device AI", "No Watermark", "HD Export"],
    formats: ["PNG", "JPG", "WEBP"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs group-hover:scale-105 transition-transform">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
    badge: "Up to -90%",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200/80",
    description:
      "Drastically shrink image file sizes without quality loss. Supports target KB limits, WebP conversion, and batch ZIP export.",
    tags: ["Target KB Limit", "Batch ZIP", "Visual Slider"],
    formats: ["JPG", "PNG", "WEBP", "AVIF"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 shadow-2xs group-hover:scale-105 transition-transform">
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
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200/80",
    description:
      "Scale pixel dimensions, reposition crop windows, or fit with blurred background. Preconfigured for Instagram, YouTube, and WhatsApp.",
    tags: ["Pan & Zoom", "Aspect Lock", "Blur Fit"],
    formats: ["JPG", "PNG", "WEBP", "HEIC", "AVIF"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-700 shadow-2xs group-hover:scale-105 transition-transform">
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
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200/80",
    description:
      "Batch convert images between HEIC, JPG, PNG, WebP, and AVIF formats with 1-click popular presets and instant ZIP download.",
    tags: ["1-Click Presets", "Batch 50+", "ZIP Download"],
    formats: ["HEIC", "JPG", "PNG", "WEBP", "AVIF"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-800 shadow-2xs group-hover:scale-105 transition-transform">
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
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200/80",
    description:
      "Decode and convert Apple iPhone .HEIC and .HEIF photos into universally compatible JPG or PNG images with full camera EXIF preserved.",
    tags: ["Apple HEIC", "Full Camera Res", "Batch ZIP"],
    formats: ["HEIC", "HEIF", "JPG", "PNG"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-700 shadow-2xs group-hover:scale-105 transition-transform">
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
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200/80",
    description:
      "Strip hidden GPS location coordinates, camera models, capture timestamps, and personal tracking data from photos before sharing.",
    tags: ["GPS Coordinates", "Camera & Lens", "Zero Uploads"],
    formats: ["JPG", "PNG", "WEBP", "HEIC", "TIFF"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shadow-2xs group-hover:scale-105 transition-transform">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    icon: (
      <svg className="h-5 w-5 text-[#6E6D68]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "SVG Vector Minifier",
    category: "Developer Suite",
    desc: "Strip unnecessary SVG metadata, minify coordinate precision, and clean vector markup.",
    icon: (
      <svg className="h-5 w-5 text-[#6E6D68]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Base64 & Data URI Studio",
    category: "Developer Suite",
    desc: "Convert images, fonts, and assets into production-ready Base64 and CSS data URI strings.",
    icon: (
      <svg className="h-5 w-5 text-[#6E6D68]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
        {/* ── Minimal Hero Section ─────────────────────────────────────── */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-6 max-w-3xl mx-auto"
        >
          {/* Trust Pill */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#EAEAE5] text-xs font-semibold text-[#111111] shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Free Forever • Zero Ads • 0 KB Cloud Uploads</span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants}>
            <SplitText
              text="Fast, Private In-Browser Utilities."
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111111] leading-[1.1]"
              delay={35}
              duration={0.85}
              splitType="words, chars"
              tag="h1"
              textAlign="center"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-[#6E6D68] leading-relaxed max-w-2xl mx-auto"
          >
            All operations execute locally inside your browser via WebAssembly. Remove backgrounds, compress, resize, and convert images without server uploads.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <Link
              href="/image/bg-remover"
              className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#262626] active:scale-98 transition-all shadow-sm group"
            >
              <span>Remove Background</span>
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
              className="inline-flex items-center gap-2 rounded-xl border border-[#EAEAE5] bg-white px-5 py-3 text-xs sm:text-sm font-bold text-[#111111] hover:bg-[#F5F4EE] hover:border-[#BEBDB9] active:scale-98 transition-all shadow-2xs"
            >
              <span>Compress</span>
            </Link>

            <Link
              href="/image/resizer"
              className="inline-flex items-center gap-2 rounded-xl border border-[#EAEAE5] bg-white px-5 py-3 text-xs sm:text-sm font-bold text-[#111111] hover:bg-[#F5F4EE] hover:border-[#BEBDB9] active:scale-98 transition-all shadow-2xs"
            >
              <span>Resize</span>
            </Link>

            <Link
              href="/image/converter"
              className="inline-flex items-center gap-2 rounded-xl border border-[#EAEAE5] bg-white px-5 py-3 text-xs sm:text-sm font-bold text-[#111111] hover:bg-[#F5F4EE] hover:border-[#BEBDB9] active:scale-98 transition-all shadow-2xs"
            >
              <span>Convert</span>
            </Link>
          </motion.div>
        </motion.section>

        {/* ── Minimal Tools Catalog Section ────────────────────────────── */}
        <section id="tools" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAE5] pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#111111]">
                Available Utilities
              </h2>
              <p className="text-xs text-[#6E6D68] mt-0.5">
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

          {/* Minimal Tool Cards Grid */}
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
                    className="group h-full rounded-2xl border border-[#EAEAE5] bg-white p-5 sm:p-6 flex flex-col justify-between hover:border-[#BEBDB9] hover:shadow-xs transition-all duration-200"
                  >
                    <div className="space-y-3.5">
                      {/* Top Row: Icon + Badge */}
                      <div className="flex items-center justify-between">
                        {tool.icon}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tool.badgeColor}`}
                        >
                          {tool.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1">
                        <h3 className="text-sm sm:text-base font-bold text-[#111111] group-hover:text-black group-hover:underline underline-offset-2">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-[#6E6D68] leading-relaxed line-clamp-2">
                          {tool.description}
                        </p>
                      </div>

                      {/* Capability Tags */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {tool.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-[#FBFBFA] text-[10px] font-medium text-[#6E6D68] border border-[#EAEAE5]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer: Formats & Launch Arrow */}
                    <div className="pt-3.5 mt-4 flex items-center justify-between border-t border-[#F5F4EE] text-xs">
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-[#9E9D98]">
                        {tool.formats.join(" · ")}
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-[#111111] group-hover:translate-x-0.5 transition-transform">
                        <span>Open</span>
                        <svg
                          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
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

        {/* ── Kinetic In-Browser Highlights Text Loop ──────────────────── */}
        <div className="py-2 overflow-hidden select-none">
          <TextLoop
            text="100% IN-BROWSER ✦ ZERO CLOUD UPLOADS ✦ PRIVATE & FREE"
            shape="line"
            fontSize={26}
            fontWeight={800}
            letterSpacing={3}
            speed={60}
            color="#111111"
            ribbon={false}
            pauseOnHover={true}
            className="w-full opacity-85"
          />
        </div>

        {/* ── Architecture Comparison ──────────────────────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] bg-white p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
              Architecture Comparison
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
              Why In-Browser Processing is Better
            </h2>
            <p className="text-xs text-[#6E6D68] leading-relaxed">
              Traditional converters upload your files to remote servers. Infyn computes everything directly in your browser tab with zero cloud latency.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EAEAE5] text-[#6E6D68]">
                  <th className="py-2.5 pr-4 font-semibold">Capability</th>
                  <th className="py-2.5 px-4 font-semibold text-rose-700 bg-rose-50/50 rounded-tl-xl">
                    Traditional Cloud Converters
                  </th>
                  <th className="py-2.5 px-4 font-bold text-emerald-800 bg-emerald-50/70 rounded-tr-xl">
                    Infyn (In-Browser WASM)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F4EE]">
                {COMPARISONS.map((c) => (
                  <tr key={c.feature} className="hover:bg-[#FBFBFA] transition-colors">
                    <td className="py-3 pr-4 font-semibold text-[#111111]">{c.feature}</td>
                    <td className="py-3 px-4 text-rose-700 bg-rose-50/30">
                      <span>✕ {c.traditional}</span>
                    </td>
                    <td className="py-3 px-4 text-emerald-800 bg-emerald-50/40 font-medium">
                      <span>✓ {c.infyn}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Upcoming Roadmap Tools ───────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAEAE5] pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                Coming Soon
              </h2>
              <p className="text-xs text-[#6E6D68]">In active development • 100% Free Forever</p>
            </div>
            <span className="text-xs font-semibold text-[#9E9D98] bg-[#F5F4EE] px-2.5 py-1 rounded-full border border-[#EAEAE5]">
              Roadmap
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {UPCOMING.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-[#EAEAE5] bg-white p-4 sm:p-5 space-y-2 shadow-2xs hover:border-[#BEBDB9] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-xl bg-[#F5F4EE] border border-[#EAEAE5] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F5F4EE] text-[#6E6D68] border border-[#EAEAE5]">
                    Free Soon
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-[#111111] mt-0.5">{item.title}</h4>
                  <p className="text-[11px] text-[#6E6D68] leading-relaxed mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FAQ Section with Framer Motion Accordion ─────────────────── */}
        <section className="space-y-4">
          <div className="border-b border-[#EAEAE5] pb-3">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#111111]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-[#EAEAE5] bg-white overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left text-xs sm:text-sm font-bold text-[#111111] flex items-center justify-between gap-4 hover:bg-[#FBFBFA] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#9E9D98] text-sm shrink-0 font-normal">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-4 text-xs text-[#6E6D68] leading-relaxed border-t border-[#F5F4EE] pt-3">
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
