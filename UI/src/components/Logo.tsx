import { site } from "@/content/site.config"

// Logo vectoriel généré : une feuille imprimée + une flèche de flux.
// Remplacez par votre logo en déposant public/logo.svg et en modifiant ici.
export function Logo({ className = "h-8", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-full w-auto" aria-hidden="true">
        <rect x="4" y="4" width="32" height="32" rx="9" className="fill-brand-600" />
        <path d="M13 12h9.5a4.5 4.5 0 0 1 0 9H13z" fill="#fff" opacity=".95" />
        <path d="M13 21h6v7h-6z" fill="#fff" opacity=".7" />
        <path d="M23 24l5 4-5 4v-2.5h-4v-3h4z" fill="#a5f3fc" />
      </svg>
      <span className={`text-lg font-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
        {site.brand}
      </span>
    </span>
  )
}
