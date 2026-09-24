import Link from "next/link"
import { headers } from "next/headers"
import { Section } from "@/components/ui"
import { getDict, isLocale, localePath } from "@/i18n"

export default async function NotFound() {
  const h = await headers()
  const raw = h.get("x-locale") || "fr"
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  return (
    <Section>
      <div className="mx-auto max-w-lg text-center">
        <p className="eyebrow">{t.notFound.eyebrow}</p>
        <h1 className="h2 mt-3">{t.notFound.title}</h1>
        <p className="lead mt-4">{t.notFound.lead}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href={localePath(locale, "/")} className="btn-primary">{t.common.home}</Link>
          <Link href={localePath(locale, "/faq")} className="btn-secondary">{t.nav.faq}</Link>
        </div>
      </div>
    </Section>
  )
}
