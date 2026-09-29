"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Download,
  X,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Play,
  FileVideo,
  Music,
} from "lucide-react";
import { GoogleAd, DEFAULT_ADSENSE_SLOT } from "./google-ad";

interface DownloadAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadUrl: string | null;
  filename: string;
  title: string;
  thumbnail?: string;
  fileType?: string;
  durationSeconds?: number;
  onDownloadTriggered?: () => void;
}

export function DownloadAdModal({
  isOpen,
  onClose,
  downloadUrl,
  filename,
  title,
  thumbnail,
  fileType = "HD Video (MP4)",
  durationSeconds = 4,
  onDownloadTriggered,
}: DownloadAdModalProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(durationSeconds);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const downloadTriggeredRef = useRef<boolean>(false);

  // Trigger actual file download
  const executeDownload = React.useCallback(() => {
    if (!downloadUrl) return;
    try {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsCompleted(true);
      onDownloadTriggered?.();
    } catch (err) {
      console.error("Download trigger error:", err);
      // Fallback: window.open
      window.open(downloadUrl, "_blank");
      setIsCompleted(true);
    }
  }, [downloadUrl, filename, onDownloadTriggered]);

  // Handle countdown
  useEffect(() => {
    if (!isOpen || !downloadUrl) {
      setSecondsLeft(durationSeconds);
      setIsCompleted(false);
      downloadTriggeredRef.current = false;
      return;
    }

    setSecondsLeft(durationSeconds);
    setIsCompleted(false);
    downloadTriggeredRef.current = false;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!downloadTriggeredRef.current) {
            downloadTriggeredRef.current = true;
            executeDownload();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, downloadUrl, durationSeconds, executeDownload]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !downloadUrl) return null;

  const progressPercent = Math.min(
    100,
    Math.round(((durationSeconds - secondsLeft) / durationSeconds) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-lg rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-[#141417] text-[#111111] dark:text-zinc-100 shadow-[0_24px_64px_rgba(0,0,0,0.3)] overflow-hidden z-10 my-auto"
        style={{ animation: "fade-in-up 0.25s ease-out" }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#18181C]">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Download className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] dark:text-white">
                Preparing Your Download
              </h3>
              <p className="text-[10px] text-[#6E6D68] dark:text-zinc-400">
                100% Free • Direct High-Speed Link
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#9E9D98] hover:text-[#111111] hover:bg-[#F5F4EE] dark:hover:text-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Media Info Pill */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAEAE5] dark:border-zinc-800">
            {thumbnail ? (
              <div className="relative h-12 w-10 rounded-lg overflow-hidden shrink-0 border border-[#EAEAE5] dark:border-zinc-700 bg-zinc-900">
                <Image
                  src={thumbnail}
                  alt={title}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-12 w-10 rounded-lg bg-[#F5F4EE] dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <FileVideo className="h-5 w-5 text-rose-600" />
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-[10px] font-black text-rose-700 dark:text-rose-300">
                  {fileType}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Stream Verified</span>
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#111111] dark:text-white truncate">
                {title}
              </h4>
            </div>
          </div>

          {/* SPONSORED GOOGLE ADSENSE UNIT */}
          <div className="space-y-1">
            <GoogleAd
              slot={DEFAULT_ADSENSE_SLOT}
              minHeight={160}
              label="Sponsored"
              className="shadow-xs"
            />
          </div>

          {/* Countdown & Status Progress */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-[#111111] dark:text-white">
                {isCompleted ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Download Started!
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-rose-500 animate-spin" />
                    <span>Preparing download stream...</span>
                  </>
                )}
              </span>

              <span className="font-mono text-xs font-extrabold text-rose-600 dark:text-rose-400">
                {isCompleted ? "Complete" : `Starting in ${secondsLeft}s`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-[#EAEAE5] dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {isCompleted ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={executeDownload}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md active:scale-[0.98] cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Download Again (If didn&apos;t start automatically)</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 text-xs font-semibold text-[#6E6D68] dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    executeDownload();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  <span>Skip countdown & download immediately</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#9E9D98] hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
