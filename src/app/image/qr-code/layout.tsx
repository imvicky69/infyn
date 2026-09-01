import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Custom QR Code Generator with Logo & Colors (No Uploads)",
  description:
    "100% Free & Ad-Free QR Code Generator with custom shapes, linear gradients, logos, Wi-Fi, vCard, and frames. Export high-res PNG, vector SVG, and PDF with zero server tracking.",
  keywords: [
    "free qr code generator",
    "custom qr code with logo",
    "qr code generator online free",
    "ad free qr code generator",
    "wifi qr code generator",
    "vcard qr code generator",
    "upi qr code generator",
    "vector svg qr code",
    "qr code styling online",
    "hd qr code generator",
    "no watermark qr code generator",
    "batch qr code generator",
    "client side qr code creator",
    "transparent background qr code",
  ],
  alternates: {
    canonical: "https://infyn.software/image/qr-code",
  },
  openGraph: {
    title: "Free Custom QR Code Generator with Logo & Colors (No Uploads)",
    description:
      "Design custom QR codes with dot patterns, central logos, Wi-Fi presets, gradients, and frames. Export high-res PNG, vector SVG, or batch ZIP in-browser.",
    url: "https://infyn.software/image/qr-code",
    images: [{ url: "/logo-clear.png", width: 800, height: 800, alt: "Free Custom QR Code Generator" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Infyn — Free Custom QR Code Generator",
  url: "https://infyn.software/image/qr-code",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All (Web Browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Design and generate high-customization QR codes with logo uploads, gradients, custom eye frames, Wi-Fi/vCard builders, vector SVG, and 4K print export.",
  featureList: [
    "100% In-Browser & Private Generation",
    "Custom Central Logo & Preset Icons",
    "Linear & Radial Gradients",
    "Custom Dot Patterns & Corner Eye Shapes",
    "Wi-Fi, vCard, UPI, Email, SMS & Social Presets",
    "Print-Ready SVG Vector & 4K PNG Export",
    "Framed Templates ('Scan Me', Polaroid, Pill)",
    "Batch QR Code Generator with ZIP Export",
  ],
};

export default function QrCodeLayout({ children }: { children: React.ReactNode }) {
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
