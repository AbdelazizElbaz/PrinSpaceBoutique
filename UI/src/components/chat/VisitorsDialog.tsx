"use client"

// Statistiques de fréquentation et liste complète des visiteurs (IP, ville, pays, pages vues, appareil, source) —
// demande utilisateur du 20/10/2026 « les statistiques des visiteurs et la liste des visiteurs, IP et ville comme
// dans le chat ». Données : AdminVisitorController::stats()/all() (sessions conservées 30 jours).

import { useCallback, useEffect, useState } from "react"
import { Loader2, MessageSquareText, Radio, RefreshCw, Search, X } from "lucide-react"
import { adminApi, type AdminVisitor, type VisitorStats } from "@/lib/chatApi"

const flag = (code: string | null | undefined) => (code && code.length === 2 ? String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : "")
const fmtDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—")
const dayLabel = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "2-digit" })

export function VisitorsDialog({ onClose, onOpenVisitor }: { onClose: () => void; onOpenVisitor: (v: AdminVisitor) => void }) {
  const [days, setDays] = useState<7 | 30>(7)
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [list, setList] = useState<AdminVisitor[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [q, setQ] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, l] = await Promise.all([adminApi.visitorStats(days), adminApi.visitorsAll(days, query, page)])
      setStats(s)
      setList(l.data)
      setTotal(l.total)
      setLastPage(l.last_page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible")
    } finally {
      setLoading(false)
    }
  }, [days, query, page])

  useEffect(() => {
    load()
  }, [load])

  const maxDay = Math.max(1, ...(stats?.by_day.map((d) => d.visitors) ?? [1]))

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-3 sm:p-6" onClick={onClose}>
      <div className="card w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink">Visiteurs et statistiques</h2>
            <p className="text-xs text-slate-500">Mêmes données que le chat (IP, ville, pays, pages). Historique conservé 30 jours.</p>
          </div>
          <div className="flex items-center gap-2">
            {([7, 30] as const).map((d) => (
              <button key={d} type="button" onClick={() => { setDays(d); setPage(1) }} className={`rounded-full px-3 py-1.5 text-xs font-medium ${days === d ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {d} jours
              </button>
            ))}
            <button type="button" onClick={load} className="btn-ghost !px-3 !py-2" title="Actualiser">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button type="button" onClick={onClose} className="btn-ghost !px-3 !py-2" aria-label="Fermer">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</p>}

        {stats && (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {[
                ["En ligne", stats.online, "text-emerald-600"],
                ["Aujourd'hui", stats.today.visitors, ""],
                ["Nouveaux aujourd'hui", stats.today.new, ""],
                [`Visiteurs (${stats.days} j)`, stats.period.visitors, ""],
                [`Nouveaux (${stats.days} j)`, stats.period.new, ""],
                [`Pages vues (${stats.days} j)`, stats.period.page_views, ""],
              ].map(([label, value, cls]) => (
                <div key={String(label)} className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200">
                  <p className="text-[11px] text-slate-500">{label}</p>
                  <p className={`text-xl font-semibold ${cls || "text-ink"}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
              <div className="rounded-xl ring-1 ring-slate-200 p-3">
                <p className="text-xs font-semibold text-ink">Visiteurs par jour</p>
                <div className="mt-3 flex h-36 items-end gap-1">
                  {stats.by_day.map((d) => (
                    <div key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${dayLabel(d.date)} : ${d.visitors} visiteur(s), ${d.new} nouveau(x), ${d.page_views} page(s) vue(s)`}>
                      <span className="text-[10px] text-slate-500">{d.visitors || ""}</span>
                      <div className="w-full rounded-t bg-brand-500/80" style={{ height: `${Math.max(2, (d.visitors / maxDay) * 100)}%` }} />
                      {stats.days <= 7 && <span className="text-[9px] text-slate-400">{dayLabel(d.date).slice(0, 3)}</span>}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Appareils : {stats.devices.mobile} mobile · {stats.devices.desktop} ordinateur · Langues : {stats.locales.map((l) => `${l.locale} ${l.count}`).join(", ") || "—"}
                </p>
              </div>
              <TopList title="Villes" rows={stats.top_cities.map((c) => [`${flag(c.country_code)} ${c.city}${c.country ? `, ${c.country}` : ""}`, c.count])} />
              <TopList title="Pays" rows={stats.top_countries.map((c) => [`${flag(c.country_code)} ${c.country}`, c.count])} />
              <TopList title="Pages les plus vues" rows={stats.top_pages.map((p) => [p.path, p.count])} mono />
              <TopList title="Sources" rows={stats.sources.map((s) => [s.source, s.count])} />
            </div>
          </>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-ink">Liste des visiteurs ({total})</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setPage(1)
              setQuery(q.trim())
            }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute start-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="IP, ville, pays, page, source…" className="input !py-1.5 !ps-8 text-xs" />
            </div>
            <button type="submit" className="btn-secondary !py-1.5 text-xs">Filtrer</button>
          </form>
        </div>
        <div className="mt-2 overflow-x-auto rounded-xl ring-1 ring-slate-200">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 text-start">Visiteur</th>
                <th className="px-3 py-2 text-start">Ville / pays</th>
                <th className="px-3 py-2 text-start">IP</th>
                <th className="px-3 py-2 text-start">Dernière visite</th>
                <th className="px-3 py-2 text-start">Première visite</th>
                <th className="px-3 py-2 text-start">Pages</th>
                <th className="px-3 py-2 text-start">Source</th>
                <th className="px-3 py-2 text-start">Appareil</th>
                <th className="px-3 py-2 text-start"></th>
              </tr>
            </thead>
            <tbody>
              {loading && list.length === 0 ? (
                <tr><td colSpan={9} className="px-3 py-6 text-center text-slate-500"><Loader2 className="inline h-4 w-4 animate-spin" /></td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={9} className="px-3 py-6 text-center text-slate-500">Aucun visiteur sur la période.</td></tr>
              ) : (
                list.map((v) => (
                  <tr key={v.id} className="border-t border-slate-100 align-top">
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-1.5 font-medium text-ink">
                        {v.online && <Radio className="h-3.5 w-3.5 text-emerald-500" />}
                        {flag(v.country_code)} {v.display_name}
                      </span>
                      {v.locale && <span className="text-[10px] text-slate-400">{v.locale.toUpperCase()}</span>}
                    </td>
                    <td className="px-3 py-2 text-slate-700">{[v.city, v.country].filter(Boolean).join(", ") || <span className="text-slate-400">inconnue</span>}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-slate-600" dir="ltr">{v.ip_address || "—"}</td>
                    <td className="px-3 py-2 text-slate-600" dir="ltr">{fmtDate(v.last_seen_at)}</td>
                    <td className="px-3 py-2 text-slate-600" dir="ltr">{fmtDate(v.first_seen_at)}</td>
                    <td className="px-3 py-2 text-slate-600">
                      <span className="font-medium text-ink">{v.page_views ?? v.viewed_pages.length}</span>
                      <span className="block max-w-[14rem] truncate font-mono text-[10px] text-slate-400" title={v.viewed_pages.join(" → ")}>{v.current_path || "/"}</span>
                    </td>
                    <td className="px-3 py-2 text-slate-600" title={v.referrer ?? undefined}>{v.source || "direct"}</td>
                    <td className="px-3 py-2 text-slate-600" title={v.user_agent ?? undefined}>{v.device || "—"}</td>
                    <td className="px-3 py-2">
                      <button type="button" onClick={() => onOpenVisitor(v)} className="btn-ghost !px-2 !py-1" title={v.conversation_id ? "Ouvrir la conversation" : "Démarrer une conversation"}>
                        <MessageSquareText className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {lastPage > 1 && (
          <div className="mt-2 flex items-center justify-end gap-2 text-xs text-slate-600">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary !py-1 disabled:opacity-40">Précédent</button>
            <span>Page {page} / {lastPage}</span>
            <button type="button" disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)} className="btn-secondary !py-1 disabled:opacity-40">Suivant</button>
          </div>
        )}
      </div>
    </div>
  )
}

function TopList({ title, rows, mono = false }: { title: string; rows: [string, number][]; mono?: boolean }) {
  const max = Math.max(1, ...rows.map((r) => r[1]))
  return (
    <div className="rounded-xl p-3 ring-1 ring-slate-200">
      <p className="text-xs font-semibold text-ink">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-2 text-xs text-slate-400">—</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {rows.map(([label, count]) => (
            <li key={label} className="text-[11px]">
              <div className="flex items-center justify-between gap-2">
                <span className={`truncate text-slate-700 ${mono ? "font-mono" : ""}`} title={label}>{label}</span>
                <span className="shrink-0 font-medium text-ink">{count}</span>
              </div>
              <div className="mt-0.5 h-1 rounded-full bg-slate-100">
                <div className="h-1 rounded-full bg-brand-500/70" style={{ width: `${(count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
