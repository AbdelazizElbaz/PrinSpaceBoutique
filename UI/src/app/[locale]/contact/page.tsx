import type { Metadata } from "next"
import { Suspense } from "react"
import { Mail, MessageCircle, Phone } from "lucide-react"
import { Section, SectionHeading } from "@/components/ui"
import { site } from "@/content/site.config"
import { getDict, isLocale } from "@/i18n"
import { pageAlternates, type LocaleParams } from "@/lib/seo"
import { ContactForm } from "./ContactForm"

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
  const cards = [
    { icon: Mail, t: t.contact.email, v: site.contact.salesEmail, href: `mailto:${site.contact.salesEmail}` },
    { icon: Phone, t: t.contact.phone, v: site.contact.phone, href: `tel:${site.contact.phone.replace(/\s/g, "")}` },
    { icon: MessageCircle, t: t.contact.whatsapp, v: t.contact.writeWhatsapp, href: `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(t.contact.whatsappMsg(site.brand))}` },
  ]
  return (
    <Section>
      <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} lead={t.contact.lead} />
      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {cards.map((c) => (
              <a key={c.t} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 hover:border-brand-300">
                <c.icon className="mt-0.5 h-5 w-5 text-brand-600" />
                <span>
                  <span className="block text-sm font-semibold text-ink">{c.t}</span>
                  <span className="block text-sm text-slate-600" dir="ltr">{c.v}</span>
                </span>
              </a>
            ))}
          </div>
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
