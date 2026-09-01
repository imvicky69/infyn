"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { QRStyleConfig } from "./types";
import {
  buildQrCodeStylingOptions,
  renderFramedCanvas,
  downloadCanvasAsPng,
  copyCanvasToClipboard,
  prepareCircularLogo,
} from "./qr-engine";
import {
  Download,
  Copy,
  Check,
  FileCode,
  FileText,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface QrPreviewProps {
  dataString: string;
  style: QRStyleConfig;
}

export function QrPreview({ dataString, style }: QrPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qrCodeInstanceRef = useRef<any>(null);

  const [copied, setCopied] = useState(false);
  const [downloadSize, setDownloadSize] = useState<number>(1024);
  const [isExporting, setIsExporting] = useState(false);

  // Initialize and update QR code
  const updateQR = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      const QRCodeStyling = (await import("qr-code-styling")).default;

      let processedStyle = style;
      if (style.logoUrl) {
        const circularLogo = await prepareCircularLogo(style.logoUrl, 300);
        processedStyle = { ...style, logoUrl: circularLogo };
      }

      const options = buildQrCodeStylingOptions(dataString, processedStyle, 480);

      if (!qrCodeInstanceRef.current) {
        qrCodeInstanceRef.current = new QRCodeStyling(options);
      } else {
        qrCodeInstanceRef.current.update(options);
      }

      // Generate raw canvas
      const rawBlob = (await qrCodeInstanceRef.current.getRawData("png")) as Blob | null;
      if (!rawBlob) return;

      const img = new Image();
      const url = URL.createObjectURL(rawBlob);

      img.onload = async () => {
        const rawCanvas = document.createElement("canvas");
        rawCanvas.width = img.naturalWidth;
        rawCanvas.height = img.naturalHeight;
        const ctx = rawCanvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        // Apply frame on display canvas
        const framedCanvas = await renderFramedCanvas(rawCanvas, processedStyle, 480);

        if (displayCanvasRef.current) {
          displayCanvasRef.current.width = framedCanvas.width;
          displayCanvasRef.current.height = framedCanvas.height;
          const displayCtx = displayCanvasRef.current.getContext("2d")!;
          displayCtx.clearRect(0, 0, framedCanvas.width, framedCanvas.height);
          displayCtx.drawImage(framedCanvas, 0, 0);
        }

        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (err) {
      console.error("QR Code rendering error:", err);
    }
  }, [dataString, style]);

  useEffect(() => {
    updateQR();
  }, [updateQR]);

  // Export high resolution PNG
  const handleDownloadPng = async () => {
    setIsExporting(true);
    try {
      const QRCodeStyling = (await import("qr-code-styling")).default;

      let processedStyle = style;
      if (style.logoUrl) {
        const circularLogo = await prepareCircularLogo(style.logoUrl, downloadSize);
        processedStyle = { ...style, logoUrl: circularLogo };
      }

      const options = buildQrCodeStylingOptions(dataString, processedStyle, downloadSize);
      const instance = new QRCodeStyling(options);

      const rawBlob = (await instance.getRawData("png")) as Blob | null;
      if (!rawBlob) return;

      const img = new Image();
      const url = URL.createObjectURL(rawBlob);

      img.onload = async () => {
        const rawCanvas = document.createElement("canvas");
        rawCanvas.width = img.naturalWidth;
        rawCanvas.height = img.naturalHeight;
        const ctx = rawCanvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        const framedCanvas = await renderFramedCanvas(rawCanvas, processedStyle, downloadSize);
        downloadCanvasAsPng(framedCanvas, `infyn-qrcode-${downloadSize}px.png`);
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (err) {
      console.error("PNG export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Export SVG vector
  const handleDownloadSvg = async () => {
    try {
      const QRCodeStyling = (await import("qr-code-styling")).default;

      let processedStyle = style;
      if (style.logoUrl) {
        const circularLogo = await prepareCircularLogo(style.logoUrl, 1024);
        processedStyle = { ...style, logoUrl: circularLogo };
      }

      const options = buildQrCodeStylingOptions(dataString, processedStyle, 1024);
      options.type = "svg";
      const instance = new QRCodeStyling(options);
      await instance.download({ name: "infyn-qrcode", extension: "svg" });
    } catch (err) {
      console.error("SVG export error:", err);
    }
  };



  // Export printable PDF
  const handleDownloadPdf = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      if (displayCanvasRef.current) {
        const imgData = displayCanvasRef.current.toDataURL("image/png");
        // Center on A4 page
        const pageWidth = 210;
        const pageHeight = 297;
        const qrSize = 120;
        const x = (pageWidth - qrSize) / 2;
        const y = (pageHeight - qrSize) / 2 - 10;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Infyn QR Code", pageWidth / 2, y - 15, { align: "center" });

        doc.addImage(imgData, "PNG", x, y, qrSize, qrSize);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Scan using your phone camera", pageWidth / 2, y + qrSize + 15, { align: "center" });

        doc.save("infyn-qrcode.pdf");
      }
    } catch (err) {
      console.error("PDF export error:", err);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!displayCanvasRef.current) return;
    const ok = await copyCanvasToClipboard(displayCanvasRef.current);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="space-y-4 lg:sticky lg:top-20 self-start min-w-0 w-full">
      {/* ── Main Preview Card ────────────────────────────────────── */}


      <div className="rounded-3xl border border-[#EAEAE5] bg-white p-6 flex flex-col items-center gap-5 shadow-2xs">
        <div className="flex items-center justify-between w-full border-b border-[#F5F4EE] pb-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">
              Live Preview
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>100% Scannable</span>
          </div>
        </div>

        {/* Live Canvas Area with Checkerboard Background Support */}
        <div
          ref={containerRef}
          className={`relative w-full max-w-[280px] sm:max-w-[300px] aspect-square p-3 sm:p-4 rounded-2xl flex items-center justify-center overflow-hidden shadow-xs border border-[#EAEAE5] ${
            style.transparentBackground
              ? "bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px]"
              : "bg-[#F8F8F6]"
          }`}
        >
          <canvas
            ref={displayCanvasRef}
            className="w-full h-full object-contain rounded-lg transition-transform duration-200"
          />
        </div>


        {/* Resolution selector */}
        <div className="w-full flex items-center justify-between pt-1 text-xs">
          <span className="text-[11px] font-bold text-[#6E6D68]">Export Resolution</span>
          <div className="inline-flex rounded-xl bg-[#F5F4EE] p-1 border border-[#EAEAE5]">
            {[
              { size: 1024, label: "1K" },
              { size: 2048, label: "2K HD" },
              { size: 4000, label: "4K Print" },
            ].map((res) => (
              <button
                key={res.size}
                type="button"
                onClick={() => setDownloadSize(res.size)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  downloadSize === res.size
                    ? "bg-white text-[#111111] shadow-2xs"
                    : "text-[#6E6D68] hover:text-[#111111]"
                }`}
              >
                {res.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Download Button */}
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isExporting}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#111111] text-white text-sm font-bold hover:bg-[#262626] active:scale-[0.98] transition-all shadow-sm cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Download PNG ({downloadSize}×{downloadSize}px)</span>
        </button>

        {/* Secondary Export Options */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <button
            type="button"
            onClick={handleDownloadSvg}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] hover:bg-[#F5F4EE] text-xs font-bold text-[#111111] transition-all cursor-pointer"
            title="Scalable Vector Graphics for print and design"
          >
            <FileCode className="h-3.5 w-3.5 text-[#6E6D68]" />
            <span>SVG</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] hover:bg-[#F5F4EE] text-xs font-bold text-[#111111] transition-all cursor-pointer"
            title="Print-ready PDF document"
          >
            <FileText className="h-3.5 w-3.5 text-[#6E6D68]" />
            <span>PDF</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-[#EAEAE5] bg-[#FBFBFA] hover:bg-[#F5F4EE] text-xs font-bold text-[#111111] transition-all cursor-pointer"
            title="Copy image to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-[#6E6D68]" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="rounded-2xl border border-[#EAEAE5] bg-white p-4 space-y-2 text-xs text-[#6E6D68]">
        <div className="flex items-center gap-2 font-bold text-[#111111]">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>High-Resolution & Infinite Vector</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          SVG vector export guarantees 100% loss-free sharpness at any size for business cards, billboards, menus, and posters.
        </p>
      </div>
    </div>
  );
}
