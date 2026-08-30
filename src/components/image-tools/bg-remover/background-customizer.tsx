"use client";

import React, { useRef } from "react";

export type BackgroundMode = "transparent" | "color" | "gradient";

export interface ColorPreset {
  name: string;
  value: string;
}

export interface GradientPreset {
  id: string;
  name: string;
  css: string;
  kind: "linear" | "radial";
  stops: { offset: number; color: string }[];
  cx?: number;
  cy?: number;
}

export const SOLID_COLOR_PRESETS: ColorPreset[] = [
  { name: "White", value: "#FFFFFF" },
  { name: "Studio Cream", value: "#F5F4EE" },
  { name: "Warm Sand", value: "#E8E4D9" },
  { name: "Deep Ink", value: "#111111" },
  { name: "Charcoal", value: "#262626" },
  { name: "Slate", value: "#64748B" },
  { name: "Cool Gray", value: "#9CA3AF" },
  { name: "Cobalt", value: "#2563EB" },
  { name: "Sky", value: "#38BDF8" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Violet", value: "#8B5CF6" },
  { name: "Fuchsia", value: "#D946EF" },
  { name: "Coral", value: "#EF4444" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Emerald", value: "#10B981" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Pastel Rose", value: "#FFE4E6" },
  { name: "Pastel Butter", value: "#FEF9C3" },
  { name: "Pastel Mint", value: "#DCFCE7" },
  { name: "Pastel Sky", value: "#E0F2FE" },
  { name: "Pastel Lavender", value: "#F3E8FF" },
];

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    css: "linear-gradient(135deg, #FF6B6B 0%, #FFA07A 50%, #FFE66D 100%)",
    kind: "linear",
    stops: [
      { offset: 0, color: "#FF6B6B" },
      { offset: 0.5, color: "#FFA07A" },
      { offset: 1, color: "#FFE66D" },
    ],
  },
  {
    id: "cosmic-purple",
    name: "Cosmic Purple",
    css: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
    kind: "linear",
    stops: [
      { offset: 0, color: "#667EEA" },
      { offset: 1, color: "#764BA2" },
    ],
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    css: "linear-gradient(135deg, #2AF598 0%, #009EFD 100%)",
    kind: "linear",
    stops: [
      { offset: 0, color: "#2AF598" },
      { offset: 1, color: "#009EFD" },
    ],
  },
  {
    id: "studio-dark",
    name: "Studio Dark",
    css: "linear-gradient(135deg, #18181B 0%, #3F3F46 100%)",
    kind: "linear",
    stops: [
      { offset: 0, color: "#18181B" },
      { offset: 1, color: "#3F3F46" },
    ],
  },
  {
    id: "warm-clean",
    name: "Warm Clean",
    css: "linear-gradient(135deg, #FDFBFB 0%, #EBEDEE 100%)",
    kind: "linear",
    stops: [
      { offset: 0, color: "#FDFBFB" },
      { offset: 1, color: "#EBEDEE" },
    ],
  },
  {
    id: "pastel-dream",
    name: "Pastel Dream",
    css: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)",
    kind: "linear",
    stops: [
      { offset: 0, color: "#FF9A9E" },
      { offset: 1, color: "#FECFEF" },
    ],
  },
  {
    id: "aurora-emerald",
    name: "Aurora Emerald",
    css: "linear-gradient(135deg, #0BA360 0%, #3CBA92 100%)",
    kind: "linear",
    stops: [
      { offset: 0, color: "#0BA360" },
      { offset: 1, color: "#3CBA92" },
    ],
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon",
    css: "linear-gradient(135deg, #F72585 0%, #7209B7 50%, #4361EE 100%)",
    kind: "linear",
    stops: [
      { offset: 0, color: "#F72585" },
      { offset: 0.5, color: "#7209B7" },
      { offset: 1, color: "#4361EE" },
    ],
  },
  {
    id: "lavender-sky",
    name: "Lavender Sky",
    css: "linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)",
    kind: "linear",
    stops: [
      { offset: 0, color: "#E0C3FC" },
      { offset: 1, color: "#8EC5FC" },
    ],
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    css: "linear-gradient(135deg, #F6D365 0%, #FDA085 100%)",
    kind: "linear",
    stops: [
      { offset: 0, color: "#F6D365" },
      { offset: 1, color: "#FDA085" },
    ],
  },
  {
    id: "midnight-aura",
    name: "Midnight Aura",
    css: "radial-gradient(circle at 50% 40%, #312E81 0%, #09090B 100%)",
    kind: "radial",
    cx: 0.5,
    cy: 0.4,
    stops: [
      { offset: 0, color: "#312E81" },
      { offset: 1, color: "#09090B" },
    ],
  },
  {
    id: "studio-spotlight",
    name: "Studio Spotlight",
    css: "radial-gradient(circle at 50% 30%, #475569 0%, #0F172A 100%)",
    kind: "radial",
    cx: 0.5,
    cy: 0.3,
    stops: [
      { offset: 0, color: "#475569" },
      { offset: 1, color: "#0F172A" },
    ],
  },
];

export function BackgroundCustomizer({
  bgMode,
  onBgModeChange,
  selectedColor,
  onColorChange,
  customColor,
  onCustomColorChange,
  selectedGradient,
  onGradientChange,
  className = "",
}: {
  bgMode: BackgroundMode;
  onBgModeChange: (mode: BackgroundMode) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
  selectedGradient: GradientPreset;
  onGradientChange: (gradient: GradientPreset) => void;
  className?: string;
}) {
  const colorInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`rounded-2xl border border-[#EAEAE5] bg-white p-5 space-y-4 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
          Choose Background
        </span>

        {/* Mode Selector Tabs */}
        <div className="inline-flex rounded-xl bg-[#F5F4EE] p-1 border border-[#EAEAE5]">
          <button
            type="button"
            onClick={() => onBgModeChange("transparent")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              bgMode === "transparent"
                ? "bg-white text-[#111111] shadow-xs"
                : "text-[#6E6D68] hover:text-[#111111]"
            }`}
          >
            <span
              className="h-3 w-3 rounded-full border border-[#D5D5CF]"
              style={{
                backgroundImage: "repeating-conic-gradient(#CCC 0% 25%, #FFF 0% 50%)",
                backgroundSize: "6px 6px",
              }}
            />
            Transparent
          </button>

          <button
            type="button"
            onClick={() => onBgModeChange("color")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              bgMode === "color"
                ? "bg-white text-[#111111] shadow-xs"
                : "text-[#6E6D68] hover:text-[#111111]"
            }`}
          >
            <span className="h-3 w-3 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-indigo-500" />
            Solid Color
          </button>

          <button
            type="button"
            onClick={() => onBgModeChange("gradient")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              bgMode === "gradient"
                ? "bg-white text-[#111111] shadow-xs"
                : "text-[#6E6D68] hover:text-[#111111]"
            }`}
          >
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
            Gradient
          </button>
        </div>
      </div>

      {/* Transparent Info */}
      {bgMode === "transparent" && (
        <div className="pt-2 text-xs text-[#6E6D68] flex items-center justify-between">
          <span>Transparent background — clean PNG with full alpha transparency.</span>
          <span className="text-[11px] font-medium text-[#9E9D98]">Default</span>
        </div>
      )}

      {/* Solid Color Palette */}
      {bgMode === "color" && (
        <div className="space-y-3 pt-2" style={{ animation: "fade-in-up 0.2s ease-out" }}>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative group">
              <input
                ref={colorInputRef}
                type="color"
                value={customColor}
                onChange={(e) => onCustomColorChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                title="Pick custom color"
              />
              <button
                type="button"
                className={`h-8 px-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                  selectedColor === customColor
                    ? "border-[#111111] bg-[#F5F4EE] ring-2 ring-[#111111] ring-offset-2"
                    : "border-[#EAEAE5] bg-white hover:border-[#BEBDB9]"
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full border border-black/10 shadow-xs shrink-0"
                  style={{ backgroundColor: customColor }}
                />
                <span className="tabular-nums text-[#111111]">{customColor.toUpperCase()}</span>
                <svg className="h-3 w-3 text-[#6E6D68]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className="h-5 w-px bg-[#EAEAE5] mx-1 hidden sm:block" />

            {SOLID_COLOR_PRESETS.map((preset) => {
              const isSelected = selectedColor.toLowerCase() === preset.value.toLowerCase();
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onColorChange(preset.value)}
                  title={preset.name}
                  aria-label={preset.name}
                  className={`h-7 w-7 rounded-full border transition-all transform hover:scale-110 active:scale-95 ${
                    isSelected
                      ? "ring-2 ring-[#111111] ring-offset-2 scale-110 border-transparent shadow-sm"
                      : "border-black/15 hover:border-black/30"
                  }`}
                  style={{ backgroundColor: preset.value }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Gradients Palette */}
      {bgMode === "gradient" && (
        <div className="space-y-3 pt-2" style={{ animation: "fade-in-up 0.2s ease-out" }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {GRADIENT_PRESETS.map((preset) => {
              const isSelected = selectedGradient.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onGradientChange(preset)}
                  className={`group flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-[#111111] bg-[#F5F4EE] ring-2 ring-[#111111] ring-offset-2 shadow-xs"
                      : "border-[#EAEAE5] bg-white hover:border-[#BEBDB9] hover:bg-[#FDFDF9]"
                  }`}
                >
                  <span
                    className="h-6 w-6 rounded-lg shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                    style={{ background: preset.css }}
                  />
                  <span className="text-[11px] font-medium text-[#111111] truncate">
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
