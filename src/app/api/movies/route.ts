import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import localMovies from "@/data/movies.json";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/movies
 * Optional query param: ?slug=xyz to fetch a single movie
 * Always queries live Firestore database first to reflect real-time updates.
 * Strips secret download URLs for client-side security.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  try {
    const db = getAdminFirestore();

    // 1. Fetch single movie by slug
    if (slug) {
      const doc = await db.collection("movies").doc(slug).get();
      if (doc.exists) {
        const data = doc.data()!;
        delete data.seasonDownloadUrl;
        if (Array.isArray(data.episodes)) {
          data.episodes = data.episodes.map((ep: { downloadUrl?: string; [key: string]: unknown }) => {
            const { downloadUrl, ...rest } = ep;
            return rest;
          });
        }
        return NextResponse.json(
          { success: true, movie: { ...data, slug: doc.id } },
          {
            headers: {
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
      }

      // Fallback to local catalog if doc not found
      const local = localMovies.find((m) => m.slug === slug);
      if (local) {
        return NextResponse.json(
          { success: true, movie: local },
          { headers: { "Cache-Control": "no-store" } }
        );
      }

      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    // 2. Fetch all movies from Firestore
    const snapshot = await db.collection("movies").get();
    if (!snapshot.empty) {
      const movies: Record<string, unknown>[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        delete data.seasonDownloadUrl;
        if (Array.isArray(data.episodes)) {
          data.episodes = data.episodes.map((ep: { downloadUrl?: string; [key: string]: unknown }) => {
            const { downloadUrl, ...rest } = ep;
            return rest;
          });
        }
        movies.push({ ...data, slug: doc.id });
      });

      // Sort: Featured first, then year descending
      movies.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return ((b.year as number) || 0) - ((a.year as number) || 0);
      });

      return NextResponse.json(
        { success: true, count: movies.length, movies },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }
  } catch (err) {
    console.warn("Live Firestore query error in /api/movies, using local backup:", err);
  }

  // Backup fallback
  return NextResponse.json(
    { success: true, count: localMovies.length, movies: localMovies },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
