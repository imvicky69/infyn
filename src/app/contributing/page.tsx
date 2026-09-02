"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import SplitText from "@/components/SplitText";
import {
  GitPullRequest,
  Terminal,
  ShieldCheck,
  Layers,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Code2,
  Cpu,
  Boxes,
  Compass,
  FileCode2,
  BookOpen,
  ArrowRight,
  Zap,
} from "lucide-react";

function CopyCodeBlock({ code, title }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#111111] dark:bg-[#0E0E10] overflow-hidden my-3 shadow-sm">
      {title && (
        <div className="px-4 py-2 bg-[#1C1C1A] dark:bg-[#151518] border-b border-[#2A2A28] dark:border-zinc-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#9E9D98] dark:text-zinc-400">{title}</span>
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1.5 text-xs text-[#BEBDB9] dark:text-zinc-400 hover:text-white transition-colors px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      )}
      <div className="p-4 overflow-x-auto text-xs font-mono text-[#EAEAE5] dark:text-zinc-200 leading-relaxed">
        <pre>{code}</pre>
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: "core-pillars", title: "1. Core Philosophy & Pillars", icon: ShieldCheck },
  { id: "local-setup", title: "2. Local Development Setup", icon: Terminal },
  { id: "step-by-step", title: "3. Step-by-Step Tool Blueprint", icon: Layers },
  { id: "shared-components", title: "4. Shared Component Library", icon: Boxes },
  { id: "design-system", title: "5. Design System & Aesthetics", icon: Sparkles },
  { id: "ideas", title: "6. Wanted Tools (Good First Issues)", icon: Compass },
  { id: "pr-checklist", title: "7. PR Quality Checklist", icon: GitPullRequest },
];

export default function ContributingPage() {
  const [activeSection, setActiveSection] = useState("core-pillars");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />
      <Breadcrumbs />

      {/* Hero Header */}
      <header className="border-b border-[#EAEAE5] dark:border-zinc-800 bg-white/60 dark:bg-[#141417]/60 backdrop-blur-md pt-12 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <GitPullRequest className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Open Source Contribution Guide</span>
            </div>

            <SplitText
              text="Contribute to Infyn"
              className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-[#111111] dark:text-white"
              delay={25}
              duration={0.7}
              splitType="words"
              tag="h1"
            />

            <p className="text-base sm:text-lg text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Help us build the web&apos;s fastest, truly private, client-side utility suite. Everything on Infyn runs 100% locally in the browser with zero cloud uploads, zero ads, and zero subscriptions.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://github.com/imvicky69/infyn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold hover:bg-[#262626] dark:hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub Repository</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>

              <a
                href="https://github.com/imvicky69/infyn/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 text-[#111111] dark:text-zinc-200 text-xs font-bold hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
              >
                <span>Browse Issues</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>

              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800/80 text-xs font-bold text-[#111111] dark:text-white hover:bg-[#EAEAE5] dark:hover:bg-zinc-700 active:scale-[0.98] transition-all"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>SDK Docs</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Documentation Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full flex flex-col lg:flex-row gap-10">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E9D98] dark:text-zinc-500 px-3 mb-2">
                Contribution Guide
              </p>
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-xs"
                        : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800/80"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white dark:text-[#111111]" : "text-[#9E9D98] dark:text-zinc-500"}`} />
                    <span className="truncate">{sec.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Ready to build?</span>
              </div>
              <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                Check out the wanted tools list below or propose a new browser tool on GitHub!
              </p>
            </div>
          </div>
        </aside>

        {/* Content Column */}
        <main className="flex-1 space-y-16 max-w-3xl">

          {/* ── 1. CORE PHILOSOPHY & PILLARS ── */}
          <section id="core-pillars" className="space-y-5 scroll-mt-24">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[11px] font-bold text-[#6E6D68] dark:text-zinc-300 mb-2">
                Pillar 1
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                Core Philosophy & Non-Negotiables
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 mt-1">
                Every tool built on Infyn must strictly abide by these four core principles:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 shadow-2xs">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[#111111] dark:text-white">100% Client-Side Execution</h3>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  All processing runs locally in the browser via WebAssembly (WASM), Web Workers, Canvas, or client libraries. User files are <strong>never uploaded</strong> to remote servers.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 shadow-2xs">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[#111111] dark:text-white">100% Free & Ad-Free</h3>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  No paywalls, no subscriptions, no credit cards, and <strong>zero watermarks</strong> on exported files. No intrusive tracking or banner ads.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 shadow-2xs">
                <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Boxes className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[#111111] dark:text-white">Batch-First Capability</h3>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  Tools should accept multiple files (50+ at once) whenever applicable and offer a 1-Click <strong>&quot;Download All (ZIP)&quot;</strong> export using <code>jszip</code>.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 shadow-2xs">
                <div className="h-8 w-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Cpu className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[#111111] dark:text-white">60fps Main-Thread Protection</h3>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  Heavy computational tasks (AI inference, large image/PDF decodes) must run in a <strong>Web Worker</strong> or asynchronous chunked streams to keep the UI smooth.
                </p>
              </div>
            </div>
          </section>

          {/* ── 2. LOCAL SETUP & QUICK START ── */}
          <section id="local-setup" className="space-y-5 scroll-mt-24">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[11px] font-bold text-[#6E6D68] dark:text-zinc-300 mb-2">
                Setup
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                Local Development Setup
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 mt-1">
                Infyn is built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-[#111111] dark:text-white">1. Fork & Clone the Repository:</p>
              <CopyCodeBlock
                title="Terminal"
                code={`git clone https://github.com/imvicky69/infyn.git\ncd infyn`}
              />

              <p className="text-xs font-bold text-[#111111] dark:text-white">2. Install Dependencies:</p>
              <CopyCodeBlock
                title="Terminal"
                code={`npm install`}
              />

              <p className="text-xs font-bold text-[#111111] dark:text-white">3. Run the Development Server:</p>
              <CopyCodeBlock
                title="Terminal"
                code={`npm run dev`}
              />

              <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                Open <code className="text-xs bg-[#F5F4EE] dark:bg-zinc-800 px-1.5 py-0.5 rounded">http://localhost:3000</code> in your browser.
              </p>
            </div>
          </section>

          {/* ── 3. STEP-BY-STEP BLUEPRINT ── */}
          <section id="step-by-step" className="space-y-5 scroll-mt-24">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[11px] font-bold text-[#6E6D68] dark:text-zinc-300 mb-2">
                Architecture
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                Step-by-Step Blueprint for a New Tool
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 mt-1">
                Follow this proven standard when building a new utility (e.g. <code>/image/my-tool</code>, <code>/pdf/my-tool</code>):
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-[#111111] dark:text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-mono">1</span>
                  <span>Create the Dedicated Route Directory</span>
                </div>
                <CopyCodeBlock
                  title="Directory Structure"
                  code={`src/app/<category>/<tool-name>/\n├── layout.tsx     <-- SEO Metadata + JSON-LD Schema\n├── page.tsx       <-- "use client" UI & Stage Management\n└── worker.ts      <-- (Optional) Web Worker for heavy tasks`}
                />
              </div>

              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-[#111111] dark:text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-mono">2</span>
                  <span>Implement layout.tsx (SEO & Structured Data)</span>
                </div>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                  Every tool requires rich metadata and a WebApplication JSON-LD schema for search indexing:
                </p>
                <CopyCodeBlock
                  title="src/app/<category>/<tool-name>/layout.tsx"
                  code={`import type { Metadata } from "next";\n\nexport const metadata: Metadata = {\n  title: "Free [Tool Name] — [Primary Benefit] (No Uploads)",\n  description: "100% Free & Ad-Free [Tool Name] running locally in your browser. Zero server uploads.",\n  keywords: ["free [tool]", "[tool] online no upload", "client side [tool]"],\n  alternates: { canonical: "https://infyn.software/<category>/<tool-name>" },\n};\n\nconst jsonLd = {\n  "@context": "https://schema.org",\n  "@type": "WebApplication",\n  name: "Infyn by Indivio — [Tool Name]",\n  url: "https://infyn.software/<category>/<tool-name>",\n  applicationCategory: "MultimediaApplication",\n  operatingSystem: "All (Web Browser)",\n  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },\n};\n\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <>\n      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />\n      {children}\n    </>\n  );\n}`}
                />
              </div>

              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-[#111111] dark:text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-mono">3</span>
                  <span>Follow the 4-Stage UI State Machine</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700">
                    <span className="font-bold text-[#111111] dark:text-white block">idle</span>
                    <span className="text-[10px] text-[#6E6D68] dark:text-zinc-400">DropZone upload</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700">
                    <span className="font-bold text-[#111111] dark:text-white block">busy</span>
                    <span className="text-[10px] text-[#6E6D68] dark:text-zinc-400">GlobalLoader / Progress</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700">
                    <span className="font-bold text-[#111111] dark:text-white block">done</span>
                    <span className="text-[10px] text-[#6E6D68] dark:text-zinc-400">Preview & Download</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700">
                    <span className="font-bold text-[#111111] dark:text-white block">error</span>
                    <span className="text-[10px] text-[#6E6D68] dark:text-zinc-400">Friendly retry card</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 4. SHARED COMPONENT LIBRARY ── */}
          <section id="shared-components" className="space-y-5 scroll-mt-24">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[11px] font-bold text-[#6E6D68] dark:text-zinc-300 mb-2">
                Components
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                Shared Reusable Components
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 mt-1">
                Before writing custom UI, utilize these shared components located in <code>src/components/</code>:
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#111111] dark:text-white">1. &lt;DropZone /&gt;</h3>
                  <span className="text-[10px] font-mono text-[#9E9D98] dark:text-zinc-500">src/components/image-tools/dropzone.tsx</span>
                </div>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                  Universal drag-and-drop file uploader supporting single or multi-file uploads:
                </p>
                <CopyCodeBlock
                  code={`<DropZone\n  multiple={true}\n  accept="image/*"\n  onFilesSelected={(files) => handleFiles(files)}\n  title="Drop your files here"\n  subtitle="or click to browse from device"\n  formatsText="JPG · PNG · WEBP · HEIC"\n/>`}
                />
              </div>

              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#111111] dark:text-white">2. &lt;GlobalLoader /&gt; &amp; useLoading</h3>
                  <span className="text-[10px] font-mono text-[#9E9D98] dark:text-zinc-500">src/components/global-loader.tsx</span>
                </div>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                  Application-wide animated infinity loader for async operations and route transitions:
                </p>
                <CopyCodeBlock
                  code={`import { useLoading } from "@/components/loading-provider";\n\nconst { showLoader, hideLoader } = useLoading();\nshowLoader("Processing 50 files...");\n// ... operation done\nhideLoader();`}
                />
              </div>

              <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#111111] dark:text-white">3. &lt;PrivacyBadges /&gt;</h3>
                  <span className="text-[10px] font-mono text-[#9E9D98] dark:text-zinc-500">src/components/image-tools/privacy-badges.tsx</span>
                </div>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                  Signature privacy badges to reassure users of local browser execution:
                </p>
                <CopyCodeBlock
                  code={`<PrivacyBadges\n  badges={["100% In-browser", "Zero cloud uploads", "100% Free", "Unlimited files"]}\n/>`}
                />
              </div>
            </div>
          </section>

          {/* ── 5. DESIGN SYSTEM & AESTHETICS ── */}
          <section id="design-system" className="space-y-5 scroll-mt-24">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[11px] font-bold text-[#6E6D68] dark:text-zinc-300 mb-2">
                Design
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                Design System &amp; Dark Mode Rules
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 mt-1">
                Infyn uses a curated minimal <strong>Cream &amp; Ink</strong> aesthetic:
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FBFBFA] dark:bg-[#0C0C0E] border border-[#EAEAE5] dark:border-zinc-800">
                  <span className="font-bold text-[#111111] dark:text-white block">Background</span>
                  <span className="text-[10px] text-[#6E6D68] dark:text-zinc-400 font-mono">#FBFBFA / #0C0C0E</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800">
                  <span className="font-bold text-[#111111] dark:text-white block">Surfaces &amp; Cards</span>
                  <span className="text-[10px] text-[#6E6D68] dark:text-zinc-400 font-mono">#FFFFFF / #141417</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700">
                  <span className="font-bold text-[#111111] dark:text-white block">Muted Pills</span>
                  <span className="text-[10px] text-[#6E6D68] dark:text-zinc-400 font-mono">#F5F4EE / #1A1A1F</span>
                </div>
                <div className="p-3 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] border border-black dark:border-white">
                  <span className="font-bold block">Primary Ink</span>
                  <span className="text-[10px] opacity-70 font-mono">#111111 / #FFFFFF</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed pt-2 border-t border-[#F5F4EE] dark:border-zinc-800">
                <p>• <strong>Tactile Feedback:</strong> Always include <code>active:scale-[0.97] transition-all</code> on interactive buttons.</p>
                <p>• <strong>Selected Tabs:</strong> Selected options must invert in dark mode (<code>dark:bg-white dark:text-[#111111] dark:border-white</code>) for high tactile contrast.</p>
                <p>• <strong>Border Radii:</strong> Use <code>rounded-2xl</code> (16px) for cards and <code>rounded-3xl</code> (24px) for major hero containers.</p>
              </div>
            </div>
          </section>

          {/* ── 6. WANTED TOOLS (GOOD FIRST ISSUES) ── */}
          <section id="ideas" className="space-y-5 scroll-mt-24">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[11px] font-bold text-[#6E6D68] dark:text-zinc-300 mb-2">
                Good First Issues
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                High-Demand Tools Developers Can Build
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 mt-1">
                Looking for an idea? Here are tools requested by our community that can be implemented 100% in-browser:
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start gap-4">
                <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] uppercase tracking-wider shrink-0 mt-0.5">Image</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#111111] dark:text-white">SVG to PNG / JPG Converter</h4>
                  <p className="text-xs text-[#6E6D68] dark:text-zinc-400">Render vector SVGs to high-resolution raster images at 1x, 2x, 4x, or custom pixel dimensions using native Canvas API.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start gap-4">
                <span className="px-2 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold text-[10px] uppercase tracking-wider shrink-0 mt-0.5">PDF</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#111111] dark:text-white">Rotate PDF Pages</h4>
                  <p className="text-xs text-[#6E6D68] dark:text-zinc-400">Rotate individual or all pages in a PDF document by 90°, 180°, or 270° using <code>pdf-lib</code> without re-compressing.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start gap-4">
                <span className="px-2 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold text-[10px] uppercase tracking-wider shrink-0 mt-0.5">PDF</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#111111] dark:text-white">Add Page Numbers to PDF</h4>
                  <p className="text-xs text-[#6E6D68] dark:text-zinc-400">Stamp customized page numbers (e.g. &quot;Page 1 of 12&quot;) with selectable position (top/bottom, left/center/right) and font size.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start gap-4">
                <span className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] uppercase tracking-wider shrink-0 mt-0.5">Dev</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#111111] dark:text-white">Base64 Image / String Encoder &amp; Decoder</h4>
                  <p className="text-xs text-[#6E6D68] dark:text-zinc-400">Instantly convert files or images to Base64 data URIs and vice-versa with 1-click clipboard copy.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 7. PR QUALITY CHECKLIST ── */}
          <section id="pr-checklist" className="space-y-5 scroll-mt-24">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[11px] font-bold text-[#6E6D68] dark:text-zinc-300 mb-2">
                Submissions
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                Pull Request Quality Checklist
              </h2>
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 mt-1">
                Before opening your PR on GitHub, ensure you have checked every item:
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-[#111111] dark:text-white font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>No Remote Uploads:</strong> All logic executes entirely inside the browser.</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#111111] dark:text-white font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Memory Safety:</strong> All <code>URL.createObjectURL</code> references are revoked on reset or component unmount.</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#111111] dark:text-white font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Dark Mode Tested:</strong> Both light mode and dark mode are fully styled with tactile contrast.</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#111111] dark:text-white font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Build Validation:</strong> <code>npm run build</code> passes with zero TypeScript errors and all static pages render.</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <a
                href="https://github.com/imvicky69/infyn/pulls"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold hover:bg-[#262626] dark:hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
              >
                <GitPullRequest className="h-4 w-4" />
                <span>Open a Pull Request on GitHub</span>
              </a>
            </div>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
}
