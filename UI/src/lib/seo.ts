import type { Metadata } from "next"
import { site } from "@/content/site.config"
import { locales, localePath, type Locale } from "@/i18n/config"

// L'URL du déploiement (variable SITE_URL du CI) pointait vers l'hôte technique Lightsail : le
// canonical et les hreflang du site public l'exposaient. On l'ignore en production quand c'est
// un hôte technique (Lightsail / localhost) et on retombe sur le domaine public.
const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
const isTechnicalHost = (u?: string) => !!u && /amazonlightsail\.com|localhost|127\.0\.0\.1/i.test(u)
export const siteUrl =
  envSiteUrl && !(process.env.NODE_ENV === "production" && isTechnicalHost(envSiteUrl)) ? envSiteUrl : site.url

/** Canonical + hreflang pour une page (chemin sans préfixe de langue). */
export const pageAlternates = (locale: Locale, path: string): NonNullable<Metadata["alternates"]> => {
  const languages: Record<string, string> = {}
  for (const l of locales) languages[l] = `${siteUrl}${localePath(l, path)}`
  languages["x-default"] = `${siteUrl}${localePath("fr", path)}`
  return { canonical: `${siteUrl}${localePath(locale, path)}`, languages }
}

/** Résout le paramètre de route en Locale sûre. */
export type LocaleParams = { params: Promise<{ locale: string }> }
