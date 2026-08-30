"use client";

import React, { useRef, useState } from "react";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  formatsText?: string;
  disabled?: boolean;
  className?: string;
}

export function DropZone({
  onFilesSelected,
  accept = "image/*",
  multiple = false,
  title = "Drop your image here",
  subtitle = "or click to browse from device",
  formatsText = "JPG · PNG · WEBP · HEIC · AVIF",
  disabled = false,
  className = "",
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onFilesSelected(multiple ? droppedFiles : [droppedFiles[0]]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length > 0) {
      onFilesSelected(multiple ? selectedFiles : [selectedFiles[0]]);
    }
    e.target.value = "";
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative w-full cursor-pointer rounded-3xl border-2 border-dashed
        transition-all duration-200 select-none
        flex flex-col items-center justify-center gap-5 py-16 sm:py-20 px-6 sm:px-8 text-center
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${isDragging
          ? "border-[#111111] bg-[#F0EFEA] scale-[1.01] shadow-lg"
          : "border-[#DDDDD8] hover:border-[#AEAEAD] bg-white hover:bg-[#FDFDF9]"
        }
        ${className}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />

      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-[#EAEAE5] bg-[#F8F7F3] transition-transform duration-200 ${
          isDragging ? "-translate-y-1.5 scale-110" : ""
        }`}
      >
        <svg
          className="h-6 w-6 text-[#6E6D68]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        </svg>
      </div>

      <div className="space-y-1.5 max-w-sm">
        <p className="text-sm font-semibold text-[#111111]">
          {isDragging ? "Release to process" : title}
        </p>
        <p className="text-xs text-[#9E9D98]">{subtitle}</p>
      </div>

      {formatsText && (
        <p className="text-[11px] text-[#BEBDB9] tracking-widest font-medium">
          {formatsText}
        </p>
      )}
    </div>
  );
}
