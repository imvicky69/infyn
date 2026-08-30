"use client";

import React from "react";
import Image from "next/image";
import { ResizedFileResult } from "./resize-engine";
import { formatBytes } from "@/components/image-tools/utils";
import { ContinuePipelineBar } from "@/components/image-tools/continue-pipeline-bar";

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;

  let safeName = filename || "image.jpg";
  if (!/\.(jpg|jpeg|png|webp|avif|gif|zip)$/i.test(safeName)) {
    const ext =
      blob.type === "image/png"
        ? ".png"
        : blob.type === "image/webp"
        ? ".webp"
        : blob.type === "application/zip"
        ? ".zip"
        : ".jpg";
    safeName = `${safeName}${ext}`;
  }

  a.download = safeName;
  a.setAttribute("download", safeName);
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1500);
}

interface ResizerItemCardProps {
  item: ResizedFileResult;
  onRemove: (id: string) => void;
  onContinue?: (item: ResizedFileResult, target: "compress" | "bg-remover" | "convert") => void;
}

export function ResizerItemCard({
  item,
  onRemove,
}: ResizerItemCardProps) {
  const handleDownload = () => {
    triggerDownload(item.resizedBlob, item.name);
  };

  return (
    <div className="rounded-2xl border border-[#EAEAE5] bg-white p-4 sm:p-5 shadow-2xs hover:border-[#BEBDB9] transition-all space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Thumbnail & Details */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden bg-[#F5F4EE] border border-[#EAEAE5]">
            <Image
              src={item.resizedUrl}
              alt={item.name}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="space-y-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold text-[#111111] truncate max-w-xs sm:max-w-md">
              {item.name}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="text-[#6E6D68]">
                <span className="font-semibold text-[#111111]">{item.originalWidth}×{item.originalHeight}</span>
                {" → "}
                <span className="font-bold text-emerald-700">{item.resizedWidth}×{item.resizedHeight} px</span>
              </span>

              <span className="text-[#9E9D98]">•</span>

              <span className="text-[#6E6D68]">
                {formatBytes(item.originalSize)} → <span className="font-semibold text-[#111111]">{formatBytes(item.resizedSize)}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ✓ Resized
              </span>
              <span className="text-[10px] font-medium text-[#9E9D98] uppercase">
                {item.mimeType.replace("image/", "")}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#111111] px-4 py-2 text-xs font-bold text-white hover:bg-[#262626] active:scale-95 transition-all shadow-2xs cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>Download</span>
          </button>

          <button
            onClick={() => onRemove(item.id)}
            title="Remove item"
            className="rounded-xl border border-[#EAEAE5] p-2 text-[#9E9D98] hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cross-Tool Pipeline Bar */}
      <div className="pt-2 border-t border-[#F5F4EE]">
        <ContinuePipelineBar
          currentTool="resizer"
          variant="inline"
          getImageBlob={() => item.resizedBlob}
          imageName={item.name}
        />
      </div>
    </div>
  );
}
