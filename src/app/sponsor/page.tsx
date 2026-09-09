"use client";

import React, { useState, useEffect, useId } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { SPONSOR_CONFIG, buildUpiPaymentUri } from "@/config/sponsor";
import {
  Copy,
  Check,
  Heart,
  QrCode as QrIcon,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from "lucide-react";

export default function SponsorPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(
    SPONSOR_CONFIG.defaultAmount
  );
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isGeneratingQr, setIsGeneratingQr] = useState(true);
  const [hasLaunchedUpi, setHasLaunchedUpi] = useState(false);
  const customInputId = useId();

  // Effective amount used for payment
  const currentAmount = isCustom
    ? parseFloat(customAmount) || undefined
    : selectedAmount ?? undefined;

  // Build the upi://pay URI dynamically
  const upiUri = buildUpiPaymentUri(currentAmount);

  // Generate QR code whenever the URI changes
  useEffect(() => {
    let isSubscribed = true;
    setIsGeneratingQr(true);

    QRCode.toDataURL(upiUri, {
      width: 380,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#111111",
        light: "#FFFFFF",
      },
    })
      .then((url) => {
        if (isSubscribed) {
          setQrDataUrl(url);
          setIsGeneratingQr(false);
        }
      })
      .catch((err) => {
        console.error("Failed to generate UPI QR code", err);
        if (isSubscribed) setIsGeneratingQr(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [upiUri]);

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(SPONSOR_CONFIG.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy UPI ID", e);
    }
  };

  const handleSelectPreset = (amount: number) => {
    setIsCustom(false);
    setSelectedAmount(amount);
    setHasLaunchedUpi(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(val);
    setSelectedAmount(null);
    setHasLaunchedUpi(false);
  };

  const handleOpenUpiApp = () => {
    setHasLaunchedUpi(true);
  };

  return (
    <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Header section */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800/80 border border-[#EAEAE5] dark:border-zinc-700/60 text-xs font-semibold text-[#6E6D68] dark:text-zinc-300">
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>Support Independent Open Source</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111111] dark:text-white leading-[1.15]">
            Support Infyn
          </h1>

          <p className="text-base sm:text-lg text-[#6E6D68] dark:text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed">
            Help us keep useful, privacy-focused software free and independent.
          </p>

          <p className="text-xs sm:text-sm text-[#9E9D98] dark:text-zinc-400 max-w-lg mx-auto leading-normal">
            Infyn is built independently with a focus on privacy, useful tools, and
            open-source software. Your support helps cover infrastructure and
            continued development.
          </p>
        </div>

        {/* Core Contribution Card */}
        <div className="max-w-xl mx-auto bg-white dark:bg-[#141417] border border-[#EAEAE5] dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-none">
          
          {/* Post-launch acknowledgement banner */}
          {hasLaunchedUpi && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-sm flex items-start gap-3 animate-in fade-in duration-300">
              <span className="text-xl shrink-0 mt-0.5">❤️</span>
              <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                <p className="font-semibold text-emerald-950 dark:text-emerald-100 mb-0.5">
                  Thank you for supporting Infyn ❤️
                </p>
                <p className="text-emerald-800 dark:text-emerald-300/90 text-xs">
                  If your UPI app opened, please complete the transfer there. There is no automated webhook, but your support fuels every line of code we ship.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHasLaunchedUpi(false)}
                className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200 p-1 rounded-lg"
                title="Dismiss message"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Amount Presets */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9E9D98] dark:text-zinc-400">
                Select Amount
              </label>
              {currentAmount && (
                <span className="text-xs font-semibold text-[#111111] dark:text-zinc-200">
                  ₹{currentAmount}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {SPONSOR_CONFIG.presetAmounts.map((amt) => {
                const isActive = !isCustom && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSelectPreset(amt)}
                    className={`py-2.5 sm:py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center border ${
                      isActive
                        ? "bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-zinc-950 dark:border-white shadow-xs scale-[1.02]"
                        : "bg-[#F5F4EE] dark:bg-zinc-800/60 text-[#6E6D68] dark:text-zinc-300 border-[#EAEAE5] dark:border-zinc-700/50 hover:border-[#BEBDB9] dark:hover:border-zinc-600 hover:text-[#111111] dark:hover:text-white"
                    }`}
                  >
                    ₹{amt}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount input */}
            <div className="pt-1">
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-[#9E9D98] dark:text-zinc-400">
                  ₹
                </span>
                <input
                  id={customInputId}
                  type="text"
                  inputMode="numeric"
                  placeholder="Or enter a custom amount (e.g. 500)"
                  value={customAmount}
                  onFocus={() => {
                    setIsCustom(true);
                    setSelectedAmount(null);
                  }}
                  onChange={handleCustomChange}
                  className={`w-full pl-7 pr-4 py-2 text-xs sm:text-sm rounded-xl border transition-all bg-white dark:bg-zinc-900 ${
                    isCustom
                      ? "border-[#111111] dark:border-zinc-400 ring-1 ring-[#111111] dark:ring-zinc-400 text-[#111111] dark:text-white font-semibold"
                      : "border-[#EAEAE5] dark:border-zinc-800 text-[#6E6D68] dark:text-zinc-300 hover:border-[#BEBDB9] dark:hover:border-zinc-700"
                  } focus:outline-none`}
                />
                {isCustom && customAmount && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomAmount("");
                      setIsCustom(false);
                      setSelectedAmount(SPONSOR_CONFIG.defaultAmount);
                    }}
                    className="absolute right-3 text-[11px] text-[#9E9D98] hover:text-[#111111] dark:hover:text-white font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* QR Code Section (Primary for Desktop, also visible on Mobile) */}
          <div className="border border-[#EAEAE5] dark:border-zinc-800/80 rounded-2xl p-5 bg-[#FBFBFA] dark:bg-zinc-900/40 text-center space-y-4">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#6E6D68] dark:text-zinc-400">
              <QrIcon className="h-3.5 w-3.5 text-[#111111] dark:text-zinc-300" />
              <span>Scan with any UPI app</span>
            </div>

            {/* The QR Image */}
            <div className="relative mx-auto w-52 h-52 sm:w-60 sm:h-60 bg-white p-3 rounded-2xl border border-[#EAEAE5] shadow-xs flex items-center justify-center">
              {isGeneratingQr ? (
                <div className="animate-pulse text-xs text-[#9E9D98] font-medium">
                  Generating QR...
                </div>
              ) : qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="Infyn UPI QR Code"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-xs text-rose-500">Failed to render QR</div>
              )}
            </div>

            <p className="text-[11px] text-[#9E9D98] dark:text-zinc-400">
              Google Pay · PhonePe · Paytm · BHIM · CRED · Any UPI App
            </p>
          </div>

          {/* Mobile Direct Pay Button (prominent on mobile) */}
          <div className="mt-5 pt-1 space-y-2">
            <a
              href={upiUri}
              onClick={handleOpenUpiApp}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm bg-[#111111] text-white hover:bg-black dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
            >
              <Smartphone className="h-4 w-4 shrink-0" />
              <span>
                Support {currentAmount ? `₹${currentAmount}` : ""} via UPI App
              </span>
              <ArrowRight className="h-4 w-4 ml-1 shrink-0" />
            </a>

            <p className="text-[11px] text-center text-[#9E9D98] dark:text-zinc-400">
              On mobile: Tapping opens your installed UPI app with details prefilled.
            </p>
          </div>

          {/* UPI ID display & Copy Button */}
          <div className="mt-6 pt-5 border-t border-[#EAEAE5] dark:border-zinc-800 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#9E9D98] dark:text-zinc-400">
              Infyn UPI ID
            </div>

            <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800/80 border border-[#EAEAE5] dark:border-zinc-700/60">
              <span className="font-mono text-xs sm:text-sm font-bold text-[#111111] dark:text-white truncate">
                {SPONSOR_CONFIG.upiId}
              </span>

              <button
                type="button"
                onClick={handleCopyUpi}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-700 text-[#111111] dark:text-white hover:bg-[#F8F8F6] dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shrink-0 shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[#6E6D68] dark:text-zinc-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Minimal trust & transparency footer note */}
        <div className="max-w-xl mx-auto mt-8 text-center space-y-3">
          <div className="inline-flex items-center justify-center gap-2 text-xs text-[#6E6D68] dark:text-zinc-400 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Direct peer-to-peer · Zero middleman cuts · 100% private</span>
          </div>

          <p className="text-[11px] text-[#9E9D98] dark:text-zinc-400 leading-relaxed max-w-md mx-auto">
            Infyn runs all utilities client-side in your browser. We never monetize data, inject tracking ads, or charge subscriptions.
          </p>

          <div className="pt-2">
            <Link
              href={SPONSOR_CONFIG.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              <span>View Infyn on GitHub</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
