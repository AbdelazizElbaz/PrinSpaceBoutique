"use client"

// Sélecteur entre les deux schémas animés (20/10/2026) : « vue écosystème » (Ecosystem.tsx, modules en orbite) et
// « créer une commande » (OrderFlow.tsx, parcours en panneaux). Le composant actif est remonté à chaque bascule,
// ce qui relance son animation d'apparition.

import { useState } from "react"
import { Ecosystem, type EcoModule } from "@/components/Ecosystem"
import { OrderFlow, type OrderFlowText } from "@/components/OrderFlow"
import { ResellerFlow, type ResellerFlowText } from "@/components/ResellerFlow"

export function Diagrams({
  center,
  eco,
  flow,
  reseller,
  rtl = false,
}: {
  center: string
  eco: { modules: EcoModule[]; hint: string; views: { ecosystem: string; order: string; reseller: string } }
  flow: OrderFlowText
  reseller: ResellerFlowText
  rtl?: boolean
}) {
  type View = "eco" | "order" | "reseller"
  const [view, setView] = useState<View>("eco")
  const tabs: { key: View; label: string }[] = [
    { key: "eco", label: eco.views.ecosystem },
    { key: "order", label: eco.views.order },
    { key: "reseller", label: eco.views.reseller },
  ]
  return (
    <div>
      <div role="tablist" className="mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={view === tab.key}
            onClick={() => setView(tab.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${view === tab.key ? "bg-brand-600 text-white shadow" : "text-slate-600 hover:text-slate-900"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-8" role="tabpanel">
        {view === "eco" && <Ecosystem key="eco" center={center} modules={eco.modules} hint={eco.hint} rtl={rtl} />}
        {view === "order" && <OrderFlow key="order" center={center} t={flow} rtl={rtl} />}
        {view === "reseller" && <ResellerFlow key="reseller" t={reseller} rtl={rtl} />}
      </div>
    </div>
  )
}
