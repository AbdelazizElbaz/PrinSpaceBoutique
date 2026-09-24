# PrintManagerOS — site vitrine et tunnel d'abonnement

Site public qui vend l'application (Packspace, marque commerciale **PrintManagerOS**) :
pages marketing, forfaits, FAQ, vidéothèque de formation, et **inscription en
libre-service** qui crée automatiquement l'espace du client (tenant) sur la
plateforme, avec barre de progression.

| Dossier | Stack | Rôle |
|---|---|---|
| `UI/` | Next.js 15, React 19, Tailwind 4, TypeScript | Site vitrine (port 3100) |
| `API/` | Laravel 11, MySQL | Leads, inscriptions → provisioning Packspace, e-mails (port 8100) |
| `docker-compose.yml` | MySQL + API (php-fpm, nginx, queue, scheduler) + UI | Déploiement conteneurisé |

## Changer la marque, le domaine, les coordonnées

Tout est dans **un seul fichier** : `UI/src/content/site.config.ts` (marque,
tagline, domaine du site, domaine des espaces clients, société, e-mails,
téléphone/WhatsApp, RIB, réseaux sociaux). Côté API, les mêmes valeurs sont
dans `API/.env` (`BRAND_NAME`, `APP_TENANT_DOMAIN`, `SITE_URL`, `NOTIFY_EMAIL`).
Les champs marqués `À REMPLACER` sont des placeholders.

Le contenu est séparé du code, dans `UI/src/content/` :

- `plans.ts` — forfaits (prix, limites, inclus) + tableau comparatif
- `features.ts` — modules, étapes « comment ça marche », métiers, chiffres, témoignages (**fictifs, à remplacer**)
- `faq.ts` — 30+ questions/réponses en 6 blocs
- `videos.ts` — vidéothèque : 17 vidéos avec **script complet** (écran + voix off) ; renseigner `youtubeId` quand la vidéo est en ligne

Les « captures d'écran » sont des illustrations SVG (`UI/src/components/mockups/Mockup.tsx`) ;
remplacez-les par de vraies captures dans `UI/public/screens/` quand vous voulez.

## Langues (FR / AR / EN)

Le site est trilingue. Le français est servi sans préfixe (`/tarifs`), l'arabe
sous `/ar/…` (affichage RTL, police Cairo) et l'anglais sous `/en/…` ; un
sélecteur de langue est dans l'en-tête, chaque page déclare ses `hreflang` et
le sitemap liste les trois versions. Le routage vit dans `UI/src/middleware.ts`
(réécriture interne de `/…` vers `/fr/…`) et toutes les pages sont sous
`UI/src/app/[locale]/`.

- Chaînes d'interface et textes des pages : `UI/src/i18n/dict/{fr,ar,en}.ts`
  (le français est la référence typée ; AR et EN doivent avoir la même structure).
- Contenu (forfaits, fonctionnalités, FAQ, vidéos, pages légales) :
  `UI/src/content/{fr,ar,en}/*.ts`, assemblé par `getContent(locale)`.
- Pour ajouter une langue : l'ajouter dans `UI/src/i18n/config.ts`, créer
  `dict/xx.ts` et `content/xx/`, les enregistrer dans `i18n/index.ts` et
  `content/index.ts`.

## Pages

`/` accueil · `/fonctionnalites` · `/agent` (agent d'impression) · `/tarifs`
(mensuel/annuel + comparatif) · `/faq` (recherche + filtres, données
structurées FAQPage) · `/formation` (6 parcours par rôle) · `/contact`
(formulaire → lead) · `/inscription` (assistant 3 étapes : forfait → espace →
déploiement) · `/cgv`, `/confidentialite`, `/mentions-legales` (modèles à
faire relire) · `sitemap.xml`, `robots.txt`, image Open Graph générée.

## Lancer en local

```powershell
# API
cd API
composer install
copy .env.example .env      # renseigner DB_*, MAIL_*, PLATFORM_API_URL, PLATFORM_API_TOKEN
php artisan key:generate
php artisan migrate
php artisan serve --port=8100
php artisan queue:work        # 2e fenêtre : obligatoire pour les inscriptions et les e-mails
php artisan schedule:work     # 3e fenêtre (optionnel) : relance le suivi des déploiements

# UI
cd UI
npm install
copy .env.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:8100/api
npm run dev                   # http://localhost:3100
```

## Comment fonctionne l'inscription

1. Le visiteur choisit un forfait, saisit le nom de l'atelier, un sous-domaine
   (vérifié en direct : `GET /api/signup/check-slug`), son e-mail et un mot de passe.
2. `POST /api/signup` enregistre l'inscription et lance `ProvisionSignupJob` :
   - `POST {PLATFORM_API_URL}/platform/tenants` (slug, nom, domaine
     `<slug>.<APP_TENANT_DOMAIN>`, admin = e-mail + mot de passe) → Packspace
     crée le tenant et lance son déploiement (base, structure, données,
     admin, stockage, vérification) ;
   - `POST /platform/tenants/{id}/subscription` avec le plan (par **code** :
     `starter`, `pro`, `business`) et `trial_days` = 14.
3. Le site interroge `GET /api/signup/{id}/status` toutes les 2 s ; l'API
   relit `GET /platform/tenants/{id}/provisioning` et renvoie progression +
   étapes. À la fin : e-mail de bienvenue (accès + liens formation) et
   redirection vers l'espace.
4. Le paiement se fait par virement ; l'activation du forfait se fait depuis
   la console plateforme (Abonnements & paiements). Sans paiement, l'espace
   passe en `past_due` puis `expired` selon le délai de grâce.

Prérequis côté Packspace (branche `MultiTanant`) : `TENANCY_ENABLED=true`,
base centrale installée (`php artisan tenants:install`), **plans créés dans la
console plateforme avec les codes `starter`, `pro`, `business`**, un jeton
plateforme (`PLATFORM_ADMIN_TOKEN` ou super-admin `platform:admin:create`)
renseigné dans `API/.env` → `PLATFORM_API_TOKEN`, et un worker de queue actif
sur l'API Packspace (le déploiement est asynchrone).

## Déploiement

```bash
cp API/.env.example API/.env   # puis éditer
docker compose up -d --build
docker compose exec api php artisan key:generate
docker compose exec api php artisan migrate
```

Ou séparément : l'UI est un build Next.js `standalone` (Dockerfile fourni),
l'API un conteneur php-fpm + nginx + queue + scheduler (supervisord).
DNS : `www.<domaine>` → UI, `api.<domaine>` → API, `*.<APP_TENANT_DOMAIN>` →
API/UI Packspace.

## Avant la mise en ligne

- Remplacer les coordonnées (`site.config.ts`, `.env`), le RIB, l'ICE/RC.
- Remplacer les témoignages fictifs par de vrais retours (ou retirer la section).
- Faire relire CGV / confidentialité / mentions légales par un conseil.
- Enregistrer les vidéos (scripts dans `videos.ts`) et renseigner les `youtubeId`.
- Vérifier les prix et limites des forfaits (`plans.ts` + `API/config/boutique.php` + console plateforme).
