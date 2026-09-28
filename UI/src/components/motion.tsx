"use client"

// Animations légères, sans dépendance (pas de framer-motion) :
//   <Reveal>   apparition au scroll (IntersectionObserver) + décalage `delay`
//   <Tilt>     inclinaison 3D qui suit la souris + reflet (mockups du hero)
//   <CountUp>  chiffres qui montent quand la section devient visible
// Toutes respectent prefers-reduced-motion (voir globals.css).

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }),
      { threshold, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, seen }
}

type RevealProps = {
  children: ReactNode
  className?: string
  /** ms avant le départ (pour décaler les cartes d'une grille) */
  delay?: number
  /** direction d'arrivée */
  from?: "up" | "down" | "left" | "right" | "zoom" | "none"
  as?: "div" | "li" | "section" | "figure" | "span"
  style?: CSSProperties
}

export function Reveal({ children, className = "", delay = 0, from = "up", as = "div", style }: RevealProps) {
  const { ref, seen } = useInView<HTMLDivElement>()
  const Tag = as as "div"
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${from} ${seen ? "is-in" : ""} ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

/** Grille : chaque enfant direct apparaît avec un décalage croissant. */
export function Stagger({ children, className = "", step = 90, from = "up" }: { children: ReactNode[]; className?: string; step?: number; from?: RevealProps["from"] }) {
  return (
    <>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * step} from={from} className={className}>
          {child}
        </Reveal>
      ))}
    </>
  )
}

export function Tilt({ children, className = "", max = 10, glare = true }: { children: ReactNode; className?: string; max?: number; glare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty("--rx", `${(-y * max).toFixed(2)}deg`)
    el.style.setProperty("--ry", `${(x * max).toFixed(2)}deg`)
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`)
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`)
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
  }
  return (
    <div className={`tilt-scene ${className}`}>
      <div ref={ref} className={`tilt ${glare ? "tilt-glare" : ""}`} onMouseMove={onMove} onMouseLeave={onLeave}>
        {children}
      </div>
    </div>
  )
}

/**
 * "24 h" → anime 0 → 24 puis " h" ; "0 écart" reste "0 écart" ; "24/7" anime
 * 24 puis "/7" ; "+120" → "+" puis 120. Seul le PREMIER nombre est animé.
 */
export function CountUp({ value, duration = 1400, className = "" }: { value: string; duration?: number; className?: string }) {
  const { ref, seen } = useInView<HTMLSpanElement>(0.5)
  const m = value.match(/^([^\d]*)(\d[\d\s.,]*)(.*)$/)
  const [n, setN] = useState(0)
  const target = m ? parseFloat(m[2].replace(/\s/g, "").replace(",", ".")) : NaN
  const decimals = m && /[.,]\d+$/.test(m[2].trim()) ? m[2].trim().split(/[.,]/)[1].length : 0

  useEffect(() => {
    if (!seen || !m || isNaN(target)) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(target); return }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      setN(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen])

  if (!m || isNaN(target)) return <span ref={ref} className={className}>{value}</span>
  const shown = (seen ? n : 0).toFixed(decimals)
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {m[1]}{shown}{m[3]}
    </span>
  )
}
