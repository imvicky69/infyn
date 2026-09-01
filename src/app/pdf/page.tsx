"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import SplitText from "@/components/SplitText";

interface PdfToolItem {
  href: string;
  title: string;
  badge: string;
  badgeColor: string;
  category: "all" | "conversion" | "builder" | "security" | "compression";
  categoryLabel: string;
  description: string;
  tags: string[];
  formats: string[];
  icon: React.ReactNode;
}

const PDF_TOOLS: PdfToolItem[] = [
  {
    href: "/pdf/compressor",
    title: "PDF Compressor & Minifier",
    badge: "Batch",
    badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200/80",
    category: "compression",
    categoryLabel: "Compression",
    description:
      "Drastically shrink PDF document file sizes up to 90% without quality loss. Target size limits & 1-Click ZIP export.",
    tags: ["Target KB Mode", "Multi-Preset", "No Upload"],
    formats: ["PDF"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-700 shadow-2xs group-hover:scale-105 transition-transform">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0 0h4.5m-4.5 0L9 3.75M20.25 3.75h-4.5m0 0v4.5m0-4.5L15 9m5.25 11.25v-4.5m0 0h-4.5m4.5 0L15 20.25M3.75 20.25h4.5m0 0v-4.5m0 4.5L9 15" />
        </svg>
      </div>
    ),
  },
  {
    href: "/pdf/pdf-to-image",
    title: "PDF to Image Converter",
    badge: "HD Export",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200/80",
    category: "conversion",
    categoryLabel: "Extraction",
    description:
      "Convert every page of your PDF into high-definition JPG, PNG, or WebP images. Download individual pages or 1-Click ZIP.",
    tags: ["Batch ZIP", "Page Select", "300 DPI Export"],
    formats: ["PDF → JPG", "PNG", "WEBP"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 shadow-2xs group-hover:scale-105 transition-transform">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
    ),
  },
  {
    href: "/image/img-to-pdf",
    title: "Image to PDF Converter",
    badge: "Drag & Reorder",
    badgeColor: "bg-orange-50 text-orange-800 border-orange-200/80",
    category: "builder",
    categoryLabel: "Document Builder",
    description:
      "Combine photos and images into a single PDF document. Rearrange pages visually, pick page sizes (A4, Letter, Auto), and set margins.",
    tags: ["A4 / Letter", "Auto Scale", "Grid Reorder"],
    formats: ["JPG", "PNG", "WEBP → PDF"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-700 shadow-2xs group-hover:scale-105 transition-transform">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
    ),
  },
  {
    href: "/pdf/protector",
    title: "PDF Protector",
    badge: "New",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    category: "security",
    categoryLabel: "Security",
    description: "Secure your PDFs with an AES-256 password to restrict access. Fast, offline, and safe.",
    tags: ["AES-256", "Batch Encrypt", "No Upload"],
    formats: ["PDF"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs group-hover:scale-105 transition-transform">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
    ),
  },
  {
    href: "/pdf/merger",
    title: "PDF Merger",
    badge: "New",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200/80",
    category: "builder",
    categoryLabel: "Document Builder",
    description: "Combine multiple PDF documents into one cleanly organized file with custom drag-and-drop page reordering.",
    tags: ["Drag & Drop", "Combine PDFs", "No Upload"],
    formats: ["PDF"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-700 shadow-2xs group-hover:scale-105 transition-transform">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
    ),
  },
  {
    href: "/pdf/unlocker",
    title: "PDF Unlocker",
    badge: "New",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200/80",
    category: "security",
    categoryLabel: "Security",
    description: "Remove passwords and unlock encrypted PDF documents safely and instantly.",
    tags: ["Decrypt", "Remove Password", "No Upload"],
    formats: ["PDF"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 shadow-2xs group-hover:scale-105 transition-transform">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
    ),
  },
  {
    href: "/pdf/splitter",
    title: "PDF Splitter",
    badge: "New",
    badgeColor: "bg-pink-50 text-pink-800 border-pink-200/80",
    category: "builder",
    categoryLabel: "Document Builder",
    description: "Visually select pages to extract into a new PDF or split into multiple individual documents.",
    tags: ["Extract Pages", "Split PDF", "No Upload"],
    formats: ["PDF"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-pink-50 border border-pink-200/80 flex items-center justify-center text-pink-700 shadow-2xs group-hover:scale-105 transition-transform">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
    ),
  },
];

const UPCOMING_PDF_TOOLS = [
  {
    title: "PDF Page Rotator & Organizer",
    badge: "Free Soon",
    category: "Organizer",
    description: "Visually rotate, duplicate, or reorder individual pages within your PDF documents.",
    icon: (
      <svg className="h-5 w-5 text-[#6E6D68]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
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

export default function PdfHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredTools = useMemo(() => {
    return PDF_TOOLS.filter((tool) => {
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
      <Breadcrumbs />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 space-y-16">
        {/* ── Hub Header ──────────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#EAEAE5] text-xs font-semibold text-[#111111] shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span>100% Free • In-Browser Document Processing • Zero Uploads</span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SplitText
              text="PDF Utilities Suite"
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
            A high-speed collection of client-side PDF document tools running locally on your device. Zero servers, zero limits, zero ads.
          </motion.p>
        </motion.div>

        {/* ── Tools Grid & Filter Section ──────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAE5] pb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[#111111]">
                Active PDF Utilities ({filteredTools.length})
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
                  { id: "compression", label: "Compress" },
                  { id: "conversion", label: "Convert" },
                  { id: "builder", label: "Create" },
                  { id: "security", label: "Security" },
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
              <p className="text-sm font-semibold text-[#111111]">No PDF tools match &ldquo;{searchQuery}&rdquo;</p>
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
                Upcoming PDF Utilities
              </h2>
              <p className="text-xs text-[#6E6D68]">In active development · 100% Free Forever</p>
            </div>
            <span className="text-xs font-semibold text-[#9E9D98] bg-[#F5F4EE] px-2.5 py-1 rounded-full border border-[#EAEAE5]">
              Roadmap
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {UPCOMING_PDF_TOOLS.map((tool) => (
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
              Document Privacy
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
              Why Client-Side PDF Processing Matters
            </h2>
            <p className="text-xs text-[#6E6D68] leading-relaxed">
              Legal documents, contracts, bank statements, and private records should never be uploaded to unknown remote servers. Infyn renders and creates PDFs 100% locally in your browser memory.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-2 p-4 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5]">
              <div className="h-8 w-8 rounded-xl bg-white border border-[#EAEAE5] flex items-center justify-center text-blue-700 shadow-2xs">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-[#111111]">Zero Cloud Uploads</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                PDFs are parsed and rendered directly with Mozilla PDF.js inside your browser thread. No logs, no telemetry.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5]">
              <div className="h-8 w-8 rounded-xl bg-white border border-[#EAEAE5] flex items-center justify-center text-emerald-700 shadow-2xs">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-[#111111]">Instant Batch Conversions</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                Export 50-page documents to high-res JPGs or combine hundreds of photos in seconds with 1-click ZIP export.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5]">
              <div className="h-8 w-8 rounded-xl bg-white border border-[#EAEAE5] flex items-center justify-center text-rose-700 shadow-2xs">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-[#111111]">No Watermarks or Subscriptions</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                100% free forever without daily page limits, banner ads, or stamped logos on your exported pages.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
