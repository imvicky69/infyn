"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { DropZone } from "@/components/image-tools/dropzone";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { ProgressBar } from "@/components/image-tools/progress-bar";
import SplitText from "@/components/SplitText";
import { formatBytes } from "@/components/image-tools/utils";

interface PdfItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function PdfMergerPage() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Result state
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [mergedFileName, setMergedFileName] = useState<string>("");
  const [mergedSize, setMergedSize] = useState<number>(0);

  const handleFilesSelected = async (selected: File[]) => {
    if (selected.length === 0) return;
    
    for (const file of selected) {
      try {
        const buffer = await file.arrayBuffer();
        await PDFDocument.load(buffer, { updateMetadata: false });
      } catch (err: any) {
        if (err.message?.toLowerCase().includes("encrypted") || err.message?.toLowerCase().includes("password")) {
          setErrorMsg(`"${file.name}" is password-protected. Please use the PDF Unlocker tool first.`);
          return;
        }
      }
    }
    
    const newItems: PdfItem[] = selected.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
    }));
    
    setItems((prev) => [...prev, ...newItems]);
    setErrorMsg(null);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    
    setItems(newItems);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMergeFiles = async () => {
    if (items.length < 2) {
      setErrorMsg("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      setProgressText("Initializing merger...");
      setProgressValue(10);
      
      const mergedPdf = await PDFDocument.create();
      
      const total = items.length;
      for (let i = 0; i < total; i++) {
        const item = items[i];
        setProgressText(`Merging ${item.name}...`);
        setProgressValue(10 + Math.round(((i) / total) * 80));

        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      setProgressText("Finalizing document...");
      setProgressValue(95);

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      
      setMergedBlob(blob);
      setMergedSize(blob.size);
      setMergedFileName(`infyn-merged-${Date.now()}.pdf`);
      
      setProgressValue(100);
      setProgressText("Merge complete!");
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during merging.");
    } finally {
      setTimeout(() => setIsProcessing(false), 500); // Slight delay for visual smoothness
    }
  };

  const resetAll = () => {
    setItems([]);
    setMergedBlob(null);
    setMergedFileName("");
    setMergedSize(0);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen text-[#111111] flex flex-col font-sans">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col py-8">
        {/* Step 1: Upload Files */}
        {items.length === 0 && !isProcessing && !mergedBlob && (
          <div
            className="flex-1 flex flex-col items-center justify-center py-12 gap-8"
            style={{ animation: "fade-in-up 0.4s ease-out" }}
          >
            <div className="text-center space-y-3">
              <SplitText
                text="Merge PDFs"
                className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
                delay={35}
                duration={0.85}
                splitType="words, chars"
                tag="h1"
                textAlign="center"
              />
              <p className="text-sm text-[#6E6D68] flex items-center justify-center gap-2 flex-wrap">
                <span>Combine multiple PDFs</span>
                <span className="text-[#DDDDD8]">•</span>
                <span>Drag & Drop ordering</span>
                <span className="text-[#DDDDD8]">•</span>
                <span>100% Private in your browser</span>
              </p>
            </div>

            <div className="w-full max-w-xl">
              <DropZone
                multiple={true}
                accept="application/pdf"
                onFilesSelected={handleFilesSelected}
                title="Drop PDFs here to merge"
                subtitle="or click to browse from device"
                formatsText="PDF documents only"
              />
            </div>

            <PrivacyBadges
              badges={[
                "100% In-browser",
                "100% Ad-Free",
                "Zero cloud uploads",
                "Unlimited merges",
              ]}
            />
          </div>
        )}

        {/* Step 2: Reorder & Process */}
        {items.length > 0 && !isProcessing && !mergedBlob && (
          <div
            className="max-w-2xl mx-auto w-full space-y-8"
            style={{ animation: "fade-in-up 0.3s ease-out" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EAEAE5] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#111111]">Order Your Files</h2>
                <p className="text-sm text-[#6E6D68]">Drag items to reorder how they will be merged.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => document.getElementById('add-more-input')?.click()}
                  className="px-3 py-1.5 rounded-full bg-white text-xs font-bold text-[#111111] border border-[#EAEAE5] hover:bg-[#F5F4EE] shadow-xs transition-colors"
                >
                  + Add More
                </button>
                <input
                  id="add-more-input"
                  type="file"
                  multiple
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFilesSelected(Array.from(e.target.files));
                    }
                    e.target.value = "";
                  }}
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {errorMsg}
              </div>
            )}

            {/* Draggable List */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable-pdf-list">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-white border border-[#EAEAE5] rounded-xl overflow-hidden shadow-xs divide-y divide-[#EAEAE5]"
                  >
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center justify-between p-3 px-4 bg-white ${
                              snapshot.isDragging ? "shadow-md z-50 ring-1 ring-[#111111]" : ""
                            }`}
                            style={provided.draggableProps.style}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                {...provided.dragHandleProps}
                                className="text-[#9E9D98] hover:text-[#111111] cursor-grab active:cursor-grabbing p-1"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                              </div>
                              <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5c0 .8-.7 1.5-1.5 1.5H7v2H5.5V9H8c.8 0 1.5.7 1.5 1.5v1zm5 2c0 .8-.7 1.5-1.5 1.5h-2.5V9H13c.8 0 1.5.7 1.5 1.5v3zm4-3H17v1.5h1.5v1.5H17V17h-1.5V9h3v1.5z" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex flex-col">
                                <span className="text-sm font-semibold text-[#111111] truncate max-w-[200px] sm:max-w-sm">
                                  {item.name}
                                </span>
                                <span className="text-xs text-[#9E9D98]">{formatBytes(item.size)}</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 text-[#9E9D98] hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                              title="Remove item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#EAEAE5]">
              <button
                onClick={resetAll}
                className="flex-1 h-12 rounded-xl bg-white border border-[#EAEAE5] text-[#111111] font-bold text-sm hover:bg-[#F5F4EE] active:scale-[0.98] transition-all shadow-xs"
              >
                Clear All
              </button>
              <button
                onClick={handleMergeFiles}
                disabled={items.length < 2}
                className={`flex-[2] h-12 rounded-xl font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
                  items.length < 2 
                    ? "bg-[#EAEAE5] text-[#9E9D98] cursor-not-allowed" 
                    : "bg-[#111111] text-white hover:bg-[#262626] active:scale-[0.98]"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Merge {items.length > 0 ? items.length : ""} PDFs
              </button>
            </div>
            
            <PrivacyBadges badges={["Zero cloud uploads", "Local execution", "Unlimited limits"]} className="pt-4" />
          </div>
        )}

        {/* Step 3: Processing */}
        {isProcessing && (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-3xl border border-[#EAEAE5] shadow-xs text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F5F4EE] border border-[#EAEAE5] flex items-center justify-center mx-auto mb-2 animate-pulse">
                <svg className="w-8 h-8 text-[#111111]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#111111]">Combining Documents</h2>
              <ProgressBar value={progressValue} text={progressText} />
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {!isProcessing && mergedBlob && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 gap-8" style={{ animation: "fade-in-up 0.3s ease-out" }}>
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-100 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-[#111111] tracking-tight">Merger Successful</h2>
              <p className="text-sm text-[#6E6D68]">Your documents have been seamlessly combined into one PDF.</p>
            </div>

            <div className="w-full max-w-md rounded-2xl border border-[#EAEAE5] bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#111111] truncate">{mergedFileName}</p>
                  <p className="text-xs text-[#6E6D68]">{formatBytes(mergedSize)} • {items.length} Files Merged</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(mergedBlob);
                    a.download = mergedFileName;
                    a.click();
                  }}
                  className="flex-1 h-12 rounded-xl bg-[#111111] text-white font-bold text-sm hover:bg-[#262626] active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download PDF
                </button>
                <button
                  onClick={resetAll}
                  className="h-12 px-6 rounded-xl bg-white border border-[#EAEAE5] text-[#111111] font-bold text-sm hover:bg-[#F5F4EE] active:scale-[0.98] transition-all shadow-xs"
                >
                  Merge More
                </button>
              </div>
            </div>

            <PrivacyBadges badges={["100% In-browser", "Files never leave your device", "No watermarks", "Free forever"]} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
