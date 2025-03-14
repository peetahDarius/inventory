FROM node:18.20-alpine

ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /inventory-frontend

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build