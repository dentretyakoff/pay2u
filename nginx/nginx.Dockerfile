FROM nginx:stable-alpine3.17
COPY nginx.conf /etc/nginx/templates/default.conf.template