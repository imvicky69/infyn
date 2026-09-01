import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation & SDK Guide — Infyn",
  description:
    "Complete developer documentation and API reference for the Infyn Headless SDK and NPM package. Process PDFs and images client-side with zero cloud uploads.",
  keywords: [
    "infyn npm",
    "infyn sdk",
    "client side pdf sdk",
    "in browser image compression npm",
    "pdf merger react library",
    "decrypt pdf javascript",
    "heic to jpg npm",
  ],
  alternates: {
    canonical: "https://infyn.software/docs",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Infyn Developer SDK & NPM Package Documentation",
  description:
    "Comprehensive guide and API reference for integrating Infyn's in-browser image and PDF processing library into React, Next.js, Vue, and Node apps.",
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
