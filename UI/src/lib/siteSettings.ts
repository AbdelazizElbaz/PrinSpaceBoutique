// Réglages du site modifiables depuis la console admin (prix des forfaits, téléphone, WhatsApp, horaires,
// e-mail) — demande utilisateur du 19/10/2026. Source : API GET /site-settings (App\Support\SiteOverrides).
// Les pages sont statiques (ISR) : `getSiteSettings()` relit l'API au plus toutes les 60 s côté serveur, et les
// valeurs sont appliquées PAR-DESSUS celles du code (site.config.ts, content/*/plans.ts), qui restent les
// valeurs par défaut. Les composants client reçoivent le résultat via SiteSettingsProvider.

import { site } from "@/content/site.config"
import type { Content, Plan } from "@/content/types"

export type PlanOverride = { monthly?: number; yearly_monthly?: number; list_monthly?: number; list_yearly_monthly?: number; promo_label?: string }
export type SiteOverrides = { contact: { phone?: string; whatsapp?: string; hours?: string; email?: string }; plans: Partial<Record<Plan["code"], PlanOverride>>; updated_at?: string | null }

export type SiteSettings = {
  contact: { phone: string; whatsapp: string; hours: string; email: string }
  plans: Partial<Record<Plan["code"], PlanOverride>>
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contact: { phone: site.contact.phone, whatsapp: site.contact.whatsapp, hours: site.contact.hours, email: site.contact.salesEmail },
  plans: {},
}

/** « +212 661-327865 » / « 0661 32 78 65 » / « 00212… » → « 212661327865 » (format wa.me, indicatif Maroc par défaut). */
export function whatsappFromPhone(phone: string): string {
  const digits = phone.replace(/\D+/g, "")
  if (digits.startsWith("00")) return digits.slice(2)
  if (digits.startsWith("0")) return `212${digits.slice(1)}`
  return digits
}

export function mergeSettings(o: SiteOverrides | null | undefined): SiteSettings {
  if (!o) return DEFAULT_SITE_SETTINGS
  // WhatsApp vide = même numéro que le téléphone réglé (un seul champ change les deux, voir SiteOverrides côté API).
  const phone = o.contact?.phone || DEFAULT_SITE_SETTINGS.contact.phone
  const whatsapp = o.contact?.whatsapp || (o.contact?.phone ? whatsappFromPhone(o.contact.phone) : "") || DEFAULT_SITE_SETTINGS.contact.whatsapp
  return {
    contact: {
      phone,
      whatsapp: whatsapp.replace(/\D+/g, ""),
      hours: o.contact?.hours || DEFAULT_SITE_SETTINGS.contact.hours,
      email: o.contact?.email || DEFAULT_SITE_SETTINGS.contact.email,
    },
    plans: o.plans || {},
  }
}

// URL interne de l'API vue depuis le serveur Next.js : dans le conteneur de production, nginx écoute sur 8080 et
// sert /api ; en développement, l'API Laravel tourne sur 8100.
const INTERNAL_API = (process.env.SITE_API_INTERNAL_URL || (process.env.NODE_ENV === "production" ? "http://127.0.0.1:8080/api" : "http://localhost:8100/api")).replace(/\/+$/, "")

/** Côté serveur uniquement. Jamais d'exception : sans API (build Docker, panne), les valeurs par défaut s'appliquent. */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${INTERNAL_API}/site-settings`, { next: { revalidate: 60 }, headers: { Accept: "application/json" } })
    if (!res.ok) return DEFAULT_SITE_SETTINGS
    return mergeSettings((await res.json()) as SiteOverrides)
  } catch {
    return DEFAULT_SITE_SETTINGS
  }
}

export const waLink = (s: SiteSettings, text: string) => `https://wa.me/${s.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`
export const telHref = (s: SiteSettings) => `tel:${s.contact.phone.replace(/[^+\d]/g, "")}`

/** Forfaits avec les prix surchargés (un champ absent ou vide = valeur du code). */
export function applyPlans(plans: Plan[], s: SiteSettings): Plan[] {
  return plans.map((p) => {
    const o = s.plans[p.code]
    if (!o) return p
    return {
      ...p,
      monthly: o.monthly ?? p.monthly,
      yearlyMonthly: o.yearly_monthly ?? p.yearlyMonthly,
      listMonthly: o.list_monthly ?? p.listMonthly,
      listYearlyMonthly: o.list_yearly_monthly ?? p.listYearlyMonthly,
      promoLabel: o.promo_label ?? p.promoLabel,
    }
  })
}

// Les textes de la FAQ et des pages légales embarquent le téléphone / les horaires du code : on remplace ces
// chaînes par les valeurs réglées, sans toucher à la structure.
function deepReplace<T>(value: T, pairs: [string, string][]): T {
  if (typeof value === "string") return pairs.reduce<string>((acc, [from, to]) => (from && from !== to ? acc.split(from).join(to) : acc), value) as T
  if (Array.isArray(value)) return value.map((v) => deepReplace(v, pairs)) as T
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, deepReplace(v, pairs)])) as T
  return value
}

/** Contenu d'une langue avec prix et coordonnées surchargés. */
export function applySettings(content: Content, s: SiteSettings): Content {
  const pairs: [string, string][] = [
    [site.contact.phone, s.contact.phone],
    [site.contact.whatsapp, s.contact.whatsapp],
    [site.contact.hours, s.contact.hours],
    [site.contact.salesEmail, s.contact.email],
    // L'e-mail de contact des pages légales suit aussi le champ « E-mail » de la console.
    [site.contact.email, s.contact.email],
  ]
  const replaced = deepReplace({ faq: content.faq, legal: content.legal }, pairs)
  return { ...content, faq: replaced.faq, legal: replaced.legal, plans: applyPlans(content.plans, s) }
}
