"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
type BrushMode = "erase" | "restore";

export interface MaskEditorHandle {
  /** Returns a new PNG blob with the edited mask applied */
  exportPng: () => Promise<Blob | null>;
  /** Undo last stroke */
  undo: () => void;
  /** Check whether there's anything to undo */
  canUndo: boolean;
}

interface MaskEditorProps {
  /** The current result PNG data URL (transparent cutout) */
  resultUrl: string;
  /** The original source image URL, for the restore brush to sample from */
  sourceUrl: string;
}

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */
const MIN_BRUSH = 4;
const MAX_BRUSH = 120;

/* ─────────────────────────────────────────────────────────────
   MaskEditorCanvas — the core component
───────────────────────────────────────────────────────────── */
export const MaskEditorCanvas = forwardRef<MaskEditorHandle, MaskEditorProps>(
  function MaskEditorCanvas({ resultUrl, sourceUrl }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const displayCanvasRef = useRef<HTMLCanvasElement>(null); // shown to user
    const workingCanvasRef = useRef<HTMLCanvasElement>(null); // full-res edits
    const sourceCanvasRef = useRef<HTMLCanvasElement>(null);  // original pixels

    const [brushMode, setBrushMode] = useState<BrushMode>("erase");
    const [brushSize, setBrushSize] = useState(32);
    const [brushOpacity, setBrushOpacity] = useState(100);
    const [isReady, setIsReady] = useState(false);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

    // Undo history — store snapshots of working canvas image data
    const historyRef = useRef<ImageData[]>([]);
    const [canUndo, setCanUndo] = useState(false);

    const isPaintingRef = useRef(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);

    /* ── Load images into canvases on mount / url change ── */
    useEffect(() => {
      setIsReady(false);
      historyRef.current = [];
      setCanUndo(false);

      const resultImg = new window.Image();
      const sourceImg = new window.Image();

      resultImg.onload = () => {
        const w = resultImg.naturalWidth;
        const h = resultImg.naturalHeight;

        // Set up working canvas (full res)
        const wc = workingCanvasRef.current!;
        wc.width = w;
        wc.height = h;
        const wctx = wc.getContext("2d")!;
        wctx.clearRect(0, 0, w, h);
        wctx.drawImage(resultImg, 0, 0);

        // Set up source canvas (original image for restore)
        sourceImg.onload = () => {
          const sc = sourceCanvasRef.current!;
          sc.width = w;
          sc.height = h;
          const sctx = sc.getContext("2d")!;
          sctx.drawImage(sourceImg, 0, 0, w, h);
          syncDisplay();
          setIsReady(true);
        };
        sourceImg.onerror = () => {
          syncDisplay();
          setIsReady(true);
        };
        sourceImg.src = sourceUrl;
      };
      resultImg.src = resultUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultUrl, sourceUrl]);

    /* ── Sync working canvas → display canvas (scaled to fit container) ── */
    const syncDisplay = useCallback(() => {
      const wc = workingCanvasRef.current;
      const dc = displayCanvasRef.current;
      const container = containerRef.current;
      if (!wc || !dc || !container || wc.width === 0) return;

      const containerW = container.clientWidth;
      const containerH = container.clientHeight;
      const scale = Math.min(containerW / wc.width, containerH / wc.height);
      dc.width = Math.round(wc.width * scale);
      dc.height = Math.round(wc.height * scale);

      const dctx = dc.getContext("2d")!;
      dctx.clearRect(0, 0, dc.width, dc.height);
      dctx.drawImage(wc, 0, 0, dc.width, dc.height);
    }, []);

    /* ── Map display canvas coords → working canvas coords ── */
    const toWorkingCoords = useCallback(
      (clientX: number, clientY: number): { x: number; y: number } => {
        const dc = displayCanvasRef.current!;
        const wc = workingCanvasRef.current!;
        const rect = dc.getBoundingClientRect();
        const scaleX = wc.width / dc.width;
        const scaleY = wc.height / dc.height;
        return {
          x: (clientX - rect.left) * scaleX,
          y: (clientY - rect.top) * scaleY,
        };
      },
      []
    );

    /* ── Push snapshot to history before each stroke ── */
    const pushHistory = useCallback(() => {
      const wc = workingCanvasRef.current!;
      const ctx = wc.getContext("2d")!;
      const snapshot = ctx.getImageData(0, 0, wc.width, wc.height);
      historyRef.current.push(snapshot);
      if (historyRef.current.length > 30) historyRef.current.shift();
      setCanUndo(true);
    }, []);

    /* ── Paint a single stroke segment ── */
    const paintAt = useCallback(
      (x: number, y: number, fromX?: number, fromY?: number) => {
        const wc = workingCanvasRef.current!;
        const wctx = wc.getContext("2d")!;
        const sc = sourceCanvasRef.current!;

        const radius = brushSize / 2;
        const opacity = brushOpacity / 100;

        if (brushMode === "erase") {
          // Erase: use destination-out to cut away alpha
          wctx.save();
          wctx.globalAlpha = opacity;
          wctx.globalCompositeOperation = "destination-out";
          wctx.beginPath();
          if (fromX !== undefined && fromY !== undefined) {
            // Interpolate for smooth strokes
            const dist = Math.hypot(x - fromX, y - fromY);
            const steps = Math.max(1, Math.ceil(dist / (radius * 0.4)));
            for (let i = 0; i <= steps; i++) {
              const t = i / steps;
              const ix = fromX + (x - fromX) * t;
              const iy = fromY + (y - fromY) * t;
              wctx.arc(ix, iy, radius, 0, Math.PI * 2);
            }
          } else {
            wctx.arc(x, y, radius, 0, Math.PI * 2);
          }
          wctx.fill();
          wctx.restore();
        } else {
          // Restore: sample from source canvas and paint with alpha
          const sctx = sc.getContext("2d")!;
          const x0 = Math.max(0, Math.round(x - radius));
          const y0 = Math.max(0, Math.round(y - radius));
          const pw = Math.min(Math.round(radius * 2), wc.width - x0);
          const ph = Math.min(Math.round(radius * 2), wc.height - y0);
          if (pw <= 0 || ph <= 0) return;

          const srcData = sctx.getImageData(x0, y0, pw, ph);
          const dstData = wctx.getImageData(x0, y0, pw, ph);

          for (let py = 0; py < ph; py++) {
            for (let px = 0; px < pw; px++) {
              const cx = px + x0 - x;
              const cy = py + y0 - y;
              const dist = Math.hypot(cx, cy);
              if (dist > radius) continue;
              // Soft brush falloff
              const falloff = Math.max(0, 1 - (dist / radius) ** 1.5);
              const alpha = falloff * opacity;

              const idx = (py * pw + px) * 4;
              const srcR = srcData.data[idx];
              const srcG = srcData.data[idx + 1];
              const srcB = srcData.data[idx + 2];
              const srcA = srcData.data[idx + 3];
              const dstA = dstData.data[idx + 3];

              // Paint source color, boost alpha toward source alpha
              dstData.data[idx]     = Math.round(dstData.data[idx]     * (1 - alpha) + srcR * alpha);
              dstData.data[idx + 1] = Math.round(dstData.data[idx + 1] * (1 - alpha) + srcG * alpha);
              dstData.data[idx + 2] = Math.round(dstData.data[idx + 2] * (1 - alpha) + srcB * alpha);
              dstData.data[idx + 3] = Math.min(255, Math.round(dstA + (srcA - dstA) * alpha));
            }
          }
          wctx.putImageData(dstData, x0, y0);
        }

        syncDisplay();
      },
      [brushMode, brushSize, brushOpacity, syncDisplay]
    );

    /* ── Pointer event handlers ── */
    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        pushHistory();
        isPaintingRef.current = true;
        const pos = toWorkingCoords(e.clientX, e.clientY);
        lastPointRef.current = pos;
        paintAt(pos.x, pos.y);
      },
      [paintAt, pushHistory, toWorkingCoords]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        // cursorPos is always relative to the canvas element's top-left corner
        const dc = displayCanvasRef.current!;
        const rect = dc.getBoundingClientRect();
        setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

        if (!isPaintingRef.current) return;
        const pos = toWorkingCoords(e.clientX, e.clientY);
        const last = lastPointRef.current;
        paintAt(pos.x, pos.y, last?.x, last?.y);
        lastPointRef.current = pos;
      },
      [paintAt, toWorkingCoords]
    );

    const handlePointerUp = useCallback(() => {
      isPaintingRef.current = false;
      lastPointRef.current = null;
    }, []);

    const handlePointerLeave = useCallback(() => {
      setCursorPos(null);
      isPaintingRef.current = false;
      lastPointRef.current = null;
    }, []);

    /* ── Keyboard shortcuts ── */
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "z") {
          e.preventDefault();
          if (historyRef.current.length === 0) return;
          const prev = historyRef.current.pop()!;
          const wc = workingCanvasRef.current!;
          wc.getContext("2d")!.putImageData(prev, 0, 0);
          syncDisplay();
          setCanUndo(historyRef.current.length > 0);
        }
        if (e.key === "e") setBrushMode("erase");
        if (e.key === "r") setBrushMode("restore");
        if (e.key === "[") setBrushSize((s) => Math.max(MIN_BRUSH, s - 8));
        if (e.key === "]") setBrushSize((s) => Math.min(MAX_BRUSH, s + 8));
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, [syncDisplay]);

    /* ── Expose handle ── */
    useImperativeHandle(
      ref,
      () => ({
        exportPng: async () => {
          const wc = workingCanvasRef.current;
          if (!wc) return null;
          return new Promise<Blob | null>((resolve) => {
            wc.toBlob((b) => resolve(b), "image/png");
          });
        },
        undo: () => {
          if (historyRef.current.length === 0) return;
          const prev = historyRef.current.pop()!;
          const wc = workingCanvasRef.current!;
          wc.getContext("2d")!.putImageData(prev, 0, 0);
          syncDisplay();
          setCanUndo(historyRef.current.length > 0);
        },
        canUndo,
      }),
      [canUndo, syncDisplay]
    );

    /* ── Resize observer to re-sync display ── */
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const ro = new ResizeObserver(() => syncDisplay());
      ro.observe(container);
      return () => ro.disconnect();
    }, [syncDisplay]);

    /* ── Compute display-to-working pixel ratio for cursor size ── */
    const getDisplayRatio = () => {
      const dc = displayCanvasRef.current;
      const wc = workingCanvasRef.current;
      if (!dc || !wc || wc.width === 0) return 1;
      const rect = dc.getBoundingClientRect();
      return rect.width / wc.width;
    };

    return (
      <div className="flex flex-col gap-3">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-white border border-[#EAEAE5] shadow-2xs">

          {/* Mode toggle */}
          <div className="flex rounded-xl bg-[#F5F4EE] p-1 border border-[#EAEAE5] gap-0.5">
            <button
              onClick={() => setBrushMode("erase")}
              title="Erase (E)"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                brushMode === "erase"
                  ? "bg-white text-[#111111] shadow-2xs"
                  : "text-[#6E6D68] hover:text-[#111111]"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
              Erase
            </button>
            <button
              onClick={() => setBrushMode("restore")}
              title="Restore (R)"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                brushMode === "restore"
                  ? "bg-white text-[#111111] shadow-2xs"
                  : "text-[#6E6D68] hover:text-[#111111]"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Restore
            </button>
          </div>

          {/* Brush size */}
          <div className="flex items-center gap-2 min-w-[160px]">
            <svg className="h-3.5 w-3.5 text-[#9E9D98] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
            </svg>
            <input
              type="range"
              min={MIN_BRUSH}
              max={MAX_BRUSH}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="flex-1 h-1.5 accent-[#111111] cursor-pointer"
            />
            <span className="text-[11px] font-bold text-[#111111] w-7 text-right tabular-nums">{brushSize}px</span>
          </div>

          {/* Opacity */}
          <div className="flex items-center gap-2 min-w-[140px]">
            <span className="text-[10px] font-bold text-[#9E9D98] uppercase tracking-wider shrink-0">Opacity</span>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={brushOpacity}
              onChange={(e) => setBrushOpacity(Number(e.target.value))}
              className="flex-1 h-1.5 accent-[#111111] cursor-pointer"
            />
            <span className="text-[11px] font-bold text-[#111111] w-8 text-right tabular-nums">{brushOpacity}%</span>
          </div>

          {/* Keyboard hints */}
          <div className="ml-auto flex items-center gap-1.5 text-[10px] text-[#BEBDB9] font-medium hidden sm:flex">
            <kbd className="px-1.5 py-0.5 rounded bg-[#F5F4EE] border border-[#EAEAE5] font-mono">E</kbd>
            <span>Erase</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#F5F4EE] border border-[#EAEAE5] font-mono">R</kbd>
            <span>Restore</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#F5F4EE] border border-[#EAEAE5] font-mono">[</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-[#F5F4EE] border border-[#EAEAE5] font-mono">]</kbd>
            <span>Brush size</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#F5F4EE] border border-[#EAEAE5] font-mono">⌘Z</kbd>
            <span>Undo</span>
          </div>
        </div>

        {/* ── Canvas area ── */}
        <div
          ref={containerRef}
          className="relative w-full rounded-2xl overflow-hidden border border-[#EAEAE5] bg-[#F8F8F6] flex items-center justify-center"
          style={{ minHeight: 400, maxHeight: 600 }}
        >
          {/* Checkerboard (transparent indicator) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "repeating-conic-gradient(#E5E5E0 0% 25%, #F5F5F0 0% 50%)",
              backgroundSize: "16px 16px",
            }}
          />

          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="flex items-center gap-2 text-sm text-[#6E6D68] font-medium bg-white/90 px-4 py-2 rounded-xl border border-[#EAEAE5] shadow-sm">
                <svg className="h-4 w-4 animate-spin text-[#9E9D98]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Loading editor…
              </div>
            </div>
          )}

          {/* Hidden canvases */}
          <canvas ref={workingCanvasRef} className="hidden" />
          <canvas ref={sourceCanvasRef} className="hidden" />

          {/*
            Canvas wrapper — a tight relative div that is EXACTLY the
            same size as the display canvas. The cursor overlay lives here
            so its absolute position coordinates match the canvas perfectly.
          */}
          <div className="relative z-10 flex items-center justify-center" style={{ maxWidth: "100%", maxHeight: "100%" }}>
            <canvas
              ref={displayCanvasRef}
              style={{
                cursor: "none",
                display: "block",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerLeave}
            />

            {/* Custom brush cursor — lives inside the canvas wrapper so
                top/left coords are relative to the canvas element itself */}
            {cursorPos && isReady && (() => {
              const ratio = getDisplayRatio();
              const cursorDiameter = brushSize * ratio;
              return (
                <div
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: cursorPos.x,
                    top: cursorPos.y,
                    transform: "translate(-50%, -50%)",
                    width: cursorDiameter,
                    height: cursorDiameter,
                    borderRadius: "50%",
                    border: `2px solid ${
                      brushMode === "erase" ? "rgba(239,68,68,0.85)" : "rgba(16,185,129,0.85)"
                    }`,
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.25)",
                    background:
                      brushMode === "erase"
                        ? "rgba(239,68,68,0.07)"
                        : "rgba(16,185,129,0.07)",
                  }}
                />
              );
            })()}
          </div>

          {/* Mode badge overlay — kept in container so it's always top-left */}
          <div
            className={`absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              brushMode === "erase"
                ? "bg-rose-50 text-rose-700 border-rose-200/80"
                : "bg-emerald-50 text-emerald-700 border-emerald-200/80"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${
              brushMode === "erase" ? "bg-rose-500" : "bg-emerald-500"
            } animate-pulse`} />
            {brushMode === "erase" ? "Erase mode" : "Restore mode"}
          </div>
        </div>
      </div>
    );
  }
);
