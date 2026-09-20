import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies & Shows — Stream & Download in 1080p FHD & Dual Audio | Infyn",
  description:
    "Browse, stream, and download movies and web series in 1080p Full HD with dual audio. 100% free and client-side verified with real-time Firestore database.",
  keywords: [
    "free movies download",
    "1080p full hd download",
    "dual audio movies",
    "download movies free",
    "ad free movie download",
    "infyn movies",
    "direct movie download link",
  ],
  alternates: {
    canonical: "https://infyn.software/movies",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Infyn Movies — 4K UHD & 1080p Downloads",
  url: "https://infyn.software/movies",
  description:
    "Browse, stream, and download blockbuster and critically acclaimed movies in 4K UHD, 1080p, and 720p with dual audio.",
};

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
