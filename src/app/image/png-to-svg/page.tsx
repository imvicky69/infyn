"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import JSZip from "jszip";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { ProgressBar } from "@/components/image-tools/progress-bar";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { CheckerBoard } from "@/components/image-tools/checkerboard";
import { formatBytes } from "@/components/image-tools/utils";
import SplitText from "@/components/SplitText";
import {
  vectorizeImage,
  fileToImageData,
  detectImageComplexity,
  DEFAULT_POTRACE_SETTINGS,
  DEFAULT_COLOR_SETTINGS,
  type VectorizerMode,
  type VectorizerEngine,
  type PotraceSettings,
  type ColorSettings,
  type ImageComplexity,
  type VectorizeResult,
} from "@/lib/core/image/vectorizer";
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Code2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  Layers,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  FileCode,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Stage = "idle" | "busy" | "done" | "error";

interface ProcessedItem {
  id: string;
  file: File;
  previewUrl: string;
  imageData: ImageData;
  complexity: ImageComplexity;
  mode: VectorizerMode;
  potraceSettings: PotraceSettings;
  colorSettings: ColorSettings;
  result?: VectorizeResult;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
}

const COLOR_SWATCHES = [
  "#111111",
  "#2563EB",
  "#7C3AED",
  "#059669",
  "#DC2626",
  "#D97706",
  "#4F46E5",
  "#0891B2",
];

export default function PngToSvgPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [items, setItems] = useState<ProcessedItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [batchProgress, setBatchProgress] = useState({ value: 0, text: "" });
  const [viewMode, setViewMode] = useState<"side-by-side" | "svg-only" | "png-only">("side-by-side");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const activeItem = items[activeIndex];

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, [items]);

  // Process a single item
  const processItem = async (item: ProcessedItem): Promise<ProcessedItem> => {
    try {
      const result = await vectorizeImage(
        item.imageData,
        {
          mode: item.mode,
          potraceSettings: item.potraceSettings,
          colorSettings: item.colorSettings,
        },
        item.file.size
      );

      return {
        ...item,
        status: "done",
        result,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Vectorization failed";
      return {
        ...item,
        status: "error",
        error: msg,
      };
    }
  };

  // Handle file uploads
  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (!selectedFiles.length) return;

    setStage("busy");
    setErrorMessage("");
    setBatchProgress({ value: 5, text: "Reading image files..." });

    try {
      const newItems: ProcessedItem[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setBatchProgress({
          value: Math.round(5 + (i / selectedFiles.length) * 35),
          text: `Analyzing ${file.name} (${i + 1}/${selectedFiles.length})...`,
        });

        const { imageData, previewUrl } = await fileToImageData(file);
        const complexity = detectImageComplexity(imageData);

        newItems.push({
          id: `${file.name}-${Date.now()}-${i}`,
          file,
          previewUrl,
          imageData,
          complexity,
          mode: "auto",
          potraceSettings: { ...DEFAULT_POTRACE_SETTINGS },
          colorSettings: { ...DEFAULT_COLOR_SETTINGS },
          status: "pending",
        });
      }

      // Process each item
      const processed: ProcessedItem[] = [];
      for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];
        setBatchProgress({
          value: Math.round(40 + (i / newItems.length) * 55),
          text: `Vectorizing ${item.file.name}...`,
        });

        const doneItem = await processItem(item);
        processed.push(doneItem);
      }

      setBatchProgress({ value: 100, text: "Vectorization complete!" });
      setItems(processed);
      setActiveIndex(0);
      setStage("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load files";
      setErrorMessage(msg);
      setStage("error");
    }
  };

  // Re-run vectorization for current active item when settings change
  const recomputeActiveItem = useCallback(
    async (
      updatedMode?: VectorizerMode,
      updatedPotrace?: Partial<PotraceSettings>,
      updatedColor?: Partial<ColorSettings>
    ) => {
      if (!activeItem) return;

      const newMode = updatedMode ?? activeItem.mode;
      const newPotrace = { ...activeItem.potraceSettings, ...(updatedPotrace ?? {}) };
      const newColor = { ...activeItem.colorSettings, ...(updatedColor ?? {}) };

      const updatedItem: ProcessedItem = {
        ...activeItem,
        mode: newMode,
        potraceSettings: newPotrace,
        colorSettings: newColor,
        status: "processing",
      };

      // Optimistically update
      setItems((prev) =>
        prev.map((it, idx) => (idx === activeIndex ? updatedItem : it))
      );

      const doneItem = await processItem(updatedItem);

      setItems((prev) =>
        prev.map((it, idx) => (idx === activeIndex ? doneItem : it))
      );
    },
    [activeItem, activeIndex]
  );

  // Copy SVG markup
  const handleCopySvg = async () => {
    if (!activeItem?.result?.svgString) return;
    try {
      await navigator.clipboard.writeText(activeItem.result.svgString);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Download single SVG
  const handleDownloadSvg = (item: ProcessedItem) => {
    if (!item.result?.svgString) return;
    const blob = new Blob([item.result.svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const nameWithoutExt = item.file.name.replace(/\.[^/.]+$/, "");
    link.href = url;
    link.download = `${nameWithoutExt}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download all as ZIP
  const handleDownloadAllZip = async () => {
    const zip = new JSZip();
    const successfulItems = items.filter((it) => it.result?.svgString);

    if (!successfulItems.length) return;

    successfulItems.forEach((it) => {
      const nameWithoutExt = it.file.name.replace(/\.[^/.]+$/, "");
      zip.file(`${nameWithoutExt}.svg`, it.result!.svgString);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "infyn-vector-svgs.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset tool
  const handleReset = () => {
    items.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setItems([]);
    setActiveIndex(0);
    setZoomLevel(100);
    setShowCode(false);
    setStage("idle");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Title & Headline */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 text-purple-800 dark:text-purple-300 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Dual-Engine: Potrace + ImageTracer.js · 100% Client-Side</span>
          </div>

          <SplitText
            text="PNG to SVG Converter"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] dark:text-white"
            delay={25}
            duration={0.7}
            splitType="words"
          />

          <p className="text-sm sm:text-base text-[#6E6D68] dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Turn raster PNGs and logos into clean, infinitely scalable vector SVG paths. Auto-detects monochrome vs. color graphics with zero server uploads.
          </p>
        </div>

        {/* ─── Stage 1: IDLE ────────────────────────────────────────── */}
        {stage === "idle" && (
          <div className="space-y-10 max-w-4xl mx-auto">
            <DropZone
              multiple={true}
              accept="image/png,image/jpeg,image/webp,image/avif"
              onFilesSelected={handleFilesSelected}
              title="Drop PNGs or images here"
              subtitle="or click to browse from device"
              formatsText="PNG · JPG · WEBP · AVIF (Batch Supported)"
            />

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-1.5 shadow-2xs">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-2">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-[#111111] dark:text-white">
                  Potrace Algorithm
                </h3>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  Real vector &lt;path&gt; generation with Otsu auto-thresholding for pixel-perfect logos.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-1.5 shadow-2xs">
                <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center text-blue-700 dark:text-blue-400 mb-2">
                  <Layers className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-[#111111] dark:text-white">
                  Multi-Color Tracing
                </h3>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  ImageTracer.js quantization extracts clean color layers for illustrations and icons.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-1.5 shadow-2xs">
                <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-2">
                  <Download className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-[#111111] dark:text-white">
                  Batch ZIP Export
                </h3>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                  Drop dozens of icons at once and download ready-to-use SVG files in 1 click.
                </p>
              </div>
            </div>

            <PrivacyBadges />
          </div>
        )}

        {/* ─── Stage 2: BUSY ────────────────────────────────────────── */}
        {stage === "busy" && (
          <div className="max-w-xl mx-auto py-16 space-y-6 text-center">
            <div className="h-16 w-16 mx-auto rounded-3xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-center text-purple-700 dark:text-purple-300 animate-pulse">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-[#111111] dark:text-white">
                Vectorizing Graphics
              </h2>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 font-mono">
                Running Potrace & ImageTracer engines locally...
              </p>
            </div>

            <ProgressBar value={batchProgress.value} text={batchProgress.text} />
          </div>
        )}

        {/* ─── Stage 3: ERROR ───────────────────────────────────────── */}
        {stage === "error" && (
          <div className="max-w-md mx-auto p-8 rounded-3xl border border-rose-200/80 dark:border-rose-900/60 bg-white dark:bg-[#141417] text-center space-y-5 shadow-sm">
            <div className="h-12 w-12 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#111111] dark:text-white">
                Vectorization Failed
              </h3>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                {errorMessage || "Unable to trace the selected image. Please verify file integrity."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-black dark:bg-white dark:text-zinc-900 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* ─── Stage 4: DONE ────────────────────────────────────────── */}
        {stage === "done" && activeItem && (
          <div className="space-y-6">
            {/* Top Action & Batch Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] shadow-2xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 text-xs font-bold text-[#6E6D68] dark:text-zinc-300 hover:text-[#111111] dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Convert More</span>
                </button>

                {items.length > 1 && (
                  <span className="text-xs font-semibold text-[#9E9D98]">
                    {items.length} files converted
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={handleDownloadAllZip}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#BEBDB9] dark:border-zinc-700 bg-[#F5F4EE] dark:bg-zinc-800 text-xs font-bold text-[#111111] dark:text-white hover:bg-[#EAEAE5] dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-2xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download All (ZIP)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDownloadSvg(activeItem)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#111111] text-white hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download SVG</span>
                </button>
              </div>
            </div>

            {/* Batch Thumbnail Filmstrip */}
            {items.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {items.map((item, idx) => {
                  const isCurrent = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`group relative flex items-center gap-2.5 p-2 rounded-xl border transition-all shrink-0 cursor-pointer ${
                        isCurrent
                          ? "bg-purple-50/70 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800 shadow-2xs"
                          : "bg-white dark:bg-[#141417] border-[#EAEAE5] dark:border-zinc-800 hover:border-[#BEBDB9]"
                      }`}
                    >
                      <div className="h-10 w-10 rounded-lg overflow-hidden border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.previewUrl}
                          alt={item.file.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="text-left pr-2 max-w-[130px]">
                        <p className="text-xs font-bold text-[#111111] dark:text-white truncate">
                          {item.file.name}
                        </p>
                        <p className="text-[10px] text-[#9E9D98] truncate">
                          {item.result?.modeUsed === "potrace" ? "⚡ Potrace" : "🎨 Color"} ·{" "}
                          {formatBytes(item.result?.svgBytes ?? 0)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main Interactive Stage Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left/Main Column: Canvas Preview Area (8 cols on lg) */}
              <div className="lg:col-span-8 space-y-4">
                {/* View Controls & Zoom Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417]">
                  {/* View Mode Segmented Control */}
                  <div className="flex items-center p-0.5 rounded-xl bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setViewMode("side-by-side")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewMode === "side-by-side"
                          ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                          : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111]"
                      }`}
                    >
                      Side-by-Side
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("svg-only")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewMode === "svg-only"
                          ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                          : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111]"
                      }`}
                    >
                      Vector SVG
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("png-only")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewMode === "png-only"
                          ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                          : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111]"
                      }`}
                    >
                      Original PNG
                    </button>
                  </div>

                  {/* Zoom controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(25, z - 25))}
                      className="p-1.5 rounded-lg border border-[#EAEAE5] dark:border-zinc-800 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 text-[#6E6D68] hover:text-[#111111] transition-colors cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-mono font-bold text-[#6E6D68] w-12 text-center">
                      {zoomLevel}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(600, z + 25))}
                      className="p-1.5 rounded-lg border border-[#EAEAE5] dark:border-zinc-800 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 text-[#6E6D68] hover:text-[#111111] transition-colors cursor-pointer"
                      title="Zoom In (Test Infinite Resolution)"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(100)}
                      className="p-1.5 rounded-lg border border-[#EAEAE5] dark:border-zinc-800 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 text-[#6E6D68] hover:text-[#111111] transition-colors cursor-pointer"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Code toggle */}
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      showCode
                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200"
                        : "border-[#EAEAE5] dark:border-zinc-800 text-[#6E6D68] hover:bg-[#F5F4EE]"
                    }`}
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    <span>SVG Code</span>
                  </button>
                </div>

                {/* Live Preview Container with Transparency Checkerboard */}
                <div className="relative min-h-[420px] max-h-[620px] rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 overflow-hidden bg-[#FBFBFA] dark:bg-[#141417] flex items-center justify-center p-4">
                  {/* Subtle Checkerboard for Transparency */}
                  <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none">
                    <CheckerBoard />
                  </div>

                  {/* Side-by-Side View */}
                  {viewMode === "side-by-side" && (
                    <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center">
                      {/* Left: Original PNG */}
                      <div className="flex flex-col items-center justify-center space-y-2 p-3 rounded-2xl border border-[#EAEAE5]/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-sm h-full">
                        <div className="flex items-center justify-between w-full px-1 text-[11px] font-bold text-[#9E9D98] uppercase tracking-wider">
                          <span>Original Raster</span>
                          <span>{formatBytes(activeItem.file.size)}</span>
                        </div>
                        <div
                          className="flex-1 w-full h-[280px] sm:h-[300px] flex items-center justify-center overflow-hidden transition-transform duration-150"
                          style={{ transform: `scale(${zoomLevel / 100})` }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={activeItem.previewUrl}
                            alt="Original Raster"
                            className="max-h-[280px] sm:max-h-[300px] w-auto max-w-full object-contain rounded-lg shadow-2xs"
                          />
                        </div>
                        <span className="text-[10px] font-mono text-[#9E9D98]">
                          {activeItem.imageData.width} × {activeItem.imageData.height} px
                        </span>
                      </div>

                      {/* Right: Scalable SVG */}
                      <div className="flex flex-col items-center justify-center space-y-2 p-3 rounded-2xl border border-purple-200/80 dark:border-purple-800/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm h-full shadow-2xs">
                        <div className="flex items-center justify-between w-full px-1 text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3" />
                            <span>Vector SVG</span>
                          </span>
                          <span>{formatBytes(activeItem.result?.svgBytes ?? 0)}</span>
                        </div>
                        <div
                          className="flex-1 w-full h-[280px] sm:h-[300px] flex items-center justify-center overflow-hidden transition-transform duration-150"
                          style={{ transform: `scale(${zoomLevel / 100})` }}
                        >
                          {activeItem.result?.svgString ? (
                            <div
                              className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-[280px] sm:[&>svg]:max-h-[300px] [&>svg]:max-w-full [&>svg]:object-contain"
                              dangerouslySetInnerHTML={{ __html: activeItem.result.svgString }}
                            />
                          ) : (
                            <div className="text-xs text-[#9E9D98]">Tracing in progress...</div>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">
                          {activeItem.result?.pathCount ?? 0} &lt;path&gt; vectors · Infinite Sharpness
                        </span>
                      </div>
                    </div>
                  )}

                  {/* SVG Only View */}
                  {viewMode === "svg-only" && (
                    <div
                      className="relative z-10 w-full h-[400px] sm:h-[480px] flex items-center justify-center transition-transform duration-150"
                      style={{ transform: `scale(${zoomLevel / 100})` }}
                    >
                      {activeItem.result?.svgString ? (
                        <div
                          className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-[400px] sm:[&>svg]:max-h-[480px] [&>svg]:max-w-full [&>svg]:object-contain"
                          dangerouslySetInnerHTML={{ __html: activeItem.result.svgString }}
                        />
                      ) : null}
                    </div>
                  )}

                  {/* PNG Only View */}
                  {viewMode === "png-only" && (
                    <div
                      className="relative z-10 w-full h-[400px] sm:h-[480px] flex items-center justify-center transition-transform duration-150"
                      style={{ transform: `scale(${zoomLevel / 100})` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeItem.previewUrl}
                        alt="Original"
                        className="max-h-[400px] sm:max-h-[480px] w-auto max-w-full object-contain rounded-xl"
                      />
                    </div>
                  )}
                </div>

                {/* SVG Raw Code Inspector */}
                {showCode && activeItem.result?.svgString && (
                  <div className="p-4 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-purple-600" />
                        <span className="text-xs font-bold text-[#111111] dark:text-white">
                          SVG Source Code ({formatBytes(activeItem.result.svgBytes)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopySvg}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 text-xs font-bold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-all cursor-pointer"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy SVG</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3.5 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-950 border border-[#EAEAE5] dark:border-zinc-800 text-[11px] font-mono text-[#111111] dark:text-zinc-200 overflow-x-auto max-h-56 leading-relaxed custom-scrollbar select-all">
                      <code>{activeItem.result.svgString}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Right Column: Engine & Vector Settings Panel (4 cols on lg) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-5 shadow-2xs">
                  {/* Panel Header */}
                  <div className="flex items-center justify-between border-b border-[#F5F4EE] dark:border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-[#111111] dark:text-white" />
                      <h3 className="font-extrabold text-sm text-[#111111] dark:text-white">
                        Vector Settings
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-[#9E9D98]">
                      {activeItem.result?.timeMs}ms
                    </span>
                  </div>

                  {/* Engine Mode Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6E6D68] dark:text-zinc-400">
                      Tracing Engine
                    </label>

                    <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => recomputeActiveItem("auto")}
                        className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                          activeItem.mode === "auto"
                            ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                            : "text-[#6E6D68] hover:text-[#111111]"
                        }`}
                      >
                        Auto
                      </button>
                      <button
                        type="button"
                        onClick={() => recomputeActiveItem("potrace")}
                        className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                          activeItem.mode === "potrace"
                            ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                            : "text-[#6E6D68] hover:text-[#111111]"
                        }`}
                      >
                        ⚡ Potrace
                      </button>
                      <button
                        type="button"
                        onClick={() => recomputeActiveItem("imagetracer")}
                        className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                          activeItem.mode === "imagetracer"
                            ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                            : "text-[#6E6D68] hover:text-[#111111]"
                        }`}
                      >
                        🎨 Color
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-[11px] text-purple-900 dark:text-purple-300 flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Active Engine: </span>
                        {activeItem.result?.modeUsed === "potrace"
                          ? "Potrace (Logo & Monochrome)"
                          : "ImageTracer (Color Palette)"}
                        <p className="text-[10px] text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                          {activeItem.complexity.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Potrace Settings (if mode is Potrace or auto-potrace) */}
                  {activeItem.result?.modeUsed === "potrace" && (
                    <div className="space-y-4 pt-2 border-t border-[#F5F4EE] dark:border-zinc-800/80">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#111111] dark:text-white">
                          Brightness Threshold
                        </label>
                        <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
                          {activeItem.potraceSettings.threshold === -1
                            ? "Auto (Otsu)"
                            : activeItem.potraceSettings.threshold}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={
                            activeItem.potraceSettings.threshold === -1
                              ? 128
                              : activeItem.potraceSettings.threshold
                          }
                          onChange={(e) =>
                            recomputeActiveItem(undefined, { threshold: Number(e.target.value) })
                          }
                          className="w-full h-1.5 bg-[#EAEAE5] dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <div className="flex justify-between items-center text-[10px] text-[#9E9D98]">
                          <button
                            type="button"
                            onClick={() => recomputeActiveItem(undefined, { threshold: -1 })}
                            className="underline hover:text-[#111111] cursor-pointer"
                          >
                            Reset to Auto Otsu
                          </button>
                          <span>Dark 0 · Light 255</span>
                        </div>
                      </div>

                      {/* Invert switch */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="text-xs font-bold text-[#111111] dark:text-white">
                            Invert Tracing
                          </p>
                          <p className="text-[10px] text-[#9E9D98]">
                            Trace white foreground instead of black
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            recomputeActiveItem(undefined, {
                              invert: !activeItem.potraceSettings.invert,
                            })
                          }
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            activeItem.potraceSettings.invert
                              ? "bg-purple-600"
                              : "bg-[#EAEAE5] dark:bg-zinc-800"
                          }`}
                        >
                          <span
                            className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                              activeItem.potraceSettings.invert ? "left-6" : "left-1"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Speckle Noise Filter (turdsize) */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[#111111] dark:text-white">
                            Speckle Suppression
                          </label>
                          <span className="text-xs font-mono text-[#6E6D68]">
                            {activeItem.potraceSettings.turdsize}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={activeItem.potraceSettings.turdsize}
                          onChange={(e) =>
                            recomputeActiveItem(undefined, { turdsize: Number(e.target.value) })
                          }
                          className="w-full h-1.5 bg-[#EAEAE5] dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <p className="text-[10px] text-[#9E9D98]">
                          Eliminates tiny dust or raster artifacts
                        </p>
                      </div>

                      {/* Custom Fill Color */}
                      <div className="space-y-2 pt-1">
                        <label className="text-xs font-bold text-[#111111] dark:text-white">
                          Vector Fill Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {COLOR_SWATCHES.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() =>
                                recomputeActiveItem(undefined, { fillColor: color })
                              }
                              className={`h-6 w-6 rounded-full border transition-transform cursor-pointer ${
                                activeItem.potraceSettings.fillColor === color
                                  ? "ring-2 ring-purple-600 scale-110 border-white"
                                  : "border-black/10 hover:scale-105"
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ImageTracer Settings (if mode is ImageTracer or auto-color) */}
                  {activeItem.result?.modeUsed === "imagetracer" && (
                    <div className="space-y-4 pt-2 border-t border-[#F5F4EE] dark:border-zinc-800/80">
                      {/* Number of Colors */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[#111111] dark:text-white">
                            Palette Color Count
                          </label>
                          <span className="text-xs font-mono font-bold text-purple-600">
                            {activeItem.colorSettings.numberOfColors} colors
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[4, 8, 16, 32].map((count) => (
                            <button
                              key={count}
                              type="button"
                              onClick={() =>
                                recomputeActiveItem(undefined, undefined, {
                                  numberOfColors: count,
                                })
                              }
                              className={`py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                activeItem.colorSettings.numberOfColors === count
                                  ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                                  : "border-[#EAEAE5] dark:border-zinc-800 text-[#6E6D68] hover:bg-[#F5F4EE]"
                              }`}
                            >
                              {count}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Preset Selection */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#111111] dark:text-white">
                          Rendering Style
                        </label>
                        <select
                          value={activeItem.colorSettings.preset}
                          onChange={(e) =>
                            recomputeActiveItem(undefined, undefined, {
                              preset: e.target.value as ColorSettings["preset"],
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900 text-xs font-semibold text-[#111111] dark:text-white"
                        >
                          <option value="detailed">Detailed (Sharp Edges)</option>
                          <option value="smoothed">Smoothed (Organic Curves)</option>
                          <option value="posterized1">Posterized (Flat Art)</option>
                          <option value="curvy">Curvy (Fluid Splines)</option>
                        </select>
                      </div>

                      {/* Blur Preprocessing */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[#111111] dark:text-white">
                            Noise Reduction Blur
                          </label>
                          <span className="text-xs font-mono text-[#6E6D68]">
                            {activeItem.colorSettings.blurRadius}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="4"
                          value={activeItem.colorSettings.blurRadius}
                          onChange={(e) =>
                            recomputeActiveItem(undefined, undefined, {
                              blurRadius: Number(e.target.value),
                            })
                          }
                          className="w-full h-1.5 bg-[#EAEAE5] dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* Download Action Card */}
                  <div className="pt-3 border-t border-[#F5F4EE] dark:border-zinc-800/80 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadSvg(activeItem)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#111111] text-white hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download .SVG File</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopySvg}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900 hover:bg-[#F5F4EE] text-xs font-bold text-[#111111] dark:text-white transition-colors cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Raw SVG Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
