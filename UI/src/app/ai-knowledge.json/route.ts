import { NextResponse } from "next/server"
import { site } from "@/content/site.config"
import { getContent } from "@/content"
import { getDict } from "@/i18n"

// Base de connaissances de l'assistant IA du chat (demande utilisateur du 19/10/2026 : « comment donner les
// informations de mon site à l'IA pour répondre aux clients »). Tout le contenu public du site, aplati en
// sections de texte, servi en JSON : l'API Laravel le récupère (App\Support\ChatAi::knowledge), le met en cache
// 24 h et l'ajoute aux instructions du modèle. Le chemin porte une extension (.json) pour ne pas passer par le
// middleware de langue ; il est généré au build et reste à jour avec le contenu du site.

export const dynamic = "force-static"

type Section = { title: string; text: string }

// Aplatit n'importe quelle valeur du contenu (chaînes, tableaux, objets, fonctions ignorées) en texte lisible.
function flatten(value: unknown, depth = 0): string {
  if (value === null || value === undefined || typeof value === "function" || typeof value === "boolean") return ""
  if (typeof value === "string" || typeof value === "number") return String(value)
  if (Array.isArray(value)) return value.map((v) => flatten(v, depth + 1)).filter(Boolean).join(depth === 0 ? "\n" : " · ")
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([k]) => !["id", "slug", "icon", "color", "mockup", "youtubeId", "code", "highlight", "track"].includes(k))
      .map(([, v]) => flatten(v, depth + 1))
      .filter(Boolean)
      .join(" — ")
  }
  return ""
}

export function GET() {
  const t = getDict("fr")
  const c = getContent("fr")
  const sections: Section[] = []

  sections.push({
    title: "Présentation",
    text: [
      `${site.brand} — ${site.tagline}. Site : ${site.url}. Espaces clients : <atelier>.${site.appDomain}.`,
      `${t.meta.title}. ${t.meta.description}`,
      `Essai gratuit ${site.trialDays} jours, sans carte bancaire. Démo en ligne sans inscription : ${site.demoUrl}.`,
      `Contact : téléphone ${site.contact.phone}, WhatsApp https://wa.me/${site.contact.whatsapp}, horaires ${site.contact.hours}.`,
      `Agent d'atelier : ${site.agentName}.`,
    ].join("\n"),
  })
  sections.push({ title: "Pourquoi PrintIOS", text: [t.home.whyLead, flatten(t.home.whyCards), t.home.codLead, flatten(t.home.codBullets), t.home.agentLead(site.agentName)].join("\n") })
  sections.push({ title: "Fonctionnalités", text: c.features.map((f) => `${f.title} : ${f.short} ${f.description} Points clés : ${f.bullets.join(" ; ")}`).join("\n") })
  sections.push({
    title: "Tarifs (DH HT par mois, facturés au Maroc)",
    text: c.plans
      .map((p) => {
        const prix = `${p.pricePrefix ? p.pricePrefix + " " : ""}${p.monthly} DH/mois en mensuel (${p.yearlyMonthly} DH/mois en annuel)${p.listMonthly ? `, prix normal ${p.listMonthly} DH` : ""}${p.promoLabel ? ` (${p.promoLabel})` : ""}`
        return `${p.name} — ${p.audience} ${p.description} Prix : ${prix}. Limites : ${p.limits.map((l) => `${l.label} ${l.value}${l.note ? " (" + l.note + ")" : ""}`).join(", ")}. Inclus : ${p.includes.join(", ")}.${p.extras?.length ? " Options : " + p.extras.join(", ") + "." : ""}`
      })
      .join("\n"),
  })
  sections.push({ title: "Comparatif des forfaits", text: flatten(c.comparison) })
  sections.push({ title: "Mise en route", text: flatten(c.steps) })
  sections.push({ title: "Pour qui", text: flatten(c.audiences) })
  sections.push({ title: "FAQ", text: c.faq.map((g) => `${g.title}\n` + g.items.map((i) => `Q : ${i.q}\nR : ${i.a}`).join("\n")).join("\n") })
  sections.push({ title: `${site.agentName} (agent d'atelier)`, text: [t.agent.lead(site.agentName), flatten(t.agent.os), flatten(t.agent.points)].join("\n") })
  sections.push({ title: "Formation vidéo", text: c.videos.map((v) => `${v.title} (${v.duration}) : ${v.summary}`).join("\n") })
  sections.push({ title: "Transporteurs", text: "Intégrés nativement : Ameex, Olivraison, Ozone Express, Sendit (création du colis, bordereau, étiquettes, statuts et COD automatiques). Livreurs internes gérés dans la même application : espace livreur mobile, ramassage, ticket de livraison, suivi et encaissement COD." })

  return NextResponse.json(
    { brand: site.brand, locale: "fr", generated_at: new Date().toISOString(), sections },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  )
}
