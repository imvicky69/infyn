"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

const IMAGE_TOOLS = [
  {
    name: "Background Remover",
    href: "/image/bg-remover",
    badge: "AI",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "Instant transparent cutouts",
    iconBg: "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200/60",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  },
  {
    name: "Image Compressor",
    href: "/image/compressor",
    badge: "−90%",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    desc: "Lossless & quality control",
    iconBg: "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 border-blue-200/60",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M4 10h6m0 0V4m0 6L3 3m17 7h-6m0 0V4m0 6l7-7" />
      </svg>
    ),
  },
  {
    name: "Image Resizer & Crop",
    href: "/image/resizer",
    badge: "Presets",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    desc: "Framing & social aspect ratios",
    iconBg: "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-700 border-purple-200/60",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
  },
  {
    name: "Universal Converter",
    href: "/image/converter",
    badge: "5 Formats",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    desc: "JPG · PNG · WEBP · AVIF · HEIC",
    iconBg: "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 border-amber-200/60",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    name: "Apple HEIC to JPG",
    href: "/image/heic-to-jpg",
    badge: "WASM",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    desc: "Batch iPhone photo conversion",
    iconBg: "bg-gradient-to-br from-rose-100 to-rose-50 text-rose-700 border-rose-200/60",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
      </svg>
    ),
  },
  {
    name: "EXIF & Metadata Remover",
    href: "/image/exif-remover",
    badge: "Privacy",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    desc: "Strip GPS, camera & timestamps",
    iconBg: "bg-gradient-to-br from-teal-100 to-teal-50 text-teal-700 border-teal-200/60",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const PDF_TOOLS_NAV = [
  {
    name: "PDF to Image Converter",
    href: "/pdf/pdf-to-image",
    badge: "New",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    desc: "Extract pages to HD JPG, PNG, WEBP",
    iconBg: "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 border-blue-200/60",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    name: "Image to PDF Converter",
    href: "/image/img-to-pdf",
    badge: "Popular",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    desc: "Convert photos to PDF with page reorder",
    iconBg: "bg-gradient-to-br from-orange-100 to-orange-50 text-orange-700 border-orange-200/60",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [imageDropdownOpen, setImageDropdownOpen] = useState(false);
  const [pdfDropdownOpen, setPdfDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setImageDropdownOpen(false);
    setPdfDropdownOpen(false);
  }, [pathname]);

  const handleImageMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setPdfDropdownOpen(false);
    setImageDropdownOpen(true);
  };

  const handlePdfMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setImageDropdownOpen(false);
    setPdfDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setImageDropdownOpen(false);
      setPdfDropdownOpen(false);
    }, 180);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main nav bar */}
      <div className="border-b border-[#EAEAE5]/70 bg-[#FBFBFA]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">

          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="infyn home"
          >
            <div className="relative">
              <Image
                src="/logo-clear.png"
                alt="infyn"
                width={26}
                height={26}
                style={{ width: "auto", height: "26px" }}
                className="object-contain group-hover:scale-105 transition-transform duration-200"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[15px] tracking-[-0.03em] text-[#111111]">
                infyn
              </span>
              <span className="text-[9px] font-semibold text-[#BEBDB9] tracking-[0.06em] uppercase">
                by indivio
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">

            {/* Image Tools dropdown */}
            <div
              className="relative"
              onMouseEnter={handleImageMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setImageDropdownOpen((p) => !p)}
                aria-expanded={imageDropdownOpen}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer tracking-[-0.01em] ${
                  imageDropdownOpen || pathname.startsWith("/image")
                    ? "bg-[#F0EFEA] text-[#111111]"
                    : "text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE]"
                }`}
              >
                <span>Image Tools</span>
                <motion.svg
                  animate={{ rotate: imageDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className="h-3.5 w-3.5 text-[#9E9D98]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              {/* Image Dropdown */}
              <AnimatePresence>
                {imageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 mt-2 w-[320px] rounded-2xl bg-white/98 backdrop-blur-2xl border border-[#EAEAE5] shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] p-2 z-50"
                  >
                    <div className="px-3 py-2 flex items-center justify-between border-b border-[#F5F4EE] mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
                        Image Suite
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-full">
                        <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                        In-Browser
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      {IMAGE_TOOLS.map((tool) => {
                        const isActive = pathname === tool.href;
                        return (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={() => setImageDropdownOpen(false)}
                            className={`group/item flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                              isActive ? "bg-[#F5F4EE]" : "hover:bg-[#F8F8F6]"
                            }`}
                          >
                            <div className={`h-8 w-8 rounded-[10px] flex items-center justify-center shrink-0 border ${tool.iconBg}`}>
                              {tool.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-[13px] text-[#111111] truncate tracking-[-0.01em]">
                                  {tool.name}
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${tool.badgeColor}`}>
                                  {tool.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#9E9D98] truncate mt-0.5">{tool.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="pt-1.5 mt-0.5 border-t border-[#F5F4EE]">
                      <Link
                        href="/image"
                        onClick={() => setImageDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE] transition-colors group/footer"
                      >
                        <span>View all image tools</span>
                        <svg className="h-3.5 w-3.5 transition-transform group-hover/footer:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PDF Tools dropdown */}
            <div
              className="relative"
              onMouseEnter={handlePdfMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setPdfDropdownOpen((p) => !p)}
                aria-expanded={pdfDropdownOpen}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer tracking-[-0.01em] ${
                  pdfDropdownOpen || pathname.startsWith("/pdf")
                    ? "bg-[#F0EFEA] text-[#111111]"
                    : "text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE]"
                }`}
              >
                <span>PDF Tools</span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <motion.svg
                  animate={{ rotate: pdfDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className="h-3.5 w-3.5 text-[#9E9D98]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              {/* PDF Dropdown */}
              <AnimatePresence>
                {pdfDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 mt-2 w-[320px] rounded-2xl bg-white/98 backdrop-blur-2xl border border-[#EAEAE5] shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] p-2 z-50"
                  >
                    <div className="px-3 py-2 flex items-center justify-between border-b border-[#F5F4EE] mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
                        PDF Suite
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded-full">
                        <span className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                        No Uploads
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      {PDF_TOOLS_NAV.map((tool) => {
                        const isActive = pathname === tool.href;
                        return (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={() => setPdfDropdownOpen(false)}
                            className={`group/item flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                              isActive ? "bg-[#F5F4EE]" : "hover:bg-[#F8F8F6]"
                            }`}
                          >
                            <div className={`h-8 w-8 rounded-[10px] flex items-center justify-center shrink-0 border ${tool.iconBg}`}>
                              {tool.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-[13px] text-[#111111] truncate tracking-[-0.01em]">
                                  {tool.name}
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${tool.badgeColor}`}>
                                  {tool.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#9E9D98] truncate mt-0.5">{tool.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="pt-1.5 mt-0.5 border-t border-[#F5F4EE]">
                      <Link
                        href="/pdf"
                        onClick={() => setPdfDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE] transition-colors group/footer"
                      >
                        <span>View all PDF tools</span>
                        <svg className="h-3.5 w-3.5 transition-transform group-hover/footer:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-[#EAEAE5] mx-1.5" />

            {/* GitHub */}
            <a
              href="https://github.com/imvicky69/infyn"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-[#9E9D98] hover:text-[#111111] hover:bg-[#F5F4EE] transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>

            {/* Primary CTA */}
            <Link
              href="/image/bg-remover"
              className="ml-1 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] text-white text-[13px] font-bold tracking-[-0.01em] hover:bg-[#1a1a1a] active:scale-[0.97] transition-all shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Remove BG</span>
              <svg className="h-3 w-3 opacity-60" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </nav>

          {/* Mobile right controls */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/pdf/pdf-to-image"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111111] text-white text-[12px] font-bold active:scale-95 transition-all"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>PDF to Img</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((p) => !p)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl border border-[#EAEAE5] bg-white text-[#111111] hover:bg-[#F5F4EE] active:scale-95 transition-all cursor-pointer"
            >
              <motion.div
                animate={mobileMenuOpen ? "open" : "closed"}
                className="h-4 w-4 flex flex-col justify-center gap-[4px]"
              >
                <motion.span
                  variants={{ open: { rotate: 45, y: 5 }, closed: { rotate: 0, y: 0 } }}
                  className="block h-[1.5px] w-4 bg-[#111111] origin-center transition-all"
                />
                <motion.span
                  variants={{ open: { opacity: 0, x: -4 }, closed: { opacity: 1, x: 0 } }}
                  className="block h-[1.5px] w-4 bg-[#111111] transition-all"
                />
                <motion.span
                  variants={{ open: { rotate: -45, y: -5 }, closed: { rotate: 0, y: 0 } }}
                  className="block h-[1.5px] w-4 bg-[#111111] origin-center transition-all"
                />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-[#EAEAE5] bg-white/97 backdrop-blur-2xl md:hidden shadow-lg"
          >
            <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">

              {/* PDF Tools Section */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-1 pb-1.5 border-b border-[#F5F4EE]">
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-blue-700">
                    PDF Utilities
                  </span>
                  <Link href="/pdf" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-semibold text-[#6E6D68] hover:text-[#111111]">
                    PDF Hub →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-0.5">
                  {PDF_TOOLS_NAV.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8F8F6] transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-8 w-8 rounded-[10px] flex items-center justify-center shrink-0 border ${tool.iconBg}`}>
                          {tool.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[13px] text-[#111111] truncate">{tool.name}</p>
                          <p className="text-[10px] text-[#9E9D98] truncate">{tool.desc}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ml-2 ${tool.badgeColor}`}>
                        {tool.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Image Tools Section */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-1 pb-1.5 border-b border-[#F5F4EE]">
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
                    Image Tools Suite
                  </span>
                  <Link href="/image" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-semibold text-[#6E6D68] hover:text-[#111111]">
                    Image Hub →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-0.5">
                  {IMAGE_TOOLS.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8F8F6] transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-7 w-7 rounded-[8px] flex items-center justify-center shrink-0 border ${tool.iconBg}`}>
                          {tool.icon}
                        </div>
                        <p className="font-semibold text-[12px] text-[#111111] truncate">{tool.name}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${tool.badgeColor}`}>
                        {tool.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#F5F4EE] flex items-center gap-2">
                <Link
                  href="/pdf"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] text-[#111111] font-semibold text-[12px] text-center hover:bg-[#F5F4EE] transition-colors"
                >
                  PDF Suite
                </Link>
                <Link
                  href="/image"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] text-[#111111] font-semibold text-[12px] text-center hover:bg-[#F5F4EE] transition-colors"
                >
                  Image Suite
                </Link>
                <a
                  href="https://github.com/imvicky69/infyn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE] transition-colors"
                  aria-label="GitHub"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
