import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ecosystem Documentation & Developer Guide — Infyn",
  description:
    "Complete developer documentation, architecture guides, and extension recipes for all three Infyn projects: Web Suite & Headless SDK, Infyn DL (Android & Windows), and Infyn Home Tab (Chromium Extension). 100% free and open source.",
  keywords: [
    "infyn docs",
    "infyn sdk",
    "infyn npm",
    "infyn dl documentation",
    "infyn home tab developer guide",
    "client side pdf sdk",
    "in browser image compression npm",
    "cross platform media downloader",
    "chromium new tab extension development",
    "open source software ecosystem",
    "zero cloud uploads architecture",
  ],
  alternates: {
    canonical: "https://infyn.software/docs",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Infyn Open-Source Ecosystem & Developer Guide",
  description:
    "Comprehensive guide and architecture reference for Infyn Web Suite & Headless SDK, Infyn DL for Android & Windows, and Infyn Home Tab for Chromium browsers.",
  url: "https://infyn.software/docs",
  author: {
    "@type": "Organization",
    name: "Infyn",
    url: "https://infyn.software",
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
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
