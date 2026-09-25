// Modules de l'application, présentés sur /fonctionnalites et en résumé sur l'accueil.
// Les `icon` sont des noms lucide-react (résolus dans components/Icon.tsx).
// `mockup` référence une illustration SVG dans components/mockups/.

export type Feature = {
  slug: string
  icon: string
  title: string
  short: string
  description: string
  bullets: string[]
  mockup: "orders" | "workshop" | "delivery" | "cod" | "clients" | "store" | "agent" | "dashboard"
  color: string // classe tailwind de fond de l'icône
}

export const features: Feature[] = [
  {
    slug: "commandes",
    icon: "ClipboardList",
    title: "Commandes et devis",
    short: "Prise de commande en 30 secondes, du devis à la livraison.",
    description:
      "Créez une commande avec ses articles, options (format, grammage, finition), matériaux et fichiers. Générez un devis, faites valider une maquette, encaissez une avance : le reste à payer se calcule tout seul, ajustements et livraison compris.",
    bullets: [
      "Articles avec options et unités de matériaux",
      "Devis PDF et maquettes à valider par le client",
      "Avance, ajustement manuel, livraison offerte",
      "Statuts de production de « Nouvelle » à « Livrée »",
      "Corbeille des commandes supprimées avec détail complet",
    ],
    mockup: "orders",
    color: "bg-blue-600",
  },
  {
    slug: "atelier",
    icon: "Printer",
    title: "Atelier et impression",
    short: "Les fichiers prêts arrivent seuls sur les postes d'impression.",
    description:
      "Quand une commande passe en production, ses fichiers sont marqués « prêts ». PrintosSync installé sur chaque poste les télécharge en arrière-plan dans le bon dossier, même quand personne n'est connecté. Plus de clés USB, plus de fichiers envoyés par WhatsApp.",
    bullets: [
      "File de production par machine ou par opérateur",
      "Agent Windows, macOS et Linux en mode service",
      "Comptes de service dédiés (jamais un compte utilisateur)",
      "Pilotage des postes depuis le web : pause, reprise, réglages",
      "Historique et erreurs de synchronisation par poste",
    ],
    mockup: "agent",
    color: "bg-violet-600",
  },
  {
    slug: "livraison",
    icon: "Truck",
    title: "Livraison multi-transporteurs",
    short: "Ameex, Olivraison, Ozone Express ou vos propres livreurs.",
    description:
      "Créez un ramassage, imprimez les bons et étiquettes, et laissez les statuts remonter automatiquement automatiquement. Chaque vendeur peut créer les ramassages de ses propres commandes ; on sait toujours qui a créé quoi.",
    bullets: [
      "Bons de livraison et étiquettes PDF régénérables",
      "Statuts transporteur en temps réel",
      "Livreurs internes, tournées et zones de livraison",
      "Suppression bloquée dès que le colis est ramassé",
      "Frais de livraison par zone, livraison offerte",
    ],
    mockup: "delivery",
    color: "bg-amber-500",
  },
  {
    slug: "cod",
    icon: "Banknote",
    title: "Contre-remboursement (COD) et finance",
    short: "Le COD encaissé doit égaler le reste à payer : sinon, un badge vous alerte.",
    description:
      "À la livraison, le montant collecté par le transporteur est rapproché du reste à payer (prix – avance). Tout écart apparaît immédiatement dans la liste des commandes et dans l'export. Relevés, dépenses, marge : vous savez où en est votre trésorerie.",
    bullets: [
      "Rapprochement COD automatique à la livraison",
      "Badge d'écart et filtre dédié",
      "Relevés de compte par client et par revendeur",
      "Dépenses, marge par commande",
      "Export CSV avec brut, ajustements, net, livraison, avance, reste, COD",
    ],
    mockup: "cod",
    color: "bg-emerald-600",
  },
  {
    slug: "clients",
    icon: "Users",
    title: "Clients, fidélité et promotions",
    short: "Fichier client propre, points gagnés à la livraison, codes promo.",
    description:
      "Détection de doublons, historique des commandes, relevé de compte. Le programme de fidélité ne crédite les points que lorsque la commande est réellement livrée ou récupérée en magasin. Codes promo et promotions automatiques par période.",
    bullets: [
      "Fiches clients avec fusion des doublons",
      "Points de fidélité à la livraison ou au retrait",
      "Codes promo et promotions automatiques",
      "Notifications SMS / e-mail aux étapes clés",
      "Revendeurs externes avec périmètre restreint",
    ],
    mockup: "clients",
    color: "bg-pink-600",
  },
  {
    slug: "boutique",
    icon: "Store",
    title: "Boutique en ligne",
    short: "Vos produits en vitrine, les commandes web arrivent dans le même flux.",
    description:
      "Publiez votre catalogue sur une boutique publique synchronisée avec votre back-office. Une commande passée en ligne arrive directement dans la file de production, avec ses fichiers et son mode de livraison.",
    bullets: [
      "Catalogue synchronisé (produits, options, prix)",
      "Commande en ligne avec upload de fichiers",
      "Même flux de production et de livraison",
      "Déploiement séparé et sécurisé (instance publique isolée)",
    ],
    mockup: "store",
    color: "bg-cyan-600",
  },
  {
    slug: "pilotage",
    icon: "LayoutDashboard",
    title: "Tableau de bord et multi-sites",
    short: "Ce qui se vend, ce qui est en retard, ce qui reste à encaisser.",
    description:
      "Chiffre d'affaires, commandes par statut, livraisons en cours, encaissements attendus : un tableau de bord par point de vente et une vue consolidée. Chaque utilisateur voit exactement ce qui le concerne selon son rôle.",
    bullets: [
      "Indicateurs temps réel par période",
      "Rôles : admin, opérateur, vendeur interne, revendeur externe, livreur",
      "Plusieurs points de vente dans un même espace",
      "Journal des actions (qui a fait quoi, quand)",
    ],
    mockup: "dashboard",
    color: "bg-slate-700",
  },
  {
    slug: "securite",
    icon: "ShieldCheck",
    title: "Sécurité et données",
    short: "Une base de données et un stockage dédiés à chaque client.",
    description:
      "Chaque espace client dispose de sa propre base de données et de son propre espace de stockage chiffré pour les fichiers d'impression. Vos données ne sont jamais mélangées à celles d'un autre client, et vous pouvez tout exporter à tout moment.",
    bullets: [
      "Base de données isolée par client",
      "Stockage de fichiers dédié et chiffré",
      "Sauvegardes automatiques",
      "Export complet (CSV, fichiers) sur demande",
      "Hébergé sur Amazon Web Services (AWS), connexion sécurisée",
    ],
    mockup: "dashboard",
    color: "bg-slate-900",
  },
]

export const featureBySlug = (slug: string) => features.find((f) => f.slug === slug)

// Étapes « Comment ça marche » (accueil)
export const steps = [
  { n: 1, title: "Demandez votre espace", text: "Choisissez un forfait et écrivez-nous sur WhatsApp. Un conseiller crée votre espace sous un jour ouvré et vous envoie vos accès." },
  { n: 2, title: "Paramétrez", text: "Produits, options, matériaux, transporteurs, TVA. Importez vos clients depuis un fichier CSV." },
  { n: 3, title: "Vendez et produisez", text: "Prise de commande, avance, fichiers vers l'atelier, bon de livraison : tout s'enchaîne." },
  { n: 4, title: "Encaissez sans écart", text: "Le COD est rapproché du reste à payer ; le tableau de bord vous dit ce qui reste à récupérer." },
]

// Métiers ciblés (accueil)
export const audiences = [
  { title: "Imprimerie numérique", text: "Cartes de visite, flyers, affiches : gros volume de petites commandes, fichiers à imprimer chaque jour." },
  { title: "Grand format et signalétique", text: "Bâches, panneaux, vinyle : devis, maquette à valider, production et pose ou livraison." },
  { title: "Objets publicitaires", text: "Textile, mugs, packaging : options par article, matériaux et sous-traitance." },
  { title: "Réseaux et franchises", text: "Plusieurs points de vente, revendeurs externes, catalogue commun et vue consolidée." },
]

// Chiffres mis en avant (accueil) — à ajuster avec vos vraies statistiques
export const stats = [
  { value: "24 h", label: "pour recevoir votre espace" },
  { value: "0 écart", label: "entre COD encaissé et reste à payer" },
  { value: "3", label: "transporteurs connectés + livreurs internes" },
  { value: "24/7", label: "PrintosSync en mode service" },
]

// Témoignages : FICTIFS, à remplacer par de vrais retours clients avant mise en ligne
export const testimonials = [
  {
    name: "Exemple — Atelier de Casablanca",
    role: "Gérant, imprimerie numérique",
    text: "Avant on perdait 20 minutes par commande à retrouver le fichier et à vérifier ce que le livreur avait encaissé. Maintenant tout est dans la commande.",
  },
  {
    name: "Exemple — Signalétique à Rabat",
    role: "Responsable production",
    text: "PrintosSync tourne en service sur le poste de la machine : les fichiers sont déjà là quand l'opérateur arrive.",
  },
  {
    name: "Exemple — Réseau de 4 points de vente",
    role: "Directrice",
    text: "Chaque vendeur voit ses commandes et ses ramassages, moi je vois tout. Et le rapprochement COD nous a fait retrouver des écarts qu'on ne voyait pas.",
  },
]
