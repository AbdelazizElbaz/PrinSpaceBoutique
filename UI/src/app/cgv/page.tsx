import type { Metadata } from "next"
import { Section } from "@/components/ui"
import { site, money } from "@/content/site.config"
import { plans } from "@/content/plans"

export const metadata: Metadata = { title: "Conditions générales de vente et d'utilisation", robots: { index: false } }

// Modèle de CGV à faire relire par un conseil juridique avant mise en ligne.
export default function CgvPage() {
  const b = site.brand
  const c = site.company
  return (
    <Section>
      <article className="prose-legal mx-auto max-w-3xl">
        <p className="eyebrow">Légal</p>
        <h1 className="h2 mt-3">Conditions générales de vente et d&apos;utilisation</h1>
        <p>Dernière mise à jour : septembre 2026. Ces conditions régissent l&apos;abonnement au service {b}, édité par {c.legalName} (« l&apos;Éditeur »), et son utilisation par le client professionnel (« le Client »).</p>

        <h2>1. Objet</h2>
        <p>{b} est un logiciel en ligne (SaaS) de gestion pour imprimeries et ateliers graphiques : commandes, devis, production, livraison, encaissement, clients, boutique en ligne et agent de synchronisation d&apos;impression ({site.agentName}). Le service est accessible via un espace dédié au Client à l&apos;adresse « sous-domaine.{site.appDomain} ».</p>

        <h2>2. Création de l&apos;espace et période d&apos;essai</h2>
        <p>Le Client crée son espace depuis le site {site.domain}. Il bénéficie d&apos;une période d&apos;essai gratuite de {site.trialDays} jours, sans engagement ni moyen de paiement. À l&apos;issue de l&apos;essai, sans souscription d&apos;un forfait, l&apos;espace est suspendu ; les données sont conservées 30 jours puis supprimées.</p>

        <h2>3. Forfaits et prix</h2>
        <p>Les forfaits en vigueur sont : {plans.map((p) => `${p.name} (${money(p.monthly)} HT par mois, ou ${money(p.yearlyMonthly)} HT par mois en engagement annuel)`).join(" ; ")}. Les prix s&apos;entendent hors taxes ; la TVA en vigueur au Maroc s&apos;applique. Chaque forfait comporte des limites d&apos;usage (utilisateurs, commandes mensuelles, stockage, points de vente) décrites sur la page Tarifs. L&apos;Éditeur peut modifier ses prix avec un préavis de 30 jours ; la modification s&apos;applique à la prochaine échéance.</p>

        <h2>4. Paiement</h2>
        <p>Le paiement s&apos;effectue par virement bancaire, mensuellement ou annuellement d&apos;avance, sur présentation d&apos;une facture. Le forfait est activé à réception du paiement. En cas de retard de paiement supérieur à 15 jours après l&apos;échéance, l&apos;accès à l&apos;espace peut être suspendu jusqu&apos;à régularisation, sans suppression des données pendant 30 jours.</p>

        <h2>5. Durée, changement de forfait et résiliation</h2>
        <p>L&apos;abonnement mensuel est reconduit tacitement chaque mois et résiliable à tout moment, sans frais, avec effet à la fin du mois en cours. L&apos;abonnement annuel court jusqu&apos;à son terme. Le passage à un forfait supérieur est immédiat avec facturation au prorata ; le passage à un forfait inférieur prend effet à l&apos;échéance suivante sous réserve du respect des limites du nouveau forfait.</p>

        <h2>6. Obligations de l&apos;Éditeur</h2>
        <ul>
          <li>Fournir un service disponible 24 h/24, hors maintenance planifiée annoncée au moins 24 h à l&apos;avance et hors cas de force majeure, avec un objectif de disponibilité mensuelle de 99,5 %.</li>
          <li>Héberger les données du Client dans une base de données et un espace de stockage qui lui sont dédiés, et effectuer les sauvegardes selon la fréquence du forfait.</li>
          <li>Assurer le support selon le forfait souscrit, aux horaires indiqués sur le site.</li>
          <li>Ne pas accéder aux données du Client sauf à sa demande pour le support, ou pour des opérations techniques strictement nécessaires.</li>
        </ul>

        <h2>7. Obligations du Client</h2>
        <ul>
          <li>Fournir des informations exactes lors de l&apos;inscription et les tenir à jour.</li>
          <li>Conserver la confidentialité de ses identifiants et de ceux de ses utilisateurs et comptes de service ; toute action réalisée depuis son espace est réputée faite par lui.</li>
          <li>Utiliser le service conformément à la loi, notamment en matière de données personnelles de ses propres clients, et ne pas y déposer de contenu illicite.</li>
          <li>Disposer des droits sur les fichiers déposés pour impression.</li>
        </ul>

        <h2>8. Données et réversibilité</h2>
        <p>Le Client reste propriétaire de ses données. Il peut les exporter à tout moment (CSV depuis l&apos;application ; export complet sur demande). À la résiliation, les données sont conservées 30 jours pour permettre l&apos;export, puis supprimées définitivement, sauvegardes comprises dans un délai supplémentaire de 30 jours.</p>

        <h2>9. Responsabilité</h2>
        <p>Le service est fourni en l&apos;état, dans le cadre d&apos;une obligation de moyens. L&apos;Éditeur n&apos;est pas responsable des pertes indirectes (perte de chiffre d&apos;affaires, de clientèle, de données résultant d&apos;une utilisation non conforme). En tout état de cause, la responsabilité de l&apos;Éditeur est limitée au montant des sommes versées par le Client au cours des douze derniers mois. Les intégrations avec des transporteurs tiers (Ameex, Olivraison, Ozone Express…) dépendent de leurs services respectifs ; l&apos;Éditeur ne répond pas de leurs indisponibilités ni des montants effectivement collectés par eux.</p>

        <h2>10. Propriété intellectuelle</h2>
        <p>Le logiciel, sa documentation, ses marques et ses contenus restent la propriété exclusive de l&apos;Éditeur. Le Client bénéficie d&apos;un droit d&apos;utilisation non exclusif et non transférable pendant la durée de l&apos;abonnement.</p>

        <h2>11. Évolutions du service</h2>
        <p>L&apos;Éditeur fait évoluer le service en continu. Les mises à jour sont déployées sans intervention du Client. Les fonctionnalités substantielles supprimées font l&apos;objet d&apos;un préavis de 60 jours.</p>

        <h2>12. Droit applicable</h2>
        <p>Les présentes conditions sont soumises au droit marocain. À défaut de résolution amiable, tout litige est porté devant les tribunaux compétents de {c.city}.</p>

        <h2>Contact</h2>
        <p>
          {c.legalName} — {c.address} — ICE {c.ice} — RC {c.rc} — {site.contact.email}
        </p>
      </article>
    </Section>
  )
}
