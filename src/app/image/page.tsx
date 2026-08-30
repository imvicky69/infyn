import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const IMAGE_TOOLS = [
  {
    href: "/image/bg-remover",
    title: "AI Background Remover",
    badge: "100% Free • No Watermark",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description:
      "Erase image backgrounds with state-of-the-art BRIA RMBG-1.4 neural network running 100% locally in your browser. Add custom colors, studio gradients, and export in custom aspect ratios (1:1, 9:16, 4:5).",
    icon: (
      <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </div>
    ),
    features: [
      "100% Free & Unlimited (Zero Watermarks)",
      "Neural AI inference runs on device (WASM)",
      "Custom solid & gradient backgrounds",
      "Social media aspect ratios (1:1, 9:16, 4:5)",
    ],
  },
  {
    href: "/image/compressor",
    title: "Image Compressor & Reducer",
    badge: "Free Batch ZIP",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description:
      "Reduce image file size by up to 90% without visible quality loss. Choose between visual quality sliders, target file size limits (e.g. under 200 KB), WebP conversion, and batch download all as a ZIP file.",
    icon: (
      <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-transparent border border-blue-200/80 flex items-center justify-center text-blue-700 shadow-2xs">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0 0h4.5m-4.5 0L9 3.75M20.25 3.75h-4.5m0 0v4.5m0-4.5L15 9m5.25 11.25v-4.5m0 0h-4.5m4.5 0L15 20.25M3.75 20.25h4.5m0 0v-4.5m0 4.5L9 15" />
        </svg>
      </div>
    ),
    features: [
      "100% Free batch compression (50+ photos)",
      "Target file size mode (KB/MB precision)",
      "Interactive split before/after visual compare",
      "1-Click All Images ZIP archive export",
    ],
  },
  {
    href: "/image/heic-to-jpg",
    title: "HEIC to JPG Converter",
    badge: "Free Batch Convert",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    description:
      "Convert iPhone and camera photos (.HEIC, .HEIF, Live Photos) into universal JPG or PNG format. Fixes incompatibility with Windows, Android, websites, and portal uploads.",
    icon: (
      <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-200/80 flex items-center justify-center text-amber-800 shadow-2xs">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      </div>
    ),
    features: [
      "100% Free Apple HEIC/HEIF photo conversion",
      "libheif v1.19 WASM decoding engine",
      "Batch convert dozens of phone photos at once",
      "Full original camera resolution preserved",
    ],
  },
];

const UPCOMING_TOOLS = [
  {
    title: "SVG Optimizer & Cleaner",
    badge: "Free Soon",
    description: "Minify SVG vectors, strip unnecessary metadata and comments, and optimize SVG code for web apps.",
    icon: (
      <div className="h-9 w-9 rounded-xl border border-[#EAEAE5] bg-white flex items-center justify-center text-[#6E6D68]">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>
    ),
  },
  {
    title: "Image Cropper & Resizer",
    badge: "Free Soon",
    description: "Precise pixel cropping, predefined social media canvas sizes, circular avatar cutouts, and dimension scaling.",
    icon: (
      <div className="h-9 w-9 rounded-xl border border-[#EAEAE5] bg-white flex items-center justify-center text-[#6E6D68]">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 2v14a2 2 0 002 2h14M18 22V8a2 2 0 00-2-2H2" />
        </svg>
      </div>
    ),
  },
  {
    title: "Blur & Watermark Tool",
    badge: "Free Soon",
    description: "Easily censor sensitive info, blur faces/license plates, or add custom branding watermarks in-browser.",
    icon: (
      <div className="h-9 w-9 rounded-xl border border-[#EAEAE5] bg-white flex items-center justify-center text-[#6E6D68]">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
        </svg>
      </div>
    ),
  },
];

export default function ImageToolsHubPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 space-y-16">
        
        {/* Hub Hero */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F4EE] border border-[#EAEAE5] text-xs font-bold text-[#111111] shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>🎉 100% Free Forever • No Watermarks • No Cloud Uploads</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] leading-tight">
            High-performance image tools that respect your privacy.
          </h1>
          <p className="text-sm sm:text-base text-[#6E6D68] leading-relaxed">
            Every operation runs 100% locally inside your browser using WebAssembly and Web Workers. No file uploads, no storage, no subscriptions.
          </p>
        </section>

        {/* Active Tools Showcase */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#EAEAE5] pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              Available Tools ({IMAGE_TOOLS.length})
            </h2>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Free & Unlimited
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {IMAGE_TOOLS.map((tool) => (
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
                  <span>Launch Free Tool</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Coming Soon Tools */}
        <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-[#EAEAE5] pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6E6D68]">
              In Development (Free)
            </h2>
            <span className="text-xs text-[#9E9D98]">Roadmap</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {UPCOMING_TOOLS.map((tool) => (
              <div
                key={tool.title}
                className="rounded-2xl border border-[#EAEAE5] bg-[#FBFBFA] p-5 space-y-3 opacity-80"
              >
                <div className="flex items-center justify-between">
                  {tool.icon}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F5F4EE] text-[#9E9D98] border border-[#EAEAE5]">
                    {tool.badge}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">{tool.title}</h4>
                  <p className="text-[11px] text-[#6E6D68] mt-1 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why In-Browser Architecture */}
        <section className="rounded-3xl border border-[#EAEAE5] bg-white p-7 sm:p-10 space-y-6 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl font-bold tracking-tight text-[#111111]">
              Why client-side image processing matters
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6D68] leading-relaxed">
              Traditional online converters upload your personal photos and sensitive documents to remote servers. Infyn does all computation directly on your device CPU/GPU.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <div className="h-8 w-8 rounded-lg bg-[#F5F4EE] border border-[#EAEAE5] flex items-center justify-center font-bold text-xs">
                🔒
              </div>
              <h3 className="text-xs font-bold text-[#111111]">Complete Data Privacy</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                Images never leave your computer or phone. No analytics tracking, logs, or stored files.
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-8 w-8 rounded-lg bg-[#F5F4EE] border border-[#EAEAE5] flex items-center justify-center font-bold text-xs">
                ⚡
              </div>
              <h3 className="text-xs font-bold text-[#111111]">Instant Zero Upload Lag</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                No slow uploading or downloading 50MB files to the cloud. Everything transforms in milliseconds.
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-8 w-8 rounded-lg bg-[#F5F4EE] border border-[#EAEAE5] flex items-center justify-center font-bold text-xs">
                ♾️
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
