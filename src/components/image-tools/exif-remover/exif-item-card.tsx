"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CleanedImageResult } from "./exif-engine";
import { formatBytes } from "@/components/image-tools/utils";
import { ContinuePipelineBar } from "@/components/image-tools/continue-pipeline-bar";

interface ExifItemCardProps {
  item: CleanedImageResult;
  onRemove: (id: string) => void;
}

export function ExifItemCard({ item, onRemove }: ExifItemCardProps) {
  const [showAllTags, setShowAllTags] = useState(false);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = item.cleanedUrl;
    a.download = item.outputFileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 1000);
  };

  const { metadata } = item;
  const hasDetectedMetadata =
    metadata.hasMetadata ||
    metadata.gps.hasGps ||
    Boolean(metadata.camera.make || metadata.camera.model) ||
    Boolean(metadata.time.dateTimeOriginal || metadata.time.dateTime);

  return (
    <div className="rounded-2xl border border-[#EAEAE5] bg-white p-4 sm:p-5 shadow-2xs hover:border-[#BEBDB9] transition-all space-y-4">
      
      {/* Top Row: Thumbnail + Summary Details + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left: Thumbnail & Main Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden bg-[#F5F4EE] border border-[#EAEAE5]">
            <Image
              src={item.cleanedUrl}
              alt={item.outputFileName}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs sm:text-sm font-bold text-[#111111] truncate max-w-xs sm:max-w-md" title={item.originalName}>
                {item.originalName}
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase shrink-0">
                100% Sanitized
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6E6D68]">
              <span>{item.width > 0 ? `${item.width} × ${item.height} px` : "High Res"}</span>
              <span className="text-[#9E9D98]">•</span>
              <span>{formatBytes(item.originalSize)} → <strong className="text-[#111111]">{formatBytes(item.cleanedSize)}</strong></span>
              {item.savedBytes > 0 && (
                <>
                  <span className="text-[#9E9D98]">•</span>
                  <span className="text-emerald-700 font-semibold">-{formatBytes(item.savedBytes)} metadata</span>
                </>
              )}
            </div>

            {/* Quick Status Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {metadata.gps.hasGps && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span>GPS Location Stripped</span>
                </span>
              )}

              {(metadata.camera.make || metadata.camera.model) && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#6E6D68] bg-[#F5F4EE] px-2 py-0.5 rounded-md border border-[#EAEAE5]">
                  <svg className="h-3 w-3 text-[#9E9D98]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                  <span>{metadata.camera.make} {metadata.camera.model}</span>
                </span>
              )}

              {(metadata.time.dateTimeOriginal || metadata.time.dateTime) && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#6E6D68] bg-[#F5F4EE] px-2 py-0.5 rounded-md border border-[#EAEAE5]">
                  <svg className="h-3 w-3 text-[#9E9D98]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{metadata.time.dateTimeOriginal || metadata.time.dateTime}</span>
                </span>
              )}

              {!hasDetectedMetadata && (
                <span className="text-[10px] text-[#9E9D98] italic">
                  No tracking metadata found in source file
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {hasDetectedMetadata && (
            <button
              type="button"
              onClick={() => setShowAllTags((prev) => !prev)}
              className="h-8 px-2.5 rounded-xl border border-[#EAEAE5] bg-white text-xs font-semibold text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE] active:scale-95 transition-all inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{showAllTags ? "Hide Tags" : "Inspect Tags"}</span>
              <svg
                className={`h-3.5 w-3.5 text-[#9E9D98] transition-transform ${showAllTags ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="h-8 px-3.5 rounded-xl bg-[#111111] text-xs font-semibold text-white hover:bg-[#262626] active:scale-95 transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Save Cleaned</span>
          </button>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            title="Remove file"
            className="h-8 w-8 rounded-xl border border-transparent hover:border-[#EAEAE5] hover:bg-[#F8F8F6] text-[#9E9D98] hover:text-red-600 transition-all flex items-center justify-center cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>

      {/* Collapsible Detected Metadata Inspector */}
      {showAllTags && hasDetectedMetadata && (
        <div className="p-3.5 rounded-xl bg-[#FBFBFA] border border-[#EAEAE5] space-y-2.5 text-xs animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#EAEAE5]">
            <span className="font-bold text-[#111111] text-[11px] uppercase tracking-wider">
              Removed Metadata Tags
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">
              ✓ All Stripped from Export
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {metadata.gps.hasGps && (
              <div className="p-2 rounded-lg bg-rose-50/50 border border-rose-100 space-y-0.5">
                <span className="text-[10px] font-bold text-rose-800 uppercase block">📍 GPS Location</span>
                <p className="text-xs text-rose-900 font-mono">
                  {metadata.gps.latitude}, {metadata.gps.longitude}
                </p>
                {metadata.gps.altitude && (
                  <p className="text-[10px] text-rose-700">Altitude: {metadata.gps.altitude}m</p>
                )}
              </div>
            )}

            {(metadata.camera.make || metadata.camera.model) && (
              <div className="p-2 rounded-lg bg-white border border-[#EAEAE5] space-y-0.5">
                <span className="text-[10px] font-bold text-[#6E6D68] uppercase block">📷 Camera / Device</span>
                <p className="text-xs font-semibold text-[#111111]">{metadata.camera.make} {metadata.camera.model}</p>
                {metadata.camera.software && (
                  <p className="text-[10px] text-[#9E9D98]">OS/Software: {metadata.camera.software}</p>
                )}
              </div>
            )}

            {(metadata.camera.lensModel || metadata.exposure.focalLength || metadata.exposure.aperture) && (
              <div className="p-2 rounded-lg bg-white border border-[#EAEAE5] space-y-0.5">
                <span className="text-[10px] font-bold text-[#6E6D68] uppercase block">🔧 Lens & Exposure</span>
                <p className="text-xs font-semibold text-[#111111]">
                  {[metadata.exposure.focalLength, metadata.exposure.aperture, metadata.exposure.exposureTime, metadata.exposure.iso ? `ISO ${metadata.exposure.iso}` : null]
                    .filter(Boolean)
                    .join(" • ") || "Camera parameters"}
                </p>
                {metadata.camera.lensModel && (
                  <p className="text-[10px] text-[#9E9D98] truncate">{metadata.camera.lensModel}</p>
                )}
              </div>
            )}

            {Object.entries(metadata.rawTags)
              .filter(([k]) => !["GPS Coordinates", "Camera Make", "Camera Model", "Software"].includes(k))
              .map(([key, val]) => (
                <div key={key} className="p-2 rounded-lg bg-white border border-[#EAEAE5] space-y-0.5">
                  <span className="text-[10px] font-bold text-[#9E9D98] uppercase block truncate">{key}</span>
                  <p className="text-xs text-[#111111] truncate">{String(val)}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Bottom Cross-Tool Pipeline Bar */}
      <div className="pt-2 border-t border-[#F5F4EE]">
        <ContinuePipelineBar
          currentTool="exif-remover"
          variant="inline"
          getImageBlob={() => item.cleanedBlob}
          imageName={item.outputFileName}
        />
      </div>

    </div>
  );
}
