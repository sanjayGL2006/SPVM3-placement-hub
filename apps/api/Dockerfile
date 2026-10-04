# ==========================================
# Stage 1: Build Node.js TypeScript API
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Upgrade system packages for security patches and install build dependencies
RUN apk update && apk upgrade --no-cache && apk add --no-cache libc6-compat

# Copy workspace package manifests
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/

# Install dependencies using clean install
RUN npm ci

# Copy API and shared workspace source code
COPY apps/api ./apps/api
COPY packages/database ./packages/database

# Build Node.js TypeScript dist
WORKDIR /app/apps/api
RUN npm run build

# ==========================================
# Stage 2: Production Lean Runtime
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

# Upgrade system packages for security patches and install curl
RUN apk update && apk upgrade --no-cache && apk add --no-cache curl

# Security: Create non-root system user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy workspace manifests
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy compiled JavaScript output from builder stage
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Set file ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Environment defaults
ENV NODE_ENV=production \
    PORT=5000

# Expose Express server port
EXPOSE 5000

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start production Express server
CMD ["node", "apps/api/dist/server.js"]
