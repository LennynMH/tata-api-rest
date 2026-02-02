# API REST - Sistema de Gestión de Envíos

API REST para gestión de paquetes, usuarios y seguimiento de envíos logísticos.

## Lo implementado hasta el momento

- **11 historias de usuario (HU):** HU-01, HU-02 (usuarios), HU-03, HU-04, HU-05, HU-06 (paquetes), HU-07, HU-08 (seguimiento), HU-09 (backup BD), HU-10 (Docker), HU-11 (auth).
- **3 microservicios:** users-api (2001), packages-api (2002), tracking-api (2003).
- **Servicio cron-database (HU-09):** backup automático de PostgreSQL y MongoDB (cron, salida en `cron-database/backup/YYYY-MM-DD-HHMM/`).
- **2 bases de datos:** PostgreSQL (usuarios y paquetes), MongoDB (eventos de seguimiento).
- **Arquitectura hexagonal** por módulo; comunicación entre servicios vía HTTP (IUserFinder, IPackageFinder) con JWT reenviado.
- **Migraciones TypeORM** secuenciales: roles → state_users → users → state_packages → packages → seed admin → seed usuario.
- **Documentación:** Swagger por servicio, Postman por HU, README, roadmap y PROMPT-RESUMEN.

## Stack tecnológico

| Aspecto      | Tecnología                  |
|--------------|-----------------------------|
| **Lenguaje** | TypeScript                  |
| **Framework**| NestJS 10 (Node.js)         |
| **Arquitectura** | Hexagonal + Microservicios (1 contenedor por módulo) |
| **Base de datos SQL** | PostgreSQL 16 (usuarios, paquetes) |
| **Base de datos NoSQL** | MongoDB 7 (seguimiento - HU-07, HU-08) |
| **ORM**      | TypeORM (SQL), Mongoose (NoSQL - tracking) |
| **Documentación** | Swagger/OpenAPI        |
| **Contenedores** | Docker + Docker Compose |

## Requisitos previos

- Node.js >= 18 (local) / Node 20 (Docker)
- Docker y Docker Compose
- npm

## Quick Start (Docker)

```bash
# Clonar e iniciar
git clone <repo-url>
cd tata-api-rest
docker-compose up -d --build

# Verificar
curl http://localhost:2001/api/health/live  # users-api
curl http://localhost:2002/api/health/live   # packages-api
curl http://localhost:2003/api/health/live   # tracking-api
# Backup (HU-09): cron-database escribe en cron-database/backup/
```

**URLs (microservicios):**

| Servicio | Puerto | API | Swagger | Health |
|----------|--------|-----|---------|--------|
| **users-api** | 2001 | http://localhost:2001/api | /api/docs | /api/health |
| **packages-api** | 2002 | http://localhost:2002/api | /api/docs | /api/health |
| **tracking-api** | 2003 | http://localhost:2003/api | /api/docs | /api/health |

**Bases de datos:**

| Base de datos | Puerto | Tipo | Uso | Credenciales |
|---------------|--------|------|-----|--------------|
| **PostgreSQL** | 5432 | SQL | Usuarios, paquetes (HU-01 a HU-06) | postgres / postgres |
| **MongoDB** | 27017 | NoSQL | Seguimiento (HU-07, HU-08) | admin / admin123 |

---

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
copy env.example .env   # Windows
cp env.example .env     # Linux/Mac
```

## Ejecución con Docker (recomendado)

Levanta PostgreSQL, MongoDB, users-api, packages-api, tracking-api y cron-database (backup automático HU-09):

```bash
# Levantar todo (BD + microservicios + migraciones + cron backup)
docker-compose up -d --build

# Ver logs
docker-compose logs -f users-api
docker-compose logs -f packages-api
docker-compose logs -f tracking-api
docker-compose logs -f cron-database

# Detener
docker-compose down
```

- **users-api**: http://localhost:2001/api (usuarios, auth)
- **packages-api**: http://localhost:2002/api (paquetes; llama a users-api vía HTTP con JWT)
- **tracking-api**: http://localhost:2003/api (seguimiento HU-07/HU-08; MongoDB; llama a packages-api vía HTTP con JWT)
- **cron-database**: job de backup (PostgreSQL + MongoDB); salida en `./cron-database/backup/YYYY-MM-DD-HHMM/`. Ver [cron-database/README.md](cron-database/README.md).

## Health checks

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/health` | Health completo (BD incluida) |
| `GET /api/health/live` | Liveness - app viva (sin dependencias) |
| `GET /api/health/ready` | Readiness - lista para tráfico (incluye BD) |

Las migraciones se ejecutan automáticamente al iniciar el contenedor.

## Autenticación (HU-11)

Todas las rutas (excepto login y health) requieren JWT:

```bash
# 1. Login
curl -X POST http://localhost:2001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ejemplo.com","password":"password123"}'

# 2. Usar el access_token en las demás peticiones
curl http://localhost:2002/api/packages -H "Authorization: Bearer <access_token>"
```

**Usuarios por defecto (seed):**

| Email | Password | Rol | Descripción |
|-------|----------|-----|-------------|
| admin@ejemplo.com | password123 | ADM | Administrador |
| usuario@ejemplo.com | password123 | USU | Usuario demo |

**Reglas:** POST /api/users solo ADM; GET /api/users/:id solo propio perfil o ADM; paquetes y tracking solo del usuario autenticado (ADM puede ver todos).

## Ejecución local (desarrollo)

### 1. Configurar base de datos

**Opción A: Docker solo bases de datos**

```bash
docker-compose up -d postgres mongodb
```

**Opción B: PostgreSQL local**

Crear la base de datos manualmente. Copiar `env.example` a `.env` y configurar las variables (ver sección **Variables de entorno**).

### 2. Ejecutar migraciones

```bash
npm run build
npm run migration:run
```

### 3. Iniciar aplicación (microservicios)

```bash
# Terminal 1 - users-api
npm run start:users-api

# Terminal 2 - packages-api (requiere users-api corriendo)
npm run start:packages-api

# Terminal 3 - tracking-api (requiere packages-api y MongoDB)
npm run start:tracking-api
```

## Migraciones

Orden de ejecución secuencial según dependencias:
`roles` → `state_users` → `users` → `state_packages` → `packages` → seed admin → seed usuario.

Ver detalle en **[docs/MIGRACIONES.md](docs/MIGRACIONES.md)**.

| Comando | Descripción |
|---------|-------------|
| `npm run migration:run` | Ejecutar migraciones pendientes |
| `npm run migration:revert` | Revertir última migración |
| `npm run migration:show` | Ver estado de migraciones |

## Variables de entorno

Copiar `env.example` a `.env` y ajustar según el entorno. Todas las variables tienen valores por defecto.

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | 2001 / 2002 / 2003 | Puerto según servicio (users-api: 2001, packages-api: 2002, tracking-api: 2003) |
| `USERS_API_URL` | http://localhost:2001 | URL de users-api (para packages-api) |
| `PACKAGES_API_URL` | http://localhost:2002 | URL de packages-api (para tracking-api) |
| `NODE_ENV` | development | `development`, `production` o `test` |
| `API_PREFIX` | api | Prefijo global de la API |
| `SWAGGER_ENABLED` | true | Habilitar documentación Swagger |
| `SWAGGER_PATH` | api/docs | Ruta de Swagger UI |
| `SWAGGER_TITLE` | API Gestión de Envíos | Título en Swagger |
| `DB_HOST` | localhost | Host de PostgreSQL |
| `DB_PORT` | 5432 | Puerto de PostgreSQL |
| `DB_USER` | postgres | Usuario de BD |
| `DB_PASSWORD` | postgres | Contraseña de BD |
| `DB_NAME` | logistics_db | Nombre de la base de datos |
| `RUN_MIGRATIONS` | false | Ejecutar migraciones al iniciar |
| `HEALTH_DB_TIMEOUT_MS` | 1500 | Timeout (ms) del health check de BD |
| `MONGO_URI` | mongodb://admin:admin123@localhost:27017/tracking_db?authSource=admin | URI de conexión MongoDB (HU-07, HU-08) |
| `JWT_SECRET` | (ver env.example) | Secret para firmar tokens JWT (HU-11) |
| `JWT_EXPIRES_IN` | 30 | Duración del token en **minutos** (30=30min, 60=1h, 120=2h) |
| `BACKUP_CRON` | 0 2 * * * | Cron backup (HU-09): una vez al día a las 02:00. Pruebas: `* * * * *` |
| `TZ` | America/Lima | Zona horaria (cron-database) |
| `BACKUP_RETENTION_DAYS` | 7 | Días de retención de backups (HU-09) |

## Documentación de la API

Swagger UI disponible por servicio:
- **users-api:** http://localhost:2001/api/docs
- **packages-api:** http://localhost:2002/api/docs
- **tracking-api:** http://localhost:2003/api/docs

## Endpoints

| HU | Método | Servicio     | Ruta                | Descripción              |
|----|--------|--------------|---------------------|--------------------------|
| HU-01 | POST | users-api    | `/api/users`        | Crear usuario            |
| HU-02 | GET  | users-api    | `/api/users/:id`    | Consultar usuario        |
| HU-03 | GET  | packages-api | `/api/packages` | Listar paquetes del usuario autenticado |
| HU-04 | POST | packages-api | `/api/packages`     | Registrar paquete        |
| HU-05 | GET  | packages-api | `/api/packages/:id` | Consultar paquete        |
| HU-06 | PATCH | packages-api | `/api/packages/:id` | Actualizar estado paquete |
| HU-07 | POST | tracking-api | `/api/packages/:packageId/tracking-events` | Registrar evento de seguimiento |
| HU-08 | GET  | tracking-api | `/api/packages/:packageId/tracking-events` | Consultar historial de seguimiento |
| HU-09 | - | cron-database | (job programado) | Backup automático PostgreSQL + MongoDB → `cron-database/backup/` |
| HU-11 | POST | users-api | `/api/auth/login` | Login (JWT) |

**Nota:** Todas las rutas (excepto login y health) requieren `Authorization: Bearer <token>`. packages-api reenvía el JWT a users-api; tracking-api reenvía el JWT a packages-api.

---

### HU-01: Crear usuario (admin) - users-api:2001

**POST** `/api/users`

Crea un nuevo usuario en el sistema.

**Request body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "name": "Juan Pérez",
  "role_cod": "USU"
}
```

| Campo     | Tipo   | Requerido | Descripción                          |
|-----------|--------|-----------|--------------------------------------|
| email     | string | Sí        | Email único del usuario              |
| password  | string | Sí        | Mínimo 6 caracteres                  |
| name      | string | Sí        | Nombre completo                      |
| role_cod  | string | No        | `ADM` o `USU` (código de roles, default: `USU`) |

**Ejemplo con cURL (requiere token ADM):**
```bash
# 1. Login como admin
TOKEN=$(curl -s -X POST http://localhost:2001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ejemplo.com","password":"password123"}' | jq -r '.access_token')

# 2. Crear usuario con rol USU
curl -X POST http://localhost:2001/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"user@test.com","password":"secret123","name":"Usuario"}'

# 3. Crear usuario con rol ADM
curl -X POST http://localhost:2001/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"admin@test.com","password":"secret123","name":"Admin","role_cod":"ADM"}'
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@test.com",
  "name": "Admin",
  "role": {
    "id": "4728f4a4-292b-460d-a685-2bea0807e6d4",
    "name": "admin",
    "code": "ADM"
  },
  "isActive": true,
  "createdAt": "2026-01-31T05:00:00.000Z",
  "updatedAt": "2026-01-31T05:00:00.000Z"
}
```

### HU-02: Consultar usuario (admin/usuario)

**GET** `/api/users/:id`

Consulta los datos de un usuario por su ID. Requiere JWT. Solo propio perfil o rol ADM.

**Ejemplo con cURL:**
```bash
curl http://localhost:2001/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@test.com",
  "name": "Admin",
  "role": {
    "id": "4728f4a4-292b-460d-a685-2bea0807e6d4",
    "name": "admin",
    "code": "ADM"
  },
  "isActive": true,
  "createdAt": "2026-01-31T05:00:00.000Z",
  "updatedAt": "2026-01-31T05:00:00.000Z"
}
```

**Error (404 Not Found):**
```json
{
  "statusCode": 404,
  "code": "USR003",
  "message": "Usuario no encontrado con id '550e8400-e29b-41d4-a716-446655440000'",
  "timestamp": "2026-01-31T05:00:00.000Z"
}
```

### HU-03: Listar paquetes del usuario

**GET** `/api/packages` (packages-api:2002)

Lista los paquetes del usuario autenticado (userId del token). Requiere JWT.

### HU-04: Registrar paquete

**POST** `/api/packages` (packages-api:2002)

**Body:** `tracking_number`, `origin`, `destination`, `status` (opcional: pendiente, en_tránsito, entregado). El userId se obtiene del token JWT.

Requiere JWT. 409 si tracking_number duplicado (PKG002).

### HU-05: Consultar paquete

**GET** `/api/packages/:id` (packages-api:2002)

Incluye datos del propietario (owner: id, email, name). Requiere JWT. Solo propio paquete o rol ADM. 404 si no existe (PKG001).

### HU-06: Actualizar estado paquete

**PATCH** `/api/packages/:id` (packages-api:2002)

**Body:** `{ "status": "pendiente" | "en_tránsito" | "entregado" }`. Requiere JWT. Solo propio paquete o ADM. 404 = PKG001. 400 = PKG003 estado inválido.

### HU-07: Registrar evento de seguimiento

**POST** `/api/packages/:packageId/tracking-events` (tracking-api:2003)

Registra un evento de seguimiento (ubicación y estado) en MongoDB. Requiere JWT. Solo paquetes propios o ADM.

**Body:**
```json
{
  "event_type": "location_update",
  "location": {
    "address": "Centro Distribución Lima, Perú",
    "coordinates": { "lat": -12.0464, "lng": -77.0428 }
  },
  "status": "en_tránsito",
  "description": "Paquete recibido en centro de distribución",
  "event_date": "2026-02-01T10:00:00Z",
  "metadata": { "carrier": "DHL", "vehicle": "TRUCK-123" },
  "created_by": "system"
}
```

404 si paquete no existe. Base de datos: **MongoDB (NoSQL)**.

### HU-08: Consultar historial de seguimiento

**GET** `/api/packages/:packageId/tracking-events` (tracking-api:2003)

Devuelve el historial completo de eventos de seguimiento del paquete, ordenados por fecha descendente. Requiere JWT. Solo paquetes propios o ADM.

**Response:** `{ "packageId": "...", "totalEvents": N, "events": [...] }`

404 = PKG001. Base de datos: **MongoDB (NoSQL)**.

### HU-09: Backup automático de bases de datos

No es un endpoint: es un **servicio programado** (cron) que ejecuta `pg_dump` (PostgreSQL) y `mongodump` (MongoDB) a la hora configurada.

- **Servicio:** `cron-database` (ver [cron-database/README.md](cron-database/README.md)).
- **Salida:** `./cron-database/backup/YYYY-MM-DD-HHMM/postgres/` y `.../mongodb/`.
- **Variables:** `BACKUP_CRON` (ej. `0 2 * * *` = 02:00), `TZ`, `BACKUP_RETENTION_DAYS`.
- **Ejecución manual:** `docker compose exec cron-database /app/backup.sh`

---

## Postman

Colección organizada por HU: **postman/tata-api-rest-HU.postman_collection.json**

- **Variables:** `usersApiUrl` (2001), `packagesApiUrl` (2002), `trackingApiUrl` (2003), `access_token`, `userId`, `packageId`.
- **Entorno:** Importar `postman/tata-api-rest.postman_environment.json` y seleccionarlo para guardar el token y IDs.
- **Orden sugerido:** HU-11 Login (admin o usuario) → HU-01 (ADM crea usuarios) → HU-04 (obtiene packageId) → HU-03, HU-05, HU-06 → HU-07, HU-08.
- Los scripts guardan `access_token`, `userId` y `packageId` en el entorno tras login, crear usuario y crear paquete.

## Scripts de validación (PowerShell)

Para validar las APIs sin Postman (requiere servicios en ejecución):

| Script | HUs validadas |
|--------|----------------|
| `test-apis.ps1` | HU-01, HU-02 (users-api) |
| `test-packages-apis.ps1` | HU-03, HU-04, HU-05, HU-06 (packages-api) |
| `test-tracking-apis.ps1` | HU-07, HU-08 (tracking-api) |

```bash
powershell -ExecutionPolicy Bypass -File test-apis.ps1
powershell -ExecutionPolicy Bypass -File test-packages-apis.ps1
powershell -ExecutionPolicy Bypass -File test-tracking-apis.ps1
```

## Estructura del proyecto (Arquitectura Hexagonal)

```
src/
├── config/
│   └── configuration.ts                    # Configuración centralizada (Joi + env)
├── common/                                 # Código compartido
│   ├── constants/
│   │   ├── error.constants.ts              # Códigos y mensajes de error
│   │   ├── role.constants.ts               # Códigos de rol (ADM, USU)
│   │   ├── state-user.constants.ts         # Estados usuario (ACT, INA)
│   │   ├── state-package.constants.ts      # Estados de paquete (pendiente, en_tránsito, entregado)
│   │   ├── auth.constants.ts               # TOKEN_TYPE_BEARER, JWT_STRATEGY_NAME
│   │   └── http.constants.ts               # AUTHORIZATION_HEADER, DEFAULT_HTTP_TIMEOUT_MS
│   ├── exceptions/                         # Excepciones de dominio
│   ├── filters/domain-exception.filter.ts  # Mapea DomainException → HTTP
│   ├── auth/                               # JWT: JwtStrategy, JwtAuthGuard (HU-11)
│   ├── health/                             # Health checks (@nestjs/terminus)
│   ├── adapters/
│   │   ├── api-gateway.adapter.ts          # Cliente HTTP genérico
│   │   ├── http-user-api.adapter.ts        # IUserFinder → users-api
│   │   ├── http-package-api.adapter.ts     # IPackageFinder → packages-api
│   │   ├── simple-password.hasher.ts       # Hash de contraseñas
│   │   └── logger/
│   ├── contracts/                          # Puertos compartidos
│   │   ├── user-finder.contract.ts         # IUserFinder (packages → users)
│   │   ├── package-finder.contract.ts     # IPackageFinder (tracking → packages)
│   │   ├── api-gateway.contract.ts
│   │   └── password-hasher.contract.ts
│   └── infrastructure/
│       └── shared-infra.module.ts          # Módulo global (LOGGER, API_GATEWAY, USER_FINDER)
├── database/
│   ├── migrations/                         # Orden: roles → state_users → users → state_packages → packages → seeds
│   │   ├── 1738300000000-CreateRolesTable.ts
│   │   ├── 1738300000500-CreateStateUsersTable.ts
│   │   ├── 1738300001000-CreateUsersTable.ts
│   │   ├── 1738300001500-CreateStatePackagesTable.ts
│   │   ├── 1738300002000-CreatePackagesTable.ts
│   │   ├── 1738300002500-SeedAdminUser.ts
│   │   └── 1738300002600-SeedDefaultUsuario.ts
│   └── typeorm.config.ts
└── modules/
    ├── users/                              # users-api (puerto 2001)
    │   ├── domain/entities/
    │   ├── application/use-cases/           # HU-01, HU-02, HU-11 (LoginUseCase)
    │   ├── infrastructure/
    │   │   ├── bootstrap/                  # main.ts, users-app.module.ts
    │   │   ├── persistence/typeorm/
    │   │   └── http/
    │   └── users.module.ts
    ├── packages/                           # packages-api (puerto 2002)
    │   ├── domain/entities/
    │   ├── application/use-cases/           # HU-03, HU-04, HU-05, HU-06
    │   ├── infrastructure/
    │   │   ├── bootstrap/                  # main.ts, packages-app.module.ts
    │   │   ├── persistence/typeorm/
    │   │   └── http/
    │   └── packages.module.ts
    └── tracking/                            # tracking-api (puerto 2003)
        ├── domain/entities/
        ├── application/use-cases/           # HU-07, HU-08
        ├── infrastructure/
        │   ├── bootstrap/                  # main.ts, tracking-app.module.ts
        │   ├── persistence/mongoose/        # MongoDB (tracking_events)
        │   └── http/
        └── tracking.module.ts
```

## Base de datos

### Tablas

| Tabla             | Descripción                     |
|-------------------|---------------------------------|
| `roles`           | Roles del sistema (seed: ADM, USU) |
| `state_users`     | Estados de usuario (seed: ACT, INA) |
| `users`           | Usuarios (FK → roles, state_users) |
| `state_packages`  | Estados de paquete (seed: pendiente, en_tránsito, entregado) |
| `packages`        | Paquetes (FK → users, state_packages) |

### Estructura de `roles`

| Columna | Tipo        | Descripción       |
|---------|-------------|-------------------|
| id      | uuid (PK)   | Identificador     |
| name    | varchar(20) | Nombre del rol    |
| code    | varchar(10) | Código corto (único) |

**Seed inicial:** admin (ADM), user (USU).

### Estructura de `state_users`

| Columna     | Tipo        | Descripción       |
|-------------|-------------|-------------------|
| id          | uuid (PK)   | Identificador     |
| codigo      | varchar(20) | Código único (ACT, INA) |
| descripcion | varchar(100)| Descripción       |

**Seed inicial:** Activo (ACT), Inactivo (INA).

### Estructura de `state_packages`

| Columna     | Tipo        | Descripción       |
|-------------|-------------|-------------------|
| id          | uuid (PK)   | Identificador     |
| codigo      | varchar(20) | Código único      |
| descripcion | varchar(100)| Descripción       |
| orden       | int         | Orden para UI     |

**Seed inicial:** pendiente (1), en_tránsito (2), entregado (3).

### Estructura de `users`

| Columna       | Tipo        | Descripción                |
|---------------|-------------|----------------------------|
| id            | uuid (PK)   | Identificador              |
| email         | varchar     | Email único                |
| password_hash | varchar     | Contraseña hasheada        |
| name          | varchar     | Nombre completo            |
| role_id       | uuid (FK)   | Referencia a roles         |
| state_user_id | uuid (FK)   | Referencia a state_users (ACT/INA) |
| created_at    | timestamp   | Fecha de creación          |
| updated_at    | timestamp   | Fecha de actualización     |

### Estructura de `packages`

| Columna          | Tipo        | Descripción                |
|------------------|-------------|----------------------------|
| id               | uuid (PK)   | Identificador              |
| user_id          | uuid (FK)   | Propietario (referencia users) |
| state_package_id | uuid (FK)   | Estado (referencia state_packages) |
| tracking_number  | varchar(50) | Número de seguimiento único |
| origin           | varchar(255)| Origen                     |
| destination      | varchar(255)| Destino                    |
| created_at       | timestamp   | Fecha de creación          |
| updated_at       | timestamp   | Fecha de actualización     |

## Tests

```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test:cov
```

## Historias de usuario (HU) - Seguimiento

> **Roadmap para XMind:** Ver `docs/roadmap-historias-usuario.opml` o `docs/roadmap-historias-usuario.md`
> - Importar en XMind: **File > Import** → seleccionar archivo `.opml`

### Resumen de progreso

| HU    | Rol(es)                    | Historia de usuario                                                                 | Estado      | Endpoint(s)      |
|-------|----------------------------|-------------------------------------------------------------------------------------|-------------|------------------|
| HU-01 | Administrador              | Crear nuevos usuarios para que puedan registrarse y usar los servicios de paquetes | ✅ Completada | `POST /api/users` |
| HU-02 | Administrador, Usuario     | Consultar datos de un usuario (información personal y estado)                       | ✅ Completada | `GET /api/users/:id` |
| HU-03 | Usuario                    | Ver todos los paquetes registrados para hacer seguimiento                           | ✅ Completada | `GET /api/packages` |
| HU-04 | Usuario                    | Registrar un nuevo paquete para gestionar y rastrear hasta la entrega               | ✅ Completada | `POST /api/packages` |
| HU-05 | Usuario, Administrador     | Consultar datos de un paquete (estado, origen, destino, propietario)                | ✅ Completada | `GET /api/packages/:id` |
| HU-06 | Administrador, Sistema     | Actualizar estado de un paquete (pendiente, en tránsito, entregado)                 | ✅ Completada | `PATCH /api/packages/:id` |
| HU-07 | Usuario, Sistema logística | Registrar eventos de seguimiento (ubicación y estado)                               | ✅ Completada | `POST /api/packages/:packageId/tracking-events` |
| HU-08 | Usuario                    | Consultar historial completo de un paquete                                          | ✅ Completada | `GET /api/packages/:packageId/tracking-events` |
| HU-09 | Administrador del sistema  | Script automatizado para copias de seguridad de bases de datos                      | ✅ Completada | cron-database (backup en `cron-database/backup/`) |
| HU-10 | Desarrollador              | Desplegar aplicación y bases de datos en contenedores                               | ✅ Completada | Docker Compose   |
| HU-11 | Usuario                    | Iniciar sesión para acceder solo a datos y funcionalidades permitidas               | ✅ Completada | `POST /api/auth/login` |

### Criterios de priorización (MVP)

1. **Alta** – Autenticación y usuarios (HU-11, HU-01, HU-02)
2. **Alta** – Gestión de paquetes (HU-04, HU-03, HU-05, HU-06)
3. **Media** – Seguimiento e historial (HU-07 ✅, HU-08 ✅) – MongoDB (tracking-api)
4. **Media** – Infraestructura (HU-10) – Docker
5. **Baja** – Operaciones (HU-09 ✅) – Backups automáticos (cron-database)

### Leyenda

- ✅ Completada
- 🔄 En progreso
- ⏳ Pendiente

## Estándares del proyecto

### 1. Arquitectura

| Estándar | Implementación |
|----------|----------------|
| **Arquitectura Hexagonal** | Dominio aislado, puertos (interfaces) y adaptadores |
| **Inversión de dependencias** | Casos de uso dependen de interfaces (IUserRepository), no de implementaciones |
| **Separación por capas** | `domain/` → `application/` → `infrastructure/` por módulo |

### 2. Estructura de carpetas (por módulo)

```
modules/{nombre}/
├── domain/           # Entidades puras, sin framework
├── application/      # Puertos (interfaces) + casos de uso
└── infrastructure/   # Adaptadores: http/, persistence/
```

### 3. Nomenclatura

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Archivos | kebab-case | `create-user.use-case.ts`, `user.repository.port.ts` |
| Clases | PascalCase | `CreateUserUseCase`, `UserSchema` |
| Interfaces | Prefijo `I` | `IUserRepository` |
| DTOs | Sufijo `Dto` | `CreateUserDto`, `UserResponseDto` |
| Entidades dominio | Nombre del concepto | `User` |
| Schemas TypeORM | Sufijo `Schema` | `UserSchema` |
| Base de datos | snake_case | `password_hash`, `created_at`, `is_active` |

### 4. Código y formato

| Herramienta | Configuración |
|-------------|---------------|
| **TypeScript** | Target ES2021, CommonJS, decorators habilitados |
| **ESLint** | `@typescript-eslint/recommended`, integración Prettier |
| **Prettier** | Comillas simples, trailing commas |
| **Comentarios JSDoc** | En entidades, puertos y adaptadores para claridad |

### 5. API REST

| Estándar | Implementación |
|----------|----------------|
| **Prefijo global** | `/api` para todos los endpoints |
| **Recursos** | Plural, sustantivos | `/api/users` |
| **Métodos HTTP** | GET (consulta), POST (crear), PATCH/PUT (actualizar) |
| **Content-Type** | `application/json` |
| **Documentación** | Swagger/OpenAPI en `/api/docs` |
| **Decoradores API** | `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiProperty` |

### 6. Validación y errores

| Estándar | Implementación |
|----------|----------------|
| **Validación de entrada** | `class-validator` en DTOs |
| **ValidationPipe global** | `whitelist`, `forbidNonWhitelisted`, `transform` |
| **Excepciones de dominio** | `DomainException` base + excepciones específicas |
| **Filter global** | `DomainExceptionFilter` mapea excepciones → HTTP |
| **Mensajes** | En español, claros para el cliente |

**Formato de error:**
```json
{
  "statusCode": 409,
  "code": "USR001",
  "message": "Ya existe un usuario con el email proporcionado",
  "timestamp": "2026-01-31T05:00:00.000Z"
}
```

**Códigos de error:**
| Código | HTTP | Descripción |
|--------|------|-------------|
| USR001 | 409  | Email duplicado |
| USR002 | 400  | Rol inválido (códigos válidos: ADM, USU) |
| USR003 | 404  | Usuario no encontrado |
| USR005 | 401  | Credenciales inválidas (login) |
| PKG001 | 404  | Paquete no encontrado |
| PKG002 | 409  | Número de seguimiento duplicado |
| PKG003 | 400  | Estado de paquete inválido (pendiente, en_tránsito, entregado) |
| ERR000 | 403  | Sin permiso (ej. usuario consultando otro perfil, paquete ajeno) |

### 7. DTOs y respuestas

| Estándar | Implementación |
|----------|----------------|
| **Request** | DTOs con validadores + `@ApiProperty` para Swagger |
| **Response** | DTOs que no exponen datos sensibles (sin password) |
| **Mapeo dominio→response** | Método estático `fromDomain()` en DTOs de respuesta |

### 8. Persistencia

| Estándar | Implementación |
|----------|----------------|
| **Base de datos SQL** | PostgreSQL para usuarios y paquetes (TypeORM) |
| **Base de datos NoSQL** | MongoDB para eventos de seguimiento (Mongoose, colección `tracking_events`) |
| **ORM** | TypeORM (users, packages), Mongoose (tracking) |
| **Entidades vs dominio** | Schema TypeORM/Mongoose separado de entidad dominio |
| **Mapeo** | Métodos `toSchema()` / `toDomain()` (TypeORM); `toDomain()` en repositorio Mongoose |
| **IDs** | UUID v4 (dominio); MongoDB usa además `_id` |

### 9. Testing

| Estándar | Implementación |
|----------|----------------|
| **Framework** | Jest |
| **Ubicación** | Archivo `.spec.ts` junto al código bajo prueba |
| **Casos de uso** | Tests unitarios con mocks de repositorios |
| **Patrón AAA** | Arrange, Act, Assert |
| **Nombres** | Descripción en español (`debe crear un usuario correctamente`) |

### 10. Seguridad (previsto)

| Consideración | Estado |
|---------------|--------|
| Datos sensibles en respuestas | ❌ No exponer password |
| Hash de contraseñas | ✅ SimplePasswordHasher (base64) – HU-11 |
| Autenticación/autorización | ✅ JWT Bearer (HU-11) |

## License

MIT
