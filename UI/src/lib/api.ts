// Client HTTP minimal vers l'API boutique (dossier API/, Laravel).
// Toutes les routes sont publiques (pas d'auth) et limitées en débit côté serveur.

const BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8100/api").replace(/\/+$/, "")

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>
  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { Accept: "application/json", "Content-Type": "application/json", ...(init?.headers || {}) },
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    throw new ApiError(data?.message || `Erreur ${res.status}`, res.status, data?.errors)
  }
  return data as T
}

export type LeadPayload = {
  type: "demo" | "contact" | "business"
  name: string
  company?: string
  email: string
  phone?: string
  city?: string
  size?: string
  message?: string
  plan?: string
}

export const api = {
  lead: (payload: LeadPayload) => request<{ ok: true; id: number }>("/leads", { method: "POST", body: JSON.stringify(payload) }),

  checkSlug: (slug: string) => request<{ available: boolean; slug: string; reason?: string }>(`/signup/check-slug?slug=${encodeURIComponent(slug)}`),

  signup: (payload: {
    plan: string
    billing: "monthly" | "yearly"
    company: string
    slug: string
    admin_name: string
    email: string
    phone: string
    password: string
    accept_terms: boolean
  }) => request<{ ok: true; signup_id: string }>("/signup", { method: "POST", body: JSON.stringify(payload) }),

  signupStatus: (id: string) =>
    request<{
      status: "pending" | "provisioning" | "active" | "failed"
      progress: number
      step: string | null
      steps: { key: string; label: string; status: "pending" | "running" | "done" | "failed"; message?: string }[]
      app_url?: string
      error?: string
    }>(`/signup/${encodeURIComponent(id)}/status`),

  plans: () => request<{ plans: { code: string; name: string; monthly: number; yearly: number }[] }>("/plans"),
}
