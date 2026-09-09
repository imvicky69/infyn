import * as React from "react";
import Link from "next/link";
import Image from "next/image";

const IMAGE_LINKS = [
  { href: "/image/png-to-svg", label: "PNG to SVG Converter" },
  { href: "/image/qr-code", label: "QR Code Generator" },
  { href: "/image/bg-remover", label: "Background Remover" },
  { href: "/image/compressor", label: "Image Compressor" },
  { href: "/image/resizer", label: "Image Resizer" },
  { href: "/image/converter", label: "Universal Converter" },
  { href: "/image/heic-to-jpg", label: "HEIC to JPG" },
  { href: "/image/exif-remover", label: "Metadata Remover" },
];

const PDF_LINKS = [
  { href: "/pdf/merger", label: "PDF Merger" },
  { href: "/pdf/splitter", label: "PDF Splitter" },
  { href: "/pdf/protector", label: "PDF Protector" },
  { href: "/pdf/unlocker", label: "PDF Unlocker" },
  { href: "/pdf/pdf-to-image", label: "PDF to Image" },
  { href: "/image/img-to-pdf", label: "Image to PDF" },
];

const APPS_LINKS = [
  { href: "/apps", label: "Apps Hub", external: false },
  { href: "/dl", label: "Infyn DL (App)", external: false },
  { href: "/home-tab", label: "Infyn Home Tab (Extension)", external: false },
  { href: "https://github.com/imvicky69/infyn-dl", label: "Infyn DL GitHub ↗", external: true },
  { href: "https://github.com/imvicky69/infyn-home-tab", label: "Home Tab GitHub ↗", external: true },
];

const DEV_LINKS = [
  { href: "/dev/base64", label: "Base64 & Data URI", external: false },
  { href: "/dev/svg-cleaner", label: "SVG Cleaner & Minifier", external: false },
  { href: "/dev", label: "Developer Tools Hub", external: false },
  { href: "/docs", label: "Documentation & SDK", external: false },
  { href: "/contributing", label: "Contributing Guide", external: false },
  { href: "/sponsor", label: "💖 Support Infyn", external: false },
  { href: "https://www.npmjs.com/package/infyn", label: "NPM Package ↗", external: true },
  { href: "https://github.com/imvicky69/infyn", label: "GitHub Suite ↗", external: true },
  { href: "https://github.com/imvicky69/infyn/issues", label: "Suggest a Tool ↗", external: true },
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
    label: "Free forever",
    color: "bg-amber-50 border-amber-200/80 text-amber-800",
    dot: "bg-amber-500",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 md:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <Image
                src="/logo-clear.png"
                alt="Infyn"
                width={22}
                height={22}
                style={{ width: "auto", height: "22px" }}
                className="object-contain group-hover:scale-105 transition-transform"
              />
              <span className="font-bold text-[#111111] dark:text-white text-lg tracking-tight">
                infyn
              </span>
            </Link>

            <p className="text-[13px] text-[#6E6D68] dark:text-zinc-400 leading-[1.7] max-w-[280px] tracking-[-0.005em]">
              Free, ad-free in-browser utilities and standalone tools that never upload your files. Built for speed and privacy.
            </p>

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
          </div>

          {/* Image Tools column */}
          <div className="col-span-1 sm:col-span-1 md:col-span-2 space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Image
            </h3>
            <nav className="flex flex-col gap-2">
              {IMAGE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition-colors tracking-[-0.005em] leading-snug"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* PDF Tools column */}
          <div className="col-span-1 sm:col-span-1 md:col-span-2 space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              PDF
            </h3>
            <nav className="flex flex-col gap-2">
              {PDF_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition-colors tracking-[-0.005em] leading-snug"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Apps & Extensions column */}
          <div className="col-span-1 sm:col-span-1 md:col-span-2 space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Apps
            </h3>
            <nav className="flex flex-col gap-2">
              {APPS_LINKS.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-medium text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition-colors tracking-[-0.005em] leading-snug"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] font-medium text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition-colors tracking-[-0.005em] leading-snug"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Developer / Open Source column */}
          <div className="col-span-1 sm:col-span-1 md:col-span-2 space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98] dark:text-zinc-500">
              Open Source
            </h3>
            <nav className="flex flex-col gap-2">
              {DEV_LINKS.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-medium text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition-colors tracking-[-0.005em] leading-snug"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] font-medium text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition-colors tracking-[-0.005em] leading-snug"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#EAEAE5] dark:border-zinc-800 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#9E9D98] dark:text-zinc-500 tracking-[-0.005em]">
            © {new Date().getFullYear()} Infyn · All operations run locally in your browser.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#9E9D98] dark:text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Zero data collection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
