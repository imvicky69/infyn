import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Image to PDF Converter — Batch Images, Reorder & Custom Sizes (No Uploads)",
  description:
    "100% Free & Ad-Free Image to PDF converter running locally in your browser. Upload multiple images, drag to reorder, choose page size (A4, Letter, A5, Legal), set margins, and download your PDF instantly. Zero server uploads.",
  keywords: [
    "image to pdf",
    "free image to pdf converter",
    "jpg to pdf",
    "png to pdf",
    "batch image to pdf",
    "no upload image to pdf",
    "client side pdf converter",
    "offline image to pdf",
    "convert images to pdf free",
  ],
  alternates: { canonical: "https://infyn.software/image/img-to-pdf" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — Image to PDF Converter",
  url: "https://infyn.software/image/img-to-pdf",
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
