"use client";

import React, { useState } from "react";
import JSZip from "jszip";
import { CompressedFileResult } from "./compression-engine";
import { formatBytes } from "../utils";

interface BatchSummaryBarProps {
  items: CompressedFileResult[];
  onClearAll: () => void;
  onAddMore: () => void;
}

export function BatchSummaryBar({
  items,
  onClearAll,
  onAddMore,
}: BatchSummaryBarProps) {
  const [isZipping, setIsZipping] = useState(false);

  const totalOriginalSize = items.reduce((acc, i) => acc + i.originalSize, 0);
  const totalCompressedSize = items.reduce((acc, i) => acc + i.compressedSize, 0);
  const totalSaved = Math.max(0, totalOriginalSize - totalCompressedSize);
  const totalSavingsPercentage =
    totalOriginalSize > 0 ? Math.round((totalSaved / totalOriginalSize) * 100) : 0;

  const handleDownloadAllZip = async () => {
    if (items.length === 0) return;
    setIsZipping(true);

    try {
      if (items.length === 1) {
        const item = items[0];
        const a = document.createElement("a");
        a.href = item.compressedUrl;
        a.download = item.outputFileName;
        a.click();
        setIsZipping(false);
        return;
      }

      const zip = new JSZip();

      items.forEach((item) => {
        zip.file(item.outputFileName, item.compressedBlob);
      });

      const content = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `infyn-compressed-images-${items.length}.zip`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("ZIP packaging failed:", err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#111111] bg-[#111111] text-white p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-md">
      
      {/* Metrics */}
      <div className="space-y-1 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className="text-sm font-bold text-white">
            {items.length} {items.length === 1 ? "Image" : "Images"} Ready
          </span>
          {totalSavingsPercentage > 0 ? (
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {totalSavingsPercentage}% Reduced ({formatBytes(totalSaved)} Saved)
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/20">
              Optimal / High-Fidelity
            </span>
          )}
        </div>
        <p className="text-xs text-white/70">
          Original: {formatBytes(totalOriginalSize)} → Compressed:{" "}
          <span className="font-bold text-white">{formatBytes(totalCompressedSize)}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full md:w-auto">
        <button
          type="button"
          onClick={onAddMore}
          className="h-10 px-4 rounded-xl border border-white/20 bg-white/10 text-xs font-semibold text-white hover:bg-white/20 active:scale-95 transition-all inline-flex items-center gap-1.5"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add More</span>
        </button>

        <button
          type="button"
          onClick={onClearAll}
          className="h-10 px-3 rounded-xl border border-white/20 bg-white/5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          title="Clear all images"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={handleDownloadAllZip}
          disabled={isZipping}
          className="h-10 px-5 rounded-xl bg-white text-[#111111] text-xs font-bold hover:bg-[#F5F4EE] active:scale-95 disabled:opacity-50 transition-all inline-flex items-center gap-2 shadow-sm"
        >
          {isZipping ? (
            <span>Creating ZIP…</span>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{items.length === 1 ? "Download Image" : "Download All (ZIP)"}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
