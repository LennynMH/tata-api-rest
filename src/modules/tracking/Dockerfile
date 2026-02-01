# Contenedor del módulo Tracking (HU-07, HU-08)
# Contexto de build: raíz del repo (.)
# Base de datos: MongoDB (NoSQL)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:tracking-api

FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 2003

ENV PORT=2003
CMD ["node", "dist/tracking-api/modules/tracking/infrastructure/bootstrap/main.js"]
