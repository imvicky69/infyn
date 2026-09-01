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
  Search
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
    <div className="rounded-2xl border border-[#EAEAE5] bg-[#111111] overflow-hidden my-4 shadow-sm">
      {title && (
        <div className="px-4 py-2.5 bg-[#1C1C1A] border-b border-[#2A2A28] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80 inline-block" />
            <span className="text-xs font-mono text-[#9E9D98] ml-2">{title}</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-xs text-[#BEBDB9] hover:text-white transition-colors px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      )}
      <div className="p-4 overflow-x-auto text-sm font-mono text-[#EAEAE5] leading-relaxed">
        <pre>{code}</pre>
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: "getting-started", title: "Getting Started", icon: Zap },
  { id: "pdf-sdk", title: "PDF Utilities (infyn/pdf)", icon: FileText },
  { id: "image-sdk", title: "Image Utilities (infyn/image)", icon: ImageIcon },
  { id: "react-integration", title: "React & Next.js Guide", icon: Code2 },
  { id: "cli-usage", title: "CLI & Scripting", icon: Terminal },
  { id: "privacy-architecture", title: "Zero-Upload Architecture", icon: ShieldCheck },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen text-[#111111] flex flex-col font-sans bg-[#FBFBFA]">
      <Navbar />
      <Breadcrumbs />

      {/* Hero Header */}
      <header className="border-b border-[#EAEAE5] bg-white/60 backdrop-blur-md pt-12 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>NPM Package v1.0.0 is Live</span>
            </div>
            
            <SplitText
              text="Infyn Developer Documentation"
              className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
              delay={25}
              duration={0.7}
              splitType="words"
              tag="h1"
            />

            <p className="text-base sm:text-lg text-[#6E6D68] leading-relaxed">
              Integrate client-side PDF manipulation, image compression, metadata removal, and WASM conversion directly into your React, Next.js, or Vue applications with zero server costs and 100% user privacy.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://www.npmjs.com/package/infyn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-[#262626] transition-all shadow-xs"
              >
                <span>View on npm</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>
              <a
                href="https://github.com/imvicky69/infyn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EAEAE5] text-[#111111] text-xs font-bold hover:bg-[#F5F4EE] transition-all shadow-xs"
              >
                <span>GitHub Repository</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Documentation Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full flex flex-col lg:flex-row gap-10">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E9D98] px-3 mb-2">
                Documentation Menu
              </p>
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive
                        ? "bg-[#111111] text-white shadow-xs"
                        : "text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-[#9E9D98]"}`} />
                    <span className="truncate">{sec.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F4EE] border border-[#EAEAE5] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Zero Server Uploads</span>
              </div>
              <p className="text-[11px] text-[#6E6D68] leading-relaxed">
                All functions process files locally in the user's browser memory. Zero API keys, zero rate limits, zero server infrastructure required.
              </p>
            </div>
          </div>
        </aside>

        {/* Documentation Articles */}
        <main className="flex-1 max-w-3xl space-y-16">

          {/* 1. Getting Started */}
          <section id="getting-started" className="space-y-6 scroll-mt-24">
            <div>
              <h2 className="text-2xl font-bold text-[#111111] tracking-tight mb-2">
                Getting Started & Installation
              </h2>
              <p className="text-sm text-[#6E6D68]">
                Install Infyn using your favorite package manager. The library exports modern ESM, CommonJS, and full TypeScript declarations.
              </p>
            </div>

            <CodeBlock
              title="Terminal"
              language="bash"
              code={`# npm
npm install infyn

# pnpm
pnpm add infyn

# yarn
yarn add infyn`}
            />

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#111111]">Import Strategies</h3>
              <p className="text-sm text-[#6E6D68]">
                Infyn supports both an all-in-one root import and granular subpaths to optimize bundle size and tree-shaking:
              </p>

              <CodeBlock
                title="Subpath vs Root Import"
                code={`// 1. All-in-one import (great for quick scripting)
import { mergePDFs, compressImage, decryptPDF } from "infyn";

// 2. Subpath imports (recommended for minimal bundle sizes)
import { mergePDFs, splitPDF, encryptPDF } from "infyn/pdf";
import { compressImage, convertHeicToJpg, removeExif } from "infyn/image";`}
              />
            </div>
          </section>

          {/* 2. PDF Utilities */}
          <section id="pdf-sdk" className="space-y-8 scroll-mt-24 border-t border-[#EAEAE5] pt-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-mono font-bold mb-2">
                infyn/pdf
              </div>
              <h2 className="text-2xl font-bold text-[#111111] tracking-tight mb-2">
                PDF Manipulation Suite
              </h2>
              <p className="text-sm text-[#6E6D68]">
                High-performance, in-browser PDF merging, splitting, page extraction, AES-256 password encryption, and unlocking without sending documents over the wire.
              </p>
            </div>

            {/* mergePDFs */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#111111] font-mono">
                mergePDFs(files)
              </h3>
              <p className="text-sm text-[#6E6D68]">
                Merges an array of PDF files, Blobs, ArrayBuffers, or Uint8Arrays in sequential order into a single PDF document.
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
              <h3 className="text-lg font-bold text-[#111111] font-mono">
                extractPDFPages(file, pageNumbers) & splitPDF(file)
              </h3>
              <p className="text-sm text-[#6E6D68]">
                Extract a subset of pages into a new document, or split all pages into individual standalone documents.
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
              <h3 className="text-lg font-bold text-[#111111] font-mono">
                encryptPDF(file, password) & decryptPDF(file, password)
              </h3>
              <p className="text-sm text-[#6E6D68]">
                Protect confidential PDFs with standard AES-256 encryption, or unlock encrypted documents in-memory.
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
          </section>

          {/* 3. Image Utilities */}
          <section id="image-sdk" className="space-y-8 scroll-mt-24 border-t border-[#EAEAE5] pt-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-mono font-bold mb-2">
                infyn/image
              </div>
              <h2 className="text-2xl font-bold text-[#111111] tracking-tight mb-2">
                Image Processing Suite
              </h2>
              <p className="text-sm text-[#6E6D68]">
                Compress images, decode Apple HEIC photos via WebAssembly, convert formats, and wipe private EXIF/GPS metadata.
              </p>
            </div>

            {/* compressImage */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#111111] font-mono">
                compressImage(file, options)
              </h3>
              <p className="text-sm text-[#6E6D68]">
                Compresses image file sizes with bicubic canvas downscaling and quality tuning.
              </p>

              <CodeBlock
                title="compressImage Example"
                code={`import { compressImage } from "infyn/image";

const result = await compressImage(photoFile, {
  quality: 0.8,         // 0.1 to 1.0
  maxWidth: 1920,       // Automatically scales down if wider
  targetFormat: "image/webp"
});

console.log("Original Size:", result.originalSize);
console.log("Compressed Size:", result.compressedSize);
console.log("Savings:", result.savedPercentage + "%");
console.log("Output Blob:", result.blob);`}
              />
            </div>

            {/* convertHeicToJpg & removeExif */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#111111] font-mono">
                convertHeicToJpg(file) & removeExif(file)
              </h3>
              <p className="text-sm text-[#6E6D68]">
                Decode iPhone HEIC/HEIF images into standard JPEGs and strip GPS coordinates for privacy before upload.
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
          </section>

          {/* 4. React & Next.js Guide */}
          <section id="react-integration" className="space-y-6 scroll-mt-24 border-t border-[#EAEAE5] pt-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-mono font-bold mb-2">
                React / Next.js
              </div>
              <h2 className="text-2xl font-bold text-[#111111] tracking-tight mb-2">
                Embedding Infyn in React Apps
              </h2>
              <p className="text-sm text-[#6E6D68]">
                Here is a complete, copy-pasteable React component demonstrating a complete client-side PDF merger widget using Infyn:
              </p>
            </div>

            <CodeBlock
              title="components/PDFMergerWidget.tsx"
              code={`"use client";

import React, { useState } from "react";
import { mergePDFs } from "infyn/pdf";

export function PDFMergerWidget() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length < 2) {
      alert("Please select 2 or more PDF files.");
      return;
    }

    setIsProcessing(true);
    try {
      const filesArray = Array.from(e.target.files);
      const mergedBytes = await mergePDFs(filesArray);
      
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      alert("Failed to merge PDFs: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 border rounded-2xl bg-white space-y-4">
      <h3 className="font-bold text-lg">In-Browser PDF Merger</h3>
      <input 
        type="file" 
        multiple 
        accept="application/pdf" 
        onChange={handleFiles} 
      />
      
      {isProcessing && <p className="text-sm text-gray-500">Merging PDFs locally...</p>}
      
      {downloadUrl && (
        <a 
          href={downloadUrl} 
          download="merged.pdf"
          className="inline-block px-4 py-2 bg-black text-white font-bold rounded-xl text-sm"
        >
          Download Merged PDF
        </a>
      )}
    </div>
  );
}`}
            />
          </section>

          {/* 5. CLI & Scripting */}
          <section id="cli-usage" className="space-y-6 scroll-mt-24 border-t border-[#EAEAE5] pt-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-mono font-bold mb-2">
                CLI & Node.js
              </div>
              <h2 className="text-2xl font-bold text-[#111111] tracking-tight mb-2">
                Node.js & Scripting Usage
              </h2>
              <p className="text-sm text-[#6E6D68]">
                Infyn's PDF utilities (`infyn/pdf`) are fully compatible with Node.js and script automations using standard `Buffer` and `fs`:
              </p>
            </div>

            <CodeBlock
              title="scripts/merge.js"
              language="javascript"
              code={`const fs = require("fs");
const { mergePDFs } = require("infyn/pdf");

async function main() {
  const doc1 = fs.readFileSync("report1.pdf");
  const doc2 = fs.readFileSync("report2.pdf");

  console.log("Merging PDFs...");
  const mergedBytes = await mergePDFs([doc1, doc2]);

  fs.writeFileSync("combined-report.pdf", Buffer.from(mergedBytes));
  console.log("Saved combined-report.pdf successfully!");
}

main();`}
            />
          </section>

          {/* 6. Zero-Upload Privacy Architecture */}
          <section id="privacy-architecture" className="space-y-6 scroll-mt-24 border-t border-[#EAEAE5] pt-12 pb-16">
            <div>
              <h2 className="text-2xl font-bold text-[#111111] tracking-tight mb-2">
                Zero-Upload Privacy Architecture
              </h2>
              <p className="text-sm text-[#6E6D68]">
                How Infyn ensures total client-side execution without compromising performance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-[#EAEAE5] bg-white space-y-2">
                <h4 className="font-bold text-sm text-[#111111]">WebAssembly & Canvas</h4>
                <p className="text-xs text-[#6E6D68] leading-relaxed">
                  Decoders and raster engines run in WebAssembly bundles and hardware-accelerated 2D HTML5 Canvas contexts.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-[#EAEAE5] bg-white space-y-2">
                <h4 className="font-bold text-sm text-[#111111]">In-Memory WebCrypto</h4>
                <p className="text-xs text-[#6E6D68] leading-relaxed">
                  AES-256 PDF encryption and key derivation execute natively via the browser's cryptographic subsystem.
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
}
