import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Base64 & Data URI Studio — Convert Assets to CSS & HTML (No Uploads)",
  description:
    "100% Free & In-Browser Base64 & Data URI Studio. Convert images, fonts, and assets into production-ready CSS background-image, HTML img, @font-face, and Data URI strings. Zero server uploads.",
  keywords: [
    "base64 studio",
    "data uri converter",
    "image to base64",
    "css background image base64",
    "font to base64",
    "woff2 base64 converter",
    "svg to data uri",
    "base64 decoder online",
    "client side base64 generator",
    "free base64 converter no upload",
    "data uri generator",
    "developer utilities",
  ],
  alternates: {
    canonical: "https://infyn.software/dev/base64",
  },
  openGraph: {
    title: "Base64 & Data URI Studio — In-Browser Asset Converter",
    description:
      "Convert assets into production-ready Base64 and CSS data URI strings. 100% local in-browser execution with zero server uploads.",
    url: "https://infyn.software/dev/base64",
    images: [{ url: "/logo-clear.png", width: 800, height: 800, alt: "Base64 & Data URI Studio" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — Base64 & Data URI Studio",
  url: "https://infyn.software/dev/base64",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "All (Web Browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Convert images, SVGs, web fonts, and files into production-ready Base64 and CSS Data URI strings with live preview and code snippets.",
  featureList: [
    "100% In-Browser Local Conversion",
    "Zero Cloud Uploads & Privacy Guaranteed",
    "CSS background-image & @font-face Code Generators",
    "Optimized SVG UTF-8 Data URI Output",
    "Interactive Base64 Decoder & File Downloader",
    "Batch File Conversion",
  ],
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
