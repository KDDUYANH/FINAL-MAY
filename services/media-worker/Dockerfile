FROM node:22-bookworm-slim AS builder

WORKDIR /app
COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Stage 2: Runner with FFmpeg
FROM node:22-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install FFmpeg and clean apt cache
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]
