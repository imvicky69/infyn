"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  X,
  Check,
  Copy,
  ShieldCheck,
  ExternalLink,
  Film,
  Loader2,
  AlertCircle,
  Play,
  Maximize2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { getLiveDownloadLink, getStreamUrl } from "@/lib/movies-firestore";

export interface DownloadTarget {
  slug: string;
  target: "season" | "episode" | "movie";
  episodeNumber?: number;
  title: string;
  size?: string;
  poster?: string;
  quality?: string;
  downloadUrl?: string;
  initialMode?: "download" | "stream";
}

interface GoogleAdDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadData: DownloadTarget | null;
  onDownloadStarted?: (title: string, size?: string) => void;
}

export function GoogleAdDownloadModal({
  isOpen,
  onClose,
  downloadData,
  onDownloadStarted,
}: GoogleAdDownloadModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [verifiedUrl, setVerifiedUrl] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"download" | "stream">("download");
  const [hasClickedDownload, setHasClickedDownload] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Request verified download link directly from Firestore immediately (no wait, no ads)
  const requestDownloadLink = React.useCallback(async () => {
    if (!downloadData) return;

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const data = await getLiveDownloadLink({
        slug: downloadData.slug,
        target: downloadData.target,
        episodeNumber: downloadData.episodeNumber,
      });

      if (data.success && data.downloadUrl) {
        setVerifiedUrl(data.downloadUrl);
        const resolvedStream = data.streamUrl || getStreamUrl(data.downloadUrl);
        if (resolvedStream) {
          setStreamUrl(resolvedStream);
        }
        if (data.size) {
          downloadData.size = data.size;
        }
      } else {
        setVerificationError(
          data.error || "Download link not found in Firestore. Please try again."
        );
      }
    } catch (err) {
      console.error("Failed to verify download:", err);
      setVerificationError("Network error while requesting download. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }, [downloadData]);

  // Reset state and immediately fetch link whenever modal opens
  useEffect(() => {
    if (!isOpen || !downloadData) {
      setIsCopied(false);
      setVerifiedUrl(null);
      setStreamUrl(null);
      setActiveTab("download");
      setHasClickedDownload(false);
      setIsVerifying(false);
      setVerificationError(null);
      return;
    }

    setIsCopied(false);
    setVerifiedUrl(null);
    setStreamUrl(null);
    setActiveTab(downloadData.initialMode || "download");
    setHasClickedDownload(false);
    setVerificationError(null);

    // Instant trigger
    requestDownloadLink();
  }, [isOpen, downloadData, requestDownloadLink]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !downloadData) return null;

  const isReady = verifiedUrl !== null;

  const handleDownloadClick = () => {
    if (!verifiedUrl) return;
    setHasClickedDownload(true);
    onDownloadStarted?.(downloadData.title, downloadData.size);
    window.open(verifiedUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = () => {
    if (!verifiedUrl) return;
    navigator.clipboard.writeText(verifiedUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`relative w-full ${
            activeTab === "stream" && isReady ? "max-w-2xl sm:max-w-3xl" : "max-w-lg"
          } rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-[#141417] text-[#111111] dark:text-zinc-100 shadow-[0_24px_64px_rgba(0,0,0,0.3)] overflow-hidden z-10 my-auto transition-all duration-300`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EAEAE5] dark:border-zinc-800/80 bg-white dark:bg-[#18181C]">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                {activeTab === "stream" && isReady ? (
                  <Play className="h-4 w-4 fill-emerald-600" />
                ) : (
                  <Film className="h-4 w-4" />
                )}
              </span>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] dark:text-white">
                  {activeTab === "stream" && isReady
                    ? "In-Browser Cloud Stream"
                    : "Direct Download Link"}
                </h3>
                <p className="text-[10px] text-[#6E6D68] dark:text-zinc-400">
                  {activeTab === "stream" && isReady
                    ? "Mega Encrypted Web Player • No Download Needed"
                    : "Direct Firestore Verified • 100% Free"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#9E9D98] hover:text-[#111111] hover:bg-[#F5F4EE] dark:hover:text-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {/* File Details Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAEAE5] dark:border-zinc-800">
              {downloadData.poster ? (
                <div className="relative h-14 w-10 rounded-lg overflow-hidden shrink-0 border border-[#EAEAE5] dark:border-zinc-700 bg-zinc-900">
                  <Image
                    src={downloadData.poster}
                    alt={downloadData.title}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-14 w-10 rounded-lg bg-[#F5F4EE] dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <Film className="h-5 w-5 text-[#6E6D68]" />
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                    {downloadData.quality || "1080p FHD"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Firestore Verified</span>
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#111111] dark:text-white truncate">
                  {downloadData.title}
                </h4>
                <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400">
                  {downloadData.size ? `Size: ${downloadData.size} • ` : ""}Hindi 5.1 Original Audio
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs: Available once link is verified and stream is supported */}
            {isReady && streamUrl && (
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#EAEAE5]/60 dark:bg-zinc-800/60 border border-[#EAEAE5] dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("download")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    activeTab === "download"
                      ? "bg-white dark:bg-[#18181C] text-[#111111] dark:text-white shadow-xs"
                      : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                  }`}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("stream")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    activeTab === "stream"
                      ? "bg-white dark:bg-[#18181C] text-emerald-600 dark:text-emerald-400 shadow-xs"
                      : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
                  }`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Stream Online</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    Player
                  </span>
                </button>
              </div>
            )}

            {/* STREAM PLAYER VIEW */}
            {activeTab === "stream" && isReady && streamUrl && (
              <div className="space-y-3">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#EAEAE5] dark:border-zinc-800 shadow-xl">
                  <iframe
                    src={streamUrl}
                    title={`Stream ${downloadData.title}`}
                    width="100%"
                    height="100%"
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      Live Stream Connected
                    </span>
                    <span className="text-[10px] text-[#9E9D98] dark:text-zinc-500">
                      (Mega.nz Encrypted Web Stream)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={streamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F5F4EE] hover:bg-[#EAEAE5] dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#111111] dark:text-zinc-200 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <Maximize2 className="h-3 w-3" />
                      <span>Full Window</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("download");
                        handleDownloadClick();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download Offline ({downloadData.size || "1080p"})</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DOWNLOAD VIEW: ANIMATED CONFIRMATION TICK */}
            {activeTab === "download" && isReady && !hasClickedDownload && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 220 }}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-emerald-50/40 to-teal-50/50 dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-teal-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-xs"
              >
                {/* Glowing Circular Animated SVG Checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 18 }}
                  className="relative h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-[0_6px_24px_rgba(16,185,129,0.35)] shrink-0"
                >
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M20 6L9 17l-5-5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
                    />
                  </svg>
                </motion.div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-100">
                      Direct Link Verified &amp; Ready
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black border border-emerald-300 dark:border-emerald-800">
                      Instant Access
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                    Zero wait time • Direct high-speed cloud connection • No ads &amp; free
                  </p>
                </div>
              </motion.div>
            )}

            {/* DOWNLOAD IN PROGRESS VIEW (After clicking download) */}
            {hasClickedDownload && activeTab === "download" && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAEAE5] dark:border-zinc-800 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-xs">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#111111] dark:text-white">
                      Download Initiated!
                    </h4>
                    <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                      Direct cloud download link opened in a new tab.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 text-[11px] text-[#6E6D68] dark:text-zinc-400 space-y-1">
                  <p>Didn&apos;t start automatically? Your browser might have blocked the popup tab.</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1.5">
                    <button
                      type="button"
                      onClick={handleDownloadClick}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Download Again</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 text-[#111111] dark:text-zinc-200 font-semibold cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{isCopied ? "Link Copied" : "Copy Direct Link"}</span>
                    </button>
                  </div>
                </div>

                {streamUrl && (
                  <div className="pt-3 border-t border-[#EAEAE5] dark:border-zinc-800/80 flex items-center justify-between">
                    <span className="text-xs text-[#6E6D68] dark:text-zinc-400 font-medium">
                      Want to watch right now without waiting?
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("stream")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-950 transition-colors cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Stream Online</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* LOADING STATE (Fast initial query) */}
            {isVerifying && !isReady && !verificationError && (
              <div className="p-6 rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAEAE5] dark:border-zinc-800 flex flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
                <p className="text-xs font-bold text-[#111111] dark:text-white">
                  Retrieving Verified Cloud Link from Firestore...
                </p>
                <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400">
                  Direct connection • Instant access
                </p>
              </div>
            )}

            {/* Error banner if retrieval failed */}
            {verificationError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center justify-between gap-3 text-xs text-rose-800 dark:text-rose-300">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="leading-snug">{verificationError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => requestDownloadLink()}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-1">
              {activeTab === "download" && !hasClickedDownload && (
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  disabled={!isReady}
                  className={`w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-extrabold text-sm transition-all shadow-md cursor-pointer ${
                    isReady
                      ? "bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white ring-4 ring-emerald-500/20"
                      : "bg-[#EAEAE5] dark:bg-zinc-800 text-[#9E9D98] dark:text-zinc-500 cursor-not-allowed opacity-80"
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Connecting to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Download Now ({downloadData.size || "1080p FHD"})</span>
                      <ExternalLink className="h-3.5 w-3.5 ml-0.5 opacity-80" />
                    </>
                  )}
                </button>
              )}

              {/* Secondary Actions */}
              <div className="flex items-center justify-between gap-2 pt-1">
                {isReady && !hasClickedDownload && (
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#18181C] hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 text-xs font-semibold text-[#111111] dark:text-zinc-200 transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Direct Link Copied
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Direct Link</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className={`${
                    hasClickedDownload || (activeTab === "stream" && isReady) ? "w-full" : ""
                  } inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#18181C] hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 text-xs font-semibold text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer`}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
