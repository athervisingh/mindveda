-- Mind Veda — Services aur Yoga/Retreat packages admin panel se editable.
-- Run this once in the Supabase SQL editor. Needs public.is_admin(uuid) from 001_shop.sql.

-- ── services: display fields (price/duration pehle se hain) ──
alter table public.services
  add column if not exists title             text,      -- site par dikhne wala naam
  add column if not exists icon              text,
  add column if not exists category          text,
  add column if not exists badge             text,
  add column if not exists color             text,
  add column if not exists duration_label    text,      -- "50 min", "2 hr"
  add column if not exists short_description text,
  add column if not exists benefits          jsonb,
  add column if not exists what_to_expect    jsonb,
  add column if not exists sort_order        integer,
  add column if not exists show_on_site      boolean not null default true;

-- ── Yoga / Retreat package cards ──
create table if not exists public.service_packages (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  excerpt        text,
  price          integer not null,          -- paise
  duration_label text,
  sessions       integer,
  sessions_label text,
  mode           text,
  featured       boolean not null default false,
  sort_order     integer,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists service_packages_sort_idx on public.service_packages (sort_order, slug);

-- ── RLS ──
-- services par RLS abhi band thi: public anon key se koi bhi price badal sakta tha.
-- Ab sirf padhna sabke liye khula hai, likhna sirf admin ke liye.
alter table public.services         enable row level security;
alter table public.service_packages enable row level security;

drop policy if exists "services_public_read"  on public.services;
create policy "services_public_read" on public.services
  for select using (is_active = true or public.is_admin(auth.uid()));

drop policy if exists "services_admin_write" on public.services;
create policy "services_admin_write" on public.services
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

drop policy if exists "service_packages_public_read" on public.service_packages;
create policy "service_packages_public_read" on public.service_packages
  for select using (is_active = true or public.is_admin(auth.uid()));

drop policy if exists "service_packages_admin_write" on public.service_packages;
create policy "service_packages_admin_write" on public.service_packages
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
