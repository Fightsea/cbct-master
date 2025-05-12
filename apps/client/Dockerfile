FROM node:20-alpine AS base
ARG ASSET_PROVIDER_DOMAIN
ARG AUTH_STORE_ENCRYPTION_KEY

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/
RUN npm install -g turbo

FROM base AS pruner
WORKDIR /app

COPY . .

RUN turbo prune client --docker

FROM base as builder
WORKDIR /app

ENV ASSET_PROVIDER_DOMAIN=${ASSET_PROVIDER_DOMAIN}
ENV AUTH_STORE_ENCRYPTION_KEY=${AUTH_STORE_ENCRYPTION_KEY}

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install  --frozen-lockfile

COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm --filter client deploy full
WORKDIR /app/full
RUN pnpm run build
RUN rm -rf ./.next/cache

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/full/next.config.ts .
COPY --from=builder /app/full/package.json .

COPY --from=builder --chown=nextjs:nodejs /app/full/.next .
COPY --from=builder --chown=nextjs:nodejs /app/full/.next/static ./standalone/full/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/full/public ./standalone/full/public

EXPOSE 3000
CMD node ./standalone/full/server.js
