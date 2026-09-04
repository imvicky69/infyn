"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import SplitText from "@/components/SplitText";
import {
  Copy,
  Check,
  Terminal,
  Layers,
  FileText,
  Image as ImageIcon,
  Code2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  GitPullRequest,
  ArrowRight,
  Smartphone,
  Monitor,
  LayoutDashboard,
  Download,
  Flame,
  Timer,
  Search,
  Globe,
  PlusCircle,
  Puzzle,
  Boxes,
  Cpu,
  RefreshCw,
  HardDrive,
  CheckCircle2,
  FolderDown,
} from "lucide-react";

interface CodeSnippetProps {
  code: string;
  language?: string;
  title?: string;
}

function CodeBlock({ code, language = "typescript", title }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#111111] dark:bg-[#0E0E10] overflow-hidden my-4 shadow-sm">
      {title && (
        <div className="px-4 py-2.5 bg-[#1C1C1A] dark:bg-[#151518] border-b border-[#2A2A28] dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80 inline-block" />
            <span className="text-xs font-mono text-[#9E9D98] dark:text-zinc-400 ml-2">{title}</span>
          </div>
          <button
            type="button"
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-xs text-[#BEBDB9] dark:text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      )}
      <div className="p-4 overflow-x-auto text-sm font-mono text-[#EAEAE5] dark:text-zinc-200 leading-relaxed">
        <pre>{code}</pre>
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: "ecosystem-overview", title: "Ecosystem Overview", icon: Boxes, tag: "All" },
  { id: "architecture-principles", title: "Zero-Upload Architecture", icon: ShieldCheck, tag: "All" },
  { id: "sdk-getting-started", title: "Web Suite & Headless SDK", icon: Zap, tag: "Web" },
  { id: "pdf-sdk", title: "PDF Suite (infyn/pdf)", icon: FileText, tag: "Web" },
  { id: "image-sdk", title: "Image Suite (infyn/image)", icon: ImageIcon, tag: "Web" },
  { id: "extending-web-suite", title: "Extending Web Suite", icon: PlusCircle, tag: "Web" },
  { id: "dl-architecture", title: "Infyn DL Architecture", icon: Download, tag: "App" },
  { id: "extending-dl", title: "Extending Infyn DL", icon: Cpu, tag: "App" },
  { id: "home-tab-architecture", title: "Infyn Home Tab Architecture", icon: LayoutDashboard, tag: "Extension" },
  { id: "extending-home-tab", title: "Extending Home Tab", icon: Puzzle, tag: "Extension" },
  { id: "contributing-guidelines", title: "Contributing & Standards", icon: GitPullRequest, tag: "All" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("ecosystem-overview");
  const [filterTag, setFilterTag] = useState<"All" | "Web" | "App" | "Extension">("All");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredSections = SECTIONS.filter(
    (sec) => filterTag === "All" || sec.tag === "All" || sec.tag === filterTag
  );

  return (
    <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />
      <Breadcrumbs />

      {/* Hero Header */}
      <header className="border-b border-[#EAEAE5] dark:border-zinc-800 bg-white/60 dark:bg-[#141417]/60 backdrop-blur-md pt-12 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Infyn Open Source Ecosystem</span>
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 border border-[#EAEAE5] dark:border-zinc-700">
                Web · Android · Windows · Chromium
              </span>
            </div>

            <SplitText
              text="Documentation & Extension Guide"
              className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-[#111111] dark:text-white"
              delay={25}
              duration={0.7}
              splitType="words"
              tag="h1"
            />

            <p className="text-base sm:text-lg text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Complete developer guides, architectural deep-dives, and step-by-step recipes for extending all three cross-platform projects: <strong className="text-[#111111] dark:text-white">Infyn Web Suite & Headless SDK</strong>, <strong className="text-[#111111] dark:text-white">Infyn DL</strong> (Android & Windows), and <strong className="text-[#111111] dark:text-white">Infyn Home Tab</strong> (Chromium Extension).
            </p>

            {/* Quick Action Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://www.npmjs.com/package/infyn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold hover:bg-[#262626] dark:hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
              >
                <span>npm install infyn</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>

              <Link
                href="/dl"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 text-[#111111] dark:text-white text-xs font-bold hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-xs"
              >
                <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Infyn DL Hub</span>
              </Link>

              <Link
                href="/home-tab"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 text-[#111111] dark:text-white text-xs font-bold hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-xs"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Infyn Home Tab Hub</span>
              </Link>

              <Link
                href="/contributing"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:scale-[0.98] transition-all shadow-xs"
              >
                <GitPullRequest className="h-3.5 w-3.5" />
                <span>Contributing Guide</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Documentation Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full flex flex-col lg:flex-row gap-10">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            
            {/* Filter Pills */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E9D98] dark:text-zinc-500 px-1 mb-1">
                Filter by Project
              </p>
              <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800">
                {(["All", "Web", "App", "Extension"] as const).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFilterTag(tag)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                      filterTag === tag
                        ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-xs"
                        : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Links */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E9D98] dark:text-zinc-500 px-3 mb-2">
                Documentation Menu
              </p>
              {filteredSections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-xs"
                        : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white dark:text-[#111111]" : "text-[#9E9D98] dark:text-zinc-500"}`} />
                      <span className="truncate">{sec.title}</span>
                    </div>
                    {sec.tag !== "All" && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-white/20 text-white dark:bg-black/10 dark:text-black"
                            : "bg-[#F5F4EE] dark:bg-zinc-800 text-[#9E9D98] dark:text-zinc-400"
                        }`}
                      >
                        {sec.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Privacy Badge Card */}
            <div className="p-4 rounded-2xl bg-[#F5F4EE] dark:bg-zinc-900/90 border border-[#EAEAE5] dark:border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#111111] dark:text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Server Uploads</span>
              </div>
              <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                All three Infyn projects operate 100% locally on user hardware. Zero cloud APIs, zero telemetries, zero tracking cookies.
              </p>
            </div>

            {/* Contributing Link */}
            <div className="pt-2 border-t border-[#EAEAE5] dark:border-zinc-800">
              <Link
                href="/contributing"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 text-xs font-bold text-[#111111] dark:text-white hover:border-[#BEBDB9] dark:hover:border-zinc-700 hover:shadow-xs active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Contributing Guide</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#9E9D98] dark:text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Documentation Articles */}
        <main className="flex-1 max-w-3xl space-y-16">

          {/* ── 1. Ecosystem Overview ─────────────────────────────────── */}
          <section id="ecosystem-overview" className="space-y-6 scroll-mt-24">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-mono font-bold mb-2">
                Infyn Ecosystem
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white tracking-tight mb-2">
                The Three Cross-Platform Pillars
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Infyn is built as a unified collection of privacy-first, zero-upload open source software tools. Each project is designed to be completely modular and easily extendable by developers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Pillar 1 */}
              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-2">
                <div className="h-8 w-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Globe className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[#111111] dark:text-white">1. Web Suite & SDK</h3>
                <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  Browser-based WASM & Canvas image/PDF tools + headless NPM package (`infyn`). Runs in any browser, Next.js, React, Vue, or Node.js.
                </p>
                <div className="pt-1">
                  <Link href="/" className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1">
                    <span>Visit Suite</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Download className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[#111111] dark:text-white">2. Infyn DL</h3>
                <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  Cross-platform media & playlist downloader for Android (APK) and Windows (Setup & Portable) with embedded yt-dlp & FFmpeg.
                </p>
                <div className="pt-1">
                  <Link href="/dl" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1">
                    <span>Explore /dl Hub</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-2">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <LayoutDashboard className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[#111111] dark:text-white">3. Infyn Home Tab</h3>
                <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  Developer new tab dashboard extension for Chrome, Brave, Arc, and Edge with GitHub/Firebase widgets, Pomodoro badge sync & WebGL shaders.
                </p>
                <div className="pt-1">
                  <Link href="/home-tab" className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
                    <span>Explore /home-tab</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── 2. Zero-Upload Architecture ───────────────────────────── */}
          <section id="architecture-principles" className="space-y-6 scroll-mt-24 border-t border-[#EAEAE5] dark:border-zinc-800 pt-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold mb-2">
                Core Philosophy
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight mb-2">
                Zero-Upload & Local-First Philosophy
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Traditional software tools force user media, documents, and search habits onto remote cloud servers. Across all three Infyn projects, the compute engine runs directly on the user&apos;s physical machine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-2">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <span>Traditional Cloud SaaS</span>
                </div>
                <ul className="text-xs text-[#6E6D68] dark:text-zinc-400 space-y-1.5 list-disc list-inside">
                  <li>Uploads 100% of user files to external servers</li>
                  <li>Bandwidth bottlenecks & upload latency</li>
                  <li>Freemium paywalls, watermarks, file size caps</li>
                  <li>Tracking cookies, telemetry, and banner ads</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>The Infyn Local Model</span>
                </div>
                <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5 list-disc list-inside">
                  <li>WASM, Web Workers, & native device binaries</li>
                  <li>Zero network latency & unlimited file sizes</li>
                  <li>100% Free forever under MIT license</li>
                  <li>Zero tracking, zero analytics, complete privacy</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── 3. Web Suite & Headless SDK ───────────────────────────── */}
          <section id="sdk-getting-started" className="space-y-6 scroll-mt-24 border-t border-[#EAEAE5] dark:border-zinc-800 pt-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 text-xs font-mono font-bold mb-2">
                NPM Package
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight mb-2">
                Web Suite Headless SDK (`infyn`)
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                The core engine behind the Infyn Web Suite is published as an open-source NPM library. You can drop client-side PDF manipulation, image compression, metadata scrubbing, and QR generation into any React, Next.js, Vue, or Node.js application.
              </p>
            </div>

            <CodeBlock
              title="Installation"
              language="bash"
              code={`# npm
npm install infyn

# pnpm
pnpm add infyn

# yarn
yarn add infyn`}
            />

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#111111] dark:text-white">Import Strategies</h3>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400">
                Infyn supports tree-shakable subpath imports to minimize your final bundle size:
              </p>

              <CodeBlock
                title="Subpath vs Root Import"
                code={`// Recommended: Granular subpath imports
import { mergePDFs, splitPDF, encryptPDF } from "infyn/pdf";
import { compressImage, convertHeicToJpg, removeExif } from "infyn/image";

// All-in-one root import
import { mergePDFs, compressImage } from "infyn";`}
              />
            </div>
          </section>

          {/* ── 4. PDF Utilities (infyn/pdf) ──────────────────────────── */}
          <section id="pdf-sdk" className="space-y-8 scroll-mt-24 border-t border-[#EAEAE5] dark:border-zinc-800 pt-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 text-xs font-mono font-bold mb-2">
                infyn/pdf
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight mb-2">
                PDF Manipulation Suite
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400">
                In-browser PDF merging, page extraction, splitting, AES-256 password encryption, decryption, and compression without sending documents to any server.
              </p>
            </div>

            {/* mergePDFs */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white font-mono">
                mergePDFs(files)
              </h3>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400">
                Merges an array of PDF files, Blobs, or Uint8Arrays sequentially into a single PDF document.
              </p>

              <CodeBlock
                title="mergePDFs Example"
                code={`import { mergePDFs } from "infyn/pdf";

async function handleMerge(pdfFiles: File[]) {
  // Returns Uint8Array of the merged document
  const mergedBytes = await mergePDFs(pdfFiles);
  
  // Wrap in a Blob for instant browser download or preview
  const blob = new Blob([mergedBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  
  return url;
}`}
              />
            </div>

            {/* splitPDF & extractPDFPages */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white font-mono">
                extractPDFPages(file, pageNumbers) & splitPDF(file)
              </h3>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400">
                Extract selected pages into a new document or split an entire PDF into standalone 1-page files.
              </p>

              <CodeBlock
                title="Split & Extraction Example"
                code={`import { extractPDFPages, splitPDF } from "infyn/pdf";

// Extract pages 1, 3, and 5 into a single 3-page PDF (1-indexed)
const extractedBytes = await extractPDFPages(myPdfFile, [1, 3, 5]);

// Split an entire PDF into separate 1-page documents
const splitPages = await splitPDF(myPdfFile);
// splitPages => [
//   { pageNumber: 1, data: Uint8Array },
//   { pageNumber: 2, data: Uint8Array }
// ]`}
              />
            </div>

            {/* encryptPDF & decryptPDF */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white font-mono">
                encryptPDF(file, password) & decryptPDF(file, password)
              </h3>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400">
                Protect sensitive PDFs with AES-256 password encryption, or unlock encrypted files in-memory.
              </p>

              <CodeBlock
                title="Security & Password Protection Example"
                code={`import { encryptPDF, decryptPDF, isPDFEncrypted } from "infyn/pdf";

// 1. Check if a document is password protected
const isLocked = await isPDFEncrypted(uploadedFile);

// 2. Encrypt document with a password
const protectedBytes = await encryptPDF(myPdfFile, "superSecretPassword");

// 3. Remove password and unlock PDF
const unlockedBytes = await decryptPDF(encryptedPdfFile, "superSecretPassword");`}
              />
            </div>

            {/* compressPDF */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white font-mono">
                compressPDF(file, options)
              </h3>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400">
                Shrinks PDF file sizes up to 90% via client-side raster downsampling and structural object stream compaction.
              </p>

              <CodeBlock
                title="compressPDF Example"
                code={`import { compressPDF } from "infyn/pdf";

// Compress with Recommended Preset (balanced clarity & size)
const result = await compressPDF(myPdfFile, { preset: "recommended" });

console.log("Original Size:", result.originalSize);
console.log("Compressed Size:", result.compressedSize);
console.log("Savings:", result.savedPercentage + "%");
const compressedBlob = new Blob([result.data], { type: "application/pdf" });`}
              />
            </div>
          </section>

          {/* ── 5. Image Utilities (infyn/image) ────────────────────────── */}
          <section id="image-sdk" className="space-y-8 scroll-mt-24 border-t border-[#EAEAE5] dark:border-zinc-800 pt-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-mono font-bold mb-2">
                infyn/image
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight mb-2">
                Image Processing Suite
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400">
                Compress images, decode Apple iPhone HEIC/HEIF photos via WebAssembly, convert formats, and strip hidden EXIF/GPS coordinates.
              </p>
            </div>

            {/* compressImage */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white font-mono">
                compressImage(file, options)
              </h3>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400">
                Compresses image file sizes with bicubic canvas downscaling and quality tuning.
              </p>

              <CodeBlock
                title="compressImage Example"
                code={`import { compressImage } from "infyn/image";

const result = await compressImage(photoFile, {
  quality: 0.8,         // 0.1 to 1.0
  maxWidth: 1920,       // Scales down if wider
  targetFormat: "image/webp"
});

console.log("Output Blob:", result.blob);`}
              />
            </div>

            {/* convertHeicToJpg & removeExif */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white font-mono">
                convertHeicToJpg(file) & removeExif(file)
              </h3>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400">
                Decode iPhone HEIC photos into standard JPEGs and strip GPS coordinates for privacy before uploading.
              </p>

              <CodeBlock
                title="HEIC & EXIF Cleaner Example"
                code={`import { convertHeicToJpg, removeExif, convertImage } from "infyn/image";

// 1. Convert iPhone HEIC photo to standard JPEG
const jpegBlob = await convertHeicToJpg(iphonePhotoFile);

// 2. Wipe EXIF & GPS location metadata
const anonymizedBlob = await removeExif(photoFile);

// 3. Universal format converter (PNG -> WebP)
const webpBlob = await convertImage(pngFile, "image/webp", 0.9);`}
              />
            </div>

            {/* generateQRCode */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white font-mono">
                generateQRCode(text, options)
              </h3>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400">
                Generate high-resolution PNG bytes or vector SVG strings in-browser with customizable colors and error correction.
              </p>

              <CodeBlock
                title="QR Code Generator Example"
                code={`import { generateQRCode } from "infyn/image";

// 1. Generate High-Res PNG bytes
const pngBytes = await generateQRCode("https://infyn.software", {
  width: 1024,
  errorCorrectionLevel: "H",
  colorDark: "#111111",
  colorLight: "#FFFFFF",
  format: "png"
});

// 2. Generate crisp vector SVG markup
const svgString = await generateQRCode("WIFI:T:WPA;S:MyWiFi;P:Secret;;", {
  format: "svg"
});`}
              />
            </div>
          </section>

          {/* ── 6. Extending the Web Suite ────────────────────────────── */}
          <section id="extending-web-suite" className="space-y-6 scroll-mt-24 border-t border-[#EAEAE5] dark:border-zinc-800 pt-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 text-xs font-mono font-bold mb-2">
                Extension Guide
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight mb-2">
                How to Build & Add New Tools to Infyn Web
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Infyn is designed so that new tools can be added in under 30 minutes using our reusable component primitives.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#111111] dark:text-white">
                Step 1: Create Dedicated Route Directory
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Add your tool under <code className="bg-[#F5F4EE] dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">src/app/&lt;category&gt;/&lt;tool-name&gt;/</code>:
              </p>
              <CodeBlock
                title="Folder Structure"
                language="bash"
                code={`src/app/image/my-new-tool/
├── layout.tsx     <-- Next.js SEO Metadata & Schema.org JSON-LD
├── page.tsx       <-- "use client" UI & Stage State (idle -> busy -> done)
└── worker.ts      <-- (Optional) Web Worker for heavy WASM/compute`}
              />

              <h3 className="text-base font-bold text-[#111111] dark:text-white pt-2">
                Step 2: Utilize Shared Primitives
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Always reuse the existing components in <code className="bg-[#F5F4EE] dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">src/components/image-tools/</code>:
              </p>

              <CodeBlock
                title="src/app/image/my-new-tool/page.tsx"
                code={`"use client";

import { DropZone } from "@/components/image-tools/dropzone";
import { ProgressBar } from "@/components/image-tools/progress-bar";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";

export default function MyNewToolPage() {
  return (
    <div className="space-y-6">
      <DropZone
        multiple={true}
        accept="image/*"
        onFilesSelected={(files) => handleProcess(files)}
        title="Drop your files here"
        subtitle="or click to browse from device"
      />
      <PrivacyBadges />
    </div>
  );
}`}
              />

              <h3 className="text-base font-bold text-[#111111] dark:text-white pt-2">
                Step 3: Register in Global Catalog
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Add an entry to the <code className="bg-[#F5F4EE] dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">TOOLS</code> array in <code className="bg-[#F5F4EE] dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">src/app/page.tsx</code> and include the path in <code className="bg-[#F5F4EE] dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">src/app/sitemap.ts</code>.
              </p>
            </div>
          </section>

          {/* ── 7. Infyn DL Architecture ──────────────────────────────── */}
          <section id="dl-architecture" className="space-y-6 scroll-mt-24 border-t border-[#EAEAE5] dark:border-zinc-800 pt-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold mb-2">
                Infyn DL Architecture
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight mb-2">
                Infyn DL: Cross-Platform Media Engine
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Infyn DL (`https://github.com/imvicky69/infyn-dl`) is our cross-platform desktop and mobile app built to download single media, 320kbps audio, and entire YouTube/YouTube Music playlists without ads or throttles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-bold text-sm text-[#111111] dark:text-white">Android Sideload Architecture</h4>
                </div>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  Universal APK compiled with Flutter and native Java service wrappers. Uses Android Foreground Services to guarantee uninterrupted batch downloads when the screen is locked, and triggers <code className="bg-[#F5F4EE] dark:bg-zinc-800 px-1 rounded">MediaScannerConnection</code> so downloaded music shows up in local players immediately.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-2">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-bold text-sm text-[#111111] dark:text-white">Windows Standalone & Portable</h4>
                </div>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  Self-contained 64-bit Windows Setup installer and zero-dependency portable ZIP. Bundles embedded yt-dlp binaries and FFmpeg dynamically linked—requiring zero external runtime installations or PATH variables.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900/40 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#9E9D98] dark:text-zinc-400">
                Core Engine Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#6E6D68] dark:text-zinc-300">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Parallel Streams (`-N 8`):</strong> Downloads multi-gigabyte media across 8 concurrent byte chunks.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Flame className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Granular Checkboxes:</strong> Interactively select/deselect songs from 100+ track playlists.</span>
                </div>
                <div className="flex items-start gap-2">
                  <RefreshCw className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                  <span><strong>1-Tap Core Updates:</strong> In-app updater refreshes the extraction engine without reinstalling the app.</span>
                </div>
                <div className="flex items-start gap-2">
                  <HardDrive className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Pristine 320kbps MP3:</strong> Preserves embedded metadata, album cover thumbnails, and track numbering.</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── 8. Extending Infyn DL ─────────────────────────────────── */}
          <section id="extending-dl" className="space-y-6 scroll-mt-24 border-t border-[#EAEAE5] dark:border-zinc-800 pt-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold mb-2">
                DL Contribution Guide
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight mb-2">
                How to Extend & Build Infyn DL
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Infyn DL is organized into modular services. Here is how to clone, customize the download pipeline, and build release bundles:
              </p>
            </div>

            <CodeBlock
              title="Clone & Setup"
              language="bash"
              code={`# 1. Clone the repository
git clone https://github.com/imvicky69/infyn-dl.git
cd infyn-dl

# 2. Install Flutter dependencies
flutter pub get

# 3. Run in development mode (Windows or Android emulator)
flutter run`}
            />

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#111111] dark:text-white">
                Adding Custom Format Presets or Download Flags
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                The download arguments are defined in the central download controller. You can easily add custom audio codecs (e.g. FLAC, OPUS) or format filter rules:
              </p>

              <CodeBlock
                title="lib/services/download_service.dart"
                language="dart"
                code={`// Adding a custom FLAC lossless audio preset
final flacPreset = DownloadPreset(
  id: "flac_lossless",
  name: "Lossless Audio (.flac)",
  extension: "flac",
  extraArgs: [
    "-x",
    "--audio-format", "flac",
    "--audio-quality", "0",
    "--embed-thumbnail",
    "--embed-metadata",
    "-N", "8",
  ],
);`}
              />
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-[#111111] dark:text-white">
                Building Production Binaries
              </h3>
              <CodeBlock
                title="Build Commands"
                language="bash"
                code={`# Build Android universal APK
flutter build apk --release

# Build Windows desktop executable
flutter build windows --release`}
              />
            </div>
          </section>

          {/* ── 9. Infyn Home Tab Architecture ────────────────────────── */}
          <section id="home-tab-architecture" className="space-y-6 scroll-mt-24 border-t border-[#EAEAE5] dark:border-zinc-800 pt-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-mono font-bold mb-2">
                Home Tab Architecture
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight mb-2">
                Infyn Home Tab: Chromium Extension Architecture
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Infyn Home Tab (`https://github.com/imvicky69/infyn-home-tab`) replaces the default browser new tab with a distraction-free developer workstation. It supports Google Chrome, Brave, Arc, Microsoft Edge, and Opera.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-2">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Timer className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-[#111111] dark:text-white">Manifest V3 Service Worker</h4>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  Pomodoro timer runs inside a background service worker using `chrome.alarms`. Updates `chrome.action.setBadgeText` in real-time so countdown minutes show on your extension icon.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-[#111111] dark:text-white">Local-First Chrome Storage</h4>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  All pinned GitHub repos, scratchpad notes, tasks, and bookmarks live in `chrome.storage.local`. Zero network traffic or cloud sync telemetry.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-2">
                <div className="h-8 w-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <Zap className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-[#111111] dark:text-white">GPU WebGL Lightfall Shaders</h4>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  Fluid ambient light particle streaks rendered dynamically via GPU fragment shaders with zero main-thread CPU lag or battery drain.
                </p>
              </div>
            </div>
          </section>

          {/* ── 10. Extending Infyn Home Tab ──────────────────────────── */}
          <section id="extending-home-tab" className="space-y-6 scroll-mt-24 border-t border-[#EAEAE5] dark:border-zinc-800 pt-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-mono font-bold mb-2">
                Home Tab Customization
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight mb-2">
                How to Build Custom Widgets & Search Providers
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Infyn Home Tab uses a modular React widget architecture. You can easily build custom developer widgets (e.g., Docker status, Jira tickets, Hacker News feed) or add new search providers to Omnisearch.
              </p>
            </div>

            <CodeBlock
              title="Clone & Load Unpacked"
              language="bash"
              code={`# 1. Clone repository
git clone https://github.com/imvicky69/infyn-home-tab.git
cd infyn-home-tab

# 2. Install dependencies & build
npm install
npm run build

# 3. In Chrome/Brave, visit chrome://extensions/
# Enable "Developer mode" -> Click "Load unpacked" -> Select 'dist' folder`}
            />

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#111111] dark:text-white">
                Recipe: Creating a Custom Developer Widget
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Create a new component under <code className="bg-[#F5F4EE] dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">src/components/widgets/</code> using `chrome.storage.local` hooks:
              </p>

              <CodeBlock
                title="src/components/widgets/MyCustomWidget.tsx"
                code={`import React, { useState, useEffect } from "react";

export function MyCustomWidget() {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    // Read directly from browser storage
    chrome.storage.local.get(["my_custom_key"], (res) => {
      if (res.my_custom_key) setData(res.my_custom_key);
    });
  }, []);

  const save = (val: string) => {
    setData(val);
    chrome.storage.local.set({ my_custom_key: val });
  };

  return (
    <div className="p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
        My Custom Widget
      </h4>
      <input
        type="text"
        value={data}
        onChange={(e) => save(e.target.value)}
        placeholder="Enter custom setting..."
        className="w-full px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs border border-white/20"
      />
    </div>
  );
}`}
              />
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-[#111111] dark:text-white">
                Adding an Omnisearch Provider (Cmd+K)
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Add an entry to the search engines map in <code className="bg-[#F5F4EE] dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">src/config/search-engines.ts</code>:
              </p>

              <CodeBlock
                title="src/config/search-engines.ts"
                code={`export const SEARCH_ENGINES = [
  { id: "google", name: "Google", url: "https://www.google.com/search?q=" },
  { id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com/?q=" },
  { id: "github", name: "GitHub Code", url: "https://github.com/search?q=" },
  // Adding custom search engine:
  { id: "kagi", name: "Kagi Search", url: "https://kagi.com/search?q=" },
];`}
              />
            </div>
          </section>

          {/* ── 11. Contributing & Standards ──────────────────────────── */}
          <section id="contributing-guidelines" className="space-y-6 scroll-mt-24 border-t border-[#EAEAE5] dark:border-zinc-800 pt-12 pb-16">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold mb-2">
                Open Source Standards
              </div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight mb-2">
                Contributing & Quality Standards
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                All contributions across the Infyn ecosystem must strictly preserve our core non-negotiable guidelines:
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "1. 100% Client-Side / Local Execution",
                  desc: "Zero remote uploads. All processing runs via WebAssembly, Canvas, native client binaries, or chrome.storage.local.",
                },
                {
                  title: "2. 100% Free, Ad-Free & Watermark-Free",
                  desc: "Never introduce paid tiers, feature gates, subscriptions, or intrusive third-party ad networks.",
                },
                {
                  title: "3. Clean Memory Management",
                  desc: "Always revoke object URLs (`URL.revokeObjectURL`) and terminate heavy Web Workers on unmount.",
                },
                {
                  title: "4. Cream & Ink Minimal Aesthetic",
                  desc: "Follow the curated design system tokens (`#FBFBFA` background, `#FFFFFF` elevated cards, `#EAEAE5` clean borders).",
                },
              ].map((rule, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#121214] space-y-1"
                >
                  <h4 className="text-sm font-bold text-[#111111] dark:text-white">{rule.title}</h4>
                  <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/contributing"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
              >
                <span>Read Full Contributing Guide</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="https://github.com/imvicky69/infyn/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-[#6E6D68] dark:text-zinc-300 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-colors"
              >
                <span>Open an Issue / Suggest a Feature</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
}
