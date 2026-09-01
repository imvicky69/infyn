"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eraser,
  Minimize2,
  Maximize2,
  ArrowLeftRight,
  FileImage,
  ShieldCheck,
  FileOutput,
  Images,
  Lock,
  Combine,
  Unlock,
  Scissors,
  BookOpen,
  QrCode,
} from "lucide-react";

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

interface NavTool {
  name: string;
  href: string;
  desc: string;
  icon: React.ReactNode;
  badge?: string;
}

const IMAGE_TOOLS: NavTool[] = [
  {
    name: "QR Code Generator",
    href: "/image/qr-code",
    badge: "Vector",
    desc: "Custom shapes, logos & frames",
    icon: <QrCode className="h-4 w-4" />,
  },
  {
    name: "Background Remover",
    href: "/image/bg-remover",
    badge: "AI",
    desc: "Instant transparent cutouts",
    icon: <Eraser className="h-4 w-4" />,
  },

  {
    name: "Image Compressor",
    href: "/image/compressor",
    badge: "Batch",
    desc: "Lossless & quality control",
    icon: <Minimize2 className="h-4 w-4" />,
  },
  {
    name: "Image Resizer",
    href: "/image/resizer",
    desc: "Framing & social aspect ratios",
    icon: <Maximize2 className="h-4 w-4" />,
  },
  {
    name: "Universal Converter",
    href: "/image/converter",
    badge: "Batch",
    desc: "JPG · PNG · WEBP · AVIF · HEIC",
    icon: <ArrowLeftRight className="h-4 w-4" />,
  },
  {
    name: "HEIC to JPG",
    href: "/image/heic-to-jpg",
    desc: "Batch iPhone photo conversion",
    icon: <FileImage className="h-4 w-4" />,
  },
  {
    name: "Metadata Remover",
    href: "/image/exif-remover",
    badge: "Privacy",
    desc: "Strip GPS, camera & timestamps",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
];

const PDF_TOOLS_NAV: NavTool[] = [
  {
    name: "PDF Compressor",
    href: "/pdf/compressor",
    badge: "Batch",
    desc: "Shrink PDF file size up to 90%",
    icon: <Minimize2 className="h-4 w-4" />,
  },
  {
    name: "Image to PDF",
    href: "/image/img-to-pdf",
    desc: "Convert photos to PDF with page reorder",
    icon: <FileOutput className="h-4 w-4" />,
  },
  {
    name: "PDF to Image",
    href: "/pdf/pdf-to-image",
    desc: "Extract pages to HD JPG, PNG, WEBP",
    icon: <Images className="h-4 w-4" />,
  },
  {
    name: "PDF Protector",
    href: "/pdf/protector",
    badge: "New",
    desc: "Secure PDFs with an AES-256 password",
    icon: <Lock className="h-4 w-4" />,
  },
  {
    name: "PDF Merger",
    href: "/pdf/merger",
    badge: "New",
    desc: "Combine multiple PDFs into a single file",
    icon: <Combine className="h-4 w-4" />,
  },
  {
    name: "PDF Unlocker",
    href: "/pdf/unlocker",
    badge: "New",
    desc: "Remove passwords from your PDFs",
    icon: <Unlock className="h-4 w-4" />,
  },
  {
    name: "PDF Splitter",
    href: "/pdf/splitter",
    badge: "New",
    desc: "Extract or split pages from a PDF",
    icon: <Scissors className="h-4 w-4" />,
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
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
              <span className="font-bold text-[#111111] text-lg tracking-tight">
                infyn
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
              <Link
                href="/image"
                onClick={() => setImageDropdownOpen(false)}
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
              </Link>

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
                      <Link
                        href="/image"
                        onClick={() => setImageDropdownOpen(false)}
                        className="text-[11px] font-bold text-[#111111] hover:underline"
                      >
                        View All →
                      </Link>
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
                            <div className="h-8 w-8 rounded-lg bg-[#FBFBFA] border border-[#EAEAE5] flex items-center justify-center text-[#111111] shrink-0">
                              {tool.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-[13px] text-[#111111] truncate tracking-[-0.01em]">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5F4EE] text-[#6E6D68] border border-[#EAEAE5] shrink-0">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#9E9D98] truncate mt-0.5">{tool.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
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
              <Link
                href="/pdf"
                onClick={() => setPdfDropdownOpen(false)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer tracking-[-0.01em] ${
                  pdfDropdownOpen || pathname.startsWith("/pdf")
                    ? "bg-[#F0EFEA] text-[#111111]"
                    : "text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE]"
                }`}
              >
                <span>PDF Tools</span>
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
              </Link>

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
                      <Link
                        href="/pdf"
                        onClick={() => setPdfDropdownOpen(false)}
                        className="text-[11px] font-bold text-[#111111] hover:underline"
                      >
                        View All →
                      </Link>
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
                            <div className="h-8 w-8 rounded-lg bg-[#FBFBFA] border border-[#EAEAE5] flex items-center justify-center text-[#111111] shrink-0">
                              {tool.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-[13px] text-[#111111] truncate tracking-[-0.01em]">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5F4EE] text-[#6E6D68] border border-[#EAEAE5] shrink-0">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#9E9D98] truncate mt-0.5">{tool.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* QR Code dedicated button */}
            <Link
              href="/image/qr-code"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all tracking-[-0.01em] ${
                pathname === "/image/qr-code"
                  ? "bg-[#F0EFEA] text-[#111111]"
                  : "text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE]"
              }`}
            >
              <QrCode className="h-3.5 w-3.5 text-[#9E9D98]" />
              <span>QR Code</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                New
              </span>
            </Link>

            {/* Docs & SDK */}
            <Link
              href="/docs"

              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all tracking-[-0.01em] ${
                pathname.startsWith("/docs")
                  ? "bg-[#F0EFEA] text-[#111111]"
                  : "text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE]"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-[#9E9D98]" />
              <span>Docs</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                SDK
              </span>
            </Link>

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
          </nav>

          {/* Mobile right controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Removed the active tool pill to keep it completely minimal on mobile */}
            
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
                  variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}
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
              {/* Featured QR Code Banner on Mobile */}
              <Link
                href="/image/qr-code"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-2xs">
                    <QrCode className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[13px] text-[#111111]">QR Code Generator</p>
                    <p className="text-[11px] text-[#6E6D68]">Design custom codes with logos & Wi-Fi</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-indigo-700 border border-indigo-200 shrink-0">
                  New
                </span>
              </Link>
              {/* PDF Tools Section */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-1 pb-1.5 border-b border-[#F5F4EE]">
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
                    PDF Utilities
                  </span>
                  <Link
                    href="/pdf"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-bold text-[#111111] hover:underline"
                  >
                    View All PDF Tools →
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
                        <div className="h-8 w-8 rounded-[10px] flex items-center justify-center shrink-0 border bg-[#FBFBFA] border-[#EAEAE5] text-[#111111]">
                          {tool.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[13px] text-[#111111] truncate">{tool.name}</p>
                          <p className="text-[10px] text-[#9E9D98] truncate">{tool.desc}</p>
                        </div>
                      </div>
                      {tool.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5F4EE] text-[#6E6D68] border border-[#EAEAE5] shrink-0 ml-2">
                          {tool.badge}
                        </span>
                      )}
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
                  <Link
                    href="/image"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-bold text-[#111111] hover:underline"
                  >
                    View All Image Tools →
                  </Link>
                </div>


                <div className="grid grid-cols-1 gap-0.5">
                  {IMAGE_TOOLS.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8F8F6] transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-[10px] flex items-center justify-center shrink-0 border bg-[#FBFBFA] border-[#EAEAE5] text-[#111111]">
                          {tool.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[13px] text-[#111111] truncate">{tool.name}</p>
                          <p className="text-[10px] text-[#9E9D98] truncate">{tool.desc}</p>
                        </div>
                      </div>
                      {tool.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5F4EE] text-[#6E6D68] border border-[#EAEAE5] shrink-0 ml-2">
                          {tool.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#F5F4EE] flex items-center justify-between gap-3">
                <Link
                  href="/docs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] text-xs font-bold text-[#111111] hover:bg-[#F5F4EE] transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-[#6E6D68]" />
                  <span>Developer Docs & SDK</span>
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
