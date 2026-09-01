"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// A mapping of raw path segments to human-readable labels
const PATH_LABELS: Record<string, string> = {
  pdf: "PDF Tools",
  image: "Image Tools",
  dev: "Developer Tools",
  merger: "PDF Merger",
  unlocker: "PDF Unlocker",
  protector: "PDF Protector",
  "pdf-to-image": "PDF to Image",
  "img-to-pdf": "Image to PDF",
  compressor: "Image Compressor",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  
  if (!pathname || pathname === "/") return null;

  // Remove trailing slashes and split into segments
  const segments = pathname.replace(/\/$/, "").split("/").filter(Boolean);

  // If we are just on a hub page (e.g. /pdf), maybe don't show it or just show Home > PDF Tools
  // Usually breadcrumbs are best on the leaf nodes (tools)
  
  let currentPath = "";

  return (
    <nav aria-label="Breadcrumb" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <ol className="flex items-center space-x-2 text-sm text-[#9E9D98]">
        <li>
          <Link href="/" className="hover:text-[#111111] transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {segments.map((segment, index) => {
          currentPath += `/${segment}`;
          const isLast = index === segments.length - 1;
          const label = PATH_LABELS[segment] || segment.replace(/-/g, " ");

          return (
            <li key={currentPath} className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-[#EAEAE5]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {isLast ? (
                <span className="font-semibold text-[#111111] capitalize" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link href={currentPath} className="hover:text-[#111111] transition-colors capitalize">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
