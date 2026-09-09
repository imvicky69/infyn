"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { formatBytes } from "@/components/image-tools/utils";
import {
  processFileToBase64,
  decodeBase64ToBlob,
  EncodedAsset,
} from "@/lib/core/dev/base64";
import {
  Binary,
  Copy,
  Check,
  Download,
  Trash2,
  Code2,
  FileCode,
  Layers,
  Sparkles,
  ArrowRightLeft,
  FileText,
  FileCheck,
  Plus,
  RefreshCw,
} from "lucide-react";

type ActiveTab = "encode" | "decode";
type SnippetType =
  | "dataUri"
  | "cssBackground"
  | "htmlImg"
  | "cssFontFace"
  | "svgUtf8"
  | "jsExport"
  | "rawBase64";

export default function Base64StudioPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("encode");
  const [assets, setAssets] = useState<EncodedAsset[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSnippets, setActiveSnippets] = useState<Record<string, SnippetType>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Decode Tab State
  const [decodeInput, setDecodeInput] = useState("");
  const [decodedResult, setDecodedResult] = useState<{
    blob: Blob;
    mimeType: string;
    size: number;
    previewUrl: string;
  } | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const decodeTextareaId = useId();

  const handleFilesSelected = async (files: File[]) => {
    if (!files.length) return;
    setIsProcessing(true);
    try {
      const results: EncodedAsset[] = [];
      for (const file of files) {
        const item = await processFileToBase64(file);
        results.push(item);
      }
      setAssets((prev) => [...results, ...prev]);

      // Initialize default snippet selection for new assets
      setActiveSnippets((prev) => {
        const next = { ...prev };
        results.forEach((r) => {
          if (!next[r.id]) {
            next[r.id] = r.isFont ? "cssFontFace" : "dataUri";
          }
        });
        return next;
      });
    } catch (e) {
      console.error("Error processing files to base64", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === id ? null : curr));
    }, 2000);
  };

  const handleRemoveAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAll = () => {
    setAssets([]);
  };

  const handleDownloadAllJson = () => {
    if (!assets.length) return;
    const exportMap: Record<string, string> = {};
    assets.forEach((a) => {
      exportMap[a.name] = a.dataUri;
    });
    const blob = new Blob([JSON.stringify(exportMap, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "base64-assets.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDecode = () => {
    setDecodeError(null);
    if (!decodeInput.trim()) {
      setDecodedResult(null);
      return;
    }

    try {
      const result = decodeBase64ToBlob(decodeInput);
      setDecodedResult(result);
    } catch {
      setDecodeError(
        "Invalid Base64 or Data URI string. Please check the format and try again."
      );
      setDecodedResult(null);
    }
  };

  const handleDownloadDecoded = () => {
    if (!decodedResult) return;
    const ext = decodedResult.mimeType.split("/")[1] || "bin";
    const cleanExt = ext.replace("+xml", "");
    const filename = `decoded-asset.${cleanExt}`;

    const link = document.createElement("a");
    link.href = decodedResult.previewUrl;
    link.download = filename;
    link.click();
  };

  return (
    <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Header Section */}
        <div className="max-w-2xl mx-auto text-center space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <Binary className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Developer Studio · 100% In-Browser</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111111] dark:text-white leading-[1.15]">
            Base64 & Data URI Studio
          </h1>

          <p className="text-sm sm:text-base text-[#6E6D68] dark:text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed">
            Convert assets into production-ready Base64 and CSS data URI strings. 
            Zero cloud uploads, instant on-device generation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-[#F5F4EE] dark:bg-zinc-800/80 border border-[#EAEAE5] dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => setActiveTab("encode")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "encode"
                  ? "bg-white dark:bg-zinc-900 text-[#111111] dark:text-white shadow-2xs"
                  : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>Encode Assets</span>
              {assets.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#111111] text-white dark:bg-white dark:text-zinc-900 font-bold">
                  {assets.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("decode")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "decode"
                  ? "bg-white dark:bg-zinc-900 text-[#111111] dark:text-white shadow-2xs"
                  : "text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white"
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
              <span>Decode Base64</span>
            </button>
          </div>
        </div>

        {/* TAB 1: ENCODE ASSETS */}
        {activeTab === "encode" && (
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="bg-white dark:bg-[#141417] border border-[#EAEAE5] dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <DropZone
                multiple={true}
                accept="image/*,font/*,.woff,.woff2,.ttf,.otf,.svg,.pdf,audio/*"
                onFilesSelected={handleFilesSelected}
                title="Drop assets here to encode"
                subtitle="or click to browse from device"
                formatsText="PNG · JPG · WEBP · SVG · WOFF2 · TTF · MP3 · PDF"
                disabled={isProcessing}
              />
            </div>

            {/* Batch Action Toolbar */}
            {assets.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#141417] border border-[#EAEAE5] dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-[#111111] dark:text-white">
                    {assets.length} {assets.length === 1 ? "asset" : "assets"} ready
                  </span>
                  <span className="text-xs text-[#9E9D98]">·</span>
                  <span className="text-xs text-[#6E6D68] dark:text-zinc-400">
                    Total:{" "}
                    {formatBytes(
                      assets.reduce((acc, a) => acc + a.originalSize, 0)
                    )}{" "}
                    →{" "}
                    {formatBytes(assets.reduce((acc, a) => acc + a.base64Size, 0))}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDownloadAllJson}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all cursor-pointer shadow-2xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download All (JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-[#EAEAE5] dark:border-zinc-800 text-[#6E6D68] dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                    title="Clear list"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                </div>
              </div>
            )}

            {/* Asset Cards List */}
            {assets.length > 0 && (
              <div className="space-y-4">
                {assets.map((asset) => {
                  const currentSnippetType =
                    activeSnippets[asset.id] ||
                    (asset.isFont ? "cssFontFace" : "dataUri");
                  const currentSnippetText =
                    currentSnippetType === "dataUri"
                      ? asset.snippets.dataUri
                      : currentSnippetType === "cssBackground"
                      ? asset.snippets.cssBackground
                      : currentSnippetType === "htmlImg"
                      ? asset.snippets.htmlImg || asset.snippets.dataUri
                      : currentSnippetType === "cssFontFace"
                      ? asset.snippets.cssFontFace || asset.snippets.dataUri
                      : currentSnippetType === "svgUtf8"
                      ? asset.snippets.svgUtf8 || asset.snippets.dataUri
                      : currentSnippetType === "jsExport"
                      ? asset.snippets.jsExport
                      : asset.snippets.rawBase64;

                  const isCopied = copiedKey === `${asset.id}-${currentSnippetType}`;

                  return (
                    <div
                      key={asset.id}
                      className="bg-white dark:bg-[#141417] border border-[#EAEAE5] dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
                    >
                      {/* Asset Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F4EE] dark:border-zinc-800/80 pb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail / Icon preview */}
                          <div className="h-12 w-12 rounded-xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                            {asset.isImage || asset.isSvg ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={asset.previewUrl}
                                alt={asset.name}
                                className="h-full w-full object-contain"
                              />
                            ) : asset.isFont ? (
                              <span className="font-serif text-lg font-bold text-[#111111] dark:text-white">
                                Aa
                              </span>
                            ) : (
                              <FileCode className="h-6 w-6 text-[#9E9D98]" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h2 className="text-sm font-bold text-[#111111] dark:text-white truncate">
                              {asset.name}
                            </h2>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-mono text-[#9E9D98]">
                                {asset.mimeType}
                              </span>
                              <span className="text-[11px] text-[#9E9D98]">·</span>
                              <span className="text-[11px] font-medium text-[#6E6D68] dark:text-zinc-400">
                                {formatBytes(asset.originalSize)} →{" "}
                                {formatBytes(asset.base64Size)}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300">
                                +{asset.overheadPercentage}% size
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopySnippet(
                                `${asset.id}-${currentSnippetType}`,
                                currentSnippetText
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all cursor-pointer shadow-2xs"
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-600" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy Snippet</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveAsset(asset.id)}
                            className="p-2 rounded-xl text-[#9E9D98] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Remove asset"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Format selector chips */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveSnippets((p) => ({ ...p, [asset.id]: "dataUri" }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            currentSnippetType === "dataUri"
                              ? "bg-[#111111] text-white dark:bg-white dark:text-zinc-950"
                              : "bg-[#F5F4EE] dark:bg-zinc-800/60 text-[#6E6D68] dark:text-zinc-300 hover:text-[#111111] dark:hover:text-white"
                          }`}
                        >
                          Data URI
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveSnippets((p) => ({
                              ...p,
                              [asset.id]: "cssBackground",
                            }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            currentSnippetType === "cssBackground"
                              ? "bg-[#111111] text-white dark:bg-white dark:text-zinc-950"
                              : "bg-[#F5F4EE] dark:bg-zinc-800/60 text-[#6E6D68] dark:text-zinc-300 hover:text-[#111111] dark:hover:text-white"
                          }`}
                        >
                          CSS background-image
                        </button>

                        {asset.snippets.htmlImg && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveSnippets((p) => ({ ...p, [asset.id]: "htmlImg" }))
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              currentSnippetType === "htmlImg"
                                ? "bg-[#111111] text-white dark:bg-white dark:text-zinc-950"
                                : "bg-[#F5F4EE] dark:bg-zinc-800/60 text-[#6E6D68] dark:text-zinc-300 hover:text-[#111111] dark:hover:text-white"
                            }`}
                          >
                            HTML &lt;img&gt;
                          </button>
                        )}

                        {asset.snippets.cssFontFace && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveSnippets((p) => ({
                                ...p,
                                [asset.id]: "cssFontFace",
                              }))
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              currentSnippetType === "cssFontFace"
                                ? "bg-[#111111] text-white dark:bg-white dark:text-zinc-950"
                                : "bg-[#F5F4EE] dark:bg-zinc-800/60 text-[#6E6D68] dark:text-zinc-300 hover:text-[#111111] dark:hover:text-white"
                            }`}
                          >
                            CSS @font-face
                          </button>
                        )}

                        {asset.snippets.svgUtf8 && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveSnippets((p) => ({ ...p, [asset.id]: "svgUtf8" }))
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              currentSnippetType === "svgUtf8"
                                ? "bg-[#111111] text-white dark:bg-white dark:text-zinc-950"
                                : "bg-[#F5F4EE] dark:bg-zinc-800/60 text-[#6E6D68] dark:text-zinc-300 hover:text-[#111111] dark:hover:text-white"
                            }`}
                            title="Smaller URL-encoded SVG format for CSS"
                          >
                            SVG UTF-8 (Smaller)
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setActiveSnippets((p) => ({ ...p, [asset.id]: "jsExport" }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            currentSnippetType === "jsExport"
                              ? "bg-[#111111] text-white dark:bg-white dark:text-zinc-950"
                              : "bg-[#F5F4EE] dark:bg-zinc-800/60 text-[#6E6D68] dark:text-zinc-300 hover:text-[#111111] dark:hover:text-white"
                          }`}
                        >
                          JS / TS Export
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveSnippets((p) => ({
                              ...p,
                              [asset.id]: "rawBase64",
                            }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            currentSnippetType === "rawBase64"
                              ? "bg-[#111111] text-white dark:bg-white dark:text-zinc-950"
                              : "bg-[#F5F4EE] dark:bg-zinc-800/60 text-[#6E6D68] dark:text-zinc-300 hover:text-[#111111] dark:hover:text-white"
                          }`}
                        >
                          Raw Base64
                        </button>
                      </div>

                      {/* Code Block Preview */}
                      <div className="relative rounded-xl bg-[#111111] dark:bg-zinc-950 border border-[#27272A] p-3 text-xs font-mono text-zinc-300 overflow-x-auto max-h-36">
                        <pre className="whitespace-pre-wrap break-all select-all">
                          {currentSnippetText}
                        </pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DECODE BASE64 */}
        {activeTab === "decode" && (
          <div className="bg-white dark:bg-[#141417] border border-[#EAEAE5] dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="space-y-2">
              <label
                htmlFor={decodeTextareaId}
                className="text-xs font-bold uppercase tracking-wider text-[#9E9D98] dark:text-zinc-400"
              >
                Paste Base64 or Data URI String
              </label>
              <textarea
                id={decodeTextareaId}
                rows={6}
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="Paste data:image/png;base64,... or raw Base64 payload here..."
                className="w-full p-4 text-xs font-mono rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#FBFBFA] dark:bg-zinc-900 text-[#111111] dark:text-zinc-200 focus:outline-none focus:border-[#111111] dark:focus:border-zinc-400 transition-all resize-y"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDecode}
                disabled={!decodeInput.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#111111] text-white hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 disabled:opacity-40 transition-all cursor-pointer shadow-2xs"
              >
                <ArrowRightLeft className="h-4 w-4" />
                <span>Decode & Preview</span>
              </button>

              {decodeInput.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    setDecodeInput("");
                    setDecodedResult(null);
                    setDecodeError(null);
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold border border-[#EAEAE5] dark:border-zinc-800 text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Decode Error Message */}
            {decodeError && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-300">
                {decodeError}
              </div>
            )}

            {/* Decoded Result Preview */}
            {decodedResult && (
              <div className="p-5 rounded-2xl bg-[#FBFBFA] dark:bg-zinc-900/50 border border-[#EAEAE5] dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#111111] dark:text-white">
                      Decoded Asset Preview
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-[#9E9D98]">
                      <span>MIME: {decodedResult.mimeType}</span>
                      <span>·</span>
                      <span>Size: {formatBytes(decodedResult.size)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadDecoded}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black dark:bg-white dark:text-zinc-900 transition-all cursor-pointer shadow-2xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download File</span>
                  </button>
                </div>

                {/* Rendered Preview */}
                <div className="p-4 bg-white dark:bg-zinc-950 border border-[#EAEAE5] dark:border-zinc-800 rounded-xl flex items-center justify-center min-h-[160px] overflow-hidden">
                  {decodedResult.mimeType.startsWith("image/") ||
                  decodedResult.mimeType.includes("svg") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={decodedResult.previewUrl}
                      alt="Decoded asset"
                      className="max-h-64 max-w-full object-contain rounded-lg"
                    />
                  ) : decodedResult.mimeType.startsWith("audio/") ? (
                    <audio controls src={decodedResult.previewUrl} className="w-full" />
                  ) : (
                    <div className="text-center space-y-2 text-xs text-[#6E6D68] dark:text-zinc-400">
                      <FileCheck className="h-8 w-8 mx-auto text-emerald-600" />
                      <p className="font-semibold">
                        Asset decoded successfully ({decodedResult.mimeType})
                      </p>
                      <p className="text-[11px] text-[#9E9D98]">
                        Click &ldquo;Download File&rdquo; above to save to your device.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Developer Features / Education Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#141417] border border-[#EAEAE5] dark:border-zinc-800 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <Code2 className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-[#111111] dark:text-white">
              Zero Network Roundtrips
            </h3>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Inline critical icons, logos, and fonts directly into CSS or HTML to eliminate extra HTTP requests and layout shifts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#141417] border border-[#EAEAE5] dark:border-zinc-800 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-center text-indigo-700 dark:text-indigo-400">
              <Layers className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-[#111111] dark:text-white">
              Optimized SVG UTF-8
            </h3>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Get clean URL-encoded UTF-8 data URIs for SVGs that are up to 30% lighter than standard Base64 encoding.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#141417] border border-[#EAEAE5] dark:border-zinc-800 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-[#111111] dark:text-white">
              100% Client-Side Privacy
            </h3>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Proprietary graphics, confidential mockups, and client brand assets never leave your local browser sandbox.
            </p>
          </div>
        </div>

        {/* Privacy Badges */}
        <div className="pt-4">
          <PrivacyBadges
            badges={[
              "100% In-browser",
              "100% Ad-Free",
              "Zero cloud uploads",
              "Free & unlimited",
            ]}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
