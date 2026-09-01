import * as React from "react";
import Link from "next/link";
import Image from "next/image";

const IMAGE_LINKS = [
  { href: "/image/bg-remover", label: "Background Remover" },
  { href: "/image/compressor", label: "Image Compressor" },
  { href: "/image/resizer", label: "Image Resizer" },
  { href: "/image/converter", label: "Universal Converter" },
  { href: "/image/heic-to-jpg", label: "HEIC to JPG" },
  { href: "/image/exif-remover", label: "Metadata Remover" },
];

const PDF_LINKS = [
  { href: "/image/img-to-pdf", label: "Image to PDF" },
  { href: "/pdf/pdf-to-image", label: "PDF to Image" },
];

const DEV_LINKS = [
  { href: "https://github.com/imvicky69/infyn/issues", label: "Suggest a Tool ↗", external: true },
  { href: "https://github.com/imvicky69/infyn", label: "GitHub Repository ↗", external: true },
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
    <footer className="border-t border-[#EAEAE5] bg-[#FBFBFA]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Brand column */}
          <div className="md:col-span-5 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <Image
                src="/logo-clear.png"
                alt="Infyn"
                width={22}
                height={22}
                style={{ width: "auto", height: "22px" }}
                className="object-contain group-hover:scale-105 transition-transform"
              />
              <span className="font-bold text-[#111111] text-lg tracking-tight">
                infyn
              </span>
            </Link>

            <p className="text-[13px] text-[#6E6D68] leading-[1.7] max-w-[280px] tracking-[-0.005em]">
              Free, ad-free in-browser utilities that never upload your files. Built for speed and privacy.
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
          <div className="md:col-span-3 space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
              Image
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
            </nav>
          </div>

          {/* PDF Tools column */}
          <div className="md:col-span-2 space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
              PDF
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

          {/* Developer / Open Source */}
          <div className="md:col-span-2 space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
              Open Source
            </h3>
            <nav className="flex flex-col gap-2">
              {DEV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-medium text-[#6E6D68] hover:text-[#111111] transition-colors tracking-[-0.005em] leading-snug"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#EAEAE5] py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#9E9D98] tracking-[-0.005em]">
            © {new Date().getFullYear()} Infyn · All operations run locally in your browser.
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
