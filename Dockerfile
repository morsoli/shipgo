FROM node:24.12.0-slim AS dependencies

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM dependencies AS builder

ARG VITE_APP_URL=http://localhost:3000
ARG VITE_DEFAULT_LOCALE=en
ARG VITE_ENABLED_LOCALES=en,zh
ARG VITE_CURRENCY=USD

ENV VITE_APP_URL=${VITE_APP_URL}
ENV VITE_DEFAULT_LOCALE=${VITE_DEFAULT_LOCALE}
ENV VITE_ENABLED_LOCALES=${VITE_ENABLED_LOCALES}
ENV VITE_CURRENCY=${VITE_CURRENCY}

COPY . .
RUN pnpm build

FROM node:24.12.0-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=builder --chown=node:node /app/.output ./

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD kill -0 1

ENTRYPOINT ["node", "server/index.mjs"]
