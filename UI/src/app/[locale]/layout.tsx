import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Inter, Cairo } from "next/font/google"
import "../globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ChatWidget } from "@/components/chat/ChatWidget"
import { VisitorTracker } from "@/components/chat/VisitorTracker"
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider"
import { applyPlans, getSiteSettings } from "@/lib/siteSettings"
import { money } from "@/content/site.config"
import { getContent } from "@/content"
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
    // Mot-clé d'abord, marque ensuite (format des concurrents les mieux classés) ; prix d'appel dans la description.
    title: { default: `${t.meta.title} — ${site.brand}`, template: `%s — ${site.brand}` },
    description: `${site.brand} : ${t.meta.description} ${t.meta.from(money(applyPlans(getContent(locale).plans, await getSiteSettings())[0]?.monthly ?? 290, locale))} ${t.meta.trial(site.trialDays)}`,
    openGraph: {
      type: "website",
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      siteName: site.brand,
      title: `${site.brand} — ${site.tagline}`,
      description: `${t.meta.ogTitle} ${t.meta.trial(site.trialDays)}`,
    },
    alternates: pageAlternates(locale, "/"),
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    icons: { icon: "/favicon.svg" },
    // Ciblage géographique Maroc (balises geo, lues par certains moteurs et annuaires).
    other: { "geo.region": "MA", "geo.placename": site.company.city, "geo.country": "Maroc" },
  }
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw
  const t = getDict(locale)
  // Réglages modifiables depuis la console (prix, coordonnées), relus toutes les 60 s — voir lib/siteSettings.ts.
  const settings = await getSiteSettings()
  const starterPrice = applyPlans(getContent(locale).plans, settings)[0]?.monthly ?? 290
  // Données structurées (schema.org) : l'organisation basée à Casablanca (Maroc) — nom, téléphone,
  // réseaux, zone desservie — le site et l'application. Google s'en sert pour le panneau de marque et
  // le ciblage local « Maroc ».
  const organization = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: site.brand,
    legalName: site.company.legalName,
    url: siteUrl,
    logo: `${siteUrl}/opengraph-image`, // PNG 1200x630 généré (Google n'indexe pas les logos SVG)
    telephone: settings.contact.phone,
    address: { "@type": "PostalAddress", addressLocality: site.company.city, addressCountry: "MA" },
    areaServed: { "@type": "Country", name: "Morocco" },
    contactPoint: [{ "@type": "ContactPoint", telephone: settings.contact.phone, contactType: "sales", areaServed: "MA", availableLanguage: ["fr", "ar", "en"] }],
    // sameAs (réseaux sociaux) : à activer quand les vraies adresses seront dans site.config (encore « À REMPLACER »).
  }
  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: site.brand,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: ["fr-MA", "ar-MA", "en"],
  }
  const application = {
    "@type": "SoftwareApplication",
    name: site.brand,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "ERP",
    operatingSystem: "Web, Windows, macOS, Linux",
    // Pays cible et fonctionnalités principales (titres des fonctionnalités du site) — recommandations SEO du 19/10/2026.
    countriesSupported: "MA",
    featureList: getContent(locale).features.map((f) => f.title),
    // Une offre par forfait (Starter / Pro / Business), prix mensuels HT en dirhams.
    offers: applyPlans(getContent(locale).plans, settings).map((p) => ({ "@type": "Offer", name: p.name, price: String(p.monthly), priceCurrency: "MAD", availability: "https://schema.org/InStock", areaServed: "MA", url: `${siteUrl}${localePath(locale, "/tarifs")}` })),
    description: `${site.brand} : ${t.meta.description}`,
    url: `${siteUrl}${localePath(locale, "/")}`,
    inLanguage: htmlLang[locale],
    publisher: { "@id": `${siteUrl}/#organization` },
    areaServed: { "@type": "Country", name: "Morocco" },
  }
  const jsonLd = { "@context": "https://schema.org", "@graph": [organization, website, application] }
  return (
    <html lang={htmlLang[locale]} dir={dir(locale)} className={`${inter.variable} ${cairo.variable} ${inter.className}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={locale === "ar" ? "font-arabic" : undefined}>
        <SiteSettingsProvider value={settings}>
          <Header locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />
          {/* Chat en direct + présence des visiteurs (console : /admin/messages), voir components/chat. */}
          <VisitorTracker locale={locale} />
          <ChatWidget locale={locale} />
        </SiteSettingsProvider>
      </body>
    </html>
  )
}
