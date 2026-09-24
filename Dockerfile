# ---------------------------------------------------------------------------
# PrintIOS — image UNIQUE : site Next.js + API Laravel + nginx + worker de
# queue + scheduler, pilotés par supervisord. nginx écoute sur 8080 :
#   /api/*, /up   → Laravel (php-fpm)
#   tout le reste → Next.js (node, port 3100 interne)
# Toute la configuration vient des variables d'environnement du conteneur
# (aucun .env dans l'image) — voir .github/workflows/Deploy.yml.
# ---------------------------------------------------------------------------

# 1) Dépendances PHP (Composer)
FROM composer:2 AS vendor
WORKDIR /app
COPY API/composer.json API/composer.lock* ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction
COPY API/ .
RUN composer dump-autoload --optimize --no-dev

# 2) Build Next.js (standalone)
FROM node:22-alpine AS web
WORKDIR /app
COPY UI/package.json UI/package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund
COPY UI/ .
ARG NEXT_PUBLIC_API_URL=/api
ARG NEXT_PUBLIC_SITE_URL=https://printios.ma
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3) Image finale
FROM php:8.3-fpm-alpine
RUN apk add --no-cache nginx supervisor nodejs icu-dev libzip-dev oniguruma-dev \
    && docker-php-ext-install pdo_mysql intl zip bcmath opcache \
    && { echo "opcache.enable=1"; echo "opcache.validate_timestamps=0"; echo "opcache.memory_consumption=128"; } > /usr/local/etc/php/conf.d/opcache.ini

# API Laravel
WORKDIR /var/www/api
COPY --from=vendor /app /var/www/api
RUN chown -R www-data:www-data storage bootstrap/cache

# Site Next.js (standalone : server.js + node_modules minimal)
WORKDIR /var/www/web
COPY --from=web /app/.next/standalone ./
COPY --from=web /app/.next/static ./.next/static
COPY --from=web /app/public ./public

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV NODE_ENV=production PORT=3100 HOSTNAME=127.0.0.1
EXPOSE 8080
CMD ["/usr/local/bin/entrypoint.sh"]
