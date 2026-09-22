import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, target, episodeNumber } = body;

    if (!slug || !target) {
      return NextResponse.json(
        { success: false, error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    let downloadUrl: string | null = null;
    let title = "";
    let size = "";

    let specificError: string | null = null;

    // 1. Primary: ALWAYS fetch live directly from Firestore
    try {
      const db = getAdminFirestore();
      const movieDoc = await db.collection("movies").doc(slug).get();

      if (movieDoc.exists) {
        const data = movieDoc.data()!;
        const isSingleMovie = !data.episodes || data.episodes.length <= 1;

        if (target === "movie") {
          // Priority to episodes[0] for standalone movies/specials
          downloadUrl = data.episodes?.[0]?.downloadUrl || data.seasonDownloadUrl || null;
          size = data.episodes?.[0]?.size || data.seasonSize || "";
          title = `${data.title} (1080p Full Movie)`;
          if (!downloadUrl || downloadUrl.trim().length === 0) {
            specificError = `Download link for "${data.title}" has not been added to Firestore yet.`;
          }
        } else if (target === "season") {
          downloadUrl = isSingleMovie
            ? (data.episodes?.[0]?.downloadUrl || data.seasonDownloadUrl || null)
            : (data.seasonDownloadUrl || data.episodes?.[0]?.downloadUrl || null);
          size = isSingleMovie
            ? (data.episodes?.[0]?.size || data.seasonSize || "")
            : (data.seasonSize || data.episodes?.[0]?.size || "");
          title = isSingleMovie
            ? `${data.title} (1080p Full Movie)`
            : `${data.title} - Season 1 Complete Pack`;
          if (!downloadUrl || downloadUrl.trim().length === 0) {
            specificError = isSingleMovie
              ? `Download link for "${data.title}" has not been added to Firestore yet.`
              : "Season complete pack link is not available yet in Firestore. Please download individual episodes.";
          }
        } else if (target === "episode" && episodeNumber) {
          const ep = data.episodes?.find(
            (e: { episodeNumber: number }) => e.episodeNumber === Number(episodeNumber)
          );
          if (!ep) {
            specificError = `Episode ${episodeNumber} not found in Firestore for this title.`;
          } else if (!ep.downloadUrl || ep.downloadUrl.trim().length === 0) {
            specificError = `Download link for Episode ${ep.episodeNumber} has not been uploaded to Firestore yet.`;
          } else {
            downloadUrl = ep.downloadUrl;
            title = `${data.title} - Episode ${ep.episodeNumber}: ${ep.title}`;
            size = ep.size || "";
          }
        }
      } else {
        specificError = "Movie title not found in Firestore.";
      }
    } catch (firestoreError) {
      console.warn("Firestore query warning in download route:", firestoreError);
    }

    if (!downloadUrl || downloadUrl.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: specificError || "Download link not found for this title in Firestore" },
        { status: 404 }
      );
    }

    // Helper to generate in-browser stream embed for Mega and Google Drive
    const getStreamUrl = (url: string): string | null => {
      const trimmed = url.trim();
      if (trimmed.includes("mega.nz/file/")) {
        return trimmed.replace("mega.nz/file/", "mega.nz/embed/");
      }
      if (trimmed.includes("mega.nz/embed/")) {
        return trimmed;
      }
      if (trimmed.includes("drive.google.com/file/d/")) {
        const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          return `https://drive.google.com/file/d/${match[1]}/preview`;
        }
      }
      return null;
    };

    // Return the protected download URL securely with no-cache headers
    return NextResponse.json(
      {
        success: true,
        downloadUrl,
        streamUrl: getStreamUrl(downloadUrl),
        title,
        size,
        quality: "1080p FHD",
        verifiedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err) {
    console.error("Download route error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
