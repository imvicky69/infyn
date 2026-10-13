"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { ADSTERRA_CONFIG } from "@/lib/adsterra-config";

export type AdsterraFormat = "300x250" | "728x90" | "320x50" | "native";

interface AdsterraAdProps {
  format?: AdsterraFormat;
  className?: string;
  label?: string;
  customKey?: string;
}

export function AdsterraAd({
  format = "300x250",
  className = "",
  label = "Sponsored",
  customKey,
}: AdsterraAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  let width = 300;
  let height = 250;
  let unitKey = customKey || ADSTERRA_CONFIG.units.banner300x250.key;

  if (format === "728x90") {
    width = 728;
    height = 90;
    unitKey = customKey || ADSTERRA_CONFIG.units.banner728x90.key;
  } else if (format === "320x50") {
    width = 320;
    height = 50;
    unitKey = customKey || ADSTERRA_CONFIG.units.banner320x50.key;
  } else if (format === "native") {
    width = 300;
    height = 250;
    unitKey = customKey || ADSTERRA_CONFIG.units.nativeBanner.key;
  }

  // Generate safe sandboxed HTML for iframe execution
  const iframeContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          * { box-sizing: border-box; }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key': '${unitKey}',
            'format': 'iframe',
            'height': ${height},
            'width': ${width},
            'params': {}
          };
        </script>
        <script type="text/javascript" src="//www.highperformanceformat.com/${unitKey}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto rounded-2xl border border-[#EAEAE5] dark:border-zinc-800/80 bg-[#FBFBFA]/60 dark:bg-[#141417]/80 p-2 sm:p-3 overflow-hidden text-center transition-all ${className}`}
      style={{
        maxWidth: format === "728x90" ? "760px" : format === "320x50" ? "350px" : "340px",
      }}
    >
      {/* Top Label */}
      <div className="flex items-center justify-between px-2 pb-1.5 text-[10px] font-bold tracking-wider text-[#9E9D98] dark:text-zinc-500 uppercase">
        <span className="flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5 text-rose-500" />
          <span>{label}</span>
        </span>
        <span className="text-[9px] opacity-70">{format}</span>
      </div>

      {/* Ad frame container */}
      <div
        className="relative mx-auto flex items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-zinc-900 border border-[#EAEAE5]/60 dark:border-zinc-800/50 shadow-2xs"
        style={{
          width: "100%",
          maxWidth: `${width}px`,
          height: `${height}px`,
        }}
      >
        {isMounted ? (
          <iframe
            title={`Adsterra ${format} banner`}
            srcDoc={iframeContent}
            width={width}
            height={height}
            scrolling="no"
            frameBorder="0"
            className="border-0 overflow-hidden"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              maxWidth: "100%",
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-xs text-[#9E9D98] dark:text-zinc-600 animate-pulse"
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <span>Loading sponsored ad...</span>
          </div>
        )}
      </div>
    </div>
  );
}
