"use client";

import React, { useState, useCallback } from "react";
import JSZip from "jszip";
import {
  Sparkles,
  Download,
  Copy,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
  FileCode,
  Layers,
  Code2,
  FileArchive,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DropZone } from "@/components/image-tools/dropzone";
import { ProgressBar } from "@/components/image-tools/progress-bar";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { CheckerBoard } from "@/components/image-tools/checkerboard";
import { formatBytes } from "@/components/image-tools/utils";
import SplitText from "@/components/SplitText";
import {
  cleanSvg,
  DEFAULT_CLEANER_OPTIONS,
  PRESET_OPTIONS,
  type SvgCleanerOptions,
  type SvgCleanerPreset,
  type SvgCleanResult,
} from "@/lib/core/dev/svg-cleaner";

type ToolStage = "idle" | "busy" | "done" | "error";
type ViewMode = "side-by-side" | "cleaned-only" | "original-only";
type CodeTab = "cleaned" | "original" | "react" | "data-uri";

interface ProcessedSvgItem {
  id: string;
  name: string;
  originalSvg: string;
  options: SvgCleanerOptions;
  result?: SvgCleanResult;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
}

export default function SvgCleanerPage() {
  const [stage, setStage] = useState<ToolStage>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [items, setItems] = useState<ProcessedSvgItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pasteInput, setPasteInput] = useState("");
  const [showPasteArea, setShowPasteArea] = useState(false);

  // Settings & View state
  const [globalOptions, setGlobalOptions] = useState<SvgCleanerOptions>({
    ...DEFAULT_CLEANER_OPTIONS,
  });
  const [viewMode, setViewMode] = useState<ViewMode>("side-by-side");
  const [codeTab, setCodeTab] = useState<CodeTab>("cleaned");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [batchProgress, setBatchProgress] = useState({ value: 0, text: "" });

  const activeItem = items[activeIndex];

  // Helper to run cleaning on an item
  const processSvgItem = (item: ProcessedSvgItem): ProcessedSvgItem => {
    try {
      const result = cleanSvg(item.originalSvg, item.options);
      return {
        ...item,
        status: "done",
        result,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "SVG optimization failed";
      return {
        ...item,
        status: "error",
        error: msg,
      };
    }
  };

  // Handle uploaded SVG files
  const handleFilesSelected = async (files: File[]) => {
    const svgFiles = files.filter(
      (f) => f.type === "image/svg+xml" || f.name.toLowerCase().endsWith(".svg")
    );

    if (!svgFiles.length) {
      setErrorMessage("Please select valid .svg vector files.");
      setStage("error");
      return;
    }

    setStage("busy");
    setErrorMessage("");
    setBatchProgress({ value: 10, text: "Reading SVG files..." });

    try {
      const newItems: ProcessedSvgItem[] = [];

      for (let i = 0; i < svgFiles.length; i++) {
        const file = svgFiles[i];
        const text = await file.text();

        newItems.push({
          id: `${file.name}-${Date.now()}-${i}`,
          name: file.name,
          originalSvg: text,
          options: { ...globalOptions },
          status: "pending",
        });
      }

      setBatchProgress({ value: 40, text: "Optimizing SVG vectors..." });

      const processed: ProcessedSvgItem[] = [];
      for (let i = 0; i < newItems.length; i++) {
        setBatchProgress({
          value: Math.round(40 + (i / newItems.length) * 55),
          text: `Minifying ${newItems[i].name} (${i + 1}/${newItems.length})...`,
        });
        const done = processSvgItem(newItems[i]);
        processed.push(done);
      }

      setBatchProgress({ value: 100, text: "Minification complete!" });
      setItems(processed);
      setActiveIndex(0);
      setStage("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load SVGs";
      setErrorMessage(msg);
      setStage("error");
    }
  };

  // Handle direct SVG code paste
  const handleCleanPastedSvg = () => {
    if (!pasteInput.trim()) return;

    if (!pasteInput.includes("<svg")) {
      setErrorMessage("Pasted content does not appear to be a valid <svg> snippet.");
      setStage("error");
      return;
    }

    setStage("busy");
    setErrorMessage("");
    setBatchProgress({ value: 50, text: "Optimizing pasted SVG markup..." });

    try {
      const newItem: ProcessedSvgItem = {
        id: `pasted-svg-${Date.now()}`,
        name: "custom-pasted.svg",
        originalSvg: pasteInput.trim(),
        options: { ...globalOptions },
        status: "pending",
      };

      const done = processSvgItem(newItem);
      setItems([done]);
      setActiveIndex(0);
      setStage("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid SVG code";
      setErrorMessage(msg);
      setStage("error");
    }
  };

  // Recompute active item when options change
  const recomputeActiveItem = useCallback(
    (newPartialOptions: Partial<SvgCleanerOptions>) => {
      if (!activeItem) return;

      const mergedOptions: SvgCleanerOptions = {
        ...activeItem.options,
        ...newPartialOptions,
      };

      const updatedItem: ProcessedSvgItem = {
        ...activeItem,
        options: mergedOptions,
        status: "processing",
      };

      const doneItem = processSvgItem(updatedItem);

      setItems((prev) =>
        prev.map((it, idx) => (idx === activeIndex ? doneItem : it))
      );
      setGlobalOptions(mergedOptions);
    },
    [activeItem, activeIndex]
  );

  // Switch preset
  const handlePresetSelect = (preset: SvgCleanerPreset) => {
    if (preset === "custom") {
      recomputeActiveItem({ preset: "custom" });
      return;
    }

    const presetOverrides = PRESET_OPTIONS[preset];
    recomputeActiveItem({
      preset,
      ...presetOverrides,
    });
  };

  // Copy helpers
  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // Ignore fallback
    }
  };

  // Download single SVG
  const handleDownloadSvg = (item: ProcessedSvgItem) => {
    if (!item.result?.cleanedSvg) return;
    const blob = new Blob([item.result.cleanedSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = item.name.endsWith(".svg") ? item.name : `${item.name}.svg`;
    link.href = url;
    link.download = `min-${safeName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download all as ZIP
  const handleDownloadAllZip = async () => {
    const zip = new JSZip();
    const successfulItems = items.filter((it) => it.result?.cleanedSvg);

    if (!successfulItems.length) return;

    successfulItems.forEach((it) => {
      const safeName = it.name.endsWith(".svg") ? it.name : `${it.name}.svg`;
      zip.file(`min-${safeName}`, it.result!.cleanedSvg);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "infyn-minified-svgs.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset tool
  const handleReset = () => {
    setItems([]);
    setActiveIndex(0);
    setPasteInput("");
    setShowPasteArea(false);
    setZoomLevel(100);
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>SVGO Browser Engine · 100% In-Browser Optimization</span>
          </div>

          <SplitText
            text="SVG Cleaner & Minifier"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] dark:text-white"
            delay={25}
            duration={0.7}
            splitType="words"
          />

          <p className="text-base sm:text-lg text-[#6E6D68] dark:text-[#9E9D98] leading-relaxed max-w-2xl mx-auto">
            Strip Figma, Illustrator, and Inkscape junk, collapse redundant paths, round coordinate precision, and export lightweight SVGs, React components, and CSS Data URIs. Zero cloud uploads.
          </p>
        </div>

        {/* STAGE 1: IDLE */}
        {stage === "idle" && (
          <div className="space-y-8 max-w-3xl mx-auto animate-fade-in-up">
            {/* DropZone for SVG files */}
            <DropZone
              multiple={true}
              accept=".svg,image/svg+xml"
              onFilesSelected={handleFilesSelected}
              title="Drop SVG files here"
              subtitle="or click to browse from your device"
              formatsText="SVG Vector Graphics (Single or Batch Upload)"
            />

            {/* Direct Paste Toggle */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowPasteArea(!showPasteArea)}
                className="text-xs font-bold text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
              >
                {showPasteArea ? "Hide raw SVG pasteboard" : "Or paste raw SVG code directly"}
              </button>
            </div>

            {/* Direct Paste Textarea */}
            {showPasteArea && (
              <div className="p-5 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-[#111111] dark:text-white">
                      Paste SVG Markup
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#9E9D98]">
                    {pasteInput.length} chars
                  </span>
                </div>

                <textarea
                  value={pasteInput}
                  onChange={(e) => setPasteInput(e.target.value)}
                  placeholder="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot;>&#10;  <!-- Paste your raw SVG here -->&#10;</svg>"
                  rows={6}
                  className="w-full p-3.5 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-950 border border-[#EAEAE5] dark:border-zinc-800 text-xs font-mono text-[#111111] dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-y"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCleanPastedSvg}
                    disabled={!pasteInput.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-extrabold hover:bg-black dark:hover:bg-zinc-100 transition-all shadow-xs disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Sparkles className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
                    <span>Clean & Minify Markup</span>
                  </button>
                </div>
              </div>
            )}

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111111] dark:text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Editor Bloat Remover</span>
                </div>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                  Strips Sketch, Figma, Inkscape, and Illustrator namespaces and XML metadata.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111111] dark:text-white">
                  <Layers className="h-4 w-4 text-emerald-600" />
                  <span>Path Collapsing & Precision</span>
                </div>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                  Merges unnecessary groups and rounds floats to 1–2 decimals for huge size drops.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111111] dark:text-white">
                  <FileCode className="h-4 w-4 text-emerald-600" />
                  <span>React & Data URI Export</span>
                </div>
                <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                  1-Click copy as a ready-to-use React JSX component or CSS data URI string.
                </p>
              </div>
            </div>

            <PrivacyBadges
              badges={[
                "100% In-Browser",
                "100% Ad-Free",
                "Zero Cloud Uploads",
                "Free & Unlimited",
              ]}
            />
          </div>
        )}

        {/* STAGE 2: BUSY */}
        {stage === "busy" && (
          <div className="max-w-md mx-auto py-16 space-y-6 text-center animate-fade-in-up">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center shadow-inner">
              <Sparkles className="h-7 w-7 text-emerald-600 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-[#111111] dark:text-white">
                Minifying Vector SVGs...
              </h3>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                Removing metadata, rounding coordinates, and optimizing path definitions locally.
              </p>
            </div>
            <ProgressBar value={batchProgress.value} text={batchProgress.text} />
          </div>
        )}

        {/* STAGE 3: DONE */}
        {stage === "done" && activeItem && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Batch Item Selector (if multiple files) */}
            {items.length > 1 && (
              <div className="p-3 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] flex items-center justify-between gap-4 overflow-x-auto shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#6E6D68] dark:text-zinc-400 pl-2">
                    Batch ({items.length} SVGs):
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {items.map((it, idx) => (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          idx === activeIndex
                            ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-2xs"
                            : "bg-[#F5F4EE] dark:bg-zinc-800/80 text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400"
                        }`}
                      >
                        {it.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer whitespace-nowrap"
                >
                  <FileArchive className="h-3.5 w-3.5" />
                  <span>Download All (ZIP)</span>
                </button>
              </div>
            )}

            {/* Savings & Metrics Banner */}
            {activeItem.result && (
              <div className="p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#111111] dark:text-white">
                        {activeItem.name}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-extrabold">
                        -{activeItem.result.percentSaved.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                      <span>{formatBytes(activeItem.result.originalBytes)}</span>
                      <ArrowRight className="h-3 w-3 text-[#9E9D98]" />
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {formatBytes(activeItem.result.cleanedBytes)}
                      </span>
                      <span>· Saved {formatBytes(activeItem.result.savedBytes)}</span>
                      <span>· in {activeItem.result.timeMs}ms</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadSvg(activeItem)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-extrabold hover:bg-black dark:hover:bg-zinc-100 transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Clean SVG</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeItem.result!.cleanedSvg, "svg")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-all cursor-pointer"
                  >
                    {copiedType === "svg" ? (
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
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-2 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#6E6D68] hover:text-[#111111] dark:hover:text-white transition-all cursor-pointer"
                    title="Clean another SVG"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Main Workspace Layout (2 columns: Preview & Settings) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Visual Preview & Code Inspector (8 cols on lg) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Visual Preview Container */}
                <div className="p-4 sm:p-5 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-4 shadow-2xs">
                  {/* Top Bar: View Mode Switcher + Zoom Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F5F4EE] dark:border-zinc-800/80 pb-3">
                    {/* View mode toggle */}
                    <div className="flex items-center p-1 rounded-xl bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setViewMode("side-by-side")}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          viewMode === "side-by-side"
                            ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                            : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400"
                        }`}
                      >
                        Side-by-Side
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("cleaned-only")}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          viewMode === "cleaned-only"
                            ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                            : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400"
                        }`}
                      >
                        Cleaned Only
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("original-only")}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          viewMode === "original-only"
                            ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                            : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400"
                        }`}
                      >
                        Original
                      </button>
                    </div>

                    {/* Zoom controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setZoomLevel((z) => Math.max(25, z - 25))}
                        className="p-1.5 rounded-lg border border-[#EAEAE5] dark:border-zinc-800 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 transition-all cursor-pointer"
                        title="Zoom out"
                      >
                        <ZoomOut className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-[11px] font-mono font-bold text-[#6E6D68] dark:text-zinc-400 min-w-[40px] text-center">
                        {zoomLevel}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setZoomLevel((z) => Math.min(300, z + 25))}
                        className="p-1.5 rounded-lg border border-[#EAEAE5] dark:border-zinc-800 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 transition-all cursor-pointer"
                        title="Zoom in"
                      >
                        <ZoomIn className="h-3.5 w-3.5" />
                      </button>
                      {zoomLevel !== 100 && (
                        <button
                          type="button"
                          onClick={() => setZoomLevel(100)}
                          className="p-1.5 rounded-lg border border-[#EAEAE5] dark:border-zinc-800 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 transition-all cursor-pointer"
                          title="Reset zoom"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Checkerboard Canvas for Visual Preview */}
                  <CheckerBoard className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden flex items-center justify-center p-4">
                    {/* Side-by-Side View */}
                    {viewMode === "side-by-side" && (
                      <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center">
                        {/* Left: Original SVG */}
                        <div className="flex flex-col items-center justify-center space-y-2 p-3 rounded-2xl border border-[#EAEAE5]/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-sm h-full">
                          <div className="flex items-center justify-between w-full px-1 text-[11px] font-bold text-[#9E9D98] uppercase tracking-wider">
                            <span>Original SVG</span>
                            <span>{formatBytes(activeItem.result?.originalBytes ?? 0)}</span>
                          </div>
                          <div
                            className="flex-1 w-full h-[260px] sm:h-[280px] flex items-center justify-center overflow-hidden transition-transform duration-150"
                            style={{ transform: `scale(${zoomLevel / 100})` }}
                          >
                            <div
                              className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-[260px] sm:[&>svg]:max-h-[280px] [&>svg]:max-w-full [&>svg]:object-contain"
                              dangerouslySetInnerHTML={{ __html: activeItem.originalSvg }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-[#9E9D98]">
                            Unminified Markup
                          </span>
                        </div>

                        {/* Right: Cleaned SVG */}
                        <div className="flex flex-col items-center justify-center space-y-2 p-3 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm h-full shadow-2xs">
                          <div className="flex items-center justify-between w-full px-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="h-3 w-3" />
                              <span>Cleaned SVG</span>
                            </span>
                            <span>{formatBytes(activeItem.result?.cleanedBytes ?? 0)}</span>
                          </div>
                          <div
                            className="flex-1 w-full h-[260px] sm:h-[280px] flex items-center justify-center overflow-hidden transition-transform duration-150"
                            style={{ transform: `scale(${zoomLevel / 100})` }}
                          >
                            {activeItem.result?.cleanedSvg ? (
                              <div
                                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-[260px] sm:[&>svg]:max-h-[280px] [&>svg]:max-w-full [&>svg]:object-contain"
                                dangerouslySetInnerHTML={{ __html: activeItem.result.cleanedSvg }}
                              />
                            ) : null}
                          </div>
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                            Zero Visual Difference · 100% Crisp
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Cleaned Only View */}
                    {viewMode === "cleaned-only" && (
                      <div
                        className="relative z-10 w-full h-[340px] sm:h-[400px] flex items-center justify-center transition-transform duration-150"
                        style={{ transform: `scale(${zoomLevel / 100})` }}
                      >
                        {activeItem.result?.cleanedSvg ? (
                          <div
                            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-[340px] sm:[&>svg]:max-h-[400px] [&>svg]:max-w-full [&>svg]:object-contain"
                            dangerouslySetInnerHTML={{ __html: activeItem.result.cleanedSvg }}
                          />
                        ) : null}
                      </div>
                    )}

                    {/* Original Only View */}
                    {viewMode === "original-only" && (
                      <div
                        className="relative z-10 w-full h-[340px] sm:h-[400px] flex items-center justify-center transition-transform duration-150"
                        style={{ transform: `scale(${zoomLevel / 100})` }}
                      >
                        <div
                          className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-[340px] sm:[&>svg]:max-h-[400px] [&>svg]:max-w-full [&>svg]:object-contain"
                          dangerouslySetInnerHTML={{ __html: activeItem.originalSvg }}
                        />
                      </div>
                    )}
                  </CheckerBoard>
                </div>

                {/* Code Inspector & Multi-Format Snippets */}
                {activeItem.result && (
                  <div className="p-5 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-4 shadow-2xs">
                    {/* Tabs Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F5F4EE] dark:border-zinc-800/80 pb-3">
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setCodeTab("cleaned")}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            codeTab === "cleaned"
                              ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                              : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400"
                          }`}
                        >
                          Cleaned SVG ({formatBytes(activeItem.result.cleanedBytes)})
                        </button>
                        <button
                          type="button"
                          onClick={() => setCodeTab("original")}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            codeTab === "original"
                              ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                              : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400"
                          }`}
                        >
                          Original ({formatBytes(activeItem.result.originalBytes)})
                        </button>
                        <button
                          type="button"
                          onClick={() => setCodeTab("react")}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            codeTab === "react"
                              ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                              : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400"
                          }`}
                        >
                          React JSX
                        </button>
                        <button
                          type="button"
                          onClick={() => setCodeTab("data-uri")}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            codeTab === "data-uri"
                              ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                              : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400"
                          }`}
                        >
                          CSS Data URI
                        </button>
                      </div>

                      {/* Action Button for current tab */}
                      <div>
                        {codeTab === "cleaned" && (
                          <button
                            type="button"
                            onClick={() => handleCopy(activeItem.result!.cleanedSvg, "cleaned")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 text-xs font-bold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-all cursor-pointer"
                          >
                            {copiedType === "cleaned" ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied SVG!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy Cleaned SVG</span>
                              </>
                            )}
                          </button>
                        )}
                        {codeTab === "original" && (
                          <button
                            type="button"
                            onClick={() => handleCopy(activeItem.originalSvg, "original")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 text-xs font-bold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-all cursor-pointer"
                          >
                            {copiedType === "original" ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy Original</span>
                              </>
                            )}
                          </button>
                        )}
                        {codeTab === "react" && (
                          <button
                            type="button"
                            onClick={() => handleCopy(activeItem.result!.reactSnippet, "react")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 text-xs font-bold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-all cursor-pointer"
                          >
                            {copiedType === "react" ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied JSX!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy React Component</span>
                              </>
                            )}
                          </button>
                        )}
                        {codeTab === "data-uri" && (
                          <button
                            type="button"
                            onClick={() => handleCopy(activeItem.result!.dataUri, "data-uri")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 text-xs font-bold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-all cursor-pointer"
                          >
                            {copiedType === "data-uri" ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied Data URI!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy Data URI</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Code Display Area */}
                    <pre className="p-4 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-950 border border-[#EAEAE5] dark:border-zinc-800 text-[11px] font-mono text-[#111111] dark:text-zinc-200 overflow-x-auto max-h-60 leading-relaxed custom-scrollbar select-all">
                      <code>
                        {codeTab === "cleaned" && activeItem.result.cleanedSvg}
                        {codeTab === "original" && activeItem.originalSvg}
                        {codeTab === "react" && activeItem.result.reactSnippet}
                        {codeTab === "data-uri" && activeItem.result.dataUri}
                      </code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Right Column: Cleaner Rules & Optimization Settings (4 cols on lg) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-5 shadow-2xs">
                  {/* Panel Header */}
                  <div className="flex items-center justify-between border-b border-[#F5F4EE] dark:border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-[#111111] dark:text-white" />
                      <h3 className="font-extrabold text-sm text-[#111111] dark:text-white">
                        Optimizer Settings
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-[#9E9D98]">
                      SVGO Engine
                    </span>
                  </div>

                  {/* Preset Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6E6D68] dark:text-zinc-400">
                      Optimization Preset
                    </label>

                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 text-[11px] font-bold">
                      {(["recommended", "aggressive", "safe", "custom"] as SvgCleanerPreset[]).map(
                        (p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => handlePresetSelect(p)}
                            className={`py-1.5 px-2 rounded-lg capitalize transition-all cursor-pointer ${
                              activeItem.options.preset === p
                                ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                                : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400"
                            }`}
                          >
                            {p === "recommended" ? "Recommended" : p}
                          </button>
                        )
                      )}
                    </div>

                    <p className="text-[11px] text-[#9E9D98] leading-tight pt-0.5">
                      {activeItem.options.preset === "recommended" &&
                        "Balanced: Strips editor bloat, unused defs, and rounds floats to 2 decimal places."}
                      {activeItem.options.preset === "aggressive" &&
                        "Max compression: Rounds coordinates to 1 decimal place and removes title/desc."}
                      {activeItem.options.preset === "safe" &&
                        "Gentle cleanup: Strips editor metadata while preserving IDs, classes, and defs."}
                      {activeItem.options.preset === "custom" &&
                        "Fine-tune individual SVGO optimization rules below."}
                    </p>
                  </div>

                  {/* Coordinate Precision Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-[#6E6D68] dark:text-zinc-400">
                        Float Precision
                      </label>
                      <span className="font-mono font-bold text-[#111111] dark:text-white">
                        {activeItem.options.precision} decimals
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={activeItem.options.precision}
                      onChange={(e) =>
                        recomputeActiveItem({ precision: parseInt(e.target.value, 10) })
                      }
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#9E9D98]">
                      <span>1 (Smaller file)</span>
                      <span>5 (Exact curves)</span>
                    </div>
                  </div>

                  {/* Output Format Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#6E6D68] dark:text-zinc-400">
                      Output Formatting
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => recomputeActiveItem({ outputFormat: "minified" })}
                        className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                          activeItem.options.outputFormat === "minified"
                            ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                            : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400"
                        }`}
                      >
                        Minified (1-line)
                      </button>
                      <button
                        type="button"
                        onClick={() => recomputeActiveItem({ outputFormat: "pretty" })}
                        className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                          activeItem.options.outputFormat === "pretty"
                            ? "bg-white dark:bg-zinc-800 text-[#111111] dark:text-white shadow-2xs"
                            : "text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400"
                        }`}
                      >
                        Pretty XML
                      </button>
                    </div>
                  </div>

                  {/* Granular Feature Toggles (Visible in Custom or as accordion) */}
                  <div className="border-t border-[#F5F4EE] dark:border-zinc-800/80 pt-3 space-y-2.5">
                    <span className="text-[11px] font-bold text-[#6E6D68] dark:text-zinc-400 uppercase tracking-wider block">
                      Active Cleaning Rules
                    </span>

                    <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                      <span className="text-[#111111] dark:text-zinc-300">
                        Remove Editor Namespaces
                      </span>
                      <input
                        type="checkbox"
                        checked={activeItem.options.removeEditorData}
                        onChange={(e) =>
                          recomputeActiveItem({
                            preset: "custom",
                            removeEditorData: e.target.checked,
                          })
                        }
                        className="rounded accent-emerald-600 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                      <span className="text-[#111111] dark:text-zinc-300">
                        Strip Comments & Metadata
                      </span>
                      <input
                        type="checkbox"
                        checked={activeItem.options.removeComments}
                        onChange={(e) =>
                          recomputeActiveItem({
                            preset: "custom",
                            removeComments: e.target.checked,
                            removeMetadata: e.target.checked,
                          })
                        }
                        className="rounded accent-emerald-600 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                      <span className="text-[#111111] dark:text-zinc-300">
                        Collapse Redundant Groups
                      </span>
                      <input
                        type="checkbox"
                        checked={activeItem.options.collapseGroups}
                        onChange={(e) =>
                          recomputeActiveItem({
                            preset: "custom",
                            collapseGroups: e.target.checked,
                          })
                        }
                        className="rounded accent-emerald-600 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                      <span className="text-[#111111] dark:text-zinc-300">
                        Remove Unused &lt;defs&gt;
                      </span>
                      <input
                        type="checkbox"
                        checked={activeItem.options.removeUnusedDefs}
                        onChange={(e) =>
                          recomputeActiveItem({
                            preset: "custom",
                            removeUnusedDefs: e.target.checked,
                          })
                        }
                        className="rounded accent-emerald-600 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                      <span className="text-[#111111] dark:text-zinc-300">
                        Minify & Clean IDs
                      </span>
                      <input
                        type="checkbox"
                        checked={activeItem.options.cleanupIds}
                        onChange={(e) =>
                          recomputeActiveItem({
                            preset: "custom",
                            cleanupIds: e.target.checked,
                          })
                        }
                        className="rounded accent-emerald-600 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                      <span className="text-[#111111] dark:text-zinc-300">
                        Strip &lt;title&gt; and &lt;desc&gt;
                      </span>
                      <input
                        type="checkbox"
                        checked={activeItem.options.removeTitleDesc}
                        onChange={(e) =>
                          recomputeActiveItem({
                            preset: "custom",
                            removeTitleDesc: e.target.checked,
                          })
                        }
                        className="rounded accent-emerald-600 cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* Primary Download Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadSvg(activeItem)}
                      className="w-full py-3 px-4 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-zinc-100 transition-all shadow-sm cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download .SVG File</span>
                    </button>
                  </div>
                </div>

                {/* Privacy Callout */}
                <div className="p-4 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white/60 dark:bg-[#141417]/60 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-xs text-[#6E6D68] dark:text-zinc-400">
                    SVGs are parsed and cleaned directly in your browser memory. No code leaves your computer.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: ERROR */}
        {stage === "error" && (
          <div className="max-w-md mx-auto p-6 rounded-3xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-center space-y-4 animate-fade-in-up">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-red-900 dark:text-red-300">
                Failed to Optimize SVG
              </h3>
              <p className="text-xs text-red-700 dark:text-red-400">
                {errorMessage || "An unexpected error occurred while processing the SVG markup."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold hover:bg-black transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
