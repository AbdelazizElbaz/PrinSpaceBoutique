"use client"

// Schéma animé « écosystème » (demande utilisateur du 20/10/2026, d'après un visuel de référence) : la marque au
// centre, six modules en orbite reliés par des pointillés animés, chaque module rayonnant vers ses sous-fonctions.
// Tout en SVG (viewBox fixe, donc réactif), textes passés par le dictionnaire (FR/AR/EN). L'animation démarre quand
// le schéma entre dans l'écran (IntersectionObserver) et respecte prefers-reduced-motion (voir globals.css, .eco*).
// Survol / tap d'un module (« quand on passe la souris on aura plus de détails ») : les autres modules s'estompent
// et une carte sous le schéma détaille le module (résumé + liste). 3D : inclinaison souris (Tilt) + oscillation.
// Variante `compact` (hero de l'accueil, à la place de la maquette) : modules seuls, plus gros, sans sous-fonctions.
// Seconde vue « créer une commande » : OrderFlow.tsx ; vue revendeurs : ResellerFlow.tsx.

import { useEffect, useRef, useState } from "react"
import { Tilt } from "@/components/motion"

export type EcoModule = { title: string; items: string[]; summary: string; details: string[] }

const COLORS = ["#e11d2e", "#db2777", "#0d9488", "#d97706", "#16a34a", "#2547e9"]

// Largeur 1100 en mode complet : les libellés les plus à gauche et à droite (ITEM_RX + demi-largeur du texte)
// restent dans le cadre. En compact, pas de sous-fonctions : cadre plus serré, modules et textes plus grands.
const FULL = { W: 1100, H: 660, moduleRx: 250, moduleRy: 150, itemRx: 445, itemRy: 275, nodeW: 156, nodeH: 54, font: 15, centerR: 40, logoScale: 0.8, glowR: 120 }
const COMPACT = { W: 720, H: 560, moduleRx: 250, moduleRy: 200, itemRx: 0, itemRy: 0, nodeW: 196, nodeH: 60, font: 17, centerR: 50, logoScale: 1, glowR: 150 }

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
            <stop offset="0%" stopColor="#2547e9" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2547e9" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* halo + anneau pulsé au centre */}
        <circle cx={CX} cy={CY} r={D.glowR} fill="url(#eco-glow)" />
        <circle cx={CX} cy={CY} r={D.centerR + 6} className="eco-ring" fill="none" stroke="#2547e9" strokeWidth="1.5" style={{ transformOrigin: `${CX}px ${CY}px` }} />

        {list.map((m, i) => {
          const color = COLORS[i % COLORS.length]
          const mod = polar(angles[i], D.moduleRx, D.moduleRy)
          const spread = m.items.length === 1 ? [0] : m.items.length === 2 ? [-14, 14] : [-22, 0, 22]
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
              <line x1={CX} y1={CY} x2={mod.x} y2={mod.y} className="eco-line" stroke={color} strokeWidth={isActive ? 2.5 : 1.5} strokeDasharray="5 6" />
              {/* module → sous-fonctions (mode complet seulement) */}
              {!compact &&
                m.items.slice(0, 3).map((item, j) => {
                  const pt = polar(angles[i] + spread[j], D.itemRx, D.itemRy)
                  return (
                    <g key={item} className="eco-item" style={{ ["--d" as string]: `${0.55 + i * 0.12 + j * 0.08}s` }}>
                      <line x1={mod.x} y1={mod.y} x2={pt.x} y2={pt.y} className="eco-line eco-line-sub" stroke={isActive ? color : "#94a3b8"} strokeWidth="1.2" strokeDasharray="3 6" />
                      <foreignObject x={pt.x - 85} y={pt.y - 22} width="170" height="44">
                        <div className={`flex h-full items-center justify-center text-center text-[13px] leading-tight ${isActive ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`} dir={dir}>
                          {item}
                        </div>
                      </foreignObject>
                    </g>
                  )
                })}
              {/* le module lui-même */}
              <g className="eco-node" style={{ ["--d" as string]: `${0.35 + i * 0.12}s`, transformOrigin: `${mod.x}px ${mod.y}px` }}>
                <rect x={mod.x - nw / 2} y={mod.y - nh / 2} width={nw} height={nh} rx="12" fill={isActive ? color : "#fff"} stroke={color} strokeWidth="2" style={{ transition: "fill 0.2s" }} />
                <foreignObject x={mod.x - nw / 2 + 2} y={mod.y - nh / 2 + 2} width={nw - 4} height={nh - 4}>
                  <div className="flex h-full cursor-pointer items-center justify-center px-2 text-center font-bold leading-tight" style={{ color: isActive ? "#fff" : color, fontSize: D.font }} dir={dir}>
                    {m.title}
                  </div>
                </foreignObject>
              </g>
            </g>
          )
        })}

        {/* centre : pictogramme + nom (mêmes couleurs que le logo, voir Logo.tsx) */}
        <g className="eco-node eco-center" style={{ ["--d" as string]: "0s", transformOrigin: `${CX}px ${CY}px` }}>
          <circle cx={CX} cy={CY} r={D.centerR} fill="#fff" stroke="#e2e8f0" strokeWidth="1.5" />
          <g transform={`translate(${CX - 20 * D.logoScale} ${CY - 20 * D.logoScale}) scale(${D.logoScale})`}>
            <rect x="4" y="4" width="32" height="32" rx="9" fill="#2547e9" />
            <path d="M13 12h9.5a4.5 4.5 0 0 1 0 9H13z" fill="#fff" opacity=".95" />
            <path d="M13 21h6v7h-6z" fill="#fff" opacity=".7" />
            <path d="M23 24l5 4-5 4v-2.5h-4v-3h4z" fill="#a5f3fc" />
          </g>
          <text x={CX} y={CY + D.centerR + 22} textAnchor="middle" fontSize={compact ? 18 : 16} fontWeight="700" fill="#0f172a">
            {center}
          </text>
        </g>
      </svg>

      {/* Carte de détail du module survolé (ou consigne tant qu'aucun module n'est survolé). */}
      <div
        key={active ?? "hint"}
        className={`eco-details mx-auto mt-2 max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-lg ${compact ? "min-h-[7rem] p-3" : "min-h-[8.5rem] p-4"}`}
        dir={dir}
        aria-live="polite"
      >
        {current === null ? (
          <p className={`flex h-full items-center justify-center text-center text-sm text-slate-500 ${compact ? "min-h-[5.5rem]" : "min-h-[6.5rem]"}`}>{hint}</p>
        ) : (
          <>
            <p className="text-base font-bold" style={{ color: COLORS[active! % COLORS.length] }}>{current.title}</p>
            <p className="mt-1 text-sm text-slate-600">{current.summary}</p>
            <ul className={`mt-3 grid gap-x-6 gap-y-1.5 text-sm text-slate-700 ${compact ? "" : "sm:grid-cols-2"}`}>
              {current.details.map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: COLORS[active! % COLORS.length] }} />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      </Tilt>
    </div>
  )
}
