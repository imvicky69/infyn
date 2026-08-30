/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertHeicToJpeg } from "../utils";

export type OutputTargetFormat = "image/jpeg" | "image/png" | "image/webp";

export interface HeicConvertSettings {
  format: OutputTargetFormat;
  quality: number; // 0.1 to 1.0 (e.g. 0.92)
}

export interface ConvertedImageResult {
  id: string;
  originalFile: File;
  originalName: string;
  originalSize: number;
  originalType: string;
  convertedBlob: Blob;
  convertedSize: number;
  convertedWidth: number;
  convertedHeight: number;
  convertedUrl: string;
  outputFileName: string;
  outputFormatLabel: string;
  status: "idle" | "converting" | "done" | "error";
  errorMessage?: string;
}

/**
 * Universal image converter supporting HEIC, HEIF, AVIF, WebP, PNG, etc. -> JPG/PNG/WebP.
 */
export async function convertSingleImage(
  file: File,
  settings: HeicConvertSettings
): Promise<ConvertedImageResult> {
  const fileId = `${file.name}-${file.size}-${Math.random().toString(36).substring(2, 7)}`;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const isHeic = ext === "heic" || ext === "heif" || file.type === "image/heic" || file.type === "image/heif";

  let intermediateFile: File = file;

  // Step 1: Decode HEIC if applicable
  if (isHeic) {
    intermediateFile = await convertHeicToJpeg(file);
  }

  // Step 2: Load into Canvas for high quality export and formatting
  const intermediateUrl = URL.createObjectURL(intermediateFile);

  const { canvas, width, height } = await new Promise<{
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
  }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // If output is JPEG, paint white background (avoid black transparent areas)
      if (settings.format === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, c.width, c.height);
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(intermediateUrl);
      resolve({ canvas: c, width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      URL.revokeObjectURL(intermediateUrl);
      reject(new Error(`Failed to decode ${file.name}`));
    };

    img.src = intermediateUrl;
  });

  // Step 3: Export to target MIME format and quality
  const targetBlob = await new Promise<Blob>((resolve, reject) => {
    const q = settings.format === "image/png" ? undefined : Math.max(0.1, Math.min(1.0, settings.quality));
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
      settings.format,
      q
    );
  });

  const targetExtension = settings.format === "image/jpeg" ? "jpg" : settings.format === "image/png" ? "png" : "webp";
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const outputFileName = `${baseName}.${targetExtension}`;
  const convertedUrl = URL.createObjectURL(targetBlob);

  return {
    id: fileId,
    originalFile: file,
    originalName: file.name,
    originalSize: file.size,
    originalType: ext.toUpperCase() || "HEIC",
    convertedBlob: targetBlob,
    convertedSize: targetBlob.size,
    convertedWidth: width,
    convertedHeight: height,
    convertedUrl,
    outputFileName,
    outputFormatLabel: targetExtension.toUpperCase(),
    status: "done",
  };
}
