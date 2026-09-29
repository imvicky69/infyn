import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Instagram Reel Downloader — Download HD Reels in Browser (No Ads)",
  description:
    "100% Free, Ad-Free Instagram Reel Downloader. Paste any public Instagram Reel or video link to preview and download in full HD MP4 quality directly in your browser. No watermark, no signup.",
  keywords: [
    "instagram reel downloader",
    "download instagram reel",
    "instagram video download",
    "insta reel download online",
    "download reel hd mp4",
    "free instagram downloader",
    "ad free instagram reel downloader",
    "instagram audio download",
    "save instagram reels",
    "instagram reel to mp4",
  ],
  alternates: {
    canonical: "https://infyn.software/instagram-reel-downloader",
  },
  openGraph: {
    title: "Free Instagram Reel Downloader — Download HD Reels in Browser",
    description:
      "Download Instagram Reels in full HD MP4 quality directly in your browser. Fast, 100% free, ad-free with zero watermarks.",
    url: "https://infyn.software/instagram-reel-downloader",
    siteName: "Infyn",
    type: "website",
    images: [
      {
        url: "/logo-clear.png",
        width: 800,
        height: 800,
        alt: "Infyn Instagram Reel Downloader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Instagram Reel Downloader — Download HD Reels in Browser",
    description:
      "Paste any reel link and download pristine 1080p/720p MP4 videos instantly inside your browser. No ads, no watermarks.",
    images: ["/logo-clear.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — Instagram Reel Downloader",
  url: "https://infyn.software/instagram-reel-downloader",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All (Web Browser, iOS, Android, Windows, macOS, Linux)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free, ad-free Instagram Reel and video downloader running directly in your browser. Save high-definition MP4 videos, extract audio tracks, and download cover images without watermarks or login.",
  featureList: [
    "High-definition MP4 video download (1080p / 720p)",
    "Audio extraction (M4A / MP3)",
    "Built-in interactive video player preview before downloading",
    "1-Click direct browser download without cloud storage",
    "100% Free, Ad-Free, and zero watermarks",
    "Works across iPhone, iPad, Android, Mac, and Windows browsers",
  ],
  author: {
    "@type": "Person",
    name: "imvicky69",
    url: "https://github.com/imvicky69",
  },
};

export default function InstagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
