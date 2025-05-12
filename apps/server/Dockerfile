FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm install -g turbo

FROM base AS pruner
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
COPY . .
RUN turbo prune server --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install dependencies (as they change less often)
COPY turbo.json turbo.json
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Build the project and its dependencies
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=server...

RUN rm -rf node_modules
RUN pnpm install --frozen-lockfile --prod

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 cbct

COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

RUN mkdir -p /app/logs && chmod -R 777 /app/logs
RUN mkdir -p /app/apps/server/uploads &&  chmod -R 777 /app/apps/server/uploads

USER cbct

EXPOSE 8080
CMD node apps/server/dist/server.js