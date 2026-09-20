import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";

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

        if (target === "movie") {
          // Priority to episodes[0] for standalone movies/specials
          downloadUrl = data.episodes?.[0]?.downloadUrl || data.seasonDownloadUrl || null;
          size = data.episodes?.[0]?.size || data.seasonSize || "";
          title = `${data.title} (1080p Full Movie)`;
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
