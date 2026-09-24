"use client"

import Link from "next/link"
import { Fragment, useState } from "react"
import { Check } from "lucide-react"
import { plans, comparison } from "@/content/plans"
import { money, site } from "@/content/site.config"
import { Badge, Cell } from "@/components/ui"

export function PricingTable() {
  const [yearly, setYearly] = useState(false)
  return (
    <>
      <div className="container-x">
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm ${!yearly ? "font-semibold text-ink" : "text-slate-500"}`}>Mensuel</span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            onClick={() => setYearly((v) => !v)}
            className={`relative h-7 w-12 rounded-full transition ${yearly ? "bg-brand-600" : "bg-slate-300"}`}
          >
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${yearly ? "left-6" : "left-1"}`} />
          </button>
          <span className={`text-sm ${yearly ? "font-semibold text-ink" : "text-slate-500"}`}>
            Annuel <Badge color="green">2 mois offerts</Badge>
          </span>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.code} className={`card relative flex flex-col ${p.highlight ? "border-brand-500 ring-2 ring-brand-500" : ""}`}>
              {p.badge && (
                <span className="absolute -top-3 left-6">
                  <Badge>{p.badge}</Badge>
                </span>
              )}
              <h3 className="text-xl font-bold text-ink">{p.name}</h3>
              <p className="mt-1 min-h-10 text-sm text-slate-600">{p.audience}</p>
              <p className="mt-5">
                <span className="text-4xl font-bold text-ink">{money(yearly ? p.yearlyMonthly : p.monthly)}</span>
                <span className="text-sm text-slate-500"> HT / mois</span>
              </p>
              <p className="text-xs text-slate-500">
                {yearly ? `soit ${money(p.yearlyMonthly * 12)} HT / an, facturé en une fois` : `ou ${money(p.yearlyMonthly)} / mois en annuel`}
              </p>
              <Link href={p.code === "business" ? "/contact?sujet=business" : `/inscription?plan=${p.code}&billing=${yearly ? "yearly" : "monthly"}`} className={`mt-6 ${p.highlight ? "btn-primary" : "btn-secondary"}`}>
                {p.cta}
              </Link>
              <p className="mt-2 text-center text-xs text-slate-500">{site.trialDays} jours d&apos;essai gratuit, sans carte</p>
              <ul className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-700">
                {p.limits.map((l) => (
                  <li key={l.label} className="flex justify-between gap-3">
                    <span className="text-slate-500">{l.label}</span>
                    <span className="text-right font-medium">{l.value}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-700">
                {p.includes.map((t) => (
                  <li key={t} className={`flex gap-2 ${t.endsWith(":") ? "font-semibold text-ink" : ""}`}>
                    {!t.endsWith(":") && <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />}
                    {t}
                  </li>
                ))}
                {p.extras?.map((t) => (
                  <li key={t} className="text-xs text-slate-500">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Comparatif */}
      <div className="container-x mt-20">
        <h2 className="h2 text-center">Comparatif détaillé</h2>
        <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold text-ink">Fonctionnalité</th>
                {plans.map((p) => (
                  <th key={p.code} className="px-5 py-4 text-center text-sm font-semibold text-ink">
                    {p.name}
                    <span className="block text-xs font-normal text-slate-500">{money(yearly ? p.yearlyMonthly : p.monthly)} HT / mois</span>
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
                      <td className="px-5 py-3 text-center">
                        <Cell v={r.starter} />
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Cell v={r.pro} />
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Cell v={r.business} />
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Prix hors taxes (TVA 20 %). Paiement par virement bancaire, mensuel ou annuel. Instance dédiée et prestations sur site sur devis.
        </p>
      </div>
    </>
  )
}
