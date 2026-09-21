/**
 * Standalone Admin Panel Backend
 * Connects to Firebase Firestore using serviceAccountKey.json
 * Provides REST API for Movies CRUD operations
 */

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin123";

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static frontend assets from public/
app.use(express.static(path.join(__dirname, "public")));

// Serve public movieData assets for live preview in admin panel
const movieDataDir = path.resolve(__dirname, "../public/movieData");
if (!fs.existsSync(movieDataDir)) {
  fs.mkdirSync(movieDataDir, { recursive: true });
}
app.use("/movieData", express.static(movieDataDir));

// Initialize Firebase Admin
let db = null;
let initError = null;

function initFirebase() {
  try {
    if (admin.apps.length > 0) {
      db = admin.firestore();
      return;
    }

    let serviceAccount = null;

    // 1. Check environment variable for raw JSON or Base64 string
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      let raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
      if (raw.startsWith("{")) {
        serviceAccount = JSON.parse(raw);
      } else {
        const decoded = Buffer.from(raw, "base64").toString("utf-8");
        serviceAccount = JSON.parse(decoded);
      }
    } else {
      // 2. Check local file paths
      const candidatePaths = [
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
        path.resolve(__dirname, "serviceAccountKey.json"),
        path.resolve(__dirname, "../serviceAccountKey.json"),
      ].filter(Boolean);

      for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
          serviceAccount = JSON.parse(fs.readFileSync(p, "utf-8"));
          console.log(`🔑 Loaded Firebase service account key from: ${p}`);
          break;
        }
      }
    }

    if (!serviceAccount) {
      throw new Error(
        "serviceAccountKey.json not found! Please place serviceAccountKey.json in admin-panel/ or set FIREBASE_SERVICE_ACCOUNT_KEY env."
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id || "in-fyn",
    });

    db = admin.firestore();
    console.log(`🔥 Firebase Admin connected successfully to project: ${serviceAccount.project_id}`);
  } catch (err) {
    initError = err.message;
    console.error("❌ Firebase Admin initialization failed:", err.message);
  }
}

initFirebase();

// Admin Authentication Middleware for mutating routes
function requireAdmin(req, res, next) {
  const providedKey = req.headers["x-admin-key"] || req.query.adminKey;
  if (!providedKey || providedKey !== ADMIN_SECRET) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid or missing Admin Secret Key.",
    });
  }
  next();
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health / Status
app.get("/api/status", (req, res) => {
  res.json({
    status: db ? "connected" : "error",
    firebaseConnected: !!db,
    error: initError,
    timestamp: new Date().toISOString(),
  });
});

// GET all movies
app.get("/api/movies", async (req, res) => {
  if (!db) {
    return res.status(503).json({ success: false, error: "Database not connected: " + initError });
  }

  try {
    const snapshot = await db.collection("movies").get();
    const movies = [];
    snapshot.forEach((doc) => {
      movies.push({ ...doc.data(), slug: doc.id });
    });

    // Sort by year descending, or title
    movies.sort((a, b) => (b.year || 0) - (a.year || 0) || a.title?.localeCompare(b.title));

    res.json({ success: true, count: movies.length, movies });
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single movie by slug
app.get("/api/movies/:slug", async (req, res) => {
  if (!db) {
    return res.status(503).json({ success: false, error: "Database not connected" });
  }

  try {
    const doc = await db.collection("movies").doc(req.params.slug).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: "Movie not found" });
    }
    res.json({ success: true, movie: { ...doc.data(), slug: doc.id } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/upload - Direct Image Upload (Posters, Episode Thumbnails)
app.post("/api/upload", requireAdmin, async (req, res) => {
  try {
    const { filename, data, type = "media" } = req.body;

    if (!data) {
      return res.status(400).json({ success: false, error: "Image data is required" });
    }

    // Determine extension & base64 content
    let ext = "jpg";
    let base64Data = data;

    if (data.startsWith("data:")) {
      const match = data.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,/);
      if (match) {
        ext = match[1] === "jpeg" ? "jpg" : match[1];
        base64Data = data.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");
      }
    } else if (filename && filename.includes(".")) {
      ext = filename.split(".").pop().toLowerCase();
    }

    // Clean original name
    const rawName = (filename ? filename.replace(/\.[^/.]+$/, "") : "image")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 30);

    const safeFilename = `${type}-${rawName}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(base64Data, "base64");

    // Save locally to ../public/movieData/
    const targetDir = path.resolve(__dirname, "../public/movieData");
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetFilePath = path.join(targetDir, safeFilename);
    fs.writeFileSync(targetFilePath, buffer);

    const localUrl = `/movieData/${safeFilename}`;
    let finalUrl = localUrl;

    // Optional: Upload to Firebase Storage bucket if available
    try {
      if (admin.apps.length > 0) {
        const bucketName =
          process.env.FIREBASE_STORAGE_BUCKET ||
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
          "in-fyn.firebasestorage.app";
        const bucket = admin.storage().bucket(bucketName);
        const destination = `${type === "thumbnail" ? "thumbnails" : "posters"}/${safeFilename}`;
        const file = bucket.file(destination);

        await file.save(buffer, {
          metadata: {
            contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
          },
        });

        await file.makePublic().catch(() => {});
        finalUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
        console.log(`☁️ [Storage] Uploaded to Firebase Storage: ${finalUrl}`);
      }
    } catch (storageErr) {
      console.warn("Firebase Storage upload skipped or failed, using local asset URL:", storageErr.message);
      finalUrl = localUrl;
    }

    console.log(`📸 [Admin] Image uploaded successfully: ${finalUrl}`);
    res.json({
      success: true,
      url: finalUrl,
      localUrl: localUrl,
      filename: safeFilename,
      sizeBytes: buffer.length,
    });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create a new movie
app.post("/api/movies", requireAdmin, async (req, res) => {
  if (!db) {
    return res.status(503).json({ success: false, error: "Database not connected" });
  }

  try {
    const movieData = req.body;
    if (!movieData.title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    // Generate slug if not provided
    const slug = (
      movieData.slug ||
      movieData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    ).trim();

    if (!slug) {
      return res.status(400).json({ success: false, error: "Valid slug is required" });
    }

    // Format fields
    const formattedMovie = {
      id: movieData.id || `${slug}-${movieData.year || new Date().getFullYear()}`,
      slug: slug,
      title: movieData.title,
      imdbId: movieData.imdbId || "",
      tagline: movieData.tagline || "",
      synopsis: movieData.synopsis || "",
      year: Number(movieData.year) || new Date().getFullYear(),
      releaseDate: movieData.releaseDate || new Date().toISOString().split("T")[0],
      duration: movieData.duration || "1 Season",
      rating: Number(movieData.rating) || 8.0,
      votes: movieData.votes || "1K",
      contentRating: movieData.contentRating || "U/A 16+",
      genres: Array.isArray(movieData.genres)
        ? movieData.genres
        : (movieData.genres || "")
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean),
      director: movieData.director || "",
      cast: Array.isArray(movieData.cast)
        ? movieData.cast
        : (movieData.cast || "")
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
      poster: movieData.poster || "/movieData/default-poster.jpg",
      localTrailerUrl: movieData.localTrailerUrl || "",
      language: movieData.language || "Hindi (Original 5.1)",
      quality: movieData.quality || "1080p FHD",
      seasonDownloadUrl: movieData.seasonDownloadUrl || "",
      seasonSize: movieData.seasonSize || "",
      featured: Boolean(movieData.featured),
      episodes: Array.isArray(movieData.episodes)
        ? movieData.episodes.map((ep, idx) => ({
            episodeNumber: Number(ep.episodeNumber) || idx + 1,
            title: ep.title || `Episode ${idx + 1}`,
            duration: ep.duration || "",
            size: ep.size || "",
            downloadUrl: ep.downloadUrl || "",
            synopsis: ep.synopsis || "",
            thumbnail: ep.thumbnail ? String(ep.thumbnail).trim() : "",
          }))
        : [],
      updatedAt: new Date().toISOString(),
      createdAt: movieData.createdAt || new Date().toISOString(),
    };

    await db.collection("movies").doc(slug).set(formattedMovie);

    console.log(`✅ [Admin] Created new movie: "${formattedMovie.title}" (${slug})`);
    res.status(201).json({ success: true, movie: formattedMovie });
  } catch (err) {
    console.error("Error creating movie:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update an existing movie
app.put("/api/movies/:slug", requireAdmin, async (req, res) => {
  if (!db) {
    return res.status(503).json({ success: false, error: "Database not connected" });
  }

  try {
    const slug = req.params.slug;
    const updateData = { ...req.body };

    // Format genres and cast if sent as comma-separated strings
    if (typeof updateData.genres === "string") {
      updateData.genres = updateData.genres
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);
    }

    if (typeof updateData.cast === "string") {
      updateData.cast = updateData.cast
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
    }

    if (updateData.year) updateData.year = Number(updateData.year);
    if (updateData.rating) updateData.rating = Number(updateData.rating);

    if (Array.isArray(updateData.episodes)) {
      updateData.episodes = updateData.episodes.map((ep, idx) => ({
        episodeNumber: Number(ep.episodeNumber) || idx + 1,
        title: ep.title || `Episode ${idx + 1}`,
        duration: ep.duration || "",
        size: ep.size || "",
        downloadUrl: ep.downloadUrl || "",
        synopsis: ep.synopsis || "",
        thumbnail: ep.thumbnail ? String(ep.thumbnail).trim() : "",
      }));
    }

    updateData.updatedAt = new Date().toISOString();

    await db.collection("movies").doc(slug).set(updateData, { merge: true });

    console.log(`✏️ [Admin] Updated movie: "${slug}"`);
    res.json({ success: true, message: "Movie updated successfully", slug });
  } catch (err) {
    console.error("Error updating movie:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE a movie
app.delete("/api/movies/:slug", requireAdmin, async (req, res) => {
  if (!db) {
    return res.status(503).json({ success: false, error: "Database not connected" });
  }

  try {
    const slug = req.params.slug;
    await db.collection("movies").doc(slug).delete();

    console.log(`🗑️ [Admin] Deleted movie: "${slug}"`);
    res.json({ success: true, message: `Movie "${slug}" deleted successfully` });
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`
==================================================
🚀 Infyn Movies Admin Panel running!
🌐 URL: http://localhost:${PORT}
🔑 Admin Secret: ${ADMIN_SECRET}
📁 Connected to Firestore: ${db ? "YES" : "NO"}
==================================================
`);
});
