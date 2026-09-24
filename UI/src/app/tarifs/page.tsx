import type { Metadata } from "next"
import { Section, SectionHeading, CtaBand } from "@/components/ui"
import { PricingTable } from "./PricingTable"
import { faq } from "@/content/faq"
import { site } from "@/content/site.config"

export const metadata: Metadata = {
  title: "Tarifs : Starter, Pro, Business — essai gratuit 14 jours",
  description: `Forfaits ${site.brand} à partir de 300 DH HT/mois. Même application pour tous, limites par volume. Essai gratuit ${site.trialDays} jours sans carte bancaire.`,
}

export default function PricingPage() {
  const abo = faq.find((g) => g.id === "abonnement")!
  return (
    <>
      <Section className="pb-6">
        <SectionHeading
          eyebrow="Tarifs"
          title="Toute la solution, à la taille de votre atelier"
          lead="Les trois forfaits donnent accès à la même application. Ils diffèrent par le volume (utilisateurs, commandes, stockage, points de vente) et l'accompagnement. Prix HT, facturés au Maroc."
        />
      </Section>
      <PricingTable />
      <Section tone="gray">
        <SectionHeading eyebrow="Questions sur l'abonnement" title="Paiement, changement de forfait, résiliation" />
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {abo.items.map((f) => (
            <details key={f.q} className="group px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink">
                {f.q}
                <span className="ml-4 text-slate-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
      <CtaBand title="Pas sûr du forfait ?" text="Commencez l'essai gratuit sur Pro : vous pourrez changer de forfait à tout moment, sans perdre vos données." />
    </>
  )
}
