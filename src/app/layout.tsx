import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FBFBFA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://infyn.app"),
  title: {
    default: "Infyn — 100% Free, Ad-Free & Private In-Browser Utilities",
    template: "%s | Infyn",
  },
  description:
    "100% Free and Ad-Free in-browser utilities for images, files, and media. AI background removal, image compressor, and HEIC to JPG converter running locally on your device with zero server uploads.",
  keywords: [
    "ad free background remover",
    "ad free image compressor",
    "ad free heic to jpg converter",
    "free background remover no watermark",
    "free ai background removal",
    "compress image online free ad free",
    "reduce image size in kb free",
    "heic to jpg converter free no ads",
    "convert iphone photo to jpg",
    "heic to png batch converter",
    "private image converter client side",
    "in browser wasm tools",
    "zero upload image converter",
    "free media toolkit without ads",
    "no signup photo tools",
  ],
  authors: [{ name: "Infyn Team" }],
  creator: "Infyn",
  publisher: "Infyn",
  applicationName: "Infyn",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://infyn.app",
    siteName: "Infyn",
    title: "Infyn — 100% Free, Ad-Free & Private In-Browser Utilities",
    description:
      "AI background remover, batch image compressor, and HEIC converter running 100% locally in your browser. 100% Ad-Free, zero cloud uploads, zero signups, free forever.",
    images: [
      {
        url: "/logo-clear.png",
        width: 800,
        height: 800,
        alt: "Infyn — Free & Ad-Free In-Browser Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infyn — 100% Free & Ad-Free In-Browser Utilities",
    description:
      "100% client-side privacy with zero ads. Remove backgrounds with AI, compress images by 90%, and convert HEIC photos with zero server uploads.",
    images: ["/logo-clear.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://infyn.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-[#FBFBFA] text-[#111111] selection:bg-[#E8E6DE] selection:text-black">
        {children}
      </body>
    </html>
  );
}
