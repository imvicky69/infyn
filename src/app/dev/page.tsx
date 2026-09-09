"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import SplitText from "@/components/SplitText";
import {
  Binary,
  Download,
  LayoutDashboard,
  BookOpen,
  ArrowRight,
  Code2,
  Files,
  Sparkles,
  Package,
} from "lucide-react";

interface DevToolItem {
  href: string;
  title: string;
  badge: string;
  badgeColor: string;
  category: "all" | "utilities" | "sdk";
  categoryLabel: string;
  description: string;
  tags: string[];
  formats: string[];
  icon: React.ReactNode;
  external?: boolean;
}

const DEV_TOOLS: DevToolItem[] = [
  {
    href: "/dev/base64",
    title: "Base64 & Data URI Studio",
    badge: "New",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    category: "utilities",
    categoryLabel: "Utilities",
    description:
      "Convert images, web fonts, and assets into production-ready Base64 and CSS data URI strings with live code snippets and bidirectional decoding.",
    tags: ["CSS background", "@font-face", "SVG UTF-8", "Decoder"],
    formats: ["PNG", "SVG", "WOFF2", "TTF", "PDF"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-2xs group-hover:scale-105 transition-transform">
        <Binary className="h-5 w-5" />
      </div>
    ),
  },
  {
    href: "/dev/svg-cleaner",
    title: "SVG Cleaner & Minifier",
    badge: "New",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    category: "utilities",
    categoryLabel: "Utilities",
    description:
      "Strip editor metadata, round float coordinates, collapse groups, and export clean SVGs, React JSX components, and CSS Data URIs.",
    tags: ["SVGO", "Figma / Illustrator", "React JSX", "Data URI"],
    formats: ["SVG", "React JSX", "CSS Data URI"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-2xs group-hover:scale-105 transition-transform">
        <Code2 className="h-5 w-5" />
      </div>
    ),
  },
  {
    href: "/docs",
    title: "Documentation & SDK",
    badge: "NPM Package",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
    category: "sdk",
    categoryLabel: "Libraries",
    description:
      "Zero-cloud in-browser media manipulation package. Integrate client-side PDF encryption, image compressors, and HEIC decoders into React and Next.js.",
    tags: ["TypeScript", "WASM", "Zero Cloud Uploads"],
    formats: ["npm i infyn", "React", "Node", "Vite"],
    icon: (
      <div className="relative h-11 w-11 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-400 shadow-2xs group-hover:scale-105 transition-transform">
        <BookOpen className="h-5 w-5" />
      </div>
    ),
  },
];

const CATEGORIES = [
  { id: "all", label: "All Dev Tools" },
  { id: "utilities", label: "Utilities" },
  { id: "sdk", label: "SDK & Libraries" },
] as const;

export default function DevCategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    return DEV_TOOLS.filter((tool) => {
      const matchesCat =
        selectedCategory === "all" || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.toLowerCase().includes(q)) ||
        tool.formats.some((f) => f.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Category Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <Code2 className="h-3.5 w-3.5" />
            <span>Developer Utilities & Open Source Ecosystem</span>
          </div>

          <SplitText
            text="Developer Tools Suite"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] dark:text-white"
            delay={25}
            duration={0.7}
            splitType="words"
          />

          <p className="text-sm sm:text-base text-[#6E6D68] dark:text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed">
            Privacy-first developer utilities, desktop & mobile applications, browser extensions, and client-side media SDKs running 100% on your device.
          </p>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#EAEAE5] dark:border-zinc-800 pb-6">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#111111] text-white dark:bg-white dark:text-zinc-900 shadow-2xs"
                    : "bg-[#F5F4EE] dark:bg-zinc-800/60 text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Filter dev tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#111111] dark:text-white placeholder-[#9E9D98] focus:outline-none focus:border-[#111111] dark:focus:border-zinc-400 transition-colors"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          <AnimatePresence>
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.href}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={tool.href}
                  className="group flex flex-col justify-between h-full p-6 rounded-2xl sm:rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] hover:border-[#BEBDB9] dark:hover:border-zinc-700 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.06)] cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {tool.icon}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tool.badgeColor}`}
                      >
                        {tool.badge}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-[#111111] dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                        <span>{tool.title}</span>
                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </h2>
                      <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 mt-1.5 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F5F4EE] dark:bg-zinc-800/80 text-[#6E6D68] dark:text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#F5F4EE] dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-[#9E9D98]">
                    <span>{tool.formats.join(" · ")}</span>
                    <span className="text-xs font-semibold text-[#111111] dark:text-white group-hover:underline">
                      Open Tool →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Upcoming Section */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/40 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAEAE5] dark:border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#111111] dark:text-white">
                Upcoming Developer Tools in Pipeline
              </h3>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                Being ported to client-side WASM and Web Workers.
              </p>
            </div>
            <a
              href="https://github.com/imvicky69/infyn/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#111111] dark:text-white hover:underline"
            >
              Request a Dev Tool →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 flex items-start gap-3">
              <Code2 className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#111111] dark:text-white">
                  SQL & Query Formatter
                </h4>
                <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                  Format, beautify, and syntax-validate complex SQL queries locally.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#111111] dark:text-white">
                  JSON Formatter & Schema Diff
                </h4>
                <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                  Prettify, validate, sort keys, and compare JSON payloads in your browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
