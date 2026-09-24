import type { Metadata } from "next"
import { Section } from "@/components/ui"
import { site } from "@/content/site.config"

export const metadata: Metadata = { title: "Politique de confidentialité", robots: { index: false } }

export default function PrivacyPage() {
  const c = site.company
  return (
    <Section>
      <article className="prose-legal mx-auto max-w-3xl">
        <p className="eyebrow">Légal</p>
        <h1 className="h2 mt-3">Politique de confidentialité</h1>
        <p>Dernière mise à jour : septembre 2026. {c.legalName} traite des données personnelles dans le cadre du site {site.domain} et du service {site.brand}, conformément à la loi marocaine 09-08 relative à la protection des personnes physiques à l&apos;égard du traitement des données à caractère personnel.</p>

        <h2>1. Données collectées sur le site</h2>
        <p>Formulaires de contact et d&apos;inscription : nom, société, e-mail, téléphone, ville, taille de l&apos;atelier, message, forfait choisi, sous-domaine. Données techniques : adresse IP, navigateur, pages consultées (mesure d&apos;audience anonymisée). Nous n&apos;utilisons pas de cookies publicitaires.</p>

        <h2>2. Finalités</h2>
        <ul>
          <li>Répondre à vos demandes de démonstration et de contact.</li>
          <li>Créer et administrer votre espace, vous envoyer vos accès et vos factures.</li>
          <li>Vous informer des évolutions du service (vous pouvez vous désinscrire à tout moment).</li>
          <li>Assurer la sécurité du service et prévenir les abus.</li>
        </ul>

        <h2>3. Données de vos propres clients</h2>
        <p>Les données que vous saisissez dans votre espace (vos clients, commandes, fichiers) sont traitées pour votre compte : vous en êtes le responsable de traitement, {c.legalName} en est le sous-traitant. Elles sont stockées dans une base de données et un espace de stockage dédiés à votre espace, chiffrés au repos, et ne sont jamais utilisées à d&apos;autres fins que la fourniture du service.</p>

        <h2>4. Hébergement et sécurité</h2>
        <p>Le service est hébergé sur une infrastructure cloud professionnelle avec accès HTTPS exclusivement. Les mots de passe sont hachés. Les accès des agents d&apos;impression reposent sur des jetons révocables. Les sauvegardes sont chiffrées.</p>

        <h2>5. Durée de conservation</h2>
        <p>Demandes de contact : 24 mois. Données de compte : pendant la durée de l&apos;abonnement puis 30 jours après résiliation (60 jours pour les sauvegardes). Données de facturation : durée légale.</p>

        <h2>6. Destinataires</h2>
        <p>Nos équipes commerciale et support, ainsi que nos prestataires techniques (hébergement, e-mail transactionnel) strictement pour les besoins du service. Les transporteurs que vous connectez reçoivent uniquement les informations nécessaires à la livraison des commandes que vous leur confiez.</p>

        <h2>7. Vos droits</h2>
        <p>Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;opposition et de suppression de vos données. Écrivez-nous à {site.contact.email}. Ce traitement fait l&apos;objet des formalités requises auprès de la CNDP.</p>

        <h2>Contact</h2>
        <p>
          {c.legalName} — {c.address} — {site.contact.email}
        </p>
      </article>
    </Section>
  )
}
