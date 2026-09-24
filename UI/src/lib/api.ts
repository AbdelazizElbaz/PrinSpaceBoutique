// Client HTTP minimal vers l'API boutique (dossier API/, Laravel).
// Toutes les routes sont publiques (pas d'auth) et limitées en débit côté serveur.

const BASE = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/+$/, "")

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

  // Demande d'essai gratuit (traitée à la main : l'équipe crée l'espace et envoie les accès)
  signup: (payload: {
    plan: string
    billing: "monthly" | "yearly"
    company: string
    admin_name: string
    email: string
    phone: string
    city?: string
    message?: string
    locale: string
    accept_terms: boolean
  }) => request<{ ok: true; signup_id: string }>("/signup", { method: "POST", body: JSON.stringify(payload) }),

  plans: () => request<{ plans: { code: string; name: string; monthly: number; yearly: number }[] }>("/plans"),
}
