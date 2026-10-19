"use client"

// Chat en direct avec l'équipe PrintIOS — portage du widget de PackSpaceStore (demande utilisateur du
// 18/10/2026 : « reprendre la fonctionnalité de chat dans le site PrintIOS ; quand on ouvre le site, on lui dit
// bonjour dans le chat, il peut répondre »). Visible sur toutes les pages publiques, jamais sur /admin.
//
// Identité : jeton opaque généré par le navigateur (localStorage, voir lib/chatApi.ts), pas de compte.
// Mise à jour par polling (GET /chat/messages?since=) à l'intervalle réglé par l'admin (2 s par défaut).
// Accueil : une bulle « Bonjour 👋 … » (texte réglable dans la console, sinon celui du dictionnaire) ouvre
// le fil ; sur desktop le widget s'ouvre tout seul une fois par session, sur mobile seule la bulle flottante
// et un petit message d'invitation apparaissent pour ne pas gêner la navigation.

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Check, Loader2, MessageCircle, Pencil, Send, X } from "lucide-react"
import { chatApi, getGuestToken, GUEST_NAME_KEY, GUEST_PHONE_KEY, playNotificationSound, setNotificationTitle, type ChatMessage } from "@/lib/chatApi"
import { getDict, isRtl, type Locale } from "@/i18n"
import { site } from "@/content/site.config"

const AUTO_OPEN_KEY = "printios-chat-auto-opened"
const DESKTOP_PX = 1024
const DEFAULT_POLL_MS = 2000

export function ChatWidget({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/"
  const t = getDict(locale).chat
  const rtl = isRtl(locale)

  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [guestToken, setGuestToken] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [contactEditing, setContactEditing] = useState(false)
  const [contactStatus, setContactStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [sending, setSending] = useState(false)
  const [unread, setUnread] = useState(0)
  const [adminTyping, setAdminTyping] = useState(false)
  const [pollMs, setPollMs] = useState(DEFAULT_POLL_MS)
  const [welcome, setWelcome] = useState<string | null>(null)
  const lastIdRef = useRef(0)
  const firstFetchRef = useRef(true)
  const lastTypingRef = useRef(0)
  const listRef = useRef<HTMLDivElement | null>(null)
  const openRef = useRef(open)
  openRef.current = open

  const isAdmin = pathname.includes("/admin")

  // Identité + coordonnées mémorisées.
  useEffect(() => {
    setGuestToken(getGuestToken())
    try {
      setName(window.localStorage.getItem(GUEST_NAME_KEY) || "")
      setPhone(window.localStorage.getItem(GUEST_PHONE_KEY) || "")
    } catch {
      /* ignoré */
    }
  }, [])

  // Réglages (intervalle, message d'accueil) lus une fois.
  useEffect(() => {
    chatApi
      .settings()
      .then((s) => {
        if (s.poll_interval_ms) setPollMs(s.poll_interval_ms)
        if (s.welcome_message) setWelcome(s.welcome_message)
      })
      .catch(() => {})
  }, [])

  // Accueil : ouverture automatique sur desktop (une fois par session), invitation discrète sur mobile.
  useEffect(() => {
    if (isAdmin) return
    let opened = false
    try {
      opened = !!window.sessionStorage.getItem(AUTO_OPEN_KEY)
    } catch {
      opened = false
    }
    if (opened) return
    const id = setTimeout(() => {
      try {
        window.sessionStorage.setItem(AUTO_OPEN_KEY, "1")
      } catch {
        /* ignoré */
      }
      if (window.innerWidth >= DESKTOP_PX) setOpen(true)
      else setTeaser(true)
    }, 4000)
    return () => clearTimeout(id)
  }, [isAdmin])

  const fetchMessages = useCallback(async () => {
    if (!guestToken) return
    try {
      const data = await chatApi.messages(guestToken, lastIdRef.current, openRef.current)
      setAdminTyping(!!data.admin_typing)
      const first = firstFetchRef.current
      firstFetchRef.current = false
      setUnread((prev) => {
        const next = data.unread_count ?? 0
        if (!first && next > prev && !openRef.current) {
          playNotificationSound()
          setTeaser(true)
        }
        setNotificationTitle(openRef.current ? 0 : next)
        return next
      })
      if (data.messages.length) {
        setMessages((prev) => {
          const known = new Set(prev.map((m) => m.id))
          return [...prev, ...data.messages.filter((m) => !known.has(m.id))]
        })
        lastIdRef.current = data.messages[data.messages.length - 1].id
      }
    } catch {
      /* un polling raté n'est pas grave */
    }
  }, [guestToken])

  useEffect(() => {
    if (isAdmin || !guestToken) return
    fetchMessages()
    const id = setInterval(fetchMessages, pollMs)
    return () => clearInterval(id)
  }, [isAdmin, guestToken, fetchMessages, pollMs])

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTeaser(false)
      setNotificationTitle(0)
      const el = listRef.current
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    }
  }, [open, messages, adminTyping])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = draft.trim()
    if (!body || sending || !guestToken) return
    setSending(true)
    try {
      const data = await chatApi.send({ guest_token: guestToken, body, guest_name: name.trim() || undefined, guest_phone: phone.trim() || undefined, locale, website: honeypot || undefined })
      setMessages((prev) => [...prev, data.message])
      lastIdRef.current = Math.max(lastIdRef.current, data.message.id)
      setDraft("")
    } catch {
      /* l'utilisateur peut réessayer */
    } finally {
      setSending(false)
    }
  }

  const ping = () => {
    if (!guestToken || Date.now() - lastTypingRef.current < 2000) return
    lastTypingRef.current = Date.now()
    chatApi.typing(guestToken).catch(() => {})
  }

  const saveContact = async () => {
    if (!guestToken || contactStatus === "saving") return
    setContactStatus("saving")
    try {
      window.localStorage.setItem(GUEST_NAME_KEY, name.trim())
      window.localStorage.setItem(GUEST_PHONE_KEY, phone.trim())
    } catch {
      /* ignoré */
    }
    try {
      await chatApi.guestInfo({ guest_token: guestToken, guest_name: name.trim(), guest_phone: phone.trim(), locale })
      setContactStatus("saved")
      setContactEditing(false)
      setTimeout(() => setContactStatus("idle"), 2000)
    } catch {
      setContactStatus("idle")
    }
  }

  if (isAdmin) return null

  const hasContact = !!(name.trim() || phone.trim())
  const welcomeText = welcome || t.welcome

  return (
    <div className="fixed bottom-5 end-5 z-50 flex flex-col items-end gap-3 print:hidden" dir={rtl ? "rtl" : "ltr"}>
      {open && (
        <div className="flex h-[30rem] w-[22.5rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-ink shadow-2xl" role="dialog" aria-label={t.title}>
          <div className="flex items-center justify-between bg-brand-600 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
                P
                <span className="absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full border-2 border-brand-600 bg-emerald-400" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">{t.title}</p>
                <p className="text-[11px] text-brand-100">{t.subtitle}</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="rounded-lg p-1.5 text-brand-100 transition hover:bg-white/10 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {contactEditing || (!hasContact && messages.length > 0) ? (
            <div className="flex flex-col gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <p className="text-[11px] text-slate-500">{t.contactHint}</p>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-brand-400" />
              <div className="flex items-center gap-2">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phonePlaceholder} className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-brand-400" dir="ltr" />
                <button type="button" onClick={saveContact} disabled={!hasContact || contactStatus === "saving"} className="flex shrink-0 items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700 disabled:opacity-50">
                  {contactStatus === "saving" ? <Loader2 className="h-3 w-3 animate-spin" /> : contactStatus === "saved" ? <Check className="h-3 w-3" /> : null}
                  {contactStatus === "saved" ? t.saved : t.save}
                </button>
              </div>
            </div>
          ) : hasContact ? (
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2">
              <div className="min-w-0 flex-1 text-xs">
                {name.trim() && <p className="truncate font-medium text-ink">{name}</p>}
                {phone.trim() && <p className="truncate text-slate-500" dir="ltr">{phone}</p>}
              </div>
              <button type="button" onClick={() => setContactEditing(true)} aria-label={t.edit} title={t.edit} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-ink">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}

          <div ref={listRef} className="flex-1 overflow-y-auto bg-slate-50/60 px-4 py-3">
            <div className="flex flex-col gap-2">
              <Bubble sender="admin" label={t.team} body={welcomeText} />
              {messages.map((m) => (
                <Bubble key={m.id} sender={m.sender} label={m.sender === "visitor" ? t.you : m.source === "ai" ? t.assistant : t.team} body={m.body} />
              ))}
              {adminTyping && (
                <div className="me-auto flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200" aria-label={t.typing}>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </div>
              )}
              {messages.length === 0 && <p className="mt-2 text-center text-xs text-slate-400">{t.emptyHint}</p>}
            </div>
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
            <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <input
              type="text"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                ping()
              }}
              placeholder={t.placeholder}
              maxLength={2000}
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-brand-400 focus:bg-white"
            />
            <button type="submit" disabled={sending || !draft.trim()} aria-label={t.send} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-50">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className={`h-4 w-4 ${rtl ? "rotate-180" : ""}`} />}
            </button>
          </form>
          <p className="border-t border-slate-100 bg-white px-4 py-1.5 text-center text-[10px] text-slate-400">
            {t.offlineNote}{" "}
            <a href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noreferrer" className="font-medium text-[#128C7E] hover:underline">
              WhatsApp
            </a>
          </p>
        </div>
      )}

      <div className="flex items-center gap-3">
        {!open && teaser && (
          <button type="button" onClick={() => setOpen(true)} className="max-w-[14rem] rounded-2xl rounded-be-sm border border-slate-200 bg-white px-3.5 py-2.5 text-start text-sm text-ink shadow-xl transition hover:border-brand-300">
            {unread > 0 && messages.length > 0 ? t.unread(unread) : t.teaser}
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t.close : t.open}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-2xl shadow-brand-600/40 transition hover:scale-105 hover:bg-brand-700"
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          {!open && unread > 0 && (
            <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">{unread}</span>
          )}
        </button>
      </div>
    </div>
  )
}

function Bubble({ sender, label, body }: { sender: "visitor" | "admin"; label: string; body: string }) {
  const mine = sender === "visitor"
  return (
    <div className={`flex max-w-[85%] flex-col gap-0.5 ${mine ? "ms-auto items-end" : "me-auto items-start"}`}>
      <span className="px-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <div className={`whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${mine ? "rounded-ee-sm bg-brand-600 text-white" : "rounded-es-sm bg-white text-ink shadow-sm ring-1 ring-slate-200"}`}>{body}</div>
    </div>
  )
}
