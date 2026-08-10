-- Mind Veda News Marquee — new table only. Does not modify any existing table.
-- Run this once in the Supabase SQL editor (this repo does not auto-apply migrations).

create table public.news_items (
  id          uuid primary key default gen_random_uuid(),
  headline    text not null,
  link        text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.news_items enable row level security;

create policy "news_items_public_read_active" on public.news_items
  for select using (is_active = true or public.is_admin(auth.uid()));
create policy "news_items_admin_write" on public.news_items
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Seed with a starter headline so the marquee isn't empty on first load.
insert into public.news_items (headline, link, is_active, sort_order)
values ('Welcome to Mind Veda — new batches opening soon', null, true, 1);
