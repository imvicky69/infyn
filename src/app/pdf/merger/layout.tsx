import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Merger — Combine PDFs (No Uploads)",
  description:
    "100% Free & Ad-Free PDF Merger running locally in your browser. Combine and reorder multiple PDFs into a single document. Zero server uploads.",
  keywords: [
    "merge pdf",
    "combine pdf",
    "join pdf",
    "pdf merger tool",
    "client side pdf merger",
    "no upload pdf merger",
  ],
  alternates: {
    canonical: "https://infyn.software/pdf/merger",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — PDF Merger",
  url: "https://infyn.software/pdf/merger",
  applicationCategory: "BusinessApplication",
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
