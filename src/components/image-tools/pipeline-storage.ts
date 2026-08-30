/**
 * High-performance, high-capacity client-side Image Pipeline Storage.
 * Uses native browser IndexedDB to allow passing 50MB+ Blobs/Files seamlessly across
 * Infyn tools without quota limits or base64 serialization bottlenecks.
 */

const DB_NAME = "infyn_pipeline_db";
const DB_VERSION = 1;
const STORE_NAME = "pipeline_files";
const RECORD_KEY = "current_image";

interface StoredPipelineItem {
  blob: Blob;
  name: string;
  type: string;
  timestamp: number;
}

// In-memory fallback in case IndexedDB is restricted in some private browsing mode
let memoryFallback: File | null = null;

function openPipelineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is not supported in this environment"));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Stores an image Blob or File in pipeline storage.
 */
export async function setPipelineImage(fileOrBlob: File | Blob, name: string): Promise<void> {
  if (typeof window === "undefined") return;

  const fileName = name || (fileOrBlob instanceof File ? fileOrBlob.name : "image.png");
  const fileType = fileOrBlob.type || "image/png";

  const file = fileOrBlob instanceof File
    ? fileOrBlob
    : new File([fileOrBlob], fileName, { type: fileType });

  // Update in-memory fallback
  memoryFallback = file;

  try {
    const db = await openPipelineDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const item: StoredPipelineItem = {
        blob: fileOrBlob,
        name: fileName,
        type: fileType,
        timestamp: Date.now(),
      };
      const putRequest = store.put(item, RECORD_KEY);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    });

    // Mark a small flag in sessionStorage for fast synchronous detection
    sessionStorage.setItem("infyn_pipeline_pending", "1");
  } catch (err) {
    console.warn("IndexedDB setPipelineImage failed, relying on memory fallback", err);
  }
}

/**
 * Retrieves and clears the pending pipeline image.
 */
export async function getPipelineImage(): Promise<File | null> {
  if (typeof window === "undefined") return null;

  // Check if memory fallback is ready
  if (memoryFallback) {
    const file = memoryFallback;
    memoryFallback = null;
    sessionStorage.removeItem("infyn_pipeline_pending");
    // Also clean up IndexedDB in the background
    clearPipelineImage().catch(() => {});
    return file;
  }

  try {
    const db = await openPipelineDB();
    const result = await new Promise<StoredPipelineItem | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(RECORD_KEY);
      getRequest.onsuccess = () => {
        const data = getRequest.result as StoredPipelineItem | undefined;
        if (data) {
          store.delete(RECORD_KEY);
          resolve(data);
        } else {
          resolve(null);
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });

    sessionStorage.removeItem("infyn_pipeline_pending");

    if (result && result.blob) {
      return new File([result.blob], result.name || "image.png", {
        type: result.type || result.blob.type || "image/png",
      });
    }

    return null;
  } catch (err) {
    console.warn("IndexedDB getPipelineImage failed", err);
    return null;
  }
}

/**
 * Explicitly clears the pipeline image.
 */
export async function clearPipelineImage(): Promise<void> {
  memoryFallback = null;
  if (typeof window === "undefined") return;

  sessionStorage.removeItem("infyn_pipeline_pending");

  try {
    const db = await openPipelineDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const delRequest = store.delete(RECORD_KEY);
      delRequest.onsuccess = () => resolve();
      delRequest.onerror = () => reject(delRequest.error);
    });
  } catch (_) {}
}
