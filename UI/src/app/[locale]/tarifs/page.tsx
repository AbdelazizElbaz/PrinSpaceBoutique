import type { Metadata } from "next"
import { Section, SectionHeading, CtaBand, FaqList } from "@/components/ui"
import { PricingTable } from "./PricingTable"
import { site } from "@/content/site.config"
import { getContent } from "@/content"
import { getDict, isLocale } from "@/i18n"
import { pageAlternates, type LocaleParams } from "@/lib/seo"

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  return { title: t.pricing.metaTitle, description: t.pricing.metaDesc(site.brand, site.trialDays), alternates: pageAlternates(locale, "/tarifs") }
}

export default async function PricingPage({ params }: LocaleParams) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  const c = getContent(locale)
  const abo = c.faq.find((g) => g.id === "abonnement")!
  return (
    <>
      <Section className="pb-6">
        <SectionHeading eyebrow={t.pricing.eyebrow} title={t.pricing.title} lead={t.pricing.lead} />
      </Section>
      <PricingTable locale={locale} plans={c.plans} comparison={c.comparison} />
      <Section tone="gray">
        <SectionHeading eyebrow={t.pricing.faqEyebrow} title={t.pricing.faqTitle} />
        <FaqList items={abo.items} />
      </Section>
      <CtaBand locale={locale} title={t.pricing.ctaTitle} text={t.pricing.ctaText} />
    </>
  )
}
