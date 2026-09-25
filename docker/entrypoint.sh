#!/bin/sh
# Démarrage : caches Laravel puis supervisord (php-fpm + Next.js + nginx + queue).
# Pas de migration ici : la base se migre à la main depuis un poste
# (cd API && php artisan migrate) avec le .env pointant sur la MySQL Lightsail.
set -e
cd /var/www/api

if [ -z "$APP_KEY" ]; then
  echo "APP_KEY manquant : générez-le avec 'php artisan key:generate --show' et ajoutez-le aux secrets." >&2
  exit 1
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache

exec /usr/bin/supervisord -c /etc/supervisord.conf
