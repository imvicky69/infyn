import type { Metadata } from "next";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { Movie } from "@/types/movie";

async function getMovieForLayout(slug: string): Promise<Movie | null> {
  try {
    const db = getAdminFirestore();
    const doc = await db.collection("movies").doc(slug).get();
    if (doc.exists) {
      return { ...doc.data(), slug: doc.id } as Movie;
    }
  } catch (err) {
    console.warn("Firestore query error in MovieDetailLayout:", err);
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovieForLayout(slug);

  if (!movie) {
    return {
      title: "Movie Not Found | Infyn",
      description: "The requested movie or web series could not be found.",
    };
  }

  const isSingle = !movie.episodes || movie.episodes.length <= 1;
  const title = isSingle
    ? `${movie.title} (${movie.year}) — Download Full Movie (1080p FHD) | Infyn`
    : `${movie.title} (${movie.year}) Web Series — Download All Episodes (1080p Web-DL) | Infyn`;
  const description = `Watch official trailer and download ${movie.title} starring ${Array.isArray(movie.cast) ? movie.cast.slice(0, 3).join(", ") : movie.cast}. Direct high-speed downloads in 1080p Full HD with ${movie.language}. Free & Ad-Free.`;

  return {
    title,
    description,
    keywords: [
      `${movie.title} download`,
      `${movie.title} 1080p download`,
      "free hindi movie download",
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
      type: isSingle ? "video.movie" : "video.tv_show",
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
  const movie = await getMovieForLayout(slug);

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
