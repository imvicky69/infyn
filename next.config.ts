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
    ],
  },
};

export default nextConfig;
