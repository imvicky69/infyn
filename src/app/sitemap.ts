import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://infyn.software";
  
  const routes = [
    "",
    "/image",
    "/image/qr-code",
    "/image/bg-remover",
    "/image/compressor",

    "/image/converter",
    "/image/exif-remover",
    "/image/heic-to-jpg",
    "/image/resizer",
    "/image/img-to-pdf",
    "/pdf",
    "/pdf/compressor",
    "/pdf/merger",
    "/pdf/protector",
    "/pdf/splitter",
    "/pdf/unlocker",
    "/pdf/pdf-to-image",
    "/docs"
  ];


  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route.split("/").length === 2 ? 0.9 : 0.8,
  }));
}
