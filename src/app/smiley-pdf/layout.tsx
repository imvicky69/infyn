import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smiley PDF 😄📄 — Free, Joyful & Ad-Free Android PDF Reader (APK)",
  description:
    "100% Free & Ad-Free PDF reader and document manager for Android built with Flutter. Fast hardware-accelerated PDFium rendering, private offline sandbox library, in-place rename, swipe-to-dismiss recents, zero sensitive permissions, and upcoming OCR tools. Download APK.",
  keywords: [
    "smiley pdf",
    "smiley pdf apk",
    "free pdf reader android",
    "ad free pdf reader apk",
    "flutter pdf reader",
    "offline pdf reader android",
    "pdfrx android",
    "in.xweet.smileypdf",
    "joyful pdf reader",
    "open source pdf reader android",
    "lightweight pdf viewer",
    "fast pdf reader apk",
    "safe pdf reader no permissions",
    "clean architecture flutter pdf",
    "material 3 pdf reader",
    "android document manager apk",
  ],
  alternates: {
    canonical: "https://infyn.software/smiley-pdf",
  },
  openGraph: {
    title: "Smiley PDF 😄📄 — Free, Joyful & Ad-Free Android PDF Reader",
    description:
      "Modern, fast, and joyful PDF reader and document manager for Android. 100% Free, Zero Ads, zero cloud uploads. Powered by Flutter & PDFium.",
    url: "https://infyn.software/smiley-pdf",
    siteName: "Infyn",
    type: "website",
    images: [
      {
        url: "/smiley-logo.png",
        width: 1024,
        height: 1024,
        alt: "Smiley PDF — Joyful & Free Android PDF Reader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smiley PDF 😄📄 — Free, Joyful & Ad-Free Android PDF Reader",
    description:
      "Modern, fast, and joyful PDF reader and document manager for Android. 100% Free, Zero Ads, zero cloud uploads.",
    images: ["/smiley-logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Smiley PDF",
  operatingSystem: "Android 5.0+ (API 21+)",
  applicationCategory: "UtilitiesApplication",
  downloadUrl: "https://github.com/imvicky69/smiley-pdf/releases",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "A modern, fast, clean, and joyful PDF reader and document manager built for Android using Flutter. Features hardware-accelerated PDFium rendering, in-place file rename, document metadata inspector, offline sandbox library, swipe-to-remove recents, and zero invasive permissions.",
  featureList: [
    "High-Performance PDF Viewer powered by PDFium Native engine (pdfrx)",
    "Instant pan, pinch-to-zoom, and smooth page navigation",
    "In-place document rename directly on device storage",
    "Complete document metadata inspector (file size, page count, modified date, storage path)",
    "1-Tap Save & Unsave bookmark to isolated offline app library",
    "Native Android share sheet integration for WhatsApp, Gmail, and Drive",
    "Joyful Home Screen with top 10 recent documents, thumbnails, and file size badges",
    "iOS-style swipe-left-to-remove recent files with instant Undo toast",
    "Automatic purge of deleted or missing documents from reading history",
    "Dedicated Offline Library with duplicate prevention and welcome guide",
    "Zero sensitive permissions requested (no MANAGE_EXTERNAL_STORAGE needed)",
    "100% Free & Ad-Free forever with no subscriptions or tracking",
    "Upcoming Tools Suite: OCR text extraction, camera document scanner, and PDF protector"
  ],
  author: {
    "@type": "Person",
    name: "imvicky69",
    url: "https://github.com/imvicky69",
  },
};

export default function SmileyPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
