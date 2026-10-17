import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, Truck } from "lucide-react"
import { Section, SectionHeading } from "@/components/ui"
import { Reveal, Stagger } from "@/components/motion"
import { getDict, isRtl, localePath, type Locale } from "@/i18n"

// Transporteurs intégrés nativement dans l'application (demande utilisateur du 17/10/2026 : « mettre en valeur
// le fait que notre app intègre déjà Ozone Express, Olivraison, Sendit, Ameex… avec leurs logos »). Les logos
// viennent de l'application (ui/public/providers) ; les marques appartiennent à leurs propriétaires (voir mentions
// légales). Ajouter un transporteur = une entrée ici + son logo dans public/carriers.
export const CARRIERS = [
  { key: "ameex", name: "Ameex", logo: "/carriers/ameex.png", w: 450, h: 130, wordmark: true },
  { key: "olivraison", name: "Olivraison", logo: "/carriers/olivraison.png", w: 512, h: 512, wordmark: false },
  { key: "ozoneexpress", name: "Ozone Express", logo: "/carriers/ozoneexpress.png", w: 536, h: 466, wordmark: false },
  { key: "sendit", name: "Sendit", logo: "/carriers/sendit.png", w: 180, h: 208, wordmark: false },
] as const

/** Bande complète (page d'accueil) : titre, une carte par transporteur, livreurs internes, appel « autre transporteur ? ». */
export function CarriersBand({ locale }: { locale: Locale }) {
  const t = getDict(locale).home
  const arrowCls = `h-4 w-4 ${isRtl(locale) ? "rotate-180" : ""}`
  return (
    <Section id="transporteurs">
      <Reveal>
        <SectionHeading eyebrow={t.carriersEyebrow} title={t.carriersTitle} lead={t.carriersLead} />
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Stagger anime chaque élément du tableau reçu : on lui passe un seul tableau plat (4 transporteurs + livreurs internes). */}
        <Stagger step={90}>
          {[...CARRIERS.map((c) => (
            <div key={c.key} className="card card-glow flex h-full flex-col items-center justify-center gap-3 px-4 py-6 text-center" dir="ltr">
              <div className="flex h-16 items-center justify-center">
                <Image src={c.logo} alt={c.name} width={c.w} height={c.h} className={c.wordmark ? "h-10 w-auto" : "h-14 w-auto"} />
              </div>
              <p className="text-base font-semibold text-ink">{c.name}</p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">{t.carriersNative}</span>
            </div>
          )),
          // Livreurs internes : même application que les transporteurs (espace livreur, ramassage, ticket, tracking).
          <div key="internal" className="card card-glow flex h-full flex-col items-center justify-center gap-3 border-brand-200 bg-brand-50/40 px-4 py-6 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md">
              <Truck className="h-7 w-7" />
            </span>
            <p className="text-base font-semibold text-ink">{t.carriersInternal}</p>
            <ul className="space-y-1 text-xs text-slate-600">
              {t.carriersInternalPoints.map((x) => (
                <li key={x} className="flex items-center justify-center gap-1.5"><Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> {x}</li>
              ))}
            </ul>
          </div>,
          ]}
        </Stagger>
      </div>
      <Reveal delay={200}>
        <p className="mt-8 text-center text-sm text-slate-600">
          {t.carriersMore}{" "}
          <Link href={localePath(locale, "/contact")} className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800">
            {t.carriersMoreCta} <ArrowRight className={arrowCls} />
          </Link>
        </p>
      </Reveal>
    </Section>
  )
}

/** Version compacte (page Fonctionnalités, section Livraison) : une ligne de pastilles logo + nom. */
export function CarriersRow({ locale }: { locale: Locale }) {
  const t = getDict(locale).home
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.carriersCompact}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        {CARRIERS.map((c) => (
          <span key={c.key} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pe-3.5 ps-2 text-sm font-medium text-slate-800 shadow-sm" dir="ltr">
            <Image src={c.logo} alt="" width={c.w} height={c.h} className={c.wordmark ? "h-5 w-auto" : "h-6 w-auto"} />
            {c.name}
          </span>
        ))}
        <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-slate-300 px-3.5 py-1.5 text-sm text-slate-600">
          <Truck className="h-4 w-4" /> {t.carriersInternal}
        </span>
      </div>
    </div>
  )
}
