"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import JSZip from "jszip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { formatBytes } from "@/components/image-tools/utils";
import {
  HeicConvertSettings,
  ConvertedImageResult,
  convertSingleImage,
  OutputTargetFormat,
} from "@/components/image-tools/converter/heic-engine";
import { getPipelineImage } from "@/components/image-tools/pipeline-storage";
import { ContinuePipelineBar } from "@/components/image-tools/continue-pipeline-bar";
import SplitText from "@/components/SplitText";

const DEFAULT_SETTINGS: HeicConvertSettings = {
  format: "image/jpeg",
  quality: 0.92,
};

export default function HeicToJpgPage() {
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<HeicConvertSettings>(DEFAULT_SETTINGS);
  const [items, setItems] = useState<ConvertedImageResult[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [convertProgress, setConvertProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [isZipping, setIsZipping] = useState<boolean>(false);

  // ── Convert dropped files ───────────────────────────────────────────────────
  const processFiles = useCallback(
    async (files: File[], currentSettings: HeicConvertSettings) => {
      if (files.length === 0) return;
      setIsConverting(true);
      setConvertProgress({ current: 0, total: files.length });

      const newResults: ConvertedImageResult[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setConvertProgress({ current: i + 1, total: files.length });
        try {
          const res = await convertSingleImage(file, currentSettings);
          newResults.push(res);
        } catch (err) {
          console.error(`Failed to convert ${file.name}:`, err);
        }
      }

      setItems((prev) => [...prev, ...newResults]);
      setIsConverting(false);
    },
    []
  );

  // ── Reconvert all when format or quality changes ────────────────────────────
  const reconvertAll = useCallback(
    async (newSettings: HeicConvertSettings) => {
      if (items.length === 0) return;
      setIsConverting(true);
      setConvertProgress({ current: 0, total: items.length });

      const updatedResults: ConvertedImageResult[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setConvertProgress({ current: i + 1, total: items.length });
        try {
          if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
          const res = await convertSingleImage(item.originalFile, newSettings);
          updatedResults.push(res);
        } catch {
          updatedResults.push(item);
        }
      }

      setItems(updatedResults);
      setIsConverting(false);
    },
    [items]
  );

  const handleSettingsChange = (partial: Partial<HeicConvertSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    if (items.length > 0) {
      reconvertAll(updated);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target && target.convertedUrl) URL.revokeObjectURL(target.convertedUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
    });
    setItems([]);
  };

  // ── Auto-convert Pipeline Image on mount ──────────────────────────────────
  useEffect(() => {
    let active = true;
    (async () => {
      const pipelineFile = await getPipelineImage();
      if (pipelineFile && active) {
        processFiles([pipelineFile], settings);
      }
    })();

    return () => {
      active = false;
    };
  }, [processFiles, settings]);

  const handleAddMore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      processFiles(files, settings);
    }
    e.target.value = "";
  };

  // ── Download All as ZIP ─────────────────────────────────────────────────────
  const handleDownloadAllZip = async () => {
    if (items.length === 0) return;
    setIsZipping(true);

    try {
      if (items.length === 1) {
        const item = items[0];
        const a = document.createElement("a");
        a.href = item.convertedUrl;
        a.download = item.outputFileName;
        a.click();
        setIsZipping(false);
        return;
      }

      const zip = new JSZip();
      items.forEach((item) => {
        zip.file(item.outputFileName, item.convertedBlob);
      });

      const content = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `infyn-converted-photos-${items.length}.zip`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("ZIP creation failed:", err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen text-[#111111] flex flex-col font-sans">
      <Navbar />

      {/* Hidden input for Add More files */}
      <input
        ref={addMoreInputRef}
        type="file"
        multiple
        accept="image/*,.heic,.heif,.HEIC,.HEIF"
        className="hidden"
        onChange={handleAddMore}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col py-8">

        {/* ── Empty State ──────────────────────────────────────────────── */}
        {items.length === 0 && (
          <div
            className="flex-1 flex flex-col items-center justify-center py-12 gap-8"
            style={{ animation: "fade-in-up 0.4s ease-out" }}
          >
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F4EE] border border-[#EAEAE5] text-xs font-semibold text-[#111111] mb-1">
                <svg className="h-3.5 w-3.5 text-[#6E6D68]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
                <span>iPhone & Camera Photos</span>
              </div>
              <SplitText
                text="HEIC to JPG Converter"
                className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
                delay={35}
                duration={0.85}
                splitType="words, chars"
                tag="h1"
                textAlign="center"
              />
              <p className="text-sm text-[#6E6D68] flex items-center justify-center gap-2 flex-wrap">
                <span>Convert .HEIC & .HEIF to JPG or PNG</span>
                <span className="text-[#DDDDD8]">•</span>
                <span>Batch processing</span>
                <span className="text-[#DDDDD8]">•</span>
                <span>100% In-browser</span>
              </p>
            </div>

            {/* Drop Zone */}
            <div className="w-full max-w-xl">
              <DropZone
                multiple={true}
                accept="image/*,.heic,.heif,.HEIC,.HEIF"
                onFilesSelected={(files) => processFiles(files, settings)}
                title="Drop your HEIC / Phone photos"
                subtitle="or click to browse from device (supports batch selection)"
                formatsText="HEIC · HEIF · AVIF · WEBP · JPG · PNG"
              />
            </div>

            {/* Explanatory cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl pt-4">
              <div className="rounded-2xl border border-[#EAEAE5] bg-white p-4 space-y-1.5">
                <p className="text-xs font-bold text-[#111111]">⚡ Instant In-Browser</p>
                <p className="text-[11px] text-[#6E6D68] leading-relaxed">
                  Decodes Apple HEIC using WebAssembly directly on your device. Fast & private.
                </p>
              </div>
              <div className="rounded-2xl border border-[#EAEAE5] bg-white p-4 space-y-1.5">
                <p className="text-xs font-bold text-[#111111]">📦 Batch ZIP Export</p>
                <p className="text-[11px] text-[#6E6D68] leading-relaxed">
                  Convert dozens of iPhone photos at once and download all in a single .zip file.
                </p>
              </div>
              <div className="rounded-2xl border border-[#EAEAE5] bg-white p-4 space-y-1.5">
                <p className="text-xs font-bold text-[#111111]">🔒 100% Private</p>
                <p className="text-[11px] text-[#6E6D68] leading-relaxed">
                  Photos never upload to any server. Complete data privacy guaranteed.
                </p>
              </div>
            </div>

            <PrivacyBadges
              badges={[
                "100% In-browser",
                "libheif v1.19 WASM engine",
                "High quality bicubic scaling",
                "Free & unlimited",
              ]}
            />
          </div>
        )}

        {/* ── Active State: Files Loaded / Converted ─────────────────────── */}
        {items.length > 0 && (
          <div className="space-y-6" style={{ animation: "fade-in-up 0.3s ease-out" }}>
            
            {/* Top Batch Summary Banner */}
            <div className="rounded-2xl border border-[#111111] bg-[#111111] text-white p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-md">
              <div className="space-y-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="text-sm font-bold text-white">
                    {items.length} {items.length === 1 ? "Photo Converted" : "Photos Converted"}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Ready in {settings.format === "image/jpeg" ? "JPG" : settings.format === "image/png" ? "PNG" : "WebP"}
                  </span>
                </div>
                <p className="text-xs text-white/70">
                  Total Size: {formatBytes(items.reduce((acc, i) => acc + i.convertedSize, 0))} • High-resolution output
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => addMoreInputRef.current?.click()}
                  className="h-10 px-4 rounded-xl border border-white/20 bg-white/10 text-xs font-semibold text-white hover:bg-white/20 active:scale-95 transition-all inline-flex items-center gap-1.5"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add More</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="h-10 px-3 rounded-xl border border-white/20 bg-white/5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                  title="Clear all files"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  disabled={isZipping || isConverting}
                  className="h-10 px-5 rounded-xl bg-white text-[#111111] text-xs font-bold hover:bg-[#F5F4EE] active:scale-95 disabled:opacity-50 transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  {isZipping ? (
                    <span>Creating ZIP…</span>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>{items.length === 1 ? "Download JPG" : "Download All (ZIP)"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Conversion Controls (Format & Quality) */}
            <div className="rounded-2xl border border-[#EAEAE5] bg-white p-5 space-y-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Conversion Settings
                  </h3>
                  <p className="text-[11px] text-[#9E9D98]">Select target format & export quality</p>
                </div>

                {/* Target Format Switcher */}
                <div className="inline-flex rounded-xl bg-[#F5F4EE] p-1 border border-[#EAEAE5]">
                  {[
                    { id: "image/jpeg", label: "JPG (Standard)" },
                    { id: "image/png", label: "PNG (Lossless)" },
                    { id: "image/webp", label: "WebP (Web)" },
                  ].map((fmt) => {
                    const isSelected = settings.format === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => handleSettingsChange({ format: fmt.id as OutputTargetFormat })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-[#111111] text-white shadow-xs"
                            : "text-[#6E6D68] hover:text-[#111111]"
                        }`}
                      >
                        {fmt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quality Slider (for JPG/WebP) */}
              {settings.format !== "image/png" && (
                <div className="space-y-2 pt-2 border-t border-[#EAEAE5]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#111111]">JPEG Quality</span>
                    <span className="font-bold tabular-nums text-[#111111] px-2 py-0.5 rounded-md bg-[#F5F4EE] border border-[#EAEAE5]">
                      {Math.round(settings.quality * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="1.0"
                    step="0.02"
                    value={settings.quality}
                    onChange={(e) => handleSettingsChange({ quality: parseFloat(e.target.value) })}
                    className="w-full accent-[#111111] h-2 bg-[#EAEAE5] rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] text-[#9E9D98]">
                    <span>Smaller File Size (70%)</span>
                    <span>High Fidelity (92% Recommended)</span>
                    <span>Maximum (100%)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Converting indicator */}
            {isConverting && (
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 flex items-center justify-between text-xs text-blue-800 animate-pulse">
                <span className="font-semibold">
                  Converting photo {convertProgress.current} of {convertProgress.total}…
                </span>
                <span className="font-bold tabular-nums">
                  {Math.round((convertProgress.current / (convertProgress.total || 1)) * 100)}%
                </span>
              </div>
            )}

            {/* Converted Items List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Converted Photos ({items.length})
                </h3>
                <span className="text-[11px] text-[#9E9D98]">Ready to save or export as ZIP</span>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#EAEAE5] bg-white p-4 sm:p-5 flex flex-col gap-3 shadow-xs hover:border-[#BEBDB9] transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#EAEAE5] bg-[#F8F8F6] shrink-0 shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.convertedUrl}
                          alt={item.originalName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Metadata */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[#111111] truncate max-w-[220px] sm:max-w-xs" title={item.originalName}>
                            {item.originalName}
                          </p>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                            {item.originalType} → {item.outputFormatLabel}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6D68]">
                          <span>{formatBytes(item.originalSize)}</span>
                          <span className="text-[#DDDDD8]">·</span>
                          <span className="font-bold text-[#111111]">{formatBytes(item.convertedSize)}</span>
                          <span className="text-[#DDDDD8]">·</span>
                          <span className="text-[11px] text-[#9E9D98]">
                            {item.convertedWidth} × {item.convertedHeight} px
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EAEAE5]">
                      <button
                        type="button"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = item.convertedUrl;
                          a.download = item.outputFileName;
                          a.click();
                        }}
                        className="h-8 px-4 rounded-xl bg-[#111111] text-xs font-semibold text-white hover:bg-[#262626] active:scale-95 transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download {item.outputFormatLabel}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="h-8 w-8 rounded-xl border border-transparent hover:border-[#EAEAE5] hover:bg-[#F8F8F6] text-[#9E9D98] hover:text-red-600 transition-all flex items-center justify-center cursor-pointer"
                        title="Remove item"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Pipeline Continuation Strip */}
                  <div className="pt-2 border-t border-[#F5F4EE]">
                    <ContinuePipelineBar
                      currentTool="heic-to-jpg"
                      variant="inline"
                      getImageBlob={() => item.convertedBlob}
                      imageName={item.outputFileName}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Privacy Badges */}
            <PrivacyBadges
              badges={[
                "100% In-browser",
                "Zero cloud uploads",
                "Full resolution preserved",
                "Free & unlimited",
              ]}
              className="pt-2"
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
