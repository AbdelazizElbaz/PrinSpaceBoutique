import type { MetadataRoute } from "next"
import { locales, localePath } from "@/i18n/config"
import { siteUrl } from "@/lib/seo"

const pages = ["", "/fonctionnalites", "/agent", "/tarifs", "/faq", "/formation", "/contact", "/inscription"]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const out: MetadataRoute.Sitemap = []
  for (const p of pages) {
    const languages: Record<string, string> = {}
    for (const l of locales) languages[l] = `${siteUrl}${localePath(l, p || "/")}`
    for (const l of locales) {
      out.push({
        url: `${siteUrl}${localePath(l, p || "/")}`,
        lastModified: now,
        changeFrequency: p === "" ? "weekly" : "monthly",
        priority: (p === "" ? 1 : p === "/tarifs" || p === "/inscription" ? 0.9 : 0.7) * (l === "fr" ? 1 : 0.9),
        alternates: { languages },
      })
    }
  }
  return out
}
