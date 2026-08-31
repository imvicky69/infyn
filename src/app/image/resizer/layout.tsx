import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Image Resizer — Resize Dimensions, Scale & Crop Photos (No Uploads)",
  description:
    "100% Free & Ad-Free in-browser image resizer. Change image dimensions in pixels or percentages, lock aspect ratio, and resize with social media presets for Instagram, YouTube, WhatsApp, and Favicons.",
  keywords: [
    "free image resizer",
    "resize image online free no ads",
    "resize photo in pixels",
    "instagram photo resizer free",
    "youtube thumbnail resizer",
    "whatsapp dp resizer",
    "favicon generator 32x32",
    "maintain aspect ratio image resize",
    "batch image resizer client side",
    "private image resizer wasm",
  ],
  alternates: {
    canonical: "https://infyn.software/image/resizer",
  },
  openGraph: {
    title: "Free Image Resizer — Resize Dimensions & Social Presets (Private)",
    description:
      "Resize images in your browser with zero cloud uploads. Supports Instagram, YouTube, WhatsApp presets, aspect ratio locking, and batch ZIP export.",
    url: "https://infyn.software/image/resizer",
    images: [{ url: "/logo-clear.png", width: 800, height: 800, alt: "Free Image Resizer" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn by Indivio — Free Image Resizer",
  url: "https://infyn.software/image/resizer",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All (Web Browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Fast, private in-browser image resizer. Change dimensions in px or percentages with aspect ratio lock, social media presets, and batch ZIP export.",
  featureList: [
    "Pixel and Percentage Resizing",
    "Maintain Aspect Ratio Lock",
    "Instagram, YouTube, WhatsApp & Favicon Presets",
    "Fit Modes (Stretch, Contain, Center Crop)",
    "Batch Image Resizing with ZIP Export",
    "100% In-Browser Privacy (Zero Server Uploads)",
  ],
};

export default function ResizerLayout({ children }: { children: React.ReactNode }) {
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
