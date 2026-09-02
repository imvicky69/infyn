"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink, 
  ArrowRight, 
  FileText, 
  ImageIcon, 
  Lock, 
  Smartphone,
  Shield,
  Zap,
  Code2
} from "lucide-react";

type PackageManager = "npm" | "pnpm" | "bun" | "yarn";

interface CodeSample {
  id: string;
  title: string;
  category: "PDF" | "Image";
  icon: React.ElementType;
  tag: string;
  code: string;
  explanation: string;
}

const PACKAGE_MANAGERS: { id: PackageManager; name: string; command: string }[] = [
  { id: "npm", name: "npm", command: "npm install infyn" },
  { id: "pnpm", name: "pnpm", command: "pnpm add infyn" },
  { id: "bun", name: "bun", command: "bun add infyn" },
  { id: "yarn", name: "yarn", command: "yarn add infyn" },
];

const CODE_SAMPLES: CodeSample[] = [
  {
    id: "pdf-merge",
    title: "Merge PDFs",
    category: "PDF",
    icon: FileText,
    tag: "infyn/pdf",
    explanation: "Combine multiple PDF documents client-side in 1 line.",
    code: `import { mergePDFs } from "infyn/pdf";

// Merge multiple PDF files in browser memory
const mergedBytes = await mergePDFs([fileA, fileB]);
const blob = new Blob([mergedBytes], { type: "application/pdf" });

// Instant download without server upload
const downloadUrl = URL.createObjectURL(blob);`,
  },
  {
    id: "img-compress",
    title: "Compress Image",
    category: "Image",
    icon: ImageIcon,
    tag: "infyn/image",
    explanation: "Reduce image file size with bicubic canvas downscaling.",
    code: `import { compressImage } from "infyn/image";

// Compress image with custom dimensions & format
const result = await compressImage(photoFile, {
  quality: 0.75,
  maxWidth: 1920,
  targetFormat: "image/webp"
});

console.log(\`Saved \${result.savedPercentage}% file size!\`);`,
  },
  {
    id: "pdf-encrypt",
    title: "Encrypt PDF",
    category: "PDF",
    icon: Lock,
    tag: "infyn/pdf",
    explanation: "Password-protect confidential PDFs with AES-256 encryption.",
    code: `import { encryptPDF, decryptPDF } from "infyn/pdf";

// 1. Password protect PDF
const encrypted = await encryptPDF(myDoc, "secretPassword123");

// 2. Unlock password-protected PDF
const decrypted = await decryptPDF(encrypted, "secretPassword123");`,
  },
  {
    id: "heic-convert",
    title: "HEIC to JPG",
    category: "Image",
    icon: Smartphone,
    tag: "infyn/image",
    explanation: "Decode Apple iPhone HEIC/HEIF photos via WebAssembly.",
    code: `import { convertHeicToJpg, removeExif } from "infyn/image";

// 1. Convert iPhone HEIC to standard JPEG via WASM
const jpegBlob = await convertHeicToJpg(iphonePhoto);

// 2. Strip GPS location & camera metadata
const cleanBlob = await removeExif(jpegBlob);`,
  },
];

export function NpmShowcase() {
  const [pm, setPm] = useState<PackageManager>("npm");
  const [copiedPm, setCopiedPm] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState("pdf-merge");
  const [copiedCode, setCopiedCode] = useState(false);

  const activePmObj = PACKAGE_MANAGERS.find((p) => p.id === pm) || PACKAGE_MANAGERS[0];
  const activeSample = CODE_SAMPLES.find((s) => s.id === activeSampleId) || CODE_SAMPLES[0];

  const copyPmCommand = () => {
    navigator.clipboard.writeText(activePmObj.command);
    setCopiedPm(true);
    setTimeout(() => setCopiedPm(false), 2000);
  };

  const copySampleCode = () => {
    navigator.clipboard.writeText(activeSample.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="relative rounded-3xl border border-[#EAEAE5] dark:border-zinc-800/80 bg-gradient-to-b from-white via-[#FDFDFD] to-[#F8F8F6] dark:from-[#141417] dark:via-[#121215] dark:to-[#0E0E10] p-6 sm:p-10 shadow-sm dark:shadow-2xl overflow-hidden transition-colors">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/8 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-400/8 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col lg:flex-row gap-10 lg:items-center justify-between">
        
        {/* Left Column: Value Proposition & Install Command */}
        <div className="max-w-xl space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>NPM Package v1.0.0 Live</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] dark:text-[#EDEDEC] tracking-tight leading-tight">
              Add client-side superpowers to your own React & Web apps.
            </h2>

            <p className="text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Don&apos;t pay for cloud converters or heavy backend microservices. Install <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#F5F4EE] dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 text-[#111111] dark:text-zinc-200 font-bold">infyn</code> to process PDFs and images directly inside the user&apos;s browser.
            </p>
          </div>

          {/* Quick Install Bar with PM switcher */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 bg-[#F5F4EE] dark:bg-zinc-900/90 p-1 rounded-xl w-fit border border-[#EAEAE5] dark:border-zinc-800">
              {PACKAGE_MANAGERS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPm(item.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    pm === item.id
                      ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-xs"
                      : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Terminal Copy Box */}
            <div 
              onClick={copyPmCommand}
              className="group relative flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#111111] dark:bg-[#18181B] border border-transparent dark:border-zinc-800 text-white font-mono text-xs sm:text-sm cursor-pointer hover:bg-[#1A1A18] dark:hover:bg-zinc-800 transition-all shadow-md active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Terminal className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 select-none">$</span>
                <span className="truncate text-[#EAEAE5] dark:text-zinc-200 font-semibold">{activePmObj.command}</span>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 dark:bg-white/5 group-hover:bg-white/20 text-[#BEBDB9] dark:text-zinc-400 group-hover:text-white transition-colors shrink-0 text-xs">
                {copiedPm ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-sans font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="font-sans">Copy</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { label: "Zero API Keys / Free", icon: Zap },
              { label: "100% In-Browser Privacy", icon: Shield },
              { label: "Tree-Shakeable Subpaths", icon: Code2 },
              { label: "Full TypeScript Types", icon: Sparkles },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex items-center gap-2 text-xs font-medium text-[#6E6D68] dark:text-zinc-400">
                  <div className="h-5 w-5 rounded-md bg-white dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                    <Icon className="h-3 w-3" />
                  </div>
                  <span>{feature.label}</span>
                </div>
              );
            })}
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold hover:bg-[#262626] dark:hover:bg-zinc-200 transition-all shadow-xs"
            >
              <span>Explore Full SDK Guide</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <a
              href="https://www.npmjs.com/package/infyn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 text-[#111111] dark:text-zinc-200 text-xs font-bold hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-all shadow-xs"
            >
              <span>npmjs.com/package/infyn</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Code Showcase Window */}
        <div className="w-full lg:max-w-md xl:max-w-lg">
          <div className="rounded-2xl border border-[#2A2A28] dark:border-zinc-800 bg-[#111111] dark:bg-[#0E0E10] shadow-xl overflow-hidden flex flex-col">
            
            {/* Window Titlebar */}
            <div className="px-4 py-3 bg-[#1C1C1A] dark:bg-[#151518] border-b border-[#2A2A28] dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                <span className="ml-2 text-[11px] font-mono text-[#9E9D98] dark:text-zinc-400">example.ts</span>
              </div>

              <button
                onClick={copySampleCode}
                className="flex items-center gap-1 text-[11px] text-[#9E9D98] dark:text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                title="Copy code snippet"
              >
                {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedCode ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Example Tabs */}
            <div className="flex border-b border-[#2A2A28] dark:border-zinc-800 bg-[#141413] dark:bg-[#111113] overflow-x-auto no-scrollbar">
              {CODE_SAMPLES.map((sample) => {
                const Icon = sample.icon;
                const isActive = activeSampleId === sample.id;
                return (
                  <button
                    key={sample.id}
                    onClick={() => setActiveSampleId(sample.id)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "border-emerald-400 text-white bg-white/5"
                        : "border-transparent text-[#9E9D98] dark:text-zinc-500 hover:text-[#EAEAE5] dark:hover:text-zinc-300"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{sample.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation Strip */}
            <div className="px-4 py-2 bg-[#1A1A18] dark:bg-[#131316] border-b border-[#2A2A28] dark:border-zinc-800 text-[11px] text-[#BEBDB9] dark:text-zinc-400 flex items-center justify-between">
              <span>{activeSample.explanation}</span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                {activeSample.tag}
              </span>
            </div>

            {/* Code Body */}
            <div className="p-4 overflow-x-auto text-xs font-mono text-[#EAEAE5] dark:text-zinc-200 leading-relaxed min-h-[170px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeSample.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="w-full"
                >
                  {activeSample.code}
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
