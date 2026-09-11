import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infyn DL — Free Music Streaming App & YouTube Downloader (Android & Windows)",
  description:
    "100% Free & Ad-Free music streaming and downloader app for Android and Windows. Stream and download unlimited songs from YouTube and YouTube Music at 320kbps. Features built-in Sleep Timer with gentle audio fade, pure pitch-black OLED dark mode, background playback with screen locked, and full playlist cherry-picking.",
  keywords: [
    "infyn dl",
    "free music streaming app",
    "free music downloader app",
    "download songs from youtube music",
    "youtube music downloader apk",
    "youtube to mp3 320kbps",
    "sleep timer music player",
    "sleep timer android music",
    "oled dark mode music player",
    "pure black amoled music player",
    "background playback youtube without premium",
    "unlimited free music download app",
    "ad free youtube music player",
    "youtube playlist to mp3 downloader",
    "cherry pick playlist songs download",
    "open source music streaming app",
    "download music with album art and lyrics",
    "offline music player android apk",
    "yt dlp gui android",
    "media downloader windows 11",
    "batch song downloader apk"
  ],
  alternates: {
    canonical: "https://infyn.software/dl",
  },
  openGraph: {
    title: "Infyn DL — Free Music Streaming App & YouTube Music Downloader",
    description:
      "Stream and download unlimited free songs from YouTube & YouTube Music. 320kbps MP3, built-in Sleep Timer, pure pitch-black OLED mode, background playback, and batch playlist downloads. 100% Free & Ad-Free.",
    url: "https://infyn.software/dl",
    siteName: "Infyn",
    type: "website",
    images: [
      {
        url: "/logo-clear.png",
        width: 800,
        height: 800,
        alt: "Infyn DL — Free Music Streaming App & YouTube Downloader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infyn DL — Free Music Streaming App & YouTube Downloader",
    description:
      "Stream & download unlimited songs from YouTube Music in 320kbps. Built-in Sleep Timer, true OLED black dark mode, and background playback with screen locked.",
    images: ["/logo-clear.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Infyn DL",
  operatingSystem: "Android 8.0+, Windows 10, Windows 11",
  applicationCategory: "MultimediaApplication",
  downloadUrl: "https://github.com/imvicky69/infyn-dl/releases",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free, ad-free, open-source music streaming and media downloader for Android and Windows. Stream and download unlimited songs from YouTube and YouTube Music with 320kbps MP3 extraction, built-in Sleep Timer with gentle audio fade, pure pitch-black OLED dark mode battery saver, background playback, and full playlist track selection.",
  featureList: [
    "Unlimited free music streaming and downloading from YouTube & YouTube Music",
    "High-resolution 320kbps MP3, AAC, and Opus audio downloads",
    "Built-in Sleep Timer with gradual volume fade-out and auto-stop",
    "Pure Pitch-Black OLED Dark Mode (#000000) for AMOLED battery savings",
    "Background screen-off audio playback with zero ads",
    "Batch playlist & album downloads with granular song selection checkboxes",
    "Automatic high-resolution album art and ID3 metadata tagging",
    "Direct phone storage saving to Music and Download folders",
    "100% Free, Ad-Free, Open Source with zero telemetry or accounts"
  ],
  author: {
    "@type": "Person",
    name: "imvicky69",
    url: "https://github.com/imvicky69",
  },
};

export default function DlLayout({ children }: { children: React.ReactNode }) {
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

