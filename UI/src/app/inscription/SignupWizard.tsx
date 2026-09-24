"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, Check, CheckCircle2, Circle, Loader2, XCircle } from "lucide-react"
import { plans } from "@/content/plans"
import { site, money } from "@/content/site.config"
import { api, ApiError } from "@/lib/api"

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30)

type Status = Awaited<ReturnType<typeof api.signupStatus>>

export function SignupWizard() {
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

  const selected = useMemo(() => plans.find((p) => p.code === plan)!, [plan])

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
      setError("Merci d'accepter les conditions générales pour continuer.")
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
      } else setError("Impossible de créer l'espace pour le moment. Réessayez dans quelques minutes ou contactez-nous.")
    } finally {
      setSending(false)
    }
  }

  const Err = ({ k }: { k: string }) => (fieldErrors[k] ? <p className="mt-1 text-xs text-red-600">{fieldErrors[k][0]}</p> : null)

  return (
    <div className="mx-auto max-w-4xl">
      {/* Stepper */}
      <ol className="mb-10 flex items-center justify-center gap-4 text-sm">
        {["Forfait", "Votre espace", "Déploiement"].map((l, i) => {
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
          <h1 className="h2 text-center">Choisissez votre forfait</h1>
          <p className="lead mt-3 text-center">
            {site.trialDays} jours d&apos;essai gratuit sur tous les forfaits, sans carte bancaire. Vous pourrez changer ensuite.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 text-sm">
            <button onClick={() => setBilling("monthly")} className={`rounded-full px-4 py-1.5 ring-1 ${billing === "monthly" ? "bg-brand-600 text-white ring-brand-600" : "ring-slate-300"}`}>
              Mensuel
            </button>
            <button onClick={() => setBilling("yearly")} className={`rounded-full px-4 py-1.5 ring-1 ${billing === "yearly" ? "bg-brand-600 text-white ring-brand-600" : "ring-slate-300"}`}>
              Annuel (2 mois offerts)
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
                  {money(billing === "yearly" ? p.yearlyMonthly : p.monthly)} <span className="text-xs font-normal text-slate-500">HT / mois</span>
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
              Continuer avec {selected.name}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="card lg:col-span-3">
            <h1 className="text-2xl font-bold text-ink">Votre espace</h1>
            <p className="mt-1 text-sm text-slate-600">Ces informations servent à créer votre espace et votre compte administrateur.</p>
            <div className="mt-6 space-y-5">
              <div>
                <label className="label">Nom de l&apos;atelier / société *</label>
                <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Imprimerie Nour" />
                <Err k="company" />
              </div>
              <div>
                <label className="label">Adresse de votre espace *</label>
                <div className="flex items-stretch">
                  <input
                    className="input rounded-r-none"
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true)
                      setSlug(slugify(e.target.value))
                    }}
                    placeholder="imprimerie-nour"
                  />
                  <span className="flex items-center rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">.{site.appDomain}</span>
                </div>
                <p className="mt-1 text-xs">
                  {slugState.checking && <span className="text-slate-500">Vérification…</span>}
                  {!slugState.checking && slugState.available === true && <span className="text-emerald-700">Disponible</span>}
                  {!slugState.checking && slugState.available === false && <span className="text-red-600">{slugState.reason || "Déjà utilisé, choisissez-en un autre."}</span>}
                  {!slugState.checking && slugState.available === undefined && <span className="text-slate-500">Lettres, chiffres et tirets, 3 à 30 caractères.</span>}
                </p>
                <Err k="slug" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">Votre nom (administrateur) *</label>
                  <input className="input" value={adminName} onChange={(e) => setAdminName(e.target.value)} autoComplete="name" />
                  <Err k="admin_name" />
                </div>
                <div>
                  <label className="label">Téléphone / WhatsApp *</label>
                  <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="06 …" />
                  <Err k="phone" />
                </div>
                <div>
                  <label className="label">E-mail *</label>
                  <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                  <Err k="email" />
                </div>
                <div>
                  <label className="label">Mot de passe *</label>
                  <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="8 caractères minimum" />
                  <Err k="password" />
                </div>
              </div>
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <input type="checkbox" className="mt-1" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
                <span>
                  J&apos;accepte les{" "}
                  <Link href="/cgv" target="_blank" className="font-semibold text-brand-700 underline">
                    conditions générales
                  </Link>{" "}
                  et la{" "}
                  <Link href="/confidentialite" target="_blank" className="font-semibold text-brand-700 underline">
                    politique de confidentialité
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
                  ← Changer de forfait
                </button>
                <button className="btn-primary" onClick={submit} disabled={sending || slugState.available === false || !slug}>
                  {sending && <Loader2 className="h-4 w-4 animate-spin" />} Créer mon espace
                </button>
              </div>
            </div>
          </div>
          <aside className="lg:col-span-2">
            <div className="card sticky top-24">
              <p className="eyebrow">Récapitulatif</p>
              <p className="mt-2 text-lg font-bold text-ink">
                Forfait {selected.name} · {billing === "yearly" ? "annuel" : "mensuel"}
              </p>
              <p className="text-sm text-slate-600">
                {money(billing === "yearly" ? selected.yearlyMonthly : selected.monthly)} HT / mois après l&apos;essai
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {[`${site.trialDays} jours gratuits, sans carte bancaire`, "Espace créé automatiquement en ~2 minutes", "Base de données et stockage dédiés", "Accès envoyés par e-mail", "Paiement par virement à la fin de l'essai"].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {t}
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
              <h1 className="mt-4 text-2xl font-bold text-ink">Votre espace est prêt !</h1>
              <p className="mt-2 text-sm text-slate-600">
                Connectez-vous avec l&apos;e-mail <span className="font-semibold">{email}</span> et le mot de passe que vous venez de choisir. Un récapitulatif vous a été envoyé par e-mail.
              </p>
              <a href={status.app_url || `https://${slug}.${site.appDomain}`} className="btn-primary mt-6">
                Ouvrir {slug}.{site.appDomain}
              </a>
              <p className="mt-4 text-xs text-slate-500">
                Prochaine étape :{" "}
                <Link href="/formation#demarrer" className="font-semibold text-brand-700 underline">
                  la vidéo « Premier paramétrage »
                </Link>
              </p>
            </div>
          ) : status?.status === "failed" ? (
            <div className="text-center">
              <XCircle className="mx-auto h-14 w-14 text-red-600" />
              <h1 className="mt-4 text-2xl font-bold text-ink">Le déploiement a échoué</h1>
              <p className="mt-2 text-sm text-slate-600">{status.error || "Une erreur technique est survenue."} Notre équipe a été prévenue et vous recontacte rapidement pour finaliser votre espace.</p>
              <Link href="/contact" className="btn-secondary mt-6">
                Contacter le support
              </Link>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-ink">Création de votre espace…</h1>
              <p className="mt-1 text-sm text-slate-600">Cela prend en général moins de deux minutes. Vous pouvez laisser cette page ouverte.</p>
              <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="progress-striped h-full rounded-full bg-brand-600 transition-all duration-700" style={{ width: `${Math.max(4, status?.progress ?? 0)}%` }} />
              </div>
              <p className="mt-2 text-right text-xs text-slate-500">{status?.progress ?? 0} %</p>
              <ul className="mt-6 space-y-3">
                {(status?.steps || [
                  { key: "database", label: "Création de la base de données", status: "pending" },
                  { key: "migrate", label: "Installation de la structure", status: "pending" },
                  { key: "seed", label: "Données de départ", status: "pending" },
                  { key: "admin", label: "Compte administrateur", status: "pending" },
                  { key: "storage", label: "Espace de stockage des fichiers", status: "pending" },
                  { key: "verify", label: "Vérification finale", status: "pending" },
                ]).map((s) => (
                  <li key={s.key} className="flex items-center gap-3 text-sm">
                    {s.status === "done" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                    {s.status === "running" && <Loader2 className="h-5 w-5 animate-spin text-brand-600" />}
                    {s.status === "pending" && <Circle className="h-5 w-5 text-slate-300" />}
                    {s.status === "failed" && <XCircle className="h-5 w-5 text-red-600" />}
                    <span className={s.status === "pending" ? "text-slate-500" : "text-ink"}>{s.label}</span>
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
