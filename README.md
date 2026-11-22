# GBI Soho City Church website

Bun workspace with two apps:

| | Stack | Folder |
| --- | --- | --- |
| Website + CMS (`/admin`) | Next.js 15 (App Router), TypeScript, Tailwind v4, Framer Motion, Tiptap | repo root |
| API | Hono + TypeScript on Bun, Postgres (`Bun.SQL`), Redis (`Bun.RedisClient`), S3/MinIO (`Bun.S3Client`) | `api/` |

```
app/(site)/        public pages          app/admin/       CMS (client pages, talks to the API)
components/        site sections         components/admin/ CMS editor (fields, Tiptap rich text)
content/           current site content  lib/cms.ts       content model shared by API + CMS
api/src/           Hono app, routes      api/migrations/  SQL migrations
api/scripts/       migrate, seed, create-admin
```

## Run

```bash
bun install
cp .env.example .env.local          # NEXT_PUBLIC_API_URL
cp api/.env.example api/.env        # database, redis, S3, JWT secrets

bun run db:migrate                  # apply api/migrations/*.sql
bun run db:seed                     # load current /content into the DB (skips non-empty collections)
bun run admin:create you@gbiscc.org "Nama Kamu"   # asks for a password (min 12 chars)

bun run dev:api                     # API on PORT (default 3001)
bun dev                             # website on http://localhost:3000, CMS on /admin
bun test                            # web + API tests
bun run build                       # production build (type-check + lint)
```

## API

| Route | Auth | |
| --- | --- | --- |
| `GET /content/:collection` | public | published items in order (`highlights`, `ministries`, `next-steps`, `campuses`) |
| `GET /site` | public | church-wide settings |
| `POST /contact` | public | contact form, 5 per hour per IP |
| `POST /auth/login`, `/auth/refresh`, `/auth/logout`, `GET /auth/me` | | httpOnly cookies: access token (`JWT_EXPIRES_IN`, default 15m) + refresh token (`JWT_REFRESH_EXPIRES_IN`, default 7d, scoped to `/auth`, single-use and revoked on logout via Redis). Login: 10 tries per 15 min per IP |
| `/admin/content/:collection[/:id]`, `PUT .../order` | admin | CRUD, draft/publish, reorder |
| `GET/PUT /admin/site` | admin | site settings |
| `POST /admin/uploads` | admin | image upload (JPG/PNG/WebP/AVIF/GIF, checked by file signature) to S3, or `UPLOAD_DIR` when `S3_ENDPOINT` is empty |
| `/admin/messages[/:id]` | admin | contact inbox |

- **Content model:** `lib/cms.ts` defines every collection's fields once. The API builds its validators from it and the CMS builds its forms from it, so adding a field is a one-file change.
- **Rich text** is sanitized server-side with an allowlist (Bun `HTMLRewriter`), so stored HTML is safe to render.
- **Cookies:** the website and API must be on the same site (e.g. `gbiscc.org` + `api.gbiscc.org`, or `localhost:3000` + `localhost:3001`) so the `SameSite=Lax` session cookie is sent. `NODE_ENV=production` makes them `Secure`. List the website origin(s) in `FRONTEND_URL`. The CMS renews the access token automatically.
- **PgBouncer:** the API disables prepared statements, so pointing `DATABASE_HOST`/`PORT` at a transaction-mode pooler works.

## CMS

`/admin` (not indexed). Each item opens in a WYSIWYG editor: the left canvas looks like the website section (same background, type and image ratio) and is edited in place, with a Tiptap toolbar for rich text and click-to-upload images. Links, alt text, IDs and schedules sit in the right panel. Unsaved changes warn before leaving.

The website still reads `content/*.ts`. Switching the sections to `GET /content/...` and `/site` is the next step; `bun run db:seed` already copies today's content into the database.

## Edit content

All copy and data live in typed files. Components never need to change for a content update.

| What | File |
| --- | --- |
| Church name, tagline, address, phone, socials, vision/mission, pastors, menu, partners, app links | `content/site.ts` |
| Service times, location, map | `content/campuses.ts` |
| "What's New" carousel (6 cards) | `content/highlights.ts` |
| Ministries (4 items) | `content/ministries.ts` |
| Next steps (`featured: true` shows on the homepage) | `content/next-steps.ts` |
| Every stock photo + hero video/poster | `lib/placeholders.ts` |

- Empty `href` on a social, partner or app link hides it (apps show "Segera hadir").
- Images from Bunny CDN / Cloudinary / Unsplash work out of the box. Other hosts go in `next.config.ts` → `images.remotePatterns`.
- Hero video: replace `heroVideo` and `public/hero-poster.jpg` together (poster = a frame of the video). Keep the video short and compressed (< 5 MB).
- Service times feed the schema.org `Church` JSON-LD automatically (`lib/jsonld.ts`).

## Pages

`/` · `/about` · `/jadwal-ibadah` · `/next-steps` · `/contact` · `/privacy`
Old URLs (`/tentang`, `/komunitas`, `/campuses`) 301-redirect to the new ones.

The contact form still opens the visitor's mail app (`components/ContactForm.tsx`). `POST /contact` on the API is ready, and messages show up in the CMS inbox once the form posts there.

## Deploy

- Website: any Node host. Vercel: framework "Next.js", install `bun install`, build `bun run build`, env `NEXT_PUBLIC_API_URL`. Self-hosted: `bun run build && bun run start`.
- API: `bun install && bun run db:migrate && bun run start:api` with `api/.env` set. Put it behind a reverse proxy on the same site as the website (e.g. `api.gbiscc.org`).

## Production (gbiscc.org)

Docker Compose on any Linux server with Docker: Caddy (automatic HTTPS) → `web` at `gbiscc.org` and `api` at `api.gbiscc.org`, plus Postgres and Redis. Files: `Dockerfile`, `api/Dockerfile`, `deploy/`.

1. DNS: `A` records for `gbiscc.org`, `www.gbiscc.org` and `api.gbiscc.org` → the server IP. Open ports 80 and 443.
2. On the server: `git clone` this repo, then `cp deploy/.env.example deploy/.env` and fill it (`openssl rand -hex 32` for each secret).
3. Start: `docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build`
   Migrations run automatically when the API starts.
4. First time only:
   - `docker compose -f deploy/docker-compose.yml --env-file deploy/.env exec api bun scripts/seed.ts` (load the current content into the CMS)
   - `docker compose -f deploy/docker-compose.yml --env-file deploy/.env exec api bun scripts/create-admin.ts you@example.com "Your Name"`
5. Update: `git pull`, then step 3 again.

Uploads live in the `uploads` volume, the database in `pgdata`. Back up both.
