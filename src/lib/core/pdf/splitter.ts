import { PDFDocument } from "pdf-lib";
import { BinaryInput, SplitPDFResult } from "../types";
import { toArrayBuffer } from "../utils";

export interface ExtractOptions {
  /**
   * If true, page numbers are treated as 0-indexed. Defaults to false (1-indexed).
   */
  zeroIndexed?: boolean;
}

/**
 * Extracts specific page numbers from a PDF into a single new PDF document.
 *
 * @param file - Source PDF file, Blob, ArrayBuffer, or Uint8Array.
 * @param pageNumbers - Array of page numbers to extract (e.g. [1, 2, 5]). 1-indexed by default.
 * @param options - Extraction options.
 * @returns Promise resolving to the new PDF document as a Uint8Array.
 *
 * @example
 * ```typescript
 * import { extractPDFPages } from 'infyn/pdf';
 *
 * const extractedPdfBytes = await extractPDFPages(myPdfFile, [1, 3, 5]);
 * ```
 */
export async function extractPDFPages(
  file: BinaryInput,
  pageNumbers: number[],
  options?: ExtractOptions
): Promise<Uint8Array> {
  if (!pageNumbers || pageNumbers.length === 0) {
    throw new Error("At least one page number must be specified for extraction.");
  }

  const buffer = await toArrayBuffer(file);
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
  const totalPages = srcDoc.getPageCount();

  // Convert to 0-indexed indices
  const isZeroIndexed = options?.zeroIndexed ?? false;
  const indices = pageNumbers.map((p) => (isZeroIndexed ? p : p - 1));

  for (const idx of indices) {
    if (idx < 0 || idx >= totalPages) {
      throw new RangeError(
        `Invalid page index ${isZeroIndexed ? idx : idx + 1}. PDF only has ${totalPages} pages.`
      );
    }
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, indices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return await newDoc.save();
}

/**
 * Splits a PDF document into individual single-page PDF files.
 *
 * @param file - Source PDF file, Blob, ArrayBuffer, or Uint8Array.
 * @param pageNumbers - Optional subset of page numbers to split. If omitted, splits all pages. 1-indexed by default.
 * @returns Promise resolving to an array of objects containing the page number and its PDF data.
 *
 * @example
 * ```typescript
 * import { splitPDF } from 'infyn/pdf';
 *
 * const pages = await splitPDF(myPdfFile);
 * // pages => [{ pageNumber: 1, data: Uint8Array }, { pageNumber: 2, data: Uint8Array }]
 * ```
 */
export async function splitPDF(
  file: BinaryInput,
  pageNumbers?: number[],
  options?: ExtractOptions
): Promise<SplitPDFResult[]> {
  const buffer = await toArrayBuffer(file);
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
  const totalPages = srcDoc.getPageCount();

  const isZeroIndexed = options?.zeroIndexed ?? false;
  let targetIndices: number[];

  if (pageNumbers && pageNumbers.length > 0) {
    targetIndices = pageNumbers.map((p) => (isZeroIndexed ? p : p - 1));
  } else {
    targetIndices = srcDoc.getPageIndices();
  }

  const results: SplitPDFResult[] = [];

  for (const idx of targetIndices) {
    if (idx < 0 || idx >= totalPages) {
      continue;
    }
    const singleDoc = await PDFDocument.create();
    const [copiedPage] = await singleDoc.copyPages(srcDoc, [idx]);
    singleDoc.addPage(copiedPage);

    const pdfBytes = await singleDoc.save();
    results.push({
      pageNumber: isZeroIndexed ? idx : idx + 1,
      data: pdfBytes,
    });
  }

  return results;
}
