import Link from "next/link"
import { ArrowRight, Check, PlayCircle } from "lucide-react"
import { Section, SectionHeading, CtaBand, Badge } from "@/components/ui"
import { Icon } from "@/components/Icon"
import { Mockup } from "@/components/mockups/Mockup"
import { site, money } from "@/content/site.config"
import { features, steps, audiences, stats, testimonials } from "@/content/features"
import { plans } from "@/content/plans"
import { faq } from "@/content/faq"

export default function HomePage() {
  const topFaq = faq[0].items.slice(0, 3).concat(faq[2].items.slice(1, 3))
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-grid">
        <div className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-brand-50 to-transparent" />
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge>Pensé pour les imprimeries du Maroc</Badge>
            <h1 className="h1 mt-5">
              Commandes, atelier, livraison et encaissement. <span className="text-brand-600">Un seul outil.</span>
            </h1>
            <p className="lead mt-6">
              {site.brand} suit chaque commande du devis à l&apos;encaissement du contre-remboursement : les fichiers partent seuls vers vos
              machines, les bons de livraison se génèrent en un clic et le COD collecté est rapproché du reste à payer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/inscription" className="btn-primary">
                Essai gratuit {site.trialDays} jours <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                <PlayCircle className="h-4 w-4" /> Voir une démo
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              {["Sans carte bancaire", "Espace créé en 2 minutes", `À partir de ${money(plans[0].monthly)} HT / mois`].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-float">
            <Mockup kind="orders" className="shadow-2xl ring-1 ring-slate-200" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="border-y border-slate-200 bg-white">
        <div className="container-x grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-ink">{s.value}</p>
              <p className="mt-1 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLÈME → SOLUTION */}
      <Section tone="gray">
        <SectionHeading
          eyebrow="Pourquoi"
          title="Vous connaissez ces journées"
          lead="Le fichier introuvable au moment d'imprimer. Le livreur qui a encaissé « à peu près » le bon montant. L'avance notée sur un carnet. Le client qui appelle pour savoir où en est sa commande."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Le fichier est déjà sur la machine",
              d: "Dès qu'une commande passe en production, l'agent d'impression dépose ses fichiers dans le bon dossier du bon poste. Sans clé USB, sans WhatsApp.",
            },
            {
              t: "Le COD est vérifié à la livraison",
              d: "Le reste à payer (prix – avance) est transmis au transporteur. Ce qu'il collecte est comparé automatiquement ; tout écart est signalé.",
            },
            {
              t: "Tout le monde voit la même chose",
              d: "Vendeur, atelier, livreur, gérant : chacun voit ce qui le concerne, sur le même dossier de commande, en temps réel.",
            },
          ].map((c) => (
            <div key={c.t} className="card">
              <h3 className="h3">{c.t}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FONCTIONNALITÉS */}
      <Section id="fonctionnalites">
        <SectionHeading eyebrow="Fonctionnalités" title="Tout ce qu'il faut pour faire tourner une imprimerie" lead="Un module par métier, un seul dossier de commande partagé." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link key={f.slug} href={`/fonctionnalites#${f.slug}`} className="card group transition hover:-translate-y-0.5 hover:shadow-md">
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-white ${f.color}`}>
                <Icon name={f.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink group-hover:text-brand-700">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{f.short}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* ZOOM COD */}
      <Section tone="gray">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Mockup kind="cod" className="shadow-xl ring-1 ring-slate-200" />
          <div>
            <p className="eyebrow">Contre-remboursement</p>
            <h2 className="h2 mt-3">COD encaissé − reste à payer = 0. Sinon, vous le savez.</h2>
            <p className="lead mt-4">
              Chaque commande garde son prix, ses ajustements, sa livraison et l&apos;avance encaissée. À la livraison, le montant collecté par le
              transporteur est rapproché du reste à payer. Les écarts remontent dans la liste, le tableau de bord et l&apos;export CSV.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Avance saisie sur la commande, reste à payer transmis comme COD",
                "Statuts transporteur reçus automatiquement (webhooks)",
                "Badge d'écart, filtre dédié, export pour pointer avec le transporteur",
                "Points de fidélité crédités seulement à la livraison ou au retrait",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ZOOM AGENT */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">Atelier</p>
            <h2 className="h2 mt-3">Les fichiers arrivent seuls sur les postes d&apos;impression</h2>
            <p className="lead mt-4">
              {site.agentName} s&apos;installe sur chaque poste (Windows, macOS, Linux) et synchronise en arrière-plan les dossiers que vous choisissez.
              En mode service, il tourne même quand personne n&apos;est connecté. Vous pilotez tous les postes depuis le web.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/agent" className="btn-secondary">
                Découvrir l&apos;agent <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/formation#produire" className="btn-ghost">
                Voir la formation
              </Link>
            </div>
          </div>
          <Mockup kind="agent" className="order-1 shadow-xl ring-1 ring-slate-200 lg:order-2" />
        </div>
      </Section>

      {/* COMMENT ÇA MARCHE */}
      <Section tone="dark">
        <SectionHeading eyebrow="Comment ça marche" title="Opérationnel en une demi-journée" dark />
        <ol className="mt-12 grid gap-8 md:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="relative">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">{s.n}</span>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* MÉTIERS */}
      <Section>
        <SectionHeading eyebrow="Pour qui" title="Un outil pour chaque type d'imprimerie" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => (
            <div key={a.title} className="rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-ink">{a.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{a.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* TARIFS RÉSUMÉ */}
      <Section tone="gray" id="tarifs">
        <SectionHeading eyebrow="Tarifs" title="La solution complète, à la taille de votre atelier" lead="Même application pour tous. Vous payez pour le volume, pas pour les fonctions." />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.code} className={`card relative flex flex-col ${p.highlight ? "border-brand-500 ring-2 ring-brand-500" : ""}`}>
              {p.badge && (
                <span className="absolute -top-3 left-6">
                  <Badge>{p.badge}</Badge>
                </span>
              )}
              <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.description}</p>
              <p className="mt-5">
                <span className="text-4xl font-bold text-ink">{money(p.monthly)}</span>
                <span className="text-sm text-slate-500"> HT / mois</span>
              </p>
              <p className="text-xs text-slate-500">ou {money(p.yearlyMonthly)} / mois en annuel</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-700">
                {p.limits.slice(0, 3).map((l) => (
                  <li key={l.label} className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">{l.label}</span>
                    <span className="font-medium">{l.value}</span>
                  </li>
                ))}
              </ul>
              <Link href={p.code === "business" ? "/contact?sujet=business" : `/inscription?plan=${p.code}`} className={`mt-6 ${p.highlight ? "btn-primary" : "btn-secondary"}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-600">
          <Link href="/tarifs" className="font-semibold text-brand-700 hover:underline">
            Voir le comparatif détaillé des forfaits →
          </Link>
        </p>
      </Section>

      {/* TÉMOIGNAGES */}
      <Section>
        <SectionHeading eyebrow="Ils l'utilisent" title="Ce que disent les ateliers" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="card">
              <blockquote className="text-sm leading-7 text-slate-700">« {t.text} »</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-ink">{t.name}</span>
                <span className="block text-slate-500">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* FAQ RÉSUMÉ */}
      <Section tone="gray">
        <SectionHeading eyebrow="FAQ" title="Questions fréquentes" />
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {topFaq.map((f) => (
            <details key={f.q} className="group px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink">
                {f.q}
                <span className="ml-4 text-slate-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/faq" className="font-semibold text-brand-700 hover:underline">
            Toutes les questions →
          </Link>
        </p>
      </Section>

      <CtaBand />
    </>
  )
}
