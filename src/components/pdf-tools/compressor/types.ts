export type CompressionPreset =
  | "recommended"
  | "extreme"
  | "high"
  | "target"
  | "lossless"
  | "custom";

export interface CompressorConfig {
  preset: CompressionPreset;
  quality: number; // 0.1 to 1.0
  dpiScale: number; // 0.5 to 2.5
  targetSizeKb: number; // in KB (e.g., 200, 500, 1024)
}

export interface CompressorItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercentage: number;
  pageCount: number;
  blob: Blob | null;
  status: "idle" | "compressing" | "done" | "error";
  progress?: number;
  error?: string;
  originalPreview?: string;
  compressedPreview?: string;
  pagePreviews?: {
    pageNum: number;
    originalUrl: string;
    compressedUrl: string;
  }[];
}
