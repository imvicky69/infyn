import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { LoadingProvider } from "@/components/loading-provider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FBFBFA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://infyn.software"),
  title: {
    default: "Infyn — 100% Free, Ad-Free & Private In-Browser Utilities",
    template: "%s | Infyn",
  },
  description:
    "100% Free and Ad-Free in-browser utilities. AI background removal, batch image compressor, resizer, PDF tools, and universal image converter running locally on your device with zero server uploads.",
  keywords: [
    "infyn",
    "infyn tools",
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
    "pdf merger free no upload",
    "remove pdf password client side",
    "split pdf free",
    "free pdf protector online",
    "free pdf compressor online",
    "compress pdf to 200kb",
    "compress pdf to 500kb",
    "reduce pdf size in kb",
    "shrink pdf online without watermark",
    "client side pdf compression",
    "free qr code generator",
    "custom qr code with logo",
    "wifi qr code generator free",
    "vector svg qr code generator",
    "ad free qr code generator"
  ],


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
    url: "https://infyn.software",
    siteName: "Infyn",
    title: "Infyn — 100% Free, Ad-Free & Private In-Browser Utilities",
    description:
      "AI background remover, batch image compressor, PDF tools, and converter running 100% locally in your browser. 100% Ad-Free, zero cloud uploads, zero signups, free forever.",
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
      "100% client-side privacy with zero ads. Remove backgrounds with AI, compress images, and manage PDFs with zero server uploads.",
    images: ["/logo-clear.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://infyn.software",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", plusJakartaSans.variable)}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Zero-FOUC theme initialization
              (function() {
                try {
                  var stored = localStorage.getItem('infyn-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = stored === 'dark' || (stored !== 'light' && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();

              // Prevent unwanted mobile zoom, mis-zoom, and accidental gesture zooming
              if (typeof window !== 'undefined') {
                // Prevent iOS Safari pinch-to-zoom gestures
                document.addEventListener('gesturestart', function(e) { e.preventDefault(); }, { passive: false });
                document.addEventListener('gesturechange', function(e) { e.preventDefault(); }, { passive: false });
                document.addEventListener('gestureend', function(e) { e.preventDefault(); }, { passive: false });
                
                // Prevent double-tap zoom on mobile while preserving normal tapping
                var _lastTouchEnd = 0;
                document.addEventListener('touchend', function(e) {
                  var now = Date.now();
                  if (now - _lastTouchEnd <= 300) {
                    var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
                    if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
                      e.preventDefault();
                    }
                  }
                  _lastTouchEnd = now;
                }, { passive: false });

                // Prevent multi-touch pinch on touchmove
                document.addEventListener('touchmove', function(e) {
                  if (e.touches && e.touches.length > 1) {
                    e.preventDefault();
                  }
                }, { passive: false });
              }
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen w-full max-w-full overflow-x-clip text-[#111111] dark:text-[#EDEDEC] bg-[#FBFBFA] dark:bg-[#0C0C0E] selection:bg-[#E8E6DE] dark:selection:bg-zinc-800 selection:text-black dark:selection:text-white relative">
        <ThemeProvider>
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-FSW6CGT3R5"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FSW6CGT3R5');
            `}
          </Script>
          {/* Soft Global Ambient Glow Orbs */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
            {/* Top Center Ambient Aura */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-400/20 via-indigo-400/18 to-amber-300/12 blur-[100px] opacity-90 dark:opacity-40" />
            {/* Top Right Subtle Violet/Indigo Glow */}
            <div className="absolute top-[15%] -right-28 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-indigo-400/15 via-purple-300/10 to-transparent blur-[90px] opacity-80 dark:opacity-30" />
            {/* Middle Left Subtle Teal/Emerald Glow */}
            <div className="absolute top-[40%] -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-400/15 via-emerald-300/10 to-transparent blur-[95px] opacity-80 dark:opacity-30" />
            {/* Bottom Ambient Warmth */}
            <div className="absolute -bottom-40 left-1/3 w-[600px] h-[400px] rounded-full bg-gradient-to-t from-amber-300/10 via-emerald-300/8 to-transparent blur-[110px] opacity-70 dark:opacity-30" />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen w-full max-w-full">
            <LoadingProvider>
              {children}
            </LoadingProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
