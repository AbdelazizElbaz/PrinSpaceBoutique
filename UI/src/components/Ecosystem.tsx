"use client"

// Schéma animé « écosystème » (demande utilisateur du 20/10/2026, d'après un visuel de référence) : la marque au
// centre, six modules en orbite reliés par des pointillés animés, chaque module rayonnant vers ses sous-fonctions.
// Tout en SVG (viewBox fixe, donc réactif), textes passés par le dictionnaire (FR/AR/EN). L'animation démarre quand
// le schéma entre dans l'écran (IntersectionObserver) et respecte prefers-reduced-motion (voir globals.css, .eco*).

import { useEffect, useRef, useState } from "react"

export type EcoModule = { title: string; items: string[] }

const COLORS = ["#e11d2e", "#db2777", "#0d9488", "#d97706", "#16a34a", "#2547e9"]
// Largeur 1100 : les libellés les plus à gauche et à droite (ITEM_RX + demi-largeur du texte) restent dans le cadre.
const W = 1100
const H = 660
const CX = W / 2
const CY = H / 2
const MODULE_RX = 250
const MODULE_RY = 150
const ITEM_RX = 445
const ITEM_RY = 275

function polar(angleDeg: number, rx: number, ry: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: CX + rx * Math.cos(a), y: CY + ry * Math.sin(a) }
}

export function Ecosystem({ center, modules, rtl = false }: { center: string; modules: EcoModule[]; rtl?: boolean }) {
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
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Six modules répartis en ellipse, en commençant en haut ; les sous-fonctions s'écartent de ±16° autour de l'axe.
  const angles = [-90, -30, 30, 90, 150, 210]
  const list = modules.slice(0, 6)

  return (
    <div ref={ref} className={`eco mx-auto w-full max-w-4xl ${on ? "eco-on" : ""}`} dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={center}>
        <defs>
          <radialGradient id="eco-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2547e9" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2547e9" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* halo + anneau pulsé au centre */}
        <circle cx={CX} cy={CY} r={120} fill="url(#eco-glow)" />
        <circle cx={CX} cy={CY} r={46} className="eco-ring" fill="none" stroke="#2547e9" strokeWidth="1.5" />

        {list.map((m, i) => {
          const color = COLORS[i % COLORS.length]
          const mod = polar(angles[i], MODULE_RX, MODULE_RY)
          const spread = m.items.length === 1 ? [0] : m.items.length === 2 ? [-14, 14] : [-22, 0, 22]
          return (
            <g key={m.title} className="eco-module" style={{ ["--d" as string]: `${0.15 + i * 0.12}s` }}>
              {/* centre → module */}
              <line x1={CX} y1={CY} x2={mod.x} y2={mod.y} className="eco-line" stroke={color} strokeWidth="1.5" strokeDasharray="5 6" />
              {/* module → sous-fonctions */}
              {m.items.slice(0, 3).map((item, j) => {
                const pt = polar(angles[i] + spread[j], ITEM_RX, ITEM_RY)
                return (
                  <g key={item} className="eco-item" style={{ ["--d" as string]: `${0.55 + i * 0.12 + j * 0.08}s` }}>
                    <line x1={mod.x} y1={mod.y} x2={pt.x} y2={pt.y} className="eco-line eco-line-sub" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 6" />
                    <foreignObject x={pt.x - 85} y={pt.y - 22} width="170" height="44">
                      <div className="flex h-full items-center justify-center text-center text-[13px] font-medium leading-tight text-slate-700" dir={rtl ? "rtl" : "ltr"}>
                        {item}
                      </div>
                    </foreignObject>
                  </g>
                )
              })}
              {/* le module lui-même */}
              <g className="eco-node" style={{ ["--d" as string]: `${0.35 + i * 0.12}s`, transformOrigin: `${mod.x}px ${mod.y}px` }}>
                <rect x={mod.x - 78} y={mod.y - 27} width="156" height="54" rx="10" fill="#fff" stroke={color} strokeWidth="2" />
                <foreignObject x={mod.x - 76} y={mod.y - 25} width="152" height="50">
                  <div className="flex h-full items-center justify-center px-2 text-center text-[15px] font-bold leading-tight" style={{ color }} dir={rtl ? "rtl" : "ltr"}>
                    {m.title}
                  </div>
                </foreignObject>
              </g>
            </g>
          )
        })}

        {/* centre : pictogramme + nom (mêmes couleurs que le logo, voir Logo.tsx) */}
        <g className="eco-node eco-center" style={{ ["--d" as string]: "0s", transformOrigin: `${CX}px ${CY}px` }}>
          <circle cx={CX} cy={CY} r={40} fill="#fff" stroke="#e2e8f0" strokeWidth="1.5" />
          <g transform={`translate(${CX - 16} ${CY - 16}) scale(0.8)`}>
            <rect x="4" y="4" width="32" height="32" rx="9" fill="#2547e9" />
            <path d="M13 12h9.5a4.5 4.5 0 0 1 0 9H13z" fill="#fff" opacity=".95" />
            <path d="M13 21h6v7h-6z" fill="#fff" opacity=".7" />
            <path d="M23 24l5 4-5 4v-2.5h-4v-3h4z" fill="#a5f3fc" />
          </g>
          <text x={CX} y={CY + 62} textAnchor="middle" fontSize="16" fontWeight="700" fill="#0f172a">
            {center}
          </text>
        </g>
      </svg>
    </div>
  )
}
