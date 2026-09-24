# API Laravel (php-fpm + nginx dans un seul conteneur simple) — pour un
# déploiement type Lightsail / VPS. Le worker de queue tourne via le même
# image avec la commande `php artisan queue:work`.
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock* ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction
COPY . .
RUN composer dump-autoload --optimize --no-dev

FROM php:8.3-fpm-alpine
RUN apk add --no-cache nginx supervisor icu-dev libzip-dev oniguruma-dev \
    && docker-php-ext-install pdo_mysql intl zip bcmath opcache
WORKDIR /var/www
COPY --from=vendor /app /var/www
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf
RUN chown -R www-data:www-data storage bootstrap/cache
EXPOSE 8100
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
