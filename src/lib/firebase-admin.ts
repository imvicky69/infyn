import { initializeApp, getApps, getApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import path from "path";
import fs from "fs";

// Initialize Firebase Admin singleton for server-side Node.js
export function getFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "in-fyn";

  // 1. Check if environment variable contains service account JSON
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId,
      });
    } catch (e) {
      console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e);
    }
  }

  // 2. Check if local serviceAccountKey.json exists in root directory
  try {
    const localKeyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
    if (fs.existsSync(localKeyPath)) {
      const raw = fs.readFileSync(localKeyPath, "utf-8");
      const serviceAccount = JSON.parse(raw);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId,
      });
    }
  } catch (e) {
    console.warn("Failed to read local serviceAccountKey.json:", e);
  }

  // 3. Fallback: Initialize with Project ID
  return initializeApp({
    projectId,
  });
}

export function getAdminFirestore(): Firestore {
  const app = getFirebaseAdmin();
  return getFirestore(app);
}
