# Implementation plan: URL Shortener with Analytics

Three phases align with **Spec → Plan → Implement**: foundation first, then product features, then reporting/export and hardening. Each phase ends with a **review checkpoint** before the next.

**Related**: [`SPEC.md`](./SPEC.md)

---

## Phase 1 — Foundation: database, app shell, redirect spine

**Objective**: Supabase schema deployed; Next.js app scaffolded with Tailwind; environment wired; a working **redirect** records analytics and sends users to the destination.

**Work items**

- Apply SQL in Supabase (tables: `links`, `clicks` — [`docs/sql/001_initial.sql`](./sql/001_initial.sql)) with indexes for `slug`, `link_id`, `clicked_at`.
- Lock down **RLS**: public read for redirect resolution can be done via Route Handler using service role or a restricted `SECURITY DEFINER` RPC; **insert** clicks on redirect must be allowed in a controlled way (PLAN recommendation: server-only insert via service role or narrow policy).
- Scaffold Next.js (App Router) + TypeScript + Tailwind: layouts, basic home page placeholder.
- Implement **`/[slug]` redirect route**: lookup link by slug; insert click row (source/device simplified); HTTP redirect.
- Smoke-test with MCP/browser tools: hit short URL → destination opens → row in `clicks`.

**Checkpoint**: Manual verification that schema + redirect + one analytics row per click works.

---

## Phase 2 — Core product: create links + dashboard (daily / weekly + top links)

**Objective**: Users can create short URLs from the UI; dashboard shows aggregates consistent with SPEC.

**Work items**

- **Create short URL**: Form + Server Action or `POST /api/links`; validation; slug generation; insert `links`.
- **Dashboard**: Route(s) under `app/dashboard/` with server components fetching aggregates:
  - Daily series: clicks per day for selectable range (e.g. last 7 / 30 days).
  - Weekly rollup: either calendar week buckets or “last 7 days” totals — match SPEC wording (“daily/weekly”) by exposing **two toggles**: “By day” and “By week”.
  - **Top links**: ranked table for the same filter window.
- Tailwind UI: responsive layout, accessible tables, loading/error states.
- **Supabase Auth**: login/register UI, middleware/session refresh, protect dashboard and link-creation routes; only owners see their links and analytics.

**Checkpoint**: User can create a link, click it several times from different Referer/UA simulations, see numbers move on dashboard for daily/weekly and top links.

---

## Phase 3 — Export, polish, SDD closure

**Objective**: CSV export, code quality, assignment deliverables (docs + how to run).

**Work items**

- **CSV export**: `GET` handler with same filter parameters as dashboard; CSV columns documented; **default shape: per-link totals** in the selected range (`slug`, `destination_url`, `click_count`, etc.).
- Shared **filter types** between dashboard and export (single source of truth for date range).
- **MCP usage**: Final pass using MCP for documentation checks and optional browser verification of export download.
- README: setup (env vars), Supabase SQL order, `pnpm dev` / `npm run dev`, assignment requirements checklist.
- Optional: basic rate limit or abuse note on create endpoint.

**Checkpoint**: Assignment feature list satisfied; SPEC traceability reviewed; demo script ready.

---

## Phase summary

| Phase | Focus | Exit criteria |
|-------|--------|---------------|
| **1** | DB + redirect + analytics insert | Short link resolves; clicks stored |
| **2** | Create UI + dashboard | Create + stats + top links live |
| **3** | CSV + docs + QA | Export works; README + SDD trail complete |

---

## MCP server (tooling requirement)

During Phase 1–3 implementation (not shipped to end users):

- Use MCP to read Supabase/tool schemas, validate assumptions, and optionally drive **browser-based** checks for redirect and dashboard.
- Document which MCP servers were configured in README under “Development tooling.”

---

## Risks / decisions deferred to implementation

| Topic | Decision owner |
|-------|----------------|
| Cached `click_count` on `links` vs count-only from `clicks` | Implementer (prefer single source: `clicks` only for MVP simplicity) |
| Auth | **Supabase Auth** — document Email provider setup in README |
