FROM node:22-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package.json ./
RUN npm install --only=production

COPY server.js ./

USER node
EXPOSE 8080

CMD ["node", "server.js"]
