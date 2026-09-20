import type { Metadata } from "next";
import moviesData from "@/data/movies.json";
import { Movie } from "@/types/movie";

const movies = moviesData as Movie[];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const movie = movies.find((m) => m.slug === slug);

  if (!movie) {
    return {
      title: "Movie Not Found | Infyn",
      description: "The requested movie or web series could not be found.",
    };
  }

  const title = `${movie.title} (${movie.year}) Web Series — Download All Episodes (1080p Web-DL) | Infyn`;
  const description = `Watch official trailer and download all episodes of ${movie.title} starring ${movie.cast.slice(0, 3).join(", ")}. Direct high-speed downloads in 1080p Full HD with Hindi Original Audio & English subtitles. Free & Ad-Free.`;

  return {
    title,
    description,
    keywords: [
      `${movie.title} download`,
      `${movie.title} web series download`,
      `${movie.title} all episodes download`,
      `${movie.title} 1080p download`,
      `${movie.title} 720p download`,
      `${movie.title} divyenndu`,
      `${movie.title} bhuvan arora`,
      "waiting hai tatkal irctc series",
      "free hindi web series download",
      "infyn movies",
    ],
    alternates: {
      canonical: `https://infyn.software/movies/${movie.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://infyn.software/movies/${movie.slug}`,
      siteName: "Infyn",
      images: [
        {
          url: movie.poster,
          width: 800,
          height: 1200,
          alt: `${movie.title} Poster`,
        },
      ],
      type: "video.tv_show",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [movie.poster],
    },
  };
}

export default async function MovieDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const movie = movies.find((m) => m.slug === slug);

  const jsonLd = movie
    ? {
        "@context": "https://schema.org",
        "@type": "TVSeries",
        name: movie.title,
        url: `https://infyn.software/movies/${movie.slug}`,
        image: `https://infyn.software${movie.poster}`,
        description: movie.synopsis,
        genre: movie.genres,
        numberOfEpisodes: movie.episodes?.length || 7,
        director: {
          "@type": "Person",
          name: movie.director,
        },
        actor: movie.cast.map((actor) => ({
          "@type": "Person",
          name: actor,
        })),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: movie.rating,
          bestRating: 10,
          worstRating: 1,
          ratingCount: movie.votes,
        },
        trailer: {
          "@type": "VideoObject",
          name: `${movie.title} Official Trailer`,
          description: `Official trailer for ${movie.title}`,
          thumbnailUrl: `https://infyn.software${movie.poster}`,
          uploadDate: movie.releaseDate,
          contentUrl: `https://infyn.software${movie.localTrailerUrl || ""}`,
        },
        containsSeason: {
          "@type": "TVSeason",
          seasonNumber: 1,
          numberOfEpisodes: movie.episodes?.length || 7,
          episode: (movie.episodes || []).map((ep) => ({
            "@type": "TVEpisode",
            episodeNumber: ep.episodeNumber,
            name: ep.title,
            description: ep.synopsis,
            duration: ep.duration,
          })),
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
