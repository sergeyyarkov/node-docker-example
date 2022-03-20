ARG NODE_IMAGE=node:14.17.3-alpine3.11

FROM ${NODE_IMAGE} as base

RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node

FROM base as dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci --only-production

FROM base as production

ENV NODE_ENV=production
ENV PG_HOST=localhost
ENV PG_PORT=5432
ENV PG_USER=postgres
ENV PG_PASSWORD=1234
ENV PG_DB_NAME=articles

COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node . .
EXPOSE 4000
CMD ["dumb-init", "node", "index.js"]