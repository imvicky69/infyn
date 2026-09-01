import { PDFDocument } from "pdf-lib";
import { CompressorConfig, CompressorItem } from "./types";
import { calculateSavings } from "@/components/image-tools/utils";

interface ProgressUpdate {
  docIndex: number;
  totalDocs: number;
  pageIndex: number;
  totalPages: number;
  text: string;
  percent: number;
}

/**
 * Compresses a single PDF File based on config settings.
 */
export async function compressSinglePdf(
  file: File,
  config: CompressorConfig,
  onProgress?: (update: ProgressUpdate) => void,
  docIndex = 0,
  totalDocs = 1
): Promise<CompressorItem> {
  const originalSize = file.size;
  const buffer = await file.arrayBuffer();

  // Mode: Lossless Structural Compression
  if (config.preset === "lossless") {
    onProgress?.({
      docIndex,
      totalDocs,
      pageIndex: 1,
      totalPages: 1,
      text: `Optimizing stream structures for ${file.name}…`,
      percent: 50,
    });

    try {
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
      const pageCount = pdfDoc.getPageCount();

      // Clear heavy metadata dictionaries
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");

      const outBytes = await pdfDoc.save({ useObjectStreams: true });
      const compressedSize = outBytes.byteLength;

      // Size Guard
      if (compressedSize >= originalSize) {
        return {
          id: `${file.name}-${Date.now()}`,
          file,
          name: file.name,
          originalSize,
          compressedSize: originalSize,
          savedBytes: 0,
          savedPercentage: 0,
          pageCount,
          blob: new Blob([buffer], { type: "application/pdf" }),
          status: "done",
        };
      }

      const { savedBytes, percentage } = calculateSavings(originalSize, compressedSize);
      return {
        id: `${file.name}-${Date.now()}`,
        file,
        name: file.name,
        originalSize,
        compressedSize,
        savedBytes,
        savedPercentage: percentage,
        pageCount,
        blob: new Blob([outBytes as any], { type: "application/pdf" }),
        status: "done",
      };

    } catch (err: any) {
      console.error("Lossless compression error:", err);
      throw new Error(err.message || "Failed to compress PDF structure.");
    }
  }

  // Mode: Smart Raster & Scan Optimization Engine
  const pdfjsLib = await import("pdfjs-dist");
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer.slice(0)),
  });
  const srcPdf = await loadingTask.promise;

  const totalPages = srcPdf.numPages;

  if (totalPages === 0) {
    throw new Error("This PDF contains no pages.");
  }

  // Derive parameters based on preset or target size
  let scale = config.dpiScale;
  let quality = config.quality;

  if (config.preset === "extreme") {
    scale = 1.0;
    quality = 0.50;
  } else if (config.preset === "recommended") {
    scale = 1.4;
    quality = 0.72;
  } else if (config.preset === "high") {
    scale = 1.9;
    quality = 0.85;
  } else if (config.preset === "target") {
    const targetBytes = config.targetSizeKb * 1024;
    const budgetPerPage = targetBytes / Math.max(1, totalPages);
    if (budgetPerPage < 60 * 1024) {
      scale = 0.9;
      quality = 0.45;
    } else if (budgetPerPage < 160 * 1024) {
      scale = 1.2;
      quality = 0.62;
    } else if (budgetPerPage < 350 * 1024) {
      scale = 1.5;
      quality = 0.75;
    } else {
      scale = 1.9;
      quality = 0.85;
    }
  }

  const outPdfDoc = await PDFDocument.create();
  let firstPageOriginalPreview = "";
  let firstPageCompressedPreview = "";

  for (let i = 1; i <= totalPages; i++) {
    const pagePercent = Math.round(((i - 1) / totalPages) * 100);
    onProgress?.({
      docIndex,
      totalDocs,
      pageIndex: i,
      totalPages,
      text: `Optimizing page ${i} of ${totalPages} in ${file.name}…`,
      percent: Math.round(((docIndex + (i / totalPages)) / totalDocs) * 100),
    });

    const page = await srcPdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) throw new Error("Could not initialize 2D canvas context");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // @ts-expect-error - PDF.js render options
    await page.render({ canvasContext: ctx, viewport }).promise;

    // Capture first page preview for comparator if page 1
    if (i === 1) {
      // High-res preview of original
      const origViewport = page.getViewport({ scale: 1.5 });
      const origCanvas = document.createElement("canvas");
      origCanvas.width = Math.floor(origViewport.width);
      origCanvas.height = Math.floor(origViewport.height);
      const origCtx = origCanvas.getContext("2d");
      if (origCtx) {
        origCtx.fillStyle = "#FFFFFF";
        origCtx.fillRect(0, 0, origCanvas.width, origCanvas.height);
        // @ts-expect-error - PDF.js render
        await page.render({ canvasContext: origCtx, viewport: origViewport }).promise;
        firstPageOriginalPreview = origCanvas.toDataURL("image/jpeg", 0.9);
      }
    }

    const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
    if (i === 1) {
      firstPageCompressedPreview = jpegDataUrl;
    }

    const base64Data = jpegDataUrl.split(",")[1];
    const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const embeddedImage = await outPdfDoc.embedJpg(imageBytes);

    const originalViewport = page.getViewport({ scale: 1.0 });
    const newPage = outPdfDoc.addPage([originalViewport.width, originalViewport.height]);
    newPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: originalViewport.width,
      height: originalViewport.height,
    });
  }

  const outBytes = await outPdfDoc.save({ useObjectStreams: true });
  let compressedBlob = new Blob([outBytes as any], { type: "application/pdf" });
  let compressedSize = compressedBlob.size;

  // Size Guard: If compressed is larger than original, return original
  if (compressedSize >= originalSize) {
    compressedBlob = new Blob([buffer], { type: "application/pdf" });
    compressedSize = originalSize;
    return {
      id: `${file.name}-${Date.now()}`,
      file,
      name: file.name,
      originalSize,
      compressedSize: originalSize,
      savedBytes: 0,
      savedPercentage: 0,
      pageCount: totalPages,
      blob: compressedBlob,
      status: "done",
      originalPreview: firstPageOriginalPreview,
      compressedPreview: firstPageCompressedPreview || firstPageOriginalPreview,
    };
  }

  const { savedBytes, percentage } = calculateSavings(originalSize, compressedSize);

  return {
    id: `${file.name}-${Date.now()}`,
    file,
    name: file.name,
    originalSize,
    compressedSize,
    savedBytes,
    savedPercentage: percentage,
    pageCount: totalPages,
    blob: compressedBlob,
    status: "done",
    originalPreview: firstPageOriginalPreview,
    compressedPreview: firstPageCompressedPreview,
  };

}

/**
 * Processes a batch of PDF Files sequentially with overall progress reporting.
 */
export async function compressPdfBatch(
  files: File[],
  config: CompressorConfig,
  onProgress?: (text: string, percent: number) => void
): Promise<CompressorItem[]> {
  const results: CompressorItem[] = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    try {
      const item = await compressSinglePdf(
        file,
        config,
        (update) => {
          onProgress?.(update.text, update.percent);
        },
        i,
        total
      );
      results.push(item);
    } catch (err: any) {
      console.error(`Error compressing ${file.name}:`, err);
      results.push({
        id: `${file.name}-${Date.now()}`,
        file,
        name: file.name,
        originalSize: file.size,
        compressedSize: file.size,
        savedBytes: 0,
        savedPercentage: 0,
        pageCount: 0,
        blob: null,
        status: "error",
        error: err?.message || "Failed to compress file.",
      });
    }
  }

  onProgress?.("All documents compressed!", 100);
  return results;
}
