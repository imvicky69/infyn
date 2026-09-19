import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infyn DL — Free Offline Music Player & Downloader (Android APK)",
  description:
    "100% Free & Ad-Free music player and downloader for Android. Download songs and full playlists directly to your phone at 320kbps for offline listening. Features background playback, beautiful player view, sleep timer with gentle audio fade, and battery-saving OLED pitch-black mode.",
  keywords: [
    "infyn dl",
    "offline music player android",
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
    "batch song downloader apk"
  ],
  alternates: {
    canonical: "https://infyn.software/dl",
  },
  openGraph: {
    title: "Infyn DL — Free Offline Music Player & Downloader (Android)",
    description:
      "Download songs and playlists directly to your phone in 320kbps MP3. Beautiful player view, background screen-off playback, sleep timer, and pure OLED black. 100% Free & Ad-Free.",
    url: "https://infyn.software/dl",
    siteName: "Infyn",
    type: "website",
    images: [
      {
        url: "/logo-clear.png",
        width: 800,
        height: 800,
        alt: "Infyn DL — Free Offline Music Player & Downloader for Android",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infyn DL — Free Offline Music Player & Downloader (Android)",
    description:
      "Download songs and playlists directly to your phone at 320kbps. Beautiful player view, background playback, and sleep timer.",
    images: ["/logo-clear.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Infyn DL",
  operatingSystem: "Android 8.0+",
  applicationCategory: "MultimediaApplication",
  downloadUrl: "https://github.com/imvicky69/infyn-dl/releases",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free, ad-free, open-source offline music player and media downloader for Android. Download unlimited songs and playlists directly to phone storage at 320kbps MP3, with built-in sleep timer, pure pitch-black OLED dark mode, background playback with screen locked, and granular track selection.",
  featureList: [
    "Download songs and playlists directly to phone storage for offline playback",
    "High-resolution 320kbps MP3, AAC, and Opus audio downloads",
    "Stunning now-playing view with album art and controls",
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

