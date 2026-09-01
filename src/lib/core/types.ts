/**
 * Universal binary input supported across all Infyn functions.
 */
export type BinaryInput = File | Blob | ArrayBuffer | Uint8Array;

/**
 * PDF Split Output item.
 */
export interface SplitPDFResult {
  pageNumber: number;
  data: Uint8Array;
}

/**
 * Options for image compression.
 */
export interface CompressImageOptions {
  quality?: number; // 0.1 to 1.0 (default: 0.8)
  maxWidth?: number;
  maxHeight?: number;
  targetFormat?: "image/jpeg" | "image/webp" | "image/png";
}

/**
 * Compression result details.
 */
export interface CompressImageResult {
  blob: Blob;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercentage: number;
}

/**
 * Image conversion target MIME types.
 */
export type TargetImageMime = "image/jpeg" | "image/png" | "image/webp" | "image/avif";
