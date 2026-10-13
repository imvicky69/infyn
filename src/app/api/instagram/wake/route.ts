import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

/**
 * Dedicated pre-warm / wake-up endpoint for the external yt-dlp backend (Render).
 * Fires a fast non-blocking request to the backend's /health endpoint.
 * Calling this as soon as a user visits /instagram or /instagram/reel-downloader
 * wakes up sleeping Render instances before the user even finishes pasting their URL.
 */
export async function GET() {
  const backendUrl =
    process.env.YT_DLP_BACKEND_URL || "https://infyn-1v7p.onrender.com";

  const target = `${backendUrl.replace(/\/$/, "")}/health`;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    // 7s timeout so this never hangs client-side requests
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(target, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    if (res.ok) {
      return NextResponse.json({
        status: "ready",
        warmed: true,
        durationMs: duration,
      });
    }

    return NextResponse.json({
      status: "waking",
      warmed: false,
      durationMs: duration,
    });
  } catch {
    // Even if aborted or connection is still opening, Render received the TCP handshake
    // and is actively spinning up its Docker container.
    return NextResponse.json({
      status: "waking",
      warmed: false,
      durationMs: Date.now() - startTime,
    });
  }
}
