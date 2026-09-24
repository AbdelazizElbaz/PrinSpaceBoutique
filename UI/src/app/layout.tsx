import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { site } from "@/content/site.config"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.brand} — Logiciel de gestion pour imprimeries : commandes, atelier, livraison, COD`,
    template: `%s — ${site.brand}`,
  },
  description: `${site.brand} : gérez commandes, devis, atelier d'impression, livraison multi-transporteurs et contre-remboursement dans un seul outil. Essai gratuit ${site.trialDays} jours.`,
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: site.brand,
    title: `${site.brand} — ${site.tagline}`,
    description: `Commandes, atelier, livraison et encaissement COD pour les imprimeries. Essai gratuit ${site.trialDays} jours.`,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.brand,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Windows, macOS, Linux",
    offers: { "@type": "Offer", price: "300", priceCurrency: "MAD" },
    description: `${site.tagline}. Gestion des commandes, atelier, livraison et COD pour les imprimeries.`,
    url: siteUrl,
  }
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
