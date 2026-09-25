export interface ReleaseAsset {
  name: string;
  size: number;
  downloadUrl: string;
  formattedSize: string;
}

export interface InfynDlRelease {
  version: string;
  name: string;
  publishedAt: string;
  formattedDate: string;
  prerelease: boolean;
  releaseUrl: string;
  androidApk: ReleaseAsset;
  windowsSetup: ReleaseAsset;
  windowsPortable: ReleaseAsset;
  allAssets: ReleaseAsset[];
}

export function formatFileSize(bytes: number): string {
  if (!bytes || isNaN(bytes)) return "Unknown size";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export const FALLBACK_RELEASE: InfynDlRelease = {
  version: "v1.0.0-beta",
  name: "Infyn DL v1.0.0-beta",
  publishedAt: "2026-09-03T09:12:02Z",
  formattedDate: "Sep 3, 2026",
  prerelease: true,
  releaseUrl: "https://github.com/imvicky69/infyn-dl/releases/tag/v1.0.0-beta",
  androidApk: {
    name: "Infyn-DL-v1.0.0-beta-android.apk",
    size: 181095162,
    downloadUrl: "https://github.com/imvicky69/infyn-dl/releases/download/v1.0.0-beta/Infyn-DL-v1.0.0-beta-android.apk",
    formattedSize: "172.7 MB",
  },
  windowsSetup: {
    name: "Infyn-DL-v1.0.0-beta-windows-setup.exe",
    size: 110681237,
    downloadUrl: "https://github.com/imvicky69/infyn-dl/releases/download/v1.0.0-beta/Infyn-DL-v1.0.0-beta-windows-setup.exe",
    formattedSize: "105.5 MB",
  },
  windowsPortable: {
    name: "Infyn-DL-windows-portable.zip",
    size: 145837933,
    downloadUrl: "https://github.com/imvicky69/infyn-dl/releases/download/v1.0.0-beta/Infyn-DL-windows-portable.zip",
    formattedSize: "139.1 MB",
  },
  allAssets: [],
};

let memoryCache: { data: InfynDlRelease; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 1 minute client-side memory cache

export async function fetchLatestRelease(): Promise<InfynDlRelease> {
  // Return in-memory cache if fresh
  if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL_MS) {
    return memoryCache.data;
  }

  try {
    const res = await fetch("https://api.github.com/repos/imvicky69/infyn-dl/releases", {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-cache",
    });

    if (!res.ok) {
      return FALLBACK_RELEASE;
    }

    const releases = await res.json();
    if (!Array.isArray(releases) || releases.length === 0) {
      return FALLBACK_RELEASE;
    }

    // First release in the list (including latest pre-releases and stable releases)
    const latest = releases[0];
    const assets: any[] = latest.assets || [];

    const findAsset = (predicate: (name: string) => boolean, fallback: ReleaseAsset): ReleaseAsset => {
      const found = assets.find((a) => predicate(a.name?.toLowerCase() || ""));
      if (!found) return fallback;
      return {
        name: found.name,
        size: found.size,
        downloadUrl: found.browser_download_url,
        formattedSize: formatFileSize(found.size),
      };
    };

    // Android APK
    const androidApk = findAsset(
      (name) => name.endsWith(".apk"),
      FALLBACK_RELEASE.androidApk
    );

    // Windows Setup: prefer files with 'setup' & '.exe', fallback to any '.exe'
    const windowsSetup =
      assets.find((a) => a.name?.toLowerCase().includes("setup") && a.name?.toLowerCase().endsWith(".exe"))
        ? findAsset((name) => name.includes("setup") && name.endsWith(".exe"), FALLBACK_RELEASE.windowsSetup)
        : findAsset((name) => name.endsWith(".exe"), FALLBACK_RELEASE.windowsSetup);

    // Windows Portable: prefer files with 'portable' & '.zip', fallback to any '.zip' (except apk)
    const windowsPortable =
      assets.find((a) => a.name?.toLowerCase().includes("portable") && a.name?.toLowerCase().endsWith(".zip"))
        ? findAsset((name) => name.includes("portable") && name.endsWith(".zip"), FALLBACK_RELEASE.windowsPortable)
        : findAsset((name) => name.endsWith(".zip") && !name.endsWith(".apk"), FALLBACK_RELEASE.windowsPortable);

    const pubDate = new Date(latest.published_at || latest.created_at);
    const formattedDate = isNaN(pubDate.getTime())
      ? FALLBACK_RELEASE.formattedDate
      : pubDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const allAssets: ReleaseAsset[] = assets.map((a) => ({
      name: a.name,
      size: a.size,
      downloadUrl: a.browser_download_url,
      formattedSize: formatFileSize(a.size),
    }));

    const result: InfynDlRelease = {
      version: latest.tag_name || FALLBACK_RELEASE.version,
      name: latest.name || latest.tag_name || FALLBACK_RELEASE.name,
      publishedAt: latest.published_at || FALLBACK_RELEASE.publishedAt,
      formattedDate,
      prerelease: Boolean(latest.prerelease),
      releaseUrl: latest.html_url || FALLBACK_RELEASE.releaseUrl,
      androidApk,
      windowsSetup,
      windowsPortable,
      allAssets,
    };

    memoryCache = { data: result, timestamp: Date.now() };
    return result;
  } catch (err) {
    console.error("Failed to fetch infyn-dl releases:", err);
    return FALLBACK_RELEASE;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Smiley PDF Releases
// ─────────────────────────────────────────────────────────────────────────────

export interface SmileyPdfRelease {
  version: string;
  name: string;
  publishedAt: string;
  formattedDate: string;
  prerelease: boolean;
  releaseUrl: string;
  arm64Apk: ReleaseAsset;
  armv7Apk: ReleaseAsset;
  universalApk: ReleaseAsset;
  x86_64Apk: ReleaseAsset;
  checksums?: ReleaseAsset;
  allAssets: ReleaseAsset[];
}

export const FALLBACK_SMILEY_PDF_RELEASE: SmileyPdfRelease = {
  version: "v1.0.0",
  name: "Smiley PDF v1.0.0",
  publishedAt: "2026-09-25T12:28:29Z",
  formattedDate: "Sep 25, 2026",
  prerelease: false,
  releaseUrl: "https://github.com/imvicky69/smiley-pdf/releases/tag/v1.0.0",
  arm64Apk: {
    name: "app-arm64-v8a-release.apk",
    size: 27135601,
    downloadUrl: "https://github.com/imvicky69/smiley-pdf/releases/download/v1.0.0/app-arm64-v8a-release.apk",
    formattedSize: "25.9 MB",
  },
  armv7Apk: {
    name: "app-armeabi-v7a-release.apk",
    size: 22516839,
    downloadUrl: "https://github.com/imvicky69/smiley-pdf/releases/download/v1.0.0/app-armeabi-v7a-release.apk",
    formattedSize: "21.5 MB",
  },
  universalApk: {
    name: "app-release.apk",
    size: 27941737,
    downloadUrl: "https://github.com/imvicky69/smiley-pdf/releases/download/v1.0.0/app-release.apk",
    formattedSize: "26.6 MB",
  },
  x86_64Apk: {
    name: "app-x86_64-release.apk",
    size: 28893426,
    downloadUrl: "https://github.com/imvicky69/smiley-pdf/releases/download/v1.0.0/app-x86_64-release.apk",
    formattedSize: "27.6 MB",
  },
  checksums: {
    name: "checksums.txt",
    size: 969,
    downloadUrl: "https://github.com/imvicky69/smiley-pdf/releases/download/v1.0.0/checksums.txt",
    formattedSize: "969 B",
  },
  allAssets: [],
};

let smileyMemoryCache: { data: SmileyPdfRelease; timestamp: number } | null = null;

export async function fetchLatestSmileyPdfRelease(): Promise<SmileyPdfRelease> {
  if (smileyMemoryCache && Date.now() - smileyMemoryCache.timestamp < CACHE_TTL_MS) {
    return smileyMemoryCache.data;
  }

  try {
    const res = await fetch("https://api.github.com/repos/imvicky69/smiley-pdf/releases", {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-cache",
    });

    if (!res.ok) {
      return FALLBACK_SMILEY_PDF_RELEASE;
    }

    const releases = await res.json();
    if (!Array.isArray(releases) || releases.length === 0) {
      return FALLBACK_SMILEY_PDF_RELEASE;
    }

    const latest = releases[0];
    const assets: any[] = latest.assets || [];

    const findAsset = (predicate: (name: string) => boolean, fallback: ReleaseAsset): ReleaseAsset => {
      const found = assets.find((a) => predicate(a.name?.toLowerCase() || ""));
      if (!found) return fallback;
      return {
        name: found.name,
        size: found.size,
        downloadUrl: found.browser_download_url,
        formattedSize: formatFileSize(found.size),
      };
    };

    // ARM64 (Modern 64-bit phones)
    const arm64Apk = findAsset(
      (name) => name.includes("arm64") && name.endsWith(".apk"),
      FALLBACK_SMILEY_PDF_RELEASE.arm64Apk
    );

    // ARMv7 / armeabi (32-bit legacy phones)
    const armv7Apk = findAsset(
      (name) => (name.includes("armeabi") || name.includes("armv7")) && name.endsWith(".apk"),
      FALLBACK_SMILEY_PDF_RELEASE.armv7Apk
    );

    // Universal APK (app-release.apk or default)
    const universalApk = findAsset(
      (name) => (name === "app-release.apk" || (!name.includes("arm") && !name.includes("x86"))) && name.endsWith(".apk"),
      FALLBACK_SMILEY_PDF_RELEASE.universalApk
    );

    // x86_64 APK (Chromebooks & emulators)
    const x86_64Apk = findAsset(
      (name) => name.includes("x86") && name.endsWith(".apk"),
      FALLBACK_SMILEY_PDF_RELEASE.x86_64Apk
    );

    // Checksums file
    const checksums = findAsset(
      (name) => name.includes("checksum"),
      FALLBACK_SMILEY_PDF_RELEASE.checksums!
    );

    const pubDate = new Date(latest.published_at || latest.created_at);
    const formattedDate = isNaN(pubDate.getTime())
      ? FALLBACK_SMILEY_PDF_RELEASE.formattedDate
      : pubDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const allAssets: ReleaseAsset[] = assets.map((a) => ({
      name: a.name,
      size: a.size,
      downloadUrl: a.browser_download_url,
      formattedSize: formatFileSize(a.size),
    }));

    const result: SmileyPdfRelease = {
      version: latest.tag_name || FALLBACK_SMILEY_PDF_RELEASE.version,
      name: (latest.name || latest.tag_name || FALLBACK_SMILEY_PDF_RELEASE.name).trim(),
      publishedAt: latest.published_at || FALLBACK_SMILEY_PDF_RELEASE.publishedAt,
      formattedDate,
      prerelease: Boolean(latest.prerelease),
      releaseUrl: latest.html_url || FALLBACK_SMILEY_PDF_RELEASE.releaseUrl,
      arm64Apk,
      armv7Apk,
      universalApk,
      x86_64Apk,
      checksums,
      allAssets,
    };

    smileyMemoryCache = { data: result, timestamp: Date.now() };
    return result;
  } catch (err) {
    console.error("Failed to fetch smiley-pdf releases:", err);
    return FALLBACK_SMILEY_PDF_RELEASE;
  }
}

