"use client";

import * as React from "react";
import { useState, useMemo, use, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import moviesData from "@/data/movies.json";
import { Movie, Episode } from "@/types/movie";
import {
  GoogleAdDownloadModal,
  DownloadTarget,
} from "@/components/movies/google-ad-download-modal";
import {
  Star,
  Download,
  Play,
  Film,
  Sparkles,
  ArrowLeft,
  Check,
  Copy,
  Clock,
  Calendar,
  Layers,
  Tv,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function MovieDetailPage({ params }: PageProps) {
  const { slug } = use(params);

  // Movie from JSON data
  const movie = useMemo(() => {
    return (moviesData as Movie[]).find((m) => m.slug === slug);
  }, [slug]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Google Ad Download Modal State
  const [activeDownload, setActiveDownload] = useState<DownloadTarget | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  // Video trailer ref & playback state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast("Download link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const triggerDownloadFlow = (target: DownloadTarget) => {
    setActiveDownload(target);
    setIsAdModalOpen(true);
  };

  const handleDownloadClick = (title: string, size?: string) => {
    showToast(`Opening download: ${title} (1080p${size ? ` • ${size}` : ""})`);
  };

  const togglePlayTrailer = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <Film className="h-12 w-12 text-zinc-400" />
          <h1 className="text-2xl font-bold">Movie Not Found</h1>
          <p className="text-zinc-500 text-sm max-w-md">
            The title you requested could not be found or has been moved.
          </p>
          <Link
            href="/movies"
            className="px-4 py-2 rounded-xl bg-[#111111] text-white dark:bg-white dark:text-black text-xs font-bold"
          >
            Back to Movies
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />
      <Breadcrumbs />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#111111] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xl border border-white/10 dark:border-zinc-800"
          >
            <div className="h-7 w-7 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#6E6D68] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Titles</span>
          </Link>
        </div>

        {/* Cinematic Hero: True Portrait Poster + Metadata */}
        <section className="relative rounded-3xl overflow-hidden border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Big Portrait Poster (Strictly Preserves True Aspect Ratio) */}
            <div className="lg:col-span-4 w-full max-w-[320px] mx-auto lg:mx-0">
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl border border-[#EAEAE5] dark:border-zinc-700/80 group">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 320px, 360px"
                  className="object-cover object-top group-hover:scale-102 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-amber-400 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{movie.rating} IMDb</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-extrabold uppercase tracking-wider">
                    {movie.episodes?.length || 7} Episodes
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-center pointer-events-none">
                  <span className="text-[11px] font-bold text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    IMDb: {movie.imdbId}
                  </span>
                </div>
              </div>
            </div>

            {/* Series Information & Details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  1080p FHD
                </span>
                <span className="px-3 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#111111] dark:text-zinc-200 text-xs font-bold">
                  {movie.contentRating}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-400 text-xs font-semibold">
                  {movie.releaseDate}
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-800 dark:text-indigo-300 text-xs font-bold">
                  {movie.language}
                </span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-1.5">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] dark:text-white">
                  {movie.title}
                </h1>
                <p className="text-base sm:text-lg italic text-amber-600 dark:text-amber-400 font-semibold">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#9E9D98] dark:text-zinc-500">
                  Series Overview & Premise
                </h2>
                <p className="text-sm sm:text-base text-[#6E6D68] dark:text-zinc-300 leading-relaxed">
                  {movie.synopsis}
                </p>
              </div>

              {/* Cast and Director Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs border-t border-[#EAEAE5] dark:border-zinc-800/80">
                <div className="space-y-1">
                  <span className="font-bold text-[#9E9D98] dark:text-zinc-500 uppercase tracking-wider text-[10px]">
                    Director
                  </span>
                  <p className="font-bold text-sm text-[#111111] dark:text-white">
                    {movie.director}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-[#9E9D98] dark:text-zinc-500 uppercase tracking-wider text-[10px]">
                    Genres
                  </span>
                  <p className="font-bold text-sm text-[#111111] dark:text-white">
                    {movie.genres.join(", ")}
                  </p>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <span className="font-bold text-[#9E9D98] dark:text-zinc-500 uppercase tracking-wider text-[10px]">
                    Starring Cast
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {movie.cast.map((actor, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-[#F5F4EE] dark:bg-zinc-900 border border-[#EAEAE5] dark:border-zinc-800 text-xs font-semibold text-[#111111] dark:text-zinc-300"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <a
                  href="#episodes"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#111111] hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-black font-extrabold text-xs active:scale-95 transition-all shadow-2xs"
                >
                  <Tv className="h-4 w-4" />
                  <span>Download Episodes ({movie.episodes?.length || 7})</span>
                </a>

                <button
                  type="button"
                  onClick={togglePlayTrailer}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-[#F5F4EE] hover:bg-[#EAEAE5] dark:bg-zinc-900 dark:hover:bg-zinc-800 text-[#111111] dark:text-white font-bold text-xs active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                  <span>{isPlaying ? "Pause Trailer" : "Watch Official Trailer"}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Video Trailer Player */}
        {movie.localTrailerUrl && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight flex items-center gap-2">
                <Film className="h-5 w-5 text-emerald-600" />
                <span>Official Trailer</span>
              </h2>
              <p className="text-xs text-[#6E6D68] dark:text-zinc-400 mt-0.5">
                Official preview for Waiting Hai
              </p>
            </div>

            <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-[#EAEAE5] dark:border-zinc-800 shadow-xl">
              <video
                ref={videoRef}
                src={movie.localTrailerUrl}
                poster={movie.poster}
                controls
                playsInline
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          </section>
        )}

        {/* Complete Season 1 1080p Pack */}
        {movie.seasonSize && (
          <section className="p-6 sm:p-8 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Season 1 Complete Pack</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                  Download All Episodes (1080p Full HD)
                </h2>
                <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
                  Complete archive containing all 7 episodes in 1080p FHD with Hindi 5.1 original audio • {movie.seasonSize || "7.8 GB"}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    triggerDownloadFlow({
                      slug: movie.slug,
                      target: "season",
                      title: `${movie.title} - Season 1 Complete Pack`,
                      size: movie.seasonSize || "5.4 GB",
                      poster: movie.poster,
                      quality: "1080p FHD",
                    })
                  }
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Season Pack ({movie.seasonSize || "5.4 GB"})</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Individual Episode Listing (Single 1080p Quality, Zero Frontend CRUD) */}
        <section id="episodes" className="space-y-6">
          <div className="border-b border-[#EAEAE5] dark:border-zinc-800 pb-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] dark:text-white tracking-tight flex items-center gap-2.5">
              <Tv className="h-6 w-6 text-emerald-600" />
              <span>Episodes ({movie.episodes?.length || 7})</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 mt-1">
              Download individual episodes in 1080p Full HD with Hindi 5.1 original audio.
            </p>
          </div>

          {/* Episode List */}
          <div className="space-y-4">
            {movie.episodes?.map((ep) => (
              <div
                key={ep.episodeNumber}
                className="p-5 sm:p-6 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] hover:border-[#BEBDB9] dark:hover:border-zinc-700 shadow-2xs transition-all space-y-4"
              >
                {/* Header: Ep Number, Title, Runtime */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F4EE] dark:border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
                      EP {ep.episodeNumber < 10 ? `0${ep.episodeNumber}` : ep.episodeNumber}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-[#111111] dark:text-white">
                        {ep.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#6E6D68] dark:text-zinc-400">
                        <Clock className="h-3 w-3" />
                        <span>{ep.duration}</span>
                        <span>•</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          1080p FHD ({ep.size})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for this episode */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() =>
                        triggerDownloadFlow({
                          slug: movie.slug,
                          target: "episode",
                          episodeNumber: ep.episodeNumber,
                          title: `${movie.title} - Episode ${ep.episodeNumber < 10 ? `0${ep.episodeNumber}` : ep.episodeNumber}: ${ep.title}`,
                          size: ep.size,
                          poster: movie.poster,
                          quality: "1080p FHD",
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download 1080p ({ep.size})</span>
                    </button>
                  </div>
                </div>

                {/* Synopsis */}
                <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-300 leading-relaxed">
                  {ep.synopsis}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Google Ads Interstitial Modal for Downloads */}
      <GoogleAdDownloadModal
        isOpen={isAdModalOpen}
        onClose={() => {
          setIsAdModalOpen(false);
          setActiveDownload(null);
        }}
        downloadData={activeDownload}
        onDownloadStarted={handleDownloadClick}
      />

      <Footer />
    </div>
  );
}
