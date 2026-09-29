import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Instagram Profile Picture Downloader (HD DP Viewer) — Infyn",
  description:
    "Download full-size Instagram profile pictures (DP) in high definition directly in your browser. Simple HTML query, instant preview, zero login, and 100% free.",
  keywords: [
    "instagram profile picture downloader",
    "instagram dp downloader",
    "view instagram profile picture full size",
    "insta dp viewer",
    "download insta profile photo",
    "hd instagram profile picture",
    "instagram dp download online",
  ],
  alternates: {
    canonical: "https://infyn.software/instagram/profile-downloader",
  },
  openGraph: {
    title: "Free Instagram Profile Picture Downloader — Infyn",
    description:
      "View and download high-resolution Instagram profile pictures (DP) instantly in your browser. 100% free, no login needed.",
    url: "https://infyn.software/instagram/profile-downloader",
    siteName: "Infyn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Instagram Profile Picture Downloader — Infyn",
    description:
      "View and download high-resolution Instagram profile pictures (DP) instantly in your browser. 100% free, no login needed.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — Instagram Profile Picture Downloader",
  url: "https://infyn.software/instagram/profile-downloader",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All (Web Browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free client-side tool to view and download full-size Instagram profile pictures in high quality without requiring an Instagram login.",
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
