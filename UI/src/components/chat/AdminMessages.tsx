"use client"

// Console admin du chat en direct (page /admin/messages) — portage simplifié de PackSpaceStore
// admin/messages/page.tsx : connexion par mot de passe (jeton Bearer en localStorage), liste des conversations
// (actives / archivées) et des visiteurs en ligne, fil ouvert avec le contexte du visiteur (ville, pays, IP,
// pages vues), réponses prédéfinies, réglages (message d'accueil, intervalle de polling). Outil interne :
// textes en français uniquement. Mise à jour par polling, comme le widget.

import { useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Archive, ArchiveRestore, Globe, Loader2, LogOut, MessageSquareText, Radio, RefreshCw, Send, Settings2, Store, Trash2, Users, X, Zap } from "lucide-react"
import { adminApi, ADMIN_HINT_KEY, ADMIN_TOKEN_KEY, ChatApiError, playNotificationSound, setNotificationTitle, type AdminConversation, type AdminThread, type AdminVisitor, type CannedResponse, type ChatAiKnowledge, type ChatAiSettings, type ChatMessage, type SiteOverridesPayload } from "@/lib/chatApi"

const DEFAULT_POLL_MS = 2000
const VISITORS_POLL_MS = 10000

const fmtTime = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—")
const ago = (iso: string | null | undefined) => {
  if (!iso) return "—"
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return `il y a ${s} s`
  if (s < 3600) return `il y a ${Math.round(s / 60)} min`
  if (s < 86400) return `il y a ${Math.round(s / 3600)} h`
  return fmtTime(iso)
}
const flag = (code: string | null | undefined) => (code && code.length === 2 ? String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : "")

export function AdminMessages() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  useEffect(() => {
    const token = window.localStorage.getItem(ADMIN_TOKEN_KEY)
    if (!token) {
      setAuthed(false)
      return
    }
    adminApi
      .me()
      .then(() => {
        window.localStorage.setItem(ADMIN_HINT_KEY, "1")
        setAuthed(true)
      })
      .catch(() => {
        window.localStorage.removeItem(ADMIN_TOKEN_KEY)
        setAuthed(false)
      })
  }, [])

  if (authed === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }
  if (!authed) return <Login onDone={() => setAuthed(true)} />
  return <Console onLogout={() => setAuthed(false)} />
}

function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const { token } = await adminApi.login(password)
      window.localStorage.setItem(ADMIN_TOKEN_KEY, token)
      window.localStorage.setItem(ADMIN_HINT_KEY, "1")
      onDone()
    } catch (err) {
      setError(err instanceof ChatApiError ? err.errors?.password?.[0] || err.message : "Connexion impossible.")
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form onSubmit={submit} className="card w-full max-w-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <MessageSquareText className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-base font-semibold text-ink">Console du chat</h1>
            <p className="text-xs text-slate-500">Réservée à l&apos;équipe PrintIOS</p>
          </div>
        </div>
        <label className="label" htmlFor="admin-password">
          Mot de passe
        </label>
        <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input mt-1" required />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy || !password} className="btn-primary mt-4 w-full">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Se connecter
        </button>
      </form>
    </div>
  )
}

function Console({ onLogout }: { onLogout: () => void }) {
  const params = useSearchParams()
  const [tab, setTab] = useState<"active" | "archived" | "visitors">("active")
  const [conversations, setConversations] = useState<AdminConversation[]>([])
  const [visitors, setVisitors] = useState<AdminVisitor[]>([])
  const [stats, setStats] = useState({ unread: 0, online: 0 })
  const [selected, setSelected] = useState<number | null>(null)
  const [thread, setThread] = useState<AdminThread | null>(null)
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const [pollMs, setPollMs] = useState(DEFAULT_POLL_MS)
  const [canned, setCanned] = useState<CannedResponse[]>([])
  const [showCanned, setShowCanned] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSite, setShowSite] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastUnreadRef = useRef<number | null>(null)
  const lastTypingRef = useRef(0)
  const listRef = useRef<HTMLDivElement | null>(null)
  const selectedRef = useRef<number | null>(null)
  selectedRef.current = selected

  const fail = useCallback(
    (err: unknown) => {
      if (err instanceof ChatApiError && err.status === 401) {
        window.localStorage.removeItem(ADMIN_TOKEN_KEY)
        onLogout()
        return
      }
      setError(err instanceof Error ? err.message : "Erreur réseau")
    },
    [onLogout]
  )

  // Réglages + réponses prédéfinies au montage.
  useEffect(() => {
    adminApi.settings().then((s) => s.poll_interval_ms && setPollMs(s.poll_interval_ms)).catch(fail)
    adminApi.canned().then(setCanned).catch(() => {})
  }, [fail])

  // Liste + badges, à l'intervalle réglé ; bip + titre quand des non-lus arrivent.
  const loadList = useCallback(async () => {
    try {
      const [rows, st] = await Promise.all([adminApi.conversations(tab === "archived"), adminApi.stats()])
      setConversations(rows)
      setStats(st)
      setNotificationTitle(st.unread)
      if (lastUnreadRef.current !== null && st.unread > lastUnreadRef.current) playNotificationSound()
      lastUnreadRef.current = st.unread
      setError(null)
    } catch (err) {
      fail(err)
    }
  }, [tab, fail])
  useEffect(() => {
    loadList()
    const id = setInterval(loadList, pollMs)
    return () => clearInterval(id)
  }, [loadList, pollMs])

  // Visiteurs en ligne (10 s).
  const loadVisitors = useCallback(() => adminApi.visitors().then(setVisitors).catch(fail), [fail])
  useEffect(() => {
    loadVisitors()
    const id = setInterval(loadVisitors, VISITORS_POLL_MS)
    return () => clearInterval(id)
  }, [loadVisitors])

  // Fil ouvert : rechargé entièrement à l'intervalle (contexte visiteur + frappe + nouveaux messages).
  const loadThread = useCallback(
    async (id: number) => {
      try {
        const data = await adminApi.thread(id)
        if (selectedRef.current === id) setThread(data)
      } catch (err) {
        fail(err)
      }
    },
    [fail]
  )
  useEffect(() => {
    if (!selected) {
      setThread(null)
      return
    }
    loadThread(selected)
    const id = setInterval(() => loadThread(selected), pollMs)
    return () => clearInterval(id)
  }, [selected, loadThread, pollMs])

  // ?conversation=<id> (lien de l'e-mail de notification).
  useEffect(() => {
    const id = Number(params?.get("conversation"))
    if (id > 0) setSelected(id)
  }, [params])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [thread?.messages.length, thread?.visitor_typing])

  const reply = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = draft.trim()
    if (!body || !selected || sending) return
    setSending(true)
    try {
      const { message } = await adminApi.reply(selected, body)
      setThread((prev) => (prev ? { ...prev, messages: [...prev.messages, message as ChatMessage] } : prev))
      setDraft("")
      loadList()
    } catch (err) {
      fail(err)
    } finally {
      setSending(false)
    }
  }

  const typing = () => {
    if (!selected || Date.now() - lastTypingRef.current < 2000) return
    lastTypingRef.current = Date.now()
    adminApi.typing(selected).catch(() => {})
  }

  const archiveToggle = async () => {
    if (!thread) return
    try {
      if (thread.conversation.archived_at) await adminApi.unarchive(thread.conversation.id)
      else await adminApi.archive(thread.conversation.id)
      loadThread(thread.conversation.id)
      loadList()
    } catch (err) {
      fail(err)
    }
  }

  const remove = async () => {
    if (!thread || !window.confirm(`Supprimer définitivement la conversation avec ${thread.conversation.display_name} ?`)) return
    try {
      await adminApi.remove(thread.conversation.id)
      setSelected(null)
      loadList()
    } catch (err) {
      fail(err)
    }
  }

  const openVisitor = async (v: AdminVisitor) => {
    if (v.conversation_id) {
      setSelected(v.conversation_id)
      return
    }
    try {
      const { conversation_id } = await adminApi.startChat(v.id)
      setSelected(conversation_id)
      setTab("active")
      loadList()
    } catch (err) {
      fail(err)
    }
  }

  const logout = async () => {
    try {
      await adminApi.logout()
    } catch {
      /* ignoré */
    }
    window.localStorage.removeItem(ADMIN_TOKEN_KEY)
    window.localStorage.removeItem(ADMIN_HINT_KEY)
    onLogout()
  }

  const visitorsWithoutThread = visitors.filter((v) => !v.conversation_id || !conversations.some((c) => c.id === v.conversation_id))

  return (
    <div className="container-x py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <MessageSquareText className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-ink">Chat en direct</h1>
            <p className="text-xs text-slate-500">
              {stats.unread} non lu{stats.unread > 1 ? "s" : ""} · {stats.online} visiteur{stats.online > 1 ? "s" : ""} en ligne
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => loadList()} className="btn-ghost !px-3 !py-2" title="Actualiser">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setShowSettings(true)} className="btn-ghost !px-3 !py-2" title="Réglages du chat">
            <Settings2 className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setShowSite(true)} className="btn-ghost !px-3 !py-2" title="Paramètres du site (prix, coordonnées)">
            <Store className="h-4 w-4" />
          </button>
          <button type="button" onClick={logout} className="btn-ghost !px-3 !py-2" title="Se déconnecter">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
      {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
        {/* Colonne gauche : onglets + liste */}
        <aside className="card flex max-h-[75vh] flex-col !p-0">
          <div className="flex border-b border-slate-200 text-xs font-medium">
            {(
              [
                ["active", "Actives"],
                ["archived", "Archivées"],
                ["visitors", `En ligne (${stats.online})`],
              ] as const
            ).map(([key, label]) => (
              <button key={key} type="button" onClick={() => setTab(key)} className={`flex-1 px-2 py-2.5 transition ${tab === key ? "border-b-2 border-brand-600 text-brand-700" : "text-slate-500 hover:text-ink"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {tab !== "visitors" ? (
              conversations.length === 0 ? (
                <p className="p-4 text-sm text-slate-500">Aucune conversation.</p>
              ) : (
                conversations.map((c) => (
                  <button key={c.id} type="button" onClick={() => setSelected(c.id)} className={`flex w-full items-start gap-3 border-b border-slate-100 px-3 py-2.5 text-start transition hover:bg-slate-50 ${selected === c.id ? "bg-brand-50" : ""}`}>
                    <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${c.online ? "bg-emerald-500" : "bg-slate-300"}`} title={c.online ? "En ligne" : "Hors ligne"} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-ink">{c.display_name}</span>
                        <span className="shrink-0 text-[10px] text-slate-400">{ago(c.last_message_at)}</span>
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {c.visitor_typing ? <em className="text-brand-700">écrit…</em> : c.last_message ? `${c.last_message_sender === "admin" ? "Vous : " : ""}${c.last_message}` : "—"}
                      </span>
                      <span className="block truncate text-[10px] text-slate-400">
                        {[c.city, c.country].filter(Boolean).join(", ") || "Localisation inconnue"}
                        {c.guest_phone ? ` · ${c.guest_phone}` : ""}
                      </span>
                    </span>
                    {c.unread_count > 0 && <span className="mt-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">{c.unread_count}</span>}
                  </button>
                ))
              )
            ) : visitors.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">Personne en ligne pour le moment.</p>
            ) : (
              visitors.map((v) => (
                <button key={v.id} type="button" onClick={() => openVisitor(v)} className="flex w-full items-start gap-3 border-b border-slate-100 px-3 py-2.5 text-start transition hover:bg-slate-50">
                  <Radio className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-ink">
                        {flag(v.country_code)} {v.display_name}
                      </span>
                      <span className="shrink-0 text-[10px] text-slate-400">{ago(v.last_seen_at)}</span>
                    </span>
                    <span className="block truncate text-xs text-slate-500">{v.current_path || "/"}</span>
                    <span className="block truncate text-[10px] text-slate-400">
                      {[v.city, v.country].filter(Boolean).join(", ") || v.ip_address || "Localisation inconnue"}
                      {v.locale ? ` · ${v.locale.toUpperCase()}` : ""}
                      {v.conversation_id ? " · conversation ouverte" : ""}
                    </span>
                  </span>
                </button>
              ))
            )}
            {tab === "active" && visitorsWithoutThread.length > 0 && (
              <p className="px-3 py-2 text-[11px] text-slate-400">
                <Users className="me-1 inline h-3 w-3" />
                {visitorsWithoutThread.length} visiteur{visitorsWithoutThread.length > 1 ? "s" : ""} en ligne sans conversation (onglet « En ligne »).
              </p>
            )}
          </div>
        </aside>

        {/* Fil ouvert */}
        <section className="card flex h-[75vh] flex-col !p-0">
          {!thread ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-slate-400">
              <MessageSquareText className="h-8 w-8" />
              <p className="text-sm">Choisissez une conversation ou un visiteur en ligne.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate text-sm font-semibold text-ink">
                    <span className={`h-2.5 w-2.5 rounded-full ${thread.visitor.online ? "bg-emerald-500" : "bg-slate-300"}`} />
                    {flag(thread.visitor.country_code)} {thread.conversation.display_name}
                    {thread.conversation.guest_phone && <span className="font-normal text-slate-500">· {thread.conversation.guest_phone}</span>}
                    {thread.conversation.archived_at && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">Archivée</span>}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {[thread.visitor.city, thread.visitor.country].filter(Boolean).join(", ") || "Localisation inconnue"}
                    {thread.visitor.ip_address ? ` · IP ${thread.visitor.ip_address}` : ""} · {thread.visitor.online ? `en ligne, sur ${thread.visitor.current_path || "/"}` : `vu ${ago(thread.visitor.last_seen_at)}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => setShowInfo((v) => !v)} className={`btn-ghost !px-2.5 !py-2 ${showInfo ? "text-brand-700" : ""}`} title="Détails du visiteur">
                    <Globe className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={archiveToggle} className="btn-ghost !px-2.5 !py-2" title={thread.conversation.archived_at ? "Désarchiver" : "Archiver"}>
                    {thread.conversation.archived_at ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                  </button>
                  <button type="button" onClick={remove} className="btn-ghost !px-2.5 !py-2 text-red-600" title="Supprimer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex min-h-0 flex-1">
                <div className="flex min-w-0 flex-1 flex-col">
                  <div ref={listRef} className="flex-1 overflow-y-auto bg-slate-50/60 px-4 py-3">
                    <div className="flex flex-col gap-2">
                      {thread.messages.map((m) => (
                        <div key={m.id} className={`flex max-w-[80%] flex-col gap-0.5 ${m.sender === "admin" ? "ms-auto items-end" : "me-auto items-start"}`}>
                          <span className="px-1 text-[10px] uppercase tracking-wide text-slate-400">
                            {m.sender === "admin" ? (m.source === "ai" ? "Assistant IA" : "Vous") : thread.conversation.display_name} · {fmtTime(m.created_at)}
                            {m.sender === "admin" && m.read_at ? " · lu" : ""}
                          </span>
                          <div className={`whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${m.sender === "admin" ? (m.source === "ai" ? "rounded-ee-sm bg-violet-600 text-white" : "rounded-ee-sm bg-brand-600 text-white") : "rounded-es-sm bg-white text-ink shadow-sm ring-1 ring-slate-200"}`}>{m.body}</div>
                        </div>
                      ))}
                      {thread.visitor_typing && <p className="me-auto rounded-2xl bg-white px-3 py-2 text-xs italic text-slate-500 ring-1 ring-slate-200">{thread.conversation.display_name} écrit…</p>}
                    </div>
                  </div>
                  <form onSubmit={reply} className="relative flex items-center gap-2 border-t border-slate-200 p-3">
                    <button type="button" onClick={() => setShowCanned((v) => !v)} className={`btn-ghost !px-2.5 !py-2 ${showCanned ? "text-brand-700" : ""}`} title="Réponses prédéfinies">
                      <Zap className="h-4 w-4" />
                    </button>
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) => {
                        setDraft(e.target.value)
                        typing()
                      }}
                      placeholder="Votre réponse…"
                      maxLength={2000}
                      className="input !rounded-full"
                    />
                    <button type="submit" disabled={sending || !draft.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-50" aria-label="Envoyer">
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                    {showCanned && (
                      <CannedPopover
                        items={canned}
                        onPick={(body) => {
                          setDraft((d) => (d ? `${d} ${body}` : body))
                          setShowCanned(false)
                        }}
                        onChange={setCanned}
                        onClose={() => setShowCanned(false)}
                      />
                    )}
                  </form>
                </div>
                {showInfo && <VisitorPanel v={thread.visitor} locale={thread.conversation.locale} created={thread.conversation.created_at} />}
              </div>
            </>
          )}
        </section>
      </div>

      {showSettings && <SettingsDialog onClose={() => setShowSettings(false)} onSaved={(ms) => setPollMs(ms)} />}
      {showSite && <SiteSettingsDialog onClose={() => setShowSite(false)} />}
    </div>
  )
}

function VisitorPanel({ v, locale, created }: { v: AdminThread["visitor"]; locale: string | null; created: string }) {
  const Row = ({ k, children }: { k: string; children: React.ReactNode }) => (
    <div className="border-b border-slate-100 py-1.5">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{k}</p>
      <p className="break-words text-xs text-ink">{children || "—"}</p>
    </div>
  )
  return (
    <aside className="hidden w-64 shrink-0 overflow-y-auto border-s border-slate-200 bg-white px-3 py-2 text-xs md:block">
      <Row k="Localisation">
        {flag(v.country_code)} {[v.city, v.country].filter(Boolean).join(", ") || null}
      </Row>
      <Row k="Adresse IP">{v.ip_address}</Row>
      {v.geo_error && <Row k="Géolocalisation">{v.geo_error}</Row>}
      <Row k="Langue du site">{locale?.toUpperCase()}</Row>
      <Row k="Page actuelle">{v.current_path}</Row>
      <Row k="Venu depuis">{v.referrer}</Row>
      <Row k="Pages vues">
        {v.viewed_pages?.length ? (
          <span className="flex flex-col gap-0.5">
            {v.viewed_pages.map((p) => (
              <span key={p} className="truncate">
                {p}
              </span>
            ))}
          </span>
        ) : null}
      </Row>
      <Row k="Première visite">{fmtTime(v.first_seen_at)}</Row>
      <Row k="Dernière activité">{ago(v.last_seen_at)}</Row>
      <Row k="Conversation ouverte">{fmtTime(created)}</Row>
      <Row k="Navigateur">{v.user_agent}</Row>
    </aside>
  )
}

function CannedPopover({ items, onPick, onChange, onClose }: { items: CannedResponse[]; onPick: (body: string) => void; onChange: (items: CannedResponse[]) => void; onClose: () => void }) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [busy, setBusy] = useState(false)
  const add = async () => {
    if (!title.trim() || !body.trim() || busy) return
    setBusy(true)
    try {
      const created = await adminApi.addCanned({ title: title.trim(), body: body.trim() })
      onChange([...items, created].sort((a, b) => a.title.localeCompare(b.title)))
      setTitle("")
      setBody("")
    } catch {
      /* ignoré */
    } finally {
      setBusy(false)
    }
  }
  const del = async (id: number) => {
    onChange(items.filter((i) => i.id !== id))
    adminApi.removeCanned(id).catch(() => {})
  }
  return (
    <div className="absolute bottom-full start-3 z-20 mb-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-ink">Réponses prédéfinies</p>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-ink" aria-label="Fermer">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-48 space-y-1 overflow-y-auto">
        {items.length === 0 && <p className="text-xs text-slate-500">Aucune pour l&apos;instant.</p>}
        {items.map((i) => (
          <div key={i.id} className="flex items-start gap-1">
            <button type="button" onClick={() => onPick(i.body)} className="min-w-0 flex-1 rounded-lg px-2 py-1.5 text-start hover:bg-slate-50">
              <span className="block text-xs font-medium text-ink">{i.title}</span>
              <span className="block truncate text-[11px] text-slate-500">{i.body}</span>
            </button>
            <button type="button" onClick={() => del(i.id)} className="mt-1 text-slate-300 hover:text-red-600" aria-label="Supprimer">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 space-y-1.5 border-t border-slate-100 pt-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" className="input !py-1.5 text-xs" maxLength={100} />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Texte de la réponse" className="input !py-1.5 text-xs" rows={2} maxLength={2000} />
        <button type="button" onClick={add} disabled={busy || !title.trim() || !body.trim()} className="btn-secondary w-full !py-1.5 text-xs">
          Ajouter
        </button>
      </div>
    </div>
  )
}

function SettingsDialog({ onClose, onSaved }: { onClose: () => void; onSaved: (pollMs: number) => void }) {
  const [pollMs, setPollMs] = useState<number>(DEFAULT_POLL_MS)
  const [welcome, setWelcome] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  // Assistant IA (voir API App\Support\ChatAi) : fournisseur compatible OpenAI, ex. DeepSeek.
  const [ai, setAi] = useState<ChatAiSettings>({ enabled: false, base_url: "https://api.deepseek.com", model: "deepseek-chat", api_key_set: false, system_prompt: "", delay_seconds: 20, handoff_minutes: 30, use_site_knowledge: true })
  const [knowledge, setKnowledge] = useState<ChatAiKnowledge | null>(null)
  const [kbBusy, setKbBusy] = useState(false)
  const [kbPreview, setKbPreview] = useState<string | null>(null)
  const [aiKey, setAiKey] = useState("")
  const [aiDefaultPrompt, setAiDefaultPrompt] = useState("")
  const [aiTest, setAiTest] = useState<{ busy: boolean; reply?: string; error?: string; ms?: number }>({ busy: false })
  useEffect(() => {
    adminApi
      .settings()
      .then((s) => {
        setPollMs(s.poll_interval_ms)
        setWelcome(s.welcome_message || "")
        if (s.ai) setAi(s.ai)
        setAiDefaultPrompt(s.ai_default_system_prompt || "")
        setKnowledge(s.ai_knowledge || null)
      })
      .catch(() => {})
  }, [])
  const refreshKnowledge = async () => {
    setKbBusy(true)
    try {
      const r = await adminApi.aiKnowledgeRefresh()
      setKnowledge(r.knowledge)
      setKbPreview(r.preview)
    } catch {
      /* ignoré */
    } finally {
      setKbBusy(false)
    }
  }
  const runAiTest = async () => {
    setAiTest({ busy: true })
    try {
      const r = await adminApi.aiTest({ base_url: ai.base_url, model: ai.model, api_key: aiKey || undefined, system_prompt: ai.system_prompt || undefined })
      setAiTest({ busy: false, reply: r.reply, ms: r.ms })
    } catch (err) {
      setAiTest({ busy: false, error: err instanceof Error ? err.message : "Échec du test" })
    }
  }
  const save = async () => {
    setBusy(true)
    try {
      const s = await adminApi.saveSettings({
        poll_interval_ms: pollMs,
        welcome_message: welcome.trim() || null,
        ai: { enabled: ai.enabled, base_url: ai.base_url, model: ai.model, system_prompt: ai.system_prompt, delay_seconds: ai.delay_seconds, handoff_minutes: ai.handoff_minutes, use_site_knowledge: ai.use_site_knowledge, ...(aiKey ? { api_key: aiKey } : {}) },
      })
      if (s.ai) setAi(s.ai)
      setAiKey("")
      onSaved(s.poll_interval_ms)
      setDone(true)
      setTimeout(onClose, 600)
    } catch {
      /* ignoré */
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">Réglages du chat</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-ink" aria-label="Fermer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <label className="label">Message d&apos;accueil (affiché à chaque visiteur, vide = texte par défaut du site)</label>
        <textarea value={welcome} onChange={(e) => setWelcome(e.target.value)} className="input mt-1" rows={3} maxLength={500} placeholder="Bonjour 👋 Bienvenue sur PrintIOS ! Une question ? Écrivez-nous ici." />
        <label className="label mt-3">Intervalle de rafraîchissement (ms, 1000 à 60000)</label>
        <input type="number" min={1000} max={60000} step={500} value={pollMs} onChange={(e) => setPollMs(Number(e.target.value))} className="input mt-1 w-40" />

        <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50/40 p-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input type="checkbox" checked={ai.enabled} onChange={(e) => setAi({ ...ai, enabled: e.target.checked })} />
            Assistant IA (répond aux visiteurs quand personne ne prend la main)
          </label>
          <p className="mt-1 text-[11px] text-slate-500">
            Tout fournisseur compatible avec l&apos;API « chat completions » d&apos;OpenAI : DeepSeek (https://api.deepseek.com, modèle deepseek-chat), OpenAI (https://api.openai.com/v1, gpt-4o-mini), Mistral (https://api.mistral.ai/v1)… Dès qu&apos;un conseiller répond dans un fil, l&apos;assistant s&apos;efface pendant la durée indiquée.
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <label className="label text-xs">URL de base
              <input value={ai.base_url} onChange={(e) => setAi({ ...ai, base_url: e.target.value })} className="input mt-1 !py-1.5 text-xs" placeholder="https://api.deepseek.com" />
            </label>
            <label className="label text-xs">Modèle
              <input value={ai.model} onChange={(e) => setAi({ ...ai, model: e.target.value })} className="input mt-1 !py-1.5 text-xs" placeholder="deepseek-chat" />
            </label>
            <label className="label text-xs sm:col-span-2">Clé API {ai.api_key_set ? <span className="font-normal text-emerald-700">(enregistrée, laisser vide pour la conserver)</span> : <span className="font-normal text-red-600">(aucune)</span>}
              <input type="password" value={aiKey} onChange={(e) => setAiKey(e.target.value)} className="input mt-1 !py-1.5 text-xs" placeholder="sk-…" autoComplete="off" />
            </label>
            <label className="label text-xs">Délai avant réponse (s, 0 = immédiat)
              <input type="number" min={0} max={600} value={ai.delay_seconds} onChange={(e) => setAi({ ...ai, delay_seconds: Number(e.target.value) })} className="input mt-1 !py-1.5 text-xs" />
            </label>
            <label className="label text-xs">Silence après une réponse humaine (min)
              <input type="number" min={0} max={1440} value={ai.handoff_minutes} onChange={(e) => setAi({ ...ai, handoff_minutes: Number(e.target.value) })} className="input mt-1 !py-1.5 text-xs" />
            </label>
          </div>
          <div className="mt-3 rounded-lg bg-white px-3 py-2 ring-1 ring-violet-200">
            <label className="flex items-center gap-2 text-xs font-medium text-ink">
              <input type="checkbox" checked={ai.use_site_knowledge} onChange={(e) => setAi({ ...ai, use_site_knowledge: e.target.checked })} />
              Donner à l&apos;assistant le contenu du site (fonctionnalités, tarifs, FAQ, formation, PrintiosSync, coordonnées)
            </label>
            <p className="mt-1 text-[11px] text-slate-500">
              Le site publie son contenu sur /ai-knowledge.json ; l&apos;API le relit toutes les 24 h et l&apos;ajoute aux instructions. Après une mise à jour du site, cliquez « Actualiser ».
              {knowledge && (
                <>
                  {" "}
                  {knowledge.chars > 0 ? `Base actuelle : ${knowledge.sections} sections, ${knowledge.chars.toLocaleString("fr-FR")} caractères, relue le ${fmtTime(knowledge.fetched_at)}.` : `Base indisponible${knowledge.error ? ` : ${knowledge.error}` : ""}.`}
                </>
              )}
            </p>
            <button type="button" onClick={refreshKnowledge} disabled={kbBusy} className="btn-secondary mt-2 !px-2.5 !py-1 text-xs">
              {kbBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Actualiser la base de connaissances
            </button>
            {kbPreview && <pre className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap rounded bg-slate-50 p-2 text-[10px] text-slate-600">{kbPreview}…</pre>}
          </div>
          <label className="label mt-2 text-xs">Instructions complémentaires (ton, consignes, promotions en cours…)
            <textarea value={ai.system_prompt} onChange={(e) => setAi({ ...ai, system_prompt: e.target.value })} className="input mt-1 !py-1.5 text-xs" rows={6} maxLength={8000} />
          </label>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setAi({ ...ai, system_prompt: aiDefaultPrompt })} className="btn-secondary !px-2.5 !py-1 text-xs">Remettre le texte par défaut</button>
            <button type="button" onClick={runAiTest} disabled={aiTest.busy || !ai.base_url || !ai.model || (!aiKey && !ai.api_key_set)} className="btn-secondary !px-2.5 !py-1 text-xs">
              {aiTest.busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Tester (« Combien coûte PrintIOS ? »)
            </button>
          </div>
          {aiTest.reply && <p className="mt-2 whitespace-pre-wrap rounded-lg bg-white px-3 py-2 text-xs text-ink ring-1 ring-violet-200">{aiTest.reply}<span className="ms-2 text-slate-400">({aiTest.ms} ms)</span></p>}
          {aiTest.error && <p className="mt-2 text-xs text-red-600">{aiTest.error}</p>}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary !py-2">
            Annuler
          </button>
          <button type="button" onClick={save} disabled={busy} className="btn-primary !py-2">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : done ? "Enregistré" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  )
}

// Paramètres du site : prix des forfaits et coordonnées, appliqués sur le site public sous 60 s (ISR) —
// demande utilisateur du 19/10/2026. Un champ vide = valeur par défaut du code du site.
const PLAN_LABELS: Record<string, string> = { starter: "Starter", pro: "Pro", business: "Business" }
function SiteSettingsDialog({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<SiteOverridesPayload>({ contact: {}, plans: {} })
  const [defaults, setDefaults] = useState<Record<string, { name: string; monthly: number; yearly: number }>>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    adminApi
      .siteSettings()
      .then((r) => {
        setData({ contact: r.overrides.contact || {}, plans: r.overrides.plans || {}, updated_at: r.overrides.updated_at })
        setDefaults(r.defaults.plans || {})
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible"))
  }, [])
  const setContact = (k: keyof SiteOverridesPayload["contact"], v: string) => setData((d) => ({ ...d, contact: { ...d.contact, [k]: v } }))
  const setPlan = (code: string, k: keyof SiteOverridesPayload["plans"][string], v: string) =>
    setData((d) => ({ ...d, plans: { ...d.plans, [code]: { ...(d.plans[code] || {}), [k]: v === "" ? null : k === "promo_label" ? v : Number(v) } } }))
  const num = (v: number | null | undefined) => (v === null || v === undefined ? "" : String(v))
  const save = async () => {
    setBusy(true)
    setError(null)
    try {
      const r = await adminApi.saveSiteSettings(data)
      setData({ contact: r.overrides.contact || {}, plans: r.overrides.plans || {}, updated_at: r.overrides.updated_at })
      setDone(true)
      setTimeout(() => setDone(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible")
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">Paramètres du site</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-ink" aria-label="Fermer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Appliqué sur printios.ma dans la minute qui suit (pages régénérées toutes les 60 s) et transmis à l&apos;assistant IA. Laisser un champ vide pour revenir à la valeur par défaut.
          {data.updated_at && <> Dernière modification : {fmtTime(data.updated_at)}.</>}
        </p>

        <h3 className="mt-4 text-sm font-semibold text-ink">Coordonnées</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="label text-xs">Téléphone affiché
            <input value={data.contact.phone || ""} onChange={(e) => setContact("phone", e.target.value)} className="input mt-1 !py-1.5 text-xs" placeholder="+212 661-327865" dir="ltr" />
          </label>
          <label className="label text-xs">WhatsApp (international, sans +)
            <input value={data.contact.whatsapp || ""} onChange={(e) => setContact("whatsapp", e.target.value)} className="input mt-1 !py-1.5 text-xs" placeholder="212661327865" dir="ltr" />
          </label>
          <label className="label text-xs">Horaires
            <input value={data.contact.hours || ""} onChange={(e) => setContact("hours", e.target.value)} className="input mt-1 !py-1.5 text-xs" placeholder="Lun–Ven 9h–18h, Sam 9h–13h" />
          </label>
          <label className="label text-xs">E-mail commercial
            <input value={data.contact.email || ""} onChange={(e) => setContact("email", e.target.value)} className="input mt-1 !py-1.5 text-xs" placeholder="commercial@printios.ma" dir="ltr" />
          </label>
        </div>

        <h3 className="mt-5 text-sm font-semibold text-ink">Forfaits (DH HT par mois)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-start text-[11px] uppercase tracking-wide text-slate-500">
                <th className="py-1 pe-2 text-start">Forfait</th>
                <th className="py-1 pe-2 text-start">Mensuel</th>
                <th className="py-1 pe-2 text-start">Annuel (par mois)</th>
                <th className="py-1 pe-2 text-start">Prix barré mensuel</th>
                <th className="py-1 pe-2 text-start">Prix barré annuel</th>
                <th className="py-1 text-start">Pastille promo</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(PLAN_LABELS).map((code) => (
                <tr key={code} className="border-t border-slate-100">
                  <td className="py-1.5 pe-2 font-medium text-ink">
                    {PLAN_LABELS[code]}
                    {defaults[code] && <span className="block text-[10px] font-normal text-slate-400">défaut {defaults[code].monthly} / {defaults[code].yearly}</span>}
                  </td>
                  {(["monthly", "yearly_monthly", "list_monthly", "list_yearly_monthly"] as const).map((k) => (
                    <td key={k} className="py-1.5 pe-2">
                      <input type="number" min={0} value={num(data.plans[code]?.[k])} onChange={(e) => setPlan(code, k, e.target.value)} className="input !w-24 !py-1 text-xs" />
                    </td>
                  ))}
                  <td className="py-1.5">
                    <input value={data.plans[code]?.promo_label || ""} onChange={(e) => setPlan(code, "promo_label", e.target.value)} className="input !w-36 !py-1 text-xs" placeholder="Promo de lancement" maxLength={60} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">Le prix barré ne s&apos;affiche que s&apos;il est supérieur au prix payé. Business garde son préfixe « À partir de ».</p>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary !py-2">Fermer</button>
          <button type="button" onClick={save} disabled={busy} className="btn-primary !py-2">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : done ? "Enregistré" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  )
}
