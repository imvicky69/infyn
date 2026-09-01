import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Password Protector — Encrypt PDFs (No Uploads)",
  description:
    "100% Free & Ad-Free PDF Password Protector running locally in your browser. Encrypt your PDFs with AES-256 passwords. Zero server uploads.",
  keywords: [
    "protect pdf",
    "password protect pdf",
    "encrypt pdf",
    "pdf password tool",
    "client side pdf encryption",
    "no upload pdf protector",
  ],
  alternates: {
    canonical: "https://infyn.software/pdf/protector",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — PDF Password Protector",
  url: "https://infyn.software/pdf/protector",
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
