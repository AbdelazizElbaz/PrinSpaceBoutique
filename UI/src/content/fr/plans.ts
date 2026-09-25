// Forfaits affichés sur /tarifs et dans le tunnel d'inscription.
// Les `code` doivent correspondre aux plans créés dans la console plateforme
// (table centrale `plans`) : c'est ce code que l'API boutique envoie lors du
// provisioning. Les limites sont indicatives ici ; la vérité est `plans.limits`.

export type PlanLimit = { label: string; value: string; note?: string }

export type Plan = {
  code: "starter" | "pro" | "business"
  name: string
  audience: string
  monthly: number // DH HT / mois, facturation mensuelle
  yearlyMonthly: number // DH HT / mois, facturation annuelle (10 mois payés)
  highlight?: boolean
  badge?: string
  description: string
  limits: PlanLimit[]
  includes: string[]
  extras?: string[]
  cta: string
}

export const plans: Plan[] = [
  {
    code: "starter",
    name: "Starter",
    audience: "Ateliers et petites imprimeries qui veulent sortir d'Excel et de WhatsApp.",
    monthly: 300,
    yearlyMonthly: 250,
    description: "Toute la solution, dimensionnée pour un petit atelier.",
    limits: [
      { label: "Utilisateurs", value: "2" },
      { label: "Commandes / mois", value: "300" },
      { label: "Stockage fichiers", value: "5 Go" },
      { label: "Points de vente", value: "1" },
      { label: "Transporteurs connectés", value: "1" },
    ],
    includes: [
      "Commandes, devis, maquettes et suivi de production",
      "Clients, avances, ajustements et reste à payer",
      "Livraison avec bons et étiquettes",
      "Tableau de bord et relevés",
      "PrintosSync sur 1 poste",
      "Support par e-mail",
    ],
    cta: "Commencer l'essai gratuit",
  },
  {
    code: "pro",
    name: "Pro",
    audience: "Imprimeries qui livrent tous les jours et veulent maîtriser le contre-remboursement.",
    monthly: 690,
    yearlyMonthly: 575,
    highlight: true,
    badge: "Le plus choisi",
    description: "Pour une activité quotidienne avec livraison et plusieurs postes.",
    limits: [
      { label: "Utilisateurs", value: "Illimités" },
      { label: "Commandes / mois", value: "2 000" },
      { label: "Stockage fichiers", value: "50 Go" },
      { label: "Points de vente", value: "3" },
      { label: "Transporteurs connectés", value: "Tous (Ameex, Olivraison, Ozone Express + livreurs internes)" },
    ],
    includes: [
      "Tout Starter, plus :",
      "Rapprochement COD automatique avec alerte d'écart",
      "Programme de fidélité et codes promo",
      "Boutique en ligne publique synchronisée",
      "PrintosSync sur postes illimités (mode service)",
      "Export CSV comptable",
      "Support prioritaire e-mail + WhatsApp",
    ],
    cta: "Commencer l'essai gratuit",
  },
  {
    code: "business",
    name: "Business",
    audience: "Réseaux, franchises et imprimeries avec revendeurs externes.",
    monthly: 1490,
    yearlyMonthly: 1240,
    description: "Volume illimité, revendeurs externes et accompagnement dédié.",
    limits: [
      { label: "Utilisateurs", value: "Illimités" },
      { label: "Commandes / mois", value: "Illimitées" },
      { label: "Stockage fichiers", value: "250 Go" },
      { label: "Points de vente", value: "Illimités" },
      { label: "Transporteurs connectés", value: "Tous" },
    ],
    includes: [
      "Tout Pro, plus :",
      "Revendeurs externes avec espace et catalogue dédiés",
      "Domaine personnalisé (commandes.votre-marque.ma)",
      "Formation d'onboarding en visio (2 h) + import de vos données",
      "Sauvegardes quotidiennes conservées 30 jours",
      "Gestionnaire de compte dédié",
    ],
    extras: ["Option : instance dédiée (serveur isolé) sur devis"],
    cta: "Parler à un conseiller",
  },
]

export const planByCode = (code: string) => plans.find((p) => p.code === code)

// Tableau comparatif détaillé (page /tarifs)
export type CompareRow = { feature: string; starter: string | boolean; pro: string | boolean; business: string | boolean }
export type CompareGroup = { title: string; rows: CompareRow[] }

export const comparison: CompareGroup[] = [
  {
    title: "Capacités",
    rows: [
      { feature: "Utilisateurs", starter: "2", pro: "Illimités", business: "Illimités" },
      { feature: "Commandes par mois", starter: "300", pro: "2 000", business: "Illimitées" },
      { feature: "Stockage des fichiers d'impression", starter: "5 Go", pro: "50 Go", business: "250 Go" },
      { feature: "Points de vente", starter: "1", pro: "3", business: "Illimités" },
      { feature: "Postes avec PrintosSync", starter: "1", pro: "Illimités", business: "Illimités" },
    ],
  },
  {
    title: "Commandes et ventes",
    rows: [
      { feature: "Commandes, articles, options et matériaux", starter: true, pro: true, business: true },
      { feature: "Devis et maquettes à valider", starter: true, pro: true, business: true },
      { feature: "Avances, ajustements, reste à payer", starter: true, pro: true, business: true },
      { feature: "Codes promo et promotions automatiques", starter: false, pro: true, business: true },
      { feature: "Programme de fidélité (points gagnés à la livraison)", starter: false, pro: true, business: true },
      { feature: "Boutique en ligne publique", starter: false, pro: true, business: true },
      { feature: "Revendeurs externes", starter: false, pro: false, business: true },
    ],
  },
  {
    title: "Livraison et encaissement",
    rows: [
      { feature: "Bons de livraison et étiquettes PDF", starter: true, pro: true, business: true },
      { feature: "Transporteurs (Ameex, Olivraison, Ozone Express)", starter: "1 au choix", pro: "Tous", business: "Tous" },
      { feature: "Livreurs internes et tournées", starter: true, pro: true, business: true },
      { feature: "Suivi automatique des statuts", starter: true, pro: true, business: true },
      { feature: "Rapprochement COD avec alerte d'écart", starter: false, pro: true, business: true },
      { feature: "Ramassages (pickups) par vendeur", starter: true, pro: true, business: true },
    ],
  },
  {
    title: "Atelier et impression",
    rows: [
      { feature: "File de production et fichiers prêts", starter: true, pro: true, business: true },
      { feature: "PrintosSync Windows / macOS / Linux", starter: true, pro: true, business: true },
      { feature: "Mode service (tourne session fermée)", starter: false, pro: true, business: true },
      { feature: "Pilotage des postes depuis le web", starter: true, pro: true, business: true },
    ],
  },
  {
    title: "Finance et pilotage",
    rows: [
      { feature: "Tableau de bord temps réel", starter: true, pro: true, business: true },
      { feature: "Relevés de compte clients", starter: true, pro: true, business: true },
      { feature: "Dépenses et marge", starter: true, pro: true, business: true },
      { feature: "Export CSV comptable", starter: false, pro: true, business: true },
      { feature: "Commandes supprimées (corbeille) et historique", starter: true, pro: true, business: true },
    ],
  },
  {
    title: "Sécurité et accompagnement",
    rows: [
      { feature: "Base de données et stockage dédiés par client", starter: true, pro: true, business: true },
      { feature: "Sauvegardes", starter: "Hebdomadaires", pro: "Quotidiennes (7 j)", business: "Quotidiennes (30 j)" },
      { feature: "Domaine personnalisé", starter: false, pro: false, business: true },
      { feature: "Support", starter: "E-mail", pro: "E-mail + WhatsApp prioritaire", business: "Gestionnaire dédié" },
      { feature: "Formation d'onboarding", starter: "Vidéos", pro: "Vidéos + 1 h visio", business: "Vidéos + 2 h visio + import" },
    ],
  },
]
