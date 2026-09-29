import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Instagram Tools & Downloaders — Infyn",
  description:
    "Free, ad-free in-browser tools for Instagram: Download Reels in HD MP4, extract audio, and download full-size profile pictures (DP). Zero cloud storage, 100% free.",
  keywords: [
    "instagram tools",
    "instagram downloader",
    "instagram reel downloader",
    "instagram profile picture downloader",
    "instagram dp download",
    "insta video download",
    "save instagram reels",
  ],
  alternates: {
    canonical: "https://infyn.software/instagram",
  },
  openGraph: {
    title: "Free Instagram Tools & Downloaders — Infyn",
    description:
      "Download Instagram Reels, Audio, and Profile Pictures in HD directly in your browser. 100% free, no login required.",
    url: "https://infyn.software/instagram",
    siteName: "Infyn",
    type: "website",
  },
};

export default function InstagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
