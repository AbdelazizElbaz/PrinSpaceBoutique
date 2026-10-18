// Client HTTP du chat en direct et de la console admin (voir API/app/Http/Controllers/ChatController,
// VisitorController, Admin/*). Même base d'URL que lib/api.ts (`/api` derrière nginx en production,
// NEXT_PUBLIC_API_URL en développement). Tous les appels partent du navigateur.

const BASE = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/+$/, "")

export const GUEST_TOKEN_KEY = "printios-chat-guest-token"
export const GUEST_NAME_KEY = "printios-chat-guest-name"
export const GUEST_PHONE_KEY = "printios-chat-guest-phone"
export const VIEWED_PAGES_KEY = "printios-viewed-pages"
export const ADMIN_TOKEN_KEY = "printios-admin-token"
// Posé par la console admin dans ce navigateur : ses propres visites ne comptent pas comme des visiteurs.
export const ADMIN_HINT_KEY = "printios-admin-hint"

export type ChatMessage = { id: number; sender: "visitor" | "admin"; body: string; created_at: string; read_at?: string | null }

export class ChatApiError extends Error {
  status: number
  errors?: Record<string, string[]>
  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

async function request<T>(path: string, init?: RequestInit & { token?: string | null }): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json", ...((init?.headers as Record<string, string>) || {}) }
  if (init?.body) headers["Content-Type"] = "application/json"
  if (init?.token) headers.Authorization = `Bearer ${init.token}`
  const res = await fetch(`${BASE}${path}`, { ...init, headers, cache: "no-store" })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) throw new ChatApiError(data?.message || `Erreur ${res.status}`, res.status, data?.errors)
  return data as T
}

/** Jeton opaque du visiteur, généré une fois par navigateur (localStorage). */
export function getGuestToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    let token = window.localStorage.getItem(GUEST_TOKEN_KEY)
    if (!token) {
      token = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `g-${Date.now()}-${Math.random().toString(36).slice(2)}`
      window.localStorage.setItem(GUEST_TOKEN_KEY, token)
    }
    return token
  } catch {
    return null
  }
}

export function hasAdminHint(): boolean {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem(ADMIN_HINT_KEY) === "1"
  } catch {
    return false
  }
}

/** Dernières pages consultées (sessionStorage, 8 max), envoyées avec le heartbeat de présence. */
export function recordViewedPage(path: string): string[] {
  try {
    const raw = window.sessionStorage.getItem(VIEWED_PAGES_KEY)
    const list: string[] = raw ? JSON.parse(raw) : []
    const next = [path, ...list.filter((p) => p !== path)].slice(0, 8)
    window.sessionStorage.setItem(VIEWED_PAGES_KEY, JSON.stringify(next))
    return next
  } catch {
    return [path]
  }
}

export const chatApi = {
  settings: () => request<{ poll_interval_ms: number; welcome_message: string | null }>("/chat/settings"),
  messages: (guestToken: string, since: number, open: boolean) =>
    request<{ conversation_id: number | null; messages: ChatMessage[]; admin_typing: boolean; unread_count: number }>(
      `/chat/messages?guest_token=${encodeURIComponent(guestToken)}&since=${since}${open ? "&open=1" : ""}`
    ),
  send: (payload: { guest_token: string; body: string; guest_name?: string; guest_phone?: string; locale?: string; website?: string }) =>
    request<{ conversation_id: number; message: ChatMessage }>("/chat/messages", { method: "POST", body: JSON.stringify(payload) }),
  guestInfo: (payload: { guest_token: string; guest_name: string; guest_phone: string; locale?: string }) =>
    request<{ ok: true }>("/chat/guest-info", { method: "POST", body: JSON.stringify(payload) }),
  typing: (guestToken: string) => request<{ ok: true }>("/chat/typing", { method: "POST", body: JSON.stringify({ guest_token: guestToken }) }),
  heartbeat: (payload: { guest_token: string; current_path: string; referrer?: string; locale: string; viewed_pages: string[]; is_staff_hint: boolean }) =>
    request<{ ok: true }>("/visitors/heartbeat", { method: "POST", body: JSON.stringify(payload) }),
  /** sendBeacon : survit à la fermeture de l'onglet (pas d'en-têtes possibles, identité dans le corps). */
  offline: (guestToken: string, isStaff: boolean) => {
    try {
      navigator.sendBeacon(`${BASE}/visitors/offline`, new Blob([JSON.stringify({ guest_token: guestToken, is_staff_hint: isStaff })], { type: "application/json" }))
    } catch {
      /* ignoré */
    }
  },
}

export type AdminConversation = {
  id: number
  display_name: string
  guest_phone: string | null
  locale: string | null
  country: string | null
  city: string | null
  online: boolean
  current_path: string | null
  last_message: string | null
  last_message_sender: "visitor" | "admin" | null
  last_message_at: string | null
  unread_count: number
  visitor_typing: boolean
  archived_at: string | null
}

export type AdminVisitor = {
  id: number
  display_name: string
  conversation_id: number | null
  current_path: string | null
  referrer: string | null
  locale: string | null
  city: string | null
  country: string | null
  country_code: string | null
  ip_address: string | null
  geo_error: string | null
  viewed_pages: string[]
  user_agent: string | null
  first_seen_at: string | null
  last_seen_at: string | null
}

export type AdminThread = {
  conversation: { id: number; display_name: string; guest_name: string | null; guest_phone: string | null; locale: string | null; archived_at: string | null; created_at: string }
  messages: ChatMessage[]
  visitor_typing: boolean
  visitor: {
    online: boolean
    last_seen_at: string | null
    first_seen_at: string | null
    current_path: string | null
    referrer: string | null
    viewed_pages: string[]
    user_agent: string | null
    city: string | null
    country: string | null
    country_code: string | null
    ip_address: string | null
    geo_error: string | null
    xff_header: string | null
  }
}

export type CannedResponse = { id: number; title: string; body: string }

const t = () => (typeof window === "undefined" ? null : window.localStorage.getItem(ADMIN_TOKEN_KEY))

export const adminApi = {
  login: (password: string) => request<{ token: string; expires_at: string }>("/admin/auth/login", { method: "POST", body: JSON.stringify({ password }) }),
  me: () => request<{ ok: true }>("/admin/auth/me", { token: t() }),
  logout: () => request<{ ok: true }>("/admin/auth/logout", { method: "POST", token: t() }),
  stats: () => request<{ unread: number; online: number }>("/admin/chat/stats", { token: t() }),
  conversations: (archived: boolean) => request<AdminConversation[]>(`/admin/chat/conversations?archived=${archived ? 1 : 0}`, { token: t() }),
  thread: (id: number, since = 0) => request<AdminThread>(`/admin/chat/conversations/${id}?since=${since}`, { token: t() }),
  reply: (id: number, body: string) => request<{ message: ChatMessage }>(`/admin/chat/conversations/${id}/messages`, { method: "POST", body: JSON.stringify({ body }), token: t() }),
  typing: (id: number) => request<{ ok: true }>(`/admin/chat/conversations/${id}/typing`, { method: "POST", token: t() }),
  archive: (id: number) => request<{ archived_at: string }>(`/admin/chat/conversations/${id}/archive`, { method: "POST", token: t() }),
  unarchive: (id: number) => request<{ archived_at: null }>(`/admin/chat/conversations/${id}/unarchive`, { method: "POST", token: t() }),
  remove: (id: number) => request<{ ok: true }>(`/admin/chat/conversations/${id}`, { method: "DELETE", token: t() }),
  visitors: () => request<AdminVisitor[]>("/admin/visitors", { token: t() }),
  startChat: (sessionId: number) => request<{ conversation_id: number }>(`/admin/visitors/${sessionId}/start-chat`, { method: "POST", token: t() }),
  settings: () => request<{ poll_interval_ms: number; welcome_message: string | null }>("/admin/chat/settings", { token: t() }),
  saveSettings: (payload: { poll_interval_ms?: number; welcome_message?: string | null }) =>
    request<{ poll_interval_ms: number; welcome_message: string | null }>("/admin/chat/settings", { method: "POST", body: JSON.stringify(payload), token: t() }),
  canned: () => request<CannedResponse[]>("/admin/canned-responses", { token: t() }),
  addCanned: (payload: { title: string; body: string }) => request<CannedResponse>("/admin/canned-responses", { method: "POST", body: JSON.stringify(payload), token: t() }),
  removeCanned: (id: number) => request<{ ok: true }>(`/admin/canned-responses/${id}`, { method: "DELETE", token: t() }),
}

/** Deux bips courts (Web Audio, sans fichier) à l'arrivée d'un message — silencieux si le navigateur refuse. */
export function playNotificationSound() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    ;[880, 1108].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.value = freq
      gain.gain.value = 0.08
      osc.connect(gain)
      gain.connect(ctx.destination)
      const start = ctx.currentTime + i * 0.14
      osc.start(start)
      osc.stop(start + 0.12)
    })
  } catch {
    /* ignoré */
  }
}

/** Préfixe « (n) » dans le titre de l'onglet tant qu'il reste des messages non lus. */
export function setNotificationTitle(count: number) {
  if (typeof document === "undefined") return
  const base = document.title.replace(/^\(\d+\)\s*/, "")
  document.title = count > 0 ? `(${count}) ${base}` : base
}
