import type { Metadata } from "next"
import Link from "next/link"
import { Apple, Check, Download, KeyRound, MonitorCog, RefreshCw, Server, ShieldCheck } from "lucide-react"
import { Section, SectionHeading, CtaBand } from "@/components/ui"
import { Mockup } from "@/components/mockups/Mockup"
import { site } from "@/content/site.config"

export const metadata: Metadata = {
  title: `${site.agentName} — l'agent d'impression qui apporte les fichiers sur vos machines`,
  description: "Agent Windows, macOS et Linux : téléchargement automatique des fichiers prêts, mode service, comptes de service, pilotage depuis le web, mises à jour automatiques.",
}

const points = [
  { icon: RefreshCw, t: "Synchronisation en arrière-plan", d: "Les fichiers des commandes prêtes sont téléchargés dans le dossier local que vous choisissez, par machine ou par atelier. Reprise automatique après coupure, gros fichiers découpés en morceaux parallèles." },
  { icon: Server, t: "Mode service", d: "Installé comme service de l'ordinateur, l'agent tourne même quand la session est fermée ou qu'aucun utilisateur n'est connecté. La fenêtre sert uniquement à le piloter." },
  { icon: KeyRound, t: "Comptes de service dédiés", d: "L'agent se connecte avec un compte créé pour lui depuis la page Synchronisation, jamais avec un compte utilisateur. Jeton révocable valable un an, mot de passe jamais stocké." },
  { icon: MonitorCog, t: "Pilotage depuis le web", d: "Depuis votre espace : état de chaque poste, pause / reprise, vérification immédiate, réglages de parallélisme, historique et erreurs, suppression d'un poste obsolète." },
  { icon: Download, t: "Mises à jour automatiques", d: "Une nouvelle version publiée ? L'agent la propose (ou l'installe seul si vous l'activez) et redémarre sans intervention." },
  { icon: ShieldCheck, t: "Sécurité", d: "Communication HTTPS uniquement, URLs de téléchargement signées et temporaires, identité machine stable : reconnecter un poste retrouve ses dossiers." },
]

export default function AgentPage() {
  return (
    <>
      <section className="bg-grid">
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="eyebrow">Agent d&apos;impression</p>
            <h1 className="h1 mt-4">Les fichiers sont déjà sur la machine quand l&apos;opérateur arrive</h1>
            <p className="lead mt-6">
              {site.agentName} s&apos;installe sur chaque poste de l&apos;atelier et apporte automatiquement les fichiers prêts à imprimer. Plus de clé USB, plus de « tu me l&apos;envoies sur WhatsApp ? ».
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/inscription" className="btn-primary">
                Essayer gratuitement
              </Link>
              <Link href="/formation#produire" className="btn-secondary">
                Voir les vidéos d&apos;installation
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              {["Windows 10 / 11", "macOS (Apple Silicon & Intel)", "Linux (AppImage, .deb)"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <Mockup kind="agent" className="shadow-2xl ring-1 ring-slate-200" />
        </div>
      </section>

      <Section>
        <SectionHeading eyebrow="Ce qu'il fait" title="Un agent conçu pour un atelier, pas pour un bureau" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {points.map((p) => (
            <div key={p.t} className="card">
              <p.icon className="h-6 w-6 text-brand-600" />
              <h3 className="mt-4 font-semibold text-ink">{p.t}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="gray">
        <SectionHeading eyebrow="Installation" title="Trois étapes, cinq minutes" />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { t: "Téléchargez l'installeur", d: "Depuis votre espace, page Synchronisation → « Installer l'agent ». Choisissez Windows, macOS ou Linux." },
            { t: "Créez un compte de service", d: "Page Synchronisation → « Comptes de l'agent » → Créer. Un identifiant et un mot de passe généré, affiché une seule fois." },
            { t: "Connectez l'agent", d: "Adresse de votre espace, bouton Tester, puis identifiant et mot de passe. Choisissez les dossiers à synchroniser et, si vous voulez, activez le mode service." },
          ].map((s, i) => (
            <li key={s.t} className="card">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">{i + 1}</span>
              <h3 className="mt-4 font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Mockup kind="workshop" className="shadow-xl ring-1 ring-slate-200" />
          <div>
            <p className="eyebrow">Côté web</p>
            <h2 className="h2 mt-3">Vous voyez tous les postes, en direct</h2>
            <p className="lead mt-4">
              Chaque poste remonte son état toutes les quelques secondes : fichiers en attente, en cours, terminés, erreurs. Vous pouvez mettre un poste en pause, forcer une vérification, ajuster le parallélisme ou pousser une mise à jour, sans vous déplacer.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {["Statut en ligne / hors ligne par poste", "Instances de synchronisation créées depuis le web ou depuis l'agent", "Journal des événements filtrable (erreurs, mises à jour, connexions)", "Suppression des postes obsolètes"].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="gray">
        <div className="mx-auto max-w-3xl text-center">
          <Apple className="mx-auto h-8 w-8 text-slate-400" />
          <h2 className="h3 mt-4">Configuration requise</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Windows 10 ou 11 (64 bits), macOS 12 ou plus récent, ou une distribution Linux récente. Connexion internet stable. Aucun serveur local n&apos;est nécessaire. Sur Starter, l&apos;agent est limité à un poste ; Pro et Business : postes illimités et mode service.
          </p>
        </div>
      </Section>
      <CtaBand />
    </>
  )
}
