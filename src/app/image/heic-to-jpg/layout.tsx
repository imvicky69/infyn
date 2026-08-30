import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free HEIC to JPG Converter — Batch Convert iPhone Photos Online",
  description:
    "Convert Apple iPhone .HEIC and .HEIF photos to JPG or PNG in bulk for free. Runs 100% in your browser with WebAssembly libheif. No file size limits, zero cloud uploads, and 1-click ZIP export.",
  keywords: [
    "heic to jpg converter free",
    "convert heic to jpg batch online",
    "convert iphone photo to jpg free",
    "heic to png converter free",
    "iphone heic to jpeg converter",
    "batch heic converter zip",
    "libheif wasm online converter",
    "free heic converter without upload",
    "open heic file on windows free",
  ],
  alternates: {
    canonical: "https://infyn.indivio.in/image/heic-to-jpg",
  },
  openGraph: {
    title: "Free HEIC to JPG Converter — Convert iPhone Photos Locally",
    description:
      "Batch convert iPhone .HEIC photos to universal JPG or PNG format. 100% private in-browser WebAssembly conversion with instant ZIP download.",
    url: "https://infyn.indivio.in/image/heic-to-jpg",
    images: [{ url: "/logo-clear.png", width: 800, height: 800, alt: "Free HEIC to JPG Converter" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn by Indivio — Free HEIC to JPG Converter",
  url: "https://infyn.indivio.in/image/heic-to-jpg",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All (Web Browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online batch HEIC to JPG and PNG converter powered by WebAssembly. Transform Apple iPhone photos into universal formats privately on your device.",
  featureList: [
    "Batch HEIC and HEIF Conversion",
    "WASM-Powered In-Browser Decoding",
    "JPG, PNG, and WebP Output Formats",
    "1-Click All Photos ZIP Download",
    "Zero File Size Limits & 100% Private",
  ],
};

export default function HeicLayout({ children }: { children: React.ReactNode }) {
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
