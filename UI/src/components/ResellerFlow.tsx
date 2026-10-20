"use client"

// Troisième vue animée « revendeurs » (demande utilisateur du 20/10/2026) : le revendeur commande avec ses prix
// négociés et dépose ses fichiers de conception et de montage ; l'atelier reçoit, monte, produit (suivi en temps
// réel) et génère le ticket de livraison ; relevé du revendeur. Mêmes panneaux et animations que OrderFlow.tsx
// (Panel, classes .flow*), boucle de 10 s pour les étapes de l'atelier.

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { BadgeCheck, FileText, Inbox, LayoutGrid, Printer, Receipt, Send, Tag, Upload, Users } from "lucide-react"
import { Panel } from "@/components/OrderFlow"

export type ResellerFlowText = {
  reseller: { title: string; account: string; negotiated: string; line: string; publicPrice: string; negotiatedPrice: string; filesTitle: string; files: { name: string; kind: string }[] }
  workshop: { title: string; steps: string[] }
  ticket: { title: string; ticketTitle: string; number: string; rows: { k: string; v: string }[]; auto: string; statementTitle: string; statement: { k: string; v: string }[] }
}

const STEP_ICONS = [Inbox, LayoutGrid, Printer, Receipt, Send]
const LOOP = 10

export function ResellerFlow({ t, rtl = false }: { t: ResellerFlowText; rtl?: boolean }) {
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

  const d = (s: number): CSSProperties => ({ ["--d" as string]: `${s}s` })
  const steps = t.workshop.steps.slice(0, 5)

  return (
    <div ref={ref} className={`flow flow-3d mx-auto w-full max-w-5xl ${on ? "flow-on" : ""}`} dir={rtl ? "rtl" : "ltr"}>
      <div className="grid gap-6 md:grid-cols-3">
        {/* 1. Le revendeur commande */}
        <Panel tone="green" title={t.reseller.title} delay={0}>
          <div className="flow-in flow-z flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-md" style={d(0.3)}>
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white"><Users className="h-4 w-4" /></span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900">{t.reseller.account}</p>
              <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700"><Tag className="h-3 w-3" /> {t.reseller.negotiated}</p>
            </div>
          </div>
          <div className="flow-in flow-z mt-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-md" style={d(0.45)}>
            <p className="text-xs font-semibold text-slate-800">{t.reseller.line}</p>
            <p className="mt-1 text-[11px] text-slate-500"><span className="line-through">{t.reseller.publicPrice}</span> <span className="flow-chip ms-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700" style={{ ["--l" as string]: "0s" }}>{t.reseller.negotiatedPrice}</span></p>
          </div>
          <div className="flow-in flow-z mt-3 rounded-xl border-2 border-dashed border-emerald-300 bg-white p-2.5" style={d(0.6)}>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><Upload className="h-4 w-4" /> {t.reseller.filesTitle}</p>
            <ul className="mt-2 space-y-1.5">
              {t.reseller.files.slice(0, 3).map((f, i) => (
                <li key={f.name} className="flow-tile flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px]" style={{ ["--d" as string]: `${0.75 + i * 0.12}s`, ["--l" as string]: `${i * 2.5}s` }}>
                  <FileText className="h-3.5 w-3.5 shrink-0 text-brand-600" />
                  <span className="truncate font-semibold text-slate-800" dir="ltr">{f.name}</span>
                  <span className="ms-auto shrink-0 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500 ring-1 ring-slate-200">{f.kind}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        {/* 2. L'atelier traite : étapes cochées l'une après l'autre */}
        <Panel tone="purple" title={t.workshop.title} delay={0.15}>
          <ol className="relative ms-4 space-y-3 border-s-2 border-dashed border-violet-300 ps-5">
            {steps.map((s, i) => {
              const Icon = STEP_ICONS[i]
              return (
                <li key={s} className="flow-in flow-z relative flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 shadow-md" style={d(0.4 + i * 0.12)}>
                  <span className="absolute -start-[1.95rem] top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border border-violet-300 bg-white">
                    <span className="flow-tl absolute inset-0 rounded-full bg-violet-600" style={{ ["--l" as string]: `${1 + (i * LOOP) / 6}s` }} />
                  </span>
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700"><Icon className="h-4 w-4" /></span>
                  <span className="text-xs font-semibold leading-snug text-slate-800">{s}</span>
                </li>
              )
            })}
          </ol>
        </Panel>

        {/* 3. Ticket de livraison + relevé revendeur */}
        <Panel tone="orange" title={t.ticket.title} delay={0.3}>
          <div className="flow-in flow-z overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md" style={d(0.5)} dir={rtl ? "rtl" : "ltr"}>
            <div className="flex items-center justify-between border-b border-dashed border-slate-200 bg-orange-50 px-3 py-1.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-orange-800"><Receipt className="h-3.5 w-3.5" /> {t.ticket.ticketTitle}</span>
              <span className="font-mono text-[11px] font-semibold text-slate-700" dir="ltr">{t.ticket.number}</span>
            </div>
            <dl className="px-3 py-2 text-[11px]">
              {t.ticket.rows.slice(0, 4).map((r) => (
                <div key={r.k} className="flex justify-between gap-2 py-0.5">
                  <dt className="text-slate-500">{r.k}</dt>
                  <dd className="font-semibold text-slate-800">{r.v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex items-center justify-between border-t border-dashed border-slate-200 px-3 py-1.5">
              {/* faux QR : grille de carrés */}
              <span className="grid grid-cols-5 gap-[2px]" aria-hidden>
                {Array.from({ length: 25 }, (_, i) => (
                  <span key={i} className={`h-[5px] w-[5px] ${[0, 1, 2, 4, 5, 7, 9, 10, 12, 14, 16, 18, 20, 22, 23, 24].includes(i) ? "bg-slate-800" : "bg-slate-200"}`} />
                ))}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700"><BadgeCheck className="h-3.5 w-3.5" /> {t.ticket.auto}</span>
            </div>
          </div>
          <div className="flow-in flow-z mt-3 rounded-xl border border-slate-200 bg-white p-3 shadow-md" style={d(0.75)}>
            <p className="flex items-center gap-1.5 text-xs font-bold text-slate-900"><Users className="h-3.5 w-3.5 text-orange-600" /> {t.ticket.statementTitle}</p>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
              {t.ticket.statement.slice(0, 3).map((r) => (
                <div key={r.k} className="rounded-lg bg-slate-50 px-1 py-1.5">
                  <dt className="text-[10px] text-slate-500">{r.k}</dt>
                  <dd className="text-[11px] font-bold text-slate-800" dir="ltr">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Panel>
      </div>
    </div>
  )
}
