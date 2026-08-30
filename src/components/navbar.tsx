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
    badge: "AI 1.4",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "Instant transparent cutouts",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "Image Compressor",
    href: "/image/compressor",
    badge: "90% Save",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    desc: "Lossless & quality control",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M4 10h6m0 0V4m0 6L3 3m17 7h-6m0 0V4m0 6l7-7" />
      </svg>
    ),
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    name: "Image Resizer & Crop",
    href: "/image/resizer",
    badge: "Presets",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    desc: "Framing & social aspect ratios",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    name: "Universal Converter",
    href: "/image/converter",
    badge: "5 Formats",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    desc: "JPG · PNG · WEBP · AVIF · HEIC",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    iconBg: "bg-purple-50 text-purple-600",
  },
  {
    name: "Apple HEIC to JPG",
    href: "/image/heic-to-jpg",
    badge: "WASM",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    desc: "Batch iPhone photo conversion",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
      </svg>
    ),
    iconBg: "bg-rose-50 text-rose-600",
  },
  {
    name: "EXIF & Metadata Remover",
    href: "/image/exif-remover",
    badge: "Privacy",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    desc: "Strip GPS, camera & timestamps",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: "bg-teal-50 text-teal-600",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 180);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EAEAE5]/80 bg-[#FBFBFA]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        
        {/* Left: Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-85 transition-opacity group"
          aria-label="infyn by indivio home"
        >
          <Image
            src="/logo-clear.png"
            alt="infyn by indivio"
            width={28}
            height={28}
            className="h-7 w-auto object-contain group-hover:scale-105 transition-transform"
            priority
          />
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg leading-none tracking-tight text-[#111111]">
              infyn
            </span>
            <span className="text-[9px] font-semibold text-[#9E9D98] tracking-wider -mb-0.5">
              by indivio
            </span>
          </div>
        </Link>

        {/* Center/Right Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1.5 text-xs">
          
          {/* Image Dropdown Trigger (Hover & Click) */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              className={`font-semibold px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                dropdownOpen || pathname.startsWith("/image")
                  ? "bg-[#F5F4EE] text-[#111111]"
                  : "text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE]"
              }`}
            >
              <span>Image Tools</span>
              <svg
                className={`h-3.5 w-3.5 text-[#9E9D98] transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180 text-[#111111]" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Desktop Dropdown Popover */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-1.5 w-80 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#EAEAE5] shadow-xl p-2 z-50 space-y-1"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9E9D98] border-b border-[#F5F4EE]">
                    In-Browser Image Suite
                  </div>

                  <div className="space-y-0.5 pt-1">
                    {IMAGE_TOOLS.map((tool) => {
                      const isActive = pathname === tool.href;
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setDropdownOpen(false)}
                          className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
                            isActive
                              ? "bg-[#F5F4EE] text-[#111111]"
                              : "hover:bg-[#F8F8F6] text-[#111111]"
                          }`}
                        >
                          <div
                            className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border border-[#EAEAE5]/60 ${tool.iconBg}`}
                          >
                            {tool.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs text-[#111111] truncate">
                                {tool.name}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${tool.badgeColor}`}
                              >
                                {tool.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#9E9D98] truncate">
                              {tool.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* All Tools Hub link at footer of dropdown */}
                  <div className="pt-1.5 border-t border-[#F5F4EE]">
                    <Link
                      href="/image"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE] transition-colors"
                    >
                      <span>Explore all tools</span>
                      <span>→</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* All Tools Hub Link */}
          <Link
            href="/image"
            className={`font-semibold px-3 py-1.5 rounded-xl transition-colors ${
              pathname === "/image"
                ? "bg-[#F5F4EE] text-[#111111]"
                : "text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE]"
            }`}
          >
            All Tools
          </Link>

          {/* GitHub Icon Link */}
          <a
            href="https://github.com/imvicky69/infyn"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl p-2 text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE] transition-colors"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="h-4 w-4" />
          </a>

          {/* Standout "Remove BG" Button on the Last */}
          <Link
            href="/image/bg-remover"
            className="ml-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-[#262626] active:scale-95 transition-all shadow-xs"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Remove BG</span>
            <svg
              className="h-3 w-3 text-white/70"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

        </div>

        {/* Mobile Right Controls: Remove BG mini button + Hamburger Menu */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/image/bg-remover"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#111111] text-white text-[11px] font-bold active:scale-95 transition-all shadow-xs"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Remove BG</span>
          </Link>

          {/* Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-xl border border-[#EAEAE5] bg-white text-[#111111] hover:bg-[#F5F4EE] active:scale-95 transition-all cursor-pointer"
          >
            {mobileMenuOpen ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Slide-Down Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-[#EAEAE5] bg-white/95 backdrop-blur-2xl md:hidden shadow-lg"
          >
            <div className="max-w-5xl mx-auto px-4 py-4 space-y-3">
              
              <div className="flex items-center justify-between px-1 pb-1 border-b border-[#F5F4EE]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
                  Image Tools Suite
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  100% In-Browser
                </span>
              </div>

              {/* Mobile Tool List */}
              <div className="grid grid-cols-1 gap-1">
                {IMAGE_TOOLS.map((tool) => {
                  const isActive = pathname === tool.href;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                        isActive
                          ? "bg-[#F5F4EE] text-[#111111]"
                          : "hover:bg-[#F8F8F6] text-[#111111] active:bg-[#F5F4EE]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border border-[#EAEAE5]/60 ${tool.iconBg}`}
                        >
                          {tool.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-[#111111] truncate">
                            {tool.name}
                          </p>
                          <p className="text-[10px] text-[#9E9D98] truncate">
                            {tool.desc}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${tool.badgeColor}`}
                      >
                        {tool.badge}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Action Rows */}
              <div className="pt-2 border-t border-[#F5F4EE] flex items-center gap-2">
                <Link
                  href="/image"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] text-[#111111] font-bold text-xs text-center hover:bg-[#F5F4EE] transition-colors"
                >
                  All Tools Hub
                </Link>
                <a
                  href="https://github.com/imvicky69/infyn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE] transition-colors"
                  aria-label="GitHub Repository"
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
