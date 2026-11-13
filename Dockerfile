# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS base
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

FROM base AS builder
ARG NEXT_PUBLIC_SITE_URL
ARG PAYLOAD_PUBLIC_URL
ARG PAYLOAD_PROJECT_KEY=tgsepma
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV PAYLOAD_PUBLIC_URL=${PAYLOAD_PUBLIC_URL}
ENV PAYLOAD_PROJECT_KEY=${PAYLOAD_PROJECT_KEY}
# next build must run with NODE_ENV=production. With NODE_ENV=development,
# Next compiles pages with the dev runtime (app-page.runtime.dev.js) and
# static prerendering of client components (e.g. motion's Reveal) crashes
# with "Cannot read properties of null (reading 'useContext')".
# devDependencies are already installed in the deps stage; setting this
# here does not remove them, it only controls the build mode.
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
RUN apt-get update && apt-get install -y --no-install-recommends python3-venv \
  && python3 -m venv /opt/didban-venv \
  && rm -rf /var/lib/apt/lists/*
COPY didban/requirements.lock.txt /tmp/didban-requirements.txt
RUN /opt/didban-venv/bin/pip install --no-cache-dir -r /tmp/didban-requirements.txt
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV PAYLOAD_PUBLIC_URL=http://freelance-client-cms:3000
ENV PAYLOAD_PROJECT_KEY=tgsepma

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json
COPY didban ./didban
COPY scripts/start-services.mjs ./scripts/start-services.mjs

EXPOSE 3000
CMD ["node", "scripts/start-services.mjs"]
