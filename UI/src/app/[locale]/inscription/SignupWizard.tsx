"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, Check, CheckCircle2, Circle, Loader2, XCircle } from "lucide-react"
import type { Plan } from "@/content/types"
import { site, money } from "@/content/site.config"
import { api, ApiError } from "@/lib/api"
import { getDict, localePath, type Locale } from "@/i18n"

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30)

type Status = Awaited<ReturnType<typeof api.signupStatus>>

export function SignupWizard({ locale, plans }: { locale: Locale; plans: Plan[] }) {
  const t = getDict(locale)
  const lp = (p: string) => localePath(locale, p)
  const params = useSearchParams()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [plan, setPlan] = useState(params.get("plan") && plans.some((p) => p.code === params.get("plan")) ? params.get("plan")! : "pro")
  const [billing, setBilling] = useState<"monthly" | "yearly">(params.get("billing") === "yearly" ? "yearly" : "monthly")
  const [company, setCompany] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [slugState, setSlugState] = useState<{ checking: boolean; available?: boolean; reason?: string }>({ checking: false })
  const [adminName, setAdminName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [accept, setAccept] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [signupId, setSignupId] = useState<string | null>(null)
  const [status, setStatus] = useState<Status | null>(null)

  const selected = useMemo(() => plans.find((p) => p.code === plan)!, [plan, plans])

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(company))
  }, [company, slugTouched])

  // Vérification de disponibilité du sous-domaine (debounce)
  useEffect(() => {
    if (!slug || slug.length < 3) {
      setSlugState({ checking: false })
      return
    }
    let alive = true
    setSlugState({ checking: true })
    const t = setTimeout(async () => {
      try {
        const r = await api.checkSlug(slug)
        if (alive) setSlugState({ checking: false, available: r.available, reason: r.reason })
      } catch {
        if (alive) setSlugState({ checking: false })
      }
    }, 450)
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [slug])

  // Polling de la progression du déploiement
  useEffect(() => {
    if (!signupId) return
    let alive = true
    const tick = async () => {
      try {
        const s = await api.signupStatus(signupId)
        if (!alive) return
        setStatus(s)
        if (s.status === "active" || s.status === "failed") return
      } catch {
        /* on réessaie */
      }
      if (alive) setTimeout(tick, 2000)
    }
    tick()
    return () => {
      alive = false
    }
  }, [signupId])

  async function submit() {
    setError("")
    setFieldErrors({})
    if (!accept) {
      setError(t.signup.acceptErr)
      return
    }
    setSending(true)
    try {
      const r = await api.signup({ plan, billing, company, slug, admin_name: adminName, email, phone, password, accept_terms: accept })
      setSignupId(r.signup_id)
      setStep(3)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(err.errors || {})
      } else setError(t.signup.createErr)
    } finally {
      setSending(false)
    }
  }

  const Err = ({ k }: { k: string }) => (fieldErrors[k] ? <p className="mt-1 text-xs text-red-600">{fieldErrors[k][0]}</p> : null)

  return (
    <div className="mx-auto max-w-4xl">
      {/* Stepper */}
      <ol className="mb-10 flex items-center justify-center gap-4 text-sm">
        {t.signup.steps.map((l, i) => {
          const n = (i + 1) as 1 | 2 | 3
          const done = step > n
          return (
            <li key={l} className="flex items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step === n ? "bg-brand-600 text-white" : done ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                {done ? <Check className="h-4 w-4" /> : n}
              </span>
              <span className={step === n ? "font-semibold text-ink" : "text-slate-500"}>{l}</span>
              {i < 2 && <span className="mx-2 h-px w-8 bg-slate-300" />}
            </li>
          )
        })}
      </ol>

      {step === 1 && (
        <div>
          <h1 className="h2 text-center">{t.signup.choosePlan}</h1>
          <p className="lead mt-3 text-center">
            {t.signup.chooseLead(site.trialDays)}
          </p>
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
              <button
                key={p.code}
                type="button"
                onClick={() => setPlan(p.code)}
                className={`card text-left transition ${plan === p.code ? "border-brand-500 ring-2 ring-brand-500" : "hover:border-slate-300"}`}
              >
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
          <div className="card lg:col-span-3">
            <h1 className="text-2xl font-bold text-ink">{t.signup.yourSpace}</h1>
            <p className="mt-1 text-sm text-slate-600">{t.signup.yourSpaceLead}</p>
            <div className="mt-6 space-y-5">
              <div>
                <label className="label">{t.signup.company}</label>
                <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder={t.signup.companyPh} />
                <Err k="company" />
              </div>
              <div>
                <label className="label">{t.signup.slug}</label>
                <div className="flex items-stretch" dir="ltr">
                  <input
                    className="input rounded-r-none"
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true)
                      setSlug(slugify(e.target.value))
                    }}
                    placeholder={t.signup.slugPh}
                  />
                  <span className="flex items-center rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">.{site.appDomain}</span>
                </div>
                <p className="mt-1 text-xs">
                  {slugState.checking && <span className="text-slate-500">{t.signup.checking}</span>}
                  {!slugState.checking && slugState.available === true && <span className="text-emerald-700">{t.signup.available}</span>}
                  {!slugState.checking && slugState.available === false && <span className="text-red-600">{slugState.reason || t.signup.taken}</span>}
                  {!slugState.checking && slugState.available === undefined && <span className="text-slate-500">{t.signup.slugHint}</span>}
                </p>
                <Err k="slug" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
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
                  <label className="label">{t.signup.password}</label>
                  <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder={t.signup.passwordPh} dir="ltr" />
                  <Err k="password" />
                </div>
              </div>
              <label className="flex items-start gap-3 text-sm text-slate-700">
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
                <p className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                </p>
              )}
              <div className="flex items-center justify-between">
                <button className="btn-ghost" onClick={() => setStep(1)}>
                  {t.signup.back}
                </button>
                <button className="btn-primary" onClick={submit} disabled={sending || slugState.available === false || !slug}>
                  {sending && <Loader2 className="h-4 w-4 animate-spin" />} {t.signup.create}
                </button>
              </div>
            </div>
          </div>
          <aside className="lg:col-span-2">
            <div className="card sticky top-24">
              <p className="eyebrow">{t.signup.summary}</p>
              <p className="mt-2 text-lg font-bold text-ink">
                {t.signup.plan(selected.name, billing === "yearly")}
              </p>
              <p className="text-sm text-slate-600">
                {t.signup.afterTrial(money(billing === "yearly" ? selected.yearlyMonthly : selected.monthly, locale))}
              </p>
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

      {step === 3 && (
        <div className="card mx-auto max-w-2xl">
          {status?.status === "active" ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
              <h1 className="mt-4 text-2xl font-bold text-ink">{t.signup.readyTitle}</h1>
              <p className="mt-2 text-sm text-slate-600">
                {t.signup.readyText(email)}
              </p>
              <a href={status.app_url || `https://${slug}.${site.appDomain}`} className="btn-primary mt-6">
                {t.signup.open(`${slug}.${site.appDomain}`)}
              </a>
              <p className="mt-4 text-xs text-slate-500">
                {t.signup.nextStep}{" "}
                <Link href={`${lp("/formation")}#demarrer`} className="font-semibold text-brand-700 underline">
                  {t.signup.nextStepLink}
                </Link>
              </p>
            </div>
          ) : status?.status === "failed" ? (
            <div className="text-center">
              <XCircle className="mx-auto h-14 w-14 text-red-600" />
              <h1 className="mt-4 text-2xl font-bold text-ink">{t.signup.failedTitle}</h1>
              <p className="mt-2 text-sm text-slate-600">{status.error || t.signup.failedDefault} {t.signup.failedText}</p>
              <Link href={lp("/contact")} className="btn-secondary mt-6">
                {t.signup.contactSupport}
              </Link>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-ink">{t.signup.creating}</h1>
              <p className="mt-1 text-sm text-slate-600">{t.signup.creatingText}</p>
              <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="progress-striped h-full rounded-full bg-brand-600 transition-all duration-700" style={{ width: `${Math.max(4, status?.progress ?? 0)}%` }} />
              </div>
              <p className="mt-2 text-end text-xs text-slate-500">{status?.progress ?? 0} %</p>
              <ul className="mt-6 space-y-3">
                {(status?.steps || Object.keys(t.signup.stepLabels).map((key) => ({ key, label: "", status: "pending" as const, message: undefined as string | undefined }))).map((s) => (
                  <li key={s.key} className="flex items-center gap-3 text-sm">
                    {s.status === "done" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                    {s.status === "running" && <Loader2 className="h-5 w-5 animate-spin text-brand-600" />}
                    {s.status === "pending" && <Circle className="h-5 w-5 text-slate-300" />}
                    {s.status === "failed" && <XCircle className="h-5 w-5 text-red-600" />}
                    <span className={s.status === "pending" ? "text-slate-500" : "text-ink"}>{t.signup.stepLabels[s.key] ?? s.label}</span>
                    {s.message && <span className="text-xs text-slate-500">— {s.message}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
