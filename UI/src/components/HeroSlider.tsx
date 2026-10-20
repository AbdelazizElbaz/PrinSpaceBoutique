"use client"

// Carrousel du hero (demande utilisateur du 20/10/2026 : « ça doit être dans un slide séparé, puis les autres dans
// les autres ») : la première diapo est la présentation (texte + maquette, passée en `children` depuis la page,
// serveur), puis une diapo pleine largeur par schéma animé — écosystème, créer une commande, revendeurs, trajet du
// fichier. Un seul schéma est monté à la fois (son animation d'apparition se rejoue à chaque passage) ; défilement
// toutes les INTERVAL ms, en pause au survol et quand l'onglet n'est pas visible ; flèches, pastilles, barre de
// progression. Hauteur fixe sur grand écran pour éviter les sauts de mise en page.

import { useEffect, useRef, useState, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Ecosystem, type EcoModule } from "@/components/Ecosystem"
import { OrderFlow, type OrderFlowText } from "@/components/OrderFlow"
import { ResellerFlow, type ResellerFlowText } from "@/components/ResellerFlow"
import { FileJourney, type FileJourneyText } from "@/components/FileJourney"

const INTERVAL = 12000

export function HeroSlider({
  children,
  center,
  agent,
  eco,
  flow,
  reseller,
  file,
  titles,
  rtl = false,
}: {
  children: ReactNode
  center: string
  agent: string
  eco: { modules: EcoModule[]; hint: string; views: { intro: string; ecosystem: string; order: string; reseller: string; file: string } }
  flow: OrderFlowText
  reseller: ResellerFlowText
  file: FileJourneyText
  titles: { eco: string; order: string; reseller: string; file: string }
  rtl?: boolean
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<number | null>(null)
  const slides = [
    { key: "intro", label: eco.views.intro },
    { key: "eco", label: eco.views.ecosystem },
    { key: "order", label: eco.views.order },
    { key: "reseller", label: eco.views.reseller },
    { key: "file", label: eco.views.file },
  ]
  const n = slides.length
  const go = (i: number) => setIndex(((i % n) + n) % n)

  useEffect(() => {
    if (paused) return
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const tick = () => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % n)
    }
    timer.current = window.setInterval(tick, INTERVAL)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [paused, index, n])

  const current = slides[index].key
  const Prev = rtl ? ChevronRight : ChevronLeft
  const Next = rtl ? ChevronLeft : ChevronRight

  const diagram = (title: string, node: ReactNode) => (
    <div className="container-x">
      <h2 className="h2 text-center">{title}</h2>
      <div className="mt-8">{node}</div>
    </div>
  )

  return (
    <div className="hero-slider relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div key={current} className="hero-slide flex items-center py-12 lg:h-[800px] lg:py-0" aria-live="polite">
        <div className="w-full">
          {current === "intro" && children}
          {current === "eco" && diagram(titles.eco, <Ecosystem center={center} modules={eco.modules} hint={eco.hint} rtl={rtl} />)}
          {current === "order" && diagram(titles.order, <OrderFlow center={center} t={flow} rtl={rtl} />)}
          {current === "reseller" && diagram(titles.reseller, <ResellerFlow t={reseller} rtl={rtl} />)}
          {current === "file" && diagram(titles.file, <FileJourney brand={agent} t={file} rtl={rtl} />)}
        </div>
      </div>

      {/* flèches (grand écran) */}
      <button type="button" onClick={() => go(index - 1)} aria-label={slides[(index - 1 + n) % n].label} className="absolute start-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md transition hover:bg-white hover:text-brand-700 lg:inline-flex">
        <Prev className="h-5 w-5" />
      </button>
      <button type="button" onClick={() => go(index + 1)} aria-label={slides[(index + 1) % n].label} className="absolute end-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md transition hover:bg-white hover:text-brand-700 lg:inline-flex">
        <Next className="h-5 w-5" />
      </button>

      {/* pastilles avec libellé + barre de progression jusqu'à la diapo suivante */}
      <div className="container-x pb-8">
        <div className="flex flex-wrap items-center justify-center gap-2" role="tablist">
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => go(i)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${i === index ? "bg-brand-600 text-white shadow" : "bg-white/80 text-slate-600 ring-1 ring-slate-200 hover:text-slate-900"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mx-auto mt-3 h-1 w-40 overflow-hidden rounded-full bg-slate-200/70" aria-hidden>
          <div key={`${current}-${paused}`} className={`hero-progress h-full bg-brand-500 ${paused ? "hero-progress-paused" : ""}`} style={{ ["--t" as string]: `${INTERVAL}ms` }} />
        </div>
      </div>
    </div>
  )
}
