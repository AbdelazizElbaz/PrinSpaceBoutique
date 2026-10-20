"use client"

// Schéma 3D animé de la page PrintiosSync (demande utilisateur du 20/10/2026) : le trajet d'un fichier, de
// l'infographiste (qui peut travailler à distance, sans WhatsApp ni Drive) jusqu'au dossier de la machine dans
// l'atelier. Cinq stations sur une ligne brisée ; un « fichier PDF » parcourt le chemin (SMIL animateMotion, démarré
// quand le schéma est visible pour rester synchronisé avec les animations CSS), chaque station s'illumine à son
// passage, le fichier apparaît dans le dossier de la machine puis le badge « prêt à lancer » chez l'opérateur.
// Le tout est incliné en 3D (Tilt, oscillation eco-float3d). Styles : globals.css (.fj*).

import { useEffect, useRef, useState } from "react"
import { FileText, FolderOpen, Laptop, MonitorDown, Printer } from "lucide-react"
import { Tilt } from "@/components/motion"

export type FileJourneyText = {
  stations: { title: string; text: string }[]
  noMore: string
  folder: string
  existing: string[]
  file: string
  newBadge: string
  ready: string
}

const W = 1100
const H = 440
const XS = [110, 330, 550, 770, 990]
const YS = [170, 250, 170, 250, 170]
const COLORS = ["#7c3aed", "#2547e9", "#0d9488", "#d97706", "#16a34a"]
const ICONS = [Laptop, null, MonitorDown, FolderOpen, Printer] as const
export const LOOP = 12
// Le fichier marque une pause à chaque station : keyPoints (position sur le chemin) / keyTimes (fraction du temps).
const KEY_POINTS = "0;0.25;0.25;0.5;0.5;0.75;0.75;1;1"
const KEY_TIMES = "0;0.18;0.23;0.41;0.46;0.64;0.69;0.87;1"
// Instant (en s) où le fichier atteint chaque station, pour les halos CSS.
const ARRIVALS = [0, 0.18 * LOOP, 0.41 * LOOP, 0.64 * LOOP, 0.87 * LOOP]
const PATH = XS.map((x, i) => `${i === 0 ? "M" : "L"}${x},${YS[i]}`).join(" ")

export function FileJourney({ brand, t, rtl = false }: { brand: string; t: FileJourneyText; rtl?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const motion = useRef<SVGElement>(null)
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
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Démarre le déplacement SMIL au même instant que les animations CSS (classe fj-on).
  useEffect(() => {
    if (!on) return
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = motion.current as unknown as { beginElement?: () => void } | null
    el?.beginElement?.()
  }, [on])

  const dir = rtl ? "rtl" : "ltr"
  const stations = t.stations.slice(0, 5)

  return (
    <div ref={ref} className={`fj mx-auto w-full max-w-5xl ${on ? "fj-on" : ""}`} dir="ltr">
      <Tilt max={8} glare={false}>
        <svg viewBox={`0 0 ${W} ${H}`} className="fj-svg h-auto w-full" role="img" aria-label={stations.map((s) => s.title).join(" → ")}>
          <defs>
            <linearGradient id="fj-path" x1="0" x2="1" y1="0" y2="0">
              {COLORS.map((c, i) => (
                <stop key={c} offset={`${(i / (COLORS.length - 1)) * 100}%`} stopColor={c} />
              ))}
            </linearGradient>
          </defs>

          {/* chemin du fichier */}
          <path d={PATH} fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
          <path d={PATH} fill="none" stroke="url(#fj-path)" strokeWidth="2" strokeDasharray="6 8" strokeLinejoin="round" className="fj-line" />

          {stations.map((s, i) => {
            const x = XS[i]
            const y = YS[i]
            const color = COLORS[i]
            const Icon = ICONS[i]
            const titleY = i === 3 ? y - 80 : y + 44
            return (
              <g key={s.title} className="fj-station">
                <circle cx={x} cy={y} r={46} fill={color} className="fj-halo" style={{ ["--d" as string]: `${ARRIVALS[i]}s`, transformOrigin: `${x}px ${y}px` }} />
                <circle cx={x} cy={y} r={34} fill="#fff" stroke={color} strokeWidth="2.5" />
                {Icon ? (
                  <Icon x={x - 16} y={y - 16} width={32} height={32} stroke={color} strokeWidth={1.8} />
                ) : (
                  // station PrintIOS : pictogramme du logo (voir Logo.tsx)
                  <g transform={`translate(${x - 18} ${y - 18}) scale(0.9)`}>
                    <rect x="4" y="4" width="32" height="32" rx="9" fill="#2547e9" />
                    <path d="M13 12h9.5a4.5 4.5 0 0 1 0 9H13z" fill="#fff" opacity=".95" />
                    <path d="M13 21h6v7h-6z" fill="#fff" opacity=".7" />
                    <path d="M23 24l5 4-5 4v-2.5h-4v-3h4z" fill="#a5f3fc" />
                  </g>
                )}
                <text x={x} y={y - 46} textAnchor="middle" fontSize="12" fontWeight="700" fill={color}>
                  {i + 1}
                </text>
                <foreignObject x={x - 105} y={titleY} width="210" height="26">
                  <div className="flex h-full items-center justify-center text-center text-[14px] font-bold leading-tight text-slate-900" dir={dir}>{i === 1 ? `${s.title}` : s.title}</div>
                </foreignObject>
                {i === 3 ? (
                  // dossier de la machine : fenêtre de fichiers, le nouveau fichier apparaît quand le PDF arrive
                  <foreignObject x={x - 110} y={y + 44} width="220" height="104">
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white text-[11px] shadow-md" dir="ltr">
                      <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-2 py-1 font-mono text-[10px] text-slate-600">
                        <FolderOpen className="h-3 w-3 text-amber-600" /> {t.folder}
                      </div>
                      <ul className="px-2 py-1">
                        {t.existing.slice(0, 2).map((f) => (
                          <li key={f} className="flex items-center gap-1.5 py-0.5 text-slate-500"><FileText className="h-3 w-3 shrink-0 text-slate-400" /> <span className="truncate">{f}</span></li>
                        ))}
                        <li className="fj-newfile flex items-center gap-1.5 py-0.5 font-semibold text-slate-900">
                          <FileText className="h-3 w-3 shrink-0 text-brand-600" /> <span className="truncate">{t.file}</span>
                          <span className="ms-auto rounded-full bg-emerald-100 px-1.5 text-[9px] font-bold uppercase text-emerald-700">{t.newBadge}</span>
                        </li>
                      </ul>
                    </div>
                  </foreignObject>
                ) : (
                  <foreignObject x={x - 105} y={titleY + 28} width="210" height="76">
                    <div className="text-center text-[11.5px] leading-snug text-slate-600" dir={dir}>{s.text}</div>
                  </foreignObject>
                )}
                {i === 0 && (
                  // ce qu'on n'envoie plus
                  <foreignObject x={x - 105} y={titleY + 106} width="210" height="26">
                    <div className="flex justify-center" dir={dir}>
                      <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600 line-through decoration-rose-500">{t.noMore}</span>
                    </div>
                  </foreignObject>
                )}
                {i === 4 && (
                  <foreignObject x={x - 70} y={titleY + 106} width="140" height="28">
                    <div className="fj-ready flex justify-center" dir={dir}>
                      <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow">{t.ready}</span>
                    </div>
                  </foreignObject>
                )}
              </g>
            )
          })}

          {/* le fichier PDF qui voyage */}
          <g className="fj-file">
            <rect x="-24" y="-16" width="48" height="32" rx="7" fill="#2547e9" stroke="#fff" strokeWidth="2" />
            <FileText x={-19} y={-9} width={18} height={18} stroke="#fff" strokeWidth={2} />
            <text x="2" y="4" fontSize="10" fontWeight="700" fill="#fff">PDF</text>
            <animateMotion ref={motion as React.RefObject<SVGElement>} dur={`${LOOP}s`} begin="indefinite" repeatCount="indefinite" path={PATH} calcMode="linear" keyPoints={KEY_POINTS} keyTimes={KEY_TIMES} />
          </g>

          <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="12" fill="#94a3b8">{brand}</text>
        </svg>
      </Tilt>
    </div>
  )
}
