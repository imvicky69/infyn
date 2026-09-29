import os
import re
import urllib.parse
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import requests
import yt_dlp

app = FastAPI(
    title="Infyn Media Downloader API",
    description="High-speed yt-dlp backend for Instagram Reels & Media processing.",
    version="1.0.0",
)

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MediaRequest(BaseModel):
    url: str


def sanitize_filename(name: str) -> str:
    cleaned = re.sub(r'[\\/*?:"<>|]', "", name).strip()
    return cleaned[:80] if cleaned else "instagram_reel"


def extract_media(target_url: str):
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "format": "b/best",
        "skip_download": True,
        "extract_flat": False,
        "no_color": True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(target_url, download=False)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to extract media: {str(e)}")

    if not info:
        raise HTTPException(status_code=404, detail="No media found for the provided URL.")

    formats = info.get("formats", [])

    # 1. Best progressive video format (contains both audio and video)
    progressive_formats = [
        f for f in formats
        if f.get("vcodec") != "none" and f.get("acodec") != "none" and f.get("url")
    ]

    best_video_url = info.get("url")
    if not best_video_url and progressive_formats:
        best_video_url = progressive_formats[-1].get("url")

    # 2. Audio-only format
    audio_formats = [
        f for f in formats
        if f.get("vcodec") == "none" and f.get("acodec") != "none" and f.get("url")
    ]
    best_audio_url = audio_formats[-1].get("url") if audio_formats else None

    # Fallback to direct video url if no audio separate stream
    if not best_audio_url and best_video_url:
        best_audio_url = best_video_url

    title = info.get("fulltitle") or info.get("title") or "Instagram Reel"
    uploader = info.get("uploader") or info.get("channel") or info.get("uploader_id") or "Creator"
    thumbnail = info.get("thumbnail")
    duration = info.get("duration") or 0
    shortcode = info.get("display_id") or info.get("id") or "reel"

    return {
        "success": True,
        "id": shortcode,
        "title": title,
        "uploader": uploader,
        "uploader_id": info.get("uploader_id"),
        "duration": duration,
        "thumbnail": thumbnail,
        "video_url": best_video_url,
        "audio_url": best_audio_url,
        "filename": f"{sanitize_filename(title)} [{shortcode}].mp4",
        "description": info.get("description") or "",
        "like_count": info.get("like_count"),
        "comment_count": info.get("comment_count"),
    }


@app.get("/")
def root():
    return {
        "service": "Infyn Media Downloader API",
        "status": "online",
        "endpoints": ["/health", "/api/instagram", "/api/stream"],
    }


@app.get("/health")
def health():
    return {"status": "ok", "service": "infyn-ytdlp-backend"}


@app.post("/api/instagram")
def process_post(req: MediaRequest):
    if not req.url or "instagram.com" not in req.url:
        raise HTTPException(status_code=400, detail="Please provide a valid Instagram URL.")
    return extract_media(req.url)


@app.get("/api/instagram")
def process_get(url: str = Query(..., description="Instagram URL")):
    if not url or "instagram.com" not in url:
        raise HTTPException(status_code=400, detail="Please provide a valid Instagram URL.")
    return extract_media(url)


@app.get("/api/stream")
def stream_media(url: str = Query(...), filename: str = Query("reel.mp4")):
    parsed = urllib.parse.urlparse(url)
    allowed_domains = ["cdninstagram.com", "fbcdn.net", "instagram.com"]
    if not any(parsed.netloc.endswith(domain) for domain in allowed_domains):
        raise HTTPException(status_code=400, detail="Invalid media domain.")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Referer": "https://www.instagram.com/",
    }

    req = requests.get(url, headers=headers, stream=True)
    if req.status_code != 200:
        raise HTTPException(status_code=req.status_code, detail="Failed to fetch upstream media.")

    content_type = req.headers.get("content-type", "video/mp4")
    safe_filename = sanitize_filename(filename)
    if not safe_filename.endswith((".mp4", ".m4a", ".jpg")):
        safe_filename += ".mp4"

    def iterfile():
        for chunk in req.iter_content(chunk_size=1024 * 64):
            if chunk:
                yield chunk

    response_headers = {
        "Content-Disposition": f'attachment; filename="{safe_filename}"',
        "Accept-Ranges": "bytes",
    }
    if "content-length" in req.headers:
        response_headers["Content-Length"] = req.headers["content-length"]

    return StreamingResponse(iterfile(), media_type=content_type, headers=response_headers)


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
