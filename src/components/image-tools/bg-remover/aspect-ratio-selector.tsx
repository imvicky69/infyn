"use client";

import React from "react";

export interface AspectRatioOption {
  id: string;
  name: string;
  ratio: number | "original";
  label: string;
  desc: string;
  cssAspect: string;
}

export const ASPECT_RATIO_PRESETS: AspectRatioOption[] = [
  { id: "original", name: "Original", ratio: "original", label: "Auto", desc: "Original image size", cssAspect: "auto" },
  { id: "1:1", name: "1:1", ratio: 1, label: "Square", desc: "Profile / Avatar / Post", cssAspect: "1 / 1" },
  { id: "9:16", name: "9:16", ratio: 9 / 16, label: "Story", desc: "TikTok / Reels / Shorts", cssAspect: "9 / 16" },
  { id: "4:5", name: "4:5", ratio: 4 / 5, label: "Portrait", desc: "Instagram Feed", cssAspect: "4 / 5" },
  { id: "16:9", name: "16:9", ratio: 16 / 9, label: "Landscape", desc: "YouTube / Banner", cssAspect: "16 / 9" },
  { id: "4:3", name: "4:3", ratio: 4 / 3, label: "Classic", desc: "Photo / Slides", cssAspect: "4 / 3" },
];

export function AspectRatioSelector({
  selectedRatio,
  onSelectRatio,
  className = "",
}: {
  selectedRatio: AspectRatioOption;
  onSelectRatio: (ratio: AspectRatioOption) => void;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-[#EAEAE5] bg-white p-5 space-y-3 shadow-xs ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
          Aspect Ratio & Size Format
        </span>
        <span className="text-[11px] text-[#6E6D68]">{selectedRatio.desc}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {ASPECT_RATIO_PRESETS.map((ratioOpt) => {
          const isSelected = selectedRatio.id === ratioOpt.id;
          return (
            <button
              key={ratioOpt.id}
              type="button"
              onClick={() => onSelectRatio(ratioOpt)}
              className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                isSelected
                  ? "border-[#111111] bg-[#111111] text-white shadow-xs"
                  : "border-[#EAEAE5] bg-white text-[#111111] hover:border-[#BEBDB9] hover:bg-[#FDFDF9]"
              }`}
            >
              <span
                className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 ${
                  isSelected ? "border-white/40 bg-white/10" : "border-[#111111]/30 bg-[#F5F4EE]"
                }`}
              >
                <span
                  className={`rounded-[1px] ${isSelected ? "bg-white" : "bg-[#111111]"}`}
                  style={{
                    width:
                      ratioOpt.id === "1:1"
                        ? "10px"
                        : ratioOpt.id === "9:16"
                        ? "6px"
                        : ratioOpt.id === "4:5"
                        ? "8px"
                        : ratioOpt.id === "16:9"
                        ? "14px"
                        : ratioOpt.id === "4:3"
                        ? "12px"
                        : "10px",
                    height:
                      ratioOpt.id === "1:1"
                        ? "10px"
                        : ratioOpt.id === "9:16"
                        ? "12px"
                        : ratioOpt.id === "4:5"
                        ? "11px"
                        : ratioOpt.id === "16:9"
                        ? "7px"
                        : ratioOpt.id === "4:3"
                        ? "9px"
                        : "10px",
                  }}
                />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight">{ratioOpt.name}</p>
                <p
                  className={`text-[10px] truncate ${
                    isSelected ? "text-white/70" : "text-[#9E9D98]"
                  }`}
                >
                  {ratioOpt.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
