import type { Metadata } from "next"
import { Suspense } from "react"
import { Section } from "@/components/ui"
import { site } from "@/content/site.config"
import { getContent } from "@/content"
import { getDict, isLocale } from "@/i18n"
import { pageAlternates, type LocaleParams } from "@/lib/seo"
import { SignupWizard } from "./SignupWizard"

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  return { title: t.signup.metaTitle(site.trialDays), description: t.signup.metaDesc(site.brand), robots: { index: true, follow: false }, alternates: pageAlternates(locale, "/inscription") }
}

export default async function SignupPage({ params }: LocaleParams) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  return (
    <Section className="py-10 sm:py-14">
      <Suspense>
        <SignupWizard locale={locale} plans={getContent(locale).plans} />
      </Suspense>
    </Section>
  )
}
