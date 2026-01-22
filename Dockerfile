# Optimized Dockerfile for PayloadCMS + Next.js application
# Based on https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# Requires output: 'standalone' in next.config.mjs for Docker builds
#
# Optimizations:
# - Multi-stage build for minimal production image
# - PayloadCMS-specific build steps (generate:importmap, generate:types)
# - Native dependencies for PayloadCMS (python3, make, g++)
# - Memory-optimized Node.js settings
# - Security hardening with non-root user
# - Layer caching for faster rebuilds

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Required for some Node.js packages and PayloadCMS
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml* ./
# Copy additional config files that may affect dependency resolution
COPY .npmrc .pnpmrc* turbo.json* ./
# Install dependencies with optimized settings for PayloadCMS
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && \
    pnpm install --frozen-lockfile --ignore-scripts; \
  elif [ -f yarn.lock ]; then \
    yarn install --frozen-lockfile --ignore-scripts; \
  elif [ -f package-lock.json ]; then \
    npm ci --ignore-scripts; \
  else \
    echo "No lockfile found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache libc6-compat python3 make g++

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and config files
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Set environment for Docker-optimized build
ENV DOCKER_BUILD=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the application with PayloadCMS optimizations
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && \
    pnpm generate:importmap && \
    pnpm generate:types && \
    pnpm build; \
  elif [ -f yarn.lock ]; then \
    yarn generate:importmap && \
    yarn generate:types && \
    yarn build; \
  elif [ -f package-lock.json ]; then \
    npm run generate:importmap && \
    npm run generate:types && \
    npm run build; \
  else \
    echo "No lockfile found." && exit 1; \
  fi

# Production image, optimized for PayloadCMS + Next.js
FROM base AS runner
WORKDIR /app

# Production environment settings
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Create necessary directories with correct permissions
RUN mkdir -p .next && \
    chown -R nextjs:nodejs .next

# Copy optimized standalone build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js
