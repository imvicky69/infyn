import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Image Compressor — Reduce Image Size up to 90% (Batch ZIP)",
  description:
    "Free, private batch image compressor. Reduce JPG, PNG, WebP, and HEIC file sizes up to 90% in your browser. Set quality sliders or exact target KB limits. Batch download as ZIP with zero uploads.",
  keywords: [
    "free image compressor",
    "compress image online free",
    "reduce image size in kb",
    "compress jpeg online free",
    "compress png without losing quality",
    "bulk image compressor zip",
    "target size image compressor 200kb 500kb",
    "private image compression in browser",
    "free photo size reducer no limits",
  ],
  alternates: {
    canonical: "https://infyn.software/image/compressor",
  },
  openGraph: {
    title: "Free Batch Image Compressor — Shrink Images up to 90%",
    description:
      "Compress dozens of images simultaneously in your browser. 100% private, no cloud uploads, target size mode, and batch ZIP export.",
    url: "https://infyn.software/image/compressor",
    images: [{ url: "/logo-clear.png", width: 800, height: 800, alt: "Free Batch Image Compressor" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — Free Image Compressor",
  url: "https://infyn.software/image/compressor",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All (Web Browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "High-speed browser-based batch image compressor and size reducer. Compress JPG, PNG, and WebP files with quality sliders or target file size limits.",
  featureList: [
    "Batch Image Compression (50+ photos)",
    "Target File Size Mode (KB/MB)",
    "Interactive Split Before/After Comparator",
    "WebP, JPG, and PNG Conversion",
    "1-Click Batch ZIP Export",
    "100% Client-Side Privacy",
  ],
};

export default function CompressorLayout({ children }: { children: React.ReactNode }) {
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
