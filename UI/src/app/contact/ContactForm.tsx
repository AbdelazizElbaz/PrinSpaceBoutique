"use client"

import { useSearchParams } from "next/navigation"
import { useState, type FormEvent } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { api, ApiError } from "@/lib/api"

const subjects: Record<string, { type: "demo" | "contact" | "business"; label: string }> = {
  demo: { type: "demo", label: "Demander une démo" },
  business: { type: "business", label: "Forfait Business / instance dédiée" },
  formation: { type: "contact", label: "Formation sur mesure" },
  contact: { type: "contact", label: "Autre question" },
}

export function ContactForm() {
  const params = useSearchParams()
  const initial = params.get("sujet") && subjects[params.get("sujet")!] ? params.get("sujet")! : "demo"
  const [subject, setSubject] = useState(initial)
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [error, setError] = useState<string>("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (fd.get("website")) return // honeypot
    setState("sending")
    setError("")
    setFieldErrors({})
    try {
      await api.lead({
        type: subjects[subject].type,
        name: String(fd.get("name") || ""),
        company: String(fd.get("company") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        city: String(fd.get("city") || ""),
        size: String(fd.get("size") || ""),
        message: `[${subjects[subject].label}] ${String(fd.get("message") || "")}`,
      })
      setState("done")
    } catch (err) {
      setState("error")
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(err.errors || {})
      } else setError("Impossible d'envoyer le message pour le moment. Écrivez-nous directement par e-mail ou WhatsApp.")
    }
  }

  if (state === "done")
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        <h3 className="mt-4 text-lg font-semibold text-ink">Message envoyé</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">Merci ! Un conseiller vous recontacte dans la journée ouvrée pour fixer un créneau.</p>
      </div>
    )

  const Err = ({ k }: { k: string }) => (fieldErrors[k] ? <p className="mt-1 text-xs text-red-600">{fieldErrors[k][0]}</p> : null)

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label className="label" htmlFor="subject">
          Sujet
        </label>
        <select id="subject" className="input" value={subject} onChange={(e) => setSubject(e.target.value)}>
          {Object.entries(subjects).map(([k, s]) => (
            <option key={k} value={k}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Votre nom *
          </label>
          <input id="name" name="name" className="input" required autoComplete="name" />
          <Err k="name" />
        </div>
        <div>
          <label className="label" htmlFor="company">
            Atelier / société
          </label>
          <input id="company" name="company" className="input" autoComplete="organization" />
        </div>
        <div>
          <label className="label" htmlFor="email">
            E-mail *
          </label>
          <input id="email" name="email" type="email" className="input" required autoComplete="email" />
          <Err k="email" />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Téléphone / WhatsApp
          </label>
          <input id="phone" name="phone" className="input" autoComplete="tel" placeholder="06 …" />
          <Err k="phone" />
        </div>
        <div>
          <label className="label" htmlFor="city">
            Ville
          </label>
          <input id="city" name="city" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="size">
            Taille de l&apos;atelier
          </label>
          <select id="size" name="size" className="input" defaultValue="">
            <option value="">—</option>
            <option>1 à 3 personnes</option>
            <option>4 à 10 personnes</option>
            <option>11 à 30 personnes</option>
            <option>Plus de 30 / plusieurs sites</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">
          Votre message
        </label>
        <textarea id="message" name="message" rows={4} className="input" placeholder="Votre organisation actuelle, vos transporteurs, ce que vous voulez améliorer…" />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button className="btn-primary w-full sm:w-auto" disabled={state === "sending"}>
        {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />} Envoyer
      </button>
      <p className="text-xs text-slate-500">En envoyant ce formulaire, vous acceptez d&apos;être recontacté au sujet de votre demande. Aucune newsletter sans votre accord.</p>
    </form>
  )
}
