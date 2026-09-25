// Vidéothèque de formation (/formation). `youtubeId` vide = vidéo à enregistrer :
// la carte affiche alors « Bientôt » avec le script. Remplissez l'id YouTube
// (non répertorié) dès que la vidéo est en ligne.

export type Video = {
  id: string
  track: "demarrer" | "vendre" | "produire" | "livrer" | "gerer" | "boutique"
  title: string
  duration: string
  youtubeId: string
  summary: string
  // Script complet : ce que l'on montre et ce que l'on dit
  script: { screen: string; say: string }[]
}

export const tracks: { id: Video["track"]; title: string; audience: string; description: string }[] = [
  { id: "demarrer", title: "Démarrer", audience: "Administrateur", description: "Créer son espace, le paramétrer et inviter son équipe." },
  { id: "vendre", title: "Vendre", audience: "Vendeur, opérateur", description: "Prendre une commande, gérer l'avance, suivre les statuts." },
  { id: "produire", title: "Produire", audience: "Atelier", description: "Installer PrintiosSync et recevoir les fichiers automatiquement." },
  { id: "livrer", title: "Livrer", audience: "Opérateur, livreur", description: "Ramassages, bons de livraison, suivi et encaissement COD." },
  { id: "gerer", title: "Gérer", audience: "Gérant, comptable", description: "Tableau de bord, relevés, dépenses, fidélité, exports." },
  { id: "boutique", title: "Boutique en ligne", audience: "Administrateur", description: "Publier son catalogue et recevoir des commandes web." },
]

export const videos: Video[] = [
  {
    id: "creer-espace",
    track: "demarrer",
    title: "Demander son espace et se connecter",
    duration: "3 min",
    youtubeId: "",
    summary: "De la demande d'essai (WhatsApp) à la première connexion avec les accès reçus.",
    script: [
      { screen: "Page Essai gratuit du site", say: "On choisit un forfait et on clique sur le bouton WhatsApp : le message est pré-rempli, il suffit de l'envoyer." },
      { screen: "E-mail / WhatsApp reçu", say: "Sous un jour ouvré, on reçoit l'adresse de son espace et ses identifiants." },
      { screen: "Redirection vers l'app, page de connexion", say: "On se connecte avec le mot de passe reçu par e-mail, puis on le change dans Mon compte." },
    ],
  },
  {
    id: "parametrage",
    track: "demarrer",
    title: "Premier paramétrage : atelier, TVA, produits, matériaux",
    duration: "6 min",
    youtubeId: "",
    summary: "Renseigner les informations de l'atelier, créer les premiers produits avec leurs options et les matériaux consommés.",
    script: [
      { screen: "Paramètres → Atelier", say: "Nom, logo, coordonnées : ils apparaissent sur les devis et bons de livraison." },
      { screen: "Produits → Nouveau", say: "On crée « Carte de visite » avec ses options : format, grammage, recto/verso, pelliculage. Chaque option peut modifier le prix." },
      { screen: "Matériaux", say: "On déclare les matériaux (papier 350 g, vinyle…) et leurs unités pour suivre la consommation et la marge." },
      { screen: "Paramètres → TVA et numérotation", say: "Taux de TVA et format des numéros de commande." },
    ],
  },
  {
    id: "utilisateurs-roles",
    track: "demarrer",
    title: "Inviter son équipe et comprendre les rôles",
    duration: "4 min",
    youtubeId: "",
    summary: "Créer les utilisateurs et choisir le bon rôle : admin, opérateur, vendeur interne, revendeur externe, livreur.",
    script: [
      { screen: "Utilisateurs → Nouveau", say: "Identifiant, mot de passe, rôle. Le vendeur interne ne voit que ses commandes ; le revendeur externe ne voit ni promo, ni livraison, ni maquettes/devis." },
      { screen: "Connexion avec un compte vendeur", say: "On montre concrètement ce que voit un vendeur par rapport à l'administrateur." },
    ],
  },
  {
    id: "transporteurs",
    track: "demarrer",
    title: "Connecter un transporteur (Ameex, Olivraison, Ozone Express)",
    duration: "5 min",
    youtubeId: "",
    summary: "Saisir les identifiants du transporteur, définir les frais par zone et tester la création d'un colis.",
    script: [
      { screen: "Livraison → Paramètres → Transporteurs", say: "On saisit les identifiants fournis par le transporteur et le type d'étiquette." },
      { screen: "Zones et frais", say: "Frais de livraison par ville/zone ; option livraison offerte au-delà d'un montant." },
      { screen: "Commande test → Créer un ramassage", say: "On vérifie que le bon de livraison se génère et que le statut remonte." },
    ],
  },
  {
    id: "prise-commande",
    track: "vendre",
    title: "Prendre une commande de A à Z",
    duration: "7 min",
    youtubeId: "",
    summary: "Client, articles, options, fichiers, avance, ajustement : la commande complète et son reste à payer.",
    script: [
      { screen: "Commandes → Nouvelle", say: "On choisit ou crée le client, puis on ajoute les articles avec leurs options et quantités." },
      { screen: "Fichiers", say: "On dépose les fichiers d'impression ; ils partiront vers l'atelier quand la commande passera en production." },
      { screen: "Avance et ajustement", say: "Le client paie 200 DH d'avance ; on applique une remise de 46 DH. Le reste à payer se recalcule, livraison comprise." },
      { screen: "Liste des commandes", say: "On lit la colonne Prix (net, brut barré, ajustement, avance, livraison) et la colonne Reste à payer." },
    ],
  },
  {
    id: "devis-maquette",
    track: "vendre",
    title: "Devis et maquette à valider",
    duration: "4 min",
    youtubeId: "",
    summary: "Envoyer un devis PDF, faire valider une maquette par le client avant production.",
    script: [
      { screen: "Commande → Devis", say: "Génération du devis PDF avec le logo de l'atelier, envoi par e-mail ou WhatsApp." },
      { screen: "Maquettes", say: "On dépose la maquette ; le client valide ou demande une correction ; la commande ne part en production qu'une fois validée." },
    ],
  },
  {
    id: "statuts-suivi",
    track: "vendre",
    title: "Suivre les statuts et modifier une commande",
    duration: "4 min",
    youtubeId: "",
    summary: "Le cycle de vie d'une commande, ce qu'on peut modifier à chaque étape, et la corbeille.",
    script: [
      { screen: "Filtres par statut", say: "Nouvelle, en production, prête, en livraison, livrée, récupérée en magasin." },
      { screen: "Actions → Modifier l'avance / Supprimer", say: "L'avance se modifie depuis Actions ; la suppression est possible jusqu'au ramassage du colis." },
      { screen: "Commandes supprimées", say: "Les commandes supprimées gardent tout leur détail et restent consultables." },
    ],
  },
  {
    id: "installer-agent",
    track: "produire",
    title: "Installer PrintiosSync sur un poste",
    duration: "5 min",
    youtubeId: "",
    summary: "Télécharger l'installeur, créer un compte de service et connecter l'agent.",
    script: [
      { screen: "Synchronisation → Installer l'agent", say: "On télécharge l'installeur Windows (ou macOS/Linux) depuis l'espace." },
      { screen: "Synchronisation → Comptes de l'agent → Créer", say: "On crée « Poste atelier 1 » : identifiant + mot de passe généré, affiché une seule fois." },
      { screen: "Fenêtre de l'agent", say: "Adresse de votre espace, bouton Tester, puis identifiant et mot de passe du compte de service. L'agent est connecté durablement, sans mot de passe stocké." },
    ],
  },
  {
    id: "dossiers-sync",
    track: "produire",
    title: "Choisir les dossiers à synchroniser",
    duration: "4 min",
    youtubeId: "",
    summary: "Créer une instance de synchronisation : dossier source, dossier local, suppression des fichiers retirés.",
    script: [
      { screen: "Agent → Explorateur (colonne gauche)", say: "On navigue dans le dossier d'impression et on clique « Synchroniser ce dossier… »." },
      { screen: "Dialog nouvelle instance", say: "Nom, dossier local de destination, option de suppression locale des fichiers retirés." },
      { screen: "Liste des fichiers", say: "Les fichiers arrivent ; on voit la progression, les tentatives et les erreurs." },
    ],
  },
  {
    id: "mode-service",
    track: "produire",
    title: "Mode service : synchroniser même session fermée",
    duration: "3 min",
    youtubeId: "",
    summary: "Installer l'agent comme service Windows et le piloter depuis le web.",
    script: [
      { screen: "Agent → Réglages → Mode service → Installer", say: "L'agent tourne désormais comme service : il continue quand personne n'est connecté." },
      { screen: "Espace web → Synchronisation → Postes", say: "Depuis le web : pause, reprise, vérification immédiate, réglages de parallélisme, mise à jour." },
    ],
  },
  {
    id: "creer-ramassage",
    track: "livrer",
    title: "Créer un ramassage et imprimer le bon de livraison",
    duration: "5 min",
    youtubeId: "",
    summary: "Sélectionner les commandes prêtes, créer le ramassage chez le transporteur, imprimer bons et étiquettes.",
    script: [
      { screen: "Livraison → Ramassages → Nouveau", say: "On sélectionne les commandes prêtes ; le montant COD transmis est le reste à payer de chaque commande." },
      { screen: "Document du ramassage", say: "Bon de livraison ou étiquettes, bouton Imprimer en haut à droite, enregistrement sous « Bordereau-Transporteur-Réf.pdf »." },
      { screen: "Régénérer", say: "Si le document est perdu, on le régénère à partir de la réponse conservée du transporteur." },
    ],
  },
  {
    id: "suivi-cod",
    track: "livrer",
    title: "Suivi des statuts et rapprochement COD",
    duration: "5 min",
    youtubeId: "",
    summary: "Les statuts remontent tout seuls ; à la livraison, on vérifie que le COD encaissé égale le reste à payer.",
    script: [
      { screen: "Commande → Historique de livraison", say: "Les statuts du transporteur arrivent automatiquement : pris en charge, en cours, livré, retour." },
      { screen: "Liste des commandes livrées", say: "Le COD collecté est enregistré ; si l'écart avec le reste à payer n'est pas nul, un badge le signale." },
      { screen: "Export CSV", say: "Colonnes brut, ajustement, net, livraison, avance, reste, COD attendu / collecté : de quoi pointer avec le transporteur." },
    ],
  },
  {
    id: "livreurs-internes",
    track: "livrer",
    title: "Livreurs internes et tournées",
    duration: "4 min",
    youtubeId: "",
    summary: "Créer ses livreurs, affecter des commandes, enregistrer l'encaissement.",
    script: [
      { screen: "Livraison → Livreurs internes", say: "Comptes livreurs avec rôle dédié ; zones et frais." },
      { screen: "Affectation et tournée", say: "On affecte les commandes du jour ; le livreur marque livré et saisit le montant encaissé." },
    ],
  },
  {
    id: "tableau-de-bord",
    track: "gerer",
    title: "Lire le tableau de bord",
    duration: "4 min",
    youtubeId: "",
    summary: "Chiffre d'affaires, commandes par statut, livraisons en cours, encaissements attendus.",
    script: [
      { screen: "Tableau de bord", say: "Les indicateurs par période et par point de vente ; ce qui est « en attente de livraison » et ce qui reste à encaisser." },
    ],
  },
  {
    id: "releves-depenses",
    track: "gerer",
    title: "Relevés de compte, dépenses et marge",
    duration: "5 min",
    youtubeId: "",
    summary: "Relevé par client ou revendeur, saisie des dépenses, marge par commande.",
    script: [
      { screen: "Relevés de compte", say: "Pour un client ou un revendeur : commandes, avances, soldes." },
      { screen: "Dépenses", say: "Saisie des dépenses par catégorie ; la marge tient compte des matériaux consommés." },
    ],
  },
  {
    id: "fidelite-promo",
    track: "gerer",
    title: "Fidélité, codes promo et promotions automatiques",
    duration: "4 min",
    youtubeId: "",
    summary: "Paramétrer les points (crédités à la livraison ou au retrait), créer des codes promo et des promotions par période.",
    script: [
      { screen: "Paramètres fidélité", say: "Points par dirham dépensé ; ils ne sont crédités que lorsque la commande est livrée ou récupérée." },
      { screen: "Codes promo / Promotions auto", say: "Code à usage limité, promotion automatique sur une période ou un produit." },
    ],
  },
  {
    id: "boutique-en-ligne",
    track: "boutique",
    title: "Activer la boutique en ligne",
    duration: "6 min",
    youtubeId: "",
    summary: "Publier le catalogue, personnaliser la boutique, recevoir une commande web dans le flux de production.",
    script: [
      { screen: "Boutique → Paramètres", say: "Nom, logo, couleurs, produits publiés et options visibles." },
      { screen: "Boutique publique", say: "Un client commande et dépose son fichier." },
      { screen: "Back-office → Commandes", say: "La commande web arrive avec ses fichiers et son mode de livraison, comme une commande saisie au comptoir." },
    ],
  },
]

export const videosByTrack = (track: Video["track"]) => videos.filter((v) => v.track === track)
