import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import secretMovies from "@/data/server-movies-secret.json";

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

    const hasFirebaseCredentials =
      Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) ||
      Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS) ||
      Boolean(process.env.FIREBASE_PROJECT_ID);

    // 1. Attempt to fetch from Firestore if credentials are provided
    if (hasFirebaseCredentials) {
      try {
        const db = getAdminFirestore();
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Firestore timeout")), 2500)
        );
        const movieDoc = await Promise.race([
          db.collection("movies").doc(slug).get(),
          timeoutPromise,
        ]);

        if (movieDoc.exists) {
          const data = movieDoc.data()!;
          if (target === "season") {
            downloadUrl = data.seasonDownloadUrl || null;
            title = `${data.title} - Season 1 Complete Pack`;
            size = data.seasonSize || "";
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
        console.warn("Firestore query fallback to server-secret store:", firestoreError);
      }
    }

    // 2. Server-side secured dataset fallback
    if (!downloadUrl) {
      const fallbackMovie = secretMovies.find((m) => m.slug === slug);
      if (fallbackMovie) {
        if (target === "season") {
          downloadUrl = fallbackMovie.seasonDownloadUrl || null;
          title = `${fallbackMovie.title} - Season 1 Complete Pack`;
          size = fallbackMovie.seasonSize || "";
        } else if (target === "episode" && episodeNumber) {
          const ep = fallbackMovie.episodes.find(
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
        { success: false, error: "Download link not found" },
        { status: 404 }
      );
    }

    // Return the protected download URL securely
    return NextResponse.json({
      success: true,
      downloadUrl,
      title,
      size,
    });
  } catch (error) {
    console.error("Secure download API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
