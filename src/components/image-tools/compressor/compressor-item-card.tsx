"use client";

import React, { useState } from "react";
import { CompressedFileResult } from "./compression-engine";
import { formatBytes } from "../utils";
import { ContinuePipelineBar } from "../continue-pipeline-bar";

interface CompressorItemCardProps {
  item: CompressedFileResult;
  onRemove: (id: string) => void;
  onCompare: (item: CompressedFileResult) => void;
}

export function CompressorItemCard({
  item,
  onRemove,
  onCompare,
}: CompressorItemCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    const a = document.createElement("a");
    a.href = item.compressedUrl;
    a.download = item.outputFileName;
    a.click();
    setTimeout(() => setIsDownloading(false), 400);
  };

  return (
    <div className="rounded-2xl border border-[#EAEAE5] bg-white p-4 sm:p-5 flex flex-col gap-3 shadow-xs transition-all hover:border-[#BEBDB9]">
      
      {/* Top Row: Thumbnail + Info + Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Thumbnail + Name */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div
            onClick={() => onCompare(item)}
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#EAEAE5] bg-[#F8F8F6] shrink-0 cursor-pointer group shadow-2xs"
            title="Click to compare before/after"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.compressedUrl || item.originalUrl}
              alt={item.originalName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-[#111111] truncate max-w-[220px] sm:max-w-xs" title={item.originalName}>
                {item.originalName}
              </p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#F5F4EE] border border-[#EAEAE5] text-[#6E6D68] uppercase">
                {item.compressedFormat}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6D68]">
              <span className="line-through text-[#9E9D98]">{formatBytes(item.originalSize)}</span>
              <span className="text-[#111111]">→</span>
              <span className="font-bold text-[#111111]">{formatBytes(item.compressedSize)}</span>
              <span className="text-[#DDDDD8]">·</span>
              <span className="text-[11px] text-[#9E9D98]">
                {item.compressedWidth} × {item.compressedHeight} px
              </span>
            </div>
          </div>
        </div>

        {/* Savings badge + Actions */}
        <div className="flex items-center gap-3 self-end sm:self-center shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EAEAE5]">
          
          {/* Savings Pill */}
          {item.isLargerThanOriginal ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800" title="This image is already highly compressed in its original format. Try WebP or lower quality.">
              <span>⚡ Optimal</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700">
              <span>↓</span>
              <span>{item.savingsPercentage}% Saved</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Compare Button */}
            <button
              type="button"
              onClick={() => onCompare(item)}
              className="h-8 px-2.5 rounded-xl border border-[#EAEAE5] bg-white text-xs font-semibold text-[#111111] hover:bg-[#F5F4EE] active:scale-95 transition-all inline-flex items-center gap-1 cursor-pointer"
              title="Inspect Before / After"
            >
              <svg className="h-3.5 w-3.5 text-[#6E6D68]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="hidden sm:inline">Compare</span>
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="h-8 px-3 rounded-xl bg-[#111111] text-xs font-semibold text-white hover:bg-[#262626] active:scale-95 disabled:opacity-50 transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download</span>
            </button>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="h-8 w-8 rounded-xl border border-transparent hover:border-[#EAEAE5] hover:bg-[#F8F8F6] text-[#9E9D98] hover:text-red-600 transition-all flex items-center justify-center cursor-pointer"
              title="Remove item"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Pipeline Continuation Strip */}
      <div className="pt-2 border-t border-[#F5F4EE]">
        <ContinuePipelineBar
          currentTool="compressor"
          variant="inline"
          getImageBlob={() => item.compressedBlob}
          imageName={item.outputFileName}
        />
      </div>

    </div>
  );
}
