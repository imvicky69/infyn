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

/**
 * Options for PDF compression.
 */
export interface CompressPdfOptions {
  /**
   * Compression preset mode.
   * 'extreme': maximum compression (~72 DPI, 50% quality)
   * 'recommended': balanced reduction and clarity (~110 DPI, 72% quality)
   * 'high': light compression with high print fidelity (~144 DPI, 85% quality)
   * 'lossless': structural optimization without raster downsampling
   * 'custom': uses explicit quality and dpiScale parameters
   */
  preset?: "extreme" | "recommended" | "high" | "lossless" | "custom";
  /**
   * Custom JPEG/WebP image compression quality from 0.1 to 1.0 (default: 0.72)
   */
  quality?: number;
  /**
   * Custom DPI scale factor from 0.5 to 2.5 (default: 1.5)
   */
  dpiScale?: number;
  /**
   * Optional target file size in kilobytes.
   */
  targetSizeKb?: number;
  /**
   * If true, skips rasterization and only applies structural stream compaction.
   */
  losslessOnly?: boolean;
}

/**
 * PDF compression result details.
 */
export interface CompressPdfResult {
  data: Uint8Array;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercentage: number;
  pageCount: number;
}

