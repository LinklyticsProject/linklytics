# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10.19.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/auth-service/package.json ./apps/auth-service/
COPY apps/web-service/package.json ./apps/web-service/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage for auth service
FROM base AS auth-builder
WORKDIR /app/apps/auth-service
RUN pnpm run build

# Build stage for web service
FROM base AS web-builder
WORKDIR /app/apps/web-service
RUN pnpm run build

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm@10.19.0

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/auth-service/package.json ./apps/auth-service/
COPY apps/web-service/package.json ./apps/web-service/

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built applications
COPY --from=auth-builder /app/apps/auth-service/dist ./apps/auth-service/dist
COPY --from=web-builder /app/apps/web-service/.next ./apps/web-service/.next
COPY --from=web-builder /app/apps/web-service/public ./apps/web-service/public
COPY --from=web-builder /app/apps/web-service/package.json ./apps/web-service/package.json

# Copy shared types
COPY packages/shared-types ./packages/shared-types

# Create startup script
RUN echo '#!/bin/sh\n\
cd /app/apps/auth-service && node dist/main.js &\n\
cd /app/apps/web-service && npm start\n\
wait' > /app/start.sh && chmod +x /app/start.sh

# Change ownership to app user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose ports
EXPOSE 3000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start both services
CMD ["/app/start.sh"]
