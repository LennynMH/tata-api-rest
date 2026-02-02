# Migraciones de Base de Datos

## Orden secuencial según dependencias

Las migraciones se ejecutan en orden por **timestamp** (nombre del archivo). El orden correcto respeta las dependencias de claves foráneas:

| Orden | Archivo | Tabla | Dependencias |
|-------|---------|-------|--------------|
| 1 | `1738300000000-CreateRolesTable.ts` | roles | Ninguna. Seed: ADM, USU |
| 2 | `1738300000500-CreateStateUsersTable.ts` | state_users | Ninguna. Seed: ACT, INA |
| 3 | `1738300001000-CreateUsersTable.ts` | users | FK → roles, state_users |
| 4 | `1738300001500-CreateStatePackagesTable.ts` | state_packages | Ninguna. Seed: pendiente, en_tránsito, entregado (HU-06) |
| 5 | `1738300002000-CreatePackagesTable.ts` | packages | FK → users, state_packages |
| 6 | `1738300002500-SeedAdminUser.ts` | users (seed) | Usuario admin@ejemplo.com (rol ADM) para HU-11 |
| 7 | `1738300002600-SeedDefaultUsuario.ts` | users (seed) | Usuario usuario@ejemplo.com (rol USU) para pruebas |

**Secuencia:** `roles` → `state_users` → `users` → `state_packages` → `packages` → seed admin → seed usuario

**Usuarios por defecto (HU-11):**

| Email | Password | Rol | Descripción |
|-------|----------|-----|-------------|
| admin@ejemplo.com | password123 | ADM | Administrador |
| usuario@ejemplo.com | password123 | USU | Usuario demo |

> **Nota:** MongoDB (tracking_events para HU-07/HU-08) no usa migraciones TypeORM; la colección se crea al primer insert.

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run migration:run` | Ejecutar migraciones pendientes |
| `npm run migration:revert` | Revertir la última migración |
| `npm run migration:show` | Ver estado de migraciones |

## Requisitos

- Base de datos PostgreSQL accesible (variables en `.env`: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
- Proyecto compilado: `npm run build:users-api` (el typeorm.config usa `dist/`)

## Ejecución local

```bash
# 1. Copiar .env
cp env.example .env

# 2. Levantar PostgreSQL (o usar existente)
docker-compose up -d postgres

# 3. Ejecutar migraciones
npm run build:users-api
npm run migration:run
```

## Docker

Las migraciones se ejecutan automáticamente al iniciar **users-api** cuando `RUN_MIGRATIONS=true` (por defecto en docker-compose).
