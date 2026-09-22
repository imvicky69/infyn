"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Film,
  Star,
  Sparkles,
  ArrowRight,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Play,
  Download,
  Volume2,
} from "lucide-react";
import { Movie } from "@/types/movie";
import { getLiveMovies } from "@/lib/movies-firestore";

// High quality initial fallback data so feed is instantly populated
const FALLBACK_MOVIES: Movie[] = [
  {
    id: "indias-got-latent",
    slug: "indias-got-latent",
    title: "India's Got Latent - Member's Only",
    tagline: "Uncensored Comedy Showcase",
    synopsis: "Full uncut member episodes featuring unfiltered standup comedy and hilarious reactions.",
    year: 2026,
    releaseDate: "2026-01-15",
    duration: "45m / ep",
    rating: 8.9,
    votes: "14.2k",
    contentRating: "18+",
    genres: ["Comedy", "Talk Show"],
    director: "Samay Raina",
    cast: ["Samay Raina", "Various Comedians"],
    poster: "https://m.media-amazon.com/images/M/MV5BOTBiYzZiMzktMjNlYy00MmMxLThjNDQtMTUwY2JhMjEzZjBjXkEyXkFqcGc@._V1_FMjpg_UX848_.jpg",
    language: "Hindi",
    languages: ["Hindi 5.1"],
    quality: "1080p FHD",
    episodes: [],
    featured: true,
    trending: true,
  },
  {
    id: "waiting-hai",
    slug: "waiting-hai",
    title: "Waiting Hai",
    tagline: "A Gripping Tale of Ambition & Patience",
    synopsis: "Follow the intertwined journeys of three everyday strivers in the city seeking their breakthrough moment.",
    year: 2026,
    releaseDate: "2026-02-10",
    duration: "2h 14m",
    rating: 8.2,
    votes: "8.5k",
    contentRating: "UA 16+",
    genres: ["Drama", "Thriller"],
    director: "Karan Vyas",
    cast: ["Lead Cast", "Ensemble"],
    poster: "/movieData/waitingHai-poster.jpg",
    language: "Hindi",
    languages: ["Hindi 5.1", "English Subtitles"],
    quality: "1080p FHD",
    episodes: [],
    featured: true,
    trending: true,
  },
  {
    id: "zakir-khan-papa-yaar",
    slug: "zakir-khan-papa-yaar",
    title: "Zakir Khan: Papa Yaar",
    tagline: "Live Standup Comedy Special",
    synopsis: "Zakir Khan returns with his quintessential charm, heartfelt anecdotes about fathers, friendship, and growing up.",
    year: 2026,
    releaseDate: "2026-01-28",
    duration: "1h 22m",
    rating: 8.4,
    votes: "22.1k",
    contentRating: "U/A",
    genres: ["Comedy", "Stand-Up"],
    director: "Zakir Khan",
    cast: ["Zakir Khan"],
    poster: "/movieData/zakirPapaYaar-poster.png",
    language: "Hindi",
    languages: ["Hindi 5.1"],
    quality: "1080p FHD",
    episodes: [],
    featured: true,
    trending: true,
  },
];

export function HomeMoviesFeed() {
  const [movies, setMovies] = useState<Movie[]>(FALLBACK_MOVIES);
  const [isShuffling, setIsShuffling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch live movies from Firestore
  useEffect(() => {
    let isMounted = true;
    getLiveMovies()
      .then((live) => {
        if (isMounted && Array.isArray(live) && live.length > 0) {
          setMovies(live);
        }
      })
      .catch((err) => {
        console.warn("Home movies live fetch warning:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Shuffle handler
  const handleShuffle = () => {
    setIsShuffling(true);
    setMovies((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setTimeout(() => setIsShuffling(false), 300);
  };

  // Manual scroll controls
  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Multiply movie items so the marquee loops seamlessly without any blanks
  const duplicatedMovies = useMemo(() => {
    if (movies.length === 0) return [];
    // If fewer than 6 items, repeat enough times to fill a wide continuous stream
    const repeatCount = Math.max(2, Math.ceil(8 / movies.length));
    const items: Movie[] = [];
    for (let r = 0; r < repeatCount; r++) {
      items.push(...movies);
    }
    return items;
  }, [movies]);

  return (
    <section className="relative space-y-7 pt-4">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAEAE5] dark:border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 text-[11px] font-bold tracking-tight">
              <Film className="h-3 w-3" />
              Direct Entertainment
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
              1080p FHD · Hindi 5.1
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white tracking-[-0.02em]">
            Movies & Series Stream
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#6E6D68] dark:text-zinc-400">
            Untouched audio direct downloads & high-speed streaming. Zero popups, zero redirect chains.
          </p>
        </div>

        {/* Controls: Shuffle + Scroll Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleShuffle}
            title="Shuffle Movies Feed"
            className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 text-xs font-semibold text-[#111111] dark:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-750 transition-all ${
              isShuffling ? "rotate-180 scale-95" : ""
            }`}
          >
            <Shuffle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Shuffle Feed</span>
          </button>

          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Scroll Left"
              className="h-8 w-8 rounded-xl bg-white dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 flex items-center justify-center text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-750 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              aria-label="Scroll Right"
              className="h-8 w-8 rounded-xl bg-white dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 flex items-center justify-center text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white hover:bg-[#F5F4EE] dark:hover:bg-zinc-750 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Auto-Scroll Marquee Feed */}
      <div className="relative group/marquee overflow-hidden py-2 pause-hover">
        {/* Soft edge fade masks for desktop viewing */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#FBFBFA] dark:from-[#09090b] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#FBFBFA] dark:from-[#09090b] to-transparent z-10" />

        {/* Scrollable Container (supports auto-marquee + manual touch/wheel scroll) */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="animate-marquee-scroll flex items-center gap-5 pr-5">
            {duplicatedMovies.map((movie, idx) => {
              const movieKey = `${movie.slug || movie.id}-${idx}`;
              return (
                <Link
                  key={movieKey}
                  href={`/movies/${movie.slug || movie.id}`}
                  className="group relative w-[220px] sm:w-[250px] shrink-0 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800/80 bg-white dark:bg-[#141417] overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                >
                  {/* Poster Image Container */}
                  <div className="relative h-[290px] sm:h-[320px] w-full bg-zinc-900 overflow-hidden">
                    {movie.poster ? (
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        fill
                        sizes="(max-width: 640px) 220px, 250px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                        <Film className="h-12 w-12" />
                      </div>
                    )}

                    {/* Top Overlay Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-xs">
                        {movie.quality || "1080p FHD"}
                      </span>
                      {movie.rating && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-amber-300 border border-amber-500/30 shadow-xs">
                          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                          {movie.rating}
                        </span>
                      )}
                    </div>

                    {/* Bottom Gradient Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                    {/* Quick Hover CTA Badge */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-500 text-black shadow-md">
                        <Play className="h-3 w-3 fill-black" />
                        <span>Watch & Download</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[14px] font-bold text-[#111111] dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                        {movie.year && <span>{movie.year}</span>}
                        {movie.duration && (
                          <>
                            <span>·</span>
                            <span>{movie.duration}</span>
                          </>
                        )}
                        {movie.language && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">{movie.language}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Genre tags */}
                    {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1 overflow-hidden">
                        {movie.genres.slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-400 shrink-0"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Big "View All Movies" Button */}
      <div className="flex flex-col items-center justify-center pt-2 space-y-3">
        <Link
          href="/movies"
          className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-4.5 rounded-2xl bg-[#111111] hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-[#111111] text-base sm:text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          <Film className="h-5 w-5 text-emerald-400 dark:text-emerald-600 transition-transform group-hover:rotate-12 duration-200" />
          <span>Explore All Movies & Series (1080p Direct)</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <p className="text-[12px] text-[#9E9D98] dark:text-zinc-500 text-center font-medium">
          ⚡ 100% Free · Direct High-Speed CDN · Untouched 5.1 Audio · Zero Redirect Ads
        </p>
      </div>
    </section>
  );
}
