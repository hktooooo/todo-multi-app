FROM php:8.2-fpm

# パッケージインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    zip \
    vim \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev

# PHP拡張
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Composerインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www