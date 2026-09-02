"use client";

import React, { useState } from "react";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { decryptPDF } from "cryptpdf";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { ProgressBar } from "@/components/image-tools/progress-bar";
import SplitText from "@/components/SplitText";
import { formatBytes } from "@/components/image-tools/utils";
import { AnimatedLogo } from "@/components/animatedLogo";

interface UnlockFileEntry {
  file: File;
  isEncrypted: boolean;
}

interface UnlockedFileResult {
  id: string;
  originalName: string;
  originalSize: number;
  decryptedBlob: Blob;
  outputFileName: string;
  status: "done" | "error";
  errorMessage?: string;
  isAlreadyUnlocked?: boolean;
}

export default function PdfUnlockerPage() {
  const [files, setFiles] = useState<UnlockFileEntry[]>([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [items, setItems] = useState<UnlockedFileResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFilesSelected = async (selected: File[]) => {
    if (selected.length === 0) return;
    setErrorMsg(null);

    const checkedEntries: UnlockFileEntry[] = await Promise.all(
      selected.map(async (file) => {
        try {
          const buffer = await file.arrayBuffer();
          const doc = await PDFDocument.load(new Uint8Array(buffer), {
            ignoreEncryption: true,
            updateMetadata: false,
          });
          const hasEncrypt = Boolean(doc.context.trailerInfo.Encrypt);
          return { file, isEncrypted: hasEncrypt };
        } catch {
          // If load throws PasswordException or fails, it is protected
          return { file, isEncrypted: true };
        }
      })
    );

    setFiles((prev) => [...prev, ...checkedEntries]);
  };

  const handleDecryptFiles = async () => {
    if (files.length === 0) return;

    const encryptedCount = files.filter((f) => f.isEncrypted).length;
    if (encryptedCount > 0 && !password.trim()) {
      setErrorMsg("Please enter the password to unlock the encrypted document(s).");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setItems([]);

    const total = files.length;
    const results: UnlockedFileResult[] = [];

    try {
      for (let i = 0; i < total; i++) {
        const item = files[i];
        const file = item.file;
        setProgressText(`Processing ${file.name}...`);
        setProgressValue(Math.round(((i) / total) * 100));

        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfBytes = new Uint8Array(arrayBuffer);

          // If the PDF is not encrypted, it is already unlocked
          if (!item.isEncrypted) {
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            results.push({
              id: `${file.name}-${Date.now()}-${i}`,
              originalName: file.name,
              originalSize: file.size,
              decryptedBlob: blob,
              outputFileName: file.name,
              status: "done",
              isAlreadyUnlocked: true,
            });
            continue;
          }

          // Decrypt encrypted PDF with cryptpdf
          const decryptedBytes = await decryptPDF(pdfBytes, password);

          // Create blob
          const blob = new Blob([decryptedBytes as any], { type: "application/pdf" });
          const baseName = file.name.replace(/\.[^.]+$/, "");
          const outputFileName = `${baseName}-unlocked.pdf`;

          results.push({
            id: `${file.name}-${Date.now()}-${i}`,
            originalName: file.name,
            originalSize: file.size,
            decryptedBlob: blob,
            outputFileName,
            status: "done",
          });
        } catch (err: any) {
          console.warn(`Decryption notice for ${file.name}:`, err?.message);
          let userMessage = err?.message || "Decryption failed";

          if (userMessage.includes("PDF is not encrypted")) {
            results.push({
              id: `${file.name}-${Date.now()}-${i}`,
              originalName: file.name,
              originalSize: file.size,
              decryptedBlob: new Blob([await file.arrayBuffer()], { type: "application/pdf" }),
              outputFileName: file.name,
              status: "done",
              isAlreadyUnlocked: true,
            });
            continue;
          }

          if (userMessage.includes("Wrong password")) {
            userMessage = "Incorrect password. Please verify and try again.";
          } else if (userMessage.includes("Unsupported encryption")) {
            userMessage = "Unsupported encryption type. Only AES-256 protected PDFs are currently supported.";
          }

          results.push({
            id: `${file.name}-${Date.now()}-${i}`,
            originalName: file.name,
            originalSize: file.size,
            decryptedBlob: new Blob(),
            outputFileName: "",
            status: "error",
            errorMessage: userMessage,
          });
        }
      }

      setProgressValue(100);
      setProgressText("Processing complete!");
      setItems(results);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setTimeout(() => setIsProcessing(false), 400);
    }
  };

  const handleDownloadAllZip = async () => {
    const successfulItems = items.filter((item) => item.status === "done");
    if (successfulItems.length === 0) return;

    if (successfulItems.length === 1) {
      const item = successfulItems[0];
      const a = document.createElement("a");
      a.href = URL.createObjectURL(item.decryptedBlob);
      a.download = item.outputFileName;
      a.click();
      return;
    }

    const zip = new JSZip();
    successfulItems.forEach((item) => {
      zip.file(item.outputFileName, item.decryptedBlob);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const downloadUrl = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `infyn-unlocked-pdfs-${successfulItems.length}.zip`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const resetAll = () => {
    setFiles([]);
    setItems([]);
    setPassword("");
    setErrorMsg(null);
  };

  const encryptedFilesCount = files.filter((f) => f.isEncrypted).length;
  const allFilesAlreadyUnlocked = files.length > 0 && encryptedFilesCount === 0;

  return (
    <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col justify-center">
        {/* Step 1: Upload */}
        {files.length === 0 && (
          <div
            className="flex-1 flex flex-col items-center justify-center py-12 gap-8"
            style={{ animation: "fade-in-up 0.4s ease-out" }}
          >
            <div className="text-center space-y-3">
              <SplitText
                text="Unlock PDF"
                className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-[#111111] dark:text-white"
                delay={35}
                duration={0.85}
                splitType="words, chars"
                tag="h1"
                textAlign="center"
              />
              <p className="text-sm text-[#6E6D68] dark:text-zinc-400 flex items-center justify-center gap-2 flex-wrap">
                <span>Remove passwords & restrictions</span>
                <span className="text-[#DDDDD8] dark:text-zinc-700">•</span>
                <span>Fast decryption</span>
                <span className="text-[#DDDDD8] dark:text-zinc-700">•</span>
                <span>100% Private in your browser</span>
              </p>
            </div>

            <div className="w-full max-w-xl">
              <DropZone
                multiple={true}
                accept="application/pdf"
                onFilesSelected={handleFilesSelected}
                title="Drop PDF files here"
                subtitle="or click to browse from device (batch supported)"
                formatsText="PDF documents only"
              />
            </div>

            <PrivacyBadges
              badges={[
                "100% In-browser",
                "100% Ad-Free",
                "Zero cloud uploads",
                "AES-256 Supported",
              ]}
            />
          </div>
        )}

        {/* Step 2: Enter Password & Process */}
        {files.length > 0 && !isProcessing && items.length === 0 && (
          <div
            className="max-w-2xl mx-auto w-full space-y-8"
            style={{ animation: "fade-in-up 0.3s ease-out" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EAEAE5] dark:border-zinc-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#111111] dark:text-white">Unlock Your Documents</h2>
                <p className="text-sm text-[#6E6D68] dark:text-zinc-400">
                  {allFilesAlreadyUnlocked
                    ? "Documents analyzed — no password required"
                    : "Enter the password to remove encryption"}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-900 text-xs font-bold text-[#6E6D68] dark:text-zinc-300 border border-[#EAEAE5] dark:border-zinc-800">
                {files.length} {files.length === 1 ? "File" : "Files"} Selected
              </span>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm font-semibold flex items-center gap-2">
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* All Unlocked Notice */}
            {allFilesAlreadyUnlocked && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-medium flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <span className="font-bold">No encryption detected:</span> These document(s) are already unlocked and can be opened without a password. You can proceed directly or export them.
                </div>
              </div>
            )}

            {/* File List Summary */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#111111] dark:text-white uppercase tracking-wider">
                Selected Documents
              </label>
              <div className="bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs divide-y divide-[#EAEAE5] dark:divide-zinc-800 max-h-60 overflow-y-auto">
                {files.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                        item.isEncrypted
                          ? "bg-rose-50 dark:bg-rose-950/50 text-rose-500 dark:text-rose-400"
                          : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                      }`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5c0 .8-.7 1.5-1.5 1.5H7v2H5.5V9H8c.8 0 1.5.7 1.5 1.5v1zm5 2c0 .8-.7 1.5-1.5 1.5h-2.5V9H13c.8 0 1.5.7 1.5 1.5v3zm4-3H17v1.5h1.5v1.5H17V17h-1.5V9h3v1.5zM7 10.5h1v1H7v-1zm6 0h1v3h-1v-3z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-[#111111] dark:text-white truncate max-w-[180px] sm:max-w-sm">
                        {item.file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      {item.isEncrypted ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                          🔒 Encrypted
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                          🔓 Already Unlocked
                        </span>
                      )}
                      <span className="text-xs text-[#9E9D98] dark:text-zinc-500">{formatBytes(item.file.size)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Password Input (only needed if at least one file is encrypted) */}
            {encryptedFilesCount > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#111111] dark:text-white uppercase tracking-wider">
                  Document Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter the password to unlock"
                    className="w-full h-12 pl-12 pr-12 rounded-xl bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-700 text-[#111111] dark:text-white font-semibold text-sm focus:outline-none focus:border-[#111111] dark:focus:border-zinc-500 focus:ring-1 focus:ring-[#111111] transition-all shadow-xs"
                  />
                  <div className="absolute left-4 top-0 bottom-0 flex items-center justify-center text-[#9E9D98] dark:text-zinc-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-0 bottom-0 flex items-center justify-center text-[#9E9D98] dark:text-zinc-500 hover:text-[#111111] dark:hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#EAEAE5] dark:border-zinc-800">
              <button
                onClick={resetAll}
                className="flex-1 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-700 text-[#111111] dark:text-zinc-200 font-bold text-sm hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDecryptFiles}
                className="flex-[2] h-12 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-bold text-sm hover:bg-[#262626] dark:hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                {allFilesAlreadyUnlocked ? "Process & Export" : "Unlock PDFs"}
              </button>
            </div>
            
            <PrivacyBadges badges={["Zero cloud uploads", "Local execution", "Instant removal"]} className="pt-4" />
          </div>
        )}

        {/* Step 3: Processing */}
        {isProcessing && (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-full max-w-md space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 shadow-xs text-center">
              <div className="relative flex items-center justify-center mx-auto py-2">
                <AnimatedLogo variant="loader" width={64} />
              </div>
              <h2 className="text-xl font-bold text-[#111111] dark:text-white">Decrypting Documents</h2>
              <ProgressBar value={progressValue} text={progressText} />
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {!isProcessing && items.length > 0 && (
          <div className="space-y-6" style={{ animation: "fade-in-up 0.3s ease-out" }}>
            
            {/* Batch Summary Bar */}
            <div className="rounded-2xl border border-[#111111] dark:border-zinc-800 bg-[#111111] dark:bg-zinc-900 text-white p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-md">
              <div className="space-y-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="text-sm font-bold text-white">
                    {items.filter(i => i.status === "done").length} {items.length === 1 ? "File" : "Files"} Ready
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Ready for Download
                  </span>
                </div>
                <p className="text-xs text-white/70">
                  These documents do not require a password to open.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 w-full md:w-auto">
                <button
                  onClick={resetAll}
                  className="h-10 px-4 rounded-xl border border-white/20 bg-white/10 text-xs font-semibold text-white hover:bg-white/20 active:scale-95 transition-all inline-flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Unlock More
                </button>
                <button
                  onClick={handleDownloadAllZip}
                  className="h-10 px-5 rounded-xl bg-white text-[#111111] text-xs font-bold hover:bg-[#F5F4EE] active:scale-95 transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {items.length === 1 ? "Download PDF" : "Download All (ZIP)"}
                </button>
              </div>
            </div>

            {/* File List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white px-1">
                Processed Files
              </h3>
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {item.status === "done" ? (
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                        item.isAlreadyUnlocked
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                          : "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                      }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#111111] dark:text-white truncate" title={item.originalName}>
                        {item.originalName}
                      </p>
                      {item.status === "error" ? (
                        <p className="text-xs font-semibold text-red-600 dark:text-red-400 truncate">{item.errorMessage}</p>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#6E6D68] dark:text-zinc-400">
                          <span>{formatBytes(item.originalSize)}</span>
                          <span className="text-[#DDDDD8] dark:text-zinc-700">•</span>
                          {item.isAlreadyUnlocked ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Already Unlocked (No password required)</span>
                          ) : (
                            <span className="text-blue-700 dark:text-blue-400 font-semibold">Password Removed</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {item.status === "done" && (
                    <button
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(item.decryptedBlob);
                        a.download = item.outputFileName;
                        a.click();
                      }}
                      className="h-8 px-4 rounded-xl border border-[#EAEAE5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-[#111111] dark:text-zinc-200 hover:bg-[#F5F4EE] dark:hover:bg-zinc-700 active:scale-95 transition-all shadow-2xs w-full sm:w-auto"
                    >
                      Download
                    </button>
                  )}
                </div>
              ))}
            </div>

            <PrivacyBadges badges={["100% In-browser", "Files never leave your device", "No watermarks", "Fast removal"]} className="pt-2" />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
