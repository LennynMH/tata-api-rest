# Contenedor del módulo Packages (HU-03, HU-04, HU-05)
# Contexto de build: raíz del repo (.)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:packages-api

FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 2002

ENV PORT=2002
CMD ["node", "dist/packages-api/modules/packages/infrastructure/bootstrap/main.js"]
