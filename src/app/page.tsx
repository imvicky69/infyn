"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface ToolItem {
  href: string;
  title: string;
  category: "image" | "converter" | "developer";
  categoryLabel: string;
  badge: string;
  badgeColor: string;
  freeHighlight: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

const TOOLS: ToolItem[] = [
  {
    href: "/image/bg-remover",
    title: "AI Background Remover",
    category: "image",
    categoryLabel: "AI Vision Tool",
    badge: "100% Free • Ad-Free",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    freeHighlight: "Unlimited HD Exports",
    description:
      "Instantly erase backgrounds from portraits, e-commerce products, and graphics using on-device neural network RMBG-1.4. Customize solid/gradient backgrounds and export with custom aspect ratios.",
    features: [
      "100% Free & Ad-Free (Zero Watermarks)",
      "Neural AI inference runs on device (WASM)",
      "Move, scale & flip subject with WYSIWYG canvas",
      "Social media aspect ratios (1:1, 9:16, 4:5)",
    ],
    icon: (
      <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </div>
    ),
  },
  {
    href: "/image/compressor",
    title: "Image Compressor",
    category: "image",
    categoryLabel: "Size Optimizer",
    badge: "Free & Ad-Free",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    freeHighlight: "Shrink up to 90%",
    description:
      "Compress and shrink image file sizes up to 90% without compromising visual clarity. Supports batch processing, target file size modes (e.g. fit under 200 KB), WebP conversion, and 1-click ZIP export.",
    features: [
      "100% Free & Ad-Free batch compression",
      "Target file size mode (KB / MB precision)",
      "Interactive split before/after visual comparator",
      "1-Click All Images ZIP archive export",
    ],
    icon: (
      <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-transparent border border-blue-200/80 flex items-center justify-center text-blue-700 shadow-2xs">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0 0h4.5m-4.5 0L9 3.75M20.25 3.75h-4.5m0 0v4.5m0-4.5L15 9m5.25 11.25v-4.5m0 0h-4.5m4.5 0L15 20.25M3.75 20.25h4.5m0 0v-4.5m0 4.5L9 15" />
        </svg>
      </div>
    ),
  },
  {
    href: "/image/heic-to-jpg",
    title: "HEIC to JPG Converter",
    category: "converter",
    categoryLabel: "iPhone Converter",
    badge: "Free & Ad-Free",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    freeHighlight: "Zero Quality Loss",
    description:
      "Convert Apple iPhone .HEIC and .HEIF photos into standard, universally compatible JPG or PNG images. Convert single photos or massive batches locally in your browser with zero cloud uploads.",
    features: [
      "100% Free & Ad-Free Apple HEIC/HEIF conversion",
      "WASM libheif v1.19 decoding engine",
      "Batch convert dozens of phone photos at once",
      "Full original camera resolution preserved",
    ],
    icon: (
      <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-200/80 flex items-center justify-center text-amber-800 shadow-2xs">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      </div>
    ),
  },
];

const UPCOMING = [
  {
    title: "PDF Merger & Splitter",
    category: "PDF Suite",
    desc: "Merge multiple PDF documents or split pages locally with zero upload lag.",
  },
  {
    title: "SVG Vector Minifier",
    category: "Developer",
    desc: "Strip unnecessary SVG bloat, minify paths, and optimize vector assets.",
  },
  {
    title: "Base64 & Data URI Studio",
    category: "Developer",
    desc: "Convert images, fonts, and binaries into clean Base64 data strings instantly.",
  },
];

const FAQS = [
  {
    q: "Is Infyn completely free and ad-free?",
    a: "Yes! Every single tool on Infyn is 100% free and 100% ad-free with zero popup ads, zero banners, no subscriptions, no credit cards, and no watermarks. Because computations run locally on your own computer hardware using WebAssembly and Web Workers, we don't have heavy server hosting costs to pass on to you.",
  },
  {
    q: "How are tools 100% private and offline capable?",
    a: "Unlike traditional online conversion sites that upload your photos and documents to remote cloud servers, Infyn executes all computations directly in your browser tab. Your files never leave your device, meaning 100% privacy and zero data leakage.",
  },
  {
    q: "Is there any file size or conversion limit?",
    a: "No. You can process single images or batches of 50+ files without artificial paywalls, daily usage quotas, or resolution downgrades.",
  },
  {
    q: "Why do my iPhone photos have .HEIC extension?",
    a: "Apple uses HEIC (High Efficiency Image Container) by default on iOS to save storage space. However, HEIC is unsupported on older Windows versions, Android devices, and many upload forms. Our HEIC to JPG converter allows you to transform them into universal JPGs in 1 click.",
  },
  {
    q: "Does image compression reduce visual quality?",
    a: "Our compression engine uses perceptually-tuned algorithms and high-quality bicubic downsampling. By removing invisible metadata and high-frequency color redundancies, you can typically reduce file sizes by 70%–85% with zero noticeable visual difference.",
  },
];

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredTools =
    selectedFilter === "all"
      ? TOOLS
      : TOOLS.filter((t) => t.category === selectedFilter);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 space-y-20">

        {/* ── Hero Section ─────────────────────────────────────────────── */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F4EE] border border-[#EAEAE5] text-xs font-bold text-[#111111] shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>🎉 100% Free Forever • 100% Ad-Free • Zero Watermarks • Zero Signups</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#111111] leading-[1.12]">
            Free, ad-free & private in-browser utilities.
          </h1>

          <p className="text-base sm:text-lg text-[#6E6D68] leading-relaxed max-w-2xl mx-auto font-normal">
            Zero cloud uploads. Zero annoying ads or tracking cookies. High-speed AI background removal, image compression, and HEIC format conversion running 100% locally on your device.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/image/bg-remover"
              className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-sm font-bold text-white hover:bg-[#262626] active:scale-95 transition-all shadow-sm"
            >
              <span>Remove Background (Free)</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/image/compressor"
              className="inline-flex items-center gap-2 rounded-xl border border-[#EAEAE5] bg-white px-5 py-3 text-sm font-semibold text-[#111111] hover:bg-[#F5F4EE] active:scale-95 transition-all shadow-2xs"
            >
              <span>Compress Images (Free)</span>
            </Link>

            <Link
              href="/image"
              className="inline-flex items-center gap-2 rounded-xl border border-[#EAEAE5] bg-white px-5 py-3 text-sm font-semibold text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE] active:scale-95 transition-all"
            >
              <span>Explore All Suite →</span>
            </Link>
          </div>

          {/* Quick Metrics Bar with Free, Ad-Free & Privacy Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#EAEAE5] text-left">
            <div className="p-3.5 rounded-2xl border border-[#EAEAE5] bg-white shadow-2xs">
              <p className="text-xl font-extrabold text-[#111111]">100% Free</p>
              <p className="text-[11px] text-[#6E6D68] font-medium">No paywalls or watermarks</p>
            </div>
            <div className="p-3.5 rounded-2xl border border-[#EAEAE5] bg-white shadow-2xs">
              <p className="text-xl font-extrabold text-[#111111]">Ad-Free</p>
              <p className="text-[11px] text-[#6E6D68] font-medium">Zero popup ads or trackers</p>
            </div>
            <div className="p-3.5 rounded-2xl border border-[#EAEAE5] bg-white shadow-2xs">
              <p className="text-xl font-extrabold text-[#111111]">0 KB Cloud</p>
              <p className="text-[11px] text-[#6E6D68] font-medium">Zero server uploads</p>
            </div>
            <div className="p-3.5 rounded-2xl border border-[#EAEAE5] bg-white shadow-2xs">
              <p className="text-xl font-extrabold text-[#111111]">Unlimited</p>
              <p className="text-[11px] text-[#6E6D68] font-medium">Batch 1-click ZIP downloads</p>
            </div>
          </div>
        </section>

        {/* ── Tools Catalog Section ────────────────────────────────────── */}
        <section id="tools" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAEAE5] pb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[#111111]">
                Available Utilities
              </h2>
              <p className="text-xs text-[#9E9D98]">Instant, free, ad-free, and private in-browser tools</p>
            </div>

            {/* Category Filter Pills */}
            <div className="inline-flex rounded-xl bg-[#F5F4EE] p-1 border border-[#EAEAE5]">
              {[
                { id: "all", label: "All Tools" },
                { id: "image", label: "Image Tools" },
                { id: "converter", label: "Converters" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedFilter === f.id
                      ? "bg-white text-[#111111] shadow-xs"
                      : "text-[#6E6D68] hover:text-[#111111]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-3xl border border-[#EAEAE5] bg-white p-6 sm:p-7 flex flex-col justify-between hover:border-[#BEBDB9] hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {tool.icon}
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border tracking-wide ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#111111] group-hover:underline underline-offset-4">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-[#6E6D68] mt-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-3 border-t border-[#F5F4EE]">
                    {tool.features.map((feat) => (
                      <li key={feat} className="text-[11px] text-[#6E6D68] flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-4 flex items-center justify-between border-t border-[#F5F4EE] text-xs font-bold text-[#111111]">
                  <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">
                    Launch Free Tool
                  </span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Upcoming Roadmap Tools ───────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAEAE5] pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6E6D68]">
              Coming Soon to Infyn (100% Free & Ad-Free)
            </h2>
            <span className="text-xs text-[#9E9D98]">In Active Development</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {UPCOMING.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#EAEAE5] bg-white/60 p-5 space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
                    {item.category}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F5F4EE] text-[#9E9D98]">
                    Free Soon
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#111111]">{item.title}</h4>
                <p className="text-[11px] text-[#6E6D68] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Privacy & Architecture Guarantee ─────────────────────────── */}
        <section className="rounded-3xl border border-[#111111] bg-[#111111] text-white p-7 sm:p-10 space-y-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider text-white">
              <span>Security & Zero Data Footprint</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Why your files never leave your device
            </h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Most online converters spam you with intrusive ads and upload your private images to cloud servers. Infyn provides a clean, ad-free experience running 100% client-side.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-white/10">
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white">100% Ad-Free Experience</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Zero banner ads, zero popups, and zero cookie tracking networks slowing down your device.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white">Zero Server Storage</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                No storage buckets, no databases, no logs. Complete anonymity and zero data footprints.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white">Free Forever & No Watermarks</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                No subscription models, no hidden paywalls, and no watermarks on your exported images.
              </p>
            </div>
          </div>
        </section>

        {/* ── Interactive FAQ Section (SEO Optimized) ─────────────────── */}
        <section className="space-y-4">
          <div className="border-b border-[#EAEAE5] pb-3">
            <h2 className="text-lg font-bold tracking-tight text-[#111111]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-[#EAEAE5] bg-white overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#111111] hover:bg-[#FDFDF9] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <svg
                      className={`h-4 w-4 text-[#9E9D98] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-[#6E6D68] leading-relaxed border-t border-[#F5F4EE] pt-3">
                      {faq.a}
                    </div>
                  )}
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
