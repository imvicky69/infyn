"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import JSZip from "jszip";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { ProgressBar } from "@/components/image-tools/progress-bar";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { formatBytes } from "@/components/image-tools/utils";
import { getPipelineImage } from "@/components/image-tools/pipeline-storage";
import SplitText from "@/components/SplitText";
import {
  CleanedImageResult,
  processFileMetadata,
} from "@/components/image-tools/exif-remover/exif-engine";
import { ExifItemCard } from "@/components/image-tools/exif-remover/exif-item-card";

export default function ExifRemoverPage() {
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<CleanedImageResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [isZipping, setIsZipping] = useState(false);

  // ── Process raw files into cleaned EXIF results ────────────────────────────
  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress({ current: 0, total: files.length, percent: 0 });

    const newResults: CleanedImageResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({
        current: i + 1,
        total: files.length,
        percent: Math.round(((i + 1) / files.length) * 100),
      });

      try {
        const result = await processFileMetadata(file);
        newResults.push(result);
      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err);
      }
    }

    setItems((prev) => [...newResults, ...prev]);
    setIsProcessing(false);
  }, []);

  // ── Auto-load image if passed from another tool via pipeline ───────────────
  useEffect(() => {
    let active = true;
    (async () => {
      const pipelineFile = await getPipelineImage();
      if (pipelineFile && active) {
        processFiles([pipelineFile]);
      }
    })();

    return () => {
      active = false;
    };
  }, [processFiles]);

  const handleFilesSelected = (files: File[]) => {
    processFiles(files);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target && target.cleanedUrl) URL.revokeObjectURL(target.cleanedUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleClearAll = () => {
    items.forEach((i) => {
      if (i.cleanedUrl) URL.revokeObjectURL(i.cleanedUrl);
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
        zip.file(item.outputFileName, item.cleanedBlob);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `infyn-sanitized-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1500);
    } catch (err) {
      console.error("ZIP creation failed", err);
    } finally {
      setIsZipping(false);
    }
  };

  // Compute Metrics
  const totalOriginalBytes = items.reduce((acc, i) => acc + i.originalSize, 0);
  const totalCleanedBytes = items.reduce((acc, i) => acc + i.cleanedSize, 0);
  const totalGpsRemoved = items.filter((i) => i.metadata.gps.hasGps).length;
  const totalCameraStripped = items.filter(
    (i) => i.metadata.camera.make || i.metadata.camera.model
  ).length;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#E8E6DE] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#EAEAE5] text-xs font-semibold text-[#111111] shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Client-Side Privacy • Zero Server Uploads</span>
          </div>

          <SplitText
            text="Image Metadata & EXIF Remover"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111111]"
            delay={35}
            duration={0.85}
            splitType="words, chars"
            tag="h1"
            textAlign="center"
          />

          <p className="text-xs sm:text-sm text-[#6E6D68] leading-relaxed max-w-xl mx-auto">
            Strip hidden GPS location coordinates, camera models, capture timestamps, and personal tracking data from your photos before sharing online.
          </p>
        </div>

        {/* ── Dropzone (Idle or Add More) ──────────────────────────────── */}
        {items.length === 0 && (
          <div className="space-y-6 max-w-3xl mx-auto" style={{ animation: "fade-in-up 0.3s ease-out" }}>
            <DropZone
              multiple={true}
              accept="image/*,.heic,.heif,.HEIC,.HEIF,.jpg,.jpeg,.png,.webp,.avif,.tiff"
              onFilesSelected={handleFilesSelected}
              title="Drop photos to strip metadata & EXIF"
              subtitle="or click to browse from device"
              formatsText="JPG · PNG · WEBP · HEIC · HEIF · TIFF — Unlimited Batch Files"
            />

            {/* Privacy Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-[#EAEAE5] bg-white p-4 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span>📍 GPS Stripping</span>
                </div>
                <p className="text-[11px] text-[#6E6D68] leading-relaxed">
                  Removes exact latitude, longitude, and altitude coordinates embedded by smartphones.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EAEAE5] bg-white p-4 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                  <span>📷 Camera & Lens</span>
                </div>
                <p className="text-[11px] text-[#6E6D68] leading-relaxed">
                  Cleans device serial numbers, camera model, software versions, and lens specifications.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EAEAE5] bg-white p-4 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>🔒 100% In-Browser</span>
                </div>
                <p className="text-[11px] text-[#6E6D68] leading-relaxed">
                  Photos never upload to remote servers. All binary header manipulation runs locally.
                </p>
              </div>
            </div>

            <PrivacyBadges
              badges={[
                "100% In-browser",
                "Lossless JPEG stripping",
                "GPS location removed",
                "Zero cloud uploads",
              ]}
            />
          </div>
        )}

        {/* ── Processing State ─────────────────────────────────────────── */}
        {isProcessing && (
          <div className="max-w-md mx-auto space-y-4 py-8 text-center" style={{ animation: "fade-in-up 0.25s ease-out" }}>
            <ProgressBar
              value={progress.percent}
              text={`Sanitizing file ${progress.current} of ${progress.total}…`}
            />
            <p className="text-xs text-[#9E9D98]">
              Removing EXIF tags, GPS markers, and device signatures locally.
            </p>
          </div>
        )}

        {/* ── Active Sanitized Results Stage ───────────────────────────── */}
        {items.length > 0 && (
          <div className="space-y-6" style={{ animation: "fade-in-up 0.3s ease-out" }}>
            
            {/* Top Batch Summary Banner */}
            <div className="rounded-2xl border border-[#111111] bg-[#111111] text-white p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-md">
              <div className="space-y-1.5 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="text-sm font-bold text-white">
                    {items.length} {items.length === 1 ? "Photo Sanitized" : "Photos Sanitized"}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Zero Metadata Remaining
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-xs text-white/70">
                  <span>{formatBytes(totalOriginalBytes)} → <strong className="text-white">{formatBytes(totalCleanedBytes)}</strong></span>
                  {totalGpsRemoved > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-rose-300 font-semibold">{totalGpsRemoved} GPS Locations Stripped</span>
                    </>
                  )}
                  {totalCameraStripped > 0 && (
                    <>
                      <span>•</span>
                      <span>{totalCameraStripped} Camera Tags Cleaned</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => addMoreInputRef.current?.click()}
                  className="h-10 px-4 rounded-xl border border-white/20 bg-white/10 text-xs font-semibold text-white hover:bg-white/20 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add More</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="h-10 px-3 rounded-xl border border-white/20 bg-white/5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  title="Clear all files"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  disabled={isZipping || isProcessing}
                  className="h-10 px-5 rounded-xl bg-white text-[#111111] text-xs font-bold hover:bg-[#F5F4EE] active:scale-95 disabled:opacity-50 transition-all inline-flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  {isZipping ? (
                    <span>Creating ZIP…</span>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>{items.length === 1 ? "Download Cleaned File" : `Download All (${items.length} Files ZIP)`}</span>
                    </>
                  )}
                </button>

                <input
                  ref={addMoreInputRef}
                  type="file"
                  multiple
                  accept="image/*,.heic,.heif,.HEIC,.HEIF,.jpg,.jpeg,.png,.webp,.avif,.tiff"
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

            {/* List of Sanitized Photos */}
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
                    <ExifItemCard
                      item={item}
                      onRemove={handleRemoveItem}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Privacy Badges */}
            <PrivacyBadges
              badges={[
                "100% In-browser",
                "Zero cloud uploads",
                "Lossless JPEG header cleaner",
                "Free & unlimited",
              ]}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
