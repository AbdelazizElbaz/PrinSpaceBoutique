import type { MetadataRoute } from "next"
import { locales, localePath } from "@/i18n/config"
import { hreflangCodes, siteUrl } from "@/lib/seo"
import { features } from "@/content/fr/features"

// + une page par module (/fonctionnalites/<slug>, voir app/[locale]/fonctionnalites/[slug]/page.tsx).
const pages = ["", "/fonctionnalites", ...features.map((f) => `/fonctionnalites/${f.slug}`), "/agent", "/tarifs", "/faq", "/formation", "/contact", "/inscription"]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const out: MetadataRoute.Sitemap = []
  for (const p of pages) {
    const languages: Record<string, string> = {}
    for (const l of locales) for (const code of hreflangCodes(l)) languages[code] = `${siteUrl}${localePath(l, p || "/")}`
    languages["x-default"] = `${siteUrl}${localePath("fr", p || "/")}`
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
