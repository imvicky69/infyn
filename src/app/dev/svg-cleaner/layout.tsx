import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free SVG Cleaner & Minifier — Clean & Optimize Vectors Online (No Uploads)",
  description:
    "100% Free & Ad-Free SVG Cleaner and Minifier running locally in your browser. Strip Figma, Illustrator, and Inkscape bloat, collapse redundant paths, round coordinate precision, and export as minified SVG, React JSX, or CSS Data URI.",
  keywords: [
    "svg cleaner",
    "svg minifier",
    "clean svg online",
    "optimize svg online",
    "svgo browser online",
    "svg to react component",
    "svg to css data uri",
    "remove figma metadata svg",
    "illustrator svg cleaner",
    "client side svg optimizer",
    "ad free svg cleaner",
  ],
  alternates: {
    canonical: "https://infyn.software/dev/svg-cleaner",
  },
  openGraph: {
    title: "Free SVG Cleaner & Minifier — Optimize Vectors Online (No Uploads)",
    description:
      "Strip editor junk, round coordinates, and minify SVG vectors with live visual diff preview. 100% client-side privacy, zero cloud uploads.",
    url: "https://infyn.software/dev/svg-cleaner",
    images: [{ url: "/logo-clear.png", width: 800, height: 800, alt: "SVG Cleaner & Minifier" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — Free SVG Cleaner & Minifier",
  url: "https://infyn.software/dev/svg-cleaner",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "All (Web Browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "100% in-browser SVG vector cleaner and optimizer. Strip editor bloat, minify markup, export React components and CSS Data URIs.",
  featureList: [
    "SVGO Browser Optimization Engine",
    "Strip Illustrator, Figma, and Inkscape Editor Metadata",
    "Live Before & After Visual Preview with Transparency Checkerboard",
    "Coordinate Precision & Decimal Rounding",
    "1-Click Copy as React JSX Functional Component",
    "1-Click Copy as CSS Data URI",
    "Batch Multiple SVG Optimization & 1-Click ZIP Download",
    "100% Client-Side Privacy (Zero Server Uploads)",
  ],
};

export default function SvgCleanerLayout({ children }: { children: React.ReactNode }) {
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
