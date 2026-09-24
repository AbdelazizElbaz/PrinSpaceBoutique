import type { Metadata } from "next"
import { Section } from "@/components/ui"
import { site } from "@/content/site.config"

export const metadata: Metadata = { title: "Mentions légales", robots: { index: false } }

export default function LegalPage() {
  const c = site.company
  return (
    <Section>
      <article className="prose-legal mx-auto max-w-3xl">
        <p className="eyebrow">Légal</p>
        <h1 className="h2 mt-3">Mentions légales</h1>
        <h2>Éditeur du site</h2>
        <p>
          {c.legalName} — {c.address}. ICE : {c.ice}. RC : {c.rc}. E-mail : {site.contact.email}. Téléphone : {site.contact.phone}.
        </p>
        <h2>Directeur de la publication</h2>
        <p>Le représentant légal de {c.legalName}.</p>
        <h2>Hébergement</h2>
        <p>Site et service hébergés sur une infrastructure cloud professionnelle (Amazon Web Services). Les données des clients sont stockées dans des bases et espaces de stockage dédiés.</p>
        <h2>Propriété intellectuelle</h2>
        <p>L&apos;ensemble des contenus de ce site (textes, illustrations, marques, logiciel) est protégé. Toute reproduction sans autorisation est interdite. Les marques de transporteurs citées (Ameex, Olivraison, Ozone Express) appartiennent à leurs propriétaires respectifs.</p>
      </article>
    </Section>
  )
}
