import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const viewport: Viewport = {
  themeColor: "#FBFBFA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://infyn.indivio.in"),
  title: {
    default: "Infyn by Indivio — 100% Free, Ad-Free & Private In-Browser Utilities",
    template: "%s | Infyn by Indivio",
  },
  description:
    "100% Free and Ad-Free in-browser utilities by Indivio. AI background removal, batch image compressor, resizer, and universal image converter running locally on your device with zero server uploads.",
  keywords: [
    "infyn by indivio",
    "indivio tools",
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
  authors: [{ name: "Indivio", url: "https://indivio.in" }],
  creator: "Indivio",
  publisher: "Indivio",
  applicationName: "Infyn by Indivio",
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
    url: "https://infyn.indivio.in",
    siteName: "Infyn by Indivio",
    title: "Infyn by Indivio — 100% Free, Ad-Free & Private In-Browser Utilities",
    description:
      "AI background remover, batch image compressor, resizer, and converter running 100% locally in your browser. 100% Ad-Free, zero cloud uploads, zero signups, free forever by Indivio.",
    images: [
      {
        url: "/logo-clear.png",
        width: 800,
        height: 800,
        alt: "Infyn by Indivio — Free & Ad-Free In-Browser Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infyn by Indivio — 100% Free & Ad-Free In-Browser Utilities",
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
    canonical: "https://infyn.indivio.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="font-sans antialiased min-h-screen text-[#111111] selection:bg-[#E8E6DE] selection:text-black relative">
        {/* Soft Global Ambient Glow Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
          {/* Top Center Ambient Aura */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-400/20 via-indigo-400/18 to-amber-300/12 blur-[100px] opacity-90" />
          {/* Top Right Subtle Violet/Indigo Glow */}
          <div className="absolute top-[15%] -right-28 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-indigo-400/15 via-purple-300/10 to-transparent blur-[90px] opacity-80" />
          {/* Middle Left Subtle Teal/Emerald Glow */}
          <div className="absolute top-[40%] -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-400/15 via-emerald-300/10 to-transparent blur-[95px] opacity-80" />
          {/* Bottom Ambient Warmth */}
          <div className="absolute -bottom-40 left-1/3 w-[600px] h-[400px] rounded-full bg-gradient-to-t from-amber-300/10 via-emerald-300/8 to-transparent blur-[110px] opacity-70" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
