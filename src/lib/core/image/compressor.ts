import { CompressImageOptions, CompressImageResult } from "../types";
import { convertHeicToJpg } from "./heic";

/**
 * Compresses an image File or Blob in-browser with quality and dimension controls.
 *
 * @param file - Source image File or Blob.
 * @param options - Compression options (quality, maxWidth, maxHeight, targetFormat).
 * @returns Promise resolving to a CompressImageResult object.
 *
 * @example
 * ```typescript
 * import { compressImage } from 'infyn/image';
 *
 * const result = await compressImage(myPhoto, {
 *   quality: 0.75,
 *   maxWidth: 1920
 * });
 * console.log(`Saved ${result.savedPercentage}% size!`);
 * ```
 */
export async function compressImage(
  file: File | Blob,
  options?: CompressImageOptions
): Promise<CompressImageResult> {
  const originalSize = file.size;
  const processedFile = await convertHeicToJpg(file);

  const quality = Math.max(0.05, Math.min(1.0, options?.quality ?? 0.8));
  const targetFormat =
    options?.targetFormat || (processedFile.type === "image/png" ? "image/jpeg" : (processedFile.type || "image/jpeg"));

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(processedFile);

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        let origW = img.naturalWidth || img.width;
        let origH = img.naturalHeight || img.height;

        let targetW = origW;
        let targetH = origH;

        if (options?.maxWidth && targetW > options.maxWidth) {
          const ratio = options.maxWidth / targetW;
          targetW = options.maxWidth;
          targetH = Math.round(targetH * ratio);
        }

        if (options?.maxHeight && targetH > options.maxHeight) {
          const ratio = options.maxHeight / targetH;
          targetH = options.maxHeight;
          targetW = Math.round(targetW * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Could not initialize 2D canvas context."));
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        if (targetFormat === "image/jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, targetW, targetH);
        }

        ctx.drawImage(img, 0, 0, targetW, targetH);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Canvas compression failed."));
            }

            const compressedSize = blob.size;
            const savedBytes = Math.max(0, originalSize - compressedSize);
            const savedPercentage =
              originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

            resolve({
              blob,
              width: targetW,
              height: targetH,
              originalSize,
              compressedSize,
              savedBytes,
              savedPercentage,
            });
          },
          targetFormat,
          quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for compression."));
    };

    img.src = url;
  });
}
