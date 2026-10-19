import type { Metadata } from "next"
import { getContent } from "@/content"
import { applySettings, getSiteSettings } from "@/lib/siteSettings"
import { getDict, isLocale } from "@/i18n"
import { pageAlternates, type LocaleParams } from "@/lib/seo"
import { LegalPage } from "../LegalPage"

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  return { title: t.footer.legalNotice, robots: { index: false }, alternates: pageAlternates(locale, "/mentions-legales") }
}

export default async function Page({ params }: LocaleParams) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const { legal } = applySettings(getContent(locale), await getSiteSettings())
  return <LegalPage eyebrow={legal.eyebrow} doc={legal.notice} contactTitle={legal.contactTitle} />
}
