import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Section, SectionHeading, CtaBand, FaqList } from "@/components/ui"
import { Reveal, Stagger } from "@/components/motion"
import { Diagrams } from "@/components/Diagrams"
import { getContent } from "@/content"
import { site } from "@/content/site.config"
import { getDict, isLocale, isRtl, localePath } from "@/i18n"
import { pageAlternates, siteUrl, type LocaleParams } from "@/lib/seo"
import { applySettings, getSiteSettings } from "@/lib/siteSettings"

// Page « Logiciel d'imprimerie tout-en-un au Maroc » — référencement (20/10/2026) : une URL dédiée au mot-clé
// « logiciel imprimerie maroc tout-en-un », qui nomme explicitement chaque pilier (devis au m², facturation, stocks
// de matières, atelier, livraison + COD, boutique) avec une FAQ en données structurées. Textes : dict allInOne +
// groupe FAQ « tout-en-un » du contenu.

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  return { title: { absolute: `${t.allInOne.metaTitle} — ${site.brand}` }, description: t.allInOne.metaDesc, alternates: pageAlternates(locale, "/logiciel-imprimerie-maroc") }
}

export default async function AllInOnePage({ params }: LocaleParams) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  const c = applySettings(getContent(locale), await getSiteSettings())
  const faqGroup = c.faq.find((g) => g.id === "tout-en-un")
  const arrowCls = `h-4 w-4 ${isRtl(locale) ? "rotate-180" : ""}`
  const faqLd = faqGroup
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqGroup.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
      }
    : null
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.brand, item: `${siteUrl}${localePath(locale, "/")}` },
      { "@type": "ListItem", position: 2, name: t.allInOne.title, item: `${siteUrl}${localePath(locale, "/logiciel-imprimerie-maroc")}` },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <Section className="pb-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-brand-700">{t.allInOne.eyebrow}</p>
          <h1 className="h1 mt-2 text-center">{t.allInOne.metaTitle}</h1>
          <p className="lead mx-auto mt-6 max-w-3xl text-center">{t.allInOne.lead}</p>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-slate-600">{t.allInOne.audiences}</p>
        </Reveal>
        <Reveal delay={150} className="mt-10"><Diagrams center={site.brand} eco={t.ecosystem} flow={t.orderFlow} rtl={isRtl(locale)} /></Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Stagger step={80}>
            {t.allInOne.pillars.map((p) => (
              <div key={p.title} className="card card-glow h-full">
                <h2 className="text-base font-semibold text-ink">{p.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{p.text}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </Section>
      <Section tone="gray" className="py-14">
        <SectionHeading title={t.allInOne.compareTitle} align="left" />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {t.allInOne.compareItems.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-slate-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {item}
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link href={localePath(locale, "/fonctionnalites")} className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800">
            {t.allInOne.cta} <ArrowRight className={arrowCls} />
          </Link>
        </p>
      </Section>
      <Section className="py-14">
        <SectionHeading eyebrow={t.trust.eyebrow} title={t.trust.title} align="left" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.trust.items.map((item) => (
            <div key={item.title} className="card h-full">
              <h2 className="flex items-start gap-2 text-base font-semibold text-ink"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" /> {item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>
      {faqGroup && (
        <Section className="py-14">
          <SectionHeading title={t.allInOne.faqTitle} align="left" />
          <div className="mt-6">
            <FaqList items={faqGroup.items} />
          </div>
        </Section>
      )}
      <CtaBand locale={locale} />
    </>
  )
}
