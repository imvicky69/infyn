"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { ProgressBar } from "@/components/image-tools/progress-bar";
import SplitText from "@/components/SplitText";
import { formatBytes } from "@/components/image-tools/utils";
import {
  CompressorConfig,
  CompressorItem,
  CompressionPreset,
} from "@/components/pdf-tools/compressor/types";
import { compressPdfBatch } from "@/components/pdf-tools/compressor/compression-engine";
import { CompareModal } from "@/components/pdf-tools/compressor/compare-modal";
import {
  Minimize2,
  FileText,
  Download,
  Eye,
  Sliders,
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";

type Stage = "idle" | "busy" | "done" | "error";

const PRESET_OPTIONS: {
  id: CompressionPreset;
  label: string;
  badge: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  {
    id: "recommended",
    label: "Recommended",
    badge: "50–80% Cut",
    desc: "Balanced size and sharp readability",
    icon: Sparkles,
  },
  {
    id: "extreme",
    label: "Extreme",
    badge: "Max Reduction",
    desc: "Smallest size for strict portal limits",
    icon: Zap,
  },
  {
    id: "high",
    label: "High Quality",
    badge: "Print Ready",
    desc: "Preserves fine graphics & crisp photos",
    icon: FileText,
  },
  {
    id: "target",
    label: "Target Size",
    badge: "Exact KB",
    desc: "Compress to fit under a specific KB limit",
    icon: Target,
  },
  {
    id: "lossless",
    label: "Lossless",
    badge: "Structure Only",
    desc: "Strips unneeded metadata without rasterizing",
    icon: ShieldCheck,
  },
  {
    id: "custom",
    label: "Custom",
    badge: "Sliders",
    desc: "Manual DPI scale & JPEG quality",
    icon: Sliders,
  },
];

const FAQS = [
  {
    q: "How does in-browser PDF compression work without uploading files?",
    a: "Infyn executes Mozilla's PDF.js and PDF-Lib engines entirely inside your web browser's memory. The PDF is parsed, optimized, and re-encoded locally using your computer's own processor. Zero bytes ever leave your device or get sent to any server.",
  },
  {
    q: "Can I compress a PDF to under 200KB or 500KB for government/job portals?",
    a: "Yes! Choose the 'Target Size' preset or 'Extreme' mode. You can enter an exact target limit (like 200 KB or 500 KB) and our engine automatically calculates the optimal resolution and quality scaling to fit your budget.",
  },
  {
    q: "Will compressing a PDF make the text unreadable?",
    a: "No. Our 'Recommended' preset is tuned to keep text crystal clear while compressing embedded high-DPI photos and scanned images that take up 80-90% of file size. You can also inspect the visual clarity using our interactive Before/After preview comparator before downloading.",
  },
  {
    q: "Is it safe to compress confidential PDFs like contracts and bank statements?",
    a: "Absolutely. Because processing happens 100% locally on your machine, Infyn is compliant with strict privacy requirements. There are no remote logs, no cloud storage buckets, and no telemetry tracking your document contents.",
  },
  {
    q: "How many PDF files can I compress at once?",
    a: "Infyn is batch-first with zero artificial limits. You can drag and drop dozens of PDF documents at once and download all optimized files in a single, organized ZIP archive with 1 click.",
  },
];

export default function PdfCompressorPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [items, setItems] = useState<CompressorItem[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);

  // Compression config
  const [config, setConfig] = useState<CompressorConfig>({
    preset: "recommended",
    quality: 0.72,
    dpiScale: 1.4,
    targetSizeKb: 500,
  });

  // Progress state
  const [progressText, setProgressText] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Comparator modal
  const [selectedForCompare, setSelectedForCompare] = useState<CompressorItem | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Core Processing Handler ── */
  const runCompression = useCallback(
    async (files: File[], currentConfig: CompressorConfig) => {
      if (files.length === 0) return;
      setStage("busy");
      setErrorMsg(null);
      setProgressValue(5);
      setProgressText("Initializing in-browser compression engine…");

      try {
        const compressed = await compressPdfBatch(files, currentConfig, (text, percent) => {
          setProgressText(text);
          setProgressValue(percent);
        });

        const hasErrors = compressed.every((item) => item.status === "error");
        if (hasErrors) {
          setErrorMsg("Could not compress the selected PDF files. Make sure they are not password-protected.");
          setStage("error");
          return;
        }

        setItems(compressed);
        setStage("done");
      } catch (err: any) {
        console.error("Batch compression failed:", err);
        setErrorMsg(err?.message || "An unexpected error occurred during compression.");
        setStage("error");
      }
    },
    []
  );

  /* ── Handle New Files Selected ── */
  const handleFilesSelected = useCallback(
    async (selected: File[]) => {
      const validPdfs = selected.filter(
        (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
      );

      if (validPdfs.length === 0) {
        setErrorMsg("Please select valid PDF documents (.pdf).");
        setStage("error");
        return;
      }

      const combinedFiles = [...rawFiles, ...validPdfs];
      setRawFiles(combinedFiles);
      await runCompression(combinedFiles, config);
    },
    [rawFiles, config, runCompression]
  );

  /* ── Preset / Config Change Handler ── */
  const handleConfigChange = async (newConfig: CompressorConfig) => {
    setConfig(newConfig);
    if (rawFiles.length > 0 && (stage === "done" || stage === "idle")) {
      await runCompression(rawFiles, newConfig);
    }
  };

  /* ── Remove Single Item ── */
  const handleRemoveItem = (id: string) => {
    const nextItems = items.filter((it) => it.id !== id);
    const nextRaw = rawFiles.filter((_, idx) => items[idx]?.id !== id);
    setItems(nextItems);
    setRawFiles(nextRaw);
    if (nextItems.length === 0) {
      setStage("idle");
    }
  };

  /* ── Reset Everything ── */
  const handleReset = () => {
    setStage("idle");
    setItems([]);
    setRawFiles([]);
    setProgressValue(0);
    setProgressText("");
    setErrorMsg(null);
    setSelectedForCompare(null);
  };

  /* ── 1-Click ZIP Download ── */
  const handleDownloadAllZip = async () => {
    const validDoneItems = items.filter((it) => it.status === "done" && it.blob);
    if (validDoneItems.length === 0) return;

    setIsZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      validDoneItems.forEach((item) => {
        if (item.blob) {
          const cleanName = item.name.replace(/\.pdf$/i, "");
          zip.file(`${cleanName}-compressed.pdf`, item.blob);
        }
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `infyn-compressed-pdfs-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP creation failed:", err);
    } finally {
      setIsZipping(false);
    }
  };

  /* ── Metrics Calculations ── */
  const totalOriginalSize = items.reduce((acc, it) => acc + it.originalSize, 0);
  const totalCompressedSize = items.reduce(
    (acc, it) => acc + (it.status === "done" ? it.compressedSize : it.originalSize),
    0
  );
  const totalSavedBytes = Math.max(0, totalOriginalSize - totalCompressedSize);
  const overallSavedPercentage =
    totalOriginalSize > 0 ? Math.round((totalSavedBytes / totalOriginalSize) * 100) : 0;

  return (
    <div className="min-h-screen text-[#111111] flex flex-col font-sans selection:bg-[#E8E6DE] selection:text-black">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col py-8 space-y-12">
        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-[14px] bg-gradient-to-br from-indigo-100 to-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-700 shadow-2xs">
              <Minimize2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-[-0.025em]">
                PDF Compressor
              </h1>
              <p className="text-[12px] text-[#9E9D98] tracking-[-0.005em]">
                Reduce file size up to 90% · Target KB mode · 1-Click ZIP · 100% In-Browser
              </p>
            </div>
          </div>
        </div>

        {/* ── Stage 1: IDLE ───────────────────────────────────────── */}
        {stage === "idle" && (
          <div
            className="flex-1 flex flex-col items-center justify-center py-6 gap-8"
            style={{ animation: "fade-in-up 0.35s ease-out" }}
          >
            <div className="text-center space-y-3 max-w-xl">
              <SplitText
                text="Compress PDF Documents"
                className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-[#111111]"
                delay={30}
                duration={0.8}
                splitType="words, chars"
                tag="h2"
                textAlign="center"
              />
              <p className="text-sm text-[#6E6D68] leading-relaxed">
                Drastically shrink PDF file sizes for email attachments and portal uploads without sacrificing text clarity.
              </p>
            </div>

            <div className="w-full max-w-xl">
              <DropZone
                multiple={true}
                accept="application/pdf,.pdf"
                onFilesSelected={handleFilesSelected}
                title="Drop PDF documents here to compress"
                subtitle="or click to browse from device — batch uploads supported"
                formatsText="PDF documents only · Zero cloud uploads"
              />
            </div>

            {/* Presets preview pill badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
              {PRESET_OPTIONS.slice(0, 4).map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EAEAE5] text-xs font-semibold text-[#6E6D68] shadow-2xs"
                  >
                    <Icon className="h-3.5 w-3.5 text-[#111111]" />
                    <span className="text-[#111111]">{p.label}</span>
                    <span className="text-[10px] text-[#9E9D98] font-normal">({p.badge})</span>
                  </div>
                );
              })}
            </div>

            <PrivacyBadges
              badges={[
                "100% In-browser",
                "Zero cloud uploads",
                "No watermarks",
                "Unlimited batch files",
              ]}
            />
          </div>
        )}

        {/* ── Stage 2: BUSY ───────────────────────────────────────── */}
        {stage === "busy" && (
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-3xl border border-[#EAEAE5] shadow-xs text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-700 animate-pulse">
                <Minimize2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#111111]">Optimizing Documents</h3>
                <p className="text-xs text-[#6E6D68]">{progressText}</p>
              </div>
              <ProgressBar value={progressValue} text={`${progressValue}% complete`} />
            </div>
          </div>
        )}

        {/* ── Stage 3: DONE ───────────────────────────────────────── */}
        {stage === "done" && items.length > 0 && (
          <div className="space-y-8" style={{ animation: "fade-in-up 0.3s ease-out" }}>
            {/* ── Control Bar: Presets & Settings ── */}
            <div className="rounded-3xl border border-[#EAEAE5] bg-white p-5 sm:p-6 space-y-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F4EE] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
                    Compression Preset
                  </span>
                  <h3 className="text-base font-bold text-[#111111] mt-0.5">
                    Select Optimization Level
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] text-xs font-semibold text-[#111111] hover:bg-[#F5F4EE] transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add More</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFilesSelected(Array.from(e.target.files));
                      }
                      e.target.value = "";
                    }}
                  />

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/50 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Preset Selection Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {PRESET_OPTIONS.map((opt) => {
                  const isSelected = config.preset === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleConfigChange({ ...config, preset: opt.id })}
                      className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#111111] border-[#111111] text-white shadow-xs"
                          : "bg-white border-[#EAEAE5] text-[#111111] hover:border-[#BEBDB9] hover:bg-[#FBFBFA]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-[#111111]"}`} />
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-[#F5F4EE] text-[#6E6D68]"
                          }`}
                        >
                          {opt.badge}
                        </span>
                      </div>
                      <span className="text-xs font-bold leading-tight">{opt.label}</span>
                      <span
                        className={`text-[10px] line-clamp-1 mt-0.5 ${
                          isSelected ? "text-white/70" : "text-[#9E9D98]"
                        }`}
                      >
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Conditional Sub-settings for Target Size or Custom */}
              {config.preset === "target" && (
                <div
                  className="p-4 rounded-2xl bg-[#F8F8F6] border border-[#EAEAE5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  style={{ animation: "fade-in-up 0.2s ease-out" }}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#111111]">Max Target File Size</p>
                    <p className="text-[11px] text-[#6E6D68]">
                      Common portal limits: 200 KB, 500 KB, 1024 KB (1 MB)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {[200, 500, 1024, 2048].map((sizeKb) => (
                      <button
                        key={sizeKb}
                        type="button"
                        onClick={() =>
                          handleConfigChange({ ...config, targetSizeKb: sizeKb })
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          config.targetSizeKb === sizeKb
                            ? "bg-[#111111] text-white border-[#111111]"
                            : "bg-white text-[#111111] border-[#EAEAE5] hover:bg-[#F5F4EE]"
                        }`}
                      >
                        {sizeKb < 1024 ? `${sizeKb} KB` : `${sizeKb / 1024} MB`}
                      </button>
                    ))}

                    <div className="flex items-center gap-1 bg-white border border-[#EAEAE5] rounded-xl px-2.5 py-1 text-xs">
                      <input
                        type="number"
                        min="50"
                        max="20000"
                        value={config.targetSizeKb}
                        onChange={(e) =>
                          setConfig({ ...config, targetSizeKb: Number(e.target.value) })
                        }
                        className="w-16 text-center font-bold text-[#111111] focus:outline-none"
                      />
                      <span className="text-[#9E9D98] font-semibold">KB</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleConfigChange(config)}
                      className="p-1.5 rounded-xl bg-[#111111] text-white hover:bg-[#262626] transition-all"
                      title="Apply Target Size"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {config.preset === "custom" && (
                <div
                  className="p-4 rounded-2xl bg-[#F8F8F6] border border-[#EAEAE5] grid grid-cols-1 sm:grid-cols-2 gap-4"
                  style={{ animation: "fade-in-up 0.2s ease-out" }}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-[#111111]">
                      <span>Image Quality</span>
                      <span>{Math.round(config.quality * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="0.95"
                      step="0.05"
                      value={config.quality}
                      onChange={(e) =>
                        setConfig({ ...config, quality: parseFloat(e.target.value) })
                      }
                      className="w-full h-1.5 accent-[#111111] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#9E9D98]">
                      <span>Higher compression</span>
                      <span>Maximum clarity</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-[#111111]">
                      <span>Resolution (DPI Scale)</span>
                      <span>{config.dpiScale}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="2.2"
                      step="0.1"
                      value={config.dpiScale}
                      onChange={(e) =>
                        setConfig({ ...config, dpiScale: parseFloat(e.target.value) })
                      }
                      className="w-full h-1.5 accent-[#111111] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#9E9D98]">
                      <span>72 DPI (Compact)</span>
                      <span>150+ DPI (HD)</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleConfigChange(config)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-[#262626] transition-all cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Re-compress with Custom Values</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Summary Stats Banner ── */}
            <div className="rounded-2xl border border-[#EAEAE5] bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#111111]">
                      {items.length} {items.length === 1 ? "PDF" : "PDFs"} Compressed
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Saved {overallSavedPercentage}%
                    </span>
                  </div>
                  <p className="text-xs text-[#6E6D68]">
                    {formatBytes(totalOriginalSize)} →{" "}
                    <span className="font-bold text-[#111111]">
                      {formatBytes(totalCompressedSize)}
                    </span>{" "}
                    (Saved {formatBytes(totalSavedBytes)})
                  </p>
                </div>
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  disabled={isZipping}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-[#262626] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
                >
                  {isZipping ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating ZIP…</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Download All as ZIP</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* ── Item Cards Grid ── */}
            <div className="space-y-3">
              {items.map((item) => {
                const isSuccess = item.status === "done";
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#EAEAE5] bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#BEBDB9] transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="h-11 w-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[#111111] truncate max-w-xs sm:max-w-md">
                            {item.name}
                          </p>
                          {isSuccess && item.savedPercentage > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                              -{item.savedPercentage}%
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#6E6D68] mt-0.5">
                          {formatBytes(item.originalSize)} →{" "}
                          <span className="font-bold text-[#111111]">
                            {formatBytes(item.compressedSize)}
                          </span>
                          {item.pageCount > 0 && ` • ${item.pageCount} pages`}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {isSuccess && item.originalPreview && (
                        <button
                          type="button"
                          onClick={() => setSelectedForCompare(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] text-xs font-semibold text-[#111111] hover:bg-[#F5F4EE] transition-all cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#6E6D68]" />
                          <span>Compare</span>
                        </button>
                      )}

                      {isSuccess && item.blob && (
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(item.blob!);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `compressed-${item.name}`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-[#262626] active:scale-95 transition-all shadow-xs cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 rounded-xl border border-[#EAEAE5] text-[#9E9D98] hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Stage 4: ERROR ──────────────────────────────────────── */}
        {stage === "error" && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-8 flex flex-col items-center gap-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900">Compression Failed</h3>
              <p className="text-xs text-rose-700 mt-1 max-w-sm">
                {errorMsg || "Could not compress the selected documents. Please verify the file is not corrupted."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-800 active:scale-95 transition-all cursor-pointer"
            >
              Try Another PDF
            </button>
          </div>
        )}

        {/* ── Interactive Comparator Modal ── */}
        <CompareModal
          item={selectedForCompare}
          onClose={() => setSelectedForCompare(null)}
        />

        {/* ── SEO Section: How Compression Works & Presets ──────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
              Document Engineering
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
              How In-Browser PDF Compression Works
            </h2>
            <p className="text-xs text-[#6E6D68] leading-relaxed">
              PDF files typically balloon in size due to uncompressed scanned images, embedded print-resolution photos, and duplicate font tables. Infyn applies advanced multi-strategy optimization locally on your machine:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-2 p-4 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5]">
              <div className="h-8 w-8 rounded-xl bg-white border border-[#EAEAE5] flex items-center justify-center text-indigo-700 shadow-2xs">
                <Zap className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#111111]">Raster & Scan Downsampling</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                Renders heavy pages at target DPI (72–150 DPI) and applies optimal JPEG quantization to remove megabytes of hidden visual bloat.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5]">
              <div className="h-8 w-8 rounded-xl bg-white border border-[#EAEAE5] flex items-center justify-center text-emerald-700 shadow-2xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#111111]">Stream & Object Compaction</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                Strips orphaned objects, duplicate metadata streams, and packs PDF cross-reference tables into compressed object streams.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5]">
              <div className="h-8 w-8 rounded-xl bg-white border border-[#EAEAE5] flex items-center justify-center text-rose-700 shadow-2xs">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#111111]">Target Size Budgeting</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                Dynamically allocates bytes per page to guarantee documents easily slip under strict 200KB or 500KB portal upload limits.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ Section ─────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="border-b border-[#EAEAE5] pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
              Help & Frequently Asked Questions
            </span>
            <h2 className="text-lg font-bold text-[#111111] mt-0.5">
              PDF Compression FAQs
            </h2>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-[#EAEAE5] bg-white overflow-hidden shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FBFBFA] transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-[#111111]">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[#9E9D98] shrink-0"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-4 text-xs text-[#6E6D68] leading-relaxed border-t border-[#F5F4EE] pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Privacy Badges Footer Strip ─────────────────────────── */}
        <PrivacyBadges
          badges={[
            "100% In-browser",
            "Files never leave your machine",
            "No upload bottlenecks",
            "Zero watermarks & free forever",
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
