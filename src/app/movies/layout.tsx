import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies & Series — Download & Stream in 1080p FHD & Hindi 5.1 | Infyn",
  description:
    "Browse, stream, and direct download blockbuster movies and web series in 1080p Full HD with untouched Hindi 5.1 audio. 100% Free, zero popups, and direct high-speed CDN links.",
  keywords: [
    "free movies download",
    "1080p full hd download",
    "hindi 5.1 movies direct download",
    "download movies free no ads",
    "web series download 1080p",
    "infyn movies",
    "direct movie download link",
    "fast movie download",
    "ad free movie streaming",
  ],
  alternates: {
    canonical: "https://infyn.software/movies",
  },
  openGraph: {
    title: "Movies & Series — 1080p FHD Direct Downloads | Infyn",
    description:
      "Browse, stream, and direct download movies and web series in 1080p Full HD with untouched Hindi 5.1 audio. Zero redirect ads.",
    url: "https://infyn.software/movies",
    siteName: "Infyn",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://infyn.software/icon.png",
        width: 512,
        height: 512,
        alt: "Infyn Movies & Series",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Movies & Series — 1080p FHD Direct Downloads | Infyn",
    description:
      "Browse and download movies and web series in 1080p Full HD with untouched Hindi 5.1 audio. 100% Free.",
    images: ["https://infyn.software/icon.png"],
  },
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
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Infyn Movies & Web Series — 1080p FHD Direct Downloads",
    url: "https://infyn.software/movies",
    description:
      "Browse, stream, and direct download movies and web series in 1080p Full HD with untouched Hindi 5.1 audio. Free and client-side verified.",
    inLanguage: "en-US",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://infyn.software",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Movies & Series",
        item: "https://infyn.software/movies",
      },
    ],
  },
];

export default function MoviesLayout({
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
