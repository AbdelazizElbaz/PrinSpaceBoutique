import Link from "next/link"
import { PlanPrice } from "@/components/PlanPrice"
import { ArrowRight, Check, MessageCircle } from "lucide-react"
import { Section, SectionHeading, CtaBand, Badge, FaqList } from "@/components/ui"
import { Icon } from "@/components/Icon"
import { Mockup } from "@/components/mockups/Mockup"
import { Reveal, Stagger, Tilt, CountUp } from "@/components/motion"
import { site, money, whatsappLink } from "@/content/site.config"
import { getContent } from "@/content"
import { getDict, isLocale, localePath, isRtl } from "@/i18n"
import type { LocaleParams } from "@/lib/seo"

export default async function HomePage({ params }: LocaleParams) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "fr"
  const t = getDict(locale)
  const c = getContent(locale)
  const lp = (p: string) => localePath(locale, p)
  const Arrow = ArrowRight
  const arrowCls = `h-4 w-4 ${isRtl(locale) ? "rotate-180" : ""}`
  const topFaq = c.faq[0].items.slice(0, 3).concat(c.faq[2].items.slice(1, 3))

  return (
    <>
      <section className="relative overflow-hidden bg-grid">
        <div className="aurora" aria-hidden>
          <span /><span /><span />
        </div>
        <div className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-brand-50/80 to-transparent" />
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="hero-in hero-in-1"><Badge>{t.home.badge}</Badge></div>
            <h1 className="h1 mt-5">
              {t.home.h1a} <span className="text-shine">{t.home.h1b}</span>
            </h1>
            <p className="lead hero-in hero-in-3 mt-6">{t.home.lead(site.brand)}</p>
            <div className="hero-in hero-in-4 mt-8 flex flex-wrap gap-3">
              <Link href={lp("/inscription")} className="btn-primary btn-shine">
                {t.nav.trial(site.trialDays)} <Arrow className={arrowCls} />
              </Link>
              <a href={whatsappLink(t.common.whatsappMsg(site.brand))} target="_blank" rel="noreferrer" className="btn-secondary">
                <MessageCircle className="h-4 w-4 text-[#25D366]" /> {t.common.whatsapp}
              </a>
            </div>
            <ul className="hero-in hero-in-5 mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              {t.home.bullets(money(c.plans[0].monthly, locale)).map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="hero-in-mock relative" dir="ltr">
            <div className="mock-glow" aria-hidden />
            <Tilt className="animate-float">
              <Mockup kind="orders" locale={locale} className="shadow-2xl ring-1 ring-slate-200" />
            </Tilt>
          </div>
        </div>
      </section>

      <div className="border-y border-slate-200 bg-white">
        <div className="container-x grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {c.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 120} from="zoom" className="stat-float text-center">
              <p className="text-3xl font-bold text-ink"><CountUp value={s.value} /></p>
              <p className="mt-1 text-sm text-slate-600">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <Section tone="gray">
        <Reveal><SectionHeading eyebrow={t.home.whyEyebrow} title={t.home.whyTitle} lead={t.home.whyLead} /></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Stagger step={120}>
            {t.home.whyCards.map((x) => (
              <div key={x.t} className="card card-glow h-full">
                <h3 className="h3">{x.t}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{x.d}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section id="fonctionnalites">
        <Reveal><SectionHeading eyebrow={t.home.featuresEyebrow} title={t.home.featuresTitle} lead={t.home.featuresLead} /></Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stagger step={80}>
            {c.features.map((f) => (
              <Link key={f.slug} href={`${lp("/fonctionnalites")}#${f.slug}`} className="card card-glow group block h-full">
                <span className={`card-icon inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md ${f.color}`}>
                  <Icon name={f.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink transition group-hover:text-brand-700">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{f.short}</p>
              </Link>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section tone="gray">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal from="left">
            <div dir="ltr">
              <Tilt max={6}>
                <Mockup kind="cod" locale={locale} className="shadow-xl ring-1 ring-slate-200" />
              </Tilt>
            </div>
          </Reveal>
          <Reveal from="right" delay={120}>
            <p className="eyebrow">{t.home.codEyebrow}</p>
            <h2 className="h2 mt-3">{t.home.codTitle}</h2>
            <p className="lead mt-4">{t.home.codLead}</p>
            <ul className="mt-6 space-y-3">
              {t.home.codBullets.map((x) => (
                <li key={x} className="flex gap-3 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {x}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal from="left" className="order-2 lg:order-1">
            <p className="eyebrow">{t.home.agentEyebrow}</p>
            <h2 className="h2 mt-3">{t.home.agentTitle}</h2>
            <p className="lead mt-4">{t.home.agentLead(site.agentName)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={lp("/agent")} className="btn-secondary">
                {t.home.agentCta} <Arrow className={arrowCls} />
              </Link>
              <Link href={`${lp("/formation")}#produire`} className="btn-ghost">
                {t.home.agentTraining}
              </Link>
            </div>
          </Reveal>
          <Reveal from="right" delay={120} className="order-1 lg:order-2">
            <div dir="ltr">
              <Tilt max={6}>
                <Mockup kind="agent" locale={locale} className="shadow-xl ring-1 ring-slate-200" />
              </Tilt>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="dark">
        <Reveal><SectionHeading eyebrow={t.home.howEyebrow} title={t.home.howTitle} dark /></Reveal>
        <Reveal from="none" className="relative mt-12">
          <div className="steps-line hidden md:block" aria-hidden />
          <ol className="grid gap-8 md:grid-cols-4">
            {c.steps.map((s, i) => (
              <li key={s.n}>
                <span className="step-dot relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white shadow-lg shadow-brand-500/40" style={{ animationDelay: `${0.3 + i * 0.35}s` }}>{s.n}</span>
                <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{s.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      <Section>
        <Reveal><SectionHeading eyebrow={t.home.whoEyebrow} title={t.home.whoTitle} /></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Stagger step={90} from="zoom">
            {c.audiences.map((a) => (
              <div key={a.title} className="card-glow h-full rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-semibold text-ink">{a.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{a.text}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section tone="gray" id="tarifs">
        <Reveal><SectionHeading eyebrow={t.home.pricingEyebrow} title={t.home.pricingTitle} lead={t.home.pricingLead} /></Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {c.plans.map((p, i) => (
            <Reveal key={p.code} delay={i * 130} from="up" className="flex">
            <div className={`card card-glow relative flex w-full flex-col ${p.highlight ? "ring-breathe border-brand-500 ring-2 ring-brand-500 lg:-translate-y-2 lg:scale-[1.03]" : ""}`}>
              {p.badge && (
                <span className="absolute -top-3 start-6">
                  <Badge>{p.badge}</Badge>
                </span>
              )}
              <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.description}</p>
              <p className="mt-5">
                <PlanPrice plan={p} locale={locale} perLabel={t.common.perMonthHT} />
              </p>
              <p className="text-xs text-slate-500">{t.common.orYearly(money(p.yearlyMonthly, locale))}</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-700">
                {p.limits.slice(0, 3).map((l) => (
                  <li key={l.label} className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">{l.label}</span>
                    <span className="font-medium">{l.value}</span>
                  </li>
                ))}
              </ul>
              <Link href={p.code === "business" ? `${lp("/contact")}?sujet=business` : `${lp("/inscription")}?plan=${p.code}`} className={`mt-6 ${p.highlight ? "btn-primary btn-shine" : "btn-secondary"}`} aria-label={`${p.cta} — ${p.name}`}>
                {p.cta}
              </Link>
            </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-600">
          <Link href={lp("/tarifs")} className="font-semibold text-brand-700 hover:underline">
            {t.common.seeComparison}
          </Link>
        </p>
      </Section>

      <Section>
        <Reveal><SectionHeading eyebrow={t.home.testimonialsEyebrow} title={t.home.testimonialsTitle} /></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {c.testimonials.map((x, i) => (
            <Reveal key={x.name} delay={i * 120} as="figure" className="card card-glow">
              <blockquote className="text-sm leading-7 text-slate-700">« {x.text} »</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-ink">{x.name}</span>
                <span className="block text-slate-500">{x.role}</span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="gray">
        <Reveal><SectionHeading eyebrow={t.home.faqEyebrow} title={t.home.faqTitle} /></Reveal>
        <Reveal delay={100}><FaqList items={topFaq} /></Reveal>
        <p className="mt-6 text-center text-sm">
          <Link href={lp("/faq")} className="font-semibold text-brand-700 hover:underline">
            {t.common.seeAll}
          </Link>
        </p>
      </Section>

      <CtaBand locale={locale} />
    </>
  )
}
