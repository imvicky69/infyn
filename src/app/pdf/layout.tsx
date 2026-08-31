import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Utilities Suite — Fast, In-Browser & Private (No Uploads)",
  description:
    "100% Free, Ad-Free and Private PDF tools running locally in your browser. Convert PDF to Image, Image to PDF, merge, split, and optimize documents without uploading files to remote servers.",
  keywords: [
    "pdf tools",
    "pdf utilities",
    "pdf to image",
    "image to pdf",
    "free pdf converter",
    "private pdf editor",
    "in-browser pdf tools",
    "offline pdf converter",
    "ad free pdf suite",
  ],
  alternates: { canonical: "https://infyn.software/pdf" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — PDF Utilities Suite",
  url: "https://infyn.software/pdf",
  applicationCategory: "BusinessApplication",
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
