import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Splitter & Extractor — Separate PDF Pages (No Uploads)",
  description:
    "100% Free & Ad-Free PDF Splitter running locally in your browser. Extract selected pages or split your PDF into multiple single-page documents. Zero server uploads.",
  keywords: [
    "split pdf",
    "extract pdf pages",
    "pdf page remover",
    "pdf splitter tool",
    "client side pdf splitter",
    "no upload pdf splitter",
  ],
  alternates: {
    canonical: "https://infyn.software/pdf/splitter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — PDF Splitter",
  url: "https://infyn.software/pdf/splitter",
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
