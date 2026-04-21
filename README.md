# URL Shortener with Analytics

Spec-driven (SDD) assignment: **Next.js (App Router)**, **TypeScript**, **Supabase**, **Tailwind** + **shadcn/ui** — short links, click analytics (source + simplified device), dashboard with daily/weekly views and top links, **CSV export** aligned with the dashboard date range.

## Assignment checklist

| Requirement                         | Where it lives                                               |
| ----------------------------------- | ------------------------------------------------------------ |
| Create short URLs                   | Dashboard → **New short link** (authenticated)               |
| Track clicks, source, device        | `[slug]` route handler → `clicks` table                      |
| Dashboard (daily/weekly, top links) | `/dashboard` (`days`, `view=day\|week`)                     |
| Export CSV                          | `/api/export?days=N` · **Export CSV** on dashboard (same window as charts) |

## Prerequisites

- **Node.js** 20+ recommended  
- **Supabase** project (hosted)  
- **npm** (repo uses `package-lock.json`; `pnpm`/`yarn` also work if you adapt commands)

## Setup

### 1. Install app dependencies

```bash
cd web && npm install
```

### 2. Environment variables

Copy the example file and fill in values from **Supabase → Project Settings → API**:

```bash
cp .env.local.example .env.local
```

| Variable                               | Purpose                                      |
| -------------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Project URL                                  |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_…`)         |
| `SUPABASE_SERVICE_ROLE_KEY`            | Server-only (slug lookup + click inserts on redirect) |
| `NEXT_PUBLIC_APP_URL`                  | Site origin for short URLs (e.g. `http://localhost:3000`) |

### 3. Database schema

In the Supabase **SQL Editor**, run (once per project):

[`docs/sql/001_initial.sql`](docs/sql/001_initial.sql)

Afterward, **Authentication → URL Configuration** → add redirect URL:

`http://localhost:3000/auth/callback`

(add your production URL when you deploy.)

### 4. Run locally

```bash
cd web && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. CSV export

While signed in, open **Dashboard** and choose **Last 7 days** / **Last 30 days**. Click **Export CSV** to download **`slug`, `destination_url`, `click_count`** for every link you own within that rolling window (`GET /api/export?days=7` uses the **same date logic** as the dashboard).

Requires an authenticated session (same cookies as the app).

## Documentation (SDD)

- [`docs/SPEC.md`](docs/SPEC.md) — requirements → implementation mapping  
- [`docs/PLAN.md`](docs/PLAN.md) — phased delivery  

## Development tooling (MCP)

Per the assignment, agents may use **MCP** during development (e.g. browser tooling to verify redirects/dashboard, or docs/schema lookup). MCP servers are configured in your **Cursor** environment — they are **not** a runtime dependency of the deployed app.

## Scripts (`web/`)

| Command        | Description      |
| -------------- | ---------------- |
| `npm run dev`  | Next.js dev server |
| `npm run build`| Production build |
| `npm run start`| Run production build |
| `npm run lint` | ESLint           |

## Optional hardening

- Rate limiting on link creation or redirects is **not** implemented; add at the edge or API layer for production.
