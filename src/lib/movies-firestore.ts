import { firestore } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Movie } from "@/types/movie";

/**
 * Fetch all movies directly from Firestore using client SDK with public keys.
 * Falls back to /api/movies if client-side Firestore security rules are restricted.
 * Completely zero local JSON dependency.
 */
export async function getLiveMovies(): Promise<Movie[]> {
  try {
    const colRef = collection(firestore, "movies");
    const snapshot = await getDocs(colRef);

    if (!snapshot.empty) {
      const movies: Movie[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as Movie;
        movies.push({
          ...data,
          slug: d.id,
        });
      });

      // Sort: featured first, then year descending
      return movies.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.year || 0) - (a.year || 0);
      });
    }
  } catch (err) {
    console.warn("Client Firestore getDocs failed, trying /api/movies:", err);
  }

  // Fallback to Next.js API route which queries live Firestore
  try {
    const res = await fetch("/api/movies", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.movies)) {
        return json.movies;
      }
    }
  } catch (apiErr) {
    console.error("Failed to fetch movies from /api/movies:", apiErr);
  }

  return [];
}

/**
 * Fetch a single movie by slug directly from Firestore.
 */
export async function getLiveMovieBySlug(slug: string): Promise<Movie | null> {
  try {
    const docRef = doc(firestore, "movies", slug);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data() as Movie;
      return {
        ...data,
        slug: snap.id,
      };
    }
  } catch (err) {
    console.warn(`Client Firestore getDoc for ${slug} failed, trying /api/movies:`, err);
  }

  // Fallback to /api/movies?slug=${slug}
  try {
    const res = await fetch(`/api/movies?slug=${encodeURIComponent(slug)}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.movie) {
        return json.movie;
      }
    }
  } catch (apiErr) {
    console.error(`Failed to fetch movie ${slug} from /api/movies:`, apiErr);
  }

  return null;
}

/**
 * Convert cloud storage links (Mega.nz, Google Drive) to embeddable stream player URLs
 */
export function getStreamUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // Mega.nz: https://mega.nz/file/ID#KEY -> https://mega.nz/embed/ID#KEY
  if (trimmed.includes("mega.nz/file/")) {
    return trimmed.replace("mega.nz/file/", "mega.nz/embed/");
  }
  if (trimmed.includes("mega.nz/embed/")) {
    return trimmed;
  }
  // Google Drive: https://drive.google.com/file/d/ID/view... -> https://drive.google.com/file/d/ID/preview
  if (trimmed.includes("drive.google.com/file/d/")) {
    const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }
  return null;
}

/**
 * Fetch download URL and metadata directly from Firestore after ad view.
 * Handles movie vs season vs episode resolution with correct size and link priority.
 */
export async function getLiveDownloadLink(params: {
  slug: string;
  target: "season" | "episode" | "movie";
  episodeNumber?: number;
}): Promise<{
  success: boolean;
  downloadUrl?: string;
  streamUrl?: string;
  title?: string;
  size?: string;
  error?: string;
}> {
  const { slug, target, episodeNumber } = params;

  try {
    const docRef = doc(firestore, "movies", slug);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data() as Movie;
      const isSingleMovie = !data.episodes || data.episodes.length <= 1;

      if (target === "movie" || target === "season") {
        // Priority to episode[0] if single movie, else seasonDownloadUrl
        const rawUrl = isSingleMovie
          ? (data.episodes?.[0]?.downloadUrl || data.seasonDownloadUrl || null)
          : (data.seasonDownloadUrl || data.episodes?.[0]?.downloadUrl || null);

        const downloadUrl = rawUrl && rawUrl.trim().length > 0 ? rawUrl.trim() : null;

        const size = isSingleMovie
          ? (data.episodes?.[0]?.size || data.seasonSize || "")
          : (data.seasonSize || data.episodes?.[0]?.size || "");

        const title = isSingleMovie
          ? `${data.title} (1080p Full Movie)`
          : `${data.title} - Season 1 Complete Pack`;

        if (downloadUrl) {
          return {
            success: true,
            downloadUrl,
            streamUrl: getStreamUrl(downloadUrl) || undefined,
            title,
            size,
          };
        }
      } else if (target === "episode" && episodeNumber) {
        const ep = data.episodes?.find((e) => e.episodeNumber === Number(episodeNumber));
        if (ep) {
          const downloadUrl = ep.downloadUrl && ep.downloadUrl.trim().length > 0 ? ep.downloadUrl.trim() : null;
          if (downloadUrl) {
            return {
              success: true,
              downloadUrl,
              streamUrl: getStreamUrl(downloadUrl) || undefined,
              title: `${data.title} - Episode ${ep.episodeNumber}: ${ep.title}`,
              size: ep.size || "",
            };
          } else {
            return {
              success: false,
              error: `Download link for Episode ${ep.episodeNumber} has not been uploaded to Firestore yet.`,
            };
          }
        }
      }
    }
  } catch (err) {
    console.warn("Client Firestore getDoc for download failed, trying /api/movies/download:", err);
  }

  // Fallback to server route (which queries Firestore via Admin SDK)
  try {
    const res = await fetch("/api/movies/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        target,
        episodeNumber,
      }),
    });

    const json = await res.json().catch(() => null);

    if (res.ok && json?.success && json.downloadUrl) {
      return {
        success: true,
        downloadUrl: json.downloadUrl,
        streamUrl: json.streamUrl || getStreamUrl(json.downloadUrl) || undefined,
        title: json.title,
        size: json.size,
      };
    }

    if (json?.error) {
      return { success: false, error: json.error };
    }
  } catch (err) {
    console.error("API route download fallback failed:", err);
  }

  return { success: false, error: "Download link not found in Firestore" };
}
