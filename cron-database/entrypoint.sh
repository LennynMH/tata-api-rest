#!/bin/sh
# Arranca cron con la expresión BACKUP_CRON y mantiene el contenedor vivo.
# Cron ejecuta con entorno mínimo; generamos backup.env para que backup.sh tenga las variables.

CRON_EXPR="${BACKUP_CRON:-0 2 * * *}"
TZ="${TZ:-UTC}"

export TZ

# Generar archivo de entorno para el job de cron (cron no hereda env del contenedor)
# Valores entre comillas simples para evitar problemas con caracteres especiales
_quote() { echo "$1" | sed "s/'/'\\\\''/g"; }
{
  echo "export BACKUP_BASE=/backup-data"
  echo "export BACKUP_RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}"
  echo "export BACKUP_POSTGRES_ENABLED=${BACKUP_POSTGRES_ENABLED:-true}"
  echo "export BACKUP_MONGO_ENABLED=${BACKUP_MONGO_ENABLED:-true}"
  echo "export POSTGRES_HOST=${POSTGRES_HOST:-postgres}"
  echo "export POSTGRES_PORT=${POSTGRES_PORT:-5432}"
  echo "export POSTGRES_USER=${POSTGRES_USER:-postgres}"
  printf "export POSTGRES_PASSWORD='%s'\n" "$(_quote "${POSTGRES_PASSWORD}")"
  echo "export POSTGRES_DB=${POSTGRES_DB:-logistics_db}"
  printf "export MONGO_URI='%s'\n" "$(_quote "${MONGO_URI}")"
  echo "export TZ=${TZ}"
} > /app/backup.env
chmod 600 /app/backup.env

# Wrapper para cron: carga env y ejecuta backup (cron no pasa el entorno)
echo '#!/bin/sh
. /app/backup.env 2>/dev/null
/app/backup.sh' > /app/run-backup.sh
chmod +x /app/run-backup.sh

# Crear log para que cron pueda escribir
touch /var/log/backup.log

# Crontab: ejecutar wrapper (una sola orden, sin redirección dentro del crontab)
echo "${CRON_EXPR} /app/run-backup.sh >> /var/log/backup.log 2>&1" | crontab -

_ts() { date '+%Y-%m-%dT%H:%M:%S'; }
echo "[$(_ts)] Cron configurado: ${CRON_EXPR} (TZ=${TZ})"

# Ejecutar un backup al arranque (usa el env del contenedor) para verificar y llenar backup-data
echo "[$(_ts)] Ejecutando backup inicial..."
if /app/backup.sh >> /var/log/backup.log 2>&1; then
  echo "[$(_ts)] Backup inicial OK"
else
  echo "[$(_ts)] Backup inicial falló; ver: docker compose exec cron-database cat /var/log/backup.log"
fi

# Ejecutar cron en primer plano
crond -f -l 2
