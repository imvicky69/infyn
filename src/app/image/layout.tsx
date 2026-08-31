import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free In-Browser Image Tools Suite — Background Remover, Compressor & HEIC",
  description:
    "Explore Infyn's free image processing suite. AI background remover, batch image compressor, and HEIC to JPG converter running 100% locally in your browser with zero cloud uploads.",
  keywords: [
    "free image tools online",
    "browser image processor",
    "private photo tools",
    "free ai background remover",
    "batch image compressor free",
    "heic to jpg online free",
  ],
  alternates: {
    canonical: "https://infyn.software/image",
  },
  openGraph: {
    title: "Free In-Browser Image Tools Suite — Infyn by Indivio",
    description:
      "All-in-one private image toolkit. Remove backgrounds, compress sizes by 90%, and convert HEIC photos with zero cloud uploads.",
    url: "https://infyn.software/image",
    images: [{ url: "/logo-clear.png", width: 800, height: 800, alt: "Infyn Image Tools Suite" }],
  },
};

export default function ImageSuiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
