"use client";

import React, { useState } from "react";
import { CompressedFileResult } from "./compression-engine";
import { formatBytes } from "../utils";

interface CompareModalProps {
  item: CompressedFileResult | null;
  onClose: () => void;
}

export function CompareModal({ item, onClose }: CompareModalProps) {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      style={{ animation: "fade-in-up 0.2s ease-out" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-[#FBFBFA] border border-[#EAEAE5] p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEAE5]">
          <div>
            <h3 className="text-base font-bold text-[#111111]">{item.originalName}</h3>
            <p className="text-xs text-[#6E6D68]">
              {formatBytes(item.originalSize)} ({item.originalWidth}×{item.originalHeight}) →{" "}
              <span className="font-bold text-[#111111]">
                {formatBytes(item.compressedSize)} ({item.compressedWidth}×{item.compressedHeight})
              </span>{" "}
              • <span className="text-emerald-600 font-bold">{item.savingsPercentage}% Smaller</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-xl border border-[#EAEAE5] bg-white text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE] flex items-center justify-center transition-all"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Interactive Split Compare Box */}
        <div className="relative rounded-2xl overflow-hidden border border-[#EAEAE5] bg-[#F5F5F0] h-[360px] sm:h-[420px] select-none">
          {/* Compressed Image (Right side / Full background) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.compressedUrl}
            alt="Compressed"
            className="absolute inset-0 w-full h-full object-contain p-2"
          />

          {/* Original Image (Left side / Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.originalUrl}
              alt="Original"
              className="absolute inset-0 w-full h-full object-contain p-2"
              style={{ minWidth: "100%", maxWidth: "none" }}
            />
          </div>

          {/* Vertical Split Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md flex items-center justify-center pointer-events-none z-20"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="h-8 w-8 rounded-full bg-white shadow-lg border border-[#EAEAE5] flex items-center justify-center text-[#111111]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>

          {/* Slider input overlaid */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(parseFloat(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold pointer-events-none z-10">
            Original ({formatBytes(item.originalSize)})
          </div>
          <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-emerald-600/80 backdrop-blur-md text-white text-[10px] font-bold pointer-events-none z-10">
            Compressed ({formatBytes(item.compressedSize)})
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-[#9E9D98]">Drag the slider left/right to inspect quality</p>
          <button
            type="button"
            onClick={() => {
              const a = document.createElement("a");
              a.href = item.compressedUrl;
              a.download = item.outputFileName;
              a.click();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#111111] px-4 py-2 text-xs font-semibold text-white hover:bg-[#262626] active:scale-95 transition-all shadow-xs"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Compressed</span>
          </button>
        </div>
      </div>
    </div>
  );
}
