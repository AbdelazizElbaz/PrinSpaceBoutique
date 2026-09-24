"use client"

import { useSearchParams } from "next/navigation"
import { useState, type FormEvent } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { api, ApiError } from "@/lib/api"
import { getDict, type Locale } from "@/i18n"

const types: Record<string, "demo" | "contact" | "business"> = { demo: "demo", business: "business", formation: "contact", contact: "contact" }

export function ContactForm({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const params = useSearchParams()
  const initial = params.get("sujet") && types[params.get("sujet")!] ? params.get("sujet")! : "demo"
  const [subject, setSubject] = useState(initial)
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (fd.get("website")) return
    setState("sending")
    setError("")
    setFieldErrors({})
    try {
      await api.lead({
        type: types[subject],
        name: String(fd.get("name") || ""),
        company: String(fd.get("company") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        city: String(fd.get("city") || ""),
        size: String(fd.get("size") || ""),
        message: `[${t.contact.subjects[subject as keyof typeof t.contact.subjects]}] [${locale}] ${String(fd.get("message") || "")}`,
      })
      setState("done")
    } catch (err) {
      setState("error")
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(err.errors || {})
      } else setError(t.contact.error)
    }
  }

  if (state === "done")
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        <h3 className="mt-4 text-lg font-semibold text-ink">{t.contact.sent}</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">{t.contact.sentText}</p>
      </div>
    )

  const Err = ({ k }: { k: string }) => (fieldErrors[k] ? <p className="mt-1 text-xs text-red-600">{fieldErrors[k][0]}</p> : null)

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label className="label" htmlFor="subject">{t.contact.subject}</label>
        <select id="subject" className="input" value={subject} onChange={(e) => setSubject(e.target.value)}>
          {Object.entries(t.contact.subjects).map(([k, s]) => (
            <option key={k} value={k}>{s}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">{t.contact.name}</label>
          <input id="name" name="name" className="input" required autoComplete="name" />
          <Err k="name" />
        </div>
        <div>
          <label className="label" htmlFor="company">{t.contact.company}</label>
          <input id="company" name="company" className="input" autoComplete="organization" />
        </div>
        <div>
          <label className="label" htmlFor="email">{t.contact.emailField}</label>
          <input id="email" name="email" type="email" className="input" required autoComplete="email" dir="ltr" />
          <Err k="email" />
        </div>
        <div>
          <label className="label" htmlFor="phone">{t.contact.phoneField}</label>
          <input id="phone" name="phone" className="input" autoComplete="tel" placeholder="06 …" dir="ltr" />
          <Err k="phone" />
        </div>
        <div>
          <label className="label" htmlFor="city">{t.contact.city}</label>
          <input id="city" name="city" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="size">{t.contact.size}</label>
          <select id="size" name="size" className="input" defaultValue="">
            <option value="">—</option>
            {t.contact.sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">{t.contact.message}</label>
        <textarea id="message" name="message" rows={4} className="input" placeholder={t.contact.messagePh} />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button className="btn-primary w-full sm:w-auto" disabled={state === "sending"}>
        {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />} {t.contact.send}
      </button>
      <p className="text-xs text-slate-500">{t.contact.consent}</p>
    </form>
  )
}
