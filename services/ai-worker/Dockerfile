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

COPY package.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

USER node

CMD ["node", "dist/index.js"]
