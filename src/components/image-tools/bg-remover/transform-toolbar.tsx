"use client";

import React from "react";

export function TransformToolbar({
  scale,
  onScaleChange,
  flipH,
  onToggleFlip,
  onSnapBottom,
  onReset,
  hasTransformChanges,
  className = "",
}: {
  scale: number;
  onScaleChange: (newScale: number) => void;
  flipH: boolean;
  onToggleFlip: () => void;
  onSnapBottom: () => void;
  onReset: () => void;
  hasTransformChanges: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#EAEAE5] bg-white p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs ${className}`}
    >
      {/* Zoom / Scale Slider */}
      <div className="flex items-center gap-3 min-w-[220px]">
        <span className="text-xs font-semibold text-[#111111] shrink-0">Scale</span>
        <button
          type="button"
          onClick={() => onScaleChange(Math.max(0.2, Number((scale - 0.1).toFixed(2))))}
          className="h-7 w-7 rounded-lg border border-[#EAEAE5] bg-[#F8F8F6] text-xs font-bold hover:bg-[#EAEAE5] active:scale-95 transition-all flex items-center justify-center text-[#111111]"
          title="Zoom Out"
        >
          −
        </button>
        <input
          type="range"
          min="0.3"
          max="2.5"
          step="0.05"
          value={scale}
          onChange={(e) => onScaleChange(parseFloat(e.target.value))}
          className="flex-1 accent-[#111111] h-1.5 bg-[#EAEAE5] rounded-lg cursor-pointer"
        />
        <button
          type="button"
          onClick={() => onScaleChange(Math.min(3, Number((scale + 0.1).toFixed(2))))}
          className="h-7 w-7 rounded-lg border border-[#EAEAE5] bg-[#F8F8F6] text-xs font-bold hover:bg-[#EAEAE5] active:scale-95 transition-all flex items-center justify-center text-[#111111]"
          title="Zoom In"
        >
          +
        </button>
        <span className="text-xs font-semibold tabular-nums text-[#6E6D68] w-12 text-right">
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* Alignment / Preset Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleFlip}
          className={`h-8 px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
            flipH
              ? "border-[#111111] bg-[#111111] text-white"
              : "border-[#EAEAE5] bg-white text-[#111111] hover:bg-[#F5F4EE]"
          }`}
          title="Flip subject horizontally"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>Flip</span>
        </button>

        <button
          type="button"
          onClick={onSnapBottom}
          className="h-8 px-3 rounded-xl border border-[#EAEAE5] bg-white text-xs font-semibold text-[#111111] hover:bg-[#F5F4EE] active:scale-95 transition-all inline-flex items-center gap-1.5"
          title="Align subject to bottom"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span>Snap Bottom</span>
        </button>

        {hasTransformChanges && (
          <button
            type="button"
            onClick={onReset}
            className="h-8 px-3 rounded-xl border border-[#EAEAE5] bg-[#F5F4EE] text-xs font-semibold text-[#111111] hover:bg-[#EAEAE5] active:scale-95 transition-all inline-flex items-center gap-1"
            title="Reset position and size"
          >
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
