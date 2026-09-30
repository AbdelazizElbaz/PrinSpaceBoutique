import { site, money } from "../site.config"
import { plans } from "./plans"
import type { LegalContent } from "../types"

// Modèles à faire relire par un conseil juridique avant mise en ligne.
const b = site.brand
const c = site.company

export const legal: LegalContent = {
  eyebrow: "Légal",
  contactTitle: "Contact",
  cgv: {
    title: "Conditions générales de vente et d'utilisation",
    updated: "Dernière mise à jour : septembre 2026.",
    intro: `Ces conditions régissent l'abonnement au service ${b}, édité par ${c.legalName} (« l'Éditeur »), et son utilisation par le client professionnel (« le Client »).`,
    sections: [
      { h: "1. Objet", p: [`${b} est un logiciel en ligne de gestion pour imprimeries et ateliers graphiques : commandes, devis, production, livraison, encaissement, clients, boutique en ligne et agent de synchronisation d'impression (${site.agentName}). Le service est accessible via un espace dédié au Client à l'adresse « sous-domaine.${site.appDomain} ».`] },
      { h: "2. Création de l'espace et période d'essai", p: [`Le Client demande son espace depuis le site ${site.domain} (WhatsApp ou formulaire) ; l'Éditeur le crée et lui communique ses accès. Il bénéficie d'une période d'essai gratuite de ${site.trialDays} jours, sans engagement ni moyen de paiement. À l'issue de l'essai, sans souscription d'un forfait, l'espace est suspendu ; les données sont conservées 30 jours puis supprimées.`] },
      { h: "3. Forfaits et prix", p: [`Les forfaits en vigueur sont : ${plans.map((p) => `${p.name} (${money(p.monthly)} HT par mois, ou ${money(p.yearlyMonthly)} HT par mois en engagement annuel)`).join(" ; ")}. Les prix s'entendent hors taxes ; la TVA en vigueur au Maroc s'applique. Chaque forfait comporte des limites d'usage (utilisateurs, commandes mensuelles, stockage, points de vente) décrites sur la page Tarifs. L'Éditeur peut modifier ses prix avec un préavis de 30 jours ; la modification s'applique à la prochaine échéance.`] },
      { h: "4. Paiement", p: ["Le paiement s'effectue par virement bancaire, mensuellement ou annuellement d'avance, sur présentation d'une facture. Le forfait est activé à réception du paiement. En cas de retard de paiement supérieur à 15 jours après l'échéance, l'accès à l'espace peut être suspendu jusqu'à régularisation, sans suppression des données pendant 30 jours."] },
      { h: "5. Durée, changement de forfait et résiliation", p: ["L'abonnement mensuel est reconduit tacitement chaque mois et résiliable à tout moment, sans frais, avec effet à la fin du mois en cours. L'abonnement annuel court jusqu'à son terme. Le passage à un forfait supérieur est immédiat avec facturation au prorata ; le passage à un forfait inférieur prend effet à l'échéance suivante sous réserve du respect des limites du nouveau forfait."] },
      { h: "6. Obligations de l'Éditeur", ul: ["Fournir un service disponible 24 h/24, hors maintenance planifiée annoncée au moins 24 h à l'avance et hors cas de force majeure, avec un objectif de disponibilité mensuelle de 99,5 %.", "Héberger les données du Client dans une base de données et un espace de stockage qui lui sont dédiés, et effectuer les sauvegardes selon la fréquence du forfait.", "Assurer le support selon le forfait souscrit, aux horaires indiqués sur le site.", "Ne pas accéder aux données du Client sauf à sa demande pour le support, ou pour des opérations techniques strictement nécessaires."] },
      { h: "7. Obligations du Client", ul: ["Fournir des informations exactes lors de l'inscription et les tenir à jour.", "Conserver la confidentialité de ses identifiants et de ceux de ses utilisateurs et comptes de service ; toute action réalisée depuis son espace est réputée faite par lui.", "Utiliser le service conformément à la loi, notamment en matière de données personnelles de ses propres clients, et ne pas y déposer de contenu illicite.", "Disposer des droits sur les fichiers déposés pour impression."] },
      { h: "8. Données et réversibilité", p: ["Le Client reste propriétaire de ses données. Il peut les exporter à tout moment (CSV depuis l'application ; export complet sur demande). À la résiliation, les données sont conservées 30 jours pour permettre l'export, puis supprimées définitivement, sauvegardes comprises dans un délai supplémentaire de 30 jours."] },
      { h: "9. Responsabilité", p: ["Le service est fourni en l'état, dans le cadre d'une obligation de moyens. L'Éditeur n'est pas responsable des pertes indirectes (perte de chiffre d'affaires, de clientèle, de données résultant d'une utilisation non conforme). En tout état de cause, la responsabilité de l'Éditeur est limitée au montant des sommes versées par le Client au cours des douze derniers mois. Les intégrations avec des transporteurs tiers (Ameex, Olivraison, Ozone Express…) dépendent de leurs services respectifs ; l'Éditeur ne répond pas de leurs indisponibilités ni des montants effectivement collectés par eux."] },
      { h: "10. Propriété intellectuelle", p: ["Le logiciel, sa documentation, ses marques et ses contenus restent la propriété exclusive de l'Éditeur. Le Client bénéficie d'un droit d'utilisation non exclusif et non transférable pendant la durée de l'abonnement."] },
      { h: "11. Évolutions du service", p: ["L'Éditeur fait évoluer le service en continu. Les mises à jour sont déployées sans intervention du Client. Les fonctionnalités substantielles supprimées font l'objet d'un préavis de 60 jours."] },
      { h: "12. Droit applicable", p: [`Les présentes conditions sont soumises au droit marocain. À défaut de résolution amiable, tout litige est porté devant les tribunaux compétents de ${c.city}.`] },
    ],
  },
  privacy: {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : septembre 2026.",
    intro: `${c.legalName} traite des données personnelles dans le cadre du site ${site.domain} et du service ${b}, conformément à la loi marocaine 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.`,
    sections: [
      { h: "1. Données collectées sur le site", p: ["Formulaires de contact et d'inscription : nom, société, e-mail, téléphone, ville, taille de l'atelier, message, forfait choisi, sous-domaine. Données techniques : adresse IP, navigateur, pages consultées (mesure d'audience anonymisée). Nous n'utilisons pas de cookies publicitaires."] },
      { h: "2. Finalités", ul: ["Répondre à vos demandes de démonstration et de contact.", "Créer et administrer votre espace, vous envoyer vos accès et vos factures.", "Vous informer des évolutions du service (vous pouvez vous désinscrire à tout moment).", "Assurer la sécurité du service et prévenir les abus."] },
      { h: "3. Données de vos propres clients", p: [`Les données que vous saisissez dans votre espace (vos clients, commandes, fichiers) sont traitées pour votre compte : vous en êtes le responsable de traitement, ${c.legalName} en est le sous-traitant. Elles sont stockées dans une base de données et un espace de stockage dédiés à votre espace, chiffrés au repos, et ne sont jamais utilisées à d'autres fins que la fourniture du service.`] },
      { id: "publicite", h: "4. Connexion de vos comptes publicitaires (Facebook / Meta et Google Ads)", p: [`Si l'administrateur de votre espace le choisit, ${b} peut se connecter, en lecture seule, à vos comptes publicitaires Facebook / Meta Ads et Google Ads (bouton « Continuer avec Facebook » ou « Continuer avec Google », page Dépenses), afin d'enregistrer automatiquement vos dépenses publicitaires dans votre comptabilité interne.`], ul: [
        "Données auxquelles nous accédons : l'identifiant, le nom et la devise de chaque compte publicitaire que vous autorisez ; le montant dépensé par jour sur ce compte ; le nom (Facebook) ou l'adresse e-mail (Google) du compte qui a donné l'autorisation, pour l'afficher à côté du compte lié.",
        "Autorisations demandées : Facebook / Meta « ads_read » et « business_management » ; Google « https://www.googleapis.com/auth/adwords », « openid » et « email ». Nous n'utilisons ces accès qu'en lecture : nous ne créons, ne modifions ni ne supprimons aucune campagne, annonce ou audience.",
        "Utilisation : uniquement pour créer, dans votre espace, une dépense « ADS Facebook » ou « ADS Google » par jour et par compte (montant, date, compte) et afficher le total du mois. Aucune autre finalité.",
        "Nous ne vendons pas ces données, ne les partageons avec aucun tiers, ne les utilisons pas pour de la publicité, du profilage ou le ciblage, et ne les utilisons pas pour entraîner des modèles d'intelligence artificielle.",
        "Sécurité : les jetons d'accès fournis par Meta et Google sont chiffrés dans la base de données de votre espace et ne sont jamais affichés ni transmis au navigateur. Seul l'administrateur de votre espace peut connecter ou déconnecter un compte.",
        "Conservation : les jetons sont conservés tant que le compte reste connecté et supprimés dès sa déconnexion ; les dépenses importées font partie de vos données comptables (conservées selon la section 8, supprimables à la déconnexion).",
      ] },
      { id: "google", h: "5. Données Google : utilisation limitée", p: ["L'utilisation et le transfert vers toute autre application, par " + b + ", des informations reçues des API Google respectent le Règlement sur les données utilisateur des services d'API Google (Google API Services User Data Policy), y compris les exigences d'utilisation limitée (Limited Use).", "PrintIOS's use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy (https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.", "Les données Google Ads ne sont lues qu'à la demande de l'administrateur qui a connecté son compte, uniquement pour la fonctionnalité décrite en section 4, et ne sont consultées par aucune personne de notre équipe, sauf avec votre accord explicite pour le support, pour des raisons de sécurité ou pour respecter la loi."] },
      { id: "suppression", h: "6. Suppression de vos données et révocation des accès", p: ["Vous pouvez à tout moment retirer l'accès à vos comptes publicitaires et demander la suppression des données associées :"], ul: [
        "Depuis " + b + " : page Dépenses → carte « Publicité Facebook » ou « Publicité Google Ads » → icône de corbeille à côté du compte → « Déconnecter ». Le jeton d'accès est supprimé immédiatement ; vous pouvez aussi choisir de supprimer les dépenses déjà importées.",
        "Depuis Facebook : Paramètres et confidentialité → Paramètres → Sécurité et connexion → Intégrations professionnelles (Business Integrations) → " + b + " → Supprimer.",
        "Depuis Google : myaccount.google.com → Sécurité → Vos connexions à des applications et services tiers → " + b + " → Supprimer tout accès.",
        `Sur simple demande : contactez-nous au ${site.contact.phone} (téléphone ou WhatsApp) ou à ${site.contact.email} en précisant votre espace ; nous supprimons les jetons et, si vous le souhaitez, les données importées sous 30 jours et vous le confirmons.`,
        "Quand vous révoquez l'accès depuis Facebook ou Google, " + b + " ne peut plus lire aucune donnée ; le compte apparaît alors « à reconnecter » et nous supprimons son jeton.",
      ] },
      { h: "7. Hébergement et sécurité", p: ["Le service est hébergé sur une infrastructure Amazon Web Services (AWS) avec connexion sécurisée. Les mots de passe ne sont jamais stockés en clair. Les accès de PrintiosSync sont révocables à tout moment. Les sauvegardes sont chiffrées."] },
      { h: "8. Durée de conservation", p: ["Demandes de contact : 24 mois. Données de compte : pendant la durée de l'abonnement puis 30 jours après résiliation (60 jours pour les sauvegardes). Données de facturation : durée légale."] },
      { h: "9. Destinataires", p: ["Nos équipes commerciale et support, ainsi que nos prestataires techniques (hébergement, e-mail transactionnel) strictement pour les besoins du service. Les transporteurs que vous connectez reçoivent uniquement les informations nécessaires à la livraison des commandes que vous leur confiez."] },
      { h: "10. Vos droits", p: [`Vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos données. Écrivez-nous à ${site.contact.email}. Ce traitement fait l'objet des formalités requises auprès de la CNDP.`] },
    ],
  },
  notice: {
    title: "Mentions légales",
    updated: "",
    intro: "",
    sections: [
      { h: "Éditeur du site", p: [`${c.legalName} — ${c.address}. ICE : ${c.ice}. RC : ${c.rc}. E-mail : ${site.contact.email}. Téléphone : ${site.contact.phone}.`] },
      { h: "Directeur de la publication", p: [`Le représentant légal de ${c.legalName}.`] },
      { h: "Hébergement", p: ["Site et service hébergés sur une infrastructure Amazon Web Services (AWS). Les données des clients sont stockées dans des bases et espaces de stockage dédiés."] },
      { h: "Propriété intellectuelle", p: ["L'ensemble des contenus de ce site (textes, illustrations, marques, logiciel) est protégé. Toute reproduction sans autorisation est interdite. Les marques de transporteurs citées (Ameex, Olivraison, Ozone Express) appartiennent à leurs propriétaires respectifs."] },
    ],
  },
}
