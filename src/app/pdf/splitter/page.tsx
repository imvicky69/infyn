"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { ProgressBar } from "@/components/image-tools/progress-bar";
import SplitText from "@/components/SplitText";
import { formatBytes } from "@/components/image-tools/utils";

interface RenderedPage {
  pageNum: number;
  dataUrl: string;
  selected: boolean;
}

export default function PdfSplitterPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null);
  
  const [stage, setStage] = useState<"idle" | "busy" | "selection" | "done" | "error">("idle");
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  
  // Results
  const [resultMode, setResultMode] = useState<"extract" | "split" | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFileName, setResultFileName] = useState<string>("");
  const [resultSize, setResultSize] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Core PDF.js Rendering Function (Thumbnails) ── */
  const renderPdfPages = useCallback(async (buffer: ArrayBuffer) => {
    setStage("busy");
    setProgress(0);
    setProgressText("Initializing PDF engine…");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      setProgressText("Loading PDF document…");
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(buffer.slice(0)),
      });
      const pdf = await loadingTask.promise;


      const totalPages = pdf.numPages;
      if (totalPages === 0) {
        throw new Error("This PDF document contains no pages.");
      }

      const rendered: RenderedPage[] = [];
      
      // Limit to max 500 pages for memory safety during thumbnail gen
      const maxPages = Math.min(totalPages, 500);

      for (let i = 1; i <= maxPages; i++) {
        setProgressText(`Generating thumbnails (${i}/${maxPages})…`);
        setProgress(Math.round((i / maxPages) * 90));

        const page = await pdf.getPage(i);
        // Small scale for thumbnails
        const viewport = page.getViewport({ scale: 0.5 });

        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (!ctx) throw new Error("Could not initialize 2D canvas context");

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        // @ts-expect-error
        await page.render(renderContext).promise;

        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);

        rendered.push({
          pageNum: i,
          dataUrl,
          selected: true, // Default all selected
        });
        
        // Clean up memory
        page.cleanup();
      }

      setProgress(100);
      setProgressText("Loaded successfully!");
      setPages(rendered);
      setStage("selection");
    } catch (err: any) {
      console.error("PDF Render Error:", err);
      const isEncrypted = err?.name === "PasswordException" || err?.message?.toLowerCase().includes("password") || err?.message?.toLowerCase().includes("encrypt");
      setErrorMsg(
        isEncrypted
          ? "This PDF is password-protected. Please unlock it using the PDF Unlocker tool first."
          : (err instanceof Error ? err.message : "Could not decode or parse this PDF file.")
      );
      setStage("error");
    }
  }, []);

  /* ── Handle New PDF File ── */
  const handlePdfSelected = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;

      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setErrorMsg("Please select a valid .PDF document.");
        setStage("error");
        return;
      }

      setPdfFile(file);
      setErrorMsg("");
      try {
        const buffer = await file.arrayBuffer();
        setPdfArrayBuffer(buffer);
        
        // Check encryption via pdf-lib quickly first for better error
        try {
          await PDFDocument.load(buffer, { updateMetadata: false });
        } catch (err: any) {
          if (err.message?.toLowerCase().includes("encrypted") || err.message?.toLowerCase().includes("password")) {
            setErrorMsg(`"${file.name}" is password-protected. Please unlock it using the PDF Unlocker tool first.`);
            setStage("error");
            return;
          }
        }
        
        await renderPdfPages(buffer);
      } catch (err: any) {
        console.error(err);
        setErrorMsg("Failed to read the selected PDF file.");
        setStage("error");
      }
    },
    [renderPdfPages]
  );

  /* ── Selection Logic ── */
  const togglePageSelection = useCallback((pageNum: number) => {
    setPages((prev) =>
      prev.map((p) => (p.pageNum === pageNum ? { ...p, selected: !p.selected } : p))
    );
  }, []);

  const selectAllPages = useCallback((select: boolean) => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: select })));
  }, []);

  const resetAll = useCallback(() => {
    setStage("idle");
    setPdfFile(null);
    setPdfArrayBuffer(null);
    setPages([]);
    setProgress(0);
    setErrorMsg("");
    setResultBlob(null);
    setResultMode(null);
  }, []);

  /* ── Processing Logic ── */
  const handleProcess = async (mode: "extract" | "split") => {
    if (!pdfArrayBuffer || !pdfFile) return;
    
    const selectedPages = pages.filter(p => p.selected).map(p => p.pageNum - 1); // pdf-lib is 0-indexed
    if (selectedPages.length === 0) {
      alert("Please select at least one page.");
      return;
    }

    setStage("busy");
    setProgress(0);
    setProgressText(`Processing ${selectedPages.length} pages...`);

    try {
      const freshBuffer = await pdfFile.arrayBuffer();
      const originalPdf = await PDFDocument.load(freshBuffer);
      
      const baseName = pdfFile.name.replace(/\.[^.]+$/, "");


      if (mode === "extract") {
        setProgress(30);
        setProgressText("Extracting selected pages...");
        
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(originalPdf, selectedPages);
        copiedPages.forEach((page) => newPdf.addPage(page));
        
        setProgress(80);
        setProgressText("Saving new document...");
        
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
        
        setResultBlob(blob);
        setResultSize(blob.size);
        setResultFileName(`${baseName}-extracted.pdf`);
      } 
      else if (mode === "split") {
        setProgressText("Splitting into individual pages...");
        const zip = new JSZip();
        
        for (let i = 0; i < selectedPages.length; i++) {
          setProgress(Math.round((i / selectedPages.length) * 80));
          const pageIndex = selectedPages[i];
          
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(originalPdf, [pageIndex]);
          newPdf.addPage(copiedPage);
          
          const pdfBytes = await newPdf.save();
          // original page num is pageIndex + 1
          zip.file(`${baseName}-page-${pageIndex + 1}.pdf`, pdfBytes);
        }
        
        setProgressText("Zipping files...");
        setProgress(90);
        
        const zipBlob = await zip.generateAsync({ type: "blob" });
        setResultBlob(zipBlob);
        setResultSize(zipBlob.size);
        setResultFileName(`${baseName}-split.zip`);
      }

      setResultMode(mode);
      setProgress(100);
      setProgressText("Processing complete!");
      
      setTimeout(() => {
        setStage("done");
      }, 500);
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred while processing the PDF.");
      setStage("error");
    }
  };

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <div className="min-h-screen text-[#111111] flex flex-col font-sans">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col py-8">
        
        {/* Error State Overlay */}
        {stage === "error" && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-center max-w-md">
              <h2 className="text-xl font-bold text-[#111111] mb-2">Oops, something went wrong</h2>
              <p className="text-[#6E6D68] text-sm">{errorMsg}</p>
            </div>
            <button
              onClick={resetAll}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#111111] text-white font-bold text-sm hover:bg-[#262626] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Step 1: Upload Files */}
        {stage === "idle" && (
          <div
            className="flex-1 flex flex-col items-center justify-center py-12 gap-8"
            style={{ animation: "fade-in-up 0.4s ease-out" }}
          >
            <div className="text-center space-y-3">
              <SplitText
                text="Split & Extract PDF"
                className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
                delay={35}
                duration={0.85}
                splitType="words, chars"
                tag="h1"
                textAlign="center"
              />
              <p className="text-sm text-[#6E6D68] flex items-center justify-center gap-2 flex-wrap">
                <span>Separate PDF pages</span>
                <span className="text-[#DDDDD8]">•</span>
                <span>Extract specific sections</span>
                <span className="text-[#DDDDD8]">•</span>
                <span>100% Private in your browser</span>
              </p>
            </div>

            <div className="w-full max-w-xl">
              <DropZone
                multiple={false}
                accept="application/pdf"
                onFilesSelected={handlePdfSelected}
                title="Drop your PDF here"
                subtitle="or click to browse from device"
                formatsText="PDF documents only"
              />
            </div>

            <PrivacyBadges
              badges={[
                "100% In-browser",
                "100% Ad-Free",
                "Zero cloud uploads",
                "Free forever",
              ]}
            />
          </div>
        )}

        {/* Processing State */}
        {stage === "busy" && (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-3xl border border-[#EAEAE5] shadow-xs text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F5F4EE] border border-[#EAEAE5] flex items-center justify-center mx-auto mb-2 animate-pulse">
                <svg className="w-8 h-8 text-[#111111]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#111111]">Processing...</h2>
              <ProgressBar value={progress} text={progressText} />
            </div>
          </div>
        )}

        {/* Step 2: Selection Mode */}
        {stage === "selection" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Header & Controls */}
            <div className="sticky top-0 z-30 bg-[#FBFBFA]/90 backdrop-blur-md pt-4 pb-4 border-b border-[#EAEAE5] flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#111111] mb-1 truncate max-w-md" title={pdfFile?.name}>
                  {pdfFile?.name}
                </h2>
                <p className="text-sm font-medium text-[#6E6D68]">
                  Select the pages you want to extract or split.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => selectAllPages(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-[#EAEAE5] text-[#111111] hover:bg-[#F5F4EE] transition-colors shadow-xs"
                >
                  Select All
                </button>
                <button
                  onClick={() => selectAllPages(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-[#EAEAE5] text-[#6E6D68] hover:bg-[#F5F4EE] transition-colors shadow-xs"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-[#111111] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md sticky top-[100px] z-20">
              <div className="text-white font-medium text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {selectedCount}
                </span>
                {selectedCount === 1 ? "Page Selected" : "Pages Selected"}
              </div>
              
              <div className="flex w-full sm:w-auto items-center gap-3">
                <button
                  onClick={() => handleProcess("extract")}
                  disabled={selectedCount === 0}
                  className={`flex-1 sm:flex-none h-11 px-5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                    selectedCount === 0 
                      ? "bg-white/10 text-white/40 cursor-not-allowed" 
                      : "bg-white text-[#111111] hover:bg-gray-100 active:scale-95"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Extract to 1 PDF
                </button>
                <button
                  onClick={() => handleProcess("split")}
                  disabled={selectedCount === 0}
                  className={`flex-1 sm:flex-none h-11 px-5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                    selectedCount === 0 
                      ? "bg-white/10 text-white/40 cursor-not-allowed" 
                      : "bg-[#2A2A2A] text-white border border-white/20 hover:bg-[#333333] active:scale-95"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Split into ZIP
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pages.map((p) => (
                <div
                  key={p.pageNum}
                  onClick={() => togglePageSelection(p.pageNum)}
                  className={`relative group rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                    p.selected ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20 ring-offset-2" : "border-[#EAEAE5] hover:border-[#111111]/30"
                  }`}
                >
                  <div className="aspect-[1/1.4] bg-white relative">
                    <img src={p.dataUrl} alt={`Page ${p.pageNum}`} className="w-full h-full object-contain" />
                    
                    {/* Checkmark indicator */}
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      p.selected 
                        ? "bg-emerald-500 border-emerald-500 text-white scale-100" 
                        : "bg-white/80 border-[#EAEAE5] text-transparent scale-90 group-hover:scale-100 group-hover:border-[#111111]/30"
                    }`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    {/* Page Number Label */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-6 flex justify-center">
                      <span className="text-white font-bold text-xs shadow-black drop-shadow-md">
                        Page {p.pageNum}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Done */}
        {stage === "done" && resultBlob && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 gap-8" style={{ animation: "fade-in-up 0.3s ease-out" }}>
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-100 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-[#111111] tracking-tight">Success!</h2>
              <p className="text-sm text-[#6E6D68]">
                {resultMode === "extract" 
                  ? "Your selected pages have been extracted into a single PDF." 
                  : "Your selected pages have been split and zipped."}
              </p>
            </div>

            <div className="w-full max-w-md rounded-2xl border border-[#EAEAE5] bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                  resultMode === "extract" ? "bg-purple-50 border-purple-100 text-purple-600" : "bg-amber-50 border-amber-100 text-amber-600"
                }`}>
                  {resultMode === "extract" ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#111111] truncate" title={resultFileName}>{resultFileName}</p>
                  <p className="text-xs text-[#6E6D68]">{formatBytes(resultSize)} • {selectedCount} Pages</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(resultBlob);
                    a.download = resultFileName;
                    a.click();
                  }}
                  className="flex-1 h-12 rounded-xl bg-[#111111] text-white font-bold text-sm hover:bg-[#262626] active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download {resultMode === "extract" ? "PDF" : "ZIP"}
                </button>
                <button
                  onClick={resetAll}
                  className="h-12 px-6 rounded-xl bg-white border border-[#EAEAE5] text-[#111111] font-bold text-sm hover:bg-[#F5F4EE] active:scale-[0.98] transition-all shadow-xs"
                >
                  Split More
                </button>
              </div>
            </div>
            
            <PrivacyBadges badges={["100% In-browser", "Files never leave your device", "No watermarks"]} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
