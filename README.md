# PrintIOS — site vitrine et tunnel d'abonnement

Site public qui vend l'application (Packspace, marque commerciale **PrintIOS**) :
pages marketing, forfaits, FAQ, vidéothèque de formation, et **demande d'essai
gratuit** par WhatsApp (canal principal) ou formulaire, traitée par l'équipe.

| Dossier | Stack | Rôle |
|---|---|---|
| `UI/` | Next.js 15, React 19, Tailwind 4, TypeScript | Site vitrine (port 3100) |
| `API/` | Laravel 11, MySQL | Leads et demandes d'essai (e-mails), port 8100 en dev |
| `Dockerfile`, `docker/` | nginx + php-fpm + Next.js + queue | **Image unique** de production (Lightsail) |
| `docker-compose.yml` | MySQL + image unique | Test local de l'image de production |

## Changer la marque, le domaine, les coordonnées

Tout est dans **un seul fichier** : `UI/src/content/site.config.ts` (marque,
tagline, domaine du site, domaine des espaces clients, société, e-mails,
téléphone/WhatsApp, RIB, réseaux sociaux). Côté API, les mêmes valeurs sont
dans `API/.env` (`BRAND_NAME`, `SITE_URL`, `NOTIFY_EMAIL`).
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
(formulaire → lead) · `/inscription` (forfait → WhatsApp ou formulaire de demande) · `/cgv`, `/confidentialite`, `/mentions-legales` (modèles à
faire relire) · `sitemap.xml`, `robots.txt`, image Open Graph générée.

## Lancer en local

```powershell
# API
cd API
composer install
copy .env.example .env      # renseigner DB_*, MAIL_*
php artisan key:generate
php artisan migrate
php artisan serve --port=8100
php artisan queue:work        # 2e fenêtre : envoi des e-mails

# UI
cd UI
npm install
copy .env.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:8100/api
npm run dev                   # http://localhost:3100
```

## Comment fonctionne la demande d'essai

Il n'y a **pas de création automatique d'espace**. Le visiteur choisit un
forfait puis, au choix :

- clique sur le bouton **WhatsApp** (message pré-rempli avec le forfait) — canal
  principal, présent aussi dans l'en-tête, l'accueil et les bandeaux d'appel ;
- ou laisse ses coordonnées : `POST /api/signup` enregistre la demande (table
  `signups`), envoie une notification à `NOTIFY_EMAIL` et un accusé de
  réception au prospect (FR/AR/EN).

L'équipe crée ensuite le client dans Packspace (console plateforme ou
administration), lui envoie ses accès, et active l'essai de 7 jours. Le
numéro WhatsApp est `site.contact.whatsapp` dans `site.config.ts`.

## Déploiement AWS (un seul conteneur Lightsail)

Une **seule image Docker** (`Dockerfile` à la racine) contient tout : nginx en
façade (port 8080) qui envoie `/api/*` à Laravel (php-fpm) et le reste à
Next.js, plus le worker de queue, le tout piloté par
supervisord. Les migrations s'exécutent au démarrage (`docker/entrypoint.sh`).
Un seul service Lightsail, un seul domaine (`printios.ma`), l'API est servie
sur `https://printios.ma/api`.

Le workflow `.github/workflows/Deploy.yml` (même mécanique que les pipelines
Packspace) construit l'image, la pousse sur le service et déclenche le
déploiement, à chaque push sur `main` ou à la main. Aucun secret n'est cuit
dans l'image : tout est injecté en variables d'environnement du conteneur.

### 1. Côté AWS (une seule fois)

1. **Lightsail → Containers → Create container service** : `printios`,
   capacité *Micro* (1 Go RAM, ≈ 10 $/mois — Next + PHP + worker dans le même
   conteneur ; *Nano* est trop juste), scale = 1, région de Packspace.
2. **Base de données** : base `printios_boutique` + utilisateur dédié sur le
   MySQL déjà utilisé par Packspace (ou une base managée Lightsail), accessible
   depuis le service.
3. **Domaine** : onglet *Custom domains* du service → certificat pour
   `printios.ma` et `www.printios.ma`, validation CNAME chez le registrar,
   puis attacher. DNS : `printios.ma` et `www` → domaine public du service.
4. **IAM** : réutiliser la clé des workflows Packspace (droits Lightsail).

### 2. Côté GitHub (une seule fois)

Le plus simple : `powershell -ExecutionPolicy Bypass -File .\scripts\setup-github-env.ps1`
(GitHub CLI requis : `winget install GitHub.cli` puis `gh auth login`). Le script
crée l'environnement, demande chaque valeur (secrets en saisie masquée) et
peut générer l'`APP_KEY`. Sinon, à la main : Settings → Environments → **PrintIOS** :

| Type | Nom | Valeur |
|---|---|---|
| secret | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | clé IAM |
| secret | `APP_KEY` | `php artisan key:generate --show` (commence par `base64:`) |
| secret | `DB_PASSWORD`, `MAIL_PASSWORD` | |
| var | `AWS_REGION` | ex. `eu-west-3` |
| var | `LIGHTSAIL_SERVICE` | `printios` |
| var | `SITE_URL` | `https://printios.ma` |
| var | `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` | |
| var | `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_FROM_ADDRESS` | SMTP (SES, Brevo, OVH…) |
| var | `NOTIFY_EMAIL` | `commercial@printios.ma` |

### 3. Premier déploiement

*Actions → Deploy → Run workflow*. Vérifier ensuite
`https://printios.ma/api/ping` puis `https://printios.ma`. Les logs
(nginx, php-fpm, Next, queue) sont dans l'onglet *Logs* du service
Lightsail.

### En local avec Docker

```bash
cp API/.env.example API/.env   # MAIL_*
docker compose up -d --build   # MySQL + conteneur unique → http://localhost:8080
```

## Avant la mise en ligne

- Remplacer les coordonnées (`site.config.ts`, `.env`), le RIB, l'ICE/RC.
- Remplacer les témoignages fictifs par de vrais retours (ou retirer la section).
- Faire relire CGV / confidentialité / mentions légales par un conseil.
- Enregistrer les vidéos (scripts dans `videos.ts`) et renseigner les `youtubeId`.
- Vérifier les prix et limites des forfaits (`plans.ts` + `API/config/boutique.php` + console plateforme).
