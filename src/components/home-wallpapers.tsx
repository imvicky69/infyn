import * as React from "react";
import Image from "next/image";
import { ExternalLink, Sparkles, Monitor, Smartphone, ArrowRight } from "lucide-react";

interface WallpaperItem {
  id: string;
  title: string;
  style: string;
  tags: string[];
  thumbnail: string;
  hasPhoneCrop?: boolean;
}

const FEATURED_WALLPAPERS: WallpaperItem[] = [
  {
    id: "sunflowers",
    title: "Sunflowers in Soft Morning Light",
    style: "Editorial Minimal",
    tags: ["Floral", "4K", "Warm"],
    thumbnail: "https://cdn.xweet.in/wallpapers/sunflowers-in-soft-morning-light-952605/thumbnail.webp",
    hasPhoneCrop: true,
  },
  {
    id: "midnight-amber",
    title: "Midnight Amber",
    style: "Dark Abstract",
    tags: ["AMOLED", "Moody", "Dark"],
    thumbnail: "https://cdn.xweet.in/wallpapers/thumbnails/midnight-amber.webp",
    hasPhoneCrop: true,
  },
  {
    id: "eclipse-cream",
    title: "Eclipse Cream",
    style: "Warm Minimal",
    tags: ["Tactile", "Geometry", "Neutral"],
    thumbnail: "https://cdn.xweet.in/wallpapers/thumbnails/eclipse-cream.webp",
    hasPhoneCrop: false,
  },
  {
    id: "midnight-dunes",
    title: "Midnight Dunes",
    style: "Earthy Dark",
    tags: ["Minimal", "Dunes", "Restraint"],
    thumbnail: "https://cdn.xweet.in/wallpapers/thumbnails/midnight-dunes.webp",
    hasPhoneCrop: true,
  },
  {
    id: "pastel-sunrise",
    title: "Pastel Sunrise",
    style: "Soft Gradient",
    tags: ["Pastel", "Dawn", "Aesthetic"],
    thumbnail: "https://cdn.xweet.in/wallpapers/thumbnails/pastel-sunrise.webp",
    hasPhoneCrop: false,
  },
  {
    id: "electric-blue-haze",
    title: "Electric Blue Haze",
    style: "Cool Abstract",
    tags: ["Neon", "Haze", "Cyber"],
    thumbnail: "https://cdn.xweet.in/wallpapers/thumbnails/electric-blue-haze.webp",
    hasPhoneCrop: true,
  },
];

export function XweetWallpapersShowcase() {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAEAE5] dark:border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-[11px] font-bold tracking-tight">
              <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              New Xweet Project
            </span>
            <span className="text-[11px] font-semibold text-[#9E9D98] dark:text-zinc-500">
              Curated 4K & 5K Masters
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white tracking-[-0.02em]">
            Xweet Wallpapers
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#6E6D68] dark:text-zinc-400 max-w-xl">
            Thoughtfully crafted minimal abstracts & natural earth tones. Uncompressed 4K backgrounds tailored for clean desks and phones.
          </p>
        </div>

        <a
          href="https://wallpaper.xweet.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#111111] dark:text-white bg-[#F5F4EE] dark:bg-zinc-800 hover:bg-[#EAEAE5] dark:hover:bg-zinc-700 transition-all border border-[#EAEAE5] dark:border-zinc-700 w-fit shrink-0 group active:scale-95 shadow-2xs"
        >
          <span>Open wallpaper.xweet.in</span>
          <ExternalLink className="h-3.5 w-3.5 text-[#6E6D68] dark:text-zinc-400 group-hover:text-[#111111] dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </a>
      </div>

      {/* Wallpapers Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURED_WALLPAPERS.map((wp) => (
          <a
            key={wp.id}
            href="https://wallpaper.xweet.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] overflow-hidden hover:border-[#BEBDB9] dark:hover:border-zinc-700 hover:shadow-md transition-all duration-300"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F5F4EE] dark:bg-zinc-900">
              <Image
                src={wp.thumbnail}
                alt={wp.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                unoptimized
              />

              {/* Gradient Scrim for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-40 group-hover:opacity-20 transition-opacity" />

              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase border border-white/10">
                  4K
                </span>
                {wp.hasPhoneCrop && (
                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-medium flex items-center gap-1 border border-white/10">
                    <Smartphone className="h-2.5 w-2.5" />
                    <span>Phone</span>
                  </span>
                )}
              </div>

              {/* Hover Quick Open prompt */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#111111] text-xs font-bold shadow-lg">
                  <span>View on Xweet</span>
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>

            {/* Meta Info */}
            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[14px] font-bold text-[#111111] dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {wp.title}
                </h3>
                <span className="text-[11px] font-medium text-[#9E9D98] dark:text-zinc-500 shrink-0">
                  {wp.style}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1 pt-0.5">
                {wp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#F5F4EE] dark:bg-zinc-800 text-[#6E6D68] dark:text-zinc-400 border border-[#EAEAE5] dark:border-zinc-700/60"
                  >
                    #{tag.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Quick Launch Banner */}
      <div className="rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-gradient-to-r from-[#FBFBFA] via-white to-[#FBFBFA] dark:from-[#141417] dark:via-[#18181B] dark:to-[#141417] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <h4 className="text-sm font-bold text-[#111111] dark:text-white">
              Discover Full-Fidelity 4K & 5K Wallpaper Drops
            </h4>
          </div>
          <p className="text-xs text-[#6E6D68] dark:text-zinc-400 max-w-xl">
            Free uncompressed desktop master downloads, phone lockscreen crops, and clean tactile textures with zero ads.
          </p>
        </div>

        <a
          href="https://wallpaper.xweet.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm shrink-0"
        >
          <span>Explore All at wallpaper.xweet.in</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}
