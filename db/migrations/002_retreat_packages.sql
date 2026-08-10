-- Mind Veda Retreat Packages — new table only. Does not modify any existing table.
-- Run this once in the Supabase SQL editor (this repo does not auto-apply migrations).

create or replace function public.is_admin(uid uuid)
returns boolean language sql security definer stable as $$
  select exists(select 1 from public.users where id = uid and role = 'admin');
$$;

create table public.retreat_packages (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  label          text not null,
  subtitle       text,
  icon_key       text not null default 'bed' check (icon_key in ('quad', 'bed', 'person', 'group')),
  original_price integer not null check (original_price >= 0),  -- rupees
  price          integer not null check (price >= 0),           -- rupees
  features       text[] not null default '{}',
  sold_out       boolean not null default false,
  is_active      boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.retreat_packages enable row level security;

create policy "retreat_packages_public_read_active" on public.retreat_packages
  for select using (is_active = true or public.is_admin(auth.uid()));
create policy "retreat_packages_admin_write" on public.retreat_packages
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Seed with the existing hardcoded packages so the site keeps working as-is.
insert into public.retreat_packages
  (slug, label, subtitle, icon_key, original_price, price, features, sold_out, is_active, sort_order)
values
  ('quad-sharing', '4 SHARING ROOM', '1 Room (4 Beds)', 'quad', 12500, 10000,
    array['4 Sharing Room', 'Sattvic Meals', 'All Retreat Sessions', 'Temple Visits', 'Nature Activities', 'Ganga Aarti'],
    true, true, 1),
  ('twin-sharing', 'TWIN SHARING ROOM', '1 Room (2 Beds)', 'bed', 18750, 15000,
    array['Twin Sharing Room', 'Sattvic Meals', 'All Retreat Sessions', 'Temple Visits', 'Nature Activities', 'Ganga Aarti'],
    false, true, 2),
  ('single-stay', 'SINGLE STAY', 'Private Room', 'person', 22500, 18000,
    array['Private Room', 'Sattvic Meals', 'All Retreat Sessions', 'Temple Visits', 'Nature Activities', 'Ganga Aarti'],
    false, true, 3);
