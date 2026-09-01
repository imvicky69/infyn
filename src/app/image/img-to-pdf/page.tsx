"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";

/* ─────────────────────────────────────────────────────────────
   Types & constants
───────────────────────────────────────────────────────────── */
type Stage = "idle" | "busy" | "done" | "error";
type ViewMode = "grid" | "list";

interface ImageItem {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  name: string;
  sizeLabel: string;
}

type PageSize = "A4" | "A5" | "Letter" | "Legal" | "A3" | "auto";
type Orientation = "portrait" | "landscape";
type MarginSize = "none" | "small" | "medium" | "large";
type ImageFit = "fit" | "fill" | "actual";

interface PdfOptions {
  pageSize: PageSize;
  orientation: Orientation;
  margin: MarginSize;
  imageFit: ImageFit;
  quality: number;
}

const PAGE_SIZES: Record<PageSize, { label: string; desc: string; w: number; h: number }> = {
  A4:     { label: "A4",     desc: "210 × 297 mm", w: 210, h: 297 },
  A5:     { label: "A5",     desc: "148 × 210 mm", w: 148, h: 210 },
  A3:     { label: "A3",     desc: "297 × 420 mm", w: 297, h: 420 },
  Letter: { label: "Letter", desc: "8.5 × 11 in",  w: 215.9, h: 279.4 },
  Legal:  { label: "Legal",  desc: "8.5 × 14 in",  w: 215.9, h: 355.6 },
  auto:   { label: "Auto",   desc: "Match image",  w: 0, h: 0 },
};

const MARGINS: Record<MarginSize, { label: string; value: number }> = {
  none:   { label: "None",   value: 0 },
  small:  { label: "Small",  value: 8 },
  medium: { label: "Medium", value: 16 },
  large:  { label: "Large",  value: 24 },
};

const IMAGE_FIT_OPTIONS: { id: ImageFit; label: string; desc: string }[] = [
  { id: "fit",    label: "Fit",    desc: "Fit inside page, keep ratio" },
  { id: "fill",   label: "Fill",   desc: "Fill page, may crop edges" },
  { id: "actual", label: "Actual", desc: "Original pixel size (1:1)" },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
      {children}
    </span>
  );
}

function OptionPill<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: { id: T; label: string; desc?: string }[];
  selected: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          title={opt.desc}
          className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${
            selected === opt.id
              ? "bg-[#111111] text-white border-[#111111] shadow-sm"
              : "bg-white text-[#6E6D68] border-[#EAEAE5] hover:border-[#BEBDB9] hover:text-[#111111]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Image Grid Card (Visual Grid View with Drag & Reorder)
───────────────────────────────────────────────────────────── */
function ImageGridCard({
  item,
  index,
  total,
  onRemove,
  onMoveLeft,
  onMoveRight,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  isDragOver,
  isDragging,
}: {
  item: ImageItem;
  index: number;
  total: number;
  onRemove: (id: string) => void;
  onMoveLeft: (index: number) => void;
  onMoveRight: (index: number) => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  isDragOver: boolean;
  isDragging: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isDragging ? 0.4 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={() => onDragStart(item.id)}
      onDragOver={(e) => onDragOver(e, item.id)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop(e, item.id)}
      className={`group relative flex flex-col rounded-2xl border bg-white overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
        isDragOver
          ? "border-[#111111] ring-2 ring-[#111111] shadow-md scale-[1.02]"
          : "border-[#EAEAE5] hover:border-[#BEBDB9] hover:shadow-md"
      }`}
    >
      {/* Top Floating Overlay (Page Pill & Controls) */}
      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-20 pointer-events-none">
        {/* Page Badge */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-md border border-[#EAEAE5] text-[10px] font-bold text-[#111111] shadow-xs tabular-nums">
          <span className="text-[#9E9D98] font-medium">Page</span> {index + 1}
        </span>

        {/* Action Controls */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto bg-white/90 backdrop-blur-md p-1 rounded-xl border border-[#EAEAE5] shadow-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveLeft(index);
            }}
            disabled={index === 0}
            className="p-1 rounded-lg text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            title="Move earlier"
            aria-label="Move left"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveRight(index);
            }}
            disabled={index === total - 1}
            className="p-1 rounded-lg text-[#6E6D68] hover:text-[#111111] hover:bg-[#F5F4EE] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            title="Move later"
            aria-label="Move right"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <div className="h-3 w-px bg-[#EAEAE5] mx-0.5" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
            className="p-1 rounded-lg text-[#9E9D98] hover:text-rose-600 hover:bg-rose-50 transition-all"
            title="Remove page"
            aria-label="Remove image"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview Thumbnail Area */}
      <div className="relative w-full aspect-[3/4] bg-[#F8F8F6] p-4 flex items-center justify-center overflow-hidden border-b border-[#EAEAE5]/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.name}
          className="max-h-full max-w-full object-contain rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.06)] group-hover:scale-[1.02] transition-transform duration-200 pointer-events-none"
        />

        {/* Drag overlay affordance */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors pointer-events-none" />
      </div>

      {/* Card Info Footer */}
      <div className="p-3 bg-white space-y-1">
        <p className="text-[12px] font-bold text-[#111111] truncate tracking-tight" title={item.name}>
          {item.name}
        </p>
        <div className="flex items-center justify-between text-[10px] font-medium text-[#9E9D98]">
          <span>{item.width} × {item.height}px</span>
          <span className="bg-[#F5F4EE] text-[#6E6D68] px-1.5 py-0.5 rounded-md font-semibold">{item.sizeLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Image List Card (Optional List View)
───────────────────────────────────────────────────────────── */
function ImageListCard({
  item,
  index,
  total,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  item: ImageItem;
  index: number;
  total: number;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white border border-[#EAEAE5] rounded-2xl overflow-hidden hover:border-[#BEBDB9] hover:shadow-xs transition-all duration-200"
    >
      <div className="flex items-center gap-3 p-3">
        {/* Page number badge */}
        <div className="shrink-0 h-6 w-6 rounded-lg bg-[#F5F4EE] border border-[#EAEAE5] flex items-center justify-center text-[10px] font-bold text-[#6E6D68] tabular-nums">
          {index + 1}
        </div>

        {/* Preview thumbnail */}
        <div className="shrink-0 h-14 w-14 rounded-xl overflow-hidden border border-[#EAEAE5] bg-[#FBFBFA] p-1 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.name}
            className="h-full w-full object-contain rounded-md"
          />
        </div>

        {/* File info */}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[#111111] truncate tracking-[-0.01em]">
            {item.name}
          </p>
          <p className="text-[11px] text-[#9E9D98] mt-0.5">
            {item.width} × {item.height}px · {item.sizeLabel}
          </p>
        </div>

        {/* Move & Remove buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            className="p-1 rounded-lg text-[#BEBDB9] hover:text-[#111111] hover:bg-[#F5F4EE] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Move up"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(index)}
            disabled={index === total - 1}
            className="p-1 rounded-lg text-[#BEBDB9] hover:text-[#111111] hover:bg-[#F5F4EE] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Move down"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="p-1 rounded-lg text-[#BEBDB9] hover:text-rose-600 hover:bg-rose-50 transition-all"
            aria-label="Remove image"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────── */
export default function ImageToPdfPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [options, setOptions] = useState<PdfOptions>({
    pageSize: "A4",
    orientation: "portrait",
    margin: "medium",
    imageFit: "fit",
    quality: 92,
  });

  const addMoreRef = useRef<HTMLInputElement>(null);

  /* ── Load image dimensions ── */
  const loadImage = useCallback((file: File): Promise<ImageItem> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        resolve({
          id: generateId(),
          file,
          url,
          width: img.naturalWidth,
          height: img.naturalHeight,
          name: file.name,
          sizeLabel: formatBytes(file.size),
        });
      };
      img.onerror = () => {
        resolve({
          id: generateId(),
          file,
          url,
          width: 0,
          height: 0,
          name: file.name,
          sizeLabel: formatBytes(file.size),
        });
      };
      img.src = url;
    });
  }, []);

  /* ── Handle file selection ── */
  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      const valid = files.filter((f) => f.type.startsWith("image/"));
      if (valid.length === 0) return;

      const loaded = await Promise.all(valid.map(loadImage));
      setImages((prev) => [...prev, ...loaded]);
    },
    [loadImage]
  );

  /* ── Reorder helpers ── */
  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
  }, []);

  const moveLeft = useCallback((index: number) => {
    moveItem(index, index - 1);
  }, [moveItem]);

  const moveRight = useCallback((index: number) => {
    moveItem(index, index + 1);
  }, [moveItem]);

  /* ── Drag & Drop Reorder Handlers ── */
  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== id) {
      setDragOverId(id);
    }
  }, [draggedId]);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    setImages((prev) => {
      const fromIndex = prev.findIndex((i) => i.id === draggedId);
      const toIndex = prev.findIndex((i) => i.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const next = [...prev];
      const [movedItem] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, movedItem);
      return next;
    });

    setDraggedId(null);
    setDragOverId(null);
  }, [draggedId]);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setImages((prev) => {
      prev.forEach((i) => URL.revokeObjectURL(i.url));
      return [];
    });
    setStage("idle");
    setProgress(0);
    setErrorMsg("");
  }, []);

  /* ── Generate PDF ── */
  const generatePdf = useCallback(async () => {
    if (images.length === 0) return;
    setStage("busy");
    setProgress(0);
    setProgressText("Loading PDF engine…");

    try {
      const { jsPDF } = await import("jspdf");

      const mmPerPx = 25.4 / 96; // mm per CSS pixel at 96dpi
      const marginMm = MARGINS[options.margin].value;

      const totalPages = images.length;

      const getPageDimsMm = (imgW: number, imgH: number): [number, number] => {
        if (options.pageSize === "auto") {
          const w = imgW * mmPerPx;
          const h = imgH * mmPerPx;
          return options.orientation === "landscape" ? [Math.max(w, h), Math.min(w, h)] : [Math.min(w, h), Math.max(w, h)];
        }
        const ps = PAGE_SIZES[options.pageSize];
        return options.orientation === "landscape" ? [ps.h, ps.w] : [ps.w, ps.h];
      };

      setProgressText("Preparing first page…");

      const firstImg = images[0];
      const [pw0, ph0] = getPageDimsMm(firstImg.width, firstImg.height);

      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: "mm",
        format: options.pageSize === "auto" ? [pw0, ph0] : (options.pageSize as string),
        compress: true,
      });

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        setProgressText(`Processing image ${i + 1} of ${totalPages}…`);
        setProgress(Math.round((i / totalPages) * 85));

        if (i > 0) {
          const [pw, ph] = getPageDimsMm(item.width, item.height);
          if (options.pageSize === "auto") {
            pdf.addPage([pw, ph], options.orientation);
          } else {
            pdf.addPage(options.pageSize as string, options.orientation);
          }
        }

        const [pageW, pageH] = getPageDimsMm(item.width, item.height);
        const contentW = pageW - marginMm * 2;
        const contentH = pageH - marginMm * 2;

        let drawW = contentW;
        let drawH = contentH;
        let offsetX = marginMm;
        let offsetY = marginMm;

        if (options.imageFit === "fit") {
          const scale = Math.min(contentW / item.width, contentH / item.height);
          drawW = item.width * scale;
          drawH = item.height * scale;
          offsetX = marginMm + (contentW - drawW) / 2;
          offsetY = marginMm + (contentH - drawH) / 2;
        } else if (options.imageFit === "actual") {
          drawW = item.width * mmPerPx;
          drawH = item.height * mmPerPx;
          offsetX = marginMm + Math.max(0, (contentW - drawW) / 2);
          offsetY = marginMm + Math.max(0, (contentH - drawH) / 2);
          if (drawW > contentW) drawW = contentW;
          if (drawH > contentH) drawH = contentH;
        }

        const canvas = document.createElement("canvas");
        canvas.width = item.width;
        canvas.height = item.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const imgEl = new window.Image();
          await new Promise<void>((res) => {
            imgEl.onload = () => res();
            imgEl.src = item.url;
          });
          ctx.drawImage(imgEl, 0, 0);
        }

        const ext = item.file.type === "image/png" ? "PNG" : "JPEG";
        const dataUrl = canvas.toDataURL(item.file.type === "image/png" ? "image/png" : "image/jpeg", options.quality / 100);

        pdf.addImage(dataUrl, ext, offsetX, offsetY, drawW, drawH, undefined, "FAST");
      }

      setProgress(95);
      setProgressText("Finalizing PDF…");
      await new Promise((r) => setTimeout(r, 120));

      const timestamp = new Date().toISOString().slice(0, 10);
      pdf.save(`infyn-${totalPages}-images-${timestamp}.pdf`);

      setProgress(100);
      setProgressText("Done!");
      setStage("done");
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
      setStage("error");
    }
  }, [images, options]);

  const setOpt = <K extends keyof PdfOptions>(key: K, val: PdfOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: val }));
  };

  /* ─────────────────────────────────────────────────────────
     Render
  ──────────────────────────────────────────────────────────*/
  return (
    <div className="min-h-screen text-[#111111] flex flex-col font-sans bg-[#FBFBFA]">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col py-8 sm:py-14 space-y-8">

        {/* ── Page header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-[14px] bg-gradient-to-br from-rose-100 to-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-700 shadow-[0_0_0_1px_rgba(244,63,94,0.08),0_2px_8px_rgba(244,63,94,0.12)]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-[-0.025em]">
                Image to PDF
              </h1>
              <p className="text-[12px] text-[#9E9D98] tracking-[-0.005em]">
                Batch convert · Drag to reorder pages · Custom document sizes
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── IDLE: Drop zone ──────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {stage === "idle" && images.length === 0 && (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <DropZone
                multiple
                accept="image/*"
                onFilesSelected={handleFilesSelected}
                title="Drop your images here"
                subtitle="or click to browse from device — unlimited files"
                formatsText="JPG · PNG · WEBP · HEIC · AVIF · GIF · BMP"
              />
            </motion.div>
          )}

          {/* ── EDITOR: Images loaded ─────────────────────────────── */}
          {(stage === "idle" || stage === "done") && images.length > 0 && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start"
            >
              {/* LEFT: Image Grid / List */}
              <div className="space-y-4">
                {/* List / Grid header toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAEAE5] pb-3.5">
                  <div className="space-y-0.5">
                    <SectionLabel>Page Order & Preview</SectionLabel>
                    <p className="text-sm font-bold text-[#111111] tracking-[-0.01em]">
                      {images.length} {images.length === 1 ? "Page" : "Pages"} · Drag or use arrows to reorder
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Switcher (Grid / List) */}
                    <div className="inline-flex rounded-xl bg-[#F5F4EE] p-0.5 border border-[#EAEAE5]">
                      <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded-lg transition-all ${
                          viewMode === "grid"
                            ? "bg-white text-[#111111] shadow-2xs"
                            : "text-[#9E9D98] hover:text-[#111111]"
                        }`}
                        title="Grid view"
                        aria-label="Grid view"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`p-1.5 rounded-lg transition-all ${
                          viewMode === "list"
                            ? "bg-white text-[#111111] shadow-2xs"
                            : "text-[#9E9D98] hover:text-[#111111]"
                        }`}
                        title="List view"
                        aria-label="List view"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                      </button>
                    </div>

                    {/* Add more files button */}
                    <button
                      type="button"
                      onClick={() => addMoreRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAEAE5] bg-white text-[12px] font-semibold text-[#6E6D68] hover:border-[#BEBDB9] hover:text-[#111111] transition-all cursor-pointer"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add more
                    </button>
                    <input
                      ref={addMoreRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length) handleFilesSelected(files);
                        e.target.value = "";
                      }}
                    />

                    {/* Clear all */}
                    <button
                      type="button"
                      onClick={clearAll}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAEAE5] bg-white text-[12px] font-semibold text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                </div>

                {/* ── GRID VIEW ── */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    <AnimatePresence>
                      {images.map((item, i) => (
                        <ImageGridCard
                          key={item.id}
                          item={item}
                          index={i}
                          total={images.length}
                          onRemove={removeImage}
                          onMoveLeft={moveLeft}
                          onMoveRight={moveRight}
                          onDragStart={handleDragStart}
                          onDragOver={handleDragOver}
                          onDragEnd={handleDragEnd}
                          onDrop={handleDrop}
                          isDragOver={dragOverId === item.id}
                          isDragging={draggedId === item.id}
                        />
                      ))}
                    </AnimatePresence>

                    {/* Add More Tile right in grid */}
                    <motion.div
                      layout
                      onClick={() => addMoreRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files);
                        if (files.length) handleFilesSelected(files);
                      }}
                      className="group flex flex-col items-center justify-center gap-2 aspect-[3/4] rounded-2xl border-2 border-dashed border-[#DDDDD8] hover:border-[#AEAEAD] bg-white hover:bg-[#FDFDF9] cursor-pointer transition-all p-4 text-center select-none"
                    >
                      <div className="h-10 w-10 rounded-xl bg-[#F5F4EE] border border-[#EAEAE5] flex items-center justify-center text-[#6E6D68] group-hover:scale-110 transition-transform">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[12px] font-bold text-[#111111]">Add more images</p>
                        <p className="text-[10px] text-[#9E9D98]">Click or drop here</p>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  /* ── LIST VIEW ── */
                  <div className="space-y-2">
                    <AnimatePresence>
                      {images.map((item, i) => (
                        <ImageListCard
                          key={item.id}
                          item={item}
                          index={i}
                          total={images.length}
                          onRemove={removeImage}
                          onMoveUp={moveLeft}
                          onMoveDown={moveRight}
                        />
                      ))}
                    </AnimatePresence>

                    {/* Small dropzone below list */}
                    <div
                      onClick={() => addMoreRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files);
                        if (files.length) handleFilesSelected(files);
                      }}
                      className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-[#DDDDD8] hover:border-[#AEAEAD] bg-white hover:bg-[#FDFDF9] cursor-pointer transition-all text-[12px] font-semibold text-[#9E9D98] hover:text-[#6E6D68]"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Drop more images here
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: Options panel */}
              <div className="space-y-5 lg:sticky lg:top-20">
                <div className="rounded-2xl border border-[#EAEAE5] bg-white p-5 space-y-5 shadow-2xs">

                  {/* Page Size */}
                  <div className="space-y-2.5">
                    <SectionLabel>Page Size</SectionLabel>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(Object.entries(PAGE_SIZES) as [PageSize, typeof PAGE_SIZES[PageSize]][]).map(([id, ps]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setOpt("pageSize", id)}
                          className={`flex flex-col items-start px-2.5 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                            options.pageSize === id
                              ? "bg-[#111111] border-[#111111] text-white"
                              : "bg-white border-[#EAEAE5] text-[#111111] hover:border-[#BEBDB9]"
                          }`}
                        >
                          <span className="text-[12px] font-bold leading-none">{ps.label}</span>
                          <span className={`text-[9px] font-medium mt-1 leading-none ${options.pageSize === id ? "text-white/60" : "text-[#9E9D98]"}`}>
                            {ps.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orientation */}
                  <div className="space-y-2.5">
                    <SectionLabel>Orientation</SectionLabel>
                    <OptionPill<Orientation>
                      options={[
                        { id: "portrait", label: "Portrait" },
                        { id: "landscape", label: "Landscape" },
                      ]}
                      selected={options.orientation}
                      onSelect={(v) => setOpt("orientation", v)}
                    />
                  </div>

                  {/* Margin */}
                  <div className="space-y-2.5">
                    <SectionLabel>Margin</SectionLabel>
                    <OptionPill<MarginSize>
                      options={Object.entries(MARGINS).map(([id, m]) => ({
                        id: id as MarginSize,
                        label: m.label,
                        desc: `${m.value}mm`,
                      }))}
                      selected={options.margin}
                      onSelect={(v) => setOpt("margin", v)}
                    />
                  </div>

                  {/* Image Fit */}
                  <div className="space-y-2.5">
                    <SectionLabel>Image Fit</SectionLabel>
                    <div className="space-y-1.5">
                      {IMAGE_FIT_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setOpt("imageFit", opt.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            options.imageFit === opt.id
                              ? "bg-[#111111] border-[#111111] text-white"
                              : "bg-white border-[#EAEAE5] hover:border-[#BEBDB9]"
                          }`}
                        >
                          <span className={`text-[12px] font-semibold ${options.imageFit === opt.id ? "text-white" : "text-[#111111]"}`}>
                            {opt.label}
                          </span>
                          <span className={`text-[10px] ${options.imageFit === opt.id ? "text-white/60" : "text-[#9E9D98]"}`}>
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* JPEG Quality */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <SectionLabel>JPEG Quality</SectionLabel>
                      <span className="text-[12px] font-bold text-[#111111] tabular-nums">{options.quality}%</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={100}
                      step={1}
                      value={options.quality}
                      onChange={(e) => setOpt("quality", Number(e.target.value))}
                      className="w-full h-1.5 accent-[#111111] cursor-pointer rounded-full"
                    />
                    <div className="flex justify-between text-[10px] text-[#BEBDB9] font-medium">
                      <span>Smaller file</span>
                      <span>Higher quality</span>
                    </div>
                  </div>
                </div>

                {/* Generate button */}
                <button
                  type="button"
                  onClick={generatePdf}
                  disabled={images.length === 0}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#111111] text-white text-[14px] font-bold tracking-[-0.01em] hover:bg-[#1a1a1a] active:scale-[0.98] transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  Generate PDF
                  <span className="px-2 py-0.5 rounded-full bg-white/15 text-[11px] font-bold">
                    {images.length} {images.length === 1 ? "page" : "pages"}
                  </span>
                </button>

                {stage === "done" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200/80"
                  >
                    <svg className="h-4 w-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <p className="text-[12px] font-semibold text-emerald-800">
                      PDF downloaded successfully!
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── BUSY: Processing ───────────────────────────────────── */}
          {stage === "busy" && (
            <motion.div
              key="busy"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-[#EAEAE5] bg-white p-10 flex flex-col items-center gap-6 shadow-2xs"
            >
              {/* Animated PDF icon */}
              <div className="relative h-16 w-16 rounded-[18px] bg-gradient-to-br from-rose-100 to-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-700">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <div className="absolute inset-0 rounded-[18px] border border-rose-400/30 animate-ping opacity-30" />
              </div>

              <div className="text-center space-y-1.5 max-w-xs">
                <p className="text-base font-bold text-[#111111] tracking-[-0.01em]">
                  Generating PDF…
                </p>
                <p className="text-[13px] text-[#6E6D68]">{progressText}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-sm space-y-2">
                <div className="h-1.5 w-full bg-[#F5F4EE] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#111111] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
                <p className="text-center text-[11px] font-bold text-[#9E9D98] tabular-nums">{progress}%</p>
              </div>
            </motion.div>
          )}

          {/* ── ERROR ─────────────────────────────────────────────── */}
          {stage === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl border border-rose-200/80 bg-rose-50 p-8 flex flex-col items-center gap-4 text-center"
            >
              <div className="h-12 w-12 rounded-2xl bg-rose-100 border border-rose-300/60 flex items-center justify-center text-rose-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-rose-900">PDF generation failed</p>
                <p className="text-[12px] text-rose-700 mt-1 max-w-sm">{errorMsg || "An unexpected error occurred."}</p>
              </div>
              <button
                type="button"
                onClick={() => { setStage("idle"); setErrorMsg(""); }}
                className="px-5 py-2.5 rounded-xl bg-rose-700 text-white text-[13px] font-bold hover:bg-rose-800 active:scale-[0.98] transition-all cursor-pointer"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Privacy badges ───────────────────────────────────────── */}
        <PrivacyBadges
          badges={["100% In-browser", "Zero cloud uploads", "Ad-free", "Free & unlimited"]}
        />
      </main>

      <Footer />
    </div>
  );
}
