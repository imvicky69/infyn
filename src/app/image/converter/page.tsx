"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { ProgressBar } from "@/components/image-tools/progress-bar";
import { formatBytes, calculateSavings } from "@/components/image-tools/utils";
import {
  ConvertSettings,
  ConvertedFileResult,
  convertImage,
  OutputFormat,
  POPULAR_CONVERTER_PRESETS,
  ConverterPreset,
} from "@/components/image-tools/converter/converter-engine";
import { ConverterItemCard } from "@/components/image-tools/converter/converter-item-card";
import {
  setPipelineImage,
  getPipelineImage,
} from "@/components/image-tools/pipeline-storage";
import SplitText from "@/components/SplitText";

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;

  let safeName = filename || "converted.jpg";
  if (!/\.(jpg|jpeg|png|webp|avif|gif|zip)$/i.test(safeName)) {
    const ext =
      blob.type === "image/png"
        ? ".png"
        : blob.type === "image/webp"
        ? ".webp"
        : blob.type === "application/avif"
        ? ".avif"
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

const DEFAULT_SETTINGS: ConvertSettings = {
  format: "image/jpeg",
  quality: 0.92,
  bgColor: "#FFFFFF",
};

export default function UniversalImageConverterPage() {
  const router = useRouter();
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<ConvertSettings>(DEFAULT_SETTINGS);
  const [activePresetId, setActivePresetId] = useState<string>("heic-to-jpg");
  const [items, setItems] = useState<ConvertedFileResult[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; total: number; percent: number }>({
    current: 0,
    total: 0,
    percent: 0,
  });
  const [isZipping, setIsZipping] = useState<boolean>(false);

  // ── Process raw files into converted results ───────────────────────────────
  const processFiles = useCallback(
    async (files: File[], currentSettings: ConvertSettings) => {
      if (files.length === 0) return;
      setIsConverting(true);
      setProgress({ current: 0, total: files.length, percent: 0 });

      const newResults: ConvertedFileResult[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress({
          current: i + 1,
          total: files.length,
          percent: Math.round(((i + 1) / files.length) * 100),
        });

        try {
          const res = await convertImage(file, currentSettings);
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

  // ── Re-convert existing items when settings change ─────────────────────────
  const reconvertAll = useCallback(
    async (newSettings: ConvertSettings) => {
      if (items.length === 0) return;
      setIsConverting(true);
      setProgress({ current: 0, total: items.length, percent: 0 });

      const updatedResults: ConvertedFileResult[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setProgress({
          current: i + 1,
          total: items.length,
          percent: Math.round(((i + 1) / items.length) * 100),
        });

        try {
          if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
          const res = await convertImage(item.originalFile, newSettings);
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

  // ── Handle new file selection ──────────────────────────────────────────────
  const handleFilesSelected = (files: File[]) => {
    processFiles(files, settings);
  };

  const handlePresetSelect = (preset: ConverterPreset) => {
    setActivePresetId(preset.id);
    const newSettings: ConvertSettings = {
      ...settings,
      format: preset.targetFormat,
      quality: preset.recommendedQuality,
    };
    setSettings(newSettings);
    if (items.length > 0) {
      reconvertAll(newSettings);
    }
  };

  const handleFormatChange = (fmt: OutputFormat) => {
    setActivePresetId("");
    const newSettings: ConvertSettings = { ...settings, format: fmt };
    setSettings(newSettings);
    if (items.length > 0) {
      reconvertAll(newSettings);
    }
  };

  const handleQualityChange = (q: number) => {
    const newSettings: ConvertSettings = { ...settings, quality: q };
    setSettings(newSettings);
    if (items.length > 0) {
      reconvertAll(newSettings);
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
    items.forEach((i) => {
      if (i.convertedUrl) URL.revokeObjectURL(i.convertedUrl);
    });
    setItems([]);
  };

  // ── Batch ZIP Download ────────────────────────────────────────────────────
  const handleDownloadAllZip = async () => {
    if (items.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      items.forEach((item) => {
        zip.file(item.outputFileName, item.convertedBlob);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      triggerDownload(zipBlob, `infyn-converted-${Date.now()}.zip`);
    } catch (err) {
      console.error("ZIP creation failed", err);
    } finally {
      setIsZipping(false);
    }
  };

  // ── Auto-convert Pipeline Image on mount ──────────────────────────────────
  useEffect(() => {
    let active = true;
    (async () => {
      const pipelineFile = await getPipelineImage();
      if (pipelineFile && active) {
        handleFilesSelected([pipelineFile]);
      }
    })();

    return () => {
      active = false;
    };
  }, [handleFilesSelected]);

  // Compute Total Metrics
  const totalOriginalBytes = items.reduce((acc, i) => acc + i.originalSize, 0);
  const totalConvertedBytes = items.reduce((acc, i) => acc + i.convertedSize, 0);
  const batchSavings = calculateSavings(totalOriginalBytes, totalConvertedBytes);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#E8E6DE] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#EAEAE5] text-xs font-semibold text-[#111111] shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Free Forever • HEIC · JPG · PNG · WebP · AVIF</span>
          </div>

          <SplitText
            text="Universal Image Converter"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]"
            delay={35}
            duration={0.85}
            splitType="words, chars"
            tag="h1"
            textAlign="center"
          />

          <p className="text-xs sm:text-sm text-[#6E6D68] leading-relaxed">
            Convert any image format locally in your browser. Batch convert Apple iPhone HEIC, heavy PNGs, JPGs, next-gen WebP, and AVIF with 1-click ZIP export.
          </p>
        </div>

        {/* ── Popular Conversion Presets Bar ─────────────────────────────── */}
        <div className="rounded-3xl border border-[#EAEAE5] bg-white p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6E6D68]">
              Popular Conversion Presets:
            </h2>
            <span className="text-[11px] font-semibold text-[#9E9D98]">Instant 1-Click Setup</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {POPULAR_CONVERTER_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`p-3 rounded-2xl text-left border transition-all space-y-1 cursor-pointer ${
                    isSelected
                      ? "bg-[#111111] text-white border-[#111111] shadow-sm"
                      : "bg-[#FBFBFA] hover:bg-[#F5F4EE] text-[#111111] border-[#EAEAE5]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{preset.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-[#EAEAE5] text-[#6E6D68]"
                      }`}
                    >
                      {preset.to}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] leading-tight line-clamp-1 ${
                      isSelected ? "text-neutral-300" : "text-[#9E9D98]"
                    }`}
                  >
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Target Format & Quality Customization Controls */}
          <div className="pt-4 border-t border-[#F5F4EE] flex flex-wrap items-center justify-between gap-4 text-xs">
            {/* Format Selector */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#6E6D68]">Target Format:</span>
              {(
                [
                  { id: "image/jpeg", label: "JPG" },
                  { id: "image/png", label: "PNG" },
                  { id: "image/webp", label: "WebP" },
                  { id: "image/avif", label: "AVIF" },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleFormatChange(f.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-all text-xs cursor-pointer ${
                    settings.format === f.id
                      ? "bg-[#111111] text-white border-[#111111] shadow-2xs"
                      : "bg-[#FBFBFA] hover:bg-[#F5F4EE] text-[#6E6D68] border-[#EAEAE5]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Quality Slider (for lossy formats) */}
            {settings.format !== "image/png" && (
              <div className="flex items-center gap-3 min-w-[220px]">
                <span className="font-bold text-[#6E6D68] shrink-0">Quality:</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.02"
                  value={settings.quality}
                  onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                  className="flex-1 accent-[#111111] h-1.5 bg-[#EAEAE5] rounded-lg cursor-pointer"
                />
                <span className="font-bold text-[#111111] w-10 text-right">
                  {Math.round(settings.quality * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Stage 1: Upload DropZone (When no items loaded) ──────────── */}
        {items.length === 0 && !isConverting && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <DropZone
              multiple={true}
              onFilesSelected={handleFilesSelected}
              title="Drop images or iPhone HEIC photos here"
              subtitle="or click to browse from device (Batch 50+ supported)"
              formatsText="HEIC · HEIF · JPG · PNG · WEBP · AVIF · GIF · BMP"
            />
            <PrivacyBadges />
          </motion.div>
        )}

        {/* ── Converting Progress Bar ──────────────────────────────────── */}
        {isConverting && (
          <div className="rounded-3xl border border-[#EAEAE5] bg-white p-8 text-center space-y-4 shadow-sm">
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#111111]">
                Converting Images ({progress.current} of {progress.total})…
              </p>
              <p className="text-xs text-[#6E6D68]">
                Decoding and encoding locally on your device CPU/GPU
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <ProgressBar
                value={progress.percent}
                text={`${progress.percent}% complete`}
              />
            </div>
          </div>
        )}

        {/* ── Stage 2: Converted Items Showcase ────────────────────────── */}
        {items.length > 0 && (
          <div className="space-y-6">
            {/* Summary Action Bar */}
            <div className="rounded-2xl border border-[#EAEAE5] bg-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <p className="text-xs sm:text-sm font-bold text-[#111111]">
                    {items.length} {items.length === 1 ? "Image" : "Images"} Converted to{" "}
                    {settings.format.replace("image/", "").toUpperCase()}
                  </p>
                </div>
                <p className="text-xs text-[#6E6D68]">
                  {formatBytes(totalOriginalBytes)} total →{" "}
                  <span className="font-semibold text-[#111111]">
                    {formatBytes(totalConvertedBytes)}
                  </span>
                  {batchSavings.isReduced && (
                    <span className="font-bold text-emerald-700 ml-1.5">
                      (Saved {formatBytes(batchSavings.savedBytes)} • -{batchSavings.percentage}%)
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => addMoreInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAEAE5] bg-white px-3.5 py-2 text-xs font-bold text-[#111111] hover:bg-[#F5F4EE] transition-colors cursor-pointer"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span>Add More</span>
                </button>

                <button
                  onClick={handleClearAll}
                  className="rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Clear All
                </button>

                <button
                  onClick={handleDownloadAllZip}
                  disabled={isZipping || isConverting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#262626] active:scale-95 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>{isZipping ? "Zipping…" : `Download All (${items.length} Files ZIP)`}</span>
                </button>

                <input
                  ref={addMoreInputRef}
                  type="file"
                  multiple
                  accept="image/*,.heic,.heif,.avif,.webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFilesSelected(Array.from(e.target.files));
                    }
                    e.target.value = "";
                  }}
                />
              </div>
            </div>

            {/* List of Converted Items */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ConverterItemCard
                      item={item}
                      onRemove={handleRemoveItem}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
