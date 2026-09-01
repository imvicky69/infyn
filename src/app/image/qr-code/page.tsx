"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { ProgressBar } from "@/components/image-tools/progress-bar";
import SplitText from "@/components/SplitText";
import {
  QRDataType,
  QRStyleConfig,
  QRWiFiData,
  QRVCardData,
  QREmailData,
  QRSmsData,
  QRUpiData,
  QRSocialData,
} from "@/components/image-tools/qr-code/types";
import {
  formatQRData,
  buildQrCodeStylingOptions,
} from "@/components/image-tools/qr-code/qr-engine";
import { DataForms } from "@/components/image-tools/qr-code/data-forms";
import { StyleControls } from "@/components/image-tools/qr-code/style-controls";
import { QrPreview } from "@/components/image-tools/qr-code/qr-preview";
import {
  QrCode,
  Layers,
  Sparkles,
  Download,
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet,
  Zap,
} from "lucide-react";

const FAQS = [
  {
    q: "Can I add my business logo without breaking the QR code?",
    a: "Yes! Infyn automatically upgrades the error correction level to High (H - 30% recovery) whenever a logo or central icon is added. This ensures scanning apps can decode 100% of the data even when the center is covered by your branding.",
  },
  {
    q: "Is this QR code generator completely free with no expiration or scan limits?",
    a: "Yes, 100%. Infyn generates standard static QR codes directly inside your web browser. There are no redirects, no subscriptions, no accounts, and your codes will never expire or be throttled.",
  },
  {
    q: "What is the difference between PNG and SVG vector export?",
    a: "PNG is a raster image ideal for websites, social media, and digital menus. SVG is an infinitely scalable vector format, which graphic designers and commercial print shops use for massive banners, billboards, and product packaging without pixelation.",
  },
  {
    q: "How does the Wi-Fi QR code work for guests and customers?",
    a: "When customers or guests point their phone camera at a Wi-Fi QR code, their phone automatically prompts them to 'Join Network' without needing to manually find the SSID or type a complex password.",
  },
  {
    q: "Are my generated QR codes tracked or stored on your servers?",
    a: "Zero tracking. All QR matrix math and graphic rendering happens locally in your device's browser memory. Your confidential Wi-Fi passwords, contact cards, and URLs never touch remote servers.",
  },
];

export default function QrCodePage() {
  const [activeTab, setActiveTab] = useState<"single" | "batch">("single");

  // Single mode data states
  const [dataType, setDataType] = useState<QRDataType>("url");
  const [url, setUrl] = useState("https://infyn.software");
  const [text, setText] = useState("Hello from Infyn!");
  const [wifi, setWifi] = useState<QRWiFiData>({
    ssid: "Home_WiFi",
    password: "SecretPassword123",
    encryption: "WPA",
    hidden: false,
  });
  const [vcard, setVcard] = useState<QRVCardData>({
    firstName: "Alex",
    lastName: "Morgan",
    organization: "Infyn Software",
    title: "Founder & Lead Architect",
    phone: "+1 (555) 019-2834",
    email: "alex@infyn.software",
    website: "https://infyn.software",
    address: "San Francisco, CA",
    note: "Crafted with Infyn QR Studio",
  });
  const [email, setEmail] = useState<QREmailData>({
    email: "hello@infyn.software",
    subject: "Inquiry from Infyn QR Code",
    body: "Hi! I scanned your QR code and wanted to connect.",
  });
  const [phone, setPhone] = useState("+1 (555) 019-2834");
  const [sms, setSms] = useState<QRSmsData>({
    phone: "+1 (555) 019-2834",
    message: "Hi! I scanned your QR code and would like more information.",
  });
  const [upi, setUpi] = useState<QRUpiData>({
    upiId: "merchant@okhdfcbank",
    name: "Infyn Merchant",
    amount: "500",
    note: "Order Payment",
  });
  const [social, setSocial] = useState<QRSocialData>({
    platform: "instagram",
    handle: "infyn.software",
  });

  // Single mode styling state
  const [style, setStyle] = useState<QRStyleConfig>({
    dotType: "rounded",
    dotColor: "#111111",
    gradient: {
      enabled: false,
      type: "linear",
      rotation: 45,
      color1: "#4F46E5",
      color2: "#06B6D4",
    },
    backgroundColor: "#FFFFFF",
    transparentBackground: false,
    cornerSquareType: "extra-rounded",
    cornerSquareColor: "#111111",
    cornerDotType: "dot",
    cornerDotColor: "#111111",
    customEyeColors: false,
    logoUrl: null,
    logoSize: 0.22,
    logoMargin: 6,
    logoBackgroundCircle: true,
    frameType: "none",
    frameText: "SCAN ME",
    frameColor: "#111111",
    frameTextColor: "#FFFFFF",
    errorCorrectionLevel: "M",
    margin: 20,
    size: 1024,
  });


  // Batch mode state
  const [batchInput, setBatchInput] = useState(
    "https://infyn.software/image/bg-remover\nhttps://infyn.software/image/compressor\nhttps://infyn.software/pdf/compressor\nhttps://infyn.software/pdf/merger"
  );
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchProgressText, setBatchProgressText] = useState("");

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Formatted data string for single mode
  const dataString = useMemo(() => {
    return formatQRData(dataType, {
      url,
      text,
      wifi,
      vcard,
      email,
      phone,
      sms,
      upi,
      social,
    });
  }, [dataType, url, text, wifi, vcard, email, phone, sms, upi, social]);

  // Batch runner
  const handleRunBatch = async () => {
    const lines = batchInput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    setIsBatchProcessing(true);
    setBatchProgress(5);
    setBatchProgressText("Initializing batch generator…");

    try {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      let batchStyle = style;
      if (style.logoUrl) {
        const { prepareCircularLogo } = await import("@/components/image-tools/qr-code/qr-engine");
        const circularLogo = await prepareCircularLogo(style.logoUrl, 1024);
        batchStyle = { ...style, logoUrl: circularLogo };
      }

      for (let i = 0; i < lines.length; i++) {
        const itemText = lines[i];
        setBatchProgressText(`Rendering QR ${i + 1} of ${lines.length}…`);
        setBatchProgress(Math.round(((i + 1) / lines.length) * 90));

        const options = buildQrCodeStylingOptions(itemText, batchStyle, 1024);
        const instance = new QRCodeStyling(options);

        const blob = await instance.getRawData("png");
        if (blob) {
          const safeName = itemText
            .replace(/^https?:\/\//i, "")
            .replace(/[^a-zA-Z0-9_-]/g, "_")
            .slice(0, 30);
          zip.file(`qr-${i + 1}-${safeName}.png`, blob);
        }
      }

      setBatchProgressText("Generating ZIP archive…");
      setBatchProgress(95);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `infyn-batch-qrcodes-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(downloadUrl);

      setBatchProgress(100);
      setBatchProgressText("Download complete!");
    } catch (err) {
      console.error("Batch QR generation failed:", err);
    } finally {
      setTimeout(() => setIsBatchProcessing(false), 600);
    }
  };

  return (
    <div className="min-h-screen text-[#111111] flex flex-col font-sans selection:bg-[#E8E6DE] selection:text-black overflow-x-clip w-full">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col py-8 space-y-10 min-w-0">
        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-11 w-11 rounded-[14px] bg-gradient-to-br from-indigo-100 to-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-700 shadow-2xs shrink-0">
              <QrCode className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-[-0.025em] truncate">
                QR Code Generator
              </h1>
              <p className="text-[12px] text-[#9E9D98] tracking-[-0.005em] truncate">
                Custom shapes · Central logos · Wi-Fi & vCard · 4K PNG & Vector SVG Export
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex rounded-2xl bg-[#F5F4EE] p-1 border border-[#EAEAE5] self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("single")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "single"
                  ? "bg-white text-[#111111] shadow-2xs"
                  : "text-[#6E6D68] hover:text-[#111111]"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Studio Designer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("batch")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "batch"
                  ? "bg-white text-[#111111] shadow-2xs"
                  : "text-[#6E6D68] hover:text-[#111111]"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Batch Generator</span>
            </button>
          </div>
        </div>

        {/* ── Tab 1: Single Studio Designer ──────────────────────── */}
        {activeTab === "single" && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 items-start min-w-0 w-full">
            {/* LEFT: Controls (Data & Styling) */}
            <div className="space-y-6 min-w-0 w-full">
              {/* Step 1: Content Data */}
              <div className="rounded-3xl border border-[#EAEAE5] bg-white p-5 sm:p-6 space-y-4 shadow-2xs min-w-0">

                <div className="flex items-center justify-between border-b border-[#F5F4EE] pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
                      Step 1
                    </span>
                    <h3 className="text-base font-bold text-[#111111]">Enter QR Content</h3>
                  </div>
                </div>

                <DataForms
                  type={dataType}
                  onTypeChange={setDataType}
                  url={url}
                  onUrlChange={setUrl}
                  text={text}
                  onTextChange={setText}
                  wifi={wifi}
                  onWifiChange={setWifi}
                  vcard={vcard}
                  onVcardChange={setVcard}
                  email={email}
                  onEmailChange={setEmail}
                  phone={phone}
                  onPhoneChange={setPhone}
                  sms={sms}
                  onSmsChange={setSms}
                  upi={upi}
                  onUpiChange={setUpi}
                  social={social}
                  onSocialChange={setSocial}
                />
              </div>

              {/* Step 2: Styling Studio */}
              <div className="rounded-3xl border border-[#EAEAE5] bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#F5F4EE] pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
                      Step 2
                    </span>
                    <h3 className="text-base font-bold text-[#111111]">
                      Style & Customization <span className="text-xs font-normal text-[#9E9D98] ml-1">(Optional)</span>
                    </h3>
                  </div>
                </div>


                <StyleControls style={style} onChange={setStyle} />
              </div>
            </div>

            {/* RIGHT: Sticky Live Preview & Download */}
            <QrPreview dataString={dataString} style={style} />
          </div>
        )}

        {/* ── Tab 2: Batch Generator ─────────────────────────────── */}
        {activeTab === "batch" && (
          <div className="rounded-3xl border border-[#EAEAE5] bg-white p-6 sm:p-8 space-y-6 shadow-2xs max-w-3xl mx-auto w-full">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/80">
                <Zap className="h-3.5 w-3.5" />
                <span>Batch QR Creator</span>
              </div>
              <h2 className="text-xl font-bold text-[#111111]">Generate Multiple QR Codes</h2>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                Paste a list of URLs or text strings (one per line). Infyn will render all codes using your active designer style and package them into a single 1-Click ZIP file.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#111111]">URLs or Text (One per line)</label>
              <textarea
                rows={8}
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder="https://example.com/page-1&#10;https://example.com/page-2&#10;https://example.com/page-3"
                className="w-full p-4 rounded-2xl border border-[#EAEAE5] bg-[#FBFBFA] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111] shadow-2xs resize-none"
              />
              <p className="text-[11px] text-[#9E9D98]">
                {batchInput.split("\n").filter((l) => l.trim().length > 0).length} items detected
              </p>
            </div>

            {isBatchProcessing && (
              <div className="p-4 rounded-2xl bg-[#F8F8F6] border border-[#EAEAE5] space-y-3">
                <div className="flex justify-between text-xs font-bold text-[#111111]">
                  <span>{batchProgressText}</span>
                  <span>{batchProgress}%</span>
                </div>
                <ProgressBar value={batchProgress} text="" />
              </div>
            )}

            <button
              type="button"
              onClick={handleRunBatch}
              disabled={isBatchProcessing || !batchInput.trim()}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#111111] text-white text-sm font-bold hover:bg-[#262626] active:scale-[0.98] transition-all shadow-sm disabled:opacity-40 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Generate & Download All as ZIP</span>
            </button>
          </div>
        )}

        {/* ── SEO Section: QR Code Best Practices ─────────────────── */}
        <section className="rounded-3xl border border-[#EAEAE5] bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
              Design & Print Guide
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
              How to Create Scannable & High-Quality QR Codes
            </h2>
            <p className="text-xs text-[#6E6D68] leading-relaxed">
              QR codes are resilient two-dimensional matrix barcodes. Follow these professional design rules to ensure 100% scanning success across all iPhone and Android devices:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-2 p-4 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5]">
              <div className="h-8 w-8 rounded-xl bg-white border border-[#EAEAE5] flex items-center justify-center text-indigo-700 shadow-2xs">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#111111]">High Color Contrast</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                Always maintain high contrast between the dark QR dots and light background. Avoid dark-on-dark or light yellow combinations.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5]">
              <div className="h-8 w-8 rounded-xl bg-white border border-[#EAEAE5] flex items-center justify-center text-emerald-700 shadow-2xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#111111]">Error Correction for Logos</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                When adding your brand logo in the center, use Level H (30% recovery) so camera lenses can reconstruct any covered modules.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[#FBFBFA] border border-[#EAEAE5]">
              <div className="h-8 w-8 rounded-xl bg-white border border-[#EAEAE5] flex items-center justify-center text-rose-700 shadow-2xs">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-[#111111]">Vector SVG for Print</h3>
              <p className="text-xs text-[#6E6D68] leading-relaxed">
                For brochures, signs, or trade show banners, export in SVG format so the artwork scales infinitely with razor-sharp edges.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ Section ─────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="border-b border-[#EAEAE5] pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9D98]">
              Help & Support
            </span>
            <h2 className="text-lg font-bold text-[#111111] mt-0.5">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-[#EAEAE5] bg-white overflow-hidden shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FBFBFA] transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-[#111111]">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[#9E9D98] shrink-0"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-4 text-xs text-[#6E6D68] leading-relaxed border-t border-[#F5F4EE] pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Privacy Badges Footer Strip ─────────────────────────── */}
        <PrivacyBadges
          badges={[
            "100% In-browser",
            "Zero scan tracking",
            "No expiration dates",
            "Free forever with no watermarks",
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
