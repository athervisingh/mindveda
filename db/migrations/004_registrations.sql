-- Mind Veda Registrations — new table only. Does not modify any existing table.
-- Run this once in the Supabase SQL editor (this repo does not auto-apply migrations).

create table public.registrations (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  age           integer check (age is null or (age > 0 and age < 130)),
  address       text,
  mobile        text not null,
  gender        text,
  health_issues text,
  trauma        text,
  email         text not null,
  fear_1        text,
  fear_2        text,
  personality   text check (personality is null or personality in ('introvert', 'extrovert', 'ambivert')),
  good_thing    text,
  bad_thing     text,
  status        text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  admin_note    text,
  created_at    timestamptz not null default now()
);

create index registrations_created_at_idx on public.registrations (created_at desc);

alter table public.registrations enable row level security;

-- Public form submissions go through /api/registration/submit (service role key),
-- so no public insert policy is needed. Only admins can read/write from the client.
create policy "registrations_admin_all" on public.registrations
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
