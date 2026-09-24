"use client"

import Link from "next/link"
import { Fragment, useState } from "react"
import { Check } from "lucide-react"
import type { Plan, CompareGroup } from "@/content/types"
import { money, site } from "@/content/site.config"
import { Badge, Cell } from "@/components/ui"
import { getDict, localePath, type Locale } from "@/i18n"

export function PricingTable({ locale, plans, comparison }: { locale: Locale; plans: Plan[]; comparison: CompareGroup[] }) {
  const t = getDict(locale)
  const [yearly, setYearly] = useState(false)
  const lp = (p: string) => localePath(locale, p)
  return (
    <>
      <div className="container-x">
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm ${!yearly ? "font-semibold text-ink" : "text-slate-500"}`}>{t.pricing.monthly}</span>
          <button type="button" role="switch" aria-checked={yearly} onClick={() => setYearly((v) => !v)} className={`relative h-7 w-12 rounded-full transition ${yearly ? "bg-brand-600" : "bg-slate-300"}`}>
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${yearly ? "start-6" : "start-1"}`} />
          </button>
          <span className={`text-sm ${yearly ? "font-semibold text-ink" : "text-slate-500"}`}>
            {t.pricing.yearly} <Badge color="green">{t.pricing.yearlyBadge}</Badge>
          </span>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.code} className={`card relative flex flex-col ${p.highlight ? "border-brand-500 ring-2 ring-brand-500" : ""}`}>
              {p.badge && (
                <span className="absolute -top-3 start-6">
                  <Badge>{p.badge}</Badge>
                </span>
              )}
              <h3 className="text-xl font-bold text-ink">{p.name}</h3>
              <p className="mt-1 min-h-10 text-sm text-slate-600">{p.audience}</p>
              <p className="mt-5">
                <span className="text-4xl font-bold text-ink">{money(yearly ? p.yearlyMonthly : p.monthly, locale)}</span>
                <span className="text-sm text-slate-500"> {t.common.perMonthHT}</span>
              </p>
              <p className="text-xs text-slate-500">{yearly ? t.pricing.yearlyTotal(money(p.yearlyMonthly * 12, locale)) : t.common.orYearly(money(p.yearlyMonthly, locale))}</p>
              <Link href={p.code === "business" ? `${lp("/contact")}?sujet=business` : `${lp("/inscription")}?plan=${p.code}&billing=${yearly ? "yearly" : "monthly"}`} className={`mt-6 ${p.highlight ? "btn-primary" : "btn-secondary"}`}>
                {p.cta}
              </Link>
              <p className="mt-2 text-center text-xs text-slate-500">{t.pricing.trialNote(site.trialDays)}</p>
              <ul className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-700">
                {p.limits.map((l) => (
                  <li key={l.label} className="flex justify-between gap-3">
                    <span className="text-slate-500">{l.label}</span>
                    <span className="text-end font-medium">{l.value}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-700">
                {p.includes.map((x) => (
                  <li key={x} className={`flex gap-2 ${x.endsWith(":") ? "font-semibold text-ink" : ""}`}>
                    {!x.endsWith(":") && <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />}
                    {x}
                  </li>
                ))}
                {p.extras?.map((x) => (
                  <li key={x} className="text-xs text-slate-500">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container-x mt-20">
        <h2 className="h2 text-center">{t.pricing.comparison}</h2>
        <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[720px] text-start">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-start text-sm font-semibold text-ink">{t.pricing.feature}</th>
                {plans.map((p) => (
                  <th key={p.code} className="px-5 py-4 text-center text-sm font-semibold text-ink">
                    {p.name}
                    <span className="block text-xs font-normal text-slate-500">
                      {money(yearly ? p.yearlyMonthly : p.monthly, locale)} {t.common.perMonthHT}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((g) => (
                <Fragment key={g.title}>
                  <tr className="bg-brand-50/60">
                    <td colSpan={4} className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-700">
                      {g.title}
                    </td>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.feature} className="border-t border-slate-100">
                      <td className="px-5 py-3 text-sm text-slate-700">{r.feature}</td>
                      <td className="px-5 py-3 text-center"><Cell v={r.starter} locale={locale} /></td>
                      <td className="px-5 py-3 text-center"><Cell v={r.pro} locale={locale} /></td>
                      <td className="px-5 py-3 text-center"><Cell v={r.business} locale={locale} /></td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-500">{t.pricing.footnote}</p>
      </div>
    </>
  )
}
