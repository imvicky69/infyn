"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QRStyleConfig,
  DotType,
  CornerSquareType,
  CornerDotType,
  FrameType,
  QRPresetTheme,
} from "./types";
import {
  Sparkles,
  Upload,
  Trash2,
  Sliders,
  Palette,
  Layers,
  Square,
  Circle,
  Frame,
  ChevronDown,
} from "lucide-react";

interface StyleControlsProps {
  style: QRStyleConfig;
  onChange: (style: QRStyleConfig) => void;
}

const PRESET_THEMES: QRPresetTheme[] = [
  {
    id: "classic-ink",
    name: "Classic Ink",
    desc: "Default",
    dotType: "rounded",
    dotColor: "#111111",
    cornerSquareType: "extra-rounded",
    cornerSquareColor: "#111111",
    cornerDotType: "dot",
    cornerDotColor: "#111111",
    backgroundColor: "#FFFFFF",
    frameType: "none",
    frameText: "SCAN ME",
    frameColor: "#111111",
    frameTextColor: "#FFFFFF",
  },
  {
    id: "slate-minimal",
    name: "Minimal Slate",
    desc: "Clean Gray",
    dotType: "square",
    dotColor: "#334155",
    cornerSquareType: "square",
    cornerSquareColor: "#1E293B",
    cornerDotType: "square",
    cornerDotColor: "#334155",
    backgroundColor: "#FFFFFF",
    frameType: "none",
    frameText: "SCAN ME",
    frameColor: "#334155",
    frameTextColor: "#FFFFFF",
  },
  {
    id: "ocean-navy",
    name: "Ocean Navy",
    desc: "Subtle Blue",
    dotType: "classy-rounded",
    dotColor: "#1E3A8A",
    cornerSquareType: "extra-rounded",
    cornerSquareColor: "#1E3A8A",
    cornerDotType: "dot",
    cornerDotColor: "#2563EB",
    backgroundColor: "#FFFFFF",
    frameType: "none",
    frameText: "SCAN ME",
    frameColor: "#1E3A8A",
    frameTextColor: "#FFFFFF",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    desc: "Organic",
    dotType: "dots",
    dotColor: "#065F46",
    cornerSquareType: "extra-rounded",
    cornerSquareColor: "#064E3B",
    cornerDotType: "dot",
    cornerDotColor: "#059669",
    backgroundColor: "#FFFFFF",
    frameType: "none",
    frameText: "SCAN ME",
    frameColor: "#065F46",
    frameTextColor: "#FFFFFF",
  },
  {
    id: "polaroid-card",
    name: "Polaroid",
    desc: "Card Frame",
    dotType: "extra-rounded",
    dotColor: "#18181B",
    cornerSquareType: "extra-rounded",
    cornerSquareColor: "#18181B",
    cornerDotType: "dot",
    cornerDotColor: "#18181B",
    backgroundColor: "#FFFFFF",
    frameType: "polaroid",
    frameText: "Scan with your phone",
    frameColor: "#FFFFFF",
    frameTextColor: "#111111",
  },
];

const PRESET_ICONS = [
  { id: "infyn", label: "Infyn (Default)", url: "/logo-clear.png" },
  { id: "wifi", label: "Wi-Fi", url: "https://api.iconify.design/lucide:wifi.svg?color=%23111111" },
  { id: "whatsapp", label: "WhatsApp", url: "https://api.iconify.design/lucide:message-circle.svg?color=%2310b981" },
  { id: "instagram", label: "Instagram", url: "https://api.iconify.design/lucide:instagram.svg?color=%23e1306c" },
  { id: "youtube", label: "YouTube", url: "https://api.iconify.design/lucide:youtube.svg?color=%23ef4444" },
  { id: "github", label: "GitHub", url: "https://api.iconify.design/lucide:github.svg?color=%23111111" },
  { id: "linkedin", label: "LinkedIn", url: "https://api.iconify.design/lucide:linkedin.svg?color=%230a66c2" },
  { id: "email", label: "Email", url: "https://api.iconify.design/lucide:mail.svg?color=%232563eb" },
  { id: "phone", label: "Phone", url: "https://api.iconify.design/lucide:phone.svg?color=%23059669" },
];


export function StyleControls({ style, onChange }: StyleControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Accordion state: all collapsed by default to keep the editor clean & minimal
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const applyPreset = (preset: QRPresetTheme) => {
    onChange({
      ...style,
      dotType: preset.dotType,
      dotColor: preset.dotColor,
      cornerSquareType: preset.cornerSquareType,
      cornerSquareColor: preset.cornerSquareColor,
      cornerDotType: preset.cornerDotType,
      cornerDotColor: preset.cornerDotColor,
      backgroundColor: preset.backgroundColor,
      frameType: preset.frameType,
      frameText: preset.frameText,
      frameColor: preset.frameColor,
      frameTextColor: preset.frameTextColor,
      gradient: preset.gradient || {
        enabled: false,
        type: "linear",
        rotation: 0,
        color1: preset.dotColor,
        color2: preset.dotColor,
      },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        ...style,
        logoUrl: reader.result as string,
        errorCorrectionLevel: "H",
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-4 min-w-0 w-full">
      {/* ── Quick Style Presets Bar (Minimal & Clean) ─────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#111111]" />
            <span>Quick Themes</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {PRESET_THEMES.map((theme) => {
            const isSelected =
              style.dotColor === theme.dotColor &&
              style.frameType === theme.frameType &&
              style.dotType === theme.dotType;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => applyPreset(theme)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#111111] text-white border-[#111111] shadow-2xs"
                    : "bg-white text-[#6E6D68] border-[#EAEAE5] hover:text-[#111111] hover:bg-[#FBFBFA]"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 border border-black/10"
                  style={{ backgroundColor: theme.dotColor }}
                />
                <span>{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Collapsible Customization Drawers (All Optional) ──────── */}
      <div className="space-y-2 pt-2 border-t border-[#F5F4EE]">
        {/* 1. Colors & Background Drawer */}
        <div className="rounded-2xl border border-[#EAEAE5] bg-[#FBFBFA] overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("colors")}
            className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-[#F5F4EE] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Palette className="h-4 w-4 text-[#6E6D68]" />
              <span className="text-xs font-bold text-[#111111]">Colors & Background</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#9E9D98] uppercase">
                {style.gradient.enabled ? "Gradient" : style.dotColor}
              </span>
              <motion.div
                animate={{ rotate: openSection === "colors" ? 180 : 0 }}
                transition={{ duration: 0.15 }}
                className="text-[#9E9D98]"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {openSection === "colors" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <div className="px-4 pb-4 pt-2 border-t border-[#EAEAE5] bg-white space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#6E6D68]">Color Mode</span>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#111111] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={style.gradient.enabled}
                        onChange={(e) =>
                          onChange({
                            ...style,
                            gradient: { ...style.gradient, enabled: e.target.checked },
                          })
                        }
                        className="accent-[#111111]"
                      />
                      <span>Enable Gradient</span>
                    </label>
                  </div>

                  {!style.gradient.enabled ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#6E6D68] mb-1">QR Color</label>
                        <div className="flex items-center gap-2 bg-[#FBFBFA] border border-[#EAEAE5] rounded-xl p-1.5">
                          <input
                            type="color"
                            value={style.dotColor}
                            onChange={(e) => onChange({ ...style, dotColor: e.target.value })}
                            className="h-6 w-6 rounded cursor-pointer border-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={style.dotColor}
                            onChange={(e) => onChange({ ...style, dotColor: e.target.value })}
                            className="w-full text-xs font-mono font-semibold uppercase bg-transparent focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#6E6D68] mb-1">Background</label>
                        <div className="flex items-center gap-2 bg-[#FBFBFA] border border-[#EAEAE5] rounded-xl p-1.5">
                          <input
                            type="color"
                            disabled={style.transparentBackground}
                            value={style.backgroundColor}
                            onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
                            className="h-6 w-6 rounded cursor-pointer border-0 bg-transparent disabled:opacity-25"
                          />
                          <label className="flex items-center gap-1 text-[11px] font-semibold text-[#111111] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={style.transparentBackground}
                              onChange={(e) =>
                                onChange({ ...style, transparentBackground: e.target.checked })
                              }
                              className="accent-[#111111]"
                            />
                            <span>Transparent</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 bg-[#F8F8F6] p-3 rounded-xl border border-[#EAEAE5]">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-[#6E6D68] mb-1">Start Color</label>
                          <div className="flex items-center gap-1.5 bg-white border border-[#EAEAE5] rounded-lg p-1">
                            <input
                              type="color"
                              value={style.gradient.color1}
                              onChange={(e) =>
                                onChange({
                                  ...style,
                                  gradient: { ...style.gradient, color1: e.target.value },
                                })
                              }
                              className="h-6 w-6 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.gradient.color1}
                              onChange={(e) =>
                                onChange({
                                  ...style,
                                  gradient: { ...style.gradient, color1: e.target.value },
                                })
                              }
                              className="w-full text-[11px] font-mono focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#6E6D68] mb-1">End Color</label>
                          <div className="flex items-center gap-1.5 bg-white border border-[#EAEAE5] rounded-lg p-1">
                            <input
                              type="color"
                              value={style.gradient.color2}
                              onChange={(e) =>
                                onChange({
                                  ...style,
                                  gradient: { ...style.gradient, color2: e.target.value },
                                })
                              }
                              className="h-6 w-6 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.gradient.color2}
                              onChange={(e) =>
                                onChange({
                                  ...style,
                                  gradient: { ...style.gradient, color2: e.target.value },
                                })
                              }
                              className="w-full text-[11px] font-mono focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-semibold text-[#6E6D68] mb-1">
                          <span>Gradient Rotation</span>
                          <span>{style.gradient.rotation}°</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={style.gradient.rotation}
                          onChange={(e) =>
                            onChange({
                              ...style,
                              gradient: { ...style.gradient, rotation: Number(e.target.value) },
                            })
                          }
                          className="w-full h-1.5 accent-[#111111]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Shapes & Eye Markers Drawer */}
        <div className="rounded-2xl border border-[#EAEAE5] bg-[#FBFBFA] overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("shapes")}
            className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-[#F5F4EE] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="h-4 w-4 text-[#6E6D68]" />
              <span className="text-xs font-bold text-[#111111]">Shapes & Eye Markers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#9E9D98] capitalize">{style.dotType}</span>
              <motion.div
                animate={{ rotate: openSection === "shapes" ? 180 : 0 }}
                transition={{ duration: 0.15 }}
                className="text-[#9E9D98]"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {openSection === "shapes" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <div className="px-4 pb-4 pt-2 border-t border-[#EAEAE5] bg-white space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6E6D68] mb-1.5">
                      Dot Matrix Pattern
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "square", label: "Square" },
                        { id: "rounded", label: "Rounded" },
                        { id: "dots", label: "Dots" },
                        { id: "classy", label: "Classy" },
                        { id: "classy-rounded", label: "Smooth" },
                        { id: "extra-rounded", label: "Extra Round" },
                      ].map((dot) => (
                        <button
                          key={dot.id}
                          type="button"
                          onClick={() => onChange({ ...style, dotType: dot.id as DotType })}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            style.dotType === dot.id
                              ? "bg-[#111111] text-white border-[#111111]"
                              : "bg-[#FBFBFA] text-[#111111] border-[#EAEAE5] hover:bg-[#F5F4EE]"
                          }`}
                        >
                          {dot.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#F5F4EE]">
                    <div>
                      <label className="block text-[11px] text-[#6E6D68] mb-1 font-semibold">Eye Frame</label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: "square", label: "Square" },
                          { id: "extra-rounded", label: "Round" },
                          { id: "dot", label: "Circle" },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => onChange({ ...style, cornerSquareType: c.id as CornerSquareType })}
                            className={`py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                              style.cornerSquareType === c.id
                                ? "bg-[#111111] text-white border-[#111111]"
                                : "bg-[#FBFBFA] text-[#6E6D68] border-[#EAEAE5] hover:text-[#111111]"
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#6E6D68] mb-1 font-semibold">Eye Ball Center</label>
                      <div className="grid grid-cols-2 gap-1">
                        {[
                          { id: "square", label: "Square" },
                          { id: "dot", label: "Circle" },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => onChange({ ...style, cornerDotType: c.id as CornerDotType })}
                            className={`py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                              style.cornerDotType === c.id
                                ? "bg-[#111111] text-white border-[#111111]"
                                : "bg-[#FBFBFA] text-[#6E6D68] border-[#EAEAE5] hover:text-[#111111]"
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Logo & Center Icon Drawer */}
        <div className="rounded-2xl border border-[#EAEAE5] bg-[#FBFBFA] overflow-hidden transition-all">
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection("logo")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleSection("logo");
              }
            }}
            className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-[#F5F4EE] transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <Circle className="h-4 w-4 text-[#6E6D68]" />
              <span className="text-xs font-bold text-[#111111]">Center Logo & Icon</span>
            </div>
            <div className="flex items-center gap-2">
              {!style.logoUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange({
                      ...style,
                      logoUrl: "/logo-clear.png",
                      errorCorrectionLevel: "H",
                    });
                  }}
                  className="text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                >
                  + Add Infyn Logo
                </button>
              )}
              <span className="text-[11px] text-[#9E9D98]">
                {style.logoUrl
                  ? style.logoUrl === "/logo-clear.png"
                    ? "Infyn Logo"
                    : "Logo Active"
                  : "None"}
              </span>
              <motion.div
                animate={{ rotate: openSection === "logo" ? 180 : 0 }}
                transition={{ duration: 0.15 }}
                className="text-[#9E9D98]"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {openSection === "logo" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <div className="px-4 pb-4 pt-2 border-t border-[#EAEAE5] bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#6E6D68] font-semibold">Select Icon Preset</span>
                    {style.logoUrl && (
                      <button
                        type="button"
                        onClick={() => onChange({ ...style, logoUrl: null })}
                        className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Remove Logo</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {PRESET_ICONS.map((icon) => (
                      <button
                        key={icon.id}
                        type="button"
                        onClick={() =>
                          onChange({
                            ...style,
                            logoUrl: icon.url,
                            errorCorrectionLevel: "H",
                          })
                        }
                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          style.logoUrl === icon.url
                            ? "bg-[#111111] text-white border-[#111111]"
                            : "bg-[#FBFBFA] text-[#111111] border-[#EAEAE5] hover:bg-[#F5F4EE]"
                        }`}
                      >
                        {icon.label}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-[#BEBDB9] bg-[#FBFBFA] text-xs font-bold text-[#111111] hover:bg-[#F5F4EE]"
                    >
                      <Upload className="h-3 w-3" />
                      <span>Upload Custom</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </div>

                  {style.logoUrl && (
                    <div className="grid grid-cols-2 gap-3 bg-[#F8F8F6] p-3 rounded-xl border border-[#EAEAE5]">
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-[#111111] mb-1">
                          <span>Logo Scale</span>
                          <span>{Math.round(style.logoSize * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.15"
                          max="0.32"
                          step="0.02"
                          value={style.logoSize}
                          onChange={(e) => onChange({ ...style, logoSize: Number(e.target.value) })}
                          className="w-full h-1.5 accent-[#111111]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-[#111111] mb-1">
                          <span>Logo Margin</span>
                          <span>{style.logoMargin}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="15"
                          value={style.logoMargin}
                          onChange={(e) => onChange({ ...style, logoMargin: Number(e.target.value) })}
                          className="w-full h-1.5 accent-[#111111]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Frames & Captions Drawer */}
        <div className="rounded-2xl border border-[#EAEAE5] bg-[#FBFBFA] overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("frames")}
            className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-[#F5F4EE] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Frame className="h-4 w-4 text-[#6E6D68]" />
              <span className="text-xs font-bold text-[#111111]">Frames & Captions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#9E9D98] capitalize">
                {style.frameType === "none" ? "No Frame" : style.frameType.replace(/-/g, " ")}
              </span>
              <motion.div
                animate={{ rotate: openSection === "frames" ? 180 : 0 }}
                transition={{ duration: 0.15 }}
                className="text-[#9E9D98]"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {openSection === "frames" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <div className="px-4 pb-4 pt-2 border-t border-[#EAEAE5] bg-white space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: "none", label: "No Frame" },
                      { id: "scan-me-bottom", label: "Scan Me Pill" },
                      { id: "polaroid", label: "Polaroid Card" },
                      { id: "pill-badge", label: "Container Badge" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => onChange({ ...style, frameType: f.id as FrameType })}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                          style.frameType === f.id
                            ? "bg-[#111111] text-white border-[#111111]"
                            : "bg-[#FBFBFA] text-[#111111] border-[#EAEAE5] hover:bg-[#F5F4EE]"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {style.frameType !== "none" && (
                    <div className="space-y-3 bg-[#F8F8F6] p-3 rounded-xl border border-[#EAEAE5] mt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[#6E6D68] mb-1">Caption Text</label>
                        <input
                          type="text"
                          value={style.frameText}
                          onChange={(e) => onChange({ ...style, frameText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#EAEAE5] bg-white text-xs font-bold text-[#111111] focus:outline-none focus:border-[#111111]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-[#6E6D68] mb-1">Frame Color</label>
                          <div className="flex items-center gap-1.5 bg-white border border-[#EAEAE5] rounded-lg p-1">
                            <input
                              type="color"
                              value={style.frameColor}
                              onChange={(e) => onChange({ ...style, frameColor: e.target.value })}
                              className="h-6 w-6 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.frameColor}
                              onChange={(e) => onChange({ ...style, frameColor: e.target.value })}
                              className="w-full text-[11px] font-mono focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#6E6D68] mb-1">Text Color</label>
                          <div className="flex items-center gap-1.5 bg-white border border-[#EAEAE5] rounded-lg p-1">
                            <input
                              type="color"
                              value={style.frameTextColor}
                              onChange={(e) => onChange({ ...style, frameTextColor: e.target.value })}
                              className="h-6 w-6 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={style.frameTextColor}
                              onChange={(e) => onChange({ ...style, frameTextColor: e.target.value })}
                              className="w-full text-[11px] font-mono focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. Advanced & Margins Drawer */}
        <div className="rounded-2xl border border-[#EAEAE5] bg-[#FBFBFA] overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("advanced")}
            className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-[#F5F4EE] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="h-4 w-4 text-[#6E6D68]" />
              <span className="text-xs font-bold text-[#111111]">Advanced & Margins</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#9E9D98]">{style.margin}px Quiet Zone</span>
              <motion.div
                animate={{ rotate: openSection === "advanced" ? 180 : 0 }}
                transition={{ duration: 0.15 }}
                className="text-[#9E9D98]"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {openSection === "advanced" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <div className="px-4 pb-4 pt-2 border-t border-[#EAEAE5] bg-white grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-[#111111] mb-1">
                      <span>Quiet Zone Margin</span>
                      <span>{style.margin}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="2"
                      value={style.margin}
                      onChange={(e) => onChange({ ...style, margin: Number(e.target.value) })}
                      className="w-full h-1.5 accent-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#111111] mb-1">Error Correction</label>
                    <select
                      value={style.errorCorrectionLevel}
                      onChange={(e) => onChange({ ...style, errorCorrectionLevel: e.target.value as any })}
                      className="w-full px-2 py-1.5 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] text-xs font-medium text-[#111111] focus:outline-none"
                    >
                      <option value="L">Low (7% recovery)</option>
                      <option value="M">Medium (15% recovery)</option>
                      <option value="Q">Quartile (25% recovery)</option>
                      <option value="H">High (30% recovery for Logos)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
