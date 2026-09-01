import { convertHeicToJpg } from "./heic";

/**
 * Strips EXIF metadata, GPS locations, and camera tags from an image by re-encoding its pixel buffer.
 *
 * @param file - Source image File or Blob.
 * @param format - Output format (defaults to original image format or JPEG).
 * @param quality - Re-encoding quality between 0.1 and 1.0 (default 0.95).
 * @returns Promise resolving to a clean Blob free of EXIF metadata.
 *
 * @example
 * ```typescript
 * import { removeExif } from 'infyn/image';
 *
 * const cleanBlob = await removeExif(photoFile);
 * ```
 */
export async function removeExif(
  file: File | Blob,
  format?: "image/jpeg" | "image/png" | "image/webp",
  quality: number = 0.95
): Promise<Blob> {
  const processedFile = await convertHeicToJpg(file);
  const targetMime = format || (processedFile.type === "image/png" ? "image/png" : "image/jpeg");

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

        // Fill white background for PNG with alpha to JPEG conversion
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
              reject(new Error("Failed to encode clean image without EXIF."));
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
      reject(new Error("Failed to load image for EXIF removal."));
    };

    img.src = url;
  });
}
