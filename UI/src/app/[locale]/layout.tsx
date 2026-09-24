import type { Metadata } from "next"
import { notFound } from "next/navigation"
import "../globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { site } from "@/content/site.config"
import { dir, getDict, htmlLang, isLocale, locales, localePath, ogLocale, type Locale } from "@/i18n"
import { pageAlternates, siteUrl } from "@/lib/seo"

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
    <html lang={htmlLang[locale]} dir={dir(locale)}>
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        {locale === "ar" && <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" />}
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
