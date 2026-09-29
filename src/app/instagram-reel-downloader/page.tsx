"use client";

import * as React from "react";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Download,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Music,
  FileVideo,
  ExternalLink,
  ShieldCheck,
  Zap,
  HelpCircle,
  Smartphone,
  Laptop,
  Layers,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import SplitText from "@/components/SplitText";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface ReelData {
  id: string;
  title: string;
  uploader: string;
  uploader_id?: string;
  duration?: number;
  thumbnail: string;
  video_url: string;
  audio_url?: string;
  download_url: string;
  audio_download_url?: string;
  filename: string;
  description?: string;
  like_count?: number;
  comment_count?: number;
}

type Stage = "idle" | "busy" | "done" | "error";

const SAMPLE_REEL_URL =
  "https://www.instagram.com/reel/Ddf4rqIzx8O/?stkn=bXhtb3lvcGNzaDV4";

const FAQS = [
  {
    q: "How do I download an Instagram Reel on mobile or PC?",
    a: "Open the Instagram app or website, tap the share icon on the Reel, and click 'Copy Link'. Paste the link into the box above, click 'Download Reel', and your video will be ready to save in full HD MP4.",
  },
  {
    q: "Will the downloaded Reel have watermarks?",
    a: "No! All video downloads via Infyn are 100% free of added watermarks or logos, matching the original uploaded quality.",
  },
  {
    q: "Can I download only the audio or background music from a Reel?",
    a: "Yes. Once the Reel is processed, an option to 'Download Audio (M4A)' is available so you can save pristine background music and audio tracks.",
  },
  {
    q: "Can I download Reels from private Instagram accounts?",
    a: "No. For privacy and security reasons, our tool only processes public Instagram Reels and posts accessible without an Instagram login.",
  },
  {
    q: "Are my downloads saved on your servers?",
    a: "Never. Infyn adheres to a strict zero-cloud-storage philosophy. Your requested media streams directly to your browser without retention or storage on remote servers.",
  },
];

export default function InstagramDownloaderPage() {
  const [url, setUrl] = useState<string>("");
  const [stage, setStage] = useState<Stage>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [reelData, setReelData] = useState<ReelData | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          if (inputRef.current) inputRef.current.focus();
        }
      }
    } catch {
      // User can manually paste
    }
  };

  const handleFetchReel = async (targetUrl?: string) => {
    const linkToFetch = (targetUrl || url).trim();
    if (!linkToFetch) {
      setErrorMsg("Please enter or paste an Instagram Reel link.");
      setStage("error");
      return;
    }

    if (!linkToFetch.toLowerCase().includes("instagram.com")) {
      setErrorMsg(
        "Please provide a valid Instagram URL (e.g., https://www.instagram.com/reel/...)"
      );
      setStage("error");
      return;
    }

    setStage("busy");
    setErrorMsg("");
    setReelData(null);

    try {
      const res = await fetch("/api/instagram/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkToFetch }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Failed to retrieve Reel. Please check if the link is public."
        );
      }

      setReelData(data);
      setStage("done");
    } catch (err: any) {
      setErrorMsg(
        err.message || "An error occurred while fetching the reel. Please try again."
      );
      setStage("error");
    }
  };

  const handleCopyStreamLink = () => {
    if (!reelData?.video_url) return;
    navigator.clipboard.writeText(reelData.video_url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const triggerDownload = (downloadUrl: string, filename: string) => {
    setIsDownloading(true);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1500);
  };

  const handleReset = () => {
    setStage("idle");
    setUrl("");
    setReelData(null);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* ── Hero Section ─────────────────────────────────── */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-bold shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Fast, Free & Zero Watermarks</span>
          </div>

          <SplitText
            text="Instagram Reel Downloader"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] dark:text-white"
            delay={25}
            duration={0.6}
            splitType="words"
          />

          <p className="text-sm sm:text-base text-[#6E6D68] dark:text-zinc-400 font-medium leading-relaxed">
            Download Instagram Reels, Videos, and Audio in full HD MP4 directly in your
            browser. No registration, no ads, and 100% free.
          </p>
        </div>

        {/* ── Input & Search Container ─────────────────────── */}
        <div className="max-w-2xl mx-auto w-full space-y-3">
          <div className="p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus-within:border-rose-500 dark:focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="flex items-center gap-2.5 flex-1 px-3 py-2 sm:py-0">
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(244,63,94,0.15), rgba(168,85,247,0.15))",
                  }}
                  className="h-10 w-10 rounded-xl border border-rose-200/60 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0"
                >
                  <InstagramIcon className="h-5 w-5" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (stage === "error") setStage("idle");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && stage !== "busy") {
                      handleFetchReel();
                    }
                  }}
                  placeholder="Paste Instagram Reel link here..."
                  className="w-full bg-transparent text-sm sm:text-base text-[#111111] dark:text-white placeholder-[#9E9D98] dark:placeholder-zinc-500 outline-none"
                  disabled={stage === "busy"}
                />
                {url && (
                  <button
                    onClick={() => {
                      setUrl("");
                      if (stage !== "busy") setStage("idle");
                    }}
                    className="text-xs text-[#9E9D98] hover:text-[#111111] dark:hover:text-white px-2 py-1 rounded transition-colors shrink-0 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  title="Paste from clipboard"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#F5F4EE] dark:bg-zinc-800 hover:bg-[#EAEAE5] dark:hover:bg-zinc-700 text-[#6E6D68] dark:text-zinc-300 transition-colors shrink-0 cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                  <span>Paste</span>
                </button>
              </div>

              <button
                onClick={() => handleFetchReel()}
                disabled={stage === "busy" || !url.trim()}
                style={{
                  background:
                    "linear-gradient(135deg, #e11d48 0%, #db2777 50%, #9333ea 100%)",
                }}
                className="px-6 py-3.5 rounded-xl sm:rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] shrink-0 cursor-pointer"
              >
                {stage === "busy" ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download Reel</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Example Reel Pill */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#6E6D68] dark:text-zinc-400">
            <span>Quick test:</span>
            <button
              onClick={() => {
                setUrl(SAMPLE_REEL_URL);
                handleFetchReel(SAMPLE_REEL_URL);
              }}
              className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              <span>Try sample public reel</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* ── Stage: Busy (Loading animation) ──────────────── */}
        {stage === "busy" && (
          <div
            className="max-w-xl mx-auto p-8 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] text-center space-y-4 shadow-sm"
            style={{ animation: "fade-in-up 0.3s ease-out" }}
          >
            <div className="relative mx-auto h-16 w-16">
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(244,63,94,0.2), rgba(168,85,247,0.2))",
                }}
                className="absolute inset-0 rounded-2xl animate-pulse"
              />
              <div className="relative h-16 w-16 rounded-2xl border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <InstagramIcon className="h-8 w-8 animate-bounce" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#111111] dark:text-white">
                Fetching Instagram Reel...
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
                Extracting high-definition media stream and audio track directly...
              </p>
            </div>
            <div className="w-48 mx-auto h-1.5 bg-[#F5F4EE] dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                style={{
                  background: "linear-gradient(90deg, #f43f5e 0%, #a855f7 100%)",
                }}
                className="h-full rounded-full animate-pulse w-3/4"
              />
            </div>
          </div>
        )}

        {/* ── Stage: Error ─────────────────────────────────── */}
        {stage === "error" && (
          <div
            className="max-w-xl mx-auto p-6 rounded-2xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300 space-y-3"
            style={{ animation: "fade-in-up 0.3s ease-out" }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold">Unable to download this Reel</h4>
                <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-400 leading-relaxed">
                  {errorMsg}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 pl-8">
              <button
                onClick={() => setStage("idle")}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 hover:bg-rose-200/60 transition-colors cursor-pointer"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  setUrl(SAMPLE_REEL_URL);
                  handleFetchReel(SAMPLE_REEL_URL);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-rose-200 dark:border-zinc-700 text-[#111111] dark:text-white hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Test With Sample Link
              </button>
            </div>
          </div>
        )}

        {/* ── Stage: Done (Result Card & Video Player) ─────── */}
        {stage === "done" && reelData && (
          <div
            className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6"
            style={{ animation: "fade-in-up 0.3s ease-out" }}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-[#EAEAE5] dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111111] dark:text-white">
                    Reel Ready for Download
                  </h3>
                  <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                    High definition MP4 video stream extracted successfully
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-700 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>New Download</span>
              </button>
            </div>

            {/* Content: Video Player on left + Details/Buttons on right */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Left: Video Player */}
              <div className="w-full max-w-[280px] shrink-0 flex flex-col items-center">
                <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-lg border border-black/10">
                  <video
                    ref={videoRef}
                    src={reelData.video_url}
                    poster={reelData.thumbnail}
                    controls
                    playsInline
                    loop
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] text-[#9E9D98] dark:text-zinc-500 mt-2.5 flex items-center gap-1.5">
                  <Play className="h-3 w-3" />
                  <span>Tap video to preview audio & video</span>
                </p>
              </div>

              {/* Right: Info & Download Actions */}
              <div className="flex-1 w-full min-w-0 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60">
                      Instagram Reel
                    </span>
                    {reelData.duration ? (
                      <span className="text-xs font-semibold text-[#6E6D68] dark:text-zinc-400">
                        {reelData.duration}s duration
                      </span>
                    ) : null}
                  </div>

                  <h4 className="text-lg sm:text-xl font-extrabold text-[#111111] dark:text-white break-words leading-snug">
                    {reelData.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 font-medium">
                    By{" "}
                    <span className="font-bold text-[#111111] dark:text-white">
                      @{reelData.uploader}
                    </span>
                  </p>

                  {reelData.description && (
                    <p className="text-xs text-[#6E6D68] dark:text-zinc-400 break-words line-clamp-3 bg-[#F5F4EE] dark:bg-zinc-800/60 p-3 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 leading-relaxed">
                      {reelData.description}
                    </p>
                  )}
                </div>

                {/* Primary & Secondary Download Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() =>
                      triggerDownload(reelData.download_url, reelData.filename)
                    }
                    disabled={isDownloading}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#111111] hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-[#111111] text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Reel (HD MP4)</span>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {reelData.audio_download_url ? (
                      <button
                        onClick={() =>
                          triggerDownload(
                            reelData.audio_download_url!,
                            `${reelData.id}_audio.m4a`
                          )
                        }
                        className="py-3 px-3.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-[#F5F4EE] dark:bg-zinc-800 text-[#111111] dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Music className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span>Download Audio (M4A)</span>
                      </button>
                    ) : null}

                    {reelData.thumbnail ? (
                      <button
                        onClick={() =>
                          triggerDownload(
                            reelData.thumbnail,
                            `${reelData.id}_cover.jpg`
                          )
                        }
                        className="py-3 px-3.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-[#F5F4EE] dark:bg-zinc-800 text-[#111111] dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <FileVideo className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                        <span>Cover Image (JPG)</span>
                      </button>
                    ) : null}
                  </div>

                  <button
                    onClick={handleCopyStreamLink}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          Stream Link Copied to Clipboard!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Direct Stream URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Feature Value Props ──────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6">
          <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-2">
            <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111111] dark:text-white">
              Direct In-Browser
            </h4>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              No software or extensions required. Plays and downloads directly inside your
              mobile or desktop browser.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-2">
            <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111111] dark:text-white">
              Zero Watermarks
            </h4>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Preserves the original video and audio quality exactly as uploaded, with no
              overlays or compression artifacts.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-2">
            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Music className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111111] dark:text-white">
              Audio Extraction
            </h4>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Extract background songs, sound clips, and voiceovers into separate clean audio
              files with 1 click.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Layers className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111111] dark:text-white">
              100% Free & Unlimited
            </h4>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              No daily limits, no hidden subscription traps, and zero invasive banner
              advertisements.
            </p>
          </div>
        </div>

        {/* ── How to Download Guide ─────────────────────────── */}
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-[#111111] dark:text-white flex items-center gap-2">
              <span>How to Download Instagram Reels in 3 Steps</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
              Compatible with all modern web browsers across iPhone, Android, Mac, and Windows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#FBFBFA] dark:bg-[#18181B] border border-[#EAEAE5] dark:border-zinc-800 space-y-2">
              <div className="h-7 w-7 rounded-lg bg-rose-500 text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h5 className="text-sm font-bold text-[#111111] dark:text-white">
                Copy Reel Link
              </h5>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Open Instagram, find the Reel you want to save, tap Share &rarr; Copy Link.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBFBFA] dark:bg-[#18181B] border border-[#EAEAE5] dark:border-zinc-800 space-y-2">
              <div className="h-7 w-7 rounded-lg bg-rose-500 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h5 className="text-sm font-bold text-[#111111] dark:text-white">
                Paste on Infyn
              </h5>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Paste the URL into the input field above and click &ldquo;Download Reel&rdquo;.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBFBFA] dark:bg-[#18181B] border border-[#EAEAE5] dark:border-zinc-800 space-y-2">
              <div className="h-7 w-7 rounded-lg bg-rose-500 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h5 className="text-sm font-bold text-[#111111] dark:text-white">
                Preview & Save
              </h5>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                Watch the preview inside your browser and click &ldquo;Download (HD MP4)&rdquo;.
              </p>
            </div>
          </div>
        </div>

        {/* ── FAQ Section ──────────────────────────────────── */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-extrabold text-[#111111] dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
              Everything you need to know about downloading Instagram Reels.
            </p>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#111111] dark:text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#9E9D98] transition-transform duration-200 shrink-0 ${
                        isExpanded ? "rotate-180 text-rose-600 dark:text-rose-400" : ""
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed border-t border-[#F5F4EE] dark:border-zinc-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Privacy Badges ───────────────────────────────── */}
        <div className="pt-6">
          <PrivacyBadges
            badges={[
              "100% In-browser preview",
              "Zero cloud storage",
              "100% Free & Unlimited",
              "No Watermarks",
            ]}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
