import { PDFDocument } from "pdf-lib";
import { BinaryInput } from "../types";
import { toArrayBuffer } from "../utils";

/**
 * Merges multiple PDF documents into a single PDF document in-browser.
 *
 * @param files - Array of PDF files, Blobs, ArrayBuffers, or Uint8Arrays in desired order.
 * @returns Promise resolving to the merged PDF as a Uint8Array.
 *
 * @example
 * ```typescript
 * import { mergePDFs } from 'infyn/pdf';
 *
 * const mergedBytes = await mergePDFs([pdfFile1, pdfFile2]);
 * const mergedBlob = new Blob([mergedBytes], { type: 'application/pdf' });
 * ```
 */
export async function mergePDFs(
  files: BinaryInput[]
): Promise<Uint8Array> {
  if (!files || files.length === 0) {
    throw new Error("At least one PDF file must be provided to merge.");
  }

  const mergedDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const buffer = await toArrayBuffer(files[i]);
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
    const copiedPages = await mergedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedDoc.addPage(page));
  }

  return await mergedDoc.save();
}
