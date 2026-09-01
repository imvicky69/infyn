import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Unlocker — Remove PDF Passwords (No Uploads)",
  description:
    "100% Free & Ad-Free PDF Unlocker running locally in your browser. Remove passwords and decrypt your PDFs instantly. Zero server uploads.",
  keywords: [
    "unlock pdf",
    "remove pdf password",
    "decrypt pdf",
    "pdf unlock tool",
    "client side pdf unlocker",
    "no upload pdf password remover",
  ],
  alternates: {
    canonical: "https://infyn.software/pdf/unlocker",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — PDF Unlocker",
  url: "https://infyn.software/pdf/unlocker",
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
