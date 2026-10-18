#!/bin/sh
# Démarrage : migrations, caches Laravel puis supervisord (php-fpm + Next.js + nginx + queue).
# Les migrations sont jouées ici (idempotentes) : il n'y a aucun accès shell au conteneur Lightsail et les
# tables du chat (2026_10_18) doivent exister avant que le site ne serve. En cas d'échec le conteneur ne
# démarre pas : Lightsail garde alors la version précédente en ligne.
set -e
cd /var/www/api

if [ -z "$APP_KEY" ]; then
  echo "APP_KEY manquant : générez-le avec 'php artisan key:generate --show' et ajoutez-le aux secrets." >&2
  exit 1
fi

php artisan migrate --force --no-interaction
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec /usr/bin/supervisord -c /etc/supervisord.conf
