import Link from "next/link"
import type { ReactNode } from "react"
import { Check, Minus } from "lucide-react"
import { site } from "@/content/site.config"

export function Section({
  children,
  className = "",
  id,
  tone = "white",
}: {
  children: ReactNode
  className?: string
  id?: string
  tone?: "white" | "gray" | "dark" | "brand"
}) {
  const bg = {
    white: "bg-white",
    gray: "bg-slate-50",
    dark: "bg-ink text-white",
    brand: "bg-brand-700 text-white",
  }[tone]
  return (
    <section id={id} className={`${bg} py-16 sm:py-24 ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  dark = false,
}: {
  eyebrow?: string
  title: string
  lead?: string
  align?: "center" | "left"
  dark?: boolean
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl`}>
      {eyebrow && <p className={`eyebrow ${dark ? "text-brand-200" : ""}`}>{eyebrow}</p>}
      <h2 className={`h2 mt-3 ${dark ? "text-white" : ""}`}>{title}</h2>
      {lead && <p className={`lead mt-4 ${dark ? "text-slate-300" : ""}`}>{lead}</p>}
    </div>
  )
}

export function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <Check className="mx-auto h-5 w-5 text-emerald-600" aria-label="Inclus" />
  if (v === false) return <Minus className="mx-auto h-5 w-5 text-slate-300" aria-label="Non inclus" />
  return <span className="text-sm text-slate-700">{v}</span>
}

export function CtaBand({
  title = "Prêt à simplifier votre atelier ?",
  text = `Essai gratuit ${site.trialDays} jours, sans carte bancaire. Votre espace est créé en 2 minutes.`,
}: {
  title?: string
  text?: string
}) {
  return (
    <Section tone="brand">
      <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
        <div>
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-brand-100">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/inscription" className="btn-white">
            Commencer l&apos;essai gratuit
          </Link>
          <Link href="/contact" className="btn border border-white/40 text-white hover:bg-white/10">
            Demander une démo
          </Link>
        </div>
      </div>
    </Section>
  )
}

export function Badge({ children, color = "brand" }: { children: ReactNode; color?: "brand" | "green" | "amber" | "slate" }) {
  const c = {
    brand: "bg-brand-50 text-brand-700 ring-brand-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  }[color]
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${c}`}>{children}</span>
}
