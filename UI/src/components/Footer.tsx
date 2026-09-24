import Link from "next/link"
import { Logo } from "./Logo"
import { site } from "@/content/site.config"

const cols = [
  {
    title: "Produit",
    links: [
      { href: "/fonctionnalites", label: "Fonctionnalités" },
      { href: "/agent", label: "Agent d'impression" },
      { href: "/tarifs", label: "Tarifs" },
      { href: "/inscription", label: "Essai gratuit" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "/formation", label: "Formation vidéo" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Demander une démo" },
      { href: site.links.login, label: "Se connecter" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/cgv", label: "Conditions générales" },
      { href: "/confidentialite", label: "Confidentialité" },
      { href: "/mentions-legales", label: "Mentions légales" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50">
      <div className="container-x grid gap-10 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-slate-600">{site.tagline}. Commandes, atelier, livraison et encaissement dans un seul outil, pensé pour les imprimeries du Maroc.</p>
          <div className="mt-5 space-y-1 text-sm text-slate-600">
            <p>
              <a className="hover:text-ink" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </p>
            <p>
              <a className="hover:text-ink" href={`tel:${site.contact.phone.replace(/\s/g, "")}`}>
                {site.contact.phone}
              </a>
              {" · "}
              <a className="hover:text-ink" href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </p>
            <p>{site.company.city}, Maroc</p>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="text-sm font-semibold text-ink">{c.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-600 hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.company.legalName}. Tous droits réservés.
          </p>
          <p>Hébergé de manière sécurisée · Données isolées par client · Support en français et en arabe</p>
        </div>
      </div>
    </footer>
  )
}
