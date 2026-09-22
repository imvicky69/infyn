import { MetadataRoute } from "next";
import { getAdminFirestore } from "@/lib/firebase-admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://infyn.software";

  // Core static landing, utility, and category routes
  const staticRoutes = [
    "",
    "/image",
    "/image/png-to-svg",
    "/image/qr-code",
    "/image/bg-remover",
    "/image/compressor",
    "/image/converter",
    "/image/exif-remover",
    "/image/heic-to-jpg",
    "/image/resizer",
    "/image/img-to-pdf",
    "/pdf",
    "/pdf/compressor",
    "/pdf/merger",
    "/pdf/protector",
    "/pdf/splitter",
    "/pdf/unlocker",
    "/pdf/pdf-to-image",
    "/movies",
    "/apps",
    "/dl",
    "/home-tab",
    "/sponsor",
    "/dev",
    "/dev/base64",
    "/dev/svg-cleaner",
    "/contributing",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : route.split("/").length === 2 ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route.split("/").length === 2 ? 0.9 : 0.8,
  }));

  // Dynamically query all movies from Firestore for inclusion in XML sitemap
  const movieEntries: MetadataRoute.Sitemap = [];

  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("movies").get();

    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        const data = doc.data();
        movieEntries.push({
          url: `${baseUrl}/movies/${doc.id}`,
          lastModified: data.releaseDate ? new Date(data.releaseDate) : new Date(),
          changeFrequency: "weekly",
          priority: 0.85,
        });
      });
    }
  } catch (err) {
    console.warn("Failed to fetch movies from Firestore for sitemap, using fallbacks:", err);
  }

  // Ensure default/fallback titles are always present if Firestore is offline
  if (movieEntries.length === 0) {
    const fallbackSlugs = ["indias-got-latent", "waiting-hai", "zakir-khan-papa-yaar"];
    for (const slug of fallbackSlugs) {
      movieEntries.push({
        url: `${baseUrl}/movies/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
  }

  return [...staticEntries, ...movieEntries];
}
