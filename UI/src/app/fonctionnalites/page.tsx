import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { Section, SectionHeading, CtaBand } from "@/components/ui"
import { Icon } from "@/components/Icon"
import { Mockup } from "@/components/mockups/Mockup"
import { features } from "@/content/features"

export const metadata: Metadata = {
  title: "Fonctionnalités : commandes, atelier, livraison, COD, clients, boutique",
  description: "Tous les modules : commandes et devis, atelier et agent d'impression, livraison multi-transporteurs, rapprochement COD, clients et fidélité, boutique en ligne, tableau de bord.",
}

export default function FeaturesPage() {
  return (
    <>
      <Section className="pb-8">
        <SectionHeading eyebrow="Fonctionnalités" title="Un module par métier, un seul dossier de commande" lead="Chaque fonctionnalité ci-dessous existe parce qu'un atelier en avait besoin. Rien de théorique." />
        <nav className="mt-10 flex flex-wrap justify-center gap-2">
          {features.map((f) => (
            <a key={f.slug} href={`#${f.slug}`} className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-700 hover:border-brand-300 hover:text-brand-700">
              {f.title}
            </a>
          ))}
        </nav>
      </Section>

      {features.map((f, i) => (
        <Section key={f.slug} id={f.slug} tone={i % 2 ? "gray" : "white"} className="scroll-mt-20 py-14 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className={i % 2 ? "lg:order-2" : ""}>
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl text-white ${f.color}`}>
                <Icon name={f.icon} className="h-6 w-6" />
              </span>
              <h2 className="h2 mt-5">{f.title}</h2>
              <p className="lead mt-4">{f.description}</p>
              <ul className="mt-6 space-y-3">
                {f.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {b}
                  </li>
                ))}
              </ul>
              {f.slug === "atelier" && (
                <Link href="/agent" className="btn-secondary mt-6">
                  Tout savoir sur l&apos;agent d&apos;impression
                </Link>
              )}
            </div>
            <Mockup kind={f.mockup} className={`shadow-xl ring-1 ring-slate-200 ${i % 2 ? "lg:order-1" : ""}`} />
          </div>
        </Section>
      ))}

      <CtaBand />
    </>
  )
}
