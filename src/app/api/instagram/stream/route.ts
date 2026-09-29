import { NextRequest, NextResponse } from "next/server";

function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[\\/*?:"<>|]/g, "").trim();
  return cleaned || "instagram_reel.mp4";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaUrl = searchParams.get("url");
    const rawFilename = searchParams.get("filename") || "instagram_reel.mp4";

    if (!mediaUrl) {
      return new NextResponse("Missing url parameter", { status: 400 });
    }

    // Domain validation to prevent open SSRF proxy
    try {
      const parsedUrl = new URL(mediaUrl);
      const allowedDomains = [
        "cdninstagram.com",
        "fbcdn.net",
        "instagram.com",
      ];
      const isAllowed = allowedDomains.some(
        (domain) =>
          parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
      );

      if (!isAllowed) {
        return new NextResponse("Forbidden media domain", { status: 403 });
      }
    } catch {
      return new NextResponse("Invalid URL provided", { status: 400 });
    }

    const filename = sanitizeFilename(rawFilename);

    // Forward range header if present for seeking/streaming
    const range = req.headers.get("range");
    const fetchHeaders: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Referer: "https://www.instagram.com/",
    };
    if (range) {
      fetchHeaders["Range"] = range;
    }

    const response = await fetch(mediaUrl, {
      headers: fetchHeaders,
    });

    if (!response.ok && response.status !== 206) {
      return new NextResponse(
        `Failed to fetch upstream media: ${response.statusText}`,
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "video/mp4";
    const contentLength = response.headers.get("content-length");
    const contentRange = response.headers.get("content-range");

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", contentType);
    responseHeaders.set(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(filename)}"`
    );
    responseHeaders.set("Accept-Ranges", "bytes");
    responseHeaders.set("Cache-Control", "public, max-age=3600");

    if (contentLength) responseHeaders.set("Content-Length", contentLength);
    if (contentRange) responseHeaders.set("Content-Range", contentRange);

    return new NextResponse(response.body, {
      status: response.status === 206 ? 206 : 200,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("Stream route error:", error);
    return new NextResponse(error.message || "Failed to stream media", {
      status: 500,
    });
  }
}
