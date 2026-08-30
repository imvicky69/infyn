/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertHeicToJpeg } from "@/components/image-tools/utils";

export type FitMode = "cover" | "contain" | "stretch";
export type BgStyle = "blur" | "color" | "transparent";
export type TargetFormat = "original" | "image/jpeg" | "image/png" | "image/webp";

export interface TransformSettings {
  panX: number; // in preview pixel units
  panY: number; // in preview pixel units
  scale: number; // 0.2 to 3.5
  flipH: boolean;
  previewWidth?: number;
  previewHeight?: number;
}

export interface ResizeSettings {
  mode: "dimensions" | "percentage";
  width: number;
  height: number;
  percentage: number;
  maintainAspectRatio: boolean;
  fitMode: FitMode;
  bgStyle: BgStyle;
  bgColor: string;
  format: TargetFormat;
  quality: number; // 0.1 to 1.0
  transform?: TransformSettings;
}

export interface ResizedFileResult {
  id: string;
  originalFile: File;
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
  originalUrl: string;
  resizedBlob: Blob;
  resizedWidth: number;
  resizedHeight: number;
  resizedSize: number;
  resizedUrl: string;
  name: string;
  mimeType: string;
}

/**
 * High-quality client-side image resizing and transform compositing using HTML5 Canvas API.
 */
export async function resizeImage(
  file: File,
  settings: ResizeSettings,
  targetDimensions?: { width: number; height: number }
): Promise<ResizedFileResult> {
  let processedFile = file;

  // Handle HEIC/HEIF files
  if (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name)
  ) {
    try {
      processedFile = await convertHeicToJpeg(file);
    } catch (err) {
      console.warn("HEIC decoding fallback", err);
    }
  }

  const originalUrl = URL.createObjectURL(processedFile);

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = (e) => reject(e);
    el.src = originalUrl;
  });

  const origWidth = img.naturalWidth;
  const origHeight = img.naturalHeight;

  let targetW: number;
  let targetH: number;

  if (targetDimensions) {
    targetW = Math.max(1, Math.round(targetDimensions.width));
    targetH = Math.max(1, Math.round(targetDimensions.height));
  } else if (settings.mode === "percentage") {
    const scale = Math.max(0.01, settings.percentage / 100);
    targetW = Math.max(1, Math.round(origWidth * scale));
    targetH = Math.max(1, Math.round(origHeight * scale));
  } else {
    // Dimensions mode: use exact chosen settings width and height
    targetW = Math.max(1, Math.round(settings.width || origWidth));
    targetH = Math.max(1, Math.round(settings.height || origHeight));
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d")!;

  // High quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 1. Render Background Layer (Blur / Solid Color / Transparent)
  if (settings.bgStyle === "blur") {
    ctx.save();
    // Render blurred cover background
    const bgScale = Math.max(targetW / origWidth, targetH / origHeight) * 1.15;
    const bgW = origWidth * bgScale;
    const bgH = origHeight * bgScale;

    // Use canvas filter for smooth blur
    try {
      (ctx as any).filter = "blur(24px) brightness(0.85)";
      ctx.drawImage(img, (targetW - bgW) / 2, (targetH - bgH) / 2, bgW, bgH);
      (ctx as any).filter = "none";
    } catch {
      ctx.drawImage(img, (targetW - bgW) / 2, (targetH - bgH) / 2, bgW, bgH);
    }
    ctx.restore();
  } else if (settings.bgStyle === "color" && settings.bgColor && settings.bgColor !== "transparent") {
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0, 0, targetW, targetH);
  } else {
    ctx.clearRect(0, 0, targetW, targetH);
  }

  // 2. Calculate Base Draw Dimensions for Main Subject
  let drawW: number;
  let drawH: number;

  if (settings.fitMode === "cover") {
    const scaleFactor = Math.max(targetW / origWidth, targetH / origHeight);
    drawW = origWidth * scaleFactor;
    drawH = origHeight * scaleFactor;
  } else if (settings.fitMode === "contain") {
    const scaleFactor = Math.min(targetW / origWidth, targetH / origHeight);
    drawW = origWidth * scaleFactor;
    drawH = origHeight * scaleFactor;
  } else {
    // Stretch mode
    drawW = targetW;
    drawH = targetH;
  }

  // 3. Render Main Subject with User Pan, Zoom/Scale & Flip
  const transform = settings.transform;

  ctx.save();
  ctx.translate(targetW / 2, targetH / 2);

  if (transform) {
    const previewRatio =
      transform.previewWidth && transform.previewWidth > 0
        ? targetW / transform.previewWidth
        : 1;

    ctx.translate(
      (transform.panX || 0) * previewRatio,
      (transform.panY || 0) * previewRatio
    );
    ctx.scale(
      (transform.scale || 1) * (transform.flipH ? -1 : 1),
      transform.scale || 1
    );
  }

  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  // Determine output MIME type
  let outMime = processedFile.type || "image/jpeg";
  if (settings.format === "image/jpeg") outMime = "image/jpeg";
  else if (settings.format === "image/png") outMime = "image/png";
  else if (settings.format === "image/webp") outMime = "image/webp";

  // PNG ignores quality in toBlob, JPEG and WebP use it
  const qualityParam = outMime === "image/png" ? undefined : settings.quality;

  const resizedBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas blob conversion failed"));
      },
      outMime,
      qualityParam
    );
  });

  const resizedUrl = URL.createObjectURL(resizedBlob);

  // Generate output filename
  let outExt = ".jpg";
  if (outMime === "image/png") outExt = ".png";
  else if (outMime === "image/webp") outExt = ".webp";
  else if (outMime === "image/jpeg") outExt = ".jpg";

  const rawBase = (processedFile.name || "image").replace(/\.[^/.]+$/, "");
  const baseName = rawBase.trim() || "image";
  const outName = `${baseName}-${targetW}x${targetH}${outExt}`;

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    originalFile: processedFile,
    originalWidth: origWidth,
    originalHeight: origHeight,
    originalSize: processedFile.size,
    originalUrl,
    resizedBlob,
    resizedWidth: targetW,
    resizedHeight: targetH,
    resizedSize: resizedBlob.size,
    resizedUrl,
    name: outName,
    mimeType: outMime,
  };
}
