# syntax=docker/dockerfile:1

FROM nginxinc/nginx-unprivileged:alpine AS final

COPY . /usr/share/nginx/html


EXPOSE 8080
