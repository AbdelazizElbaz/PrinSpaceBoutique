import { site } from "../site.config"

export type FaqItem = { q: string; a: string }
export type FaqGroup = { id: string; title: string; items: FaqItem[] }

const b = site.brand

export const faq: FaqGroup[] = [
  {
    id: "demarrage",
    title: "Démarrage et essai",
    items: [
      {
        q: `Comment démarrer avec ${b} ?`,
        a: `Cliquez sur « Essai gratuit », choisissez votre forfait et contactez-nous sur WhatsApp (ou laissez vos coordonnées). Un conseiller crée votre espace sous un jour ouvré et vous envoie vos accès par e-mail et WhatsApp ; vous pouvez commencer à paramétrer immédiatement.`,
      },
      {
        q: "L'essai est-il vraiment gratuit ? Faut-il une carte bancaire ?",
        a: `Oui, ${site.trialDays} jours sans engagement et sans carte bancaire. À la fin de l'essai, vous choisissez un forfait et réglez par virement ; sinon l'espace est simplement suspendu (vos données sont conservées 30 jours, le temps de décider).`,
      },
      {
        q: "Combien de temps faut-il pour être opérationnel ?",
        a: "Une demi-journée pour un atelier standard : créer vos produits et options, saisir vos matériaux, connecter un transporteur et importer vos clients depuis un fichier CSV. Nos vidéos de formation vous guident étape par étape, et les forfaits Pro et Business incluent une session d'onboarding en visio.",
      },
      {
        q: "Puis-je importer mes clients et mes produits existants ?",
        a: "Oui. Les clients s'importent depuis un fichier CSV (nom, téléphone, e-mail, adresse), avec détection automatique des doublons. Pour les produits et les options, vous pouvez les saisir ou nous envoyer votre catalogue : sur le forfait Business, l'import est fait par notre équipe.",
      },
      {
        q: "Quelle sera l'adresse de mon espace ?",
        a: `Chaque client a sa propre adresse, du type monatelier.${site.appDomain}, communiquée avec vos accès. Sur le forfait Business, vous pouvez utiliser votre propre domaine (commandes.votre-marque.ma).`,
      },
      {
        q: "Faut-il installer quelque chose ?",
        a: `Non pour la gestion : ${b} fonctionne dans le navigateur, sur ordinateur, tablette et téléphone. Seul l'agent d'impression (${site.agentName}) s'installe sur les postes de l'atelier qui doivent recevoir les fichiers automatiquement.`,
      },
    ],
  },
  {
    id: "abonnement",
    title: "Abonnement et paiement",
    items: [
      {
        q: "Quelle est la différence entre les forfaits ?",
        a: "Tous les forfaits donnent accès à la même application. Ils diffèrent par le volume : nombre d'utilisateurs, commandes par mois, stockage de fichiers, points de vente et transporteurs connectés, ainsi que par le niveau d'accompagnement. Le comparatif complet est sur la page Tarifs.",
      },
      {
        q: "Que se passe-t-il si je dépasse une limite de mon forfait ?",
        a: "Rien ne se bloque brutalement : vous recevez une alerte dans l'application et par e-mail quand vous atteignez 80 % puis 100 % d'une limite (commandes du mois, stockage). Au-delà, nous vous proposons de passer au forfait supérieur ; la création de nouvelles commandes reste possible pendant 7 jours de tolérance.",
      },
      {
        q: "Comment payer ?",
        a: `Par virement bancaire, mensuel ou annuel (l'annuel équivaut à 10 mois payés sur 12). Les coordonnées bancaires et la facture sont disponibles dans votre espace, rubrique Abonnement. Dès réception du virement, le forfait est activé et la facture ${"FAC-AAAA-000000"} vous est envoyée. Le paiement par carte sera proposé prochainement.`,
      },
      {
        q: "Les prix sont-ils HT ou TTC ?",
        a: "Les prix affichés sont hors taxes ; la TVA de 20 % s'applique sur la facture. Nous émettons une facture conforme avec votre ICE.",
      },
      {
        q: "Puis-je changer de forfait à tout moment ?",
        a: "Oui. Le passage à un forfait supérieur est immédiat, avec facturation au prorata. Le passage à un forfait inférieur prend effet à la prochaine échéance, à condition que votre usage respecte les limites du nouveau forfait.",
      },
      {
        q: "Comment résilier ?",
        a: "Depuis votre espace ou par simple e-mail, sans frais ni préavis pour le mensuel ; l'annuel court jusqu'à son échéance. Vous pouvez exporter toutes vos données avant la fermeture ; elles sont conservées 30 jours puis supprimées définitivement.",
      },
      {
        q: "Y a-t-il des frais de mise en service ?",
        a: "Non. La création de l'espace est gratuite et automatique. Seules les prestations optionnelles (import de catalogue complexe, instance dédiée, formation sur site) font l'objet d'un devis.",
      },
    ],
  },
  {
    id: "livraison",
    title: "Livraison et contre-remboursement (COD)",
    items: [
      {
        q: "Quels transporteurs sont pris en charge ?",
        a: "Ameex, Olivraison et Ozone Express sont intégrés nativement (création du colis, bon de livraison, étiquettes, suivi des statuts par webhook). Vous pouvez aussi gérer vos propres livreurs avec des tournées et des zones. D'autres transporteurs sont ajoutés régulièrement ; dites-nous lequel vous utilisez.",
      },
      {
        q: "Comment fonctionne le rapprochement COD ?",
        a: "Chaque commande a un « reste à payer » = prix (avec ajustements et livraison) – avance encaissée. À la livraison, le montant collecté par le transporteur est enregistré sur la commande. Si COD encaissé – reste à payer n'est pas égal à zéro, un badge d'écart apparaît dans la liste des commandes et dans l'export CSV, pour que vous le régliez avec le transporteur.",
      },
      {
        q: "Un client a payé une avance : comment ça se passe ?",
        a: "L'avance est saisie sur la commande (espèces, virement, carte). Elle apparaît sous le prix dans la liste, le reste à payer est réduit d'autant, et c'est ce reste qui est transmis comme montant COD au transporteur. L'avance peut être modifiée ou supprimée depuis le menu Actions tant que la commande n'est pas livrée.",
      },
      {
        q: "Qui peut créer un ramassage ?",
        a: "Les administrateurs et opérateurs pour toutes les commandes ; les vendeurs internes uniquement pour leurs propres commandes. Le nom de la personne qui a créé le ramassage est affiché sur celui-ci.",
      },
      {
        q: "Peut-on supprimer une commande déjà en livraison ?",
        a: "Une commande peut être supprimée (mise à la corbeille) tant que le colis n'a pas été physiquement ramassé par le transporteur. Une fois ramassé, la suppression est bloquée. Les commandes supprimées restent consultables dans le menu « Commandes supprimées » avec tout leur détail.",
      },
      {
        q: "Le bon de livraison est-il régénérable ?",
        a: "Oui. La réponse du transporteur est conservée, ce qui permet de régénérer le bon ou les étiquettes à tout moment, de les imprimer directement depuis le navigateur et de les enregistrer avec un nom clair (Bordereau-Transporteur-Référence.pdf).",
      },
    ],
  },
  {
    id: "atelier",
    title: "Atelier et agent d'impression",
    items: [
      {
        q: `À quoi sert l'agent ${site.agentName} ?`,
        a: "Il s'installe sur les postes de l'atelier et télécharge automatiquement, en arrière-plan, les fichiers des commandes prêtes à imprimer dans le dossier de votre choix (par machine, par jour, par client…). Il reprend les téléchargements interrompus, gère les gros fichiers par morceaux et remonte son état dans votre espace web.",
      },
      {
        q: "Sur quels systèmes fonctionne-t-il ?",
        a: "Windows 10/11, macOS (Apple Silicon et Intel) et Linux. Les installeurs se téléchargent depuis la page Synchronisation de votre espace, et l'agent se met à jour tout seul quand une nouvelle version est publiée.",
      },
      {
        q: "Avec quel compte l'agent se connecte-t-il ?",
        a: "Avec un compte de service dédié, créé depuis la page Synchronisation (« Comptes de l'agent »). Ce n'est pas un compte utilisateur : il ne peut rien faire d'autre que synchroniser les fichiers, et vous pouvez le désactiver ou révoquer son jeton à tout moment. Créez-en un par poste ou par atelier.",
      },
      {
        q: "L'agent fonctionne-t-il si personne n'est connecté sur le poste ?",
        a: "Oui, en mode service (forfaits Pro et Business) : l'agent tourne comme service de l'ordinateur et continue à synchroniser même session fermée. La fenêtre de l'agent sert alors uniquement à le piloter.",
      },
      {
        q: "Peut-on avoir plusieurs postes ?",
        a: "Autant que nécessaire (1 poste sur Starter). Chaque poste est identifié de façon stable, garde ses dossiers synchronisés, et vous les pilotez tous depuis le web : pause, reprise, réglages de parallélisme, suppression d'un poste obsolète.",
      },
    ],
  },
  {
    id: "securite",
    title: "Sécurité et données",
    items: [
      {
        q: "Où sont hébergées mes données ?",
        a: "Sur une infrastructure cloud professionnelle (AWS), avec accès HTTPS uniquement. Chaque client dispose de sa propre base de données MySQL et de son propre espace de stockage chiffré pour les fichiers : vos données ne sont jamais mélangées à celles d'un autre client.",
      },
      {
        q: "Qui a accès à mes données ?",
        a: "Vous et les utilisateurs que vous créez, selon leur rôle (administrateur, opérateur, vendeur interne, revendeur externe, livreur). Un revendeur externe, par exemple, ne voit ni les codes promo, ni la livraison, ni les maquettes et devis. Notre équipe n'accède à votre espace qu'à votre demande, pour du support.",
      },
      {
        q: "Y a-t-il des sauvegardes ?",
        a: "Oui, automatiques : hebdomadaires sur Starter, quotidiennes sur Pro (conservées 7 jours) et Business (30 jours). Une restauration peut être demandée au support.",
      },
      {
        q: "Puis-je exporter mes données ?",
        a: "À tout moment : export CSV des commandes, clients et relevés depuis l'application, et export complet (base + fichiers) sur demande, notamment en cas de résiliation.",
      },
      {
        q: "Les mots de passe et les jetons sont-ils protégés ?",
        a: "Les mots de passe sont hachés, jamais stockés en clair. L'agent d'impression n'enregistre jamais de mot de passe : il obtient un jeton dédié, révocable, valable un an.",
      },
    ],
  },
  {
    id: "support",
    title: "Support et évolutions",
    items: [
      {
        q: "Comment contacter le support ?",
        a: `Par e-mail (${site.contact.supportEmail}) sur tous les forfaits, par WhatsApp prioritaire sur Pro, et via votre gestionnaire de compte dédié sur Business. Horaires : ${site.contact.hours}.`,
      },
      {
        q: "Proposez-vous une formation ?",
        a: "Oui : une vidéothèque complète, gratuite, organisée par rôle (vendeur, atelier, livraison, gestion), plus une session d'onboarding en visio sur Pro (1 h) et Business (2 h). Des formations sur site sont possibles sur devis.",
      },
      {
        q: "Puis-je demander une fonctionnalité ?",
        a: "Bien sûr. L'application évolue chaque mois à partir des demandes des ateliers qui l'utilisent ; les mises à jour sont automatiques et sans interruption de service.",
      },
      {
        q: "Peut-on avoir une instance dédiée ?",
        a: "Oui, en option sur le forfait Business : serveur isolé, domaine propre et fenêtre de maintenance convenue, sur devis.",
      },
    ],
  },
]

export const faqFlat = faq.flatMap((g) => g.items)
