import os
import re
import urllib.parse
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import requests
import yt_dlp
import instaloader

app = FastAPI(
    title="Infyn Media Downloader API",
    description="High-speed yt-dlp & instaloader backend for Instagram Reels, Media & Profile processing.",
    version="1.1.0",
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


class ProfileRequest(BaseModel):
    username: str


from itertools import islice

# Instaloader instance for profile extraction (max_connection_attempts=1 prevents retry hangs)
loader = instaloader.Instaloader(
    download_pictures=False,
    download_videos=False,
    download_video_thumbnails=False,
    download_geotags=False,
    download_comments=False,
    save_metadata=False,
    compress_json=False,
    quiet=True,
    max_connection_attempts=1,
)

# Optional authenticated session injection if provided via environment
insta_session = os.environ.get("INSTAGRAM_SESSION_ID")
if insta_session:
    try:
        loader.context._session.cookies.set("sessionid", insta_session, domain=".instagram.com")
        print("Instaloader initialized with custom session cookie.")
    except Exception as e:
        print(f"Failed to apply Instagram session: {e}")


def sanitize_filename(name: str) -> str:
    cleaned = re.sub(r'[\\/*?:"<>|]', "", name).strip()
    return cleaned[:80] if cleaned else "instagram_reel"


def clean_username(raw: str) -> str:
    cleaned = raw.strip()
    cleaned = re.sub(r'^https?://(?:www\.)?instagram\.com/', '', cleaned, flags=re.IGNORECASE)
    cleaned = cleaned.lstrip('@')
    cleaned = cleaned.split('/')[0].split('?')[0].strip()
    return cleaned


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


def extract_profile_data(raw_username: str):
    clean = clean_username(raw_username)
    if not clean:
        raise HTTPException(status_code=400, detail="Invalid username format.")

    # Strategy 1: Ultra-fast OpenGraph Crawler Scraper (< 1.5 seconds)
    # Serves high-res profile picture, follower/following/post stats, full name, and bio
    crawler_user_agents = [
        "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Twitterbot/1.0",
        "WhatsApp/2.21.12.21 i",
    ]

    for ua in crawler_user_agents:
        try:
            url = f"https://www.instagram.com/{clean}/"
            headers = {
                "User-Agent": ua,
                "Accept-Language": "en-US,en;q=0.9",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            }
            res = requests.get(url, headers=headers, timeout=6)
            if res.status_code == 200:
                html = res.text

                # 1. Extract og:image
                og_match = re.search(r'property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
                if not og_match:
                    og_match = re.search(r'content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', html, re.I)

                if og_match and og_match.group(1):
                    pfp = og_match.group(1).replace("&amp;", "&")

                    # 2. Extract og:title
                    title_match = re.search(r'property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
                    if not title_match:
                        title_match = re.search(r'content=["\']([^"\']+)["\'][^>]+property=["\']og:title["\']', html, re.I)
                    raw_title = title_match.group(1) if title_match else clean
                    raw_title = raw_title.replace("&#064;", "@").replace("&#64;", "@").replace("&#x2022;", "•").replace("&amp;", "&")

                    full_name = clean
                    name_match = re.search(r'^([^(@]+)\s*\(@', raw_title)
                    if name_match:
                        full_name = name_match.group(1).strip()

                    # 3. Extract og:description
                    desc_match = re.search(r'property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
                    if not desc_match:
                        desc_match = re.search(r'content=["\']([^"\']+)["\'][^>]+property=["\']og:description["\']', html, re.I)
                    raw_desc = desc_match.group(1) if desc_match else ""
                    raw_desc = raw_desc.replace("&#064;", "@").replace("&#64;", "@").replace("&#x2022;", "•").replace("&amp;", "&")

                    followers = ""
                    following = ""
                    posts_count = ""
                    bio = ""

                    stats_match = re.search(
                        r'([\d\.,\w]+)\s+Followers,\s*([\d\.,\w]+)\s+Following,\s*([\d\.,\w]+)\s+Posts(?:\s*-\s*(.*))?',
                        raw_desc,
                        re.I
                    )
                    if stats_match:
                        followers = stats_match.group(1)
                        following = stats_match.group(2)
                        posts_count = stats_match.group(3)
                        if stats_match.group(4):
                            bio_snippet = stats_match.group(4).strip()
                            if not re.search(r'See Instagram photos and videos from', bio_snippet, re.I):
                                bio = bio_snippet
                    else:
                        bio = raw_desc

                    is_verified = bool(
                        re.search(r'verified["\']?\s*:\s*true', html, re.I)
                        or "meta_verified" in html
                    )

                    return {
                        "success": True,
                        "username": clean,
                        "fullName": full_name,
                        "profilePicUrl": pfp,
                        "filename": f"{clean}_profile_pic.jpg",
                        "followers": followers,
                        "following": following,
                        "posts": posts_count,
                        "bio": bio,
                        "isPrivate": False,
                        "isVerified": is_verified,
                        "userId": None,
                        "recentPosts": [],
                    }
        except Exception as scrap_err:
            print(f"Crawler attempt ({ua[:15]}) failed for @{clean}: {scrap_err}")
            continue

    # Strategy 2: Instaloader fallback (strictly 1 attempt, no exponential retry backoff)
    try:
        loader.context.max_connection_attempts = 1
        profile = instaloader.Profile.from_username(loader.context, clean)
        pfp = profile.profile_pic_url
        if pfp:
            safe_name = f"{clean}_profile_pic.jpg"
            recent_posts = []
            if not profile.is_private:
                try:
                    for post in islice(profile.get_posts(), 6):
                        recent_posts.append({
                            "shortcode": post.shortcode,
                            "media_type": "video" if post.is_video else "image",
                            "thumbnail": post.url,
                            "video_url": post.video_url if post.is_video else None,
                            "display_url": post.url,
                            "likes": post.likes,
                            "comments": post.comments,
                            "caption": (post.caption or "")[:120],
                            "date": post.date_utc.strftime("%b %d, %Y") if post.date_utc else "",
                        })
                except Exception as p_err:
                    print(f"Could not load recent posts for @{clean}: {p_err}")

            return {
                "success": True,
                "username": profile.username,
                "fullName": profile.full_name or profile.username,
                "profilePicUrl": pfp,
                "filename": safe_name,
                "followers": f"{profile.followers:,}",
                "following": f"{profile.followees:,}",
                "posts": f"{profile.mediacount:,}",
                "bio": profile.biography or "",
                "isPrivate": profile.is_private,
                "isVerified": profile.is_verified,
                "userId": profile.userid,
                "recentPosts": recent_posts,
            }
    except Exception as insta_err:
        print(f"Instaloader secondary lookup failed for @{clean}: {insta_err}")

    raise HTTPException(
        status_code=404,
        detail=f"Unable to retrieve profile picture for @{clean}. The account might be restricted, private, or temporarily protected by Instagram."
    )


@app.get("/")
def root():
    return {
        "service": "Infyn Media Downloader API",
        "status": "online",
        "endpoints": ["/health", "/api/instagram", "/api/instagram/profile", "/api/stream"],
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


@app.post("/api/instagram/profile")
def profile_post(req: ProfileRequest):
    return extract_profile_data(req.username)


@app.get("/api/instagram/profile")
def profile_get(username: str = Query(..., description="Instagram username")):
    return extract_profile_data(username)


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
