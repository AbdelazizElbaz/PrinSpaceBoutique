import { money } from "@/content/site.config"
import type { Plan } from "@/content/fr/plans"

// Prix d'un forfait : préfixe éventuel (« À partir de »), ancien prix barré
// quand une promo est en cours (listMonthly / listYearlyMonthly), prix payé
// et pastille promo. Utilisé sur l'accueil, /tarifs et l'inscription pour que
// l'affichage reste identique partout.
export function PlanPrice({
  plan: p,
  yearly = false,
  locale,
  perLabel,
  size = "lg",
}: {
  plan: Plan
  yearly?: boolean
  locale: "fr" | "ar" | "en"
  perLabel: string
  size?: "lg" | "md" | "sm"
}) {
  const price = yearly ? p.yearlyMonthly : p.monthly
  const list = yearly ? p.listYearlyMonthly : p.listMonthly
  const priceCls = size === "lg" ? "text-4xl" : size === "md" ? "text-2xl" : "text-sm"
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
      {p.pricePrefix && <span className="text-sm font-medium text-slate-500">{p.pricePrefix}</span>}
      {list && list > price && (
        <span className={`${size === "sm" ? "text-xs" : "text-lg"} font-semibold text-slate-400 line-through`}>{money(list, locale)}</span>
      )}
      <span className={`${priceCls} font-bold text-ink`}>{money(price, locale)}</span>
      <span className="text-xs font-normal text-slate-500">{perLabel}</span>
      {p.promoLabel && list && list > price && size !== "sm" && (
        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">{p.promoLabel}</span>
      )}
    </span>
  )
}
