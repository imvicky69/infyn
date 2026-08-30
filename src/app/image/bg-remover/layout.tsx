import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Background Remover — Remove Image Backgrounds Online (No Watermark)",
  description:
    "100% Free AI Background Remover running locally in your browser with BRIA RMBG-1.4. Remove background instantly with zero watermark, zero signups, and zero file uploads. Add colors, gradients, and custom aspect ratios.",
  keywords: [
    "free ai background remover",
    "remove background online free no watermark",
    "remove bg free hd",
    "transparent background maker",
    "erase photo background ai",
    "product photo background remover",
    "bria rmbg 1.4 online",
    "private background remover in browser",
    "remove image background unlimited free",
    "change photo background color free",
  ],
  alternates: {
    canonical: "https://infyn.app/image/bg-remover",
  },
  openGraph: {
    title: "Free AI Background Remover — Instant In-Browser (No Watermark)",
    description:
      "Remove backgrounds from any photo in seconds with AI. 100% private, runs entirely on your device with no uploads or signups required.",
    url: "https://infyn.app/image/bg-remover",
    images: [{ url: "/logo-clear.png", width: 800, height: 800, alt: "Free AI Background Remover" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn AI Background Remover",
  url: "https://infyn.app/image/bg-remover",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All (Web Browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online AI background removal tool that executes 100% in-browser using WebAssembly and Transformers.js. No file uploads or watermarks.",
  featureList: [
    "Instant AI Background Removal",
    "100% Private Client-Side Compute",
    "No Watermarks or Subscriptions",
    "Solid & Gradient Background Customizer",
    "Moveable, Scalable Subject Repositioning",
    "Custom Social Media Aspect Ratios (1:1, 9:16, 4:5, 16:9)",
  ],
};

export default function BgRemoverLayout({ children }: { children: React.ReactNode }) {
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
