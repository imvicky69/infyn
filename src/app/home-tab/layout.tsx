import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infyn Home Tab — Free Open Source Developer New Tab Dashboard (Chrome & Chromium)",
  description:
    "Sleek, privacy-first developer new tab dashboard for Chromium browsers. Instant GitHub repository quick-actions, Firebase cloud consoles, Pomodoro focus timer with browser toolbar countdown badge, omnisearch, and auto-sync scratchpad notes.",
  keywords: [
    "infyn home tab",
    "developer new tab extension",
    "chrome home tab",
    "github new tab dashboard",
    "firebase new tab",
    "pomodoro new tab extension",
    "omnisearch new tab",
    "developer startpage",
    "open source new tab chrome",
    "privacy new tab extension",
    "brave new tab",
    "arc browser new tab",
  ],
  alternates: {
    canonical: "https://infyn.software/home-tab",
  },
  openGraph: {
    title: "Infyn Home Tab — Sleek, High-Performance Developer Homescreen",
    description:
      "Transform your browser new-tab into a distraction-free developer workstation with GitHub, Firebase, Pomodoro timer, and omnisearch. 100% free and open source.",
    url: "https://infyn.software/home-tab",
    siteName: "Infyn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infyn Home Tab — Developer Productivity Homescreen",
    description:
      "Transform your browser new-tab into a distraction-free developer workstation with GitHub, Firebase, Pomodoro timer, and omnisearch.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Infyn Home Tab",
  operatingSystem: "Google Chrome, Brave, Arc, Microsoft Edge, Chromium",
  applicationCategory: "DeveloperApplication",
  downloadUrl: "https://github.com/imvicky69/infyn-home-tab/releases",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free, open-source developer productivity new-tab extension for Chromium browsers with GitHub repo actions, Firebase console deep-links, Pomodoro timer with toolbar badge sync, and omnisearch.",
  author: {
    "@type": "Person",
    name: "imvicky69",
    url: "https://github.com/imvicky69",
  },
};

export default function HomeTabLayout({ children }: { children: React.ReactNode }) {
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
