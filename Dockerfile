FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html javascript.js style.css ./
COPY content ./content
COPY resume ./resume

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --output-document=/dev/null http://127.0.0.1/ || exit 1
