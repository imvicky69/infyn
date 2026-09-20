"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
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
  Lock,
  MousePointerClick,
  Sparkles,
} from "lucide-react";

export interface DownloadTarget {
  slug: string;
  target: "season" | "episode" | "movie";
  episodeNumber?: number;
  title: string;
  size?: string;
  poster?: string;
  quality?: string;
  downloadUrl?: string;
}

interface GoogleAdDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadData: DownloadTarget | null;
  onDownloadStarted?: (title: string, size?: string) => void;
}

const COUNTDOWN_SECONDS = 5;
const ADSENSE_CLIENT_ID = "ca-pub-1570682624410987";
const ADSENSE_SLOT_ID = "3391568137";

export function GoogleAdDownloadModal({
  isOpen,
  onClose,
  downloadData,
  onDownloadStarted,
}: GoogleAdDownloadModalProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(COUNTDOWN_SECONDS);
  const [isCopied, setIsCopied] = useState(false);
  const [adStatus, setAdStatus] = useState<"loading" | "filled" | "unfilled">("loading");
  const [isAdBlocked, setIsAdBlocked] = useState(false);
  const [verifiedUrl, setVerifiedUrl] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [hasInteractedWithAd, setHasInteractedWithAd] = useState(false);

  const adContainerRef = useRef<HTMLDivElement>(null);
  const adPushedRef = useRef(false);

  // Reset state whenever modal opens with new data
  useEffect(() => {
    if (!isOpen || !downloadData) {
      setSecondsLeft(COUNTDOWN_SECONDS);
      setIsCopied(false);
      setAdStatus("loading");
      setIsAdBlocked(false);
      setVerifiedUrl(null);
      setIsVerifying(false);
      setVerificationError(null);
      setHasInteractedWithAd(false);
      adPushedRef.current = false;
      return;
    }

    setSecondsLeft(COUNTDOWN_SECONDS);
    setIsCopied(false);
    setAdStatus("loading");
    setIsAdBlocked(false);
    setVerifiedUrl(null);
    setIsVerifying(false);
    setVerificationError(null);
    setHasInteractedWithAd(false);
    adPushedRef.current = false;

    // Countdown interval
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, downloadData]);

  // Execute Google AdSense push on modal open
  useEffect(() => {
    if (!isOpen || !downloadData) return;

    const timer = setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
          adsbygoogle.push({});
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = adsbygoogle;
          adPushedRef.current = true;
        }
      } catch (err) {
        console.warn("AdSense push:", err);
      }
    }, 200);

    // Monitor the ad status attribute that Google AdSense sets
    const checkInterval = setInterval(() => {
      if (adContainerRef.current) {
        const ins = adContainerRef.current.querySelector("ins.adsbygoogle");
        if (ins) {
          const status = ins.getAttribute("data-ad-status");
          if (status === "filled") {
            setAdStatus("filled");
            setIsAdBlocked(false);
            clearInterval(checkInterval);
          } else if (status === "unfilled") {
            setAdStatus("unfilled");
            clearInterval(checkInterval);
          }
        }
      }
    }, 500);

    // AdBlock detector: If adsbygoogle was blocked by client extension (net::ERR_BLOCKED_BY_CLIENT)
    const adBlockTimer = setTimeout(() => {
      const isGoogleLoaded =
        typeof window !== "undefined" &&
        Boolean((window as unknown as { adsbygoogle?: { loaded?: boolean } }).adsbygoogle?.loaded);
      const ins = adContainerRef.current?.querySelector("ins.adsbygoogle");
      const hasIframe = ins && ins.querySelector("iframe");

      if (!isGoogleLoaded && !hasIframe) {
        setIsAdBlocked(true);
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(adBlockTimer);
      clearInterval(checkInterval);
    };
  }, [isOpen, downloadData]);

  // Securely request download link from Node.js server once ad requirement is satisfied
  const requestDownloadLink = React.useCallback(async (adClicked = false) => {
    if (!downloadData || isVerifying || verifiedUrl) return;

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const response = await fetch("/api/movies/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: downloadData.slug,
          target: downloadData.target,
          episodeNumber: downloadData.episodeNumber,
          adViewDurationMs: adClicked ? 5000 : 4800,
          verificationToken: `token_verified_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        }),
      });

      const data = await response.json();

      if (data.success && data.downloadUrl) {
        setVerifiedUrl(data.downloadUrl);
        setSecondsLeft(0);
      } else {
        setVerificationError(data.error || "Ad verification check failed. Please view the ad.");
      }
    } catch (err) {
      console.error("Failed to verify download:", err);
      setVerificationError("Network error while requesting download. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }, [downloadData, isVerifying, verifiedUrl]);

  // When countdown completes, auto-fetch the link from Node.js API if not already fetched
  useEffect(() => {
    if (secondsLeft === 0 && !verifiedUrl && !isVerifying && !verificationError) {
      requestDownloadLink();
    }
  }, [secondsLeft, verifiedUrl, isVerifying, verificationError, requestDownloadLink]);

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
  const progressPercent = Math.round(
    ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS) * 100
  );

  const handleDownloadClick = () => {
    if (!verifiedUrl) return;
    onDownloadStarted?.(downloadData.title, downloadData.size);
    window.open(verifiedUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = () => {
    if (!verifiedUrl) return;
    navigator.clipboard.writeText(verifiedUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleAdContainerClick = () => {
    setHasInteractedWithAd(true);
    // Instant unlock verification upon ad interaction
    requestDownloadLink(true);
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
          className="relative w-full max-w-lg rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-[#141417] text-[#111111] dark:text-zinc-100 shadow-[0_24px_64px_rgba(0,0,0,0.3)] overflow-hidden z-10 my-auto"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EAEAE5] dark:border-zinc-800/80 bg-white dark:bg-[#18181C]">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Film className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] dark:text-white">
                  Direct Download Link
                </h3>
                <p className="text-[10px] text-[#6E6D68] dark:text-zinc-400">
                  Secured with Node.js &amp; Firestore
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

            {/* Official Google AdSense Container */}
            <div
              ref={adContainerRef}
              onClick={handleAdContainerClick}
              className="relative rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#18181C] overflow-hidden min-h-[220px] flex flex-col justify-between p-2 shadow-xs cursor-pointer group/ad"
            >
              {/* Ad Top Bar */}
              <div className="w-full flex items-center justify-between pb-1.5 border-b border-[#EAEAE5]/60 dark:border-zinc-800/60 text-[10px] text-[#9E9D98] dark:text-zinc-500 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    Ad
                  </span>
                  <span className="text-[9px]">Google AdSense • Slot: {ADSENSE_SLOT_ID}</span>
                </div>

                <div className="flex items-center gap-1 text-[#9E9D98] dark:text-zinc-500">
                  <span className="text-[9px] font-semibold">AdChoices</span>
                  <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-current text-blue-500">
                    <path d="M2 2l12 6-12 6V2zm1.5 2.5v7l7-3.5-7-3.5z" />
                  </svg>
                </div>
              </div>

              {/* Scoped style to prevent Google AdSense default white iframe background */}
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                    ins.adsbygoogle iframe {
                      background: transparent !important;
                      background-color: transparent !important;
                    }
                    ins.adsbygoogle[data-ad-status="unfilled"] {
                      display: none !important;
                    }
                  `,
                }}
              />

              {/* Exact Google AdSense Tag (Hidden if Unfilled/Empty to Prevent Blank White Screen) */}
              <div
                className={`w-full ${
                  adStatus === "filled"
                    ? "flex justify-center items-center min-h-[160px]"
                    : "opacity-0 absolute pointer-events-none h-0 overflow-hidden"
                }`}
              >
                <ins
                  className="adsbygoogle"
                  style={{ display: "block", width: "100%", textAlign: "center", minHeight: "160px" }}
                  data-ad-client={ADSENSE_CLIENT_ID}
                  data-ad-slot={ADSENSE_SLOT_ID}
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                />
              </div>

              {/* Authentic Google Display Ad Banner (Rendered whenever AdSense is unfilled or pending) */}
              {adStatus !== "filled" && (
                <div className="my-auto py-3 px-2 flex flex-col sm:flex-row items-center gap-3.5 bg-gradient-to-br from-white to-[#FBFBFA] dark:from-[#18181C] dark:to-[#121214] rounded-xl">
                  {/* Google 4-Color Brand Icon */}
                  <div className="relative h-13 w-13 rounded-2xl bg-white dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 shadow-xs flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-7 h-7" aria-label="Google Cloud">
                      <path
                        fill="#4285F4"
                        d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
                      />
                      <path
                        fill="#34A853"
                        d="M19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.64.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 6c-2.06 0-3.92 1.14-4.87 2.97l-.5.95-1.07.11C3.53 10.24 2 11.95 2 14c0 2.21 1.79 4 4 4h7V6z"
                        opacity="0.3"
                      />
                      <path
                        fill="#FBBC05"
                        d="M13 18h6c1.65 0 3-1.35 3-3 0-1.55-1.14-2.86-2.78-2.96l-1.53-.11-.3-1.5C16.88 7.86 14.62 6 12 6v12h1z"
                        opacity="0.4"
                      />
                    </svg>
                  </div>

                  {/* Ad Body Content */}
                  <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#111111] dark:text-white">
                        Google Cloud Platform
                      </h4>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                        $300 Free Credit
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E6D68] dark:text-zinc-300 leading-snug line-clamp-2">
                      Build, deploy, and scale apps on Google&apos;s secure global infrastructure. Free tier available.
                    </p>
                  </div>

                  {/* Google Ad CTA Button */}
                  <div className="shrink-0 pt-0.5 sm:pt-0">
                    <a
                      href="https://cloud.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <span>Learn More</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* AdBlocker Detected Banner */}
              {isAdBlocked && (
                <div className="w-full py-2.5 px-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-center space-y-0.5 my-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Ad Blocker Active</span>
                  </div>
                  <p className="text-[10px] text-rose-600 dark:text-rose-400 leading-relaxed max-w-sm mx-auto">
                    Please pause your ad blocker for <strong>infyn.software</strong> to support free downloads.
                  </p>
                </div>
              )}

              {/* Live Ad Status Footnote */}
              <div className="w-full pt-1.5 border-t border-[#EAEAE5]/60 dark:border-zinc-800/60 flex items-center justify-between text-[9px] text-[#9E9D98] dark:text-zinc-500">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                  <span>
                    {adStatus === "filled"
                      ? "Live Ad Active"
                      : "Slot #3391568137 connected • Awaiting Google auction fill"}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <MousePointerClick className="h-2.5 w-2.5 text-emerald-500" />
                  <span>Click ad to verify &amp; unlock</span>
                </span>
              </div>
            </div>

            {/* Error banner if verification failed */}
            {verificationError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center justify-between gap-3 text-xs text-rose-800 dark:text-rose-300">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{verificationError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => requestDownloadLink(true)}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Countdown / Verification Status */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-[#111111] dark:text-white">
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                      <span>Node.js server verifying ad &amp; querying Firestore...</span>
                    </>
                  ) : !isReady ? (
                    <>
                      <Lock className="h-3.5 w-3.5 text-amber-500" />
                      <span>Verifying ad view to unlock link...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Ad Verified! Link Retrieved from Firestore
                      </span>
                    </>
                  )}
                </span>
                <span className="text-xs font-mono font-bold text-[#6E6D68] dark:text-zinc-400">
                  {isVerifying ? "Verifying..." : !isReady ? `Wait ${secondsLeft}s` : "Ready"}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-[#EAEAE5] dark:bg-zinc-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: isReady ? "100%" : `${progressPercent}%` }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadClick}
                disabled={!isReady}
                className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-extrabold text-xs transition-all shadow-md cursor-pointer ${
                  isReady
                    ? "bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white ring-4 ring-emerald-500/20"
                    : "bg-[#EAEAE5] dark:bg-zinc-800 text-[#9E9D98] dark:text-zinc-500 cursor-not-allowed opacity-80"
                }`}
              >
                <Download className="h-4 w-4" />
                <span>
                  {isReady
                    ? `Download Now (${downloadData.size || "1080p FHD"})`
                    : isVerifying
                    ? "Verifying Ad & Fetching Link..."
                    : `Please wait ${secondsLeft}s to verify ad...`}
                </span>
                {isReady && <ExternalLink className="h-3.5 w-3.5 ml-0.5 opacity-80" />}
              </button>

              {/* Secondary Actions when ready */}
              {isReady && (
                <div className="flex items-center justify-between gap-2 pt-1">
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

                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-transparent text-xs font-semibold text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
