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
  Download,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedLogo } from "@/components/animatedLogo";

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
  const [activeMobileTab, setActiveMobileTab] = useState<"all" | "image" | "pdf">("all");
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setImageDropdownOpen(false);
    setPdfDropdownOpen(false);
  }, [pathname]);

  // Sync category tab with current pathname
  useEffect(() => {
    if (pathname.startsWith("/pdf")) {
      setActiveMobileTab("pdf");
    } else if (pathname.startsWith("/image")) {
      setActiveMobileTab("image");
    } else {
      setActiveMobileTab("all");
    }
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const preventTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-mobile-drawer]")) {
        e.preventDefault();
      }
    };

    const preventWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-mobile-drawer]")) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventTouch, { passive: false });
    window.addEventListener("wheel", preventWheel, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventTouch);
      window.removeEventListener("wheel", preventWheel);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on desktop screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <header className={`${mobileMenuOpen ? "fixed" : "sticky"} top-0 left-0 right-0 z-50 w-full`}>
      {/* Main nav bar */}
      <div className="border-b border-[#EAEAE5]/70 dark:border-zinc-800/80 bg-[#FBFBFA]/90 dark:bg-[#0C0C0E]/90 backdrop-blur-2xl transition-colors">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}

          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="infyn home"
          >
            <div className="relative flex items-center justify-center">
              <AnimatedLogo
                variant="navbar"
                width={32}
                className="text-[#111111] dark:text-white group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[#111111] dark:text-white text-lg tracking-tight">
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

            {/* Infyn DL App dedicated button */}
            <Link
              href="/dl"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all tracking-[-0.01em] ${
                pathname.startsWith("/dl")
                  ? "bg-[#F0EFEA] text-[#111111] dark:bg-zinc-800 dark:text-white"
                  : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800/50"
              }`}
            >
              <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Infyn DL</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
                App
              </span>
            </Link>

            {/* Minimal Docs Link */}
            <Link
              href="/docs"
              className={`px-3 py-1.5 rounded-xl text-[13px] font-medium transition-colors ${
                pathname.startsWith("/docs")
                  ? "text-[#111111] dark:text-white font-semibold bg-[#F5F4EE] dark:bg-zinc-800/80"
                  : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800/50"
              }`}
            >
              Docs
            </Link>

            {/* Divider */}
            <div className="w-px h-4 bg-[#EAEAE5] dark:bg-zinc-800 mx-1" />

            {/* Theme toggle */}
            <ThemeToggle />

            {/* GitHub - Distinct button on docs page */}
            {pathname.startsWith("/docs") ? (
              <a
                href="https://github.com/imvicky69/infyn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.97] transition-all shadow-2xs"
                aria-label="GitHub Repository"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
            ) : (
              <a
                href="https://github.com/imvicky69/infyn"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-[#9E9D98] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            )}
          </nav>

          {/* Mobile right controls */}
          <div className="flex md:hidden items-center gap-1.5">
            <ThemeToggle />
            
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
                  className="block h-[1.5px] w-4 bg-current origin-center transition-all"
                />
                <motion.span
                  variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}
                  className="block h-[1.5px] w-4 bg-current transition-all"
                />
                <motion.span
                  variants={{ open: { rotate: -45, y: -5 }, closed: { rotate: 0, y: 0 } }}
                  className="block h-[1.5px] w-4 bg-current origin-center transition-all"
                />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop overlay for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-14 bg-black/25 dark:bg-black/50 backdrop-blur-xs md:hidden z-40"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile slide-down drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-drawer"
            data-mobile-drawer="true"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain custom-scrollbar border-b border-[#EAEAE5] dark:border-zinc-800 bg-white/98 dark:bg-[#141417]/98 backdrop-blur-2xl md:hidden shadow-xl"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="max-w-xl mx-auto px-4 py-3.5 space-y-4 pb-8">
              {/* Category Segmented Control */}
              <div className="flex items-center p-1 rounded-xl bg-[#F5F4EE] border border-[#EAEAE5] gap-1">
                <button
                  type="button"
                  onClick={() => setActiveMobileTab("all")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeMobileTab === "all"
                      ? "bg-white text-[#111111] shadow-2xs"
                      : "text-[#6E6D68] hover:text-[#111111]"
                  }`}
                >
                  All ({IMAGE_TOOLS.length + PDF_TOOLS_NAV.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMobileTab("image")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeMobileTab === "image"
                      ? "bg-white text-[#111111] shadow-2xs"
                      : "text-[#6E6D68] hover:text-[#111111]"
                  }`}
                >
                  Image ({IMAGE_TOOLS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMobileTab("pdf")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeMobileTab === "pdf"
                      ? "bg-white text-[#111111] shadow-2xs"
                      : "text-[#6E6D68] hover:text-[#111111]"
                  }`}
                >
                  PDF ({PDF_TOOLS_NAV.length})
                </button>
              </div>

              {/* Image Tools Section */}
              {(activeMobileTab === "all" || activeMobileTab === "image") && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1 pb-1 border-b border-[#F5F4EE]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
                      Image Suite
                    </span>
                    <Link
                      href="/image"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[11px] font-bold text-[#111111] hover:underline"
                    >
                      View All Image Tools →
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {IMAGE_TOOLS.map((tool) => {
                      const isActive = pathname === tool.href;
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`group flex flex-col justify-between p-2.5 rounded-xl border transition-all ${
                            isActive
                              ? "bg-[#F0EFEA] border-[#BEBDB9]"
                              : "bg-[#FBFBFA]/70 border-[#EAEAE5] hover:bg-white hover:border-[#BEBDB9] active:scale-[0.98]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="h-7 w-7 rounded-lg bg-white border border-[#EAEAE5] flex items-center justify-center text-[#111111] shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                              {tool.icon}
                            </div>
                            {tool.badge && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${
                                  tool.badge === "AI"
                                    ? "bg-purple-50 text-purple-700 border-purple-200/80"
                                    : tool.badge === "New"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                                    : tool.badge === "Batch"
                                    ? "bg-blue-50 text-blue-700 border-blue-200/80"
                                    : tool.badge === "Vector"
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200/80"
                                    : "bg-[#F5F4EE] text-[#6E6D68] border-[#EAEAE5]"
                                }`}
                              >
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[12px] text-[#111111] leading-tight truncate">
                              {tool.name}
                            </p>
                            <p className="text-[10px] text-[#9E9D98] leading-tight truncate mt-0.5">
                              {tool.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PDF Tools Section */}
              {(activeMobileTab === "all" || activeMobileTab === "pdf") && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1 pb-1 border-b border-[#F5F4EE]">
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

                  <div className="grid grid-cols-2 gap-2">
                    {PDF_TOOLS_NAV.map((tool) => {
                      const isActive = pathname === tool.href;
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`group flex flex-col justify-between p-2.5 rounded-xl border transition-all ${
                            isActive
                              ? "bg-[#F0EFEA] border-[#BEBDB9]"
                              : "bg-[#FBFBFA]/70 border-[#EAEAE5] hover:bg-white hover:border-[#BEBDB9] active:scale-[0.98]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="h-7 w-7 rounded-lg bg-white border border-[#EAEAE5] flex items-center justify-center text-[#111111] shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                              {tool.icon}
                            </div>
                            {tool.badge && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${
                                  tool.badge === "AI"
                                    ? "bg-purple-50 text-purple-700 border-purple-200/80"
                                    : tool.badge === "New"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                                    : tool.badge === "Batch"
                                    ? "bg-blue-50 text-blue-700 border-blue-200/80"
                                    : tool.badge === "Vector"
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200/80"
                                    : "bg-[#F5F4EE] text-[#6E6D68] border-[#EAEAE5]"
                                }`}
                              >
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[12px] text-[#111111] leading-tight truncate">
                              {tool.name}
                            </p>
                            <p className="text-[10px] text-[#9E9D98] leading-tight truncate mt-0.5">
                              {tool.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Infyn DL Mobile Spotlight */}
              <div className="pt-2 border-t border-[#F5F4EE] dark:border-zinc-800/80">
                <Link
                  href="/dl"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Download className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#111111] dark:text-white flex items-center gap-1.5">
                        <span>Infyn DL</span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-600 text-white">
                          NEW APP
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6E6D68] dark:text-zinc-400">
                        Media Downloader for Android & Windows
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    Get →
                  </span>
                </Link>
              </div>

              {/* Quick Links, 3-Mode Theme & GitHub Footer */}
              <div className="pt-2 border-t border-[#F5F4EE] dark:border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between gap-2 px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E9D98] dark:text-zinc-500">
                    Appearance
                  </span>
                  <ThemeToggle variant="segmented" />
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/docs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900 text-xs font-semibold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-2xs"
                  >
                    <span>Docs</span>
                  </Link>

                  <Link
                    href="/contributing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900 text-xs font-semibold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-2xs"
                  >
                    <span>Contribute</span>
                  </Link>

                  <a
                    href="https://github.com/imvicky69/infyn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900 text-[#6E6D68] dark:text-zinc-300 hover:text-[#111111] dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-2xs"
                    aria-label="GitHub"
                  >
                    <GithubIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
