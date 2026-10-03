import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Inter, Cairo } from "next/font/google"
import "../globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { site } from "@/content/site.config"
import { dir, getDict, htmlLang, isLocale, locales, localePath, ogLocale, type Locale } from "@/i18n"
import { pageAlternates, siteUrl } from "@/lib/seo"

// Polices auto-hébergées au build (plus de feuille de style externe bloquant le rendu : rsms.me
// et fonts.googleapis.com coûtaient ~0,8 s et un cache de 4 h). Cairo (arabe) n'est pas
// préchargée pour le français/l'anglais.
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" })
const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "600", "700", "800"], display: "swap", variable: "--font-cairo", preload: false })

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${site.brand} — ${t.meta.title}`, template: `%s — ${site.brand}` },
    description: `${site.brand} : ${t.meta.description} ${t.meta.trial(site.trialDays)}`,
    openGraph: {
      type: "website",
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      siteName: site.brand,
      title: `${site.brand} — ${site.tagline}`,
      description: `${t.meta.ogTitle} ${t.meta.trial(site.trialDays)}`,
    },
    alternates: pageAlternates(locale, "/"),
    robots: { index: true, follow: true },
    icons: { icon: "/favicon.svg" },
  }
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw
  const t = getDict(locale)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.brand,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Windows, macOS, Linux",
    offers: { "@type": "Offer", price: "300", priceCurrency: "MAD" },
    description: `${site.tagline}. ${t.meta.ogTitle}`,
    url: `${siteUrl}${localePath(locale, "/")}`,
    inLanguage: htmlLang[locale],
  }
  return (
    <html lang={htmlLang[locale]} dir={dir(locale)} className={`${inter.variable} ${cairo.variable} ${inter.className}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={locale === "ar" ? "font-arabic" : undefined}>
        <Header locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  )
}
