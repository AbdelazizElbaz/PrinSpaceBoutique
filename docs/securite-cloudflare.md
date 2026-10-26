# Sécurité du site — attaques par scanners (octobre 2026)

## Ce qui s'est passé

Le tableau Cloudflare « Top uncached paths » montrait des sondes automatiques : `/.env`, `/.env.local`, `/@fs/.env`,
`/__vite_rsc_findSourceMapURL`, `/api/chat/messages`, `/admin`, `/filament`, `/api-keys`, `/_next/static/chunks/*.js.map`.
Ce sont des robots qui cherchent des secrets, des cartes de sources et des panneaux d'administration.
Aucun secret n'est servi (l'image n'a pas de `.env`, les cartes de sources n'existent pas), mais chaque sonde faisait
**rendre la page 404 complète par Next.js** sur un conteneur nano : d'où les 504 intermittents.

## Ce que le conteneur fait maintenant (`docker/nginx.conf`, `API/bootstrap/app.php`, `Dockerfile`)

| Mesure | Effet |
|---|---|
| Fichiers cachés (`/.env`, `/.git`…), extensions inutiles (`.map`, `.sql`, `.php`, `.bak`…), chemins de scanners (`/wp-admin`, `/filament`, `/@fs`, `/api-keys`…) | `404` immédiat dans nginx, sans toucher Next ni PHP |
| User-Agents d'outils d'attaque (sqlmap, nikto, nuclei, zgrab…) | `403` |
| Méthodes autres que GET / HEAD / POST / OPTIONS | `405` |
| Limite de débit par IP : 20 req/s sur le site, 10 req/s sur `/api` (rafales tolérées) ; 40 connexions simultanées | `429` |
| Corps de requête limité à 1 Mo, délais anti-slowloris | connexions lentes coupées |
| `server_tokens off`, `expose_php=Off`, en-têtes `X-Powered-By` et `x-middleware-rewrite` masqués | plus de version PHP / nginx visible |
| IP réelle du visiteur (`CF-Connecting-IP`) transmise à Laravel via `REMOTE_ADDR`, `X-Forwarded-For` ignoré par Laravel | les limiteurs (`/api/leads`, `/signup`, connexion admin) ne se contournent plus en forgeant l'en-tête |
| Toute réponse `/api/*` en JSON | `GET /api/chat/messages` sans jeton répond `422` au lieu d'un `500` HTML |

## À régler dans Cloudflare (le dépôt n'y a pas accès)

Zone `printios.ma` → Sécurité → WAF.

1. **Règle personnalisée « Scanners »** — action *Block* :

   ```
   (http.request.uri.path contains "/.env") or
   (http.request.uri.path contains "/.git") or
   (http.request.uri.path contains "/@fs") or
   (http.request.uri.path contains "/__vite") or
   (http.request.uri.path contains "wp-") or
   (http.request.uri.path contains "xmlrpc") or
   (http.request.uri.path contains "phpmyadmin") or
   (http.request.uri.path contains "/filament") or
   (http.request.uri.path contains "/api-keys") or
   (http.request.uri.path contains "/telescope") or
   (http.request.uri.path contains "/vendor/") or
   (http.request.uri.path.extension in {"map" "env" "sql" "bak" "php" "asp" "aspx" "jsp" "ini" "yml" "log"})
   ```

   Le blocage a lieu à la périphérie : la requête n'arrive même plus au serveur.

2. **Règle de limitation de débit** (Security → WAF → Rate limiting rules) :
   - expression `(starts_with(http.request.uri.path, "/api/"))` — 120 requêtes / 1 minute par IP — action *Managed Challenge* 10 min ;
   - expression `(http.request.uri.path eq "/api/admin/auth/login")` — 5 requêtes / 1 minute — action *Block* 1 h.
3. **Bot Fight Mode** : activé (Security → Bots). *Super Bot Fight Mode* si le forfait le permet : « Definitely automated » = *Block*.
4. **Security Level** : *Medium* ou *High* pendant l'attaque (Security → Settings).
5. Facultatif — **verrouiller l'origine** : Lightsail expose aussi l'adresse
   `printiosstore.….cs.amazonlightsail.com`, joignable sans passer par Cloudflare. Désactiver le domaine par défaut du
   service (console Lightsail → service → Custom domains → *Disable default domain*) pour que tout passe par Cloudflare.

## Vérifier

```bash
for p in /.env /.git/config /wp-login.php /_next/static/chunks/main.js.map /filament /api-keys; do
  printf "%s " "$p"; curl -s -o /dev/null -w "%{http_code}\n" "https://printios.ma$p"
done            # attendu : 404 (ou 403 par Cloudflare)
curl -s -o /dev/null -w "%{http_code}\n" https://printios.ma/api/chat/messages   # attendu : 422
curl -sI https://printios.ma/ | grep -i "x-powered-by\|x-middleware"            # attendu : rien
```
