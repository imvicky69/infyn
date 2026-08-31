import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF to Image Converter — Extract Pages as JPG, PNG & WebP (No Uploads)",
  description:
    "100% Free & Ad-Free PDF to Image converter running locally in your browser. Render PDF pages into high-resolution JPG, PNG, or WebP images up to 300 DPI. Batch 1-Click ZIP download. Zero server uploads.",
  keywords: [
    "pdf to image",
    "pdf to jpg",
    "pdf to png",
    "pdf to webp",
    "extract pdf pages to images",
    "convert pdf to image free",
    "offline pdf to image",
    "client side pdf converter",
    "batch pdf to image zip",
  ],
  alternates: { canonical: "https://infyn.software/pdf/pdf-to-image" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — PDF to Image Converter",
  url: "https://infyn.software/pdf/pdf-to-image",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All (Web Browser)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
