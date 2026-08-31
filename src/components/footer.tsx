import * as React from "react";
import Link from "next/link";
import Image from "next/image";

const IMAGE_LINKS = [
  { href: "/image/bg-remover", label: "Background Remover" },
  { href: "/image/compressor", label: "Image Compressor" },
  { href: "/image/resizer", label: "Image Resizer & Crop" },
  { href: "/image/converter", label: "Universal Converter" },
  { href: "/image/heic-to-jpg", label: "HEIC to JPG" },
  { href: "/image/exif-remover", label: "EXIF Remover" },
];

const PDF_LINKS = [
  { href: "/pdf/pdf-to-image", label: "PDF to Image" },
  { href: "/image/img-to-pdf", label: "Image to PDF" },
  { href: "/pdf", label: "PDF Suite Hub →" },
];

const PRIVACY_BADGES = [
  {
    label: "Zero uploads",
    color: "bg-emerald-50 border-emerald-200/80 text-emerald-800",
    dot: "bg-emerald-500",
  },
  {
    label: "Ad-free",
    color: "bg-blue-50 border-blue-200/80 text-blue-800",
    dot: "bg-blue-500",
  },
  {
    label: "No watermarks",
    color: "bg-purple-50 border-purple-200/80 text-purple-800",
    dot: "bg-purple-500",
  },
  {
    label: "Free forever",
    color: "bg-amber-50 border-amber-200/80 text-amber-800",
    dot: "bg-amber-500",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#EAEAE5] bg-[#FBFBFA]">
      {/* Main footer grid */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">

        {/* Top section */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10">

          {/* Brand column */}
          <div className="md:col-span-4 space-y-5">
            {/* Wordmark */}
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <Image
                src="/logo-clear.png"
                alt="Infyn"
                width={22}
                height={22}
                style={{ width: "auto", height: "22px" }}
                className="object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-[15px] tracking-[-0.03em] text-[#111111]">infyn</span>
                <span className="text-[9px] font-semibold text-[#BEBDB9] tracking-[0.06em] uppercase">by indivio</span>
              </div>
            </Link>

            {/* Tagline */}
            <p className="text-[13px] text-[#6E6D68] leading-[1.7] max-w-[280px] tracking-[-0.005em]">
              Free, ad-free in-browser utilities that never upload your files. All computation runs locally via WebAssembly and client-side engines.
            </p>

            {/* Privacy badges */}
            <div className="flex flex-wrap gap-1.5">
              {PRIVACY_BADGES.map((b) => (
                <span
                  key={b.label}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${b.color}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${b.dot}`} />
                  {b.label}
                </span>
              ))}
            </div>

            {/* GitHub */}
            <a
              href="https://github.com/imvicky69/infyn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#6E6D68] hover:text-[#111111] transition-colors group/gh"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Open Source on GitHub</span>
              <span className="opacity-0 group-hover/gh:opacity-100 transition-opacity text-[10px]">↗</span>
            </a>
          </div>

          {/* Image Tools column */}
          <div className="md:col-span-3 space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
              Image Suite
            </h3>
            <nav className="flex flex-col gap-2">
              {IMAGE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-[#6E6D68] hover:text-[#111111] transition-colors tracking-[-0.005em] leading-snug"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/image"
                className="text-[12px] font-semibold text-[#111111] hover:text-[#6E6D68] transition-colors mt-1"
              >
                All Image Tools →
              </Link>
            </nav>
          </div>

          {/* PDF Tools column */}
          <div className="md:col-span-2 space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-blue-700">
              PDF Suite
            </h3>
            <nav className="flex flex-col gap-2">
              {PDF_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-[#6E6D68] hover:text-[#111111] transition-colors tracking-[-0.005em] leading-snug"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company column */}
          <div className="md:col-span-3 space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
              Network
            </h3>
            <div className="space-y-2.5">
              <a
                href="https://indivio.in"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-2.5 rounded-xl border border-[#EAEAE5] bg-white hover:border-[#BEBDB9] hover:shadow-2xs transition-all"
              >
                <div className="h-7 w-7 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center shrink-0">
                  <Image src="/indivio-logo.png" alt="Indivio" width={14} height={14} unoptimized className="h-3.5 w-3.5 object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#111111] tracking-[-0.01em]">Indivio</span>
                    <span className="text-[10px] text-[#9E9D98] group-hover:text-[#111111] transition-colors">↗</span>
                  </div>
                  <p className="text-[10px] text-[#9E9D98]">Food delivery</p>
                </div>
              </a>

              <a
                href="https://studio.indivio.in"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-2.5 rounded-xl border border-[#EAEAE5] bg-white hover:border-[#BEBDB9] hover:shadow-2xs transition-all"
              >
                <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#111111] tracking-[-0.01em]">Indivio Studio</span>
                    <span className="text-[10px] text-[#9E9D98] group-hover:text-[#111111] transition-colors">↗</span>
                  </div>
                  <p className="text-[10px] text-[#9E9D98]">Software studio</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#EAEAE5] py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#9E9D98] tracking-[-0.005em]">
            © {new Date().getFullYear()} Infyn. Developed by{" "}
            <a
              href="https://studio.indivio.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6E6D68] font-semibold hover:text-[#111111] transition-colors"
            >
              Indivio Studio
            </a>
            {" "}· All operations run locally in your browser.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#9E9D98]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Zero data collection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
