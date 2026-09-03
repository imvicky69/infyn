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
