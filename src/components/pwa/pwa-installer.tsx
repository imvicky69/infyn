"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Share,
  PlusSquare,
  X,
  CheckCircle2,
  Smartphone,
  Sparkles,
  ArrowRight,
  Music,
  ShieldCheck,
} from "lucide-react";
import { fetchLatestRelease, FALLBACK_RELEASE } from "@/lib/github-releases";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function triggerPWAInstall() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("infyn-trigger-pwa-install"));
  }
}

export function PWAInstaller() {
  const pathname = usePathname();
  const isDlPage = pathname === "/dl" || pathname?.startsWith("/dl");

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [apkDownloadUrl, setApkDownloadUrl] = useState<string>(
    FALLBACK_RELEASE.androidApk.downloadUrl
  );

  // Fetch latest APK download URL for /dl
  useEffect(() => {
    if (isDlPage) {
      fetchLatestRelease().then((rel) => {
        if (rel?.androidApk?.downloadUrl) {
          setApkDownloadUrl(rel.androidApk.downloadUrl);
        }
      });
    }
  }, [isDlPage]);

  // 1. Service Worker Registration
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            // Check for updates
            reg.addEventListener("updatefound", () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    console.log("[PWA] New version available");
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.warn("[PWA] Service Worker registration failed:", err);
          });
      });
    }
  }, []);

  // 2. Detection of platform and standalone display-mode
  useEffect(() => {
    if (typeof window === "undefined") return;

    const standaloneCheck =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes("android-app://");

    setIsStandalone(standaloneCheck);

    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    const isMobileDevice =
      /android|iphone|ipad|ipod|mobile/.test(ua) || window.innerWidth < 768;
    setIsMobile(isMobileDevice);

    // If already installed or running standalone, do not show install banners on general pages
    if (standaloneCheck && !isDlPage) return;

    // Check if user dismissed banner within the last 3 days (or 2 days for dl page)
    const storageKey = isDlPage ? "infyn_dl_banner_dismissed" : "infyn_pwa_banner_dismissed";
    const dismissedTime = localStorage.getItem(storageKey);
    if (dismissedTime) {
      const daysSinceDismissed =
        (Date.now() - parseInt(dismissedTime, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < (isDlPage ? 2 : 5)) return;
    }

    // Delay banner appearance slightly so it doesn't interrupt page initial load
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 2400);

    return () => clearTimeout(timer);
  }, [isDlPage]);

  // 3. Capture beforeinstallprompt event (Chromium, Android, Edge)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowBanner(false);
      setShowModal(false);
      setInstalled(true);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // 4. Handle Action
  const handleActionClick = useCallback(async () => {
    if (isDlPage) {
      // On /dl, trigger direct APK download
      window.location.href = apkDownloadUrl;
      setShowBanner(false);
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setShowBanner(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn("[PWA] Prompt error:", err);
      }
    } else if (isIOS) {
      // iOS doesn't support programmatic install, show guided modal
      setShowModal(true);
    } else {
      // Generic fallback for desktop or unsupported browsers
      setShowModal(true);
    }
  }, [isDlPage, apkDownloadUrl, deferredPrompt, isIOS]);

  // 5. Global trigger event listener
  useEffect(() => {
    const handleTrigger = () => {
      handleActionClick();
    };

    window.addEventListener("infyn-trigger-pwa-install", handleTrigger);
    return () => {
      window.removeEventListener("infyn-trigger-pwa-install", handleTrigger);
    };
  }, [handleActionClick]);

  const handleDismissBanner = () => {
    setShowBanner(false);
    const storageKey = isDlPage ? "infyn_dl_banner_dismissed" : "infyn_pwa_banner_dismissed";
    localStorage.setItem(storageKey, Date.now().toString());
  };

  // If already standalone and NOT on DL page, do not render
  if ((isStandalone || installed) && !isDlPage) {
    return null;
  }

  return (
    <>
      {/* Floating Mobile/Tablet Install Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 pointer-events-auto"
          >
            <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-[#141417]/95 backdrop-blur-xl border border-[#EAEAE5] dark:border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.12),0_2px_10px_rgba(0,0,0,0.06)]">
              {/* App Icon */}
              <div className={`relative h-12 w-12 rounded-xl overflow-hidden border shrink-0 shadow-2xs flex items-center justify-center p-1.5 ${
                isDlPage
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400"
                  : "bg-white dark:bg-zinc-800 border-[#EAEAE5] dark:border-zinc-700"
              }`}>
                {isDlPage ? (
                  <Smartphone className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Image
                    src="/icon-192.png"
                    alt="Infyn Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                )}
              </div>

              {/* Text Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[13px] font-bold text-[#111111] dark:text-white tracking-tight truncate">
                    {isDlPage ? "Download Infyn DL (Android)" : "Install Infyn Offline PWA"}
                  </h4>
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border ${
                    isDlPage
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/60"
                      : "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200/80 dark:border-blue-800/60"
                  }`}>
                    {isDlPage ? "FREE APK" : "OFFLINE"}
                  </span>
                </div>
                <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 truncate mt-0.5">
                  {isDlPage
                    ? "Free Music Streaming & YouTube Downloader"
                    : "Add to home screen · Works 100% offline"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {isDlPage ? (
                  <a
                    href={apkDownloadUrl}
                    onClick={() => setShowBanner(false)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Get APK</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handleActionClick}
                    className="px-3.5 py-2 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Install</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDismissBanner}
                  aria-label="Dismiss banner"
                  className="p-2 rounded-xl text-[#9E9D98] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Dialog (iOS Safari / Manual Installation or Android APK Guide) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white dark:bg-[#141417] border border-[#EAEAE5] dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-2xl border p-1.5 flex items-center justify-center shadow-2xs ${
                    isDlPage
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400"
                      : "bg-white border-[#EAEAE5] dark:border-zinc-700"
                  }`}>
                    {isDlPage ? (
                      <Smartphone className="h-6 w-6" />
                    ) : (
                      <Image
                        src="/icon-192.png"
                        alt="Infyn"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#111111] dark:text-white flex items-center gap-1.5">
                      <span>{isDlPage ? "Install Infyn DL (Android APK)" : "Install Infyn Web App"}</span>
                    </h3>
                    <p className="text-xs text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                      {isDlPage ? "Native music streaming & batch downloader" : "Run directly from your phone home screen"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-xl text-[#9E9D98] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Instructions List */}
              <div className="space-y-3 pt-1">
                {isDlPage ? (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800">
                      <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Download className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-[#111111] dark:text-white">
                          Step 1: Download the Universal APK
                        </p>
                        <p className="text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                          Click below to download the latest APK file directly from GitHub releases.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800">
                      <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-[#111111] dark:text-white">
                          Step 2: Allow Unknown Apps Sideload
                        </p>
                        <p className="text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                          Tap the downloaded file. If prompted, toggle &ldquo;Allow from this source&rdquo; in Android Settings.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800">
                      <div className="h-8 w-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-[#111111] dark:text-white">
                          Step 3: Launch & Stream Ad-Free
                        </p>
                        <p className="text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                          Open Infyn DL to stream and download YouTube Music tracks, 320kbps MP3s, and playlists!
                        </p>
                      </div>
                    </div>
                  </>
                ) : isIOS ? (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800">
                      <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Share className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-[#111111] dark:text-white">
                          Step 1: Tap the Share Button
                        </p>
                        <p className="text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                          In Safari, tap the Share icon at the bottom of your screen (or top on iPad).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800">
                      <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <PlusSquare className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-[#111111] dark:text-white">
                          Step 2: Tap &ldquo;Add to Home Screen&rdquo;
                        </p>
                        <p className="text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                          Scroll down the share menu list and choose &ldquo;Add to Home Screen&rdquo;.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800">
                      <div className="h-8 w-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-[#111111] dark:text-white">
                          Step 3: Tap &ldquo;Add&rdquo;
                        </p>
                        <p className="text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                          Tap &ldquo;Add&rdquo; in the top-right corner to place the Infyn app on your device!
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800">
                      <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-[#111111] dark:text-white">
                          On Android (Chrome / Brave / Edge)
                        </p>
                        <p className="text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                          Tap the three dots (⋮) menu in the top right corner and tap &ldquo;Install app&rdquo; or &ldquo;Add to Home screen&rdquo;.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/60 border border-[#EAEAE5] dark:border-zinc-800">
                      <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Download className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-[#111111] dark:text-white">
                          On Desktop (Chrome / Edge)
                        </p>
                        <p className="text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                          Click the install icon in your address bar (or Menu → &ldquo;Install Infyn&rdquo;).
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Value Props */}
              <div className="pt-2 border-t border-[#F5F4EE] dark:border-zinc-800 flex items-center justify-between text-[11px] text-[#6E6D68] dark:text-zinc-400 font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  {isDlPage ? "Ad-Free & Unlimited" : "100% In-browser"}
                </span>
                <span>•</span>
                <span>{isDlPage ? "Zero accounts needed" : "Zero cloud uploads"}</span>
                <span>•</span>
                <span>Free forever</span>
              </div>

              {/* Action */}
              {isDlPage ? (
                <a
                  href={apkDownloadUrl}
                  onClick={() => setShowModal(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download APK File</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full py-2.5 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Got it
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
