# ─── Stage 1: Build Application ──────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy application source code
COPY . .

# Build production bundle
RUN npm run build

# ─── Stage 2: Serve with Nginx for Cloud Run ─────────────────
FROM nginx:alpine-slim

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Cloud Run optimized Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run defaults to container port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
