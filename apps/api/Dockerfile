# Multi-stage Dockerfile for deka-api (Cloud Run)
FROM node:22-bookworm-slim AS builder

WORKDIR /app
COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Stage 2: Production Runner
FROM node:22-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 8080

CMD ["node", "dist/server.js"]
