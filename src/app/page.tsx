"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NpmShowcase } from "@/components/npm-showcase";
import { InfynDlShowcase } from "@/components/infyn-dl-showcase";
import { InfynHomeTabShowcase } from "@/components/infyn-home-tab-showcase";
import SplitText from "@/components/SplitText";
import { AnimatedLogo } from "@/components/animatedLogo";
import {
  Eraser,
  Minimize2,
  Maximize2,
  ArrowLeftRight,
  FileImage,
  ShieldCheck,
  FileOutput,
  Images,
  Files,
  Split,
  Code2,
  Binary,
  Search,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Lock,
  Combine,
  Unlock,
  Scissors,
  QrCode,
  LayoutDashboard,
  Download
} from "lucide-react";

interface ToolItem {
  href: string;
  title: string;
  category: "image" | "pdf" | "developer" | "utilities";
  badge?: string;
  description: string;
  formats: string[];
  icon: React.ElementType;
  keywords?: string[];
}

const TOOLS: ToolItem[] = [
  {
    href: "/image/qr-code",
    title: "QR Code Generator",
    category: "image",
    badge: "Vector",
    description: "Design custom QR codes with logos, colors, Wi-Fi presets & frames.",
    formats: ["PNG", "SVG", "PDF"],
    icon: QrCode,
  },
  {
    href: "/image/bg-remover",
    title: "Background Remover",
    category: "image",
    badge: "AI",
    description: "Remove image backgrounds directly in your browser.",
    formats: ["PNG", "JPG", "WEBP"],
    icon: Eraser,
  },

  {
    href: "/image/compressor",
    title: "Image Compressor",
    category: "image",
    badge: "Batch",
    description: "Drastically shrink image file sizes without quality loss.",
    formats: ["JPG", "PNG", "WEBP", "AVIF"],
    icon: Minimize2,
  },
  {
    href: "/image/resizer",
    title: "Image Resizer",
    category: "image",
    description: "Scale pixel dimensions, crop, or fit with blurred background.",
    formats: ["JPG", "PNG", "WEBP", "HEIC"],
    icon: Maximize2,
  },
  {
    href: "/image/converter",
    title: "Universal Converter",
    category: "image",
    badge: "Batch",
    description: "Convert images between HEIC, JPG, PNG, WebP, and AVIF.",
    formats: ["HEIC", "JPG", "PNG", "WEBP", "AVIF"],
    icon: ArrowLeftRight,
  },
  {
    href: "/image/heic-to-jpg",
    title: "HEIC to JPG",
    category: "image",
    description: "Convert Apple iPhone .HEIC photos into JPG or PNG.",
    formats: ["HEIC", "JPG", "PNG"],
    icon: FileImage,
  },
  {
    href: "/image/exif-remover",
    title: "Metadata Remover",
    category: "image",
    description: "Strip hidden GPS coordinates and camera models from photos.",
    formats: ["JPG", "PNG", "WEBP", "HEIC"],
    icon: ShieldCheck,
  },
  {
    href: "/pdf/compressor",
    title: "PDF Compressor",
    category: "pdf",
    badge: "Batch",
    description: "Drastically shrink PDF document file sizes up to 90% in-browser.",
    formats: ["PDF"],
    icon: Minimize2,
  },
  {
    href: "/image/img-to-pdf",
    title: "Image to PDF",
    category: "pdf",
    description: "Convert one or more images into a PDF document.",
    formats: ["JPG", "PNG", "WEBP → PDF"],
    icon: FileOutput,
  },
  {
    href: "/pdf/pdf-to-image",
    title: "PDF to Image",
    category: "pdf",
    description: "Extract every page of your PDF into high-res JPG or PNG.",
    formats: ["PDF → JPG", "PNG"],
    icon: Images,
  },
  {
    href: "/pdf/protector",
    title: "PDF Protector",
    category: "pdf",
    badge: "New",
    description: "Secure PDFs with an AES-256 password.",
    formats: ["PDF"],
    icon: Lock,
  },
  {
    href: "/pdf/merger",
    title: "PDF Merger",
    category: "pdf",
    badge: "New",
    description: "Combine and reorder multiple PDFs into a single file.",
    formats: ["PDF"],
    icon: Combine,
  },
  {
    href: "/pdf/unlocker",
    title: "PDF Unlocker",
    category: "pdf",
    badge: "New",
    description: "Remove passwords and decrypt PDF files.",
    formats: ["PDF"],
    icon: Unlock,
  },
  {
    href: "/pdf/splitter",
    title: "PDF Splitter",
    category: "pdf",
    badge: "New",
    description: "Extract specific pages or split a PDF.",
    formats: ["PDF"],
    icon: Scissors,
  },
  {
    href: "/dl",
    title: "Infyn DL",
    category: "developer",
    badge: "App",
    description: "High-speed media, audio & playlist downloader for Android and Windows. Zero ads, 320kbps MP3.",
    formats: ["Android", "Windows", "MP3", "MP4"],
    icon: Download,
    keywords: ["app", "apps", "dl", "infyn dl", "downloader", "youtube", "music", "playlist", "video", "mp3", "audio", "android", "windows", "yt-dlp", "offline", "media", "desktop app", "mobile app"],
  },
  {
    href: "/home-tab",
    title: "Infyn Home Tab",
    category: "developer",
    badge: "Extension",
    description: "Sleek, privacy-first developer new tab dashboard with GitHub, Firebase, and Pomodoro timer.",
    formats: ["Chrome", "Brave", "Arc", "Edge"],
    icon: LayoutDashboard,
    keywords: ["extension", "extensions", "home tab", "new tab", "dashboard", "developer", "pomodoro", "github", "firebase", "chrome", "brave", "arc", "edge", "chromium", "shaders", "todos", "scratchpad", "startpage"],
  },
];

const UPCOMING = [
  {
    title: "PDF Page Rotator & Organizer",
    category: "pdf",
    desc: "Visually rotate, duplicate, or reorder individual pages within a PDF.",
    icon: Files,
  },
  {
    title: "SVG Vector Minifier",
    category: "developer",
    desc: "Strip unnecessary SVG metadata and clean vector markup.",
    icon: Code2,
  },
  {
    title: "Base64 & Data URI Studio",

    category: "developer",
    desc: "Convert assets into production-ready Base64 and CSS data URI strings.",
    icon: Binary,
  },
];

const POPULAR_TOOLS = [
  "/image/qr-code",
  "/image/bg-remover",
  "/image/compressor",
  "/pdf/compressor",
];


const COMPARISONS = [
  {
    feature: "Data Privacy",
    traditional: "Uploads files to remote servers",
    infyn: "100% On-device execution",
  },
  {
    feature: "Pricing & Limits",
    traditional: "Freemium traps & watermarks",
    infyn: "Free Forever, unlimited",
  },
  {
    feature: "Ads & Trackers",
    traditional: "Banner ads, popups & cookies",
    infyn: "100% Ad-Free, uncluttered",
  },
  {
    feature: "Processing Speed",
    traditional: "Bottlenecked by uploads",
    infyn: "Zero network latency",
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

function ToolCard({ tool }: { tool: ToolItem }) {
  const Icon = tool.icon;
  return (
    <Link
      href={tool.href}
      className="group flex flex-col justify-between h-full rounded-2xl border border-[#EAEAE5] bg-white p-5 hover:border-[#BEBDB9] hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 rounded-xl bg-[#FBFBFA] border border-[#EAEAE5] flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors duration-200">
            <Icon className="h-5 w-5" />
          </div>
          {tool.badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5F4EE] text-[#6E6D68] border border-[#EAEAE5]">
              {tool.badge}
            </span>
          )}
        </div>
        <h3 className="text-[15px] font-bold text-[#111111] tracking-[-0.01em] leading-tight mb-1.5">
          {tool.title}
        </h3>
        <p className="text-[13px] text-[#6E6D68] leading-[1.6] line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-[#F5F4EE] flex items-center justify-between">
        <span className="text-[10px] font-semibold text-[#BEBDB9] tracking-[0.02em]">
          {tool.formats.join(" · ")}
        </span>
        <ArrowRight className="h-4 w-4 text-[#111111] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Focus search input on ⌘K or Ctrl K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return TOOLS.filter((tool) => {
      return (
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.formats.some((f) => f.toLowerCase().includes(q)) ||
        (tool.badge && tool.badge.toLowerCase().includes(q)) ||
        (tool.category && tool.category.toLowerCase().includes(q)) ||
        (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(q)))
      );
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#E8E6DE] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 space-y-20">
        
        {/* ── Hero Section ─────────────────────────────────────────── */}
        <section className="text-center space-y-7 max-w-3xl mx-auto pt-4 sm:pt-8">
          <div className="flex justify-center items-center gap-2.5 mb-6 sm:mb-8 text-[#111111] dark:text-white">
             <AnimatedLogo width={42} className="text-[#111111] dark:text-white" />
             <span className="font-extrabold tracking-[-0.03em] text-[22px] text-[#111111] dark:text-white">infyn</span>
          </div>

          <SplitText
            text="Fast, Private In-Browser Utilities."
            className="text-[2.2rem] sm:text-[3rem] lg:text-[3.5rem] font-extrabold tracking-[-0.035em] text-[#111111] leading-[1.1] max-w-[800px] mx-auto"
            delay={35}
            duration={0.85}
            splitType="words, chars"
            tag="h1"
            textAlign="center"
          />

          <p className="text-[15px] sm:text-[17px] text-[#6E6D68] leading-[1.6] max-w-md mx-auto tracking-[-0.005em]">
            Powerful tools that run entirely in your browser.<br className="hidden sm:block" />
            <span className="font-medium text-[#111111]">No uploads. No accounts. No watermarks.</span>
          </p>

          <div className="pt-8 w-full max-w-2xl mx-auto">
            <div className="relative group z-40">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#9E9D98] group-focus-within:text-[#111111] transition-colors" />
              </div>
              <input
                id="search-input"
                type="text"
                placeholder="Search tools, apps, and extensions (e.g. PDF, DL, Home Tab)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-16 py-4 rounded-2xl border border-[#EAEAE5] bg-white text-base text-[#111111] placeholder-[#9E9D98] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all font-medium"
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-[11px] font-bold text-[#9E9D98] bg-[#F5F4EE] px-2 py-1 rounded border border-[#EAEAE5]">
                  ⌘ K
                </span>
              </div>
              
              <AnimatePresence>
                {searchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl border border-[#EAEAE5] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden z-50 text-left"
                  >
                    <div className="max-h-[300px] overflow-y-auto p-2">
                      {filteredTools.length > 0 ? (
                        filteredTools.map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <Link key={tool.href} href={tool.href} onClick={() => setSearchQuery("")} className="flex items-center gap-3 p-3 hover:bg-[#F5F4EE] rounded-xl transition-colors cursor-pointer">
                              <div className="h-9 w-9 rounded-xl bg-[#FBFBFA] border border-[#EAEAE5] flex items-center justify-center text-[#111111] shrink-0">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-[14px] font-bold text-[#111111] leading-tight truncate">{tool.title}</h4>
                                  {tool.badge && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5F4EE] text-[#6E6D68] border border-[#EAEAE5] shrink-0">
                                      {tool.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[12px] text-[#6E6D68] truncate mt-0.5">{tool.description}</p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-[#9E9D98] shrink-0" />
                            </Link>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center">
                          <p className="text-sm font-medium text-[#111111]">No tools, apps, or extensions found</p>
                          <p className="text-xs text-[#6E6D68] mt-1">Try searching for &ldquo;PDF&rdquo;, &ldquo;DL&rdquo;, or &ldquo;Extension&rdquo;</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6">
              <Link href="/image/qr-code" className="text-[13px] font-medium text-[#6E6D68] hover:text-[#111111] transition-colors">
                QR Code generator
              </Link>
              <Link href="/image/bg-remover" className="text-[13px] font-medium text-[#6E6D68] hover:text-[#111111] transition-colors">
                Remove background
              </Link>
              <Link href="/image/compressor" className="text-[13px] font-medium text-[#6E6D68] hover:text-[#111111] transition-colors">
                Compress image
              </Link>
              <Link href="/pdf/compressor" className="text-[13px] font-medium text-[#6E6D68] hover:text-[#111111] transition-colors">
                Compress PDF
              </Link>
              <Link href="/dl" className="text-[13px] font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors">
                Infyn DL (App)
              </Link>
              <Link href="/home-tab" className="text-[13px] font-medium text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 transition-colors">
                Home Tab (Extension)
              </Link>
            </div>


            <div className="mt-14 flex flex-col items-center gap-2">
              <a href="#tools" className="h-10 w-10 rounded-full border border-[#EAEAE5] bg-white flex items-center justify-center text-[#9E9D98] hover:border-[#111111] hover:text-[#111111] transition-colors animate-bounce shadow-sm">
                <ArrowDown className="h-4 w-4" />
              </a>
              <span className="text-[11px] font-semibold text-[#9E9D98] tracking-widest uppercase mt-2">Explore all tools</span>
            </div>
          </div>
        </section>

        {/* ── Trust Strip ───────────────────────────────────────────── */}
        <div className="py-2 flex flex-wrap justify-center gap-6 sm:gap-12 opacity-80 border-b border-[#EAEAE5] pb-10">
          {["Runs locally", "Zero uploads", "No signup", "Free forever"].map((perk) => (
            <div key={perk} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-[#6E6D68]">{perk}</span>
            </div>
          ))}
        </div>

        {/* ── Dynamic Tool Sections ──────────────────────────────────── */}
        <div id="tools" className="space-y-16">
          {/* Popular Tools */}
          <section className="space-y-5">
                <h2 className="text-xs font-bold tracking-widest text-[#9E9D98] uppercase">Popular Tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {TOOLS.filter(t => POPULAR_TOOLS.includes(t.href)).map(tool => (
                    <ToolCard key={tool.href} tool={tool} />
                  ))}
                </div>
              </section>

              {/* Image Tools */}
              <section className="space-y-5">
                <h2 className="text-xs font-bold tracking-widest text-[#9E9D98] uppercase">Image Tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TOOLS.filter(t => t.category === "image" && !POPULAR_TOOLS.includes(t.href)).map(tool => (
                    <ToolCard key={tool.href} tool={tool} />
                  ))}
                </div>
              </section>

              {/* PDF Tools */}
              <section className="space-y-5">
                <h2 className="text-xs font-bold tracking-widest text-[#9E9D98] uppercase">PDF Tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TOOLS.filter(t => t.category === "pdf").map(tool => (
                    <ToolCard key={tool.href} tool={tool} />
                  ))}
                </div>
              </section>

              {/* Developer Tools */}
              {TOOLS.some(t => t.category === "developer") && (
                <section className="space-y-5">
                  <h2 className="text-xs font-bold tracking-widest text-[#9E9D98] uppercase">Developer Tools</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TOOLS.filter(t => t.category === "developer").map(tool => (
                      <ToolCard key={tool.href} tool={tool} />
                    ))}
                  </div>
                </section>
              )}

              {/* Coming Soon */}
              <section className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAEAE5] pb-4">
                  <div>
                    <h2 className="text-base font-bold text-[#111111]">More tools are on the way.</h2>
                    <p className="text-[13px] text-[#6E6D68] mt-1">In active development for the open-source suite.</p>
                  </div>
                  <a
                    href="https://github.com/imvicky69/infyn/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] hover:text-[#6E6D68] transition-colors mb-0.5"
                  >
                    Built in the open. Suggest a tool →
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {UPCOMING.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-2xl border border-[#EAEAE5] bg-[#FBFBFA] p-5 space-y-3 opacity-60 hover:opacity-80 transition-opacity">
                        <div className="flex items-center justify-between">
                          <div className="h-10 w-10 rounded-xl bg-white border border-[#EAEAE5] flex items-center justify-center text-[#9E9D98]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#9E9D98] border border-[#EAEAE5]">
                            Coming Soon
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#111111] tracking-[-0.01em]">{item.title}</h4>
                          <p className="text-[12px] text-[#6E6D68] leading-relaxed mt-1">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
        </div>

        {/* ── Infyn DL Project Spotlight ────────────────────────────── */}
        <InfynDlShowcase />

        {/* ── Infyn Home Tab Extension Spotlight ────────────────────── */}
        <InfynHomeTabShowcase />

        {/* ── NPM Package & Developer SDK Showcase ──────────────────── */}
        <NpmShowcase />

        {/* ── Architecture Comparison ───────────────────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] bg-white p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
              Architecture
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
              Why In-Browser Processing Wins
            </h2>
            <p className="text-[13px] text-[#6E6D68] leading-[1.6]">
              Traditional tools upload your files to remote servers. Infyn computes everything locally in your browser with zero cloud latency.
            </p>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EAEAE5]">
                  <th className="py-3 pr-4 font-bold text-[#6E6D68] text-[11px] uppercase tracking-wider w-1/3">Capability</th>
                  <th className="py-3 px-4 font-bold text-[#9E9D98] text-[11px] uppercase tracking-wider bg-[#FBFBFA] rounded-tl-xl border-l border-t border-[#EAEAE5]">
                    Traditional Cloud
                  </th>
                  <th className="py-3 px-4 font-bold text-[#111111] text-[11px] uppercase tracking-wider bg-[#F5F4EE] rounded-tr-xl border-r border-t border-[#EAEAE5]">
                    Infyn (In-Browser)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F4EE]">
                {COMPARISONS.map((c, i) => {
                  const isLast = i === COMPARISONS.length - 1;
                  return (
                    <tr key={c.feature} className="hover:bg-[#FBFBFA] transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-[13px] text-[#111111] tracking-[-0.005em]">{c.feature}</td>
                      <td className={`py-3.5 px-4 bg-[#FBFBFA] text-[#6E6D68] text-[12px] border-l border-[#EAEAE5] ${isLast ? 'rounded-bl-xl border-b' : ''}`}>
                        {c.traditional}
                      </td>
                      <td className={`py-3.5 px-4 bg-[#F5F4EE] text-[#111111] text-[12px] font-medium border-r border-[#EAEAE5] ${isLast ? 'rounded-br-xl border-b' : ''}`}>
                        {c.infyn}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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
                  className="rounded-2xl border border-[#EAEAE5] bg-white overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center gap-4 hover:bg-[#FBFBFA] transition-colors cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-[#BEBDB9] shrink-0 tabular-nums w-5">
                      {num}
                    </span>
                    <span className="text-sm font-semibold text-[#111111] flex-1 tracking-[-0.01em]">{faq.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="shrink-0 text-[#9E9D98]"
                    >
                      <ArrowDown className="h-4 w-4" />
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
