# Contenedor del módulo Users (HU-01, HU-02)
# Contexto de build: raíz del repo (.)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:users-api

FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 2001

ENV PORT=2001
CMD ["node", "dist/users-api/modules/users/infrastructure/bootstrap/main.js"]
