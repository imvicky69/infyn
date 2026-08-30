import * as React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[#EAEAE5] bg-white py-12 text-xs text-[#6E6D68]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#F5F4EE]">
          <div className="space-y-1">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo-clear.png"
                alt="Infyn by Indivio"
                width={22}
                height={22}
                className="h-5 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-sm text-[#111111] tracking-tight">infyn</span>
                <span className="text-[10px] font-semibold text-[#9E9D98]">by indivio</span>
              </div>
            </Link>
            <p className="text-[11px] text-[#9E9D98]">
              100% Free, Ad-Free & Private In-Browser Utilities by Indivio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-[#111111]">
            <Link href="/image/bg-remover" className="hover:text-[#6E6D68] transition-colors">
              Background Remover
            </Link>
            <Link href="/image/compressor" className="hover:text-[#6E6D68] transition-colors">
              Image Compressor
            </Link>
            <Link href="/image/resizer" className="hover:text-[#6E6D68] transition-colors">
              Image Resizer
            </Link>
            <Link href="/image/converter" className="hover:text-[#6E6D68] transition-colors">
              Image Converter
            </Link>
            <Link href="/image/heic-to-jpg" className="hover:text-[#6E6D68] transition-colors">
              HEIC to JPG
            </Link>
            <Link href="/image" className="hover:text-[#6E6D68] transition-colors">
              Image Suite
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#9E9D98]">
          <span>© {new Date().getFullYear()} Infyn by Indivio. All operations run locally on your device.</span>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Zero Data Collection
            </span>
            <a
              href="https://github.com/imvicky69/infyn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#111111] hover:underline font-semibold"
            >
              GitHub Open Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
