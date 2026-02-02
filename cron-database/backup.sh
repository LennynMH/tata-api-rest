#!/bin/sh
# Ejecuta pg_dump (PostgreSQL) y mongodump (MongoDB).
# Crea una carpeta por fecha y hora: BACKUP_BASE/YYYY-MM-DD-HHMM/postgres y .../mongodb

set -e

BACKUP_BASE="${BACKUP_BASE:-/backup-data}"
DATE_FOLDER=$(date +%Y-%m-%d-%H%M)
RUN_DIR="${BACKUP_BASE}/${DATE_FOLDER}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"

mkdir -p "${RUN_DIR}/postgres" "${RUN_DIR}/mongodb"

# Timestamp portable (BusyBox no tiene date -Iseconds)
_ts() { date '+%Y-%m-%dT%H:%M:%S'; }

echo "[$(_ts)] Inicio backup -> ${RUN_DIR}"

# PostgreSQL (si está habilitado)
if [ "${BACKUP_POSTGRES_ENABLED:-true}" = "true" ]; then
  export PGPASSWORD="${POSTGRES_PASSWORD:?}"
  DUMP_FILE="${RUN_DIR}/postgres/${POSTGRES_DB:-logistics_db}.sql.gz"
  if pg_dump -h "${POSTGRES_HOST:?}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER:?}" \
    -d "${POSTGRES_DB:-logistics_db}" | gzip > "${DUMP_FILE}"; then
    echo "[$(_ts)] PostgreSQL OK: ${DUMP_FILE}"
  else
    echo "[$(_ts)] ERROR pg_dump" >&2
    exit 1
  fi
  unset PGPASSWORD
fi

# MongoDB (si está habilitado). mongodump crea MONGO_OUT/tracking_db/
if [ "${BACKUP_MONGO_ENABLED:-true}" = "true" ]; then
  MONGO_OUT="${RUN_DIR}/mongodb"
  mkdir -p "${MONGO_OUT}"
  if mongodump --uri="${MONGO_URI:?}" --db=tracking_db --out="${MONGO_OUT}" --gzip; then
    echo "[$(_ts)] MongoDB OK: ${MONGO_OUT}"
  else
    echo "[$(_ts)] ERROR mongodump" >&2
    exit 1
  fi
fi

# Borrar carpetas de backup más antiguas que RETENTION_DAYS
find "${BACKUP_BASE}" -maxdepth 1 -type d -name '20*' -mtime +"${RETENTION_DAYS}" -exec rm -rf {} + 2>/dev/null || true
echo "[$(_ts)] Fin backup (retención ${RETENTION_DAYS} días)"
