FROM node:24.13-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:24.13-alpine

ENV NODE_ENV=production

WORKDIR /app

USER node

COPY --from=builder --chown=node:node /app/dist/apps/flight-planner ./dist/apps/flight-planner

ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/apps/flight-planner/server/server.mjs"]
