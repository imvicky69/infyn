import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Infyn — 100% Free, Ad-Free & Private In-Browser Utilities",
    short_name: "Infyn",
    description:
      "100% Free and Ad-Free in-browser utilities. AI background removal, batch image compressor, resizer, PDF tools, and converter running locally on your device with zero cloud uploads.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FBFBFA",
    theme_color: "#FBFBFA",
    orientation: "any",
    lang: "en",
    categories: ["utilities", "productivity", "photo"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Background Remover",
        short_name: "BG Remover",
        description: "Instant AI background removal with transparent cutouts",
        url: "/image/bg-remover",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Image Compressor",
        short_name: "Compress",
        description: "Compress images with zero quality loss locally",
        url: "/image/compressor",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "PDF Tools",
        short_name: "PDF",
        description: "Merge, split, protect, and compress PDF documents",
        url: "/pdf",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "QR Code Generator",
        short_name: "QR Code",
        description: "Create custom SVG/PNG QR codes with logos",
        url: "/image/qr-code",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
