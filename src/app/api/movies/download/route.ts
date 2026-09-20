import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import secretMovies from "@/data/server-movies-secret.json";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, target, episodeNumber, verificationToken, adViewDurationMs } = body;

    if (!slug || !target) {
      return NextResponse.json(
        { success: false, error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // Security check: Verify ad engagement (minimum 4.0 seconds of ad view/click)
    if (!verificationToken || typeof adViewDurationMs !== "number" || adViewDurationMs < 4000) {
      return NextResponse.json(
        {
          success: false,
          error: "Ad verification required. Please view the ad to unlock your download link.",
        },
        { status: 403 }
      );
    }

    let downloadUrl: string | null = null;
    let title = "";
    let size = "";

    // 1. Primary: ALWAYS fetch live directly from Firestore
    try {
      const db = getAdminFirestore();
      const movieDoc = await db.collection("movies").doc(slug).get();

      if (movieDoc.exists) {
        const data = movieDoc.data()!;
        const isSingleMovie = !data.episodes || data.episodes.length <= 1;

        if (target === "season" || target === "movie") {
          downloadUrl = data.seasonDownloadUrl || data.episodes?.[0]?.downloadUrl || null;
          title = isSingleMovie
            ? `${data.title} (1080p Full Movie)`
            : `${data.title} - Season 1 Complete Pack`;
          size = data.seasonSize || data.episodes?.[0]?.size || "";
        } else if (target === "episode" && episodeNumber) {
          const ep = data.episodes?.find(
            (e: { episodeNumber: number }) => e.episodeNumber === Number(episodeNumber)
          );
          if (ep) {
            downloadUrl = ep.downloadUrl || null;
            title = `${data.title} - Episode ${ep.episodeNumber}: ${ep.title}`;
            size = ep.size || "";
          }
        }
      }
    } catch (firestoreError) {
      console.warn("Firestore query warning in download route:", firestoreError);
    }

    // 2. Fallback only if Firestore document had no link
    if (!downloadUrl) {
      const fallbackMovie = secretMovies.find((m) => m.slug === slug);
      if (fallbackMovie) {
        const isSingleMovie = !fallbackMovie.episodes || fallbackMovie.episodes.length <= 1;
        if (target === "season" || target === "movie") {
          downloadUrl = fallbackMovie.seasonDownloadUrl || fallbackMovie.episodes?.[0]?.downloadUrl || null;
          title = isSingleMovie
            ? `${fallbackMovie.title} (1080p Full Movie)`
            : `${fallbackMovie.title} - Season 1 Complete Pack`;
          size = fallbackMovie.seasonSize || fallbackMovie.episodes?.[0]?.size || "";
        } else if (target === "episode" && episodeNumber) {
          const ep = fallbackMovie.episodes?.find(
            (e) => e.episodeNumber === Number(episodeNumber)
          );
          if (ep) {
            downloadUrl = ep.downloadUrl || null;
            title = `${fallbackMovie.title} - Episode ${ep.episodeNumber}: ${ep.title}`;
            size = ep.size || "";
          }
        }
      }
    }

    if (!downloadUrl) {
      return NextResponse.json(
        { success: false, error: "Download link not found for this title" },
        { status: 404 }
      );
    }

    // Return the protected download URL securely with no-cache headers
    return NextResponse.json(
      {
        success: true,
        downloadUrl,
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
