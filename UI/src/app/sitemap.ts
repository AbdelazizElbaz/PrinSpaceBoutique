import type { MetadataRoute } from "next"
import { site } from "@/content/site.config"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || site.url
  const now = new Date()
  return ["", "/fonctionnalites", "/agent", "/tarifs", "/faq", "/formation", "/contact", "/inscription"].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/tarifs" || p === "/inscription" ? 0.9 : 0.7,
  }))
}
