"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { formatBytes } from "@/components/image-tools/utils";
import {
  ResizeSettings,
  ResizedFileResult,
  resizeImage,
  FitMode,
  BgStyle,
  TargetFormat,
  TransformSettings,
} from "@/components/image-tools/resizer/resize-engine";
import {
  PRESET_CATEGORIES,
  ResizePreset,
} from "@/components/image-tools/resizer/preset-options";
import { ResizerItemCard } from "@/components/image-tools/resizer/resizer-item-card";
import {
  setPipelineImage,
  getPipelineImage,
} from "@/components/image-tools/pipeline-storage";
import { ContinuePipelineBar } from "@/components/image-tools/continue-pipeline-bar";
import SplitText from "@/components/SplitText";

// ─── Universal Safe Download Helper ──────────────────────────────────────────
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

// ─── Vector SVG Icons ─────────────────────────────────────────────────────────
function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YouTubeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M2.5 17a24.12 24.12 0 010-10 2 2 0 011.4-1.4 49.56 49.56 0 0116.2 0A2 2 0 0121.5 7a24.12 24.12 0 010 10 2 2 0 01-1.4 1.4 49.55 49.55 0 01-16.2 0A2 2 0 012.5 17z" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

function FaviconIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function CustomIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="21" y2="21" />
      <line x1="4" x2="20" y1="14" y2="14" />
      <line x1="4" x2="20" y1="7" y2="7" />
      <circle cx="9" cy="21" r="2" fill="currentColor" />
      <circle cx="15" cy="14" r="2" fill="currentColor" />
      <circle cx="9" cy="7" r="2" fill="currentColor" />
    </svg>
  );
}

function EyeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

const DEFAULT_SETTINGS: ResizeSettings = {
  mode: "dimensions",
  width: 1080,
  height: 1080,
  percentage: 100,
  maintainAspectRatio: false,
  fitMode: "cover",
  bgStyle: "blur",
  bgColor: "#ffffff",
  format: "original",
  quality: 0.9,
};

export default function ImageResizerPage() {
  const router = useRouter();
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [settings, setSettings] = useState<ResizeSettings>(DEFAULT_SETTINGS);
  const [items, setItems] = useState<ResizedFileResult[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("instagram");
  const [activePresetId, setActivePresetId] = useState<string | null>("ig-square");
  const [originalRatio, setOriginalRatio] = useState<number>(1);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [showCropGrid, setShowCropGrid] = useState<boolean>(false);

  // ── Move, Zoom & Flip Subject Transform State ──────────────────────────────
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, posX: 0, posY: 0 });

  // ── Non-passive Wheel listener on preview container for smooth zooming ────
  useEffect(() => {
    const el = previewBoxRef.current;
    if (!el || rawFiles.length === 0) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.06 : 0.94;
      setScale((prev) => {
        const next = Math.min(3.5, Math.max(0.2, Number((prev * zoomFactor).toFixed(2))));
        return next;
      });
    };

    el.addEventListener("wheel", handleWheelNative, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheelNative);
    };
  }, [rawFiles.length]);

  // ── Build current transform settings ───────────────────────────────────────
  const getTransformSettings = useCallback((): TransformSettings => {
    const previewEl = previewBoxRef.current;
    const rect = previewEl?.getBoundingClientRect();
    return {
      panX,
      panY,
      scale,
      flipH,
      previewWidth: rect?.width || 300,
      previewHeight: rect?.height || 300,
    };
  }, [panX, panY, scale, flipH]);

  // ── Process raw files into resized results ─────────────────────────────────
  const processFiles = useCallback(
    async (files: File[], currentSettings: ResizeSettings) => {
      if (files.length === 0) return;
      setIsProcessing(true);

      try {
        const transform = getTransformSettings();
        const settingsWithTransform: ResizeSettings = {
          ...currentSettings,
          transform,
        };

        const results = await Promise.all(
          files.map(async (file) => {
            try {
              return await resizeImage(file, settingsWithTransform);
            } catch (err) {
              console.error("Failed to resize file:", file.name, err);
              return null;
            }
          })
        );

        const valid = results.filter((r): r is ResizedFileResult => r !== null);
        setItems(valid);
      } finally {
        setIsProcessing(false);
      }
    },
    [getTransformSettings]
  );

  // ── Trigger background update with debounce ────────────────────────────────
  const triggerResizeUpdate = useCallback(
    (newSettings: ResizeSettings) => {
      if (rawFiles.length === 0) return;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

      debounceTimerRef.current = setTimeout(() => {
        processFiles(rawFiles, newSettings);
      }, 100);
    },
    [rawFiles, processFiles]
  );

  // Sync transform changes to export items when user stops dragging or changes scale/flip
  useEffect(() => {
    if (rawFiles.length === 0 || isDragging) return;
    triggerResizeUpdate(settings);
  }, [scale, flipH, isDragging, settings.bgStyle, settings.bgColor, settings.fitMode]);

  // ── Pointer Drag Handlers for Repositioning (Pan) ──────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    if (rawFiles.length === 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    setShowCropGrid(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      posX: panX,
      posY: panY,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setPanX(dragStart.posX + dx);
    setPanY(dragStart.posY + dy);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      setShowCropGrid(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // noop
      }
      triggerResizeUpdate(settings);
    }
  };

  const handleResetTransform = () => {
    setPanX(0);
    setPanY(0);
    setScale(1);
    setFlipH(false);
  };

  // Quick alignment anchors
  const handleAlign = (dir: "center" | "left" | "right" | "top" | "bottom") => {
    const previewEl = previewBoxRef.current;
    const rect = previewEl?.getBoundingClientRect();
    const w = rect?.width || 300;
    const h = rect?.height || 300;

    if (dir === "center") {
      setPanX(0);
      setPanY(0);
    } else if (dir === "left") {
      setPanX(Math.round(w * 0.25));
    } else if (dir === "right") {
      setPanX(-Math.round(w * 0.25));
    } else if (dir === "top") {
      setPanY(Math.round(h * 0.25));
    } else if (dir === "bottom") {
      setPanY(-Math.round(h * 0.25));
    }
  };

  // ── Handle new file selection ──────────────────────────────────────────────
  const handleFilesSelected = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    const firstFile = newFiles[0];
    const img = new Image();
    const url = URL.createObjectURL(firstFile);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.naturalWidth || 1080;
      const h = img.naturalHeight || 1080;
      const ratio = w / h;
      setOriginalRatio(ratio);

      let initialSettings = { ...settings };
      if (!activePresetId) {
        initialSettings = {
          ...initialSettings,
          width: w,
          height: h,
        };
        setSettings(initialSettings);
      }

      const combined = [...rawFiles, ...newFiles];
      setRawFiles(combined);
      setActiveItemIndex(0);
      handleResetTransform();
      processFiles(combined, initialSettings);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      const combined = [...rawFiles, ...newFiles];
      setRawFiles(combined);
      setActiveItemIndex(0);
      processFiles(combined, settings);
    };

    img.src = url;
  };

  // ── Dimension change handlers with Aspect Ratio lock ───────────────────────
  const handleWidthChange = (val: number) => {
    const newWidth = Math.max(1, val);
    let newHeight = settings.height;

    if (settings.maintainAspectRatio && originalRatio > 0) {
      newHeight = Math.max(1, Math.round(newWidth / originalRatio));
    }

    const updated: ResizeSettings = {
      ...settings,
      width: newWidth,
      height: newHeight,
    };
    setActivePresetId(null);
    setSettings(updated);
    triggerResizeUpdate(updated);
  };

  const handleHeightChange = (val: number) => {
    const newHeight = Math.max(1, val);
    let newWidth = settings.width;

    if (settings.maintainAspectRatio && originalRatio > 0) {
      newWidth = Math.max(1, Math.round(newHeight * originalRatio));
    }

    const updated: ResizeSettings = {
      ...settings,
      width: newWidth,
      height: newHeight,
    };
    setActivePresetId(null);
    setSettings(updated);
    triggerResizeUpdate(updated);
  };

  const handleToggleAspectRatio = () => {
    const nextLocked = !settings.maintainAspectRatio;
    let nextSettings = { ...settings, maintainAspectRatio: nextLocked };

    if (nextLocked && originalRatio > 0) {
      nextSettings = {
        ...nextSettings,
        height: Math.max(1, Math.round(settings.width / originalRatio)),
      };
    }

    setSettings(nextSettings);
    triggerResizeUpdate(nextSettings);
  };

  const handlePresetSelect = (preset: ResizePreset) => {
    setActivePresetId(preset.id);
    const updated: ResizeSettings = {
      ...settings,
      mode: "dimensions",
      width: preset.width,
      height: preset.height,
      maintainAspectRatio: false,
    };
    setSettings(updated);
    handleResetTransform();
    triggerResizeUpdate(updated);
  };

  const handlePercentageChange = (pct: number) => {
    const updated: ResizeSettings = {
      ...settings,
      percentage: pct,
    };
    setSettings(updated);
    triggerResizeUpdate(updated);
  };

  const handleFitModeChange = (mode: FitMode, bgStyle?: BgStyle) => {
    const updated: ResizeSettings = {
      ...settings,
      fitMode: mode,
      bgStyle: bgStyle || settings.bgStyle,
    };
    setSettings(updated);
    handleResetTransform();
    triggerResizeUpdate(updated);
  };

  const handleBgColorChange = (color: string) => {
    const updated: ResizeSettings = {
      ...settings,
      bgStyle: "color",
      bgColor: color,
    };
    setSettings(updated);
    triggerResizeUpdate(updated);
  };

  const handleFormatChange = (fmt: TargetFormat) => {
    const updated: ResizeSettings = { ...settings, format: fmt };
    setSettings(updated);
    triggerResizeUpdate(updated);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        if (target.originalUrl) URL.revokeObjectURL(target.originalUrl);
        if (target.resizedUrl) URL.revokeObjectURL(target.resizedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });

    setRawFiles((prev) => prev.filter((_, idx) => items[idx]?.id !== id));
    setActiveItemIndex(0);
  };

  const handleClearAll = () => {
    items.forEach((i) => {
      if (i.originalUrl) URL.revokeObjectURL(i.originalUrl);
      if (i.resizedUrl) URL.revokeObjectURL(i.resizedUrl);
    });
    setItems([]);
    setRawFiles([]);
    setActivePresetId(null);
    setActiveItemIndex(0);
    handleResetTransform();
  };

  const handleDownloadSingle = (item: ResizedFileResult) => {
    triggerDownload(item.resizedBlob, item.name);
  };

  // ── Download All as ZIP ───────────────────────────────────────────────────
  const handleDownloadAllZip = async () => {
    if (items.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      items.forEach((item) => {
        zip.file(item.name, item.resizedBlob);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      triggerDownload(zipBlob, `infyn-resized-${Date.now()}.zip`);
    } catch (err) {
      console.error("ZIP creation failed", err);
    } finally {
      setIsZipping(false);
    }
  };

  // ── Cross-Tool Pipeline Navigation ─────────────────────────────────────────
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

  const currentCategoryPresets =
    PRESET_CATEGORIES.find((c) => c.id === selectedCategory)?.presets || [];

  const activeItem = items[activeItemIndex] || items[0] || null;
  const activeOriginalUrl = activeItem?.originalUrl || (rawFiles[activeItemIndex] ? URL.createObjectURL(rawFiles[activeItemIndex]) : null);
  const hasTransformChanges = panX !== 0 || panY !== 0 || scale !== 1 || flipH;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#E8E6DE] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#EAEAE5] text-xs font-semibold text-[#111111] shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Free Forever • Drag to Reposition • No-Crop Blur Background</span>
          </div>

          <SplitText
            text="Resize Image Dimensions"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]"
            delay={35}
            duration={0.85}
            splitType="words, chars"
            tag="h1"
            textAlign="center"
          />

          <p className="text-xs sm:text-sm text-[#6E6D68] leading-relaxed">
            Scale, pan, crop, and resize images without cutting off sides. Fit with modern blurred background or fill with custom alignment.
          </p>
        </div>

        {/* ── Stage 1: Upload DropZone (When no files loaded) ──────────── */}
        {rawFiles.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <DropZone
              multiple={true}
              onFilesSelected={handleFilesSelected}
              title="Drop your images here"
              subtitle="or click to browse from device (Batch 50+ supported)"
              formatsText="JPG · PNG · WEBP · HEIC · AVIF"
            />
            <PrivacyBadges />
          </motion.div>
        )}

        {/* ── Stage 2 & 3: Interactive Workspace (When files are loaded) ─ */}
        {rawFiles.length > 0 && (
          <div className="space-y-8">
            {/* ── Main Studio Grid (Left: Live Interactive Preview, Right: Controls) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* ── Left Column: Live Visual Pan & Zoom Preview Studio ── */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                    <EyeIcon className="h-3.5 w-3.5 text-[#111111]" />
                    <span>Interactive Studio</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {settings.width} × {settings.height} px
                    </span>
                    {isProcessing && (
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                    )}
                  </div>
                </div>

                {/* Live Preview Container with exact Aspect-Ratio Window */}
                <div className="relative rounded-3xl border border-[#EAEAE5] bg-[#F5F4EE] p-4 sm:p-5 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[400px] max-h-[440px] overflow-hidden shadow-2xs">
                  {/* Aspect Ratio Box with Drag & Zoom Manipulation */}
                  <div
                    ref={previewBoxRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onMouseEnter={() => setShowCropGrid(true)}
                    onMouseLeave={() => !isDragging && setShowCropGrid(false)}
                    className={`relative flex items-center justify-center rounded-2xl overflow-hidden shadow-sm border border-[#EAEAE5] select-none touch-none ${
                      isDragging ? "cursor-grabbing ring-2 ring-[#111111]" : "cursor-grab"
                    }`}
                    style={{
                      aspectRatio: `${settings.width || 1} / ${settings.height || 1}`,
                      maxWidth: "100%",
                      maxHeight: "320px",
                      width: settings.width >= settings.height ? "100%" : "auto",
                      height: settings.height > settings.width ? "100%" : "auto",
                      backgroundColor:
                        settings.bgStyle === "color"
                          ? settings.bgColor
                          : settings.bgStyle === "transparent"
                          ? "transparent"
                          : "#111111",
                    }}
                  >
                    {/* Layer 1: Blurred Background (if selected or in contain mode) */}
                    {settings.bgStyle === "blur" && activeOriginalUrl && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        <img
                          src={activeOriginalUrl}
                          alt=""
                          className="w-full h-full object-cover scale-125 blur-xl opacity-70"
                        />
                        <div className="absolute inset-0 bg-black/15" />
                      </div>
                    )}

                    {/* Layer 2: Active Subject Photo with Pan & Zoom Transform */}
                    {activeOriginalUrl ? (
                      <div
                        className="relative w-full h-full flex items-center justify-center pointer-events-none z-10"
                        style={{
                          transform: `translate(${panX}px, ${panY}px) scale(${scale}) scaleX(${flipH ? -1 : 1})`,
                          transformOrigin: "center center",
                          transition: isDragging ? "none" : "transform 0.05s ease-out",
                        }}
                      >
                        <img
                          src={activeOriginalUrl}
                          alt="Interactive Resized Preview"
                          className={`w-full h-full select-none shadow-sm ${
                            settings.fitMode === "cover"
                              ? "object-cover"
                              : settings.fitMode === "contain"
                              ? "object-contain"
                              : "object-fill"
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="p-8 text-center text-xs text-[#9E9D98] animate-pulse z-10">
                        Rendering live preview…
                      </div>
                    )}

                    {/* Layer 3: Rule-of-Thirds Grid Overlay (on hover/drag) */}
                    {showCropGrid && (
                      <div className="absolute inset-0 pointer-events-none z-20 grid grid-cols-3 grid-rows-3 opacity-35 transition-opacity">
                        <div className="border-r border-b border-white" />
                        <div className="border-r border-b border-white" />
                        <div className="border-b border-white" />
                        <div className="border-r border-b border-white" />
                        <div className="border-r border-b border-white" />
                        <div className="border-b border-white" />
                        <div className="border-r border-white" />
                        <div className="border-r border-white" />
                        <div />
                      </div>
                    )}

                    {/* Target dimension tag overlay */}
                    <div className="absolute top-2 left-2 bg-[#111111]/80 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide shadow-xs pointer-events-none z-30">
                      {settings.width} × {settings.height}
                    </div>

                    {/* Fit mode tag overlay */}
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-md text-[#111111] px-2 py-0.5 rounded-md text-[10px] font-bold border border-[#EAEAE5] shadow-xs uppercase pointer-events-none z-30">
                      {settings.fitMode === "contain" && settings.bgStyle === "blur"
                        ? "Blur Fit"
                        : settings.fitMode}
                    </div>
                  </div>

                  {/* Multi-image thumbnail strip */}
                  {items.length > 1 && (
                    <div className="w-full pt-3 mt-3 border-t border-[#EAEAE5] flex items-center gap-2 overflow-x-auto pb-1">
                      {items.map((item, idx) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveItemIndex(idx);
                            handleResetTransform();
                          }}
                          className={`relative h-11 w-11 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            activeItemIndex === idx
                              ? "border-[#111111] shadow-xs scale-105"
                              : "border-[#EAEAE5] opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={item.resizedUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Zoom, Pan & Quick Align Toolbar ── */}
                <div className="rounded-2xl border border-[#EAEAE5] bg-white p-3.5 space-y-3 shadow-2xs">
                  {/* Zoom Slider */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-[170px] flex-1">
                      <span className="font-bold text-[#111111] text-[11px] shrink-0">Zoom</span>
                      <button
                        type="button"
                        onClick={() => setScale((prev) => Math.max(0.2, Number((prev - 0.1).toFixed(2))))}
                        className="h-6 w-6 rounded-lg border border-[#EAEAE5] bg-[#F8F8F6] text-xs font-bold hover:bg-[#EAEAE5] active:scale-95 transition-all flex items-center justify-center text-[#111111] cursor-pointer"
                        title="Zoom Out"
                      >
                        −
                      </button>
                      <input
                        type="range"
                        min="0.3"
                        max="3.0"
                        step="0.05"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="flex-1 accent-[#111111] h-1.5 bg-[#EAEAE5] rounded-lg cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setScale((prev) => Math.min(3.5, Number((prev + 0.1).toFixed(2))))}
                        className="h-6 w-6 rounded-lg border border-[#EAEAE5] bg-[#F8F8F6] text-xs font-bold hover:bg-[#EAEAE5] active:scale-95 transition-all flex items-center justify-center text-[#111111] cursor-pointer"
                        title="Zoom In"
                      >
                        +
                      </button>
                      <span className="text-[11px] font-semibold tabular-nums text-[#6E6D68] w-9 text-right">
                        {Math.round(scale * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setFlipH(!flipH)}
                        className={`h-7 px-2 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1 transition-all cursor-pointer ${
                          flipH
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-[#EAEAE5] bg-white text-[#111111] hover:bg-[#F5F4EE]"
                        }`}
                        title="Flip horizontal"
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span>Flip</span>
                      </button>

                      {hasTransformChanges && (
                        <button
                          type="button"
                          onClick={handleResetTransform}
                          className="h-7 px-2 rounded-lg border border-[#EAEAE5] bg-[#F5F4EE] text-[11px] font-semibold text-[#111111] hover:bg-[#EAEAE5] active:scale-95 transition-all inline-flex items-center gap-1 cursor-pointer"
                          title="Reset position and zoom"
                        >
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick Nudge / Alignment Anchors */}
                  <div className="pt-2 border-t border-[#F5F4EE] flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-[#9E9D98] font-semibold">Align Crop:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAlign("left")}
                        className="px-2 py-0.5 rounded border border-[#EAEAE5] bg-[#FBFBFA] hover:bg-[#F5F4EE] text-[#6E6D68] font-semibold text-[10px] cursor-pointer"
                        title="Align crop to left edge"
                      >
                        Left
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAlign("center")}
                        className="px-2 py-0.5 rounded border border-[#EAEAE5] bg-[#FBFBFA] hover:bg-[#F5F4EE] text-[#111111] font-bold text-[10px] cursor-pointer"
                        title="Center crop"
                      >
                        Center
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAlign("right")}
                        className="px-2 py-0.5 rounded border border-[#EAEAE5] bg-[#FBFBFA] hover:bg-[#F5F4EE] text-[#6E6D68] font-semibold text-[10px] cursor-pointer"
                        title="Align crop to right edge"
                      >
                        Right
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAlign("top")}
                        className="px-2 py-0.5 rounded border border-[#EAEAE5] bg-[#FBFBFA] hover:bg-[#F5F4EE] text-[#6E6D68] font-semibold text-[10px] cursor-pointer"
                        title="Align crop to top edge"
                      >
                        Top
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAlign("bottom")}
                        className="px-2 py-0.5 rounded border border-[#EAEAE5] bg-[#FBFBFA] hover:bg-[#F5F4EE] text-[#6E6D68] font-semibold text-[10px] cursor-pointer"
                        title="Align crop to bottom edge"
                      >
                        Bottom
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#9E9D98] text-center">
                    💡 Click & drag image in preview to adjust crop position • Scroll mouse wheel to zoom
                  </p>
                </div>

                {/* Primary Download & Pipeline Card */}
                {activeItem && (
                  <div className="rounded-2xl border border-[#EAEAE5] bg-white p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#111111] truncate">{activeItem.name}</p>
                        <p className="text-[11px] text-[#6E6D68] mt-0.5">
                          {activeItem.originalWidth}×{activeItem.originalHeight} →{" "}
                          <span className="font-bold text-emerald-700">
                            {activeItem.resizedWidth}×{activeItem.resizedHeight} px
                          </span>{" "}
                          ({formatBytes(activeItem.resizedSize)})
                        </p>
                      </div>

                      <button
                        onClick={() => handleDownloadSingle(activeItem)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#111111] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#262626] active:scale-95 transition-all shrink-0 shadow-xs cursor-pointer"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        <span>Download</span>
                      </button>
                    </div>

                    {/* Continue With This Image Pipeline */}
                    <div className="pt-2.5 border-t border-[#F5F4EE]">
                      <ContinuePipelineBar
                        currentTool="resizer"
                        variant="inline"
                        getImageBlob={() => activeItem.resizedBlob}
                        imageName={activeItem.name}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── Right Column: Controls & Presets Panel ── */}
              <div className="lg:col-span-7 rounded-3xl border border-[#EAEAE5] bg-white p-5 sm:p-7 space-y-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F5F4EE] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                      Resize Controls
                    </h2>
                  </div>

                  {/* Mode Selector (Dimensions vs Percentage) */}
                  <div className="inline-flex rounded-xl bg-[#F5F4EE] p-1 border border-[#EAEAE5]">
                    <button
                      onClick={() => {
                        const updated: ResizeSettings = { ...settings, mode: "dimensions" };
                        setSettings(updated);
                        triggerResizeUpdate(updated);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        settings.mode === "dimensions"
                          ? "bg-white text-[#111111] shadow-xs"
                          : "text-[#6E6D68] hover:text-[#111111]"
                      }`}
                    >
                      Pixels (px)
                    </button>
                    <button
                      onClick={() => {
                        const updated: ResizeSettings = { ...settings, mode: "percentage" };
                        setSettings(updated);
                        triggerResizeUpdate(updated);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        settings.mode === "percentage"
                          ? "bg-white text-[#111111] shadow-xs"
                          : "text-[#6E6D68] hover:text-[#111111]"
                      }`}
                    >
                      Percentage (%)
                    </button>
                  </div>
                </div>

                {/* ── Dimensions Mode ── */}
                {settings.mode === "dimensions" && (
                  <div className="space-y-5">
                    {/* Preset Category Tabs */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#6E6D68] uppercase tracking-wider">
                        Social & Platform Presets:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_CATEGORIES.map((cat) => {
                          const isSelected = selectedCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => setSelectedCategory(cat.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                                isSelected
                                  ? "bg-[#111111] text-white border-[#111111] shadow-xs"
                                  : "bg-[#FBFBFA] hover:bg-[#F5F4EE] text-[#6E6D68] border-[#EAEAE5]"
                              }`}
                            >
                              {cat.iconName === "instagram" && <InstagramIcon className="h-3.5 w-3.5" />}
                              {cat.iconName === "youtube" && <YouTubeIcon className="h-3.5 w-3.5" />}
                              {cat.iconName === "whatsapp" && <WhatsAppIcon className="h-3.5 w-3.5" />}
                              {cat.iconName === "favicon" && <FaviconIcon className="h-3.5 w-3.5" />}
                              <span>{cat.label}</span>
                            </button>
                          );
                        })}
                        <button
                          onClick={() => {
                            setSelectedCategory("custom");
                            setActivePresetId(null);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                            selectedCategory === "custom"
                              ? "bg-[#111111] text-white border-[#111111] shadow-xs"
                              : "bg-[#FBFBFA] hover:bg-[#F5F4EE] text-[#6E6D68] border-[#EAEAE5]"
                          }`}
                        >
                          <CustomIcon className="h-3.5 w-3.5" />
                          <span>Custom</span>
                        </button>
                      </div>
                    </div>

                    {/* Preset Specific Buttons */}
                    {selectedCategory !== "custom" && currentCategoryPresets.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5]">
                        {currentCategoryPresets.map((p) => {
                          const isSelected = activePresetId === p.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => handlePresetSelect(p)}
                              className={`p-2.5 rounded-xl text-left border transition-all space-y-0.5 cursor-pointer ${
                                isSelected
                                  ? "bg-white border-[#111111] shadow-xs ring-1 ring-[#111111]"
                                  : "bg-white/80 hover:bg-white border-[#EAEAE5] hover:border-[#BEBDB9]"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#111111]">{p.name}</span>
                                {p.ratioLabel && (
                                  <span className="text-[10px] font-bold text-[#6E6D68] bg-[#F5F4EE] px-1.5 py-0.5 rounded">
                                    {p.ratioLabel}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] font-semibold text-emerald-700">
                                {p.width} × {p.height} px
                              </p>
                              <p className="text-[10px] text-[#9E9D98] truncate">{p.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Width & Height Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
                          <label htmlFor="width-input">Width</label>
                          <span className="text-[11px] text-[#9E9D98]">px</span>
                        </div>
                        <input
                          id="width-input"
                          type="number"
                          min="1"
                          max="16000"
                          value={settings.width || ""}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                          className="w-full px-3.5 py-2 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] focus:bg-white focus:outline-none focus:border-[#111111] text-xs sm:text-sm font-bold text-[#111111] shadow-2xs transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
                          <label htmlFor="height-input">Height</label>
                          <span className="text-[11px] text-[#9E9D98]">px</span>
                        </div>
                        <input
                          id="height-input"
                          type="number"
                          min="1"
                          max="16000"
                          value={settings.height || ""}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                          className="w-full px-3.5 py-2 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] focus:bg-white focus:outline-none focus:border-[#111111] text-xs sm:text-sm font-bold text-[#111111] shadow-2xs transition-colors"
                        />
                      </div>
                    </div>

                    {/* Aspect Ratio Lock */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={settings.maintainAspectRatio}
                          onChange={handleToggleAspectRatio}
                          className="h-4 w-4 rounded text-[#111111] focus:ring-[#111111] accent-[#111111] cursor-pointer"
                        />
                        <span className="text-xs font-bold text-[#111111]">
                          Maintain original aspect ratio
                        </span>
                      </label>
                    </div>

                    {/* ── Fit & Crop Style Selector ── */}
                    <div className="p-3.5 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5] space-y-3">
                      <label className="text-[11px] font-bold text-[#6E6D68] uppercase tracking-wider block">
                        Fit & Crop Mode (Prevent cutting off sides):
                      </label>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {/* 1. Cover / Fill */}
                        <button
                          type="button"
                          onClick={() => handleFitModeChange("cover", "transparent")}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            settings.fitMode === "cover"
                              ? "bg-white border-[#111111] shadow-xs ring-1 ring-[#111111]"
                              : "bg-white/60 hover:bg-white border-[#EAEAE5]"
                          }`}
                        >
                          <p className="text-xs font-bold text-[#111111]">Fill / Crop</p>
                          <p className="text-[10px] text-[#9E9D98] mt-0.5">Fills frame edge-to-edge</p>
                        </button>

                        {/* 2. Fit with Blur */}
                        <button
                          type="button"
                          onClick={() => handleFitModeChange("contain", "blur")}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            settings.fitMode === "contain" && settings.bgStyle === "blur"
                              ? "bg-white border-[#111111] shadow-xs ring-1 ring-[#111111]"
                              : "bg-white/60 hover:bg-white border-[#EAEAE5]"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-[#111111]">Fit + Blur</span>
                            <span className="text-[9px] font-bold px-1 rounded bg-emerald-100 text-emerald-800">No Crop</span>
                          </div>
                          <p className="text-[10px] text-[#9E9D98] mt-0.5">Full photo + blurred bars</p>
                        </button>

                        {/* 3. Fit with Solid Color */}
                        <button
                          type="button"
                          onClick={() => handleFitModeChange("contain", "color")}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            settings.fitMode === "contain" && settings.bgStyle === "color"
                              ? "bg-white border-[#111111] shadow-xs ring-1 ring-[#111111]"
                              : "bg-white/60 hover:bg-white border-[#EAEAE5]"
                          }`}
                        >
                          <p className="text-xs font-bold text-[#111111]">Fit + Color</p>
                          <p className="text-[10px] text-[#9E9D98] mt-0.5">Full photo + colored bars</p>
                        </button>

                        {/* 4. Stretch */}
                        <button
                          type="button"
                          onClick={() => handleFitModeChange("stretch", "transparent")}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            settings.fitMode === "stretch"
                              ? "bg-white border-[#111111] shadow-xs ring-1 ring-[#111111]"
                              : "bg-white/60 hover:bg-white border-[#EAEAE5]"
                          }`}
                        >
                          <p className="text-xs font-bold text-[#111111]">Stretch</p>
                          <p className="text-[10px] text-[#9E9D98] mt-0.5">Stretch to exact size</p>
                        </button>
                      </div>

                      {/* Color Palette (When Fit + Color is selected) */}
                      {settings.fitMode === "contain" && settings.bgStyle === "color" && (
                        <div className="pt-2 border-t border-[#EAEAE5] flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-[#6E6D68]">Bar Color:</span>
                          {[
                            { name: "White", val: "#ffffff" },
                            { name: "Black", val: "#000000" },
                            { name: "Dark Ink", val: "#111111" },
                            { name: "Muted Cream", val: "#F5F4EE" },
                          ].map((c) => (
                            <button
                              key={c.val}
                              type="button"
                              onClick={() => handleBgColorChange(c.val)}
                              className={`h-6 px-2.5 rounded-md text-[10px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                                settings.bgColor === c.val
                                  ? "border-[#111111] shadow-xs ring-1 ring-[#111111]"
                                  : "border-[#EAEAE5]"
                              }`}
                            >
                              <span
                                className="h-2.5 w-2.5 rounded-full border border-black/10"
                                style={{ backgroundColor: c.val }}
                              />
                              <span>{c.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Percentage Mode ── */}
                {settings.mode === "percentage" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#6E6D68] uppercase tracking-wider">
                        Scale Percentage: <span className="text-[#111111] font-extrabold">{settings.percentage}%</span>
                      </label>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="300"
                      step="5"
                      value={settings.percentage}
                      onChange={(e) => handlePercentageChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#EAEAE5] rounded-lg appearance-none cursor-pointer accent-[#111111]"
                    />

                    <div className="flex flex-wrap gap-2">
                      {[25, 50, 75, 100, 150, 200].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => handlePercentageChange(pct)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            settings.percentage === pct
                              ? "bg-[#111111] text-white border-[#111111]"
                              : "bg-[#F5F4EE] hover:bg-[#EAEAE5] text-[#6E6D68] border-[#EAEAE5]"
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Export Format Bar ── */}
                <div className="pt-4 border-t border-[#F5F4EE] flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#6E6D68] text-[11px]">Format:</span>
                    {(
                      [
                        { id: "original", label: "Original" },
                        { id: "image/jpeg", label: "JPG" },
                        { id: "image/png", label: "PNG" },
                        { id: "image/webp", label: "WebP" },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleFormatChange(f.id)}
                        className={`px-2.5 py-1 rounded-lg font-semibold border transition-all text-xs cursor-pointer ${
                          settings.format === f.id
                            ? "bg-[#111111] text-white border-[#111111]"
                            : "bg-[#F5F4EE] hover:bg-[#EAEAE5] text-[#6E6D68] border-[#EAEAE5]"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addMoreInputRef.current?.click()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#EAEAE5] bg-white text-[#111111] font-bold hover:bg-[#F5F4EE] transition-colors text-xs cursor-pointer"
                    >
                      <span>+ Add More</span>
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="px-2.5 py-1.5 rounded-xl text-rose-600 font-semibold hover:bg-rose-50 transition-colors text-xs cursor-pointer"
                    >
                      Clear All
                    </button>
                    <input
                      ref={addMoreInputRef}
                      type="file"
                      multiple
                      accept="image/*,.heic,.heif,.HEIC,.HEIF"
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
              </div>

              {/* ── Continue Editing with Processed Image ─────────────────── */}
              {activeItem && (
                <ContinuePipelineBar
                  currentTool="resizer"
                  getImageBlob={() => activeItem.resizedBlob}
                  imageName={activeItem.name}
                />
              )}
            </div>

            {/* ── Batch Images Showcase (If multiple images) ─────────── */}
            {items.length > 1 && (
              <div className="space-y-4 pt-4 border-t border-[#EAEAE5]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                    Batch Resized Images ({items.length})
                  </h3>

                  <button
                    onClick={handleDownloadAllZip}
                    disabled={isZipping || isProcessing}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-4 py-2 text-xs font-bold text-white hover:bg-[#262626] active:scale-95 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span>{isZipping ? "Creating ZIP..." : `Download All (${items.length} Files ZIP)`}</span>
                  </button>
                </div>

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
                        <ResizerItemCard
                          item={item}
                          onRemove={handleRemoveItem}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
