"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import type { FaqGroup } from "@/content/faq"

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

export function FaqSearch({ groups }: { groups: FaqGroup[] }) {
  const [q, setQ] = useState("")
  const [active, setActive] = useState<string>("all")
  const filtered = useMemo(() => {
    const nq = norm(q.trim())
    return groups
      .filter((g) => active === "all" || g.id === active)
      .map((g) => ({ ...g, items: g.items.filter((i) => !nq || norm(i.q + " " + i.a).includes(nq)) }))
      .filter((g) => g.items.length)
  }, [groups, q, active])

  return (
    <div className="container-x">
      <div className="mx-auto max-w-3xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
          <input className="input pl-11" placeholder="Rechercher : virement, Ameex, COD, agent…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Rechercher dans la FAQ" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => setActive("all")} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ${active === "all" ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-slate-700 ring-slate-200 hover:ring-brand-300"}`}>
            Tout
          </button>
          {groups.map((g) => (
            <button key={g.id} onClick={() => setActive(g.id)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ${active === g.id ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-slate-700 ring-slate-200 hover:ring-brand-300"}`}>
              {g.title}
            </button>
          ))}
        </div>

        {filtered.length === 0 && <p className="mt-10 text-center text-sm text-slate-500">Aucune réponse ne correspond à « {q} ».</p>}

        {filtered.map((g) => (
          <section key={g.id} id={g.id} className="mt-10 scroll-mt-24">
            <h2 className="text-lg font-bold text-ink">{g.title}</h2>
            <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
              {g.items.map((f) => (
                <details key={f.q} className="group px-6 py-4" open={!!q}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink">
                    {f.q}
                    <span className="text-slate-400 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
