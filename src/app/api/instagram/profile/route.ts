import { NextRequest, NextResponse } from "next/server";

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

    const profileUrl = `https://www.instagram.com/${username}/`;

    // Fetch the public profile HTML using crawler user-agent to retrieve OpenGraph metadata
    const response = await fetch(profileUrl, {
      headers: {
        "User-Agent":
          "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: `User @${username} was not found on Instagram.`,
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: `Instagram responded with status ${response.status}. Please try again later.`,
        },
        { status: 502 }
      );
    }

    const html = await response.text();

    // Extract og:image
    const ogImgMatch =
      html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    if (!ogImgMatch || !ogImgMatch[1]) {
      return NextResponse.json(
        {
          success: false,
          error: `Unable to retrieve profile picture for @${username}. The account might be restricted or private.`,
        },
        { status: 404 }
      );
    }

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

    // Parse full name from title (e.g., "Leo Messi (@leomessi) • Instagram photos and videos")
    let fullName = username;
    const nameMatch = rawTitle.match(/^([^(@]+)\s*\(@/);
    if (nameMatch && nameMatch[1]) {
      fullName = nameMatch[1].trim();
    }

    // Parse stats from description (e.g., "517M Followers, 373 Following, 1,543 Posts")
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
    const downloadUrl = `/api/instagram/stream?url=${encodeURIComponent(
      rawProfilePic
    )}&filename=${encodeURIComponent(safeFilename)}`;

    return NextResponse.json({
      success: true,
      username,
      fullName,
      profilePicUrl: rawProfilePic,
      downloadUrl,
      filename: safeFilename,
      followers,
      following,
      posts,
      bio,
    });
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
