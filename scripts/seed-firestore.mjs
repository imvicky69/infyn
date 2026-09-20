/**
 * Seed Firestore with movies catalog and protected download links
 * Uses serviceAccountKey.json for administrative access
 * Run with: node scripts/seed-firestore.mjs
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  console.log("🔥 Initializing Firebase Admin with serviceAccountKey.json...");

  const keyPath = path.resolve(__dirname, "../serviceAccountKey.json");
  if (!fs.existsSync(keyPath)) {
    throw new Error("serviceAccountKey.json not found in project root directory!");
  }

  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf-8"));

  const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || "in-fyn",
  });

  const db = getFirestore(app);

  // Load the complete server dataset containing full metadata and secret download links
  const moviesPath = path.resolve(__dirname, "../src/data/server-movies-secret.json");
  const rawData = fs.readFileSync(moviesPath, "utf-8");
  const movies = JSON.parse(rawData);

  console.log(`📦 Found ${movies.length} movies to seed into Firestore collection 'movies'...`);

  for (const movie of movies) {
    const movieRef = db.collection("movies").doc(movie.slug);
    await movieRef.set(movie, { merge: true });
    console.log(`✅ Successfully seeded: "${movie.title}" (slug: ${movie.slug}) into Firestore!`);
  }

  console.log("🎉 Seeding complete! All movies and protected download links are live in Firestore.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding error:", err);
  process.exit(1);
});
