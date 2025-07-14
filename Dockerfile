FROM nginx:alpine

LABEL org.opencontainers.image.source https://github.com/karimmdjdb/ipeek

COPY . /usr/share/nginx/html