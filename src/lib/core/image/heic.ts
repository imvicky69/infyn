/**
 * Decodes .heic / .heif files to standard JPEG Blobs via in-browser WASM.
 *
 * @param file - HEIC File or Blob.
 * @param quality - Output JPEG quality between 0.1 and 1.0 (default 0.92).
 * @returns Promise resolving to a JPEG Blob.
 */
export async function convertHeicToJpg(
  file: File | Blob,
  quality: number = 0.92
): Promise<Blob> {
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    (file instanceof File && /\.(heic|heif)$/i.test(file.name));

  if (!isHeic) {
    return file;
  }

  // Strategy 1: libheif-js WASM
  try {
    const libheifModule = await import("libheif-js/wasm-bundle");
    const libheif = (libheifModule as any).default || libheifModule;
    const decoder = new libheif.HeifDecoder();
    const buffer = await file.arrayBuffer();
    const data = decoder.decode(new Uint8Array(buffer));

    if (data && data.length > 0) {
      const image = data[0];
      const width = image.get_width();
      const height = image.get_height();

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const imageData = ctx.createImageData(width, height);
        await new Promise<void>((resolve, reject) => {
          image.display(imageData, (displayData: any) => {
            if (!displayData) {
              return reject(new Error("HEIF display error"));
            }
            resolve();
          });
        });

        ctx.putImageData(imageData, 0, 0);

        return await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Canvas export to JPEG failed"));
            },
            "image/jpeg",
            quality
          );
        });
      }
    }
  } catch (err) {
    console.warn("libheif-js failed, falling back to heic2any:", err);
  }

  // Strategy 2: heic2any fallback
  try {
    const heic2anyModule = await import("heic2any");
    const heic2any = (heic2anyModule as any).default || heic2anyModule;
    const blobResult = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: quality,
    });

    return Array.isArray(blobResult) ? blobResult[0] : blobResult;
  } catch (err: any) {
    throw new Error(`Failed to decode HEIC image: ${err?.message || err}`);
  }
}
