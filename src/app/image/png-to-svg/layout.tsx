import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PNG to SVG Converter — Vectorize Images Online (No Uploads)",
  description:
    "100% Free & Ad-Free PNG to SVG vectorizer running locally in your browser. Powered by Potrace for crisp logos/monochrome and ImageTracer.js for vibrant colors. Infinite scalability, transparency preservation, and zero cloud uploads.",
  keywords: [
    "png to svg converter",
    "free image vectorizer",
    "png to vector svg online",
    "convert png to svg free",
    "potrace online",
    "imagetracer online",
    "vectorize logo to svg",
    "raster to vector converter",
    "client side image to svg",
    "ad free png to svg",
  ],
  alternates: {
    canonical: "https://infyn.software/image/png-to-svg",
  },
  openGraph: {
    title: "Free PNG to SVG Converter — Vectorize Images Online (No Uploads)",
    description:
      "Transform PNG, JPG, and WebP images into infinitely scalable SVG vector paths. 100% private, client-side, with Potrace and ImageTracer.js.",
    url: "https://infyn.software/image/png-to-svg",
    images: [{ url: "/logo-clear.png", width: 800, height: 800, alt: "PNG to SVG Converter" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — Free PNG to SVG Converter",
  url: "https://infyn.software/image/png-to-svg",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All (Web Browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "100% in-browser PNG to SVG vector graphic converter. Dual-engine tracing with Potrace for logos and ImageTracer.js for multi-color images.",
  featureList: [
    "Potrace Monochrome & Logo Vector Tracing",
    "ImageTracer.js Multi-Color Palette Vectorization",
    "Automatic Engine Selection",
    "Interactive Real-Time SVG Zoom & Pan Preview",
    "Raw SVG Code Inspection & Copy",
    "Batch File Vectorization & 1-Click ZIP Download",
    "100% Client-Side Privacy (Zero Uploads)",
  ],
};

export default function PngToSvgLayout({ children }: { children: React.ReactNode }) {
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
