"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import {
  CompressionSettings,
  CompressedFileResult,
  compressImage,
} from "@/components/image-tools/compressor/compression-engine";
import { CompressionToggles } from "@/components/image-tools/compressor/compression-toggles";
import { CompressorItemCard } from "@/components/image-tools/compressor/compressor-item-card";
import { BatchSummaryBar } from "@/components/image-tools/compressor/batch-summary-bar";
import { CompareModal } from "@/components/image-tools/compressor/compare-modal";
import { getPipelineImage } from "@/components/image-tools/pipeline-storage";
import SplitText from "@/components/SplitText";

const DEFAULT_SETTINGS: CompressionSettings = {
  mode: "quality",
  quality: 0.75, // 75% balanced
  targetSizeKb: 200,
  format: "original",
  resizeMode: "original",
};

export default function ImageCompressorPage() {
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [settings, setSettings] = useState<CompressionSettings>(DEFAULT_SETTINGS);
  const [items, setItems] = useState<CompressedFileResult[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [comparingItem, setComparingItem] = useState<CompressedFileResult | null>(null);

  // ── Compress a list of files with current settings ─────────────────────────
  const processFiles = useCallback(
    async (files: File[], currentSettings: CompressionSettings) => {
      if (files.length === 0) return;
      setIsProcessing(true);

      try {
        const results = await Promise.all(
          files.map(async (file) => {
            try {
              return await compressImage(file, currentSettings);
            } catch (err: any) {
              console.error("Failed to compress file:", file.name, err);
              return null;
            }
          })
        );

        const validResults = results.filter((r): r is CompressedFileResult => r !== null);
        setItems((prev) => [...prev, ...validResults]);
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  // ── Re-compress existing items when settings change ────────────────────────
  const recompressAll = useCallback(
    async (newSettings: CompressionSettings) => {
      if (items.length === 0) return;
      setIsProcessing(true);

      try {
        const updated = await Promise.all(
          items.map(async (item) => {
            try {
              if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
              return await compressImage(item.originalFile, newSettings);
            } catch {
              return item;
            }
          })
        );
        setItems(updated);
      } finally {
        setIsProcessing(false);
      }
    },
    [items]
  );

  const handleSettingsChange = (partial: Partial<CompressionSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);

    if (items.length > 0) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        recompressAll(updated);
      }, 150);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      const pipelineFile = await getPipelineImage();
      if (pipelineFile && active) {
        processFiles([pipelineFile], DEFAULT_SETTINGS);
      }
    })();

    return () => {
      active = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [processFiles]);

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        if (target.originalUrl) URL.revokeObjectURL(target.originalUrl);
        if (target.compressedUrl) URL.revokeObjectURL(target.compressedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
      if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
    });
    setItems([]);
  };

  const handleAddMoreFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      processFiles(files, settings);
    }
    e.target.value = "";
  };

  return (
    <div className="min-h-screen text-[#111111] flex flex-col font-sans">
      <Navbar />
      <Breadcrumbs />

      {/* Hidden input for Add More */}
      <input
        ref={addMoreInputRef}
        type="file"
        multiple
        accept="image/*,.heic,.heif,.HEIC,.HEIF"
        className="hidden"
        onChange={handleAddMoreFiles}
      />

      {/* Before / After Slider Comparison Modal */}
      <CompareModal item={comparingItem} onClose={() => setComparingItem(null)} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col py-8">

        {/* ── Empty State / Initial Upload ─────────────────────────────── */}
        {items.length === 0 && (
          <div
            className="flex-1 flex flex-col items-center justify-center py-12 gap-8"
            style={{ animation: "fade-in-up 0.4s ease-out" }}
          >
            {/* Header */}
            <div className="text-center space-y-3">
              <SplitText
                text="Compress Images"
                className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
                delay={35}
                duration={0.85}
                splitType="words, chars"
                tag="h1"
                textAlign="center"
              />
              <p className="text-sm text-[#6E6D68] flex items-center justify-center gap-2 flex-wrap">
                <span>Reduce file size up to 90%</span>
                <span className="text-[#DDDDD8]">•</span>
                <span>Batch processing</span>
                <span className="text-[#DDDDD8]">•</span>
                <span>100% Private in your browser</span>
              </p>
            </div>

            {/* Drop Zone */}
            <div className="w-full max-w-xl">
              <DropZone
                multiple={true}
                onFilesSelected={(files) => processFiles(files, settings)}
                title="Drop your images here"
                subtitle="or click to browse from device (select multiple)"
                formatsText="JPG · PNG · WEBP · HEIC · AVIF · GIF"
              />
            </div>

            {/* Privacy Badges */}
            <PrivacyBadges
              badges={[
                "100% In-browser",
                "100% Ad-Free",
                "Zero cloud uploads",
                "Ultra-fast WebP/JPEG compression",
                "Batch ZIP download",
              ]}
            />
          </div>
        )}

        {/* ── Active State: Files Loaded & Compressed ───────────────────── */}
        {items.length > 0 && (
          <div className="space-y-6" style={{ animation: "fade-in-up 0.3s ease-out" }}>
            
            {/* Top Batch Summary Banner */}
            <BatchSummaryBar
              items={items}
              onClearAll={handleClearAll}
              onAddMore={() => addMoreInputRef.current?.click()}
            />

            {/* Compression Toggles Control Card */}
            <CompressionToggles
              settings={settings}
              onChange={handleSettingsChange}
            />

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-[#6E6D68] animate-pulse">
                <span className="h-2 w-2 rounded-full bg-[#111111]" />
                <span>Re-compressing images with updated settings…</span>
              </div>
            )}

            {/* List of Compressed File Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Compressed Files ({items.length})
                </h3>
                <span className="text-[11px] text-[#9E9D98]">Click thumbnail to compare quality</span>
              </div>

              {items.map((item) => (
                <CompressorItemCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onCompare={setComparingItem}
                />
              ))}
            </div>

            {/* Privacy Badges */}
            <PrivacyBadges
              badges={[
                "100% In-browser",
                "100% Ad-Free",
                "No files uploaded to servers",
                "High quality bicubic scaling",
                "Unlimited free use",
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
