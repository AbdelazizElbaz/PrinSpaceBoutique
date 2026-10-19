import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import { Section, SectionHeading, CtaBand } from "@/components/ui"
import { Icon } from "@/components/Icon"
import { Mockup } from "@/components/mockups/Mockup"
import { CarriersRow } from "@/components/CarriersBand"
import { getContent } from "@/content"
import { features as frFeatures } from "@/content/fr/features"
import { getDict, isLocale, isRtl, localePath } from "@/i18n"
import { locales } from "@/i18n/config"
import { pageAlternates, siteUrl } from "@/lib/seo"
import { site } from "@/content/site.config"

// Une page par module (/fonctionnalites/commandes, /fonctionnalites/atelier, …), générée depuis le contenu de
// content/<langue>/features.ts — recommandation SEO du 19/10/2026 : des pages internes dédiées, indexables
// séparément, avec un titre orienté mot-clé. Les textes restent ceux de la page Fonctionnalités (aucune duplication
// à maintenir) ; la page ajoute le fil d'Ariane, les liens vers les autres modules et les données structurées.

type Params = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return locales.flatMap((locale) => frFeatures.map((f) => ({ locale, slug: f.slug })))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  const f = getContent(locale).features.find((x) => x.slug === slug)
  if (!f) return {}
  const description = `${f.short} ${f.description}`.slice(0, 158)
  return { title: t.features.subMetaTitle(f.title), description, alternates: pageAlternates(locale, `/fonctionnalites/${slug}`) }
}

export default async function FeaturePage({ params }: Params) {
  const { locale: raw, slug } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  const { features } = getContent(locale)
  const f = features.find((x) => x.slug === slug)
  if (!f) notFound()
  const others = features.filter((x) => x.slug !== slug)
  const arrowCls = `h-4 w-4 ${isRtl(locale) ? "rotate-180" : ""}`
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.brand, item: `${siteUrl}${localePath(locale, "/")}` },
      { "@type": "ListItem", position: 2, name: t.features.eyebrow, item: `${siteUrl}${localePath(locale, "/fonctionnalites")}` },
      { "@type": "ListItem", position: 3, name: f.title, item: `${siteUrl}${localePath(locale, `/fonctionnalites/${f.slug}`)}` },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Section className="pb-8">
        <Link href={localePath(locale, "/fonctionnalites")} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800">
          <ArrowLeft className={arrowCls} /> {t.features.backToAll}
        </Link>
        <div className="mt-6 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl text-white ${f.color}`}>
              <Icon name={f.icon} className="h-6 w-6" />
            </span>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-brand-700">{t.features.eyebrow}</p>
            <h1 className="h1 mt-2">{f.title}</h1>
            <p className="lead mt-4">{f.short}</p>
            <p className="mt-4 text-slate-700">{f.description}</p>
            <ul className="mt-6 space-y-3">
              {f.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {b}
                </li>
              ))}
            </ul>
            {f.slug === "livraison" && <CarriersRow locale={locale} />}
            {f.slug === "atelier" && (
              <Link href={localePath(locale, "/agent")} className="btn-secondary mt-6">
                {t.features.agentLink}
              </Link>
            )}
          </div>
          <div dir="ltr">
            <Mockup kind={f.mockup} locale={locale} className="shadow-xl ring-1 ring-slate-200" />
          </div>
        </div>
      </Section>
      <Section tone="gray" className="py-14">
        <SectionHeading eyebrow={t.features.eyebrow} title={t.features.otherModules} align="left" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((o) => (
            <Link key={o.slug} href={localePath(locale, `/fonctionnalites/${o.slug}`)} className="card card-glow flex items-start gap-3 p-5">
              <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white ${o.color}`}>
                <Icon name={o.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold text-ink">{o.title}</span>
                <span className="mt-1 block text-sm text-slate-600">{o.short}</span>
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <CtaBand locale={locale} />
    </>
  )
}
