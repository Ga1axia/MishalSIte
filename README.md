# 25 West Gallery

A minimal, editorial-style gallery website for **25 West Gallery** — serif-led
(Times New Roman), monochrome by default, art-first, with a cloud-backed admin
panel for editing all site content.

## Run locally

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL + other credentials
npm run db:seed        # reads .env automatically; creates tables + seed content
npm run dev:full       # Vercel dev — required for /api routes locally
```

> **Important:** `npm run dev` (Vite alone) does **not** run the API. Admin and live
> content need `npm run dev:full` locally, or a deployed Vercel URL. Install the
> Vercel CLI first if needed: `npm i -g vercel`

For frontend-only dev (falls back to static content when API is unavailable):

```bash
npm run dev
```

## Deploy on Vercel

1. **Push** this repo to GitHub and import into Vercel.
2. **Add Neon Postgres** — Vercel dashboard → Storage → Create Database → Postgres. This sets `DATABASE_URL` automatically.
3. **Add Vercel Blob** — Storage → Create → Blob. This sets `BLOB_READ_WRITE_TOKEN`.
4. **Set env vars** in Vercel → Settings → Environment Variables:
   - `ADMIN_USERNAME` — your admin login name
   - `ADMIN_PASSWORD` — your admin password
   - `JWT_SECRET` — a long random string (32+ characters)
5. **Seed the database** once from your machine (with `DATABASE_URL` in `.env`, or inline):
   ```bash
   npm run db:seed
   ```
6. **Redeploy** after seeding so production picks up any API fixes — Vercel runs `npm run build` and serves the SPA from `dist/` with API routes from `api/`.

## Admin panel

- URL: `/admin`
- Login with `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- Manage exhibitions, events, artists, works, opportunities, and gallery settings
- Upload images → stored in Vercel Blob; URLs saved to the database
- Public site reads live content from `GET /api/content`

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
- `api/content.js` — public content endpoint
- `api/auth/` — login, logout, session check
- `api/admin/` — CRUD + image upload
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
