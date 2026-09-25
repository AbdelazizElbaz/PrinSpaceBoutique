import type { Metadata } from "next"
import { Suspense } from "react"
import { Section, SectionHeading } from "@/components/ui"
import { site } from "@/content/site.config"
import { getDict, isLocale } from "@/i18n"
import { pageAlternates, type LocaleParams } from "@/lib/seo"
import { ContactForm } from "./ContactForm"
import { ContactCards } from "./ContactCards"

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  return { title: t.contact.metaTitle, description: t.contact.metaDesc(site.brand), alternates: pageAlternates(locale, "/contact") }
}

export default async function ContactPage({ params }: LocaleParams) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  return (
    <Section>
      <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} lead={t.contact.lead} />
      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ContactCards locale={locale} />
          <p className="mt-6 text-sm text-slate-500">
            {site.contact.hours}. {site.company.legalName}, {site.company.city}.
          </p>
        </div>
        <div className="card lg:col-span-3">
          <Suspense>
            <ContactForm locale={locale} />
          </Suspense>
        </div>
      </div>
    </Section>
  )
}
