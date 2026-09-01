import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Universal Image Converter — HEIC, JPG, PNG, WebP, AVIF (No Uploads)",
  description:
    "100% Free & Ad-Free image converter running locally in your browser. Convert HEIC, PNG, JPG, WebP, and AVIF in bulk with instant ZIP download. Zero server uploads.",
  keywords: [
    "image converter",
    "heic to jpg",
    "png to webp",
    "jpg to webp",
    "webp to png",
    "avif to jpg",
    "convert heic online free",
    "batch image converter no upload",
    "client side image converter",
  ],
  alternates: {
    canonical: "https://infyn.software/image/converter",
  },
  openGraph: {
    title: "Free Universal Image Converter — Infyn",
    description:
      "Batch convert HEIC, JPG, PNG, WebP, and AVIF locally in your browser with zero quality loss and instant ZIP download.",
    url: "https://infyn.software/image/converter",
    siteName: "Infyn",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — Universal Image Converter",
  url: "https://infyn.software/image/converter",
  description:
    "100% Free client-side image converter supporting HEIC, PNG, JPG, WebP, and AVIF without cloud uploads.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All (Web Browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
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
