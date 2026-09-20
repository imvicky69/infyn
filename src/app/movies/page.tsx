"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import moviesData from "@/data/movies.json";
import { Movie } from "@/types/movie";
import {
  Search,
  Star,
  Play,
  Film,
  Sparkles,
  ArrowRight,
  X,
  Volume2,
  Clock,
  Calendar,
  Layers,
  ChevronDown,
  Info,
  Tv,
} from "lucide-react";

const MOVIES: Movie[] = moviesData as Movie[];

const ALL_GENRES = [
  "All",
  "Crime",
  "Drama",
  "Comedy",
  "Thriller",
  "Action",
];

type SortOption = "trending" | "rating" | "latest" | "title";

export default function MoviesPage() {
  const [moviesList, setMoviesList] = useState<Movie[]>(moviesData as Movie[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("trending");

  // Fetch live movies directly from Firestore
  useEffect(() => {
    let isMounted = true;
    async function loadLiveMovies() {
      try {
        const res = await fetch("/api/movies", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.movies) && isMounted) {
            setMoviesList(data.movies);
          }
        }
      } catch (err) {
        console.warn("Live movies query failed, using static catalog:", err);
      }
    }
    loadLiveMovies();
    return () => {
      isMounted = false;
    };
  }, []);

  // Featured Spotlight Movie
  const featuredMovie = useMemo(() => {
    return moviesList.find((m) => m.featured) || moviesList[0];
  }, [moviesList]);

  const isFeaturedSingleMovie =
    !featuredMovie?.episodes || featuredMovie.episodes.length <= 1;

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    return moviesList
      .filter((movie) => {
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          movie.title.toLowerCase().includes(query) ||
          movie.director?.toLowerCase().includes(query) ||
          (Array.isArray(movie.cast) &&
            movie.cast.some((actor) => actor.toLowerCase().includes(query))) ||
          (Array.isArray(movie.genres) &&
            movie.genres.some((g) => g.toLowerCase().includes(query))) ||
          movie.synopsis?.toLowerCase().includes(query);

        const matchesGenre =
          selectedGenre === "All" ||
          (Array.isArray(movie.genres) && movie.genres.includes(selectedGenre));

        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "latest") return b.year - a.year;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      });
  }, [moviesList, searchQuery, selectedGenre, sortBy]);

  return (
    <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-10">
        {/* Hero Spotlight Section - True Portrait Aspect Ratio Split Card */}
        {featuredMovie && !searchQuery && selectedGenre === "All" && (
          <section className="relative w-full rounded-3xl overflow-hidden border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] group">
            {/* Subtle Ambient Glow Orbs */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-[90px] pointer-events-none -z-0" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[80px] pointer-events-none -z-0" />

            <div className="relative z-10 p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Information, Synopsis & Actions */}
              <div className="lg:col-span-8 space-y-5 order-2 lg:order-1">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{featuredMovie.rating} IMDb</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    <Sparkles className="h-3 w-3" />
                    <span>
                      {isFeaturedSingleMovie
                        ? "Movie / Stand-up Special"
                        : "Season 1 Complete"}
                    </span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 text-xs font-semibold">
                    {featuredMovie.year}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 text-xs font-semibold">
                    {featuredMovie.duration}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-800 dark:text-indigo-300 text-xs font-bold">
                    {featuredMovie.language}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div className="space-y-1.5">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111111] dark:text-white">
                    {featuredMovie.title}
                  </h1>
                  {featuredMovie.tagline && (
                    <p className="text-sm sm:text-base italic text-amber-600 dark:text-amber-400 font-semibold">
                      &ldquo;{featuredMovie.tagline}&rdquo;
                    </p>
                  )}
                </div>

                {/* Synopsis */}
                <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-300 leading-relaxed max-w-2xl">
                  {featuredMovie.synopsis}
                </p>

                {/* Cast & Director details */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6E6D68] dark:text-zinc-400 pt-1">
                  <span>
                    <strong className="text-[#111111] dark:text-zinc-200">Director:</strong> {featuredMovie.director || "Production Director"}
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-[#111111] dark:text-zinc-200">Starring:</strong>{" "}
                    {Array.isArray(featuredMovie.cast)
                      ? featuredMovie.cast.slice(0, 3).join(", ")
                      : featuredMovie.cast}
                  </span>
                </div>

                {/* Action CTA */}
                <div className="pt-3">
                  <Link
                    href={`/movies/${featuredMovie.slug}`}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#111111] hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-black font-extrabold text-sm active:scale-95 transition-all shadow-md group/btn"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>
                      {isFeaturedSingleMovie
                        ? "View Movie & Download"
                        : "Watch Trailer & View Episodes"}
                    </span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Pristine Portrait Poster */}
              <div className="lg:col-span-4 flex justify-center lg:justify-end order-1 lg:order-2">
                <Link
                  href={`/movies/${featuredMovie.slug}`}
                  className="block relative w-full max-w-[260px] sm:max-w-[300px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-[#EAEAE5] dark:border-zinc-700/80 bg-zinc-950 group/poster transition-transform duration-300 hover:scale-[1.02]"
                >
                  <Image
                    src={featuredMovie.poster}
                    alt={featuredMovie.title}
                    fill
                    priority
                    sizes="(max-width: 640px) 260px, 300px"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover/poster:opacity-80 transition-opacity" />

                  {/* Floating Badges on Poster */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-amber-400 text-xs font-bold">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{featuredMovie.rating}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
                      {isFeaturedSingleMovie
                        ? "FULL MOVIE"
                        : `${featuredMovie.episodes?.length || 7} EPISODES`}
                    </span>
                  </div>

                  <div className="absolute bottom-3 inset-x-3 text-center pointer-events-none">
                    <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      Click to View Details →
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Filter, Search, and Catalog Header */}
        <div className="space-y-5">
          {/* Title and Stats Bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAEAE5] dark:border-zinc-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
                <Film className="h-3.5 w-3.5" />
                <span>Featured Film & Series</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-white">
                Movies & Web Series
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 mt-1">
                Browse detailed information, watch official trailers, and explore episode listings.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#6E6D68] dark:text-zinc-400 self-start sm:self-auto bg-[#F5F4EE] dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-800">
              <span>Catalog:</span>
              <span className="font-bold text-[#111111] dark:text-white">
                {filteredMovies.length} Available
              </span>
            </div>
          </div>

          {/* Search and Sort Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9D98] dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search series by title, cast, director, or keywords..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-[#141417] border border-[#EAEAE5] dark:border-zinc-800 focus:border-[#BEBDB9] dark:focus:border-zinc-600 focus:outline-none text-sm text-[#111111] dark:text-white placeholder-[#9E9D98] dark:placeholder-zinc-500 shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#9E9D98] hover:text-[#111111] dark:hover:text-white p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort movies by"
                className="w-full md:w-auto appearance-none pl-3.5 pr-9 py-3 rounded-2xl bg-white dark:bg-[#141417] border border-[#EAEAE5] dark:border-zinc-800 text-xs font-bold text-[#111111] dark:text-white focus:outline-none cursor-pointer shadow-2xs"
              >
                <option value="trending">🔥 Trending First</option>
                <option value="rating">★ Highest Rating</option>
                <option value="latest">🗓️ Newest Release</option>
                <option value="title">🔤 Title (A - Z)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9E9D98] pointer-events-none" />
            </div>
          </div>

          {/* Genre Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {ALL_GENRES.map((genre) => {
              const active = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-[#F5F4EE] dark:bg-zinc-900 text-[#6E6D68] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white hover:bg-[#ECEBE4] dark:hover:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-800"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Movies Grid: True Portrait Aspect Ratio (Zero Download Buttons on Movie Screen) */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredMovies.map((movie) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="group relative flex flex-col rounded-3xl overflow-hidden border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] hover:border-[#BEBDB9] dark:hover:border-zinc-700 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-all duration-300"
              >
                {/* Poster Container (Tall Portrait Aspect Ratio) */}
                <Link href={`/movies/${movie.slug}`} className="block relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover object-top group-hover:scale-103 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-transparent to-black/60 opacity-70 group-hover:opacity-85 transition-opacity" />

                  {/* Floating Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-amber-400 text-xs font-bold shadow-xs">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{movie.rating}</span>
                      </span>
                      {movie.trending && (
                        <span className="px-2 py-1 rounded-full bg-rose-500/90 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                          HOT
                        </span>
                      )}
                    </div>

                    <span className="px-2 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                      {!movie.episodes || movie.episodes.length <= 1
                        ? "Movie"
                        : `${movie.episodes.length} Episodes`}
                    </span>
                  </div>

                  {/* Hover Quick Overlay Details */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10 bg-gradient-to-t from-black via-black/90 to-transparent">
                    <p className="text-[11px] text-zinc-300 line-clamp-3 leading-relaxed mb-3">
                      {movie.synopsis}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                      <Volume2 className="h-3 w-3 text-indigo-400 shrink-0" />
                      <span className="truncate">{movie.languages ? movie.languages.join(" · ") : movie.language}</span>
                    </div>
                  </div>
                </Link>

                {/* Card Content */}
                <div className="flex flex-col flex-1 p-5 space-y-3">
                  {/* Meta Tags */}
                  <div className="flex items-center justify-between text-xs text-[#6E6D68] dark:text-zinc-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      <span>{movie.year}</span>
                      <span>•</span>
                      <Film className="h-3 w-3" />
                      <span>
                        {!movie.episodes || movie.episodes.length <= 1
                          ? movie.duration || "Feature Film"
                          : `${movie.episodes.length} Episodes`}
                      </span>
                    </div>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#F5F4EE] dark:bg-zinc-800 font-bold text-[#111111] dark:text-zinc-300">
                      {movie.contentRating}
                    </span>
                  </div>

                  {/* Title & Genres */}
                  <div>
                    <Link href={`/movies/${movie.slug}`}>
                      <h3 className="text-lg font-extrabold text-[#111111] dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {movie.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#6E6D68] dark:text-zinc-400 truncate mt-0.5">
                      {movie.genres.join(" · ")}
                    </p>
                  </div>

                  {/* Single CTA to Details (No Download Button on Movie Screen) */}
                  <div className="pt-3 mt-auto">
                    <Link
                      href={`/movies/${movie.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#111111] hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-black font-extrabold text-xs active:scale-98 transition-all shadow-2xs cursor-pointer group/link"
                    >
                      <span>View Film & Episodes</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty Search Results */
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-4 max-w-lg mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Search className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">
                No matching titles found
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
                We couldn&apos;t find anything matching &ldquo;{searchQuery}&rdquo;.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All");
              }}
              className="px-4 py-2 rounded-xl bg-[#111111] text-white dark:bg-white dark:text-black text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
