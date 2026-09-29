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
        source: "/instagram-reel-downloader",
        destination: "/instagram/reel-downloader",
      },
      {
        source: "/instagram-profile-downloader",
        destination: "/instagram/profile-downloader",
      },
      {
        source: "/instagram-downloader",
        destination: "/instagram/reel-downloader",
      },
      {
        source: "/instagram/reel",
        destination: "/instagram/reel-downloader",
      },
      {
        source: "/instagram/profile",
        destination: "/instagram/profile-downloader",
      },
      {
        source: "/instagram/dp",
        destination: "/instagram/profile-downloader",
      },
      {
        source: "/instagram-dp",
        destination: "/instagram/profile-downloader",
      },
    ];
  },
};

export default nextConfig;
