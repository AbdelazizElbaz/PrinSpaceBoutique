"use client"

// Slider automatique du hero (demande utilisateur du 20/10/2026 « slider automatique et mettre le schéma total ») :
// fait défiler les schémas complets — écosystème, créer une commande, revendeurs, trajet du fichier. Un seul schéma
// est monté à la fois (son animation d'apparition se rejoue à chaque passage) ; défilement toutes les INTERVAL ms,
// en pause au survol (pour lire le détail des modules) et quand l'onglet n'est pas visible ; pastilles cliquables.

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { Ecosystem, type EcoModule } from "@/components/Ecosystem"
import { OrderFlow, type OrderFlowText } from "@/components/OrderFlow"
import { ResellerFlow, type ResellerFlowText } from "@/components/ResellerFlow"
import { FileJourney, type FileJourneyText } from "@/components/FileJourney"

const INTERVAL = 11000
// Largeur de conception des vues en panneaux : dans la colonne du hero (plus étroite), elles sont rendues à cette
// largeur puis réduites à l'échelle (transform), comme un SVG, pour rester lisibles et proportionnées.
const DESIGN_W = 1000

function FitWidth({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [height, setHeight] = useState<number | undefined>(undefined)
  useLayoutEffect(() => {
    const o = outer.current
    const i = inner.current
    if (!o || !i) return
    const update = () => {
      const sc = Math.min(1, o.clientWidth / DESIGN_W)
      setScale(sc)
      setHeight(i.offsetHeight * sc)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(o)
    ro.observe(i)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={outer} className="w-full" style={{ height }}>
      <div ref={inner} style={{ width: DESIGN_W, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  )
}

export function HeroSlider({
  center,
  agent,
  eco,
  flow,
  reseller,
  file,
  rtl = false,
}: {
  center: string
  agent: string
  eco: { modules: EcoModule[]; hint: string; views: { ecosystem: string; order: string; reseller: string; file: string } }
  flow: OrderFlowText
  reseller: ResellerFlowText
  file: FileJourneyText
  rtl?: boolean
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<number | null>(null)
  const slides = [
    { key: "eco", label: eco.views.ecosystem },
    { key: "order", label: eco.views.order },
    { key: "reseller", label: eco.views.reseller },
    { key: "file", label: eco.views.file },
  ]

  useEffect(() => {
    if (paused) return
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const tick = () => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % slides.length)
    }
    timer.current = window.setInterval(tick, INTERVAL)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [paused, index, slides.length])

  const current = slides[index].key

  return (
    <div className="hero-slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div key={current} className="hero-slide flex min-h-[420px] items-center lg:h-[680px]" aria-live="polite">
        <div className="w-full">
          {current === "eco" && <Ecosystem center={center} modules={eco.modules} hint={eco.hint} rtl={rtl} />}
          {current === "order" && <FitWidth><OrderFlow center={center} t={flow} rtl={rtl} /></FitWidth>}
          {current === "reseller" && <FitWidth><ResellerFlow t={reseller} rtl={rtl} /></FitWidth>}
          {current === "file" && <FileJourney brand={agent} t={file} rtl={rtl} />}
        </div>
      </div>
      {/* pastilles + libellé du schéma affiché ; la barre de progression indique le prochain défilement */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2" role="tablist">
        {slides.map((s, i) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={s.label}
            onClick={() => setIndex(i)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${i === index ? "bg-brand-600 text-white shadow" : "bg-white/80 text-slate-600 ring-1 ring-slate-200 hover:text-slate-900"}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="mx-auto mt-2 h-1 w-40 overflow-hidden rounded-full bg-slate-200/70" aria-hidden>
        <div key={`${current}-${paused}`} className={`hero-progress h-full bg-brand-500 ${paused ? "hero-progress-paused" : ""}`} style={{ ["--t" as string]: `${INTERVAL}ms` }} />
      </div>
    </div>
  )
}
