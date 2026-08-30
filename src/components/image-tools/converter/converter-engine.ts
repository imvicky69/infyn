/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertHeicToJpeg } from "../utils";

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp" | "image/avif";

export interface ConvertSettings {
  format: OutputFormat;
  quality: number; // 0.1 to 1.0 (default 0.92)
  bgColor?: string; // For JPG conversion of transparent images (default #FFFFFF)
}

export interface ConvertedFileResult {
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
  outputFormat: OutputFormat;
  outputExtension: string;
  status: "idle" | "converting" | "done" | "error";
  errorMessage?: string;
}

export interface ConverterPreset {
  id: string;
  name: string;
  from: string;
  to: string;
  targetFormat: OutputFormat;
  description: string;
  recommendedQuality: number;
}

export const POPULAR_CONVERTER_PRESETS: ConverterPreset[] = [
  {
    id: "heic-to-jpg",
    name: "HEIC to JPG",
    from: "HEIC",
    to: "JPG",
    targetFormat: "image/jpeg",
    description: "Convert Apple iPhone photos to universal JPG format.",
    recommendedQuality: 0.92,
  },
  {
    id: "png-to-webp",
    name: "PNG to WebP",
    from: "PNG",
    to: "WEBP",
    targetFormat: "image/webp",
    description: "Shrink PNG images up to 80% with full transparency support.",
    recommendedQuality: 0.88,
  },
  {
    id: "jpg-to-webp",
    name: "JPG to WebP",
    from: "JPG",
    to: "WEBP",
    targetFormat: "image/webp",
    description: "Convert standard JPGs to next-gen WebP for faster websites.",
    recommendedQuality: 0.85,
  },
  {
    id: "webp-to-png",
    name: "WebP to PNG",
    from: "WEBP",
    to: "PNG",
    targetFormat: "image/png",
    description: "Convert WebP images to lossless transparent PNG format.",
    recommendedQuality: 1.0,
  },
  {
    id: "avif-to-jpg",
    name: "AVIF to JPG",
    from: "AVIF",
    to: "JPG",
    targetFormat: "image/jpeg",
    description: "Make AVIF images universally compatible with all devices.",
    recommendedQuality: 0.92,
  },
  {
    id: "png-to-jpg",
    name: "PNG to JPG",
    from: "PNG",
    to: "JPG",
    targetFormat: "image/jpeg",
    description: "Flatten PNG graphics into lightweight JPG files.",
    recommendedQuality: 0.9,
  },
  {
    id: "jpg-to-png",
    name: "JPG to PNG",
    from: "JPG",
    to: "PNG",
    targetFormat: "image/png",
    description: "Convert JPG to lossless PNG format.",
    recommendedQuality: 1.0,
  },
  {
    id: "heic-to-png",
    name: "HEIC to PNG",
    from: "HEIC",
    to: "PNG",
    targetFormat: "image/png",
    description: "Preserve maximum photo fidelity in uncompressed PNG format.",
    recommendedQuality: 1.0,
  },
];

/**
 * Universal client-side image converter supporting HEIC, HEIF, AVIF, WebP, PNG, JPG, GIF, SVG, BMP.
 */
export async function convertImage(
  file: File,
  settings: ConvertSettings
): Promise<ConvertedFileResult> {
  const fileId = `${file.name}-${file.size}-${Math.random().toString(36).substring(2, 7)}`;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const isHeic =
    ext === "heic" ||
    ext === "heif" ||
    file.type === "image/heic" ||
    file.type === "image/heif";

  let intermediateFile: File = file;

  // Step 1: Decode HEIC via WASM if applicable
  if (isHeic) {
    intermediateFile = await convertHeicToJpeg(file);
  }

  // Step 2: Load into Canvas for high quality color rendering & formatting
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

      // If output is JPEG, fill background with clean color (avoid black transparent artifacts)
      if (settings.format === "image/jpeg") {
        ctx.fillStyle = settings.bgColor || "#FFFFFF";
        ctx.fillRect(0, 0, c.width, c.height);
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(intermediateUrl);
      resolve({ canvas: c, width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      URL.revokeObjectURL(intermediateUrl);
      reject(new Error(`Failed to decode image: ${file.name}`));
    };

    img.src = intermediateUrl;
  });

  // Step 3: Export to target MIME format with fallback for browser compatibility
  let targetMime: string = settings.format;
  let targetBlob: Blob;

  try {
    const q =
      settings.format === "image/png"
        ? undefined
        : Math.max(0.1, Math.min(1.0, settings.quality));

    targetBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Check if browser actually produced the requested format (e.g. AVIF fallback)
            if (settings.format === "image/avif" && blob.type !== "image/avif") {
              // Fallback to WebP if AVIF encoding isn't natively supported
              targetMime = "image/webp";
            }
            resolve(blob);
          } else {
            reject(new Error("Canvas export failed"));
          }
        },
        targetMime,
        q
      );
    });
  } catch {
    // Graceful fallback to JPEG
    targetMime = "image/jpeg";
    targetBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Fallback export failed"))),
        "image/jpeg",
        settings.quality
      );
    });
  }

  let targetExtension = "jpg";
  if (targetMime === "image/png") targetExtension = "png";
  else if (targetMime === "image/webp") targetExtension = "webp";
  else if (targetMime === "image/avif") targetExtension = "avif";
  else if (targetMime === "image/jpeg") targetExtension = "jpg";

  const rawBase = file.name.replace(/\.[^.]+$/, "").trim() || "converted";
  const outputFileName = `${rawBase}.${targetExtension}`;
  const convertedUrl = URL.createObjectURL(targetBlob);

  return {
    id: fileId,
    originalFile: file,
    originalName: file.name,
    originalSize: file.size,
    originalType: ext.toUpperCase() || "IMAGE",
    convertedBlob: targetBlob,
    convertedSize: targetBlob.size,
    convertedWidth: width,
    convertedHeight: height,
    convertedUrl,
    outputFileName,
    outputFormat: targetMime as OutputFormat,
    outputExtension: targetExtension.toUpperCase(),
    status: "done",
  };
}
