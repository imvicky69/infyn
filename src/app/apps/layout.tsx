import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apps & Browser Extensions — Free, Ad-Free & Offline Software",
  description:
    "Explore Infyn's native applications and browser extensions. Infyn DL (music & video downloader for Windows & Android) and Infyn Home Tab (productivity & bookmarks new tab). 100% free, ad-free, and private.",
  keywords: [
    "infyn apps",
    "infyn dl",
    "infyn home tab",
    "music downloader app",
    "playlist downloader",
    "android media downloader",
    "windows downloader setup",
    "new tab extension",
    "bookmark manager extension",
    "productivity chrome extension",
    "free open source apps",
  ],
  alternates: { canonical: "https://infyn.software/apps" },
  openGraph: {
    title: "Infyn Apps & Extensions — Free, Ad-Free & Offline Software",
    description:
      "Native desktop, mobile apps, and browser extensions built for speed, privacy, and zero ads.",
    url: "https://infyn.software/apps",
    images: [{ url: "/logo-clear.png", width: 800, height: 800, alt: "Infyn Apps & Extensions" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Infyn Apps & Software Ecosystem",
  url: "https://infyn.software/apps",
  applicationCategory: "MultimediaApplication, ProductivityApplication",
  operatingSystem: "Windows, Android, Chrome, Brave, Edge",
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
