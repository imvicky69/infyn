import type { Metadata } from "next";
import moviesData from "@/data/movies.json";
import { Movie } from "@/types/movie";

export const metadata: Metadata = {
  title: "Movies — Stream & Download in 4K UHD, 1080p & Dual Audio | Infyn",
  description:
    "Browse, stream, and download blockbuster and critically acclaimed movies in 4K UHD HDR, 1080p Web-DL, and 720p with Dual Audio and multi-language subtitles. Ad-free, fast direct links.",
  keywords: [
    "free movies download",
    "4k movies download",
    "1080p dual audio movies",
    "download movies free",
    "ad free movie download",
    "infyn movies",
    "dune 2 4k download",
    "oppenheimer dual audio download",
    "hollywood movies in hindi",
    "direct movie download link",
  ],
  alternates: {
    canonical: "https://infyn.software/movies",
  },
  openGraph: {
    title: "Movies — 4K UHD, 1080p & Dual Audio Downloads | Infyn",
    description:
      "Direct high-speed downloads for top movies in 4K UHD, 1080p, and 720p with dual audio and subtitles. Completely free and ad-free.",
    url: "https://infyn.software/movies",
    siteName: "Infyn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movies — 4K UHD & 1080p Downloads | Infyn",
    description:
      "Direct high-speed downloads for top movies in 4K UHD, 1080p, and 720p with dual audio. 100% ad-free.",
  },
};

const movies = moviesData as Movie[];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Infyn Movies — 4K UHD & 1080p Downloads",
  url: "https://infyn.software/movies",
  description:
    "Browse, stream, and download blockbuster and critically acclaimed movies in 4K UHD, 1080p, and 720p with dual audio.",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: movies.length,
    itemListElement: movies.map((movie, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Movie",
        name: movie.title,
        url: `https://infyn.software/movies/${movie.slug}`,
        image: movie.poster,
        dateCreated: movie.releaseDate,
        director: {
          "@type": "Person",
          name: movie.director,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: movie.rating,
          bestRating: 10,
          worstRating: 1,
          ratingCount: movie.votes,
        },
      },
    })),
  },
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
