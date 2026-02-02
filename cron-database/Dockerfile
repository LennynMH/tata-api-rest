# Imagen con cron, cliente PostgreSQL y mongodump
FROM alpine:3.19

RUN apk add --no-cache \
    postgresql-client \
    mongodb-tools \
    dcron \
    tzdata \
    gzip

WORKDIR /app

COPY backup.sh entrypoint.sh /app/
# Convertir CRLF -> LF (evita "no such file or directory" en Linux)
RUN sed -i 's/\r$//' /app/backup.sh /app/entrypoint.sh && chmod +x /app/backup.sh /app/entrypoint.sh

# Directorio donde se escriben los backups (montado como volumen)
ENV BACKUP_BASE=/backup-data

ENTRYPOINT ["/app/entrypoint.sh"]
