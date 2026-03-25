# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS production

RUN apk add --no-cache libcap \
    && addgroup -S appgroup \
    && adduser -S -G appgroup -h /nonexistent -s /sbin/nologin appuser \
    && setcap 'cap_net_bind_service=+ep' /usr/sbin/nginx \
    && sed -i '/^user\s\+/d' /etc/nginx/nginx.conf \
    && sed -i 's|pid /var/run/nginx.pid;|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf \
    && mkdir -p /var/cache/nginx /var/run /tmp/nginx /usr/share/nginx/html \
    && chown -R appuser:appgroup /var/cache/nginx /var/run /tmp/nginx /usr/share/nginx/html \
    && printf '%s\n' \
        'server {' \
        '    listen 80;' \
        '    listen [::]:80;' \
        '    server_name _;' \
        '    root /usr/share/nginx/html;' \
        '    index index.html;' \
        '    location / {' \
        '        try_files $uri $uri/ /index.html;' \
        '    }' \
        '}' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:80/ || exit 1

USER appuser

CMD ["nginx", "-g", "daemon off;"]