/**
 * Feed Zakir Khan: Papa Yaar (tt43679244) data directly to Firestore
 * Uses the running admin panel API or Firebase Admin SDK
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const zakirMovieData = {
  id: "zakir-khan-papa-yaar-2026",
  slug: "zakir-khan-papa-yaar",
  imdbId: "tt43679244",
  title: "Zakir Khan: Papa Yaar",
  tagline: "Pehle papa the, ab yaar hain.",
  synopsis: "In Papa Yaar, Zakir Khan draws from his personal childhood memories and family experiences to reflect on his relationship with his father. Through his signature blend of observational humor, poetry, and emotional storytelling, Zakir explores the unspoken sides of fatherhood, celebrating the values and lessons passed down through generations while acknowledging his father as a person with his own dreams, flaws, and stories.",
  year: 2026,
  releaseDate: "2026-09-18",
  duration: "1h 18min",
  rating: 8.4,
  votes: "4.2K",
  contentRating: "U/A 16+",
  genres: ["Comedy", "Stand-up"],
  director: "Karan Asnani",
  cast: ["Zakir Khan (as Self)"],
  poster: "/movieData/zakirPapaYaar-poster.png",
  localTrailerUrl: "",
  language: "Hindi (Original 5.1)",
  quality: "1080p FHD",
  seasonDownloadUrl: "https://drive.google.com/file/d/1_zakir_papa_yaar_full_special/view?usp=sharing",
  seasonSize: "1.42 GB",
  featured: true,
  episodes: [
    {
      episodeNumber: 1,
      title: "Zakir Khan: Papa Yaar (Full Stand-up Special)",
      duration: "1h 18min",
      size: "1.42 GB",
      downloadUrl: "https://drive.google.com/file/d/1_zakir_papa_yaar_full_special/view?usp=sharing",
      synopsis: "Full 78-minute stand-up special by Zakir Khan exploring the heartwarming journey of a father transitioning from an authority figure to a companion and friend."
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

async function feedToFirestore() {
  console.log("🔥 Initializing Firebase Admin to feed 'Zakir Khan: Papa Yaar' into Firestore...");

  const keyPath = path.resolve(__dirname, "../serviceAccountKey.json");
  if (!fs.existsSync(keyPath)) {
    throw new Error("serviceAccountKey.json not found in project root directory!");
  }

  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf-8"));

  const app = getApps().length > 0 ? getApps()[0] : initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || "in-fyn",
  });

  const db = getFirestore(app);

  const docRef = db.collection("movies").doc(zakirMovieData.slug);
  await docRef.set(zakirMovieData, { merge: true });

  console.log(`✅ Successfully seeded "${zakirMovieData.title}" (slug: ${zakirMovieData.slug}) to Firestore collection 'movies'!`);

  // Also sync to server-movies-secret.json and public movies.json
  const secretPath = path.resolve(__dirname, "../src/data/server-movies-secret.json");
  if (fs.existsSync(secretPath)) {
    const raw = fs.readFileSync(secretPath, "utf-8");
    const list = JSON.parse(raw);
    const existingIndex = list.findIndex(m => m.slug === zakirMovieData.slug);
    if (existingIndex >= 0) {
      list[existingIndex] = zakirMovieData;
    } else {
      list.push(zakirMovieData);
    }
    fs.writeFileSync(secretPath, JSON.stringify(list, null, 2), "utf-8");
    console.log("📄 Updated src/data/server-movies-secret.json");
  }

  const publicPath = path.resolve(__dirname, "../src/data/movies.json");
  if (fs.existsSync(publicPath)) {
    const raw = fs.readFileSync(publicPath, "utf-8");
    const list = JSON.parse(raw);
    // Strip secret download links for public safety
    const publicVersion = { ...zakirMovieData };
    delete publicVersion.seasonDownloadUrl;
    publicVersion.episodes = publicVersion.episodes.map(ep => {
      const { downloadUrl, ...rest } = ep;
      return rest;
    });

    const existingIndex = list.findIndex(m => m.slug === zakirMovieData.slug);
    if (existingIndex >= 0) {
      list[existingIndex] = publicVersion;
    } else {
      list.push(publicVersion);
    }
    fs.writeFileSync(publicPath, JSON.stringify(list, null, 2), "utf-8");
    console.log("📄 Updated src/data/movies.json (public catalog, zero download links leaked)");
  }

  console.log("🎉 All data fed successfully!");
}

feedToFirestore().catch(err => {
  console.error("❌ Error feeding data:", err);
  process.exit(1);
});
