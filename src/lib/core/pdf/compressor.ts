import { PDFDocument } from "pdf-lib";
import { BinaryInput, CompressPdfOptions, CompressPdfResult } from "../types";
import { toArrayBuffer, calculateSavings } from "../utils";

/**
 * Compresses and minifies a PDF document in-browser.
 *
 * @param file - Source PDF file, Blob, ArrayBuffer, or Uint8Array.
 * @param options - PDF compression configuration options.
 * @returns Promise resolving to the compression result with data bytes and size metrics.
 *
 * @example
 * ```typescript
 * import { compressPDF } from 'infyn/pdf';
 *
 * const result = await compressPDF(myPdfFile, { preset: 'recommended' });
 * console.log(`Saved ${result.savedPercentage}% (${result.savedBytes} bytes)`);
 * const compressedBlob = new Blob([result.data], { type: 'application/pdf' });
 * ```
 */
export async function compressPDF(
  file: BinaryInput,
  options?: CompressPdfOptions
): Promise<CompressPdfResult> {
  const buffer = await toArrayBuffer(file);
  const originalSize = buffer.byteLength;

  const preset = options?.preset ?? "recommended";
  const isLossless = options?.losslessOnly || preset === "lossless";

  // Mode 1: Lossless Structural & Stream Compression
  if (isLossless || typeof window === "undefined" || !window.document?.createElement) {
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
    const pageCount = pdfDoc.getPageCount();

    // Strip unneeded metadata
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("");
    pdfDoc.setCreator("");

    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    // Size guard
    if (compressedBytes.byteLength >= originalSize) {
      return {
        data: new Uint8Array(buffer),
        originalSize,
        compressedSize: originalSize,
        savedBytes: 0,
        savedPercentage: 0,
        pageCount,
      };
    }

    const { savedBytes, savedPercentage } = calculateSavings(
      originalSize,
      compressedBytes.byteLength
    );

    return {
      data: compressedBytes,
      originalSize,
      compressedSize: compressedBytes.byteLength,
      savedBytes,
      savedPercentage,
      pageCount,
    };
  }

  // Mode 2: In-browser Raster & Scan Downsampling Engine
  try {
    const pdfjsLib = await import("pdfjs-dist");
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer.slice(0)),
    });
    const srcPdf = await loadingTask.promise;

    const pageCount = srcPdf.numPages;

    let quality = options?.quality ?? 0.72;
    let scale = options?.dpiScale ?? 1.5;

    if (preset === "extreme") {
      scale = 1.0;
      quality = 0.50;
    } else if (preset === "recommended") {
      scale = 1.5;
      quality = 0.72;
    } else if (preset === "high") {
      scale = 2.0;
      quality = 0.85;
    }

    if (options?.targetSizeKb && options.targetSizeKb > 0) {
      const targetBytes = options.targetSizeKb * 1024;
      const budgetPerPage = targetBytes / Math.max(1, pageCount);
      if (budgetPerPage < 50 * 1024) {
        scale = 0.9;
        quality = 0.45;
      } else if (budgetPerPage < 150 * 1024) {
        scale = 1.2;
        quality = 0.60;
      } else {
        scale = 1.6;
        quality = 0.75;
      }
    }

    const outPdfDoc = await PDFDocument.create();

    for (let i = 1; i <= pageCount; i++) {
      const page = await srcPdf.getPage(i);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (!ctx) continue;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // @ts-expect-error - PDF.js render options
      await page.render({ canvasContext: ctx, viewport }).promise;

      const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
      const base64Data = jpegDataUrl.split(",")[1];
      const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

      const embeddedImage = await outPdfDoc.embedJpg(imageBytes);

      // Map back to unscaled page point dimensions
      const originalViewport = page.getViewport({ scale: 1.0 });
      const newPage = outPdfDoc.addPage([originalViewport.width, originalViewport.height]);
      newPage.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: originalViewport.width,
        height: originalViewport.height,
      });
    }

    const compressedBytes = await outPdfDoc.save({
      useObjectStreams: true,
    });

    // Size guard
    if (compressedBytes.byteLength >= originalSize) {
      return {
        data: new Uint8Array(buffer),
        originalSize,
        compressedSize: originalSize,
        savedBytes: 0,
        savedPercentage: 0,
        pageCount,
      };
    }

    const { savedBytes, savedPercentage } = calculateSavings(
      originalSize,
      compressedBytes.byteLength
    );

    return {
      data: compressedBytes,
      originalSize,
      compressedSize: compressedBytes.byteLength,
      savedBytes,
      savedPercentage,
      pageCount,
    };
  } catch (err) {
    console.error("Raster PDF compression failed, falling back to structural compaction:", err);
    // Fallback to structural
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
    const pageCount = pdfDoc.getPageCount();
    const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
    
    if (compressedBytes.byteLength >= originalSize) {
      return {
        data: new Uint8Array(buffer),
        originalSize,
        compressedSize: originalSize,
        savedBytes: 0,
        savedPercentage: 0,
        pageCount,
      };
    }

    const { savedBytes, savedPercentage } = calculateSavings(
      originalSize,
      compressedBytes.byteLength
    );

    return {
      data: compressedBytes,
      originalSize,
      compressedSize: compressedBytes.byteLength,
      savedBytes,
      savedPercentage,
      pageCount,
    };
  }
}
