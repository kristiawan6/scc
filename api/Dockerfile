# CMS API (Hono on Bun). Build from the repo root, since it imports ../lib and ../content:
# docker build -t scc-api -f api/Dockerfile .
FROM oven/bun:1.3.6
WORKDIR /app
COPY --chown=bun:bun package.json bun.lock bunfig.toml ./
COPY --chown=bun:bun api/package.json api/package.json
RUN bun install --frozen-lockfile --production --filter scc-api
# --chown: some repo files are mode 600, and the app runs as the bun user.
COPY --chown=bun:bun tsconfig.json ./
COPY --chown=bun:bun lib lib
COPY --chown=bun:bun content content
COPY --chown=bun:bun api api
RUN mkdir -p /data/uploads && chown bun:bun /data/uploads
WORKDIR /app/api
ENV NODE_ENV=production PORT=3001 UPLOAD_DIR=/data/uploads
USER bun
EXPOSE 3001
# Pending migrations run on every start (each one applies once).
CMD ["sh", "-c", "bun scripts/migrate.ts && exec bun src/index.ts"]
