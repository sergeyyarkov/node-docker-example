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

COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node . .
RUN ["chmod", "+x", "./scripts/wait-for.sh"]
EXPOSE 4000
CMD ["dumb-init", "node", "index.js"]