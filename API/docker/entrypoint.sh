#!/bin/sh
# Démarrage du conteneur API : migrations (idempotentes) puis supervisord
# (php-fpm + nginx + worker de queue + scheduler). Toute la configuration
# vient des variables d'environnement du conteneur (Lightsail "environment"),
# pas d'un fichier .env — voir .github/workflows/Deploy-API.yml.
set -e
cd /var/www

if [ -z "$APP_KEY" ]; then
  echo "APP_KEY manquant : générez-le avec 'php artisan key:generate --show' et ajoutez-le aux secrets." >&2
  exit 1
fi

# Attente de la base (démarrage à froid / DB managée qui redémarre)
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
