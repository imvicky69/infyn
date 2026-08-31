"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { ProgressBar } from "@/components/image-tools/progress-bar";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { formatBytes, convertHeicToJpeg } from "@/components/image-tools/utils";
import {
  AspectRatioSelector,
  AspectRatioOption,
  ASPECT_RATIO_PRESETS,
} from "@/components/image-tools/bg-remover/aspect-ratio-selector";
import {
  BackgroundCustomizer,
  BackgroundMode,
  GradientPreset,
  GRADIENT_PRESETS,
} from "@/components/image-tools/bg-remover/background-customizer";
import { TransformToolbar } from "@/components/image-tools/bg-remover/transform-toolbar";
import { getPipelineImage } from "@/components/image-tools/pipeline-storage";
import { ContinuePipelineBar } from "@/components/image-tools/continue-pipeline-bar";
import SplitText from "@/components/SplitText";
import {
  MaskEditorCanvas,
  type MaskEditorHandle,
} from "@/components/image-tools/bg-remover/mask-editor";

// ─── Types ────────────────────────────────────────────────────────────────────
type Stage = "idle" | "busy" | "done" | "error";

type WorkerMsg =
  | { type: "progress"; text: string; value: number }
  | { type: "done"; mask: ArrayBuffer; width: number; height: number }
  | { type: "error"; message: string };

// ─── Canvas Background Painter ────────────────────────────────────────────────
function renderBackgroundToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bgMode: BackgroundMode,
  color: string,
  gradient: GradientPreset
) {
  if (bgMode === "transparent") {
    ctx.clearRect(0, 0, width, height);
    return;
  }

  if (bgMode === "color") {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  if (bgMode === "gradient") {
    if (gradient.kind === "radial") {
      const cx = width * (gradient.cx ?? 0.5);
      const cy = height * (gradient.cy ?? 0.5);
      const r = Math.max(width, height) * 0.75;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      gradient.stops.forEach((s) => grad.addColorStop(s.offset, s.color));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      gradient.stops.forEach((s) => grad.addColorStop(s.offset, s.color));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BgRemoverPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const maskEditorRef = useRef<MaskEditorHandle>(null);

  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState({ text: "", value: 0 });
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [editedResultUrl, setEditedResultUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [imageDims, setImageDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [errorMsg, setErrorMsg] = useState("");

  // ── Customization Drawer Collapse / Expand state ────────────────────────────
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  // ── Manual touch-up editor state ────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isApplyingEdits, setIsApplyingEdits] = useState(false);

  // ── Background customization state ──────────────────────────────────────────
  const [bgMode, setBgMode] = useState<BackgroundMode>("transparent");
  const [selectedColor, setSelectedColor] = useState<string>("#FFFFFF");
  const [customColor, setCustomColor] = useState<string>("#6366F1");
  const [selectedGradient, setSelectedGradient] = useState<GradientPreset>(GRADIENT_PRESETS[0]);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioOption>(ASPECT_RATIO_PRESETS[0]);
  const [isDownloading, setIsDownloading] = useState(false);

  // ── Moveable & Adjustable Subject State ──────────────────────────────────────
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [scale, setScale] = useState(1);
  const [flipH, setFlipH] = useState(false);
  const [isDraggingSubject, setIsDraggingSubject] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, posX: 0, posY: 0 });

  // ── Boot worker on mount & check pipeline image ─────────────────────────────
  useEffect(() => {
    workerRef.current = new Worker(new URL("./worker.ts", import.meta.url));

    let active = true;
    (async () => {
      const pipelineFile = await getPipelineImage();
      if (pipelineFile && active) {
        processFile(pipelineFile);
      }
    })();

    return () => {
      active = false;
      workerRef.current?.terminate();
    };
  }, []);

  // ── Non-passive Wheel Zoom listener to avoid Chrome console errors ──────────
  useEffect(() => {
    const el = previewBoxRef.current;
    if (!el || stage !== "done") return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.06 : 0.94;
      setScale((prev) => Math.min(3, Math.max(0.2, Number((prev * zoomFactor).toFixed(2)))));
    };

    el.addEventListener("wheel", handleWheelNative, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheelNative);
    };
  }, [stage]);

  // ── Reset state ─────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    if (editedResultUrl) URL.revokeObjectURL(editedResultUrl);
    setSourceUrl(null);
    setResultUrl(null);
    setEditedResultUrl(null);
    setStage("idle");
    setProgress({ text: "", value: 0 });
    setErrorMsg("");
    setBgMode("transparent");
    setSelectedColor("#FFFFFF");
    setSelectedRatio(ASPECT_RATIO_PRESETS[0]);
    setPosX(0);
    setPosY(0);
    setScale(1);
    setFlipH(false);
    setIsCustomizing(false);
    setIsEditing(false);
  }, [sourceUrl, resultUrl, editedResultUrl]);

  // ── Process ─────────────────────────────────────────────────────────────────
  const processFile = useCallback(
    async (file: File) => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const ACCEPTED = ["jpg", "jpeg", "png", "webp", "heic", "heif", "gif", "bmp", "tiff", "avif"];
      const validType = file.type.startsWith("image/") || ACCEPTED.includes(ext);
      if (!validType) {
        setErrorMsg("Drop a valid image (JPG, PNG, WEBP, HEIC, AVIF, GIF…).");
        setStage("error");
        return;
      }

      reset();

      setFileName(file.name);
      setFileSize(file.size);

      let processable = file;
      const isHeic = ext === "heic" || ext === "heif" || file.type === "image/heic" || file.type === "image/heif";

      if (isHeic) {
        setStage("busy");
        setProgress({ text: "Converting HEIC…", value: 5 });
        try {
          processable = await convertHeicToJpeg(file);
        } catch {
          setErrorMsg("Could not decode this HEIC file. Open it in Photos, export as JPG, and try again.");
          setStage("error");
          return;
        }
      }

      const src = URL.createObjectURL(processable);
      setSourceUrl(src);
      setStage("busy");
      setProgress({ text: "Starting…", value: isHeic ? 10 : 2 });

      const worker = workerRef.current!;

      worker.onmessage = async (e: MessageEvent<WorkerMsg>) => {
        const msg = e.data;

        if (msg.type === "progress") {
          setProgress({ text: msg.text, value: msg.value });
        } else if (msg.type === "done") {
          setProgress({ text: "Done!", value: 100 });

          const canvas = canvasRef.current!;
          canvas.width = msg.width;
          canvas.height = msg.height;
          setImageDims({ width: msg.width, height: msg.height });
          const ctx = canvas.getContext("2d")!;

          const bmp = await createImageBitmap(processable);
          ctx.drawImage(bmp, 0, 0, msg.width, msg.height);

          const imgData = ctx.getImageData(0, 0, msg.width, msg.height);
          const mask = new Uint8Array(msg.mask);
          for (let i = 0; i < mask.length; i++) {
            imgData.data[4 * i + 3] = mask[i];
          }
          ctx.putImageData(imgData, 0, 0);

          const blob = await new Promise<Blob>((res, rej) =>
            canvas.toBlob((b) => (b ? res(b) : rej(new Error("Export failed"))), "image/png")
          );

          setResultUrl(URL.createObjectURL(blob));
          setTimeout(() => setStage("done"), 400);
        } else if (msg.type === "error") {
          setErrorMsg(msg.message);
          setStage("error");
        }
      };

      worker.onerror = (e) => {
        setErrorMsg(e.message);
        setStage("error");
      };

      const buf = await processable.arrayBuffer();
      worker.postMessage({ imageBuffer: buf }, [buf]);
    },
    [reset]
  );

  // ── Pointer Drag Handlers for Moving Subject ────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    if (stage !== "done") return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDraggingSubject(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      posX,
      posY,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingSubject) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setPosX(dragStart.posX + dx);
    setPosY(dragStart.posY + dy);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingSubject) {
      setIsDraggingSubject(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // noop
      }
    }
  };

  const resetTransform = () => {
    setPosX(0);
    setPosY(0);
    setScale(1);
    setFlipH(false);
  };

  const snapBottom = () => {
    const previewEl = previewBoxRef.current;
    if (!previewEl) return;
    const rect = previewEl.getBoundingClientRect();
    setPosX(0);
    setPosY(Math.round(rect.height * 0.12));
  };

  // ── High-Res Canvas Compositing & Export with Aspect Ratio ───────────────────
  const getExportBlob = async (): Promise<Blob | null> => {
    const rawCanvas = canvasRef.current;
    if (!rawCanvas || imageDims.width === 0) return null;

    let targetWidth = imageDims.width;
    let targetHeight = imageDims.height;

    if (selectedRatio.ratio !== "original") {
      const targetR = selectedRatio.ratio;
      if (targetR >= 1) {
        targetWidth = Math.max(imageDims.width, Math.round(imageDims.height * targetR));
        targetHeight = Math.round(targetWidth / targetR);
      } else {
        targetHeight = Math.max(imageDims.height, Math.round(imageDims.width / targetR));
        targetWidth = Math.round(targetHeight * targetR);
      }
    }

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = targetWidth;
    exportCanvas.height = targetHeight;
    const exportCtx = exportCanvas.getContext("2d")!;

    // 1. Paint chosen background onto the full canvas
    renderBackgroundToCanvas(
      exportCtx,
      targetWidth,
      targetHeight,
      bgMode,
      selectedColor,
      selectedGradient
    );

    // 2. Calculate WYSIWYG proportional scale and position from preview frame
    const previewEl = previewBoxRef.current;
    const previewRect = previewEl ? previewEl.getBoundingClientRect() : null;

    const fitPreviewScale = previewRect
      ? Math.min(previewRect.width / imageDims.width, previewRect.height / imageDims.height)
      : 1;

    const fittedPreviewW = Math.max(1, imageDims.width * fitPreviewScale);
    const fittedPreviewH = Math.max(1, imageDims.height * fitPreviewScale);

    const fitExportScale = Math.min(targetWidth / imageDims.width, targetHeight / imageDims.height);
    const fittedExportW = imageDims.width * fitExportScale;
    const fittedExportH = imageDims.height * fitExportScale;

    const exportOffsetX = (posX / fittedPreviewW) * fittedExportW;
    const exportOffsetY = (posY / fittedPreviewH) * fittedExportH;

    // 3. Draw transformed subject cutout onto canvas
    exportCtx.save();
    exportCtx.translate(
      targetWidth / 2 + exportOffsetX,
      targetHeight / 2 + exportOffsetY
    );
    exportCtx.scale(scale * (flipH ? -1 : 1), scale);
    exportCtx.drawImage(
      rawCanvas,
      -fittedExportW / 2,
      -fittedExportH / 2,
      fittedExportW,
      fittedExportH
    );
    exportCtx.restore();

    // 4. Export as PNG
    return await new Promise<Blob>((resolve, reject) => {
      exportCanvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Failed to export image"))),
        "image/png"
      );
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const blob = await getExportBlob();
      if (!blob) return;

      const base = fileName.replace(/\.[^.]+$/, "");
      const ratioTag = selectedRatio.id.replace(":", "-");
      const suffix =
        bgMode === "transparent" && selectedRatio.id === "original"
          ? "no-bg"
          : `${ratioTag}-${bgMode}`;

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${base}-${suffix}.png`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setSelectedColor(color);
    setBgMode("color");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-[#111111] flex flex-col font-sans">
      <canvas ref={canvasRef} className="hidden" />

      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col">

        {/* ── IDLE ─────────────────────────────────────────────────────── */}
        {stage === "idle" && (
          <div
            className="flex-1 flex flex-col items-center justify-center py-16 gap-8"
            style={{ animation: "fade-in-up 0.4s ease-out" }}
          >
            <div className="text-center space-y-3">
              <SplitText
                text="Remove Background"
                className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
                delay={35}
                duration={0.85}
                splitType="words, chars"
                tag="h1"
                textAlign="center"
              />
              <p className="text-sm text-[#6E6D68] flex items-center justify-center gap-2 flex-wrap">
                <span>Free</span>
                <span className="text-[#DDDDD8]">•</span>
                <span>Private</span>
                <span className="text-[#DDDDD8]">•</span>
                <span>Runs in your browser</span>
              </p>
            </div>

            <div className="w-full max-w-lg">
              <DropZone
                onFilesSelected={(files) => files[0] && processFile(files[0])}
                title="Drop your image"
                subtitle="or click to browse"
                formatsText="JPG · PNG · WEBP · HEIC · AVIF"
              />
            </div>

            <div className="text-center space-y-1.5">
              <p className="text-xs font-medium text-[#111111]">No signup required</p>
              <p className="text-xs text-[#9E9D98]">Your image never leaves your device.</p>
            </div>
          </div>
        )}

        {/* ── BUSY ─────────────────────────────────────────────────────── */}
        {stage === "busy" && (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-10 py-16"
            style={{ animation: "fade-in-up 0.35s ease-out" }}
          >
            {sourceUrl && (
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-[#EAEAE5] shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sourceUrl} alt="" className="w-full h-full object-cover scale-110 blur-sm opacity-40" />
                <div className="absolute inset-0 rounded-2xl" style={{ animation: "pulse-ring 2s ease-in-out infinite", background: "radial-gradient(circle, rgba(17,17,17,0.06) 0%, transparent 70%)" }} />
              </div>
            )}

            <div className="w-full max-w-sm flex flex-col gap-2 items-center">
              <p
                className="text-base font-semibold text-[#111111] mb-1"
                style={{ animation: "pulse-text 2s ease-in-out infinite" }}
              >
                Processing image…
              </p>
              <ProgressBar value={progress.value} text={progress.text} />
              <p className="text-xs text-[#9E9D98] mt-1">Processing locally on your device</p>
            </div>
          </div>
        )}

        {/* ── ERROR ────────────────────────────────────────────────────── */}
        {stage === "error" && (
          <div
            className="flex-1 flex items-center justify-center py-16"
            style={{ animation: "fade-in-up 0.3s ease-out" }}
          >
            <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold text-red-800">Could not process image</p>
                <p className="text-xs text-red-500 mt-1">{errorMsg}</p>
              </div>
              <button
                onClick={reset}
                className="self-start rounded-lg border border-red-300 bg-white px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* ── DONE (Clean Completed State with Collapsed/Expandable Options) ── */}
        {stage === "done" && sourceUrl && resultUrl && (
          <div
            className="flex flex-col gap-6 py-8"
            style={{ animation: "fade-in-up 0.4s ease-out" }}
          >
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#EAEAE5]">
              <div className="flex items-center gap-2 text-xs text-[#6E6D68] min-w-0">
                <span className="font-medium text-[#111111] truncate max-w-[180px]">{fileName}</span>
                <span className="text-[#DDDDD8]">·</span>
                <span>{formatBytes(fileSize)}</span>
                <span className="text-[#DDDDD8]">·</span>
                <span className="text-emerald-600 font-semibold shrink-0">Done ✓</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#111111] px-4 py-2 text-xs font-semibold text-white hover:bg-[#262626] active:scale-95 disabled:opacity-50 transition-all shadow-sm"
                >
                  {isDownloading ? (
                    <span>Exporting…</span>
                  ) : (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="3" x2="12" y2="3" />
                      </svg>
                      <span>Download As-Is</span>
                    </>
                  )}
                </button>
                <button
                  onClick={reset}
                  className="rounded-lg border border-[#EAEAE5] bg-white px-3 py-2 text-xs font-semibold text-[#111111] hover:bg-[#F5F4EE] active:scale-95 transition-all"
                >
                  New Image
                </button>
              </div>
            </div>

            {/* Before / After Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Original Image */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9D98]">Original</p>
                <div className="rounded-2xl overflow-hidden border border-[#EAEAE5] bg-[#F8F8F6] flex items-center justify-center p-3 h-[400px] sm:h-[480px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sourceUrl} alt="Original" className="w-full h-full object-contain pointer-events-none select-none" />
                </div>
              </div>

              {/* Result Preview with Active Aspect Ratio & Custom Background */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9D98] flex items-center gap-1.5">
                    <span>Result Preview</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#111111] text-white font-medium">
                      {selectedRatio.name}
                    </span>
                  </p>
                  <span className="text-[11px] font-medium text-[#6E6D68]">
                    {bgMode === "transparent"
                      ? "Transparent"
                      : bgMode === "color"
                      ? `Color (${selectedColor.toUpperCase()})`
                      : `Gradient: ${selectedGradient.name}`}
                  </span>
                </div>

                {/* Outer frame container */}
                <div className="rounded-2xl border border-[#EAEAE5] bg-[#F8F8F6] flex items-center justify-center p-3 h-[400px] sm:h-[480px] overflow-hidden">
                  {/* Inner Framed Box matching the selected Aspect Ratio */}
                  <div
                    ref={previewBoxRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className={`relative rounded-xl overflow-hidden shadow-xs select-none touch-none flex items-center justify-center ${
                      isDraggingSubject ? "cursor-grabbing ring-2 ring-[#111111]" : "cursor-grab"
                    }`}
                    style={{
                      aspectRatio:
                        selectedRatio.ratio === "original"
                          ? imageDims.width && imageDims.height
                            ? `${imageDims.width} / ${imageDims.height}`
                            : undefined
                          : selectedRatio.cssAspect,
                      width: selectedRatio.ratio === "original" ? "100%" : undefined,
                      height: selectedRatio.ratio === "original" ? "100%" : undefined,
                      maxWidth: "100%",
                      maxHeight: "100%",
                      background:
                        bgMode === "color"
                          ? selectedColor
                          : bgMode === "gradient"
                          ? selectedGradient.css
                          : undefined,
                    }}
                  >
                    {/* Background Checkerboard (if transparent) */}
                    {bgMode === "transparent" && (
                      <div
                        className="absolute inset-0 pointer-events-none z-0"
                        style={{
                          backgroundImage: "repeating-conic-gradient(#E5E5E0 0% 25%, #F5F5F0 0% 50%)",
                          backgroundSize: "16px 16px",
                        }}
                      />
                    )}

                    {/* Moveable & Scalable Subject Cutout */}
                    <div
                      className="relative w-full h-full flex items-center justify-center pointer-events-none z-10"
                      style={{
                        transform: `translate(${posX}px, ${posY}px) scale(${scale}) scaleX(${flipH ? -1 : 1})`,
                        transition: isDraggingSubject ? "none" : "transform 0.15s ease-out",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resultUrl}
                        alt="Subject cutout"
                        className="w-full h-full object-contain p-2"
                        draggable={false}
                      />
                    </div>

                    {/* Floating drag guide hint */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-white text-[9px] font-medium pointer-events-none flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                      </svg>
                      <span>Drag to move • Scroll to zoom</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Main Action Bar (Download As-Is vs Customize Options) ───────── */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-[#EAEAE5] bg-white shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#262626] active:scale-95 disabled:opacity-50 transition-all shadow-sm"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="3" x2="12" y2="3" />
                  </svg>
                  <span>Download PNG (As-Is)</span>
                </button>

                <button
                  onClick={() => setIsCustomizing((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold border transition-all ${
                    isCustomizing
                      ? "border-[#111111] bg-[#F5F4EE] text-[#111111]"
                      : "border-[#EAEAE5] bg-white text-[#111111] hover:bg-[#F8F8F6] hover:border-[#BEBDB9]"
                  }`}
                >
                  <svg className="h-4 w-4 text-[#6E6D68]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span>{isCustomizing ? "Hide Options" : "Edit More (Colors, Size, Position)"}</span>
                  <svg
                    className={`h-3 w-3 text-[#9E9D98] transition-transform duration-200 ${isCustomizing ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <span className="text-[11px] text-[#9E9D98] hidden sm:inline">
                {isCustomizing ? "Customization active" : "Quick export ready"}
              </span>
            </div>

            {/* ── Manual Touch-Up Editor ─────────────────────────────────── */}
            <div className="rounded-2xl border border-[#EAEAE5] bg-white shadow-2xs overflow-hidden">
              {/* Header toggle */}
              <button
                onClick={() => setIsEditing((p) => !p)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FDFDF9] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center border transition-all ${
                    isEditing
                      ? "bg-indigo-50 border-indigo-200/80 text-indigo-700"
                      : "bg-[#F5F4EE] border-[#EAEAE5] text-[#6E6D68]"
                  }`}>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-bold text-[#111111] tracking-[-0.01em]">
                      Manual Touch-Up
                    </p>
                    <p className="text-[11px] text-[#9E9D98] mt-0.5">
                      Erase leftover background · Restore missing areas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isEditing && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                      Active
                    </span>
                  )}
                  <svg
                    className={`h-4 w-4 text-[#9E9D98] transition-transform duration-200 ${isEditing ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Editor panel */}
              {isEditing && resultUrl && sourceUrl && (
                <div className="px-5 pb-5 space-y-4" style={{ animation: "fade-in-up 0.25s ease-out" }}>
                  <MaskEditorCanvas
                    ref={maskEditorRef}
                    resultUrl={editedResultUrl ?? resultUrl}
                    sourceUrl={sourceUrl}
                  />

                  {/* Apply & Undo row */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={async () => {
                        if (!maskEditorRef.current) return;
                        setIsApplyingEdits(true);
                        try {
                          const blob = await maskEditorRef.current.exportPng();
                          if (!blob) return;
                          if (editedResultUrl) URL.revokeObjectURL(editedResultUrl);
                          const newUrl = URL.createObjectURL(blob);
                          setEditedResultUrl(newUrl);
                          // Also update the result canvas for export compositing
                          const img = new window.Image();
                          img.onload = () => {
                            const canvas = canvasRef.current;
                            if (!canvas) return;
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            const ctx = canvas.getContext("2d")!;
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(img, 0, 0);
                            setResultUrl(newUrl);
                          };
                          img.src = newUrl;
                        } finally {
                          setIsApplyingEdits(false);
                        }
                      }}
                      disabled={isApplyingEdits}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-[13px] font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isApplyingEdits ? (
                        <>
                          <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                          </svg>
                          Applying…
                        </>
                      ) : (
                        <>
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Apply Edits to Result
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => maskEditorRef.current?.undo()}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#EAEAE5] bg-white text-[13px] font-semibold text-[#111111] hover:bg-[#F5F4EE] hover:border-[#BEBDB9] active:scale-[0.98] transition-all"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                      </svg>
                      Undo
                    </button>

                    {editedResultUrl && (
                      <button
                        onClick={() => {
                          URL.revokeObjectURL(editedResultUrl);
                          setEditedResultUrl(null);
                        }}
                        className="px-3 py-2.5 rounded-xl border border-[#EAEAE5] bg-white text-[12px] font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all"
                        title="Reset to original AI result"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-[#9E9D98] text-center">
                    Paint with the <strong className="text-[#111111]">Erase</strong> brush to remove leftover background.
                    Use <strong className="text-[#111111]">Restore</strong> to bring back missing parts.
                  </p>
                </div>
              )}
            </div>

            {/* ── Continue in Other Infyn Tools ───────────────────────────── */}
            <ContinuePipelineBar
              currentTool="bg-remover"
              getImageBlob={getExportBlob}
              imageName={fileName ? fileName.replace(/\.[^.]+$/, "-nobg.png") : "nobg.png"}
            />

            {/* ── Collapsible Customization Drawer ───────────────────────────── */}
            {isCustomizing && (
              <div className="space-y-5" style={{ animation: "fade-in-up 0.25s ease-out" }}>
                {/* 1. Format & Aspect Ratio */}
                <AspectRatioSelector
                  selectedRatio={selectedRatio}
                  onSelectRatio={setSelectedRatio}
                />

                {/* 2. Position & Transform Controls */}
                <TransformToolbar
                  scale={scale}
                  onScaleChange={setScale}
                  flipH={flipH}
                  onToggleFlip={() => setFlipH((f) => !f)}
                  onSnapBottom={snapBottom}
                  onReset={resetTransform}
                  hasTransformChanges={posX !== 0 || posY !== 0 || scale !== 1 || flipH}
                />

                {/* 3. Choose Background */}
                <BackgroundCustomizer
                  bgMode={bgMode}
                  onBgModeChange={setBgMode}
                  selectedColor={selectedColor}
                  onColorChange={(col) => {
                    setSelectedColor(col);
                    setBgMode("color");
                  }}
                  customColor={customColor}
                  onCustomColorChange={handleCustomColorChange}
                  selectedGradient={selectedGradient}
                  onGradientChange={(grad) => {
                    setSelectedGradient(grad);
                    setBgMode("gradient");
                  }}
                />

                {/* 4. Bottom Custom Export Card */}
                <div className="rounded-2xl border border-[#111111] bg-[#111111] text-white p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
                      <span>Ready to Export</span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white tracking-wider">
                        {selectedRatio.name} • {bgMode === "transparent" ? "PNG (Alpha)" : bgMode === "color" ? "Custom Color" : "Gradient"}
                      </span>
                    </h3>
                    <p className="text-xs text-white/70 max-w-md leading-relaxed">
                      Exported at highest resolution with all background, position, and aspect ratio customizations preserved.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-center">
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#111111] px-6 py-3 text-sm font-bold hover:bg-[#F5F4EE] active:scale-95 disabled:opacity-50 transition-all shadow-sm"
                    >
                      {isDownloading ? (
                        <span>Exporting Image…</span>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="3" x2="12" y2="3" />
                          </svg>
                          <span>Download Image ({selectedRatio.name})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Badges */}
            <PrivacyBadges
              badges={[
                "100% In-browser",
                "BRIA RMBG-1.4",
                "Manual brush editor",
                "Custom aspect ratios",
                "Move & resize subject",
                "Your image never leaves your device",
              ]}
              className="pt-1"
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
