import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow sufficient time for Render backend cold boot

interface MediaInfo {
  success: boolean;
  id: string;
  title: string;
  uploader: string;
  uploader_id?: string;
  duration?: number;
  thumbnail: string;
  video_url: string;
  audio_url?: string;
  download_url: string;
  audio_download_url?: string;
  filename: string;
  description?: string;
  like_count?: number;
  comment_count?: number;
}

// In-memory cache to serve identical reels instantly (15-minute TTL)
interface CacheEntry {
  data: MediaInfo;
  expiresAt: number;
}
const mediaCache = new Map<string, CacheEntry>();

function getCachedMedia(url: string): MediaInfo | null {
  const entry = mediaCache.get(url);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    mediaCache.delete(url);
    return null;
  }
  return entry.data;
}

function setCachedMedia(url: string, data: MediaInfo) {
  if (mediaCache.size > 200) {
    const firstKey = mediaCache.keys().next().value;
    if (firstKey) mediaCache.delete(firstKey);
  }
  mediaCache.set(url, {
    data,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });
}

function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[\\/*?:"<>|]/g, "").trim();
  return cleaned.slice(0, 80) || "instagram_reel";
}

function validateInstagramUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  return /https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p|reels|share)\/([a-zA-Z0-9_-]+)/i.test(url);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url?.trim();

    if (!url) {
      return NextResponse.json(
        { success: false, error: "Please provide an Instagram reel link." },
        { status: 400 }
      );
    }

    if (!validateInstagramUrl(url)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Instagram link. Please enter a valid Reel or Post URL (e.g., https://www.instagram.com/reel/...)",
        },
        { status: 400 }
      );
    }

    // 1. Check in-memory cache for instant 0ms response
    const cached = getCachedMedia(url);
    if (cached) {
      return NextResponse.json(cached);
    }

    const backendUrl =
      process.env.YT_DLP_BACKEND_URL || "https://infyn-1v7p.onrender.com";

    // Option A: Dedicated yt-dlp backend server URL (Render / Cloud Run / Hugging Face)
    if (backendUrl) {
      let backendRes: Response | null = null;
      let lastErrorMessage = "";

      // Try up to 2 attempts with a short delay if Render is in the middle of a cold boot
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 45000);

          backendRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/instagram`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (backendRes.ok) {
            break;
          }

          // If Render returned 502/503 during cold container spin-up, wait 3s and retry once
          if ((backendRes.status === 502 || backendRes.status === 503) && attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            continue;
          }
          break;
        } catch (fetchErr: any) {
          lastErrorMessage = fetchErr.message;
          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            continue;
          }
        }
      }

      try {
        if (!backendRes || !backendRes.ok) {
          const errData = backendRes ? await backendRes.json().catch(() => ({})) : {};
          throw new Error(
            errData.detail ||
              lastErrorMessage ||
              "Backend yt-dlp service returned an error. The server may still be initializing."
          );
        }

        const data = await backendRes.json();
        const safeFilename = sanitizeFilename(data.title || "instagram_reel");

        const result: MediaInfo = {
          success: true,
          id: data.id,
          title: data.title || "Instagram Reel",
          uploader: data.uploader || "Instagram Creator",
          uploader_id: data.uploader_id,
          duration: data.duration,
          thumbnail: data.thumbnail,
          video_url: data.video_url,
          audio_url: data.audio_url,
          download_url: `/api/instagram/stream?url=${encodeURIComponent(data.video_url)}&filename=${encodeURIComponent(`${safeFilename}.mp4`)}`,
          audio_download_url: data.audio_url
            ? `/api/instagram/stream?url=${encodeURIComponent(data.audio_url)}&filename=${encodeURIComponent(`${safeFilename}_audio.m4a`)}`
            : undefined,
          filename: `${safeFilename}.mp4`,
          description: data.description,
          like_count: data.like_count,
          comment_count: data.comment_count,
        };

        // Cache the successful result
        setCachedMedia(url, result);

        return NextResponse.json(result);
      } catch (backendError: any) {
        console.warn("External backend failed:", backendError.message);
        return NextResponse.json(
          {
            success: false,
            error:
              backendError.message ||
              "Unable to retrieve this Reel. Please verify the link is public and accessible.",
          },
          { status: 502 }
        );
      }
    }

    // Option B: Direct local yt-dlp execution via Node CLI (if hosted on non-serverless container)
    try {
      const { stdout } = await execFileAsync("yt-dlp", [
        "--dump-json",
        "-f",
        "b/best",
        "--no-playlist",
        "--no-warnings",
        url,
      ]);

      const data = JSON.parse(stdout);

      const title = data.fulltitle || data.title || "Instagram Reel";
      const uploader = data.uploader || data.channel || data.uploader_id || "Instagram Creator";
      const thumbnail = data.thumbnail || "";
      const duration = data.duration || 0;
      const shortcode = data.display_id || data.id || "reel";
      const safeFilename = sanitizeFilename(`${title} [${shortcode}]`);

      // Progressive video format (contains both video and audio)
      let videoUrl = data.url;
      const formats = data.formats || [];
      if (!videoUrl) {
        const progressiveFormats = formats.filter(
          (f: any) => f.vcodec !== "none" && f.acodec !== "none" && f.url
        );
        if (progressiveFormats.length > 0) {
          videoUrl = progressiveFormats[progressiveFormats.length - 1].url;
        }
      }

      // Audio format
      const audioFormats = formats.filter(
        (f: any) => f.vcodec === "none" && f.acodec !== "none" && f.url
      );
      const audioUrl = audioFormats.length > 0 ? audioFormats[audioFormats.length - 1].url : undefined;

      if (!videoUrl) {
        return NextResponse.json(
          { success: false, error: "Could not find a downloadable video stream for this reel." },
          { status: 404 }
        );
      }

      const result: MediaInfo = {
        success: true,
        id: shortcode,
        title,
        uploader,
        uploader_id: data.uploader_id,
        duration,
        thumbnail,
        video_url: videoUrl,
        audio_url: audioUrl,
        download_url: `/api/instagram/stream?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(`${safeFilename}.mp4`)}`,
        audio_download_url: audioUrl
          ? `/api/instagram/stream?url=${encodeURIComponent(audioUrl)}&filename=${encodeURIComponent(`${safeFilename}_audio.m4a`)}`
          : undefined,
        filename: `${safeFilename}.mp4`,
        description: data.description,
        like_count: data.like_count,
        comment_count: data.comment_count,
      };

      setCachedMedia(url, result);

      return NextResponse.json(result);
    } catch (cliError: any) {
      console.error("Local yt-dlp execution error:", cliError);
      return NextResponse.json(
        {
          success: false,
          error:
            cliError.message?.includes("Instagram sent an empty media response") ||
            cliError.message?.includes("Private video")
              ? "This reel appears to be private or requires Instagram login to view."
              : "Unable to retrieve this Reel. Please verify the link is public and accessible.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
