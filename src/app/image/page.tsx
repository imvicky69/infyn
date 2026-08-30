"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import SplitText from "@/components/SplitText";

interface ImageToolItem {
  href: string;
  title: string;
  badge: string;
  badgeColor: string;
  category: "all" | "ai" | "compression" | "conversion" | "resize";
  categoryLabel: string;
  description: string;
  tags: string[];
  formats: string[];
  icon: React.ReactNode;
}

const IMAGE_TOOLS: ImageToolItem[] = [
  {
    href: "/image/bg-remover",
    title: "Background Remover",
    badge: "Neural AI",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    category: "ai",
    categoryLabel: "AI Vision",
    description:
      "Erase backgrounds from portraits and products with on-device neural AI. Add custom colors or studio gradients.",
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
    badge: "Up to -90%",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200/80",
    category: "compression",
    categoryLabel: "Size Optimizer",
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
    badge: "Social Presets",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200/80",
    category: "resize",
    categoryLabel: "Scale & Crop",
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
    badge: "All Formats",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200/80",
    category: "conversion",
    categoryLabel: "Format Converter",
    description:
      "Batch convert images between HEIC, JPG, PNG, WebP, and AVIF formats with 1-click popular presets and instant ZIP download.",
    tags: ["1-Click Presets", "Batch 50+", "ZIP Download"],
    formats: ["HEIC", "JPG", "PNG", "WEBP", "AVIF"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-800 shadow-2xs group-hover:scale-105 transition-transform">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </div>
    ),
  },
  {
    href: "/image/heic-to-jpg",
    title: "HEIC to JPG Converter",
    badge: "WASM Engine",
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200/80",
    category: "conversion",
    categoryLabel: "iPhone Photos",
    description:
      "Decode and convert Apple iPhone .HEIC and .HEIF photos into universally compatible JPG or PNG images with full camera EXIF preserved.",
    tags: ["Apple HEIC", "Full Camera Res", "Batch ZIP"],
    formats: ["HEIC", "HEIF", "JPG", "PNG"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-700 shadow-2xs group-hover:scale-105 transition-transform">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      </div>
    ),
  },
  {
    href: "/image/exif-remover",
    title: "Metadata & EXIF Remover",
    badge: "100% Sanitized",
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200/80",
    category: "all",
    categoryLabel: "Privacy & Security",
    description:
      "Strip hidden GPS location coordinates, camera models, capture timestamps, and personal tracking data from photos before sharing.",
    tags: ["GPS Coordinates", "Camera & Lens", "Zero Uploads"],
    formats: ["JPG", "PNG", "WEBP", "HEIC", "TIFF"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shadow-2xs group-hover:scale-105 transition-transform">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
  },
];

const UPCOMING_TOOLS = [
  {
    title: "SVG Optimizer & Cleaner",
    badge: "Free Soon",
    category: "Vector",
    description: "Minify SVG vectors, strip unnecessary metadata and comments, and optimize SVG code for web apps.",
    icon: (
      <svg className="h-5 w-5 text-[#6E6D68]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Image Cropper & Resizer",
    badge: "Free Soon",
    category: "Dimensions",
    description: "Precise pixel cropping, predefined social media canvas sizes, circular avatar cutouts, and dimension scaling.",
    icon: (
      <svg className="h-5 w-5 text-[#6E6D68]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    title: "Blur & Watermark Tool",
    badge: "Free Soon",
    category: "Privacy",
    description: "Easily censor sensitive info, blur faces/license plates, or add custom branding watermarks in-browser.",
    icon: (
      <svg className="h-5 w-5 text-[#6E6D68]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
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

export default function ImageHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredTools = useMemo(() => {
    return IMAGE_TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.formats.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tool.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#E8E6DE] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 space-y-16">
        {/* ── Hub Header ──────────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#EAEAE5] text-xs font-semibold text-[#111111] shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Free • In-Browser Processing • Zero Uploads</span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SplitText
              text="Image Utilities Suite"
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]"
              delay={35}
              duration={0.85}
              splitType="words, chars"
              tag="h1"
              textAlign="center"
            />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm text-[#6E6D68] leading-relaxed"
          >
            A minimal collection of private, high-performance image processing tools running 100% locally on your device.
          </motion.p>
        </motion.div>

        {/* ── Tools Grid & Filter Section ──────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAE5] pb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[#111111]">
                Active Image Tools ({filteredTools.length})
              </h2>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter tools or formats…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 sm:w-52 pl-8 pr-3 py-1.5 rounded-xl border border-[#EAEAE5] bg-white text-xs text-[#111111] placeholder-[#9E9D98] focus:outline-none focus:border-[#111111] shadow-2xs transition-colors"
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
                {[
                  { id: "all", label: "All" },
                  { id: "ai", label: "AI" },
                  { id: "compression", label: "Compress" },
                  { id: "resize", label: "Resize" },
                  { id: "conversion", label: "Convert" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-white text-[#111111] shadow-2xs"
                        : "text-[#6E6D68] hover:text-[#111111]"
                    }`}
                  >
                    {cat.label}
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
              <p className="text-sm font-semibold text-[#111111]">No image tools match &ldquo;{searchQuery}&rdquo;</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-2 text-xs font-bold text-[#111111] underline hover:text-[#6E6D68]"
              >
                Reset filter
              </button>
            </div>
          )}
        </section>

        {/* ── Upcoming Tools in Development ────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAEAE5] pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                Upcoming Image Utilities
              </h2>
              <p className="text-xs text-[#6E6D68]">Next additions to the Infyn Image Suite</p>
            </div>
            <span className="text-xs font-semibold text-[#9E9D98] bg-[#F5F4EE] px-2.5 py-1 rounded-full border border-[#EAEAE5]">
              Roadmap
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {UPCOMING_TOOLS.map((tool) => (
              <motion.div
                key={tool.title}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-[#EAEAE5] bg-white p-4 sm:p-5 space-y-2 shadow-2xs hover:border-[#BEBDB9] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-xl bg-[#F5F4EE] border border-[#EAEAE5] flex items-center justify-center">
                    {tool.icon}
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F5F4EE] text-[#6E6D68] border border-[#EAEAE5]">
                    {tool.badge}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
                    {tool.category}
                  </span>
                  <h4 className="text-xs font-bold text-[#111111] mt-0.5">{tool.title}</h4>
                  <p className="text-[11px] text-[#6E6D68] mt-1 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Architectural Benefits ──────────────────────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] bg-white p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
              Privacy Guarantee
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
              Why Client-Side Image Processing Matters
            </h2>
            <p className="text-xs text-[#6E6D68] leading-relaxed">
              Traditional online converters upload your personal photos and sensitive documents to remote servers. Infyn does all computation directly on your device CPU and GPU.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-2 p-4 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5]">
              <div className="h-8 w-8 rounded-xl bg-white border border-[#EAEAE5] flex items-center justify-center text-purple-700 shadow-2xs">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-[#111111]">Complete Data Privacy</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                Images never leave your computer or phone. No analytics tracking, server logs, or stored files.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5]">
              <div className="h-8 w-8 rounded-xl bg-white border border-[#EAEAE5] flex items-center justify-center text-amber-700 shadow-2xs">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-[#111111]">Instant Zero Upload Lag</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                No slow uploading or downloading 50MB files to the cloud. Everything processes in milliseconds.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5]">
              <div className="h-8 w-8 rounded-xl bg-white border border-[#EAEAE5] flex items-center justify-center text-emerald-700 shadow-2xs">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-[#111111]">100% Free Without Watermarks</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                Batch compress 100 images or remove backgrounds on gigabytes of photos without hitting limits.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
