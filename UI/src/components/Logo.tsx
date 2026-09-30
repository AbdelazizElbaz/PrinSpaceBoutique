import { site } from "@/content/site.config"

// Couleurs du mot-symbole PrintIOS : « Print » en bleu, « I » et la moitié
// gauche du « O » en jaune, moitié droite du « O » et « S » en rouge.
export const LOGO_BLUE = "#2547e9"
export const LOGO_YELLOW = "#f5b301"
export const LOGO_RED = "#e11d2e"

// Logo : pictogramme (feuille imprimée + flèche de flux) + mot-symbole.
export function Logo({ className = "h-8", dark = false }: { className?: string; dark?: boolean }) {
  // Nom de marque autre que « PrintIOS » (config) : affiché tel quel.
  const isPrintIOS = site.brand === "PrintIOS"
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-full w-auto" aria-hidden="true">
        <rect x="4" y="4" width="32" height="32" rx="9" className="fill-brand-600" />
        <path d="M13 12h9.5a4.5 4.5 0 0 1 0 9H13z" fill="#fff" opacity=".95" />
        <path d="M13 21h6v7h-6z" fill="#fff" opacity=".7" />
        <path d="M23 24l5 4-5 4v-2.5h-4v-3h4z" fill="#a5f3fc" />
      </svg>
      {isPrintIOS ? (
        <span className="text-lg font-bold tracking-tight" aria-label={site.brand} dir="ltr">
          {/* « Print » : bleu (plus clair sur fond sombre pour rester lisible) */}
          <span style={{ color: dark ? "#93b4fd" : LOGO_BLUE }}>Print</span>
          <span style={{ color: LOGO_YELLOW }}>I</span>
          {/* « O » coupé verticalement : moitié gauche jaune, moitié droite rouge */}
          <span
            style={{
              backgroundImage: `linear-gradient(90deg, ${LOGO_YELLOW} 50%, ${LOGO_RED} 50%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            O
          </span>
          <span style={{ color: LOGO_RED }}>S</span>
        </span>
      ) : (
        <span className={`text-lg font-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>{site.brand}</span>
      )}
    </span>
  )
}
