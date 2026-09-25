#!/bin/sh
# Démarrage : attente de la base, migrations (idempotentes), caches Laravel,
# puis supervisord (php-fpm + Next.js + nginx + queue).
set -e
cd /var/www/api

if [ -z "$APP_KEY" ]; then
  echo "APP_KEY manquant : générez-le avec 'php artisan key:generate --show' et ajoutez-le aux secrets." >&2
  exit 1
fi

[ -z "$DB_HOST" ] && { echo "DB_HOST manquant : variables DB_* absentes de l'environnement GitHub 'PrintIOS' (lancez scripts/setup-github-env.ps1)." >&2; exit 1; }

# Attend le serveur MySQL (sans base), crée la base si elle n'existe pas, puis vérifie l'accès à la base.
i=0
until err=$(php -r '
  $h=getenv("DB_HOST"); $p=getenv("DB_PORT")?:3306; $d=getenv("DB_DATABASE"); $u=getenv("DB_USERNAME"); $w=getenv("DB_PASSWORD");
  $pdo=new PDO("mysql:host=$h;port=$p",$u,$w,[PDO::ATTR_TIMEOUT=>5,PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
  $pdo->exec("CREATE DATABASE IF NOT EXISTS `".str_replace("`","",$d)."` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
  new PDO("mysql:host=$h;port=$p;dbname=$d",$u,$w,[PDO::ATTR_TIMEOUT=>5]);
' 2>&1); do
  i=$((i+1))
  if [ $i -gt 30 ]; then
    echo "Base injoignable après 30 tentatives (hôte ${DB_HOST}:${DB_PORT:-3306}, base ${DB_DATABASE}, utilisateur ${DB_USERNAME}) :" >&2
    echo "$err" | tail -n 3 >&2
    exit 1
  fi
  echo "Attente de la base de données ($i)… $(echo "$err" | grep -o 'SQLSTATE\[[^]]*\][^\n]*' | head -n1 | cut -c1-160)"
  sleep 2
done

php artisan migrate --force --no-interaction
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec /usr/bin/supervisord -c /etc/supervisord.conf
