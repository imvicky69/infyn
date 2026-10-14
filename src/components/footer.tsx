import * as React from "react";
import Link from "next/link";
import Image from "next/image";

const IMAGE_TOOLS = [
  { href: "/image/compressor", label: "Image Compressor" },
  { href: "/image/bg-remover", label: "Background Remover" },
  { href: "/image/converter", label: "Universal Converter" },
  { href: "/image/qr-code", label: "QR Code Generator" },
  { href: "/image/png-to-svg", label: "PNG to SVG" },
  { href: "/image/resizer", label: "Image Resizer" },
];

const PDF_TOOLS = [
  { href: "/pdf/compressor", label: "PDF Compressor" },
  { href: "/pdf/merger", label: "PDF Merger" },
  { href: "/pdf/splitter", label: "PDF Splitter" },
  { href: "/pdf/pdf-to-image", label: "PDF to Image" },
  { href: "/pdf/protector", label: "PDF Protector" },
  { href: "/pdf/unlocker", label: "PDF Unlocker" },
];

const SOCIAL_AND_APPS = [
  { href: "/instagram/reel-downloader", label: "Instagram Reel Downloader" },
  { href: "/instagram/profile-downloader", label: "Profile Picture Downloader" },
  { href: "/dl", label: "Infyn DL (Media Downloader)" },
  { href: "/home-tab", label: "Infyn Home Tab (Extension)" },
  { href: "https://wallpaper.xweet.in", label: "Xweet Wallpapers ↗", external: true },
  { href: "/movies", label: "Movies & Series (1080p)" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-[#0C0C0E] transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 sm:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <Image
                src="/logo-clear.png"
                alt="Infyn"
                width={24}
                height={24}
                style={{ width: "auto", height: "24px" }}
                className="object-contain group-hover:scale-105 transition-transform"
              />
              <span className="font-extrabold text-[#111111] dark:text-white text-lg tracking-tight">
                infyn
              </span>
            </Link>

            <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-relaxed max-w-sm tracking-[-0.005em]">
              Fast, private in-browser utilities and standalone tools. Every file stays on your device — zero server uploads, no accounts, 100% free.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                100% In-Browser & Private
              </span>
              <a
                href="https://xweet.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800/80 border border-[#EAEAE5] dark:border-zinc-700 text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white text-[11px] font-semibold transition-colors"
              >
                <span>A Xweet Product</span>
                <span className="text-[10px] opacity-70">↗</span>
              </a>
            </div>
          </div>

          {/* Image Tools */}
          <div className="space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-white">
              Image Tools
            </h3>
            <nav className="flex flex-col space-y-2">
              {IMAGE_TOOLS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* PDF Tools */}
          <div className="space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-white">
              PDF Tools
            </h3>
            <nav className="flex flex-col space-y-2">
              {PDF_TOOLS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social & Apps */}
          <div className="space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-white">
              Social & Apps
            </h3>
            <nav className="flex flex-col space-y-2">
              {SOCIAL_AND_APPS.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>

        {/* Bottom bar with Watermark */}
        <div className="mt-12 pt-6 border-t border-[#EAEAE5] dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9E9D98] dark:text-zinc-500">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Infyn · All operations run locally.</p>
            <span className="hidden sm:inline text-[#BEBDB9] dark:text-zinc-700">·</span>
            <a
              href="https://xweet.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#111111] dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <span>A Xweet Product</span>
              <span className="text-[11px] text-[#9E9D98] dark:text-zinc-500 font-normal">(xweet.in)</span>
              <span className="text-[10px]">↗</span>
            </a>
          </div>
          <p className="flex items-center gap-2 font-medium">
            <span>No tracking</span>
            <span>·</span>
            <span>No cookies</span>
            <span>·</span>
            <span>Zero cloud uploads</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
