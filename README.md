# 25 West Gallery

A minimal, editorial-style gallery website for **25 West Gallery** — serif-led
(Times New Roman), monochrome by default, art-first, with a cloud-backed admin
panel for editing all site content.

## Run locally

```bash
npm install
cp .env.example .env   # fill in POSTGRES_URL or DATABASE_URL + auth secrets
npm run db:seed
npm run dev            # starts local API (port 3002) + Vite (port 5173) together
```

> **Local login needs both servers.** `npm run dev` now runs the API and Vite
> together. If you only run Vite, `/api/*` requests fail with `ECONNREFUSED`.

For frontend-only dev (falls back to static content when API is unavailable):

```bash
npm run dev
```

## Deploy on Vercel

1. **Push** this repo to GitHub and import into Vercel.
2. **Add Neon Postgres** — Vercel dashboard → Storage → Create Database → Postgres. This sets `DATABASE_URL` automatically.
3. **Add Vercel Blob** — Storage → Create → Blob. This sets `BLOB_READ_WRITE_TOKEN`.
4. **Set env vars** in Vercel → Settings → Environment Variables:
   - `JWT_SECRET` — a long random string (32+ characters)
   - `ADMIN_USERNAME` — your admin login name
   - `ADMIN_PASSWORD` — your admin password
   - `BLOB_READ_WRITE_TOKEN` — from Blob storage (usually auto-set)
   - **Database:** Vercel Neon sets `POSTGRES_URL` automatically — the app reads
     that. You do **not** need to manually add `DATABASE_URL` unless you want to.
5. **Seed the database** once from your machine (with `DATABASE_URL` in `.env`, or inline):
   ```bash
   npm run db:seed
   ```
6. **Redeploy** after seeding so production picks up any API fixes — Vercel runs `npm run build` and serves the SPA from `dist/` with API routes from `api/`.

## Admin panel

- URL: `/admin`
- Login with `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- Manage exhibitions, events, artists, works, opportunities, and gallery settings
- **Gallery Settings → Launch & coming soon** — toggle full-screen pre-launch page, set launch date, headline, hero image
- **Mailing list** (`/admin/signups`) — view and export emails from the coming soon signup form
- Upload images → stored in Vercel Blob; URLs saved to the database
- Public site reads live content from `GET /api/content`
- While coming soon is on, admins can preview the full site at `/?preview=1`

## Coming soon page

When enabled in Gallery Settings, visitors see a full-screen page with countdown, email signup, and contact links. `/admin` always works. The site goes live automatically on the launch date, or when you turn the toggle off.

**Existing production DB** — run once in Neon SQL if you haven't re-seeded:

```sql
ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS coming_soon_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS launch_date DATE;
ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS coming_soon_headline TEXT;
ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS coming_soon_message TEXT;
ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS coming_soon_image_url TEXT;
ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS about_headline TEXT;
ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS about_image_url TEXT;

ALTER TABLE gallery_settings
  ADD COLUMN IF NOT EXISTS about_quote TEXT,
  ADD COLUMN IF NOT EXISTS home_between_headline TEXT,
  ADD COLUMN IF NOT EXISTS home_between_message TEXT,
  ADD COLUMN IF NOT EXISTS exhibitions_headline TEXT,
  ADD COLUMN IF NOT EXISTS exhibitions_intro TEXT,
  ADD COLUMN IF NOT EXISTS events_headline TEXT,
  ADD COLUMN IF NOT EXISTS events_intro TEXT,
  ADD COLUMN IF NOT EXISTS artists_headline TEXT,
  ADD COLUMN IF NOT EXISTS artists_intro TEXT,
  ADD COLUMN IF NOT EXISTS opportunities_headline TEXT,
  ADD COLUMN IF NOT EXISTS opportunities_intro TEXT,
  ADD COLUMN IF NOT EXISTS contact_headline TEXT,
  ADD COLUMN IF NOT EXISTS contact_intro TEXT,
  ADD COLUMN IF NOT EXISTS footer_tagline TEXT;

CREATE TABLE IF NOT EXISTS mailing_list (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Architecture

| Layer | Tech |
|-------|------|
| Frontend | Vite + React + React Router |
| API | Vercel serverless functions in `api/` |
| Database | Neon Postgres |
| Images | Vercel Blob |
| Auth | JWT httpOnly cookie (`jose`) |

## Key files

- `db/schema.sql` — Postgres table definitions
- `scripts/seed.js` — seeds DB from `src/data/content.js`
- `api/handler.js` — **single** Vercel serverless function (Hobby-plan friendly) — all routes via `vercel.json` rewrite
- `api/lib/router.js` — route dispatcher for content, auth, admin CRUD, uploads
- `src/context/ContentContext.jsx` — fetches content for public pages
- `src/admin/` — admin panel UI

## Content fallback

If `/api/content` is unavailable (e.g. plain `vite` without env vars), the site
falls back to the static data in `src/data/content.js` so the gallery still renders.

## Manual test plan

1. Run `npm run db:seed` then `npm run dev:full`
2. Visit `/` — content loads from API
3. Visit `/admin` — log in, edit an event, save
4. Refresh `/events` — change appears
5. Upload an image on an artist — image shows on `/artists/:slug`
6. Log out — `/admin/dashboard` redirects to login
