/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertHeicToJpeg } from "../utils";

export type OutputFormat = "original" | "image/webp" | "image/jpeg" | "image/png";

export type ResizeMode = "original" | "4k" | "1080p" | "720p" | "scale_75" | "scale_50" | "scale_25" | "custom";

export interface CompressionSettings {
  mode: "quality" | "target_size";
  quality: number; // 0.05 to 1.0 (e.g. 0.75)
  targetSizeKb: number; // e.g. 200
  format: OutputFormat;
  resizeMode: ResizeMode;
  customWidth?: number;
  customHeight?: number;
  maintainAspectRatio?: boolean;
}

export interface CompressedFileResult {
  id: string;
  originalFile: File;
  originalName: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalUrl: string;

  compressedBlob: Blob;
  compressedSize: number;
  compressedWidth: number;
  compressedHeight: number;
  compressedUrl: string;
  compressedFormat: string;
  outputFileName: string;

  savedBytes: number;
  savingsPercentage: number;
  isLargerThanOriginal: boolean;
  status: "idle" | "compressing" | "done" | "error";
  errorMessage?: string;
}

/**
 * Calculates target dimensions based on resize mode and original dimensions.
 */
export function calculateTargetDimensions(
  origW: number,
  origH: number,
  settings: CompressionSettings
): { width: number; height: number } {
  const { resizeMode, customWidth, customHeight } = settings;

  if (resizeMode === "original") return { width: origW, height: origH };

  if (resizeMode === "4k") {
    const maxDim = 3840;
    if (origW <= maxDim && origH <= maxDim) return { width: origW, height: origH };
    const ratio = Math.min(maxDim / origW, maxDim / origH);
    return { width: Math.round(origW * ratio), height: Math.round(origH * ratio) };
  }

  if (resizeMode === "1080p") {
    const maxDim = 1920;
    if (origW <= maxDim && origH <= maxDim) return { width: origW, height: origH };
    const ratio = Math.min(maxDim / origW, maxDim / origH);
    return { width: Math.round(origW * ratio), height: Math.round(origH * ratio) };
  }

  if (resizeMode === "720p") {
    const maxDim = 1280;
    if (origW <= maxDim && origH <= maxDim) return { width: origW, height: origH };
    const ratio = Math.min(maxDim / origW, maxDim / origH);
    return { width: Math.round(origW * ratio), height: Math.round(origH * ratio) };
  }

  if (resizeMode === "scale_75") {
    return { width: Math.max(1, Math.round(origW * 0.75)), height: Math.max(1, Math.round(origH * 0.75)) };
  }

  if (resizeMode === "scale_50") {
    return { width: Math.max(1, Math.round(origW * 0.5)), height: Math.max(1, Math.round(origH * 0.5)) };
  }

  if (resizeMode === "scale_25") {
    return { width: Math.max(1, Math.round(origW * 0.25)), height: Math.max(1, Math.round(origH * 0.25)) };
  }

  if (resizeMode === "custom") {
    const targetW = customWidth && customWidth > 0 ? customWidth : origW;
    const targetH = customHeight && customHeight > 0 ? customHeight : origH;
    return { width: targetW, height: targetH };
  }

  return { width: origW, height: origH };
}

/**
 * Determines target MIME type and file extension.
 */
export function resolveTargetFormat(
  originalType: string,
  originalName: string,
  chosenFormat: OutputFormat
): { mimeType: string; extension: string } {
  if (chosenFormat === "image/webp") return { mimeType: "image/webp", extension: "webp" };
  if (chosenFormat === "image/jpeg") return { mimeType: "image/jpeg", extension: "jpg" };
  if (chosenFormat === "image/png") return { mimeType: "image/png", extension: "png" };

  // "original" format mode:
  const ext = originalName.split(".").pop()?.toLowerCase() ?? "jpg";
  if (ext === "webp" || originalType === "image/webp") {
    return { mimeType: "image/webp", extension: "webp" };
  }
  if (ext === "png" || originalType === "image/png") {
    return { mimeType: "image/webp", extension: "webp" };
  }
  return { mimeType: "image/jpeg", extension: "jpg" };
}

/**
 * Loads an image (with HEIC support) into an HTMLImageElement.
 */
export async function loadImageFromFile(file: File): Promise<{
  imgSource: CanvasImageSource;
  width: number;
  height: number;
  revocableUrl: string;
}> {
  let processable = file;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const isHeic = ext === "heic" || ext === "heif" || file.type === "image/heic" || file.type === "image/heif";

  if (isHeic) {
    processable = await convertHeicToJpeg(file);
  }

  const url = URL.createObjectURL(processable);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        imgSource: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        revocableUrl: url,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image"));
    };
    img.src = url;
  });
}

function exportCanvasBlob(canvas: HTMLCanvasElement, format: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      format,
      quality
    );
  });
}

/**
 * High-accuracy Target File Size Compressor:
 * Binary searches quality, and dynamically rescales resolution when necessary to strictly hit target size.
 */
async function compressToTargetSize(
  sourceCanvas: HTMLCanvasElement,
  format: string,
  targetBytes: number
): Promise<{ blob: Blob; finalW: number; finalH: number }> {
  let currentW = sourceCanvas.width;
  let currentH = sourceCanvas.height;

  let activeCanvas = document.createElement("canvas");
  activeCanvas.width = currentW;
  activeCanvas.height = currentH;
  let activeCtx = activeCanvas.getContext("2d")!;
  activeCtx.imageSmoothingEnabled = true;
  activeCtx.imageSmoothingQuality = "high";

  if (format === "image/jpeg") {
    activeCtx.fillStyle = "#FFFFFF";
    activeCtx.fillRect(0, 0, currentW, currentH);
  }
  activeCtx.drawImage(sourceCanvas, 0, 0, currentW, currentH);

  let bestBlob: Blob | null = null;

  for (let resizeIter = 0; resizeIter < 5; resizeIter++) {
    let lowQ = 0.05;
    let highQ = 0.95;
    let passBest: Blob | null = null;

    for (let qIter = 0; qIter < 7; qIter++) {
      const midQ = (lowQ + highQ) / 2;
      const trial = await exportCanvasBlob(activeCanvas, format, midQ);
      if (!trial) break;

      if (trial.size <= targetBytes) {
        passBest = trial;
        lowQ = midQ; // Try to get higher quality while still <= targetBytes
      } else {
        highQ = midQ;
      }
    }

    if (passBest) {
      bestBlob = passBest;
      break;
    }

    // Quality search at this resolution was still > targetBytes (even at q=0.05)
    // Scale down dimensions to fit
    const minTrial = await exportCanvasBlob(activeCanvas, format, 0.08);
    const minSize = minTrial ? minTrial.size : targetBytes * 2;
    const ratio = Math.max(0.15, Math.min(0.85, Math.sqrt(targetBytes / minSize) * 0.92));

    currentW = Math.max(16, Math.round(currentW * ratio));
    currentH = Math.max(16, Math.round(currentH * ratio));

    activeCanvas = document.createElement("canvas");
    activeCanvas.width = currentW;
    activeCanvas.height = currentH;
    activeCtx = activeCanvas.getContext("2d")!;
    activeCtx.imageSmoothingEnabled = true;
    activeCtx.imageSmoothingQuality = "high";

    if (format === "image/jpeg") {
      activeCtx.fillStyle = "#FFFFFF";
      activeCtx.fillRect(0, 0, currentW, currentH);
    }
    activeCtx.drawImage(sourceCanvas, 0, 0, currentW, currentH);
  }

  // Final fallback if extremely strict
  if (!bestBlob) {
    bestBlob = (await exportCanvasBlob(activeCanvas, format, 0.2)) || (await exportCanvasBlob(sourceCanvas, format, 0.5))!;
  }

  return { blob: bestBlob, finalW: currentW, finalH: currentH };
}

/**
 * Smart Compress Image Engine
 */
export async function compressImage(
  file: File,
  settings: CompressionSettings
): Promise<CompressedFileResult> {
  const fileId = `${file.name}-${file.size}-${Math.random().toString(36).substring(2, 7)}`;
  const { imgSource, width: origW, height: origH, revocableUrl: originalUrl } = await loadImageFromFile(file);

  const { width: targetW, height: targetH } = calculateTargetDimensions(origW, origH, settings);
  const { mimeType, extension } = resolveTargetFormat(file.type, file.name, settings.format);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d", { willReadFrequently: false })!;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (mimeType === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, targetW, targetH);
  }

  ctx.drawImage(imgSource, 0, 0, targetW, targetH);

  let finalBlob: Blob;
  let finalWidth = targetW;
  let finalHeight = targetH;

  if (settings.mode === "target_size") {
    const targetBytes = settings.targetSizeKb * 1024;
    const formatToUse = mimeType === "image/png" ? "image/webp" : mimeType;
    const res = await compressToTargetSize(canvas, formatToUse, targetBytes);
    finalBlob = res.blob;
    finalWidth = res.finalW;
    finalHeight = res.finalH;
  } else {
    // Mode 2: Quality mode with size protection
    let currentQ = Math.max(0.05, Math.min(1.0, settings.quality));
    let exportedBlob = await new Promise<Blob>((res, rej) => {
      canvas.toBlob(
        (blob) => (blob ? res(blob) : rej(new Error("Canvas compression failed"))),
        mimeType,
        mimeType === "image/png" ? undefined : currentQ
      );
    });

    // Guard against file expansion
    if (exportedBlob.size > file.size && mimeType !== "image/png") {
      while (exportedBlob.size > file.size && currentQ > 0.2) {
        currentQ -= 0.12;
        const smallerTrial = await new Promise<Blob | null>((res) =>
          canvas.toBlob((b) => res(b), mimeType, Math.max(0.1, currentQ))
        );
        if (smallerTrial) {
          exportedBlob = smallerTrial;
        } else {
          break;
        }
      }
    }

    finalBlob = exportedBlob;
    
    // Strict fallback: if we failed to reduce the size, and we didn't resize or change the format intentionally,
    // just revert to the original file to prevent degradation without benefit.
    if (finalBlob.size >= file.size && settings.resizeMode === "original" && mimeType === file.type) {
      finalBlob = file;
    }
  }

  const compressedUrl = URL.createObjectURL(finalBlob);
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const outputFileName = `${baseName}-infyn.${extension}`;
  const isLarger = finalBlob.size > file.size;
  const savedBytes = Math.max(0, file.size - finalBlob.size);
  const savingsPercentage = file.size > 0 ? Math.round((savedBytes / file.size) * 100) : 0;

  return {
    id: fileId,
    originalFile: file,
    originalName: file.name,
    originalSize: file.size,
    originalWidth: origW,
    originalHeight: origH,
    originalUrl,

    compressedBlob: finalBlob,
    compressedSize: finalBlob.size,
    compressedWidth: finalWidth,
    compressedHeight: finalHeight,
    compressedUrl,
    compressedFormat: extension.toUpperCase(),
    outputFileName,

    savedBytes,
    savingsPercentage,
    isLargerThanOriginal: isLarger,
    status: "done",
  };
}
