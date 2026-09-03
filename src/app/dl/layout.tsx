import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infyn DL — Free Open Source Media & Music Downloader (Android & Windows)",
  description:
    "Free, open-source media & music downloader for Android and Windows. Download 4K videos, 320kbps MP3s, and full playlists with granular track selection, 8 parallel streams, background service, and zero ads.",
  keywords: [
    "infyn dl",
    "media downloader android",
    "youtube downloader windows",
    "playlist downloader",
    "batch video downloader",
    "youtube playlist to mp3",
    "select deselect playlist songs",
    "youtube to mp3 320kbps",
    "open source video downloader",
    "yt-dlp gui android",
    "yt-dlp gui windows",
    "parallel video downloader",
    "ad free youtube downloader",
    "free media downloader apk",
    "fast youtube downloader",
    "youtube video downloader apk",
    "youtube audio downloader apk",
    "youtube video converter windows",
    "youtube music downloader playlist"
  ],
  alternates: {
    canonical: "https://infyn.software/dl",
  },
  openGraph: {
    title: "Infyn DL — High-Speed Media & Music Downloader for Android & Windows",
    description:
      "Download 4K videos, 320kbps MP3s, and full playlists with granular track selection. 8 parallel streams, background service, 100% free and open source.",
    url: "https://infyn.software/dl",
    siteName: "Infyn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infyn DL — Free Media & Music Downloader (Android & Windows)",
    description:
      "Free & open-source media and playlist downloader. 8 parallel streams, 4K video, 320kbps MP3 audio, and background notifications.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Infyn DL",
  operatingSystem: "Android, Windows 10, Windows 11",
  applicationCategory: "MultimediaApplication",
  downloadUrl: "https://github.com/imvicky69/infyn-dl/releases",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free, open-source media, music, and playlist downloader app for Android and Windows supporting 4K video downloads, 320kbps MP3 extraction, selective playlist track downloads, 8 parallel streams, and background notification service.",
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
