import type { Metadata } from "next"
import Link from "next/link"
import { Apple, Check, Download, KeyRound, MonitorCog, RefreshCw, Server, ShieldCheck } from "lucide-react"
import { Section, SectionHeading, CtaBand } from "@/components/ui"
import { Mockup } from "@/components/mockups/Mockup"
import { site } from "@/content/site.config"
import { getDict, isLocale, localePath } from "@/i18n"
import { pageAlternates, type LocaleParams } from "@/lib/seo"

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  return { title: t.agent.metaTitle(site.agentName), description: t.agent.metaDesc, alternates: pageAlternates(locale, "/agent") }
}

const icons = [RefreshCw, Server, KeyRound, MonitorCog, Download, ShieldCheck]

export default async function AgentPage({ params }: LocaleParams) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  const lp = (p: string) => localePath(locale, p)
  return (
    <>
      <section className="bg-grid">
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="eyebrow">{t.agent.eyebrow}</p>
            <h1 className="h1 mt-4">{t.agent.title}</h1>
            <p className="lead mt-6">{t.agent.lead(site.agentName)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={lp("/inscription")} className="btn-primary">
                {t.agent.tryFree}
              </Link>
              <Link href={`${lp("/formation")}#produire`} className="btn-secondary">
                {t.agent.seeVideos}
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              {t.agent.os.map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" /> {x}
                </li>
              ))}
            </ul>
          </div>
          <div dir="ltr">
            <Mockup kind="agent" locale={locale} className="shadow-2xl ring-1 ring-slate-200" />
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading eyebrow={t.agent.whatEyebrow} title={t.agent.whatTitle} />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.agent.points.map((p, i) => {
            const I = icons[i]
            return (
              <div key={p.t} className="card">
                <I className="h-6 w-6 text-brand-600" />
                <h3 className="mt-4 font-semibold text-ink">{p.t}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{p.d}</p>
              </div>
            )
          })}
        </div>
      </Section>

      <Section tone="gray">
        <SectionHeading eyebrow={t.agent.installEyebrow} title={t.agent.installTitle} />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {t.agent.installSteps.map((s, i) => (
            <li key={s.t} className="card">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">{i + 1}</span>
              <h3 className="mt-4 font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div dir="ltr">
            <Mockup kind="workshop" locale={locale} className="shadow-xl ring-1 ring-slate-200" />
          </div>
          <div>
            <p className="eyebrow">{t.agent.webEyebrow}</p>
            <h2 className="h2 mt-3">{t.agent.webTitle}</h2>
            <p className="lead mt-4">{t.agent.webLead}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {t.agent.webBullets.map((x) => (
                <li key={x} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="gray">
        <div className="mx-auto max-w-3xl text-center">
          <Apple className="mx-auto h-8 w-8 text-slate-400" />
          <h2 className="h3 mt-4">{t.agent.reqTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{t.agent.reqText}</p>
        </div>
      </Section>
      <CtaBand locale={locale} />
    </>
  )
}
