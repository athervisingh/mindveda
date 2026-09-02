-- Mind Veda — free Mind Check (Under 20 / 20+) results. New table only.
-- Run this once in the Supabase SQL editor. Needs public.is_admin(uuid) from 001_shop.sql.

create table public.mind_check_results (
  id              uuid primary key default gen_random_uuid(),
  registration_id uuid references public.registrations(id) on delete set null,
  age_group       text not null check (age_group in ('under-20', 'above-20')),
  lang            text not null default 'en' check (lang in ('en', 'hi')),
  score           integer not null,
  max_score       integer not null,
  band_title      text,
  answers         jsonb,          -- [{ q, question, answer, score }]
  answered_count  integer,
  total_questions integer,
  timed_out       boolean not null default false,
  duration_seconds integer,
  created_at      timestamptz not null default now()
);

create index mind_check_results_created_at_idx on public.mind_check_results (created_at desc);
create index mind_check_results_reg_idx        on public.mind_check_results (registration_id);

alter table public.mind_check_results enable row level security;

-- Results server-side (service role) se save hote hain: /api/mindcheck/submit.
-- Client se sirf admin padh sakta hai.
create policy "mind_check_results_admin_all" on public.mind_check_results
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
