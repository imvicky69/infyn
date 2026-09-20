import { initializeApp, getApps, getApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import path from "path";
import fs from "fs";
import { SERVER_FIREBASE_KEY_B64 } from "./firebase-credentials-fallback";

// Initialize Firebase Admin singleton for server-side Node.js
export function getFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "in-fyn";

  let serviceAccount = null;

  // 1. Check if environment variable contains service account JSON or Base64 string
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
      if (raw.startsWith("{")) {
        serviceAccount = JSON.parse(raw);
      } else {
        const decoded = Buffer.from(raw, "base64").toString("utf-8");
        serviceAccount = JSON.parse(decoded);
      }
    } catch (e) {
      console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e);
    }
  }

  // 2. Check if local serviceAccountKey.json exists on disk
  if (!serviceAccount) {
    try {
      const localKeyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
      if (fs.existsSync(localKeyPath)) {
        const raw = fs.readFileSync(localKeyPath, "utf-8");
        serviceAccount = JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Failed to read local serviceAccountKey.json:", e);
    }
  }

  // 3. Fallback: Use server-only base64 credential
  if (!serviceAccount && SERVER_FIREBASE_KEY_B64) {
    try {
      const decoded = Buffer.from(SERVER_FIREBASE_KEY_B64, "base64").toString("utf-8");
      serviceAccount = JSON.parse(decoded);
    } catch (e) {
      console.warn("Failed to decode SERVER_FIREBASE_KEY_B64:", e);
    }
  }

  if (serviceAccount) {
    return initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || projectId,
    });
  }

  // 4. Default Project ID initialization
  return initializeApp({
    projectId,
  });
}

export function getAdminFirestore(): Firestore {
  const app = getFirebaseAdmin();
  return getFirestore(app);
}
