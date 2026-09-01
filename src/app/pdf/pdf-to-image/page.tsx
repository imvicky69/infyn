"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { ContinuePipelineBar } from "@/components/image-tools/continue-pipeline-bar";

/* ─────────────────────────────────────────────────────────────
   Types & Options
───────────────────────────────────────────────────────────── */
type Stage = "idle" | "busy" | "done" | "error";
type ImageFormat = "jpg" | "png" | "webp";
type ScaleFactor = 1 | 1.5 | 2 | 3;

interface RenderedPage {
  pageNum: number;
  dataUrl: string;
  width: number;
  height: number;
  blob: Blob | null;
  sizeLabel: string;
  selected: boolean;
}

interface ExportOptions {
  format: ImageFormat;
  scale: ScaleFactor;
  quality: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E9D98]">
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   PDF to Image Page
───────────────────────────────────────────────────────────── */
export default function PdfToImagePage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);

  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [options, setOptions] = useState<ExportOptions>({
    format: "jpg",
    scale: 2,
    quality: 92,
  });

  const [isZipping, setIsZipping] = useState(false);
  const [copiedPage, setCopiedPage] = useState<number | null>(null);
  const [previewPage, setPreviewPage] = useState<RenderedPage | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Core PDF.js Rendering Function ── */
  const renderPdfPages = useCallback(
    async (buffer: ArrayBuffer, opts: ExportOptions) => {
      setStage("busy");
      setProgress(0);
      setProgressText("Initializing Mozilla PDF engine…");

      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        setProgressText("Loading PDF document…");
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(buffer.slice(0)),
        });
        const pdf = await loadingTask.promise;


        const totalPages = pdf.numPages;
        if (totalPages === 0) {
          throw new Error("This PDF document contains no pages.");
        }

        const rendered: RenderedPage[] = [];

        for (let i = 1; i <= totalPages; i++) {
          setProgressText(`Rendering page ${i} of ${totalPages}…`);
          setProgress(Math.round((i / totalPages) * 90));

          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: opts.scale });

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          const ctx = canvas.getContext("2d", { willReadFrequently: true });

          if (!ctx) throw new Error("Could not initialize 2D canvas context");

          // For JPG / non-alpha, paint clean white background first
          if (opts.format === "jpg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          // Render PDF page into canvas
          const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
          };
          // @ts-expect-error - PDF.js typed render parameters
          await page.render(renderContext).promise;

          // Convert to blob and dataUrl
          const mimeType =
            opts.format === "png"
              ? "image/png"
              : opts.format === "webp"
              ? "image/webp"
              : "image/jpeg";
          const qualityRatio = opts.quality / 100;

          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (b) => (b ? resolve(b) : reject(new Error(`Failed to encode page ${i}`))),
              mimeType,
              qualityRatio
            );
          });

          const dataUrl = canvas.toDataURL(mimeType, qualityRatio);

          rendered.push({
            pageNum: i,
            dataUrl,
            width: canvas.width,
            height: canvas.height,
            blob,
            sizeLabel: formatBytes(blob.size),
            selected: true,
          });
        }

        setProgress(100);
        setProgressText("All pages rendered!");
        setPages(rendered);
        setStage("done");
      } catch (err: any) {
        console.error("PDF Render Error:", err);
        const isEncrypted = err?.name === "PasswordException" || err?.message?.toLowerCase().includes("password") || err?.message?.toLowerCase().includes("encrypt");
        setErrorMsg(
          isEncrypted
            ? "This PDF is password-protected. Please unlock it using the PDF Unlocker tool first."
            : (err instanceof Error ? err.message : "Could not decode or parse this PDF file.")
        );
        setStage("error");
      }
    },
    []
  );

  /* ── Handle New PDF File ── */
  const handlePdfSelected = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;

      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setErrorMsg("Please select a valid .PDF document.");
        setStage("error");
        return;
      }

      setPdfFile(file);
      try {
        const buffer = await file.arrayBuffer();
        setPdfArrayBuffer(buffer);
        await renderPdfPages(buffer, options);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to read the selected PDF file.");
        setStage("error");
      }
    },
    [options, renderPdfPages]
  );

  /* ── Re-render on Options Change if document is loaded ── */
  const handleOptionChange = useCallback(
    async <K extends keyof ExportOptions>(key: K, val: ExportOptions[K]) => {
      const newOpts = { ...options, [key]: val };
      setOptions(newOpts);

      if (pdfArrayBuffer && stage === "done") {
        await renderPdfPages(pdfArrayBuffer, newOpts);
      }
    },
    [options, pdfArrayBuffer, stage, renderPdfPages]
  );

  /* ── Reset State ── */
  const handleReset = useCallback(() => {
    setStage("idle");
    setPdfFile(null);
    setPdfArrayBuffer(null);
    setPages([]);
    setProgress(0);
    setErrorMsg("");
    setPreviewPage(null);
  }, []);

  /* ── Toggle Individual / All Page Selections ── */
  const togglePageSelection = useCallback((pageNum: number) => {
    setPages((prev) =>
      prev.map((p) => (p.pageNum === pageNum ? { ...p, selected: !p.selected } : p))
    );
  }, []);

  const selectAllPages = useCallback((select: boolean) => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: select })));
  }, []);

  /* ── Download Single Page ── */
  const downloadSinglePage = useCallback(
    (page: RenderedPage) => {
      if (!page.blob || !pdfFile) return;

      const base = pdfFile.name.replace(/\.[^.]+$/, "");
      const ext = options.format;
      const url = URL.createObjectURL(page.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${base}-page-${page.pageNum}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [pdfFile, options.format]
  );

  /* ── Copy Single Page Image to Clipboard ── */
  const copyPageToClipboard = useCallback(
    async (page: RenderedPage) => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(async (pngBlob) => {
              if (pngBlob && navigator.clipboard && window.ClipboardItem) {
                await navigator.clipboard.write([
                  new ClipboardItem({ "image/png": pngBlob }),
                ]);
                setCopiedPage(page.pageNum);
                setTimeout(() => setCopiedPage(null), 2200);
              }
            }, "image/png");
          }
        };
        img.src = page.dataUrl;
      } catch (err) {
        console.error("Clipboard Copy failed:", err);
      }
    },
    []
  );

  /* ── Batch Download Selected as ZIP ── */
  const downloadAllZip = useCallback(async () => {
    const selectedPages = pages.filter((p) => p.selected && p.blob);
    if (selectedPages.length === 0 || !pdfFile) return;

    setIsZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      const base = pdfFile.name.replace(/\.[^.]+$/, "");
      const ext = options.format;

      selectedPages.forEach((page) => {
        if (page.blob) {
          zip.file(`${base}-page-${page.pageNum}.${ext}`, page.blob);
        }
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${base}-extracted-${selectedPages.length}-pages.zip`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Zip generation error:", err);
    } finally {
      setIsZipping(false);
    }
  }, [pages, pdfFile, options.format]);

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <div className="min-h-screen text-[#111111] flex flex-col font-sans">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col py-8">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-[14px] bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_2px_8px_rgba(59,130,246,0.12)]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-[-0.025em]">
                PDF to Image
              </h1>
              <p className="text-[12px] text-[#9E9D98] tracking-[-0.005em]">
                Extract pages · HD 300 DPI · 1-Click ZIP Download · 100% In-Browser
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── IDLE: Drop Zone ──────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <DropZone
                multiple={false}
                accept="application/pdf,.pdf"
                onFilesSelected={handlePdfSelected}
                title="Drop your PDF document here"
                subtitle="or click to browse from device — unlimited pages"
                formatsText="PDF Document"
              />
            </motion.div>
          )}

          {/* ── BUSY: Rendering State ───────────────────────────────── */}
          {stage === "busy" && (
            <motion.div
              key="busy"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-[#EAEAE5] bg-white p-10 flex flex-col items-center gap-6 shadow-2xs"
            >
              <div className="relative h-16 w-16 rounded-[18px] bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <div className="absolute inset-0 rounded-[18px] border border-blue-400/30 animate-ping opacity-30" />
              </div>

              <div className="text-center space-y-1.5 max-w-xs">
                <p className="text-base font-bold text-[#111111] tracking-[-0.01em]">
                  Rendering PDF Pages…
                </p>
                <p className="text-[13px] text-[#6E6D68]">{progressText}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-sm space-y-2">
                <div className="h-1.5 w-full bg-[#F5F4EE] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#111111] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
                <p className="text-center text-[11px] font-bold text-[#9E9D98] tabular-nums">{progress}%</p>
              </div>
            </motion.div>
          )}

          {/* ── DONE: Grid Preview & Export Controls ────────────────── */}
          {stage === "done" && pages.length > 0 && pdfFile && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start"
            >
              {/* LEFT: Rendered Pages Grid */}
              <div className="space-y-4">
                {/* Header & Page Selection Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAEAE5] pb-3.5">
                  <div className="space-y-0.5">
                    <SectionLabel>Document Pages</SectionLabel>
                    <p className="text-sm font-bold text-[#111111] tracking-[-0.01em] truncate max-w-sm">
                      {pdfFile.name} · {pages.length} {pages.length === 1 ? "Page" : "Pages"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => selectAllPages(selectedCount !== pages.length)}
                      className="px-3 py-1.5 rounded-xl border border-[#EAEAE5] bg-white text-[12px] font-semibold text-[#6E6D68] hover:border-[#BEBDB9] hover:text-[#111111] transition-all cursor-pointer"
                    >
                      {selectedCount === pages.length ? "Deselect All" : "Select All"}
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl border border-[#EAEAE5] bg-white text-[12px] font-semibold text-[#6E6D68] hover:border-[#BEBDB9] hover:text-[#111111] transition-all cursor-pointer"
                    >
                      Change PDF
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length) handlePdfSelected(files);
                        e.target.value = "";
                      }}
                    />

                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3 py-1.5 rounded-xl border border-[#EAEAE5] bg-white text-[12px] font-semibold text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Grid of Rendered Pages */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  <AnimatePresence>
                    {pages.map((page) => (
                      <motion.div
                        key={page.pageNum}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={`group relative flex flex-col rounded-2xl border bg-white overflow-hidden transition-all duration-200 ${
                          page.selected
                            ? "border-[#EAEAE5] hover:border-[#BEBDB9] hover:shadow-md"
                            : "border-[#EAEAE5]/60 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {/* Top Floating Overlay (Page Pill + Selection Checkbox) */}
                        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-20 pointer-events-none">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-md border border-[#EAEAE5] text-[10px] font-bold text-[#111111] shadow-xs tabular-nums">
                            <span className="text-[#9E9D98] font-medium">Page</span> {page.pageNum}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePageSelection(page.pageNum);
                            }}
                            className={`h-6 w-6 rounded-lg flex items-center justify-center border transition-all pointer-events-auto cursor-pointer shadow-xs ${
                              page.selected
                                ? "bg-[#111111] border-[#111111] text-white"
                                : "bg-white/90 border-[#EAEAE5] text-transparent hover:border-[#BEBDB9]"
                            }`}
                            title={page.selected ? "Included in export" : "Excluded from export"}
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </button>
                        </div>

                        {/* Thumbnail Preview (Clickable to Full Preview) */}
                        <div
                          onClick={() => setPreviewPage(page)}
                          className="relative w-full aspect-[3/4] bg-[#F8F8F6] p-4 flex items-center justify-center overflow-hidden border-b border-[#EAEAE5]/60 cursor-pointer"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={page.dataUrl}
                            alt={`Page ${page.pageNum}`}
                            className="max-h-full max-w-full object-contain rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.06)] group-hover:scale-[1.02] transition-transform duration-200"
                          />

                          {/* Quick Zoom Pill on Hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                              </svg>
                              Preview
                            </span>
                          </div>
                        </div>

                        {/* Card Footer: Metadata & Actions */}
                        <div className="p-3 bg-white space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-medium text-[#9E9D98]">
                            <span>{page.width} × {page.height}px</span>
                            <span className="bg-[#F5F4EE] text-[#6E6D68] px-1.5 py-0.5 rounded-md font-semibold">
                              {page.sizeLabel}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1 border-t border-[#F5F4EE]">
                            {/* Download Single Page */}
                            <button
                              type="button"
                              onClick={() => downloadSinglePage(page)}
                              className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-[#F5F4EE] hover:bg-[#111111] hover:text-white text-[#111111] text-[11px] font-semibold transition-all cursor-pointer"
                            >
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                              </svg>
                              <span>{options.format.toUpperCase()}</span>
                            </button>

                            {/* Copy Image */}
                            <button
                              type="button"
                              onClick={() => copyPageToClipboard(page)}
                              className="p-1.5 rounded-xl border border-[#EAEAE5] bg-white text-[#6E6D68] hover:text-[#111111] hover:border-[#BEBDB9] transition-all cursor-pointer"
                              title="Copy image to clipboard"
                            >
                              {copiedPage === page.pageNum ? (
                                <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              ) : (
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT: Export Options & Batch Actions */}
              <div className="space-y-5 lg:sticky lg:top-20">
                <div className="rounded-2xl border border-[#EAEAE5] bg-white p-5 space-y-5 shadow-2xs">

                  {/* Format Selector */}
                  <div className="space-y-2.5">
                    <SectionLabel>Image Format</SectionLabel>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "jpg", label: "JPG", desc: "Standard Document" },
                        { id: "png", label: "PNG", desc: "Crisp Lossless" },
                        { id: "webp", label: "WEBP", desc: "Compact Web" },
                      ].map((fmt) => (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => handleOptionChange("format", fmt.id as ImageFormat)}
                          className={`flex flex-col items-start px-2.5 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                            options.format === fmt.id
                              ? "bg-[#111111] border-[#111111] text-white"
                              : "bg-white border-[#EAEAE5] text-[#111111] hover:border-[#BEBDB9]"
                          }`}
                        >
                          <span className="text-[12px] font-bold leading-none">{fmt.label}</span>
                          <span className={`text-[9px] font-medium mt-1 leading-none ${options.format === fmt.id ? "text-white/60" : "text-[#9E9D98]"}`}>
                            {fmt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* DPI / Scale Multiplier */}
                  <div className="space-y-2.5">
                    <SectionLabel>Resolution & DPI</SectionLabel>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { scale: 1, label: "1x Standard", desc: "72 DPI • Fast" },
                        { scale: 1.5, label: "1.5x Crisp", desc: "~110 DPI" },
                        { scale: 2, label: "2x High Def", desc: "144 DPI • Best" },
                        { scale: 3, label: "3x Ultra HD", desc: "300 DPI • Print" },
                      ].map((s) => (
                        <button
                          key={s.scale}
                          type="button"
                          onClick={() => handleOptionChange("scale", s.scale as ScaleFactor)}
                          className={`flex flex-col items-start px-2.5 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                            options.scale === s.scale
                              ? "bg-[#111111] border-[#111111] text-white"
                              : "bg-white border-[#EAEAE5] text-[#111111] hover:border-[#BEBDB9]"
                          }`}
                        >
                          <span className="text-[12px] font-bold leading-none">{s.label}</span>
                          <span className={`text-[9px] font-medium mt-1 leading-none ${options.scale === s.scale ? "text-white/60" : "text-[#9E9D98]"}`}>
                            {s.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Slider (JPG / WEBP) */}
                  {options.format !== "png" && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <SectionLabel>Quality</SectionLabel>
                        <span className="text-[12px] font-bold text-[#111111] tabular-nums">{options.quality}%</span>
                      </div>
                      <input
                        type="range"
                        min={60}
                        max={100}
                        step={1}
                        value={options.quality}
                        onChange={(e) => handleOptionChange("quality", Number(e.target.value))}
                        className="w-full h-1.5 accent-[#111111] cursor-pointer rounded-full"
                      />
                      <div className="flex justify-between text-[10px] text-[#BEBDB9] font-medium">
                        <span>Smaller size</span>
                        <span>Maximum clarity</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary 1-Click ZIP Download */}
                <button
                  type="button"
                  onClick={downloadAllZip}
                  disabled={selectedCount === 0 || isZipping}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#111111] text-white text-[14px] font-bold tracking-[-0.01em] hover:bg-[#1a1a1a] active:scale-[0.98] transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isZipping ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                      Creating ZIP Archive…
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Download All (ZIP)
                      <span className="px-2 py-0.5 rounded-full bg-white/15 text-[11px] font-bold">
                        {selectedCount} {selectedCount === 1 ? "page" : "pages"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── ERROR: Error State ──────────────────────────────────── */}
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
                <p className="text-sm font-bold text-rose-900">PDF processing failed</p>
                <p className="text-[12px] text-rose-700 mt-1 max-w-sm">{errorMsg || "An unexpected error occurred."}</p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-rose-700 text-white text-[13px] font-bold hover:bg-rose-800 active:scale-[0.98] transition-all cursor-pointer"
              >
                Try Another PDF
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Modal Fullscreen Preview ─────────────────────────────── */}
        <AnimatePresence>
          {previewPage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewPage(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-full max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="p-4 border-b border-[#EAEAE5] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111111]">
                    Page {previewPage.pageNum} · {previewPage.width} × {previewPage.height}px
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => downloadSinglePage(previewPage)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111111] text-white text-xs font-semibold hover:bg-[#262626]"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewPage(null)}
                      className="p-1.5 rounded-xl hover:bg-[#F5F4EE] text-[#6E6D68] hover:text-[#111111]"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-[#F8F8F6] overflow-auto flex items-center justify-center max-h-[75vh]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewPage.dataUrl}
                    alt={`Page ${previewPage.pageNum}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Privacy Badges ───────────────────────────────────────── */}
        <PrivacyBadges
          badges={[
            "100% In-browser",
            "Mozilla PDF.js engine",
            "HD 300 DPI Export",
            "Batch ZIP download",
            "Zero server uploads",
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
