-- URL Shortener with Analytics — initial schema (Supabase SQL Editor)
-- Run once per project. Requires Supabase Auth (auth.users).
--
-- If the SQL Editor warns about "destructive" operations: that refers to
-- DROP POLICY IF EXISTS below — only RLS policy objects are dropped/recreated,
-- not tables or data. Safe for first setup or idempotent re-runs.
--
-- After running: Authentication → URL Configuration → add Redirect URL:
--   http://localhost:3000/auth/callback
-- (and your production URL + /auth/callback when you deploy.)

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  destination_url text not null,
  created_at timestamptz not null default now(),
  constraint links_destination_url_http check (
    destination_url ~* '^https?://'
  ),
  constraint links_slug_format check (
    slug ~ '^[a-zA-Z0-9_-]+$' and length(slug) between 3 and 64
  ),
  constraint links_slug_unique unique (slug)
);

comment on table public.links is 'Short links owned by authenticated users.';

create index if not exists links_user_id_idx on public.links (user_id);
create index if not exists links_slug_idx on public.links (slug);

create table if not exists public.clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.links (id) on delete cascade,
  clicked_at timestamptz not null default now(),
  source text not null default 'direct',
  device text not null default 'unknown',
  constraint clicks_device_check check (
    device in ('desktop', 'mobile', 'tablet', 'unknown')
  )
);

comment on table public.clicks is 'One row per click; inserted only from server (service role), not directly by clients.';
comment on column public.clicks.source is 'Referrer host, utm_source, or "direct".';
comment on column public.clicks.device is 'Parsed from User-Agent: desktop | mobile | tablet | unknown.';

create index if not exists clicks_link_id_clicked_at_idx
  on public.clicks (link_id, clicked_at desc);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.links enable row level security;
alter table public.clicks enable row level security;

-- Links: CRUD only for owning user
drop policy if exists "links_select_own" on public.links;
create policy "links_select_own"
  on public.links for select
  using (auth.uid() = user_id);

drop policy if exists "links_insert_own" on public.links;
create policy "links_insert_own"
  on public.links for insert
  with check (auth.uid() = user_id);

drop policy if exists "links_update_own" on public.links;
create policy "links_update_own"
  on public.links for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "links_delete_own" on public.links;
create policy "links_delete_own"
  on public.links for delete
  using (auth.uid() = user_id);

-- Clicks: readable only if the link belongs to the user
drop policy if exists "clicks_select_via_link" on public.clicks;
create policy "clicks_select_via_link"
  on public.clicks for select
  using (
    exists (
      select 1
      from public.links l
      where l.id = clicks.link_id
        and l.user_id = auth.uid()
    )
  );

-- No INSERT/UPDATE/DELETE policies for anon/authenticated on clicks:
-- inserts use SUPABASE_SERVICE_ROLE_KEY in Next.js Route Handlers only.
