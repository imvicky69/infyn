"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Sparkles, AlertCircle } from "lucide-react";

export const ADSENSE_CLIENT_ID = "ca-pub-1570682624410987";
export const DEFAULT_ADSENSE_SLOT = "3391568137";

interface GoogleAdProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal";
  responsive?: boolean;
  className?: string;
  minHeight?: number;
  label?: string;
}

export function GoogleAd({
  slot = DEFAULT_ADSENSE_SLOT,
  format = "auto",
  responsive = true,
  className = "",
  minHeight = 160,
  label = "Advertisement",
}: GoogleAdProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const [adStatus, setAdStatus] = useState<"loading" | "filled" | "unfilled" | "blocked">("loading");
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
    setIsLocalhost(isLocal);

    // Detect if AdBlock is completely blocking Google AdSense script
    const checkAdBlock = setTimeout(() => {
      if (!(window as any).adsbygoogle && !isLocal) {
        setAdStatus("blocked");
      }
    }, 1500);

    // Give DOM a tick to layout and compute non-zero dimensions
    const pushTimer = setTimeout(() => {
      const ins = insRef.current;
      if (!ins) return;

      // Avoid double-pushing to the same <ins> element
      if (ins.getAttribute("data-adsbygoogle-status")) {
        pushedRef.current = true;
        return;
      }

      if (!pushedRef.current) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          pushedRef.current = true;
        } catch (err) {
          console.debug("AdSense push:", err);
        }
      }
    }, 250);

    // Listen for Google AdSense marking data-ad-status="filled" or "unfilled"
    const ins = insRef.current;
    let observer: MutationObserver | null = null;
    if (ins && typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(() => {
        const status = ins.getAttribute("data-ad-status");
        if (status === "filled") setAdStatus("filled");
        else if (status === "unfilled") setAdStatus("unfilled");
      });
      observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });
    }

    return () => {
      clearTimeout(checkAdBlock);
      clearTimeout(pushTimer);
      if (observer) observer.disconnect();
    };
  }, [slot]);

  return (
    <div
      className={`w-full rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] p-3 text-center transition-all overflow-hidden ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EAEAE5] dark:border-zinc-800 text-[10px] text-[#9E9D98] dark:text-zinc-500">
        <div className="flex items-center gap-1.5">
          <span className="font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300">
            {label}
          </span>
          <span className="hidden sm:inline-block">Google AdSense</span>
        </div>
        <span className="font-mono text-[9px]">Slot: {slot}</span>
      </div>

      {/* Main Ad Container: ALWAYS maintains positive dimensions so Google's crawler can measure it */}
      <div
        className="w-full flex justify-center items-center overflow-hidden relative"
        style={{ minHeight: `${minHeight}px` }}
      >
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{
            display: "block",
            width: "100%",
            textAlign: "center",
            minHeight: `${minHeight}px`,
          }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />

        {/* Fallback / Localhost Preview notice */}
        {isLocalhost && (
          <div className="absolute inset-0 bg-white/95 dark:bg-[#141417]/95 flex flex-col items-center justify-center p-4 text-center space-y-2 pointer-events-auto">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AdSense Slot #{slot} Configured</span>
            </div>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 max-w-md">
              Google AdSense does not serve live auction ads on <strong>localhost</strong>.
              This unit will automatically serve live Google ads in production on{" "}
              <strong>infyn.software</strong>.
            </p>
          </div>
        )}

        {/* Ad blocker detection message */}
        {adStatus === "blocked" && !isLocalhost && (
          <div className="absolute inset-0 bg-white/95 dark:bg-[#141417]/95 flex flex-col items-center justify-center p-3 text-center space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Ad Blocker Detected</span>
            </div>
            <p className="text-[11px] text-[#6E6D68] dark:text-zinc-400 max-w-sm">
              Please consider whitelisting <strong>infyn.software</strong> to support 100% free
              tools.
            </p>
          </div>
        )}
      </div>

      {/* Subtle footer indicator */}
      <div className="pt-2 mt-2 border-t border-[#EAEAE5] dark:border-zinc-800/60 flex items-center justify-between text-[9px] text-[#9E9D98] dark:text-zinc-500">
        <span>Verified Google Publisher</span>
        <span>Zero popup redirects</span>
      </div>
    </div>
  );
}
