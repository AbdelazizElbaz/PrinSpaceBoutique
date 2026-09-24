import type { Metadata } from "next"
import { site } from "@/content/site.config"
import { locales, localePath, type Locale } from "@/i18n/config"

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url

/** Canonical + hreflang pour une page (chemin sans préfixe de langue). */
export const pageAlternates = (locale: Locale, path: string): NonNullable<Metadata["alternates"]> => {
  const languages: Record<string, string> = {}
  for (const l of locales) languages[l] = `${siteUrl}${localePath(l, path)}`
  languages["x-default"] = `${siteUrl}${localePath("fr", path)}`
  return { canonical: `${siteUrl}${localePath(locale, path)}`, languages }
}

/** Résout le paramètre de route en Locale sûre. */
export type LocaleParams = { params: Promise<{ locale: string }> }
