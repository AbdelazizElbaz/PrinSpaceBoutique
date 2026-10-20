"use client"

// Schéma animé « écosystème » (demande utilisateur du 20/10/2026, d'après un visuel de référence) : la marque au
// centre, six modules en orbite reliés par des pointillés animés, chaque module rayonnant vers ses sous-fonctions.
// Tout en SVG (viewBox fixe, donc réactif) avec des cartes HTML (foreignObject) pour les modules et des pastilles
// pour les sous-fonctions ; textes passés par le dictionnaire (FR/AR/EN). L'animation démarre quand le schéma entre
// dans l'écran (IntersectionObserver) et respecte prefers-reduced-motion (voir globals.css, .eco*).
// Survol / tap d'un module : les autres s'estompent et une carte de détail se superpose au schéma, du côté opposé
// au module (résumé + liste). 3D : inclinaison souris (Tilt) + oscillation. Variante `compact` : modules seuls.
// Refonte visuelle du 20/10/2026 (retour « pas joli ») : pastilles, cartes avec icône et ombre, plus de bloc vide.

import { useEffect, useRef, useState } from "react"
import { Coins, FileText, MousePointerClick, Printer, ShoppingBag, Truck, Users } from "lucide-react"
import { Tilt } from "@/components/motion"

export type EcoModule = { title: string; items: string[]; summary: string; details: string[] }

const COLORS = ["#e11d2e", "#db2777", "#0d9488", "#d97706", "#16a34a", "#2547e9"]
const SOFT = ["#fee2e2", "#fce7f3", "#ccfbf1", "#fef3c7", "#dcfce7", "#dbeafe"]
const ICONS = [FileText, Printer, Truck, Coins, Users, ShoppingBag]

// Largeur 1000 en mode complet : les pastilles les plus à gauche et à droite restent dans le cadre (cadre serré pour
// que le schéma reste lisible une fois réduit dans la colonne du hero).
const FULL = { W: 1000, H: 640, moduleRx: 235, moduleRy: 150, itemRx: 410, itemRy: 272, nodeW: 184, nodeH: 54, font: 14, centerR: 44, logoScale: 0.9, glowR: 130 }
const COMPACT = { W: 720, H: 560, moduleRx: 250, moduleRy: 200, itemRx: 0, itemRy: 0, nodeW: 214, nodeH: 60, font: 16, centerR: 52, logoScale: 1.05, glowR: 150 }
const PAD = 16 // marge autour des cartes dans leur foreignObject, pour que l'ombre ne soit pas rognée

export function Ecosystem({
  center,
  modules,
  hint,
  rtl = false,
  compact = false,
}: {
  center: string
  modules: EcoModule[]
  hint: string
  rtl?: boolean
  compact?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  const [active, setActive] = useState<number | null>(null)

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
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const D = compact ? COMPACT : FULL
  const CX = D.W / 2
  const CY = D.H / 2
  const polar = (angleDeg: number, rx: number, ry: number) => {
    const a = (angleDeg * Math.PI) / 180
    return { x: CX + rx * Math.cos(a), y: CY + ry * Math.sin(a) }
  }

  // Six modules répartis en ellipse, en commençant en haut ; les sous-fonctions s'écartent de ±22° autour de l'axe.
  const angles = [-90, -30, 30, 90, 150, 210]
  const list = modules.slice(0, 6)
  const current = active === null ? null : list[active]
  const dir = rtl ? "rtl" : "ltr"
  // La carte de détail se place du côté opposé au module survolé (haut si le module est en bas, et inversement).
  const cardAtTop = active !== null && polar(angles[active], D.moduleRx, D.moduleRy).y > CY

  return (
    <div
      ref={ref}
      className={`eco mx-auto w-full ${compact ? "" : "max-w-4xl"} ${on ? "eco-on" : ""} ${active !== null ? "eco-has-active" : ""}`}
      dir="ltr"
      onMouseLeave={() => setActive(null)}
    >
      {/* 3D (demande du 20/10/2026 « plus d'animation 3D ») : le schéma s'incline en suivant la souris (Tilt) et oscille
          lentement en perspective au repos ; la carte de détail flotte au-dessus du plan (translateZ). */}
      <Tilt max={7} glare={false}>
        <svg viewBox={`0 0 ${D.W} ${D.H}`} className="eco-svg h-auto w-full" role="img" aria-label={center}>
          <defs>
            <radialGradient id="eco-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2547e9" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#2547e9" stopOpacity="0" />
            </radialGradient>
            <filter id="eco-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#1e3a8a" floodOpacity="0.16" />
            </filter>
          </defs>

          {/* halo + anneau pulsé au centre */}
          <circle cx={CX} cy={CY} r={D.glowR} fill="url(#eco-glow)" />
          <circle cx={CX} cy={CY} r={D.centerR + 8} className="eco-ring" fill="none" stroke="#2547e9" strokeWidth="1.5" style={{ transformOrigin: `${CX}px ${CY}px` }} />

          {list.map((m, i) => {
            const color = COLORS[i % COLORS.length]
            const soft = SOFT[i % SOFT.length]
            const Icon = ICONS[i % ICONS.length]
            const mod = polar(angles[i], D.moduleRx, D.moduleRy)
            const spread = m.items.length === 1 ? [0] : m.items.length === 2 ? [-15, 15] : [-25, 0, 25]
            const isActive = active === i
            const nw = D.nodeW
            const nh = D.nodeH
            return (
              <g
                key={m.title}
                className={`eco-module ${isActive ? "eco-active" : ""}`}
                style={{ ["--d" as string]: `${0.15 + i * 0.12}s` }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(isActive ? null : i)}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                aria-label={m.title}
              >
                {/* centre → module */}
                <line x1={CX} y1={CY} x2={mod.x} y2={mod.y} className="eco-line" stroke={color} strokeOpacity={isActive ? 1 : 0.7} strokeWidth={isActive ? 2.5 : 1.75} strokeDasharray="5 6" strokeLinecap="round" />
                {/* module → sous-fonctions (mode complet seulement) : pastilles blanches */}
                {!compact &&
                  m.items.slice(0, 3).map((item, j) => {
                    const pt = polar(angles[i] + spread[j], D.itemRx, D.itemRy)
                    return (
                      <g key={item} className="eco-item" style={{ ["--d" as string]: `${0.55 + i * 0.12 + j * 0.08}s` }}>
                        <line x1={mod.x} y1={mod.y} x2={pt.x} y2={pt.y} className="eco-line eco-line-sub" stroke={isActive ? color : "#cbd5e1"} strokeWidth="1.25" strokeDasharray="3 6" strokeLinecap="round" />
                        <foreignObject x={pt.x - 100} y={pt.y - 28} width="200" height="56">
                          <div className="flex h-full items-center justify-center" dir={dir}>
                            <span
                              className={`inline-flex max-w-full items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 text-center text-[13px] font-medium leading-tight shadow-sm ${isActive ? "border-slate-300 text-slate-900" : "border-slate-200 text-slate-600"}`}
                              style={isActive ? { boxShadow: `0 4px 14px ${soft}` } : undefined}
                            >
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                              <span>{item}</span>
                            </span>
                          </div>
                        </foreignObject>
                      </g>
                    )
                  })}
                {/* le module lui-même : carte avec icône */}
                <g className="eco-node" style={{ ["--d" as string]: `${0.35 + i * 0.12}s`, transformOrigin: `${mod.x}px ${mod.y}px` }}>
                  <foreignObject x={mod.x - nw / 2 - PAD} y={mod.y - nh / 2 - PAD} width={nw + PAD * 2} height={nh + PAD * 2}>
                    <div className="flex h-full items-center justify-center" style={{ padding: PAD }}>
                      <div
                        className="flex h-full w-full cursor-pointer items-center gap-2.5 rounded-2xl border bg-white px-3 shadow-lg transition-colors"
                        style={{ borderColor: isActive ? color : "#e2e8f0", background: isActive ? color : "#fff", boxShadow: isActive ? `0 12px 28px ${soft}, 0 0 0 1px ${color}` : "0 8px 22px rgba(30, 58, 138, 0.12)" }}
                        dir={dir}
                      >
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ background: isActive ? "rgba(255,255,255,0.2)" : soft, color: isActive ? "#fff" : color }}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1 text-start font-bold leading-tight" style={{ color: isActive ? "#fff" : "#0f172a", fontSize: D.font }}>
                          {m.title}
                        </span>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              </g>
            )
          })}

          {/* centre : pictogramme + nom (mêmes couleurs que le logo, voir Logo.tsx) */}
          <g className="eco-node eco-center" style={{ ["--d" as string]: "0s", transformOrigin: `${CX}px ${CY}px` }}>
            <circle cx={CX} cy={CY} r={D.centerR} fill="#fff" stroke="#dbe3f3" strokeWidth="1.5" filter="url(#eco-shadow)" />
            <g transform={`translate(${CX - 20 * D.logoScale} ${CY - 20 * D.logoScale}) scale(${D.logoScale})`}>
              <rect x="4" y="4" width="32" height="32" rx="9" fill="#2547e9" />
              <path d="M13 12h9.5a4.5 4.5 0 0 1 0 9H13z" fill="#fff" opacity=".95" />
              <path d="M13 21h6v7h-6z" fill="#fff" opacity=".7" />
              <path d="M23 24l5 4-5 4v-2.5h-4v-3h4z" fill="#a5f3fc" />
            </g>
            <text x={CX} y={CY + D.centerR + 24} textAnchor="middle" fontSize={compact ? 18 : 16} fontWeight="800" fill="#0f172a">
              {center}
            </text>
          </g>
        </svg>

        {/* Carte de détail du module survolé, superposée au schéma du côté opposé au module. */}
        {current !== null && (
          <div
            key={active}
            className={`eco-details absolute left-1/2 z-10 w-[min(92%,40rem)] rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-2xl backdrop-blur ${cardAtTop ? "top-2" : "bottom-2"}`}
            dir={dir}
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ background: COLORS[active! % COLORS.length] }}>
                {(() => {
                  const Icon = ICONS[active! % ICONS.length]
                  return <Icon className="h-4 w-4" />
                })()}
              </span>
              <p className="text-base font-bold text-slate-900">{current.title}</p>
            </div>
            <p className="mt-1.5 text-sm text-slate-600">{current.summary}</p>
            <ul className={`mt-2.5 grid gap-x-6 gap-y-1 text-[13px] text-slate-700 ${compact ? "" : "sm:grid-cols-2"}`}>
              {current.details.map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: COLORS[active! % COLORS.length] }} />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Tilt>
      {/* consigne discrète sous le schéma */}
      <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500" dir={dir}>
        <MousePointerClick className="h-3.5 w-3.5" /> {hint}
      </p>
    </div>
  )
}
