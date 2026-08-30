/* eslint-disable @typescript-eslint/no-explicit-any */

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function calculateSavings(originalSize: number, newSize: number): {
  savedBytes: number;
  percentage: number;
  isReduced: boolean;
} {
  const diff = originalSize - newSize;
  const percentage = originalSize > 0 ? Math.round((diff / originalSize) * 100) : 0;
  return {
    savedBytes: Math.max(0, diff),
    percentage: Math.max(0, percentage),
    isReduced: diff > 0,
  };
}

/**
 * Universal HEIC / HEIF converter using multi-strategy WASM and browser canvas.
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  // Strategy 1: libheif-js wasm bundle
  try {
    const libheif: any = await import("libheif-js/wasm-bundle");
    const lib = libheif.default ?? libheif;
    const buf = await file.arrayBuffer();
    const decoder = new lib.HeifDecoder();
    const data = decoder.decode(new Uint8Array(buf));

    if (data && data.length > 0) {
      const image = data[0];
      const width: number = image.get_width();
      const height: number = image.get_height();

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      const imgData = ctx.createImageData(width, height);

      await new Promise<void>((resolve, reject) => {
        image.display(imgData, (result: unknown) => {
          if (!result) reject(new Error("libheif display failed"));
          else resolve();
        });
      });

      ctx.putImageData(imgData, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.95)
      );

      if (blob && blob.size > 500) {
        return new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
          type: "image/jpeg",
        });
      }
    }
  } catch {
    // Fall through to strategy 2
  }

  // Strategy 2: heic2any fallback
  try {
    const { default: heic2any } = await import("heic2any");
    const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.95 });
    const blob = Array.isArray(result) ? result[0] : result;
    return new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
      type: "image/jpeg",
    });
  } catch {
    // Fall through to strategy 3
  }

  // Strategy 3: native img element (Safari / macOS)
  const nativeFile = await new Promise<File | null>((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    const timeout = setTimeout(() => {
      URL.revokeObjectURL(url);
      resolve(null);
    }, 6000);

    img.onload = () => {
      clearTimeout(timeout);
      if (img.naturalWidth === 0) {
        URL.revokeObjectURL(url);
        resolve(null);
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (b) => {
          if (b && b.size > 1000) {
            resolve(
              new File([b], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
                type: "image/jpeg",
              })
            );
          } else {
            resolve(null);
          }
        },
        "image/jpeg",
        0.95
      );
    };

    img.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });

  if (nativeFile) return nativeFile;

  throw new Error("This HEIC variant is not supported. Export as JPG from your camera app and try again.");
}
