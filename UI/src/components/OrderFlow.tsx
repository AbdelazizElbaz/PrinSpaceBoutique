"use client"

// Seconde vue animée « créer une commande » (demande utilisateur du 20/10/2026, d'après un visuel de référence en
// trois panneaux + bande d'intégrations) :
//   1. le client choisit (produits, maquette, quantité) ;
//   2. le parcours de la commande en boucle (devis → maquette validée → avance → atelier → livraison → COD), avec
//      un colis qui tourne sur la boucle (SMIL animateMotion) et chaque étape qui pulse à son passage ;
//   3. atelier et expédition : fichiers de conception / montage / machines → suivi de production → suivi de commande.
// Bande du bas : transporteurs natifs + autres connexions. Animations CSS (globals.css, .flow*), démarrées quand le
// schéma est visible, figées avec prefers-reduced-motion.

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import Image from "next/image"
import {
  BadgeCheck, CheckCircle2, FileText, Image as ImageIcon, LayoutGrid, MessageCircle, Monitor, Package, Printer,
  RefreshCw, Settings, ShoppingBag, Sticker, Table2, Truck, Upload, Wallet, CreditCard, Megaphone, Flag,
} from "lucide-react"
import { CARRIERS } from "@/lib/carriers"
import { Tilt } from "@/components/motion"

export type OrderFlowText = {
  choose: { title: string; pick: string; products: string[]; upload: string; quantityLabel: string; quantities: string[] }
  flow: { title: string; steps: string[] }
  ship: { title: string; sources: string[]; sync: string; mockTitle: string; mockSteps: string[]; cod: string }
  integrations: { title: string; extras: string[] }
}

const TONES = {
  green: { box: "border-emerald-200 bg-gradient-to-b from-emerald-50/80 to-white", pill: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
  purple: { box: "border-violet-200 bg-gradient-to-b from-violet-50/80 to-white", pill: "bg-violet-100 text-violet-800 ring-violet-200" },
  orange: { box: "border-orange-200 bg-gradient-to-b from-orange-50/80 to-white", pill: "bg-orange-100 text-orange-800 ring-orange-200" },
  blue: { box: "border-sky-200 bg-gradient-to-b from-sky-50/80 to-white", pill: "bg-sky-100 text-sky-800 ring-sky-200" },
} as const

export function Panel({ tone, title, children, className = "", delay = 0 }: { tone: keyof typeof TONES; title: string; children: ReactNode; className?: string; delay?: number }) {
  const t = TONES[tone]
  // 3D : chaque panneau s'incline avec la souris (Tilt), entre en perspective (flow-panel) et ses cartes internes
  // (.flow-z) flottent au-dessus du plan grâce à translateZ.
  return (
    <Tilt max={6} glare={false} className={`h-full ${className}`}>
      <section className={`flow-panel relative flex h-full flex-col rounded-3xl border p-4 pt-8 sm:p-5 sm:pt-9 ${t.box}`} style={{ ["--d" as string]: `${delay}s` }}>
        <h3 className={`flow-z absolute -top-4 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-5 py-1.5 text-sm font-bold ring-1 ${t.pill} rtl:translate-x-1/2`} style={{ ["--z" as string]: "40px" }}>{title}</h3>
        {children}
      </section>
    </Tilt>
  )
}

const PRODUCT_ICONS = [CreditCard, Megaphone, Flag, Sticker]
const PRODUCT_BG = ["from-sky-100 to-indigo-100 text-indigo-600", "from-rose-100 to-orange-100 text-rose-600", "from-emerald-100 to-teal-100 text-teal-700", "from-amber-100 to-yellow-100 text-amber-600"]
const STEP_ICONS = [FileText, CheckCircle2, Wallet, Printer, Truck, BadgeCheck]
const STEP_COLORS = ["#2547e9", "#16a34a", "#d97706", "#7c3aed", "#0d9488", "#db2777"]
const SOURCE_ICONS = [ImageIcon, LayoutGrid, Printer]
const EXTRA_ICONS = [MessageCircle, Monitor, ShoppingBag, Table2]

// Boucle du parcours (panneau 2) : six étapes sur une ellipse, colis en mouvement (durée LOOP), étape i atteinte à i/6.
const FW = 400
const FH = 330
const FCX = FW / 2
const FCY = 158
const FRX = 150
const FRY = 112
const LOOP = 9
const MOTION_PATH = `M ${FCX} ${FCY - FRY} A ${FRX} ${FRY} 0 1 1 ${FCX} ${FCY + FRY} A ${FRX} ${FRY} 0 1 1 ${FCX} ${FCY - FRY}`

export function OrderFlow({ center, t, rtl = false }: { center: string; t: OrderFlowText; rtl?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setOn(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const angles = [-90, -30, 30, 90, 150, 210]
  const d = (s: number): CSSProperties => ({ ["--d" as string]: `${s}s` })

  return (
    <div ref={ref} className={`flow flow-3d mx-auto w-full max-w-5xl ${on ? "flow-on" : ""}`} dir={rtl ? "rtl" : "ltr"}>
      <div className="grid gap-6 md:grid-cols-3">
        {/* 1. Le client choisit */}
        <Panel tone="green" title={t.choose.title} delay={0}>
          <p className="text-xs font-semibold text-slate-700">{t.choose.pick}</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {t.choose.products.slice(0, 4).map((p, i) => {
              const Icon = PRODUCT_ICONS[i % PRODUCT_ICONS.length]
              return (
                <div key={p} className="flow-tile flow-z rounded-xl border border-slate-200 bg-white p-2.5 shadow-md" style={{ ["--d" as string]: `${0.2 + i * 0.1}s`, ["--l" as string]: `${i * 2}s` }}>
                  <div className={`flex h-14 items-center justify-center rounded-lg bg-gradient-to-br ${PRODUCT_BG[i % PRODUCT_BG.length]}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="mt-2 text-center text-xs font-medium text-slate-700">{p}</p>
                </div>
              )
            })}
          </div>
          <div className="flow-in flow-z mt-3 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-300 bg-white px-3 py-2.5 text-xs font-semibold text-emerald-700" style={d(0.7)}>
            <Upload className="h-4 w-4" /> {t.choose.upload}
          </div>
          <div className="flow-in mt-3" style={d(0.85)}>
            <p className="text-xs font-semibold text-slate-700">{t.choose.quantityLabel}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {t.choose.quantities.slice(0, 4).map((q, i) => (
                <span key={q} className="flow-chip rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700" style={{ ["--l" as string]: `${i * 2}s` }}>{q}</span>
              ))}
            </div>
          </div>
        </Panel>

        {/* 2. Parcours de la commande (boucle animée) */}
        <Panel tone="purple" title={t.flow.title} delay={0.15}>
          <div dir="ltr" className="flex flex-1 items-center">
            <svg viewBox={`0 0 ${FW} ${FH}`} className="flow-svg h-auto w-full" role="img" aria-label={t.flow.title}>
              <ellipse cx={FCX} cy={FCY} rx={FRX} ry={FRY} fill="none" stroke="#c4b5fd" strokeWidth="1.5" strokeDasharray="5 6" className="flow-dash" />
              {/* engrenage central qui tourne lentement + marque */}
              <g className="flow-gear" style={{ transformOrigin: `${FCX}px ${FCY}px` }}>
                <Settings x={FCX - 26} y={FCY - 26} width={52} height={52} stroke="#7c3aed" strokeWidth={1.4} />
              </g>
              <text x={FCX} y={FCY + 46} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">{center}</text>
              {t.flow.steps.slice(0, 6).map((label, i) => {
                const a = (angles[i] * Math.PI) / 180
                const x = Math.round((FCX + FRX * Math.cos(a)) * 100) / 100
                const y = Math.round((FCY + FRY * Math.sin(a)) * 100) / 100
                const Icon = STEP_ICONS[i]
                const color = STEP_COLORS[i]
                // libellé : au-dessus pour l'étape du haut, dessous pour les autres (évite le centre)
                const labelY = i === 0 ? y - 56 : y + 26
                return (
                  <g key={label} className="flow-step" style={{ ["--d" as string]: `${(i * LOOP) / 6}s`, transformOrigin: `${x}px ${y}px` }}>
                    <circle cx={x} cy={y} r={30} fill={color} className="flow-halo" style={{ transformOrigin: `${x}px ${y}px` }} />
                    <circle cx={x} cy={y} r={21} fill="#fff" stroke={color} strokeWidth="2" />
                    <Icon x={x - 10} y={y - 10} width={20} height={20} stroke={color} strokeWidth={2} />
                    <foreignObject x={x - 58} y={labelY} width="116" height="32">
                      <div className="flex h-full items-center justify-center text-center text-[11px] font-semibold leading-tight text-slate-800" dir={rtl ? "rtl" : "ltr"}>{label}</div>
                    </foreignObject>
                  </g>
                )
              })}
              {/* le colis qui parcourt la boucle */}
              <g className="flow-dot">
                <circle r="12" fill="#7c3aed" />
                <Package x={-7} y={-7} width={14} height={14} stroke="#fff" strokeWidth={2} />
                <animateMotion dur={`${LOOP}s`} repeatCount="indefinite" path={MOTION_PATH} />
              </g>
            </svg>
          </div>
        </Panel>

        {/* 3. Atelier et expédition */}
        <Panel tone="orange" title={t.ship.title} delay={0.3}>
          <div className="grid grid-cols-3 gap-2">
            {t.ship.sources.slice(0, 3).map((s, i) => {
              const Icon = SOURCE_ICONS[i]
              return (
                <div key={s} className="flow-in flow-z flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-1.5 py-2.5 text-center shadow-md" style={d(0.4 + i * 0.12)}>
                  <Icon className="h-6 w-6 text-orange-600" />
                  <span className="text-[11px] font-semibold leading-tight text-slate-700">{s}</span>
                </div>
              )
            })}
          </div>
          <div className="flow-connector mx-auto h-5 w-0 border-l-2 border-dashed border-orange-300" />
          <div className="flow-in flow-z flex items-center gap-3 rounded-xl border border-orange-200 bg-white p-3 shadow-md" style={d(0.8)}>
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-600 text-white"><RefreshCw className="flow-spin h-5 w-5" /></span>
            <p className="text-xs font-semibold leading-snug text-slate-800">{t.ship.sync}</p>
          </div>
          <div className="flow-connector mx-auto h-5 w-0 border-l-2 border-dashed border-orange-300" />
          {/* mini page « suivi de commande » */}
          <div className="flow-in flow-z overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md" style={d(1)}>
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400" /><span className="h-2 w-2 rounded-full bg-amber-400" /><span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="ms-1 text-[11px] font-semibold text-slate-600">{t.ship.mockTitle}</span>
            </div>
            <ul className="space-y-1.5 px-3 py-2.5">
              {t.ship.mockSteps.slice(0, 4).map((s, i) => (
                <li key={s} className="flex items-center gap-2 text-[11px] text-slate-700">
                  <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white">
                    <span className="flow-tl absolute inset-0 rounded-full bg-emerald-500" style={{ ["--l" as string]: `${0.8 + i * 1.6}s` }}>
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </span>
                  </span>
                  {s}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-end gap-1 border-t border-slate-100 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
              <BadgeCheck className="h-3.5 w-3.5" /> {t.ship.cod}
            </div>
          </div>
        </Panel>
      </div>

      {/* Bande du bas : transporteurs natifs + autres connexions */}
      <Panel tone="blue" title={t.integrations.title} className="mt-8" delay={0.45}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CARRIERS.map((c, i) => (
            <div key={c.key} className="flow-in flow-z flow-card flex h-16 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 shadow-md" style={d(0.6 + i * 0.08)} dir="ltr">
              <Image src={c.logo} alt={c.name} width={c.w} height={c.h} className={c.wordmark ? "h-6 w-auto" : "h-10 w-auto"} />
            </div>
          ))}
          {t.integrations.extras.slice(0, 4).map((x, i) => {
            const Icon = EXTRA_ICONS[i]
            return (
              <div key={x} className="flow-in flow-z flow-card flex h-16 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-md" style={d(0.92 + i * 0.08)}>
                <Icon className="h-5 w-5 shrink-0 text-sky-600" />
                <span className="text-xs font-semibold text-slate-700">{x}</span>
              </div>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}
