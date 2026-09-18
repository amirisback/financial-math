import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const staticRoutes = [
  "", // Homepage
  "/pricing",
  "/tanah",
  "/rumah",
  "/mobil",
  "/motor",
  "/menabung",
  "/investasi",
  "/depresiasi",
  "/saham-kripto-emas",
  "/forex",
  "/demo-encryption",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
