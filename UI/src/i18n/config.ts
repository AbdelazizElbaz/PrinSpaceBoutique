// Langues du site. Le français est servi sans préfixe (printios.ma/…),
// l'arabe sous /ar/… (affichage RTL) et l'anglais sous /en/…
// Le middleware réécrit en interne les URL sans préfixe vers /fr/… pour que
// toutes les pages vivent sous app/[locale]/.

export const locales = ["fr", "ar", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "fr"

export const localeNames: Record<Locale, string> = { fr: "Français", ar: "العربية", en: "English" }
export const localeFlags: Record<Locale, string> = { fr: "FR", ar: "ع", en: "EN" }

export const isLocale = (v: string | undefined): v is Locale => !!v && (locales as readonly string[]).includes(v)
export const isRtl = (l: Locale) => l === "ar"
export const dir = (l: Locale): "rtl" | "ltr" => (isRtl(l) ? "rtl" : "ltr")

/** Chemin public d'une page pour une langue : fr → "/tarifs", ar → "/ar/tarifs". */
export const localePath = (locale: Locale, path: string) => {
  const p = path.startsWith("/") ? path : `/${path}`
  if (locale === defaultLocale) return p === "/" ? "/" : p
  return p === "/" ? `/${locale}` : `/${locale}${p}`
}

/** Retire un éventuel préfixe de langue d'un chemin public. */
export const stripLocale = (path: string): { locale: Locale; path: string } => {
  const m = path.match(/^\/(fr|ar|en)(?=\/|$)/)
  if (m && isLocale(m[1])) {
    const rest = path.slice(m[0].length) || "/"
    return { locale: m[1], path: rest }
  }
  return { locale: defaultLocale, path: path || "/" }
}

export const htmlLang: Record<Locale, string> = { fr: "fr", ar: "ar", en: "en" }
export const ogLocale: Record<Locale, string> = { fr: "fr_MA", ar: "ar_MA", en: "en_US" }
export const numberLocale: Record<Locale, string> = { fr: "fr-MA", ar: "ar-MA", en: "en-US" }
