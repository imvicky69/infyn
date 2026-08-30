"use client";

import React from "react";
import { CompressionSettings, OutputFormat, ResizeMode } from "./compression-engine";

interface CompressionTogglesProps {
  settings: CompressionSettings;
  onChange: (updated: Partial<CompressionSettings>) => void;
  onApplyToAll?: () => void;
  className?: string;
}

export function CompressionToggles({
  settings,
  onChange,
  className = "",
}: CompressionTogglesProps) {
  return (
    <div className={`rounded-2xl border border-[#EAEAE5] bg-white p-5 sm:p-6 space-y-6 shadow-sm ${className}`}>
      
      {/* ── Header: Mode Switcher ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAEAE5]">
        <div>
          <h3 className="text-sm font-bold text-[#111111] tracking-tight">Compression Settings</h3>
          <p className="text-xs text-[#9E9D98]">Tune quality, size limit, format & dimensions</p>
        </div>

        <div className="inline-flex rounded-xl bg-[#F5F4EE] p-1 border border-[#EAEAE5]">
          <button
            type="button"
            onClick={() => onChange({ mode: "quality" })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              settings.mode === "quality"
                ? "bg-white text-[#111111] shadow-xs"
                : "text-[#6E6D68] hover:text-[#111111]"
            }`}
          >
            Quality Mode
          </button>
          <button
            type="button"
            onClick={() => onChange({ mode: "target_size" })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              settings.mode === "target_size"
                ? "bg-white text-[#111111] shadow-xs"
                : "text-[#6E6D68] hover:text-[#111111]"
            }`}
          >
            Target Size Mode
          </button>
        </div>
      </div>

      {/* ── Mode 1: Quality Slider & Presets ─────────────────────────── */}
      {settings.mode === "quality" && (
        <div className="space-y-3" style={{ animation: "fade-in-up 0.2s ease-out" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#111111]">Image Quality</span>
            <span className="text-xs font-bold tabular-nums text-[#111111] px-2 py-0.5 rounded-md bg-[#F5F4EE] border border-[#EAEAE5]">
              {Math.round(settings.quality * 100)}%
            </span>
          </div>

          <input
            type="range"
            min="0.05"
            max="1.0"
            step="0.05"
            value={settings.quality}
            onChange={(e) => onChange({ quality: parseFloat(e.target.value) })}
            className="w-full accent-[#111111] h-2 bg-[#EAEAE5] rounded-lg cursor-pointer"
          />

          {/* Quick Quality Presets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { label: "Ultra (90%)", q: 0.9, desc: "Best visual fidelity" },
              { label: "Balanced (75%)", q: 0.75, desc: "Recommended for web" },
              { label: "Small (50%)", q: 0.5, desc: "For email & chat" },
              { label: "Aggressive (25%)", q: 0.25, desc: "Max size reduction" },
            ].map((p) => {
              const isActive = Math.abs(settings.quality - p.q) < 0.04;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onChange({ quality: p.q })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? "border-[#111111] bg-[#111111] text-white shadow-xs"
                      : "border-[#EAEAE5] bg-[#FBFBFA] text-[#111111] hover:border-[#BEBDB9] hover:bg-white"
                  }`}
                >
                  <p className="text-xs font-bold">{p.label}</p>
                  <p className={`text-[10px] truncate ${isActive ? "text-white/70" : "text-[#9E9D98]"}`}>
                    {p.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Mode 2: Target File Size Mode ────────────────────────────── */}
      {settings.mode === "target_size" && (
        <div className="space-y-3" style={{ animation: "fade-in-up 0.2s ease-out" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#111111]">Target Max File Size</span>
            <span className="text-xs font-bold tabular-nums text-[#111111] px-2 py-0.5 rounded-md bg-[#F5F4EE] border border-[#EAEAE5]">
              {settings.targetSizeKb >= 1000
                ? `${(settings.targetSizeKb / 1024).toFixed(1)} MB`
                : `${settings.targetSizeKb} KB`}
            </span>
          </div>

          <input
            type="range"
            min="20"
            max="2000"
            step="10"
            value={settings.targetSizeKb}
            onChange={(e) => onChange({ targetSizeKb: parseInt(e.target.value, 10) })}
            className="w-full accent-[#111111] h-2 bg-[#EAEAE5] rounded-lg cursor-pointer"
          />

          {/* Quick Target Presets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { label: "50 KB", size: 50, desc: "Thumbnails & icons" },
              { label: "200 KB", size: 200, desc: "Fast website speed" },
              { label: "500 KB", size: 500, desc: "Social & blog posts" },
              { label: "1.0 MB", size: 1000, desc: "High quality docs" },
            ].map((p) => {
              const isActive = settings.targetSizeKb === p.size;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onChange({ targetSizeKb: p.size })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? "border-[#111111] bg-[#111111] text-white shadow-xs"
                      : "border-[#EAEAE5] bg-[#FBFBFA] text-[#111111] hover:border-[#BEBDB9] hover:bg-white"
                  }`}
                >
                  <p className="text-xs font-bold">{p.label}</p>
                  <p className={`text-[10px] truncate ${isActive ? "text-white/70" : "text-[#9E9D98]"}`}>
                    {p.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Output Format & Resolution Limiters ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-[#EAEAE5]">
        
        {/* Output Format */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#111111]">
            Output Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "original", label: "Auto (Original)", desc: "Keep same format" },
              { id: "image/webp", label: "WebP", desc: "Best compression" },
              { id: "image/jpeg", label: "JPEG", desc: "Universal standard" },
              { id: "image/png", label: "PNG", desc: "Lossless / alpha" },
            ].map((fmt) => {
              const isSelected = settings.format === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => onChange({ format: fmt.id as OutputFormat })}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-[#111111] bg-[#111111] text-white shadow-xs"
                      : "border-[#EAEAE5] bg-white text-[#111111] hover:border-[#BEBDB9] hover:bg-[#FDFDF9]"
                  }`}
                >
                  <p className="text-xs font-bold">{fmt.label}</p>
                  <p className={`text-[10px] truncate ${isSelected ? "text-white/70" : "text-[#9E9D98]"}`}>
                    {fmt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Max Dimensions / Resolution */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#111111]">
            Resize / Max Dimensions
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "original", label: "Original Size", desc: "No resizing" },
              { id: "1080p", label: "1080p FHD", desc: "Max 1920px width/height" },
              { id: "720p", label: "720p HD", desc: "Max 1280px width/height" },
              { id: "scale_50", label: "50% Scale", desc: "Half dimensions" },
            ].map((res) => {
              const isSelected = settings.resizeMode === res.id;
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => onChange({ resizeMode: res.id as ResizeMode })}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-[#111111] bg-[#111111] text-white shadow-xs"
                      : "border-[#EAEAE5] bg-white text-[#111111] hover:border-[#BEBDB9] hover:bg-[#FDFDF9]"
                  }`}
                >
                  <p className="text-xs font-bold">{res.label}</p>
                  <p className={`text-[10px] truncate ${isSelected ? "text-white/70" : "text-[#9E9D98]"}`}>
                    {res.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
