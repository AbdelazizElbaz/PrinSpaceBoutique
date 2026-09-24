"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { AlertTriangle, Check, CheckCircle2, Circle, Loader2, MessageCircle } from "lucide-react"
import type { Plan } from "@/content/types"
import { site, money } from "@/content/site.config"
import { api, ApiError } from "@/lib/api"
import { getDict, localePath, type Locale } from "@/i18n"

// Parcours « Essai gratuit » : 1) choix du forfait, 2) contact — WhatsApp en
// premier (message pré-rempli), ou formulaire court qui crée une demande côté
// API (SignupController::store) traitée à la main par l'équipe.
export function SignupWizard({ locale, plans }: { locale: Locale; plans: Plan[] }) {
  const t = getDict(locale)
  const lp = (p: string) => localePath(locale, p)
  const params = useSearchParams()
  const [step, setStep] = useState<1 | 2>(1)
  const [plan, setPlan] = useState(params.get("plan") && plans.some((p) => p.code === params.get("plan")) ? params.get("plan")! : "pro")
  const [billing, setBilling] = useState<"monthly" | "yearly">(params.get("billing") === "yearly" ? "yearly" : "monthly")
  const [company, setCompany] = useState("")
  const [adminName, setAdminName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [message, setMessage] = useState("")
  const [accept, setAccept] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const selected = useMemo(() => plans.find((p) => p.code === plan)!, [plan, plans])
  const billingLabel = billing === "yearly" ? t.pricing.yearly : t.pricing.monthly
  const whatsappUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(t.signup.whatsappMsg(site.brand, selected.name, billingLabel))}`

  async function submit() {
    setError("")
    setFieldErrors({})
    if (!accept) {
      setError(t.signup.acceptErr)
      return
    }
    setSending(true)
    try {
      await api.signup({ plan, billing, company, admin_name: adminName, email, phone, city: city || undefined, message: message || undefined, locale, accept_terms: accept })
      setSent(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(err.errors || {})
      } else setError(t.signup.sendErr)
    } finally {
      setSending(false)
    }
  }

  const Err = ({ k }: { k: string }) => (fieldErrors[k] ? <p className="mt-1 text-xs text-red-600">{fieldErrors[k][0]}</p> : null)

  if (sent)
    return (
      <div className="card mx-auto max-w-2xl text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
        <h1 className="mt-4 text-2xl font-bold text-ink">{t.signup.sentTitle}</h1>
        <p className="mt-2 text-sm text-slate-600">{t.signup.sentText(email)}</p>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-secondary mt-6">
          <MessageCircle className="h-4 w-4" /> {t.signup.sentWhatsapp}
        </a>
        <p className="mt-4 text-xs text-slate-500">
          {t.signup.nextStep}{" "}
          <Link href={`${lp("/formation")}#demarrer`} className="font-semibold text-brand-700 underline">
            {t.signup.nextStepLink}
          </Link>
        </p>
      </div>
    )

  return (
    <div className="mx-auto max-w-4xl">
      <ol className="mb-10 flex items-center justify-center gap-4 text-sm">
        {t.signup.steps.map((l, i) => {
          const n = (i + 1) as 1 | 2
          const done = step > n
          return (
            <li key={l} className="flex items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step === n ? "bg-brand-600 text-white" : done ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                {done ? <Check className="h-4 w-4" /> : n}
              </span>
              <span className={step === n ? "font-semibold text-ink" : "text-slate-500"}>{l}</span>
              {i < t.signup.steps.length - 1 && <span className="mx-2 h-px w-8 bg-slate-300" />}
            </li>
          )
        })}
      </ol>

      {step === 1 && (
        <div>
          <h1 className="h2 text-center">{t.signup.choosePlan}</h1>
          <p className="lead mt-3 text-center">{t.signup.chooseLead(site.trialDays)}</p>
          <div className="mt-6 flex items-center justify-center gap-3 text-sm">
            <button onClick={() => setBilling("monthly")} className={`rounded-full px-4 py-1.5 ring-1 ${billing === "monthly" ? "bg-brand-600 text-white ring-brand-600" : "ring-slate-300"}`}>
              {t.signup.monthly}
            </button>
            <button onClick={() => setBilling("yearly")} className={`rounded-full px-4 py-1.5 ring-1 ${billing === "yearly" ? "bg-brand-600 text-white ring-brand-600" : "ring-slate-300"}`}>
              {t.signup.yearly}
            </button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {plans.map((p) => (
              <button key={p.code} type="button" onClick={() => setPlan(p.code)} className={`card text-start transition ${plan === p.code ? "border-brand-500 ring-2 ring-brand-500" : "hover:border-slate-300"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-ink">{p.name}</span>
                  {plan === p.code ? <CheckCircle2 className="h-5 w-5 text-brand-600" /> : <Circle className="h-5 w-5 text-slate-300" />}
                </div>
                <p className="mt-2 text-2xl font-bold text-ink">
                  {money(billing === "yearly" ? p.yearlyMonthly : p.monthly, locale)} <span className="text-xs font-normal text-slate-500">{t.common.perMonthHT}</span>
                </p>
                <ul className="mt-3 space-y-1 text-xs text-slate-600">
                  {p.limits.slice(0, 3).map((l) => (
                    <li key={l.label}>
                      {l.label} : <span className="font-medium text-slate-800">{l.value}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <button className="btn-primary" onClick={() => setStep(2)}>
              {t.signup.continueWith(selected.name)}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            {/* WhatsApp en premier */}
            <div className="card border-emerald-200 bg-emerald-50/60">
              <h1 className="text-2xl font-bold text-ink">{t.signup.contactTitle}</h1>
              <p className="mt-2 text-sm text-slate-600">{t.signup.contactLead}</p>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn mt-5 w-full bg-[#25D366] text-white hover:bg-[#1ebe5d] sm:w-auto">
                <MessageCircle className="h-5 w-5" /> {t.signup.whatsappCta}
              </a>
              <p className="mt-2 text-xs text-slate-500">{t.signup.whatsappHint}</p>
            </div>

            {/* Formulaire de secours */}
            <div className="card">
              <p className="text-sm font-semibold text-slate-700">{t.signup.or}</p>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label">{t.signup.company}</label>
                  <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder={t.signup.companyPh} />
                  <Err k="company" />
                </div>
                <div>
                  <label className="label">{t.signup.adminName}</label>
                  <input className="input" value={adminName} onChange={(e) => setAdminName(e.target.value)} autoComplete="name" />
                  <Err k="admin_name" />
                </div>
                <div>
                  <label className="label">{t.signup.phone}</label>
                  <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="06 …" dir="ltr" />
                  <Err k="phone" />
                </div>
                <div>
                  <label className="label">{t.signup.email}</label>
                  <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" dir="ltr" />
                  <Err k="email" />
                </div>
                <div>
                  <label className="label">{t.signup.city}</label>
                  <input className="input" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">{t.signup.message}</label>
                  <textarea className="input" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.signup.messagePh} />
                </div>
              </div>
              <label className="mt-5 flex items-start gap-3 text-sm text-slate-700">
                <input type="checkbox" className="mt-1" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
                <span>
                  {t.signup.acceptA}{" "}
                  <Link href={lp("/cgv")} target="_blank" className="font-semibold text-brand-700 underline">
                    {t.signup.terms}
                  </Link>{" "}
                  {t.signup.acceptB}{" "}
                  <Link href={lp("/confidentialite")} target="_blank" className="font-semibold text-brand-700 underline">
                    {t.signup.privacy}
                  </Link>
                  .
                </span>
              </label>
              {error && (
                <p className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                </p>
              )}
              <div className="mt-5 flex items-center justify-between">
                <button className="btn-ghost" onClick={() => setStep(1)}>
                  {t.signup.back}
                </button>
                <button className="btn-primary" onClick={submit} disabled={sending}>
                  {sending && <Loader2 className="h-4 w-4 animate-spin" />} {t.signup.send}
                </button>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-2">
            <div className="card sticky top-24">
              <p className="eyebrow">{t.signup.summary}</p>
              <p className="mt-2 text-lg font-bold text-ink">{t.signup.plan(selected.name, billing === "yearly")}</p>
              <p className="text-sm text-slate-600">{t.signup.afterTrial(money(billing === "yearly" ? selected.yearlyMonthly : selected.monthly, locale))}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {t.signup.summaryBullets(site.trialDays).map((x) => (
                  <li key={x} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
