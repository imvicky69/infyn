import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

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

    const backendUrl = process.env.YT_DLP_BACKEND_URL;

    // Option A: If a dedicated yt-dlp backend server URL is configured
    if (backendUrl) {
      try {
        const backendRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/instagram`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!backendRes.ok) {
          const errData = await backendRes.json().catch(() => ({}));
          throw new Error(errData.detail || "Backend yt-dlp service returned an error.");
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

        return NextResponse.json(result);
      } catch (backendError: any) {
        console.warn("External backend failed, attempting local fallback:", backendError.message);
      }
    }

    // Option B: Direct local yt-dlp execution via Node CLI
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
