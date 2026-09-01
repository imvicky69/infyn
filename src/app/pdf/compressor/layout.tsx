import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Compressor — Reduce PDF File Size Online (No Uploads)",
  description:
    "100% Free & Ad-Free PDF Compressor running locally in your browser. Reduce PDF file size up to 90%, compress to 200KB or 500KB, and batch export as ZIP with zero cloud uploads.",
  keywords: [
    "free pdf compressor",
    "compress pdf online free",
    "reduce pdf size in kb",
    "compress pdf to 200kb",
    "compress pdf to 500kb",
    "shrink pdf online",
    "pdf minifier",
    "batch pdf compressor",
    "private pdf compression no upload",
    "ad free pdf compressor",
    "compress pdf without losing quality",
    "offline pdf compressor",
    "client side pdf compressor",
  ],
  alternates: {
    canonical: "https://infyn.software/pdf/compressor",
  },
  openGraph: {
    title: "Free PDF Compressor — Reduce PDF File Size Online (No Uploads)",
    description:
      "Compress PDF documents up to 90% in your browser. 100% private, zero cloud uploads, target size mode (200KB/500KB), and 1-Click batch ZIP export.",
    url: "https://infyn.software/pdf/compressor",
    images: [{ url: "/logo-clear.png", width: 800, height: 800, alt: "Free In-Browser PDF Compressor" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — Free In-Browser PDF Compressor",
  url: "https://infyn.software/pdf/compressor",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All (Web Browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "High-speed client-side PDF compressor and minifier. Reduce PDF size with presets, custom DPI quality sliders, or target file size limits without server uploads.",
  featureList: [
    "100% On-Device In-Browser Compression",
    "Batch PDF Compression (50+ documents)",
    "Target File Size Mode (e.g. <200 KB, <500 KB, <1 MB)",
    "Interactive Split Before/After Page Comparator",
    "Extreme, Recommended, High Quality & Lossless Presets",
    "1-Click Batch ZIP Export",
    "Zero Cloud Uploads & Zero Watermarks",
  ],
};

export default function PdfCompressorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
