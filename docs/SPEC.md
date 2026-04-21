# Specification: URL Shortener with Analytics

This document maps the assignment requirements to a concrete technical implementation using **Next.js (App Router)**, **TypeScript**, **Supabase**, **Tailwind CSS**, and an **SDD (Spec → Plan → Implement)** workflow with **Agent Mode** and an **MCP server** for tooling and external context (schemas, API verification, optional browser testing).

---

## 1. Create short URLs

| Requirement | Behavior | Implementation |
|-------------|----------|----------------|
| Users can turn a long URL into a short link | Accept a destination URL; return a unique short path (and full short URL using the app’s public base URL). | **Supabase**: `links` table stores `id` (UUID), `user_id` (FK to `auth.users`), `slug` (unique), `destination_url`, `created_at`, optional `title`/metadata. **Next.js**: Server Action or Route Handler `POST /api/links` (or form in a “Create link” page) validates URL, generates `slug` (nanoid or similar), inserts row **for the authenticated user**, returns `{ slug, shortUrl }`. **UI**: Simple form with destination input, optional custom slug if product allows it (spec assumes auto-generated slug only unless extended in PLAN). |

**Acceptance criteria**

- Invalid URLs are rejected with a clear error.
- Colliding slugs are handled (retry or error).
- Short URL uses the deployed site origin (via `NEXT_PUBLIC_APP_URL` or equivalent).

---

## 2. Track clicks, source, and device (simplified)

| Requirement | Behavior | Implementation |
|-------------|----------|----------------|
| Count every visit to a short link | Increment or derive click count per link. | Store **one row per click** in `clicks` (or `analytics_events`) for flexible reporting; derive counts with `COUNT(*)` or maintain a cached `links.click_count` updated via trigger or application (PLAN chooses one). |
| Source | Where the click came from (referrer / UTM simplified). | On redirect: parse `Referer` header and optional `utm_source` query params on the **incoming** short URL request; persist `referrer_host` or `source_label` (e.g. `"direct"` if absent). |
| Device (simplified) | Rough device category. | Parse `User-Agent` server-side into a small enum: `desktop` \| `mobile` \| `tablet` \| `unknown` (library or minimal regex—keep dependency-light). |

**Technical flow**

- **Route**: Dynamic segment `app/[slug]/route.ts` (or `middleware` + Edge handler) resolves `slug` → `destination_url`.
- **Before redirect (302/307)**: Insert analytics row with `link_id`, `clicked_at`, `source`, `device`, optional raw `user_agent` for debugging (optional column, can omit in MVP).
- **Privacy**: Document that IPs are not stored unless explicitly required later; align with company policy.

**Acceptance criteria**

- Each redirect produces at most one analytics row per request (avoid double-fire from prefetch if applicable—Next.js prefetch behavior must be considered; short-link hits should typically not be prefetched by default for external redirects).

---

## 3. Dashboard for statistics (daily / weekly, top links)

| Requirement | Behavior | Implementation |
|-------------|----------|----------------|
| Daily / weekly stats | Show click trends over time. | **Queries**: Aggregate `clicks` by `date_trunc('day', clicked_at)` and filter ranges (last 7 days, last 30 days, custom). Weekly = aggregate by ISO week or rolling 7-day window (PLAN picks one and sticks to it). |
| Top links | Rank links by click volume in the selected period. | **Query**: `JOIN links` + `GROUP BY link_id` + `ORDER BY count DESC` + `LIMIT N`. |
| Dashboard UI | At-a-glance metrics and charts/tables. | **Next.js**: Protected `app/dashboard/page.tsx` (or `(dashboard)` layout). **UI**: Tailwind + simple chart (e.g. CSS bars or a single lightweight chart lib if allowed). Cards: total clicks, period comparison, table of top links with slug and destination truncated. |

**Acceptance criteria**

- User can switch period: at minimum **daily view (last N days)** and **weekly rollup**.
- Top links respect the same date filter.

---

## 4. Export CSV

| Requirement | Behavior | Implementation |
|-------------|----------|----------------|
| Export analytics or link list | Downloadable CSV for spreadsheets. | **Route**: `GET /api/export.csv` (or `/api/analytics/export`) with query params matching dashboard filters (`from`, `to`). **Server**: Supabase query → CSV string → `Content-Type: text/csv`, `Content-Disposition: attachment`. **Default export shape**: **per-link totals** within the selected date range (one row per link with aggregate click count), not a time series—simple and assignment-complete. |

**Acceptance criteria**

- File opens cleanly in Excel/Sheets (UTF-8 BOM optional for Excel on Windows).

---

## Cross-cutting concerns

| Concern | Decision |
|---------|----------|
| **Authentication** | **Supabase Auth** for sign-in/sign-up; each `links.user_id` ties rows to `auth.users`. Dashboard and “create link” flows require an authenticated session; redirect/analytics remain **public** short URLs resolved server-side (service role for slug lookup + click insert per RLS design). |
| **Rate limiting** | Recommend Edge/middleware or Supabase RLS-friendly application limits for `POST` create and redirect storm (noted in PLAN). |
| **SDD + Agent Mode** | SPEC (this doc) → PLAN → Implement in discrete tasks; Agent Mode executes PLAN steps with review gates. |
| **MCP server** | Use MCP during implementation for: Supabase/project docs lookup, optional **browser MCP** for E2E verification of redirect and dashboard, schema inspection where applicable—not a runtime dependency of the shipped app. |

---

## Environment variables (reference)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client-safe **publishable** key (`sb_publishable_…`) for browser and SSR clients; replaces legacy anon JWT |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only secret / **service_role** key for redirect + click inserts (bypasses RLS by design for those writes) |
| `NEXT_PUBLIC_APP_URL` | Canonical base for building short URLs |

---

## Out of scope (unless PLAN expands)

- Custom domains per tenant, QR codes, link expiration, bulk import, fine-grained geo beyond simplified device/source.

---

## Traceability matrix

| Assignment requirement | SPEC section | Primary deliverable |
|------------------------|--------------|----------------------|
| Create short URLs | §1 | `links` table + create API/UI |
| Click / source / device tracking | §2 | `clicks` table + `[slug]` redirect handler |
| Dashboard daily/weekly + top links | §3 | Dashboard page + Supabase aggregates |
| Export CSV | §4 | CSV route + shared filter logic |
