import type { Metadata } from "next";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { Movie } from "@/types/movie";

export const dynamicParams = true;

/**
 * Pre-generate static HTML for all current Firestore movies at build time.
 * Newly added movies in Firestore are rendered dynamically on demand.
 */
export async function generateStaticParams() {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("movies").get();
    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => ({ slug: doc.id }));
    }
  } catch (err) {
    console.warn("generateStaticParams query failed, using fallbacks:", err);
  }

  return [
    { slug: "indias-got-latent" },
    { slug: "waiting-hai" },
    { slug: "zakir-khan-papa-yaar" },
  ];
}

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

function getAbsolutePosterUrl(poster?: string): string {
  if (!poster) return "https://infyn.software/icon.png";
  if (poster.startsWith("http://") || poster.startsWith("https://")) {
    return poster;
  }
  return `https://infyn.software${poster.startsWith("/") ? "" : "/"}${poster}`;
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
      description: "The requested movie or web series could not be found in our database.",
      robots: { index: false, follow: true },
    };
  }

  const isSingle = !movie.episodes || movie.episodes.length <= 1;
  const posterUrl = getAbsolutePosterUrl(movie.poster);
  const canonicalUrl = `https://infyn.software/movies/${movie.slug || slug}`;

  const title = isSingle
    ? `${movie.title} (${movie.year}) — Download Full Movie (1080p FHD Direct) | Infyn`
    : `${movie.title} (${movie.year}) Web Series — Download All Episodes (1080p FHD) | Infyn`;

  const castNames = Array.isArray(movie.cast) ? movie.cast.slice(0, 4).join(", ") : movie.cast;
  const description = movie.synopsis
    ? `${movie.synopsis.slice(0, 155)}... Watch trailer & direct download ${movie.title} (${movie.year}) in 1080p Full HD with ${movie.language || "Hindi 5.1"}. Free & ad-free on Infyn.`
    : `Stream & direct download ${movie.title} (${movie.year}) in 1080p Full HD with ${movie.language || "Hindi 5.1"} untouched audio. High-speed direct downloads on Infyn.`;

  const keywords = [
    `${movie.title} download`,
    `${movie.title} 1080p download`,
    `${movie.title} ${movie.year}`,
    `${movie.title} full movie`,
    `${movie.title} direct download link`,
    `${movie.title} hindi 5.1`,
    `${movie.title} watch online`,
    isSingle ? "free hindi movie download" : "download web series all episodes",
    ...(Array.isArray(movie.genres) ? movie.genres.map((g) => `${g.toLowerCase()} movie download`) : []),
    ...(Array.isArray(movie.cast) ? movie.cast.slice(0, 3).map((c) => `${c} movies`) : []),
    "ad free movie download",
    "infyn movies",
    "1080p fhd fast download",
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Infyn",
      locale: "en_US",
      type: isSingle ? "video.movie" : "video.tv_show",
      images: [
        {
          url: posterUrl,
          width: 800,
          height: 1200,
          alt: `${movie.title} Poster`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [posterUrl],
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

  if (!movie) {
    return <>{children}</>;
  }

  const isSingle = !movie.episodes || movie.episodes.length <= 1;
  const posterUrl = getAbsolutePosterUrl(movie.poster);
  const canonicalUrl = `https://infyn.software/movies/${movie.slug || slug}`;

  // Structured Data (JSON-LD) tailored specifically for single Movie vs TVSeries
  const movieOrSeriesSchema = isSingle
    ? {
        "@context": "https://schema.org",
        "@type": "Movie",
        name: movie.title,
        headline: movie.tagline || movie.title,
        url: canonicalUrl,
        image: posterUrl,
        description: movie.synopsis,
        datePublished: movie.releaseDate || `${movie.year}-01-01`,
        duration: movie.duration,
        inLanguage: movie.language || "Hindi",
        contentRating: movie.contentRating || "U/A",
        genre: movie.genres,
        director: {
          "@type": "Person",
          name: movie.director,
        },
        actor: (Array.isArray(movie.cast) ? movie.cast : []).map((actor) => ({
          "@type": "Person",
          name: actor,
        })),
        aggregateRating: movie.rating
          ? {
              "@type": "AggregateRating",
              ratingValue: movie.rating,
              bestRating: 10,
              worstRating: 1,
              ratingCount: movie.votes || "100",
            }
          : undefined,
        trailer: movie.localTrailerUrl
          ? {
              "@type": "VideoObject",
              name: `${movie.title} Official Trailer`,
              description: `Official trailer for ${movie.title}`,
              thumbnailUrl: posterUrl,
              uploadDate: movie.releaseDate || `${movie.year}-01-01`,
              contentUrl: movie.localTrailerUrl.startsWith("http")
                ? movie.localTrailerUrl
                : `https://infyn.software${movie.localTrailerUrl}`,
            }
          : undefined,
      }
    : {
        "@context": "https://schema.org",
        "@type": "TVSeries",
        name: movie.title,
        headline: movie.tagline || movie.title,
        url: canonicalUrl,
        image: posterUrl,
        description: movie.synopsis,
        genre: movie.genres,
        inLanguage: movie.language || "Hindi",
        numberOfEpisodes: movie.episodes?.length || 1,
        director: {
          "@type": "Person",
          name: movie.director,
        },
        actor: (Array.isArray(movie.cast) ? movie.cast : []).map((actor) => ({
          "@type": "Person",
          name: actor,
        })),
        aggregateRating: movie.rating
          ? {
              "@type": "AggregateRating",
              ratingValue: movie.rating,
              bestRating: 10,
              worstRating: 1,
              ratingCount: movie.votes || "100",
            }
          : undefined,
        trailer: movie.localTrailerUrl
          ? {
              "@type": "VideoObject",
              name: `${movie.title} Official Trailer`,
              description: `Official trailer for ${movie.title}`,
              thumbnailUrl: posterUrl,
              uploadDate: movie.releaseDate || `${movie.year}-01-01`,
              contentUrl: movie.localTrailerUrl.startsWith("http")
                ? movie.localTrailerUrl
                : `https://infyn.software${movie.localTrailerUrl}`,
            }
          : undefined,
        containsSeason: {
          "@type": "TVSeason",
          seasonNumber: 1,
          numberOfEpisodes: movie.episodes?.length || 1,
          episode: (movie.episodes || []).map((ep) => ({
            "@type": "TVEpisode",
            episodeNumber: ep.episodeNumber,
            name: ep.title,
            description: ep.synopsis,
            duration: ep.duration,
          })),
        },
      };

  const breadcrumbsSchema = {
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
      {
        "@type": "ListItem",
        position: 3,
        name: movie.title,
        item: canonicalUrl,
      },
    ],
  };

  const jsonLd = [movieOrSeriesSchema, breadcrumbsSchema];

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
