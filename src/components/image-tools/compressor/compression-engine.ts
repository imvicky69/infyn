/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertHeicToJpeg } from "../utils";

export type OutputFormat = "original" | "image/webp" | "image/jpeg" | "image/png";

export type ResizeMode = "original" | "4k" | "1080p" | "720p" | "scale_75" | "scale_50" | "scale_25" | "custom";

export interface CompressionSettings {
  mode: "quality" | "target_size";
  quality: number; // 0.05 to 1.0 (e.g. 0.8)
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

  // "original" format
  const ext = originalName.split(".").pop()?.toLowerCase() ?? "jpg";
  if (ext === "png" || originalType === "image/png") return { mimeType: "image/png", extension: "png" };
  if (ext === "webp" || originalType === "image/webp") return { mimeType: "image/webp", extension: "webp" };
  return { mimeType: "image/jpeg", extension: "jpg" };
}

/**
 * Loads an image (with HEIC support) into an HTMLImageElement or ImageBitmap.
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

/**
 * Compresses an image based on settings.
 * Supports quality mode and binary search target file size mode!
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

  // Smooth high quality downsampling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Draw white background if converting transparent to JPEG
  if (mimeType === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, targetW, targetH);
  }

  ctx.drawImage(imgSource, 0, 0, targetW, targetH);

  let finalBlob: Blob;

  if (settings.mode === "target_size" && (mimeType === "image/jpeg" || mimeType === "image/webp")) {
    // Binary search to match target file size in KB
    const targetBytes = settings.targetSizeKb * 1024;
    let lowQ = 0.05;
    let highQ = 0.98;
    let bestBlob: Blob | null = null;

    for (let iter = 0; iter < 6; iter++) {
      const midQ = (lowQ + highQ) / 2;
      const trialBlob = await new Promise<Blob | null>((res) => canvas.toBlob((b) => res(b), mimeType, midQ));
      if (!trialBlob) break;

      bestBlob = trialBlob;
      if (trialBlob.size > targetBytes) {
        highQ = midQ;
      } else {
        lowQ = midQ;
      }
    }

    finalBlob = bestBlob || (await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("Export failed"))), mimeType, 0.75)));
  } else {
    // Standard quality export
    const q = mimeType === "image/png" ? undefined : Math.max(0.05, Math.min(1.0, settings.quality));
    finalBlob = await new Promise<Blob>((res, rej) => {
      canvas.toBlob(
        (blob) => (blob ? res(blob) : rej(new Error("Canvas compression failed"))),
        mimeType,
        q
      );
    });
  }

  const compressedUrl = URL.createObjectURL(finalBlob);
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const outputFileName = `${baseName}-infyn.${extension}`;
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
    compressedWidth: targetW,
    compressedHeight: targetH,
    compressedUrl,
    compressedFormat: extension.toUpperCase(),
    outputFileName,

    savedBytes,
    savingsPercentage,
    status: "done",
  };
}
