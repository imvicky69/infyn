import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Developer Tools Suite — Fast, In-Browser & Private (No Uploads)",
  description:
    "100% Free, Ad-Free and Private developer utilities running locally in your browser. Base64 & Data URI Studio, media tools, app downloads, and developer extensions with zero cloud uploads.",
  keywords: [
    "developer tools",
    "dev utilities",
    "base64 studio",
    "data uri converter",
    "infyn dl",
    "infyn home tab",
    "in-browser developer tools",
    "client side dev tools",
    "free developer utilities no ads",
  ],
  alternates: { canonical: "https://infyn.software/dev" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — Developer Tools Suite",
  url: "https://infyn.software/dev",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "All (Web Browser)",
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
