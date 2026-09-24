import type { Metadata } from "next"
import { Section, SectionHeading, CtaBand } from "@/components/ui"
import { getContent } from "@/content"
import { getDict, isLocale } from "@/i18n"
import { pageAlternates, type LocaleParams } from "@/lib/seo"
import { FaqSearch } from "./FaqSearch"

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  return { title: t.faq.metaTitle, description: t.faq.metaDesc, alternates: pageAlternates(locale, "/faq") }
}

export default async function FaqPage({ params }: LocaleParams) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  const { faq } = getContent(locale)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.flatMap((g) => g.items).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Section className="pb-4">
        <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} lead={t.faq.lead} />
      </Section>
      <FaqSearch groups={faq} locale={locale} />
      <CtaBand locale={locale} title={t.faq.ctaTitle} text={t.faq.ctaText} />
    </>
  )
}
