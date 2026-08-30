"use client";

import * as React from "react";
import { UploadCloud, File, X, CheckCircle2 } from "lucide-react";

export interface DropzoneProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  title?: string;
  description?: string;
  allowedFormats?: string[];
}

export function Dropzone({
  onFileSelect,
  accept = "*",
  maxSizeMB = 50,
  title = "Drop your file here",
  description = "Supports high-resolution images, PDFs, SVGs, documents, and code files",
  allowedFormats = ["PNG", "JPG", "WEBP", "SVG", "PDF", "TXT"],
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [currentFile, setCurrentFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFile = (file: File) => {
    setCurrentFile(file);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-6 sm:p-8 text-center transition-all duration-200 ${
        isDragOver
          ? "border-[#78A4CB] bg-[#B4E1EB]/20 scale-[1.01]"
          : "border-[#95BDD7]/60 hover:border-[#78A4CB] bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 shadow-sm"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {currentFile ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-[#FAF7EE] dark:bg-slate-800/70 border border-[#F9E8A2]/80">
          <div className="flex items-center gap-3 text-left">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="File preview"
                className="h-14 w-14 rounded-xl object-cover border border-slate-200 shadow-sm"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#95BDD7]/30 text-[#78A4CB]">
                <File className="h-7 w-7" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 max-w-[180px] sm:max-w-[280px] truncate">
                  {currentFile.name}
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {(currentFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for processing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 rounded-xl bg-slate-200/80 dark:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-100 hover:text-rose-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Change File
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#B4E1EB] to-[#F9E8A2] text-slate-900 shadow-md shadow-[#95BDD7]/20">
            <UploadCloud className="h-7 w-7 text-slate-800" />
          </div>
          <div className="space-y-1">
            <h4 className="font-fuzzy text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto font-sans">
              {description} or{" "}
              <span className="font-semibold text-[#78A4CB] underline underline-offset-2">
                browse files
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            {allowedFormats.map((fmt) => (
              <span
                key={fmt}
                className="rounded-md bg-[#F9E8A2]/60 px-2 py-0.5 text-[10px] font-bold text-amber-950 dark:bg-[#F9E8A2]/20 dark:text-amber-300 font-mono"
              >
                {fmt}
              </span>
            ))}
            <span className="text-[11px] text-slate-400 font-sans ml-1">
              (Up to {maxSizeMB}MB)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
