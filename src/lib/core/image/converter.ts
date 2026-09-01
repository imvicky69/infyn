import { TargetImageMime } from "../types";
import { convertHeicToJpg } from "./heic";

/**
 * Converts an image File or Blob to a target format (JPEG, PNG, WebP, AVIF) in-browser.
 *
 * @param file - Source image File or Blob.
 * @param targetMime - Target MIME type ("image/jpeg" | "image/png" | "image/webp" | "image/avif").
 * @param quality - Quality between 0.1 and 1.0 (default 0.92, ignored for PNG).
 * @returns Promise resolving to the converted image Blob.
 *
 * @example
 * ```typescript
 * import { convertImage } from 'infyn/image';
 *
 * const webpBlob = await convertImage(pngFile, "image/webp", 0.85);
 * ```
 */
export async function convertImage(
  file: File | Blob,
  targetMime: TargetImageMime = "image/jpeg",
  quality: number = 0.92
): Promise<Blob> {
  const processedFile = await convertHeicToJpg(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(processedFile);

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Could not initialize 2D canvas context."));
        }

        // Fill white background when converting transparent image to JPEG
        if (targetMime === "image/jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error(`Failed to encode image to ${targetMime}.`));
            }
          },
          targetMime,
          quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for conversion."));
    };

    img.src = url;
  });
}
