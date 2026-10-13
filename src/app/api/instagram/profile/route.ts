import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface ProfileResult {
  success: boolean;
  username: string;
  fullName: string;
  profilePicUrl: string;
  downloadUrl: string;
  filename: string;
  followers?: string;
  following?: string;
  posts?: string;
  bio?: string;
  isPrivate?: boolean;
  isVerified?: boolean;
}

// In-memory cache for fast repeat profile lookups (15-minute TTL)
interface CacheEntry {
  data: ProfileResult;
  expiresAt: number;
}
const profileCache = new Map<string, CacheEntry>();

function getCachedProfile(username: string): ProfileResult | null {
  const entry = profileCache.get(username.toLowerCase());
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    profileCache.delete(username.toLowerCase());
    return null;
  }
  return entry.data;
}

function setCachedProfile(username: string, data: ProfileResult) {
  if (profileCache.size > 200) {
    const firstKey = profileCache.keys().next().value;
    if (firstKey) profileCache.delete(firstKey);
  }
  profileCache.set(username.toLowerCase(), {
    data,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#064;/g, "@")
    .replace(/&#64;/g, "@")
    .replace(/&#x2022;/g, "•")
    .replace(/&#8226;/g, "•")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");
}

function cleanUsername(input: string): string {
  let cleaned = input.trim();
  // Strip full Instagram URL if provided
  cleaned = cleaned.replace(/^https?:\/\/(?:www\.)?instagram\.com\//i, "");
  // Remove leading @
  cleaned = cleaned.replace(/^@/, "");
  // Take username before any slash or query parameters
  cleaned = cleaned.split("/")[0].split("?")[0].trim();
  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawInput = body?.username || body?.url || "";
    const username = cleanUsername(rawInput);

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter an Instagram username or profile link.",
        },
        { status: 400 }
      );
    }

    // Validate Instagram username format (letters, numbers, periods, underscores, 1-30 chars)
    if (!/^[a-zA-Z0-9._]{1,30}$/.test(username)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Instagram username format. Please check the spelling.",
        },
        { status: 400 }
      );
    }

    // 1. Check in-memory cache for instant response
    const cached = getCachedProfile(username);
    if (cached) {
      return NextResponse.json(cached);
    }

    const backendUrl =
      process.env.YT_DLP_BACKEND_URL || "https://infyn-1v7p.onrender.com";

    // 2. Strategy A: Call dedicated Instaloader backend on Render
    if (backendUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const backendRes = await fetch(
          `${backendUrl.replace(/\/$/, "")}/api/instagram/profile`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (backendRes.ok) {
          const data = await backendRes.json();
          if (data.success && data.profilePicUrl) {
            const safeFilename = `${username}_profile_pic.jpg`;
            const result: ProfileResult = {
              success: true,
              username: data.username || username,
              fullName: data.fullName || username,
              profilePicUrl: data.profilePicUrl,
              downloadUrl: `/api/instagram/stream?url=${encodeURIComponent(
                data.profilePicUrl
              )}&filename=${encodeURIComponent(safeFilename)}`,
              filename: safeFilename,
              followers: data.followers,
              following: data.following,
              posts: data.posts,
              bio: data.bio,
              isPrivate: data.isPrivate,
              isVerified: data.isVerified,
            };

            setCachedProfile(username, result);
            return NextResponse.json(result);
          }
        }
      } catch (backendErr: any) {
        console.warn("Backend profile lookup failed, trying fallback:", backendErr.message);
      }
    }

    // 3. Strategy B: Direct OpenGraph Crawler Scraping Fallback
    try {
      const profileUrl = `https://www.instagram.com/${username}/`;

      const response = await fetch(profileUrl, {
        headers: {
          "User-Agent":
            "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          "Accept-Language": "en-US,en;q=0.9",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        },
        cache: "no-store",
      });

      if (response.ok) {
        const html = await response.text();

        // Extract og:image
        const ogImgMatch =
          html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
          html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

        if (ogImgMatch && ogImgMatch[1]) {
          const rawProfilePic = decodeHtmlEntities(ogImgMatch[1]);

          // Extract og:title
          const ogTitleMatch =
            html.match(/property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
            html.match(/content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
          const rawTitle = ogTitleMatch ? decodeHtmlEntities(ogTitleMatch[1]) : "";

          // Extract og:description
          const ogDescMatch =
            html.match(/property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
            html.match(/content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
          const rawDesc = ogDescMatch ? decodeHtmlEntities(ogDescMatch[1]) : "";

          let fullName = username;
          const nameMatch = rawTitle.match(/^([^(@]+)\s*\(@/);
          if (nameMatch && nameMatch[1]) {
            fullName = nameMatch[1].trim();
          }

          let followers = "";
          let following = "";
          let posts = "";
          let bio = "";

          const statsMatch = rawDesc.match(
            /([\d\.,\w]+)\s+Followers,\s*([\d\.,\w]+)\s+Following,\s*([\d\.,\w]+)\s+Posts(?:\s*-\s*(.*))?/i
          );
          if (statsMatch) {
            followers = statsMatch[1];
            following = statsMatch[2];
            posts = statsMatch[3];
            if (statsMatch[4]) {
              bio = statsMatch[4].trim();
            }
          } else {
            bio = rawDesc;
          }

          const safeFilename = `${username}_profile_pic.jpg`;
          const result: ProfileResult = {
            success: true,
            username,
            fullName,
            profilePicUrl: rawProfilePic,
            downloadUrl: `/api/instagram/stream?url=${encodeURIComponent(
              rawProfilePic
            )}&filename=${encodeURIComponent(safeFilename)}`,
            filename: safeFilename,
            followers,
            following,
            posts,
            bio,
          };

          setCachedProfile(username, result);
          return NextResponse.json(result);
        }
      }
    } catch (scraperErr: any) {
      console.warn("Direct scraper fallback failed:", scraperErr.message);
    }

    return NextResponse.json(
      {
        success: false,
        error: `Unable to retrieve profile picture for @${username}. The account might be restricted, private, or temporarily protected by Instagram.`,
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Instagram profile fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to query Instagram profile.",
      },
      { status: 500 }
    );
  }
}
