#!/bin/sh
# Démarrage : attente de la base, migrations (idempotentes), caches Laravel,
# puis supervisord (php-fpm + Next.js + nginx + queue).
set -e
cd /var/www/api

if [ -z "$APP_KEY" ]; then
  echo "APP_KEY manquant : générez-le avec 'php artisan key:generate --show' et ajoutez-le aux secrets." >&2
  exit 1
fi

i=0
until php -r 'new PDO("mysql:host=".getenv("DB_HOST").";port=".(getenv("DB_PORT")?:3306).";dbname=".getenv("DB_DATABASE"), getenv("DB_USERNAME"), getenv("DB_PASSWORD"));' >/dev/null 2>&1; do
  i=$((i+1)); [ $i -gt 30 ] && { echo "Base injoignable après 30 tentatives" >&2; exit 1; }
  echo "Attente de la base de données ($i)…"; sleep 2
done

php artisan migrate --force --no-interaction
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec /usr/bin/supervisord -c /etc/supervisord.conf
