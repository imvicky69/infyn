import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Image Metadata & EXIF Remover — Strip GPS, Camera & Date (No Uploads)",
  description:
    "100% Free & Private EXIF Remover. Strip GPS location coordinates, camera models, dates, and sensitive metadata from JPG, PNG, and WebP photos in your browser. Zero cloud uploads.",
  keywords: [
    "exif remover",
    "remove metadata from photo",
    "strip gps location from image",
    "remove photo metadata online free",
    "clear image exif data",
    "private exif cleaner no upload",
    "photo privacy cleaner client side",
    "remove camera info from photo",
    "batch exif remover zip",
    "infyn by indivio exif remover",
  ],
  alternates: {
    canonical: "https://infyn.indivio.in/image/exif-remover",
  },
  openGraph: {
    title: "Free Image Metadata & EXIF Remover — Infyn by Indivio",
    description:
      "Strip GPS location, camera details, timestamps, and hidden metadata from photos privately in your browser with zero server uploads.",
    url: "https://infyn.indivio.in/image/exif-remover",
    siteName: "Infyn by Indivio",
    type: "website",
    images: [{ url: "/logo-clear.png", width: 800, height: 800, alt: "Free Image Metadata Remover" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn by Indivio — Image Metadata & EXIF Remover",
  url: "https://infyn.indivio.in/image/exif-remover",
  description:
    "100% Free client-side EXIF and image metadata remover. Strip GPS location, camera parameters, and timestamps without cloud uploads.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All (Web Browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "GPS Location & Coordinates Stripping",
    "Camera Make & Model Removal",
    "Timestamp & Capture Date Sanitization",
    "Lossless JPEG Metadata Cleaner",
    "Batch Multi-Photo Sanitization & ZIP Export",
    "100% In-Browser Privacy (Zero Server Uploads)",
  ],
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
