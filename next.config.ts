import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.zakirkhanlive.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.zakirkhanlive.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/instagram",
        destination: "/instagram-reel-downloader",
      },
      {
        source: "/instagram-downloader",
        destination: "/instagram-reel-downloader",
      },
    ];
  },
};

export default nextConfig;
