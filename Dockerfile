FROM node:22-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/schema/package.json packages/schema/package.json
COPY packages/sdk-js/package.json packages/sdk-js/package.json
RUN npm ci

FROM deps AS build
COPY package.json ./
COPY apps/web ./apps/web
COPY packages ./packages
ARG NEXT_PUBLIC_VET_CONSOLE_URL=http://localhost:3000
ENV NEXT_PUBLIC_VET_CONSOLE_URL=$NEXT_PUBLIC_VET_CONSOLE_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /repo
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV VET_DEPLOYMENT=self-host
ENV VET_DATA_DIR=/data
ENV PORT=43173

COPY --from=build --chown=node:node /repo/package.json ./package.json
COPY --from=build --chown=node:node /repo/apps/web/package.json ./apps/web/package.json
COPY --from=build --chown=node:node /repo/packages ./packages
COPY --from=build --chown=node:node /repo/node_modules ./node_modules
COPY --from=build --chown=node:node /repo/apps/web/.next ./apps/web/.next
COPY --from=build --chown=node:node /repo/apps/web/next.config.ts ./apps/web/next.config.ts
COPY --from=build --chown=node:node /repo/apps/web/public ./apps/web/public

RUN mkdir -p /data && chown node:node /data

USER node
EXPOSE 43173
VOLUME /data
CMD ["npm", "run", "start"]
