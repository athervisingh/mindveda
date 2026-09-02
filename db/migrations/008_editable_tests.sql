-- Mind Veda — test questions ab admin panel se edit ho sakein.
-- Run this once in the Supabase SQL editor. Needs public.is_admin(uuid) from 001_shop.sql.
--
-- Tables khali chhodi ja sakti hain: jab tak inme kuch nahi hai, site code wali
-- default list use karti hai. Admin panel ka "Import defaults" button inhe bhar deta hai.

-- ── Free Mind Check ke sawal ──
create table public.mind_check_questions (
  id         uuid primary key default gen_random_uuid(),
  age_group  text not null check (age_group in ('under-20', 'above-20')),
  position   integer not null,
  emoji      text,
  text_en    text not null,
  text_hi    text,
  note_en    text,
  note_hi    text,
  scored     boolean not null default true,
  options    jsonb not null,          -- [{ emoji, score, en, hi }]
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mind_check_questions_group_idx on public.mind_check_questions (age_group, position);

-- ── Result bands (score range -> naam aur message) ──
create table public.mind_check_bands (
  id         uuid primary key default gen_random_uuid(),
  age_group  text not null check (age_group in ('under-20', 'above-20')),
  min_score  integer not null,
  max_score  integer not null,
  emoji      text,
  title_en   text not null,
  title_hi   text,
  body_en    text,
  body_hi    text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create index mind_check_bands_group_idx on public.mind_check_bands (age_group, min_score);

-- ── 16 PF ke sawal ──
create table public.pf16_questions (
  id         uuid primary key default gen_random_uuid(),
  position   integer not null,
  text       text not null,
  option_a   text not null,
  option_b   text not null,
  option_c   text not null,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pf16_questions_position_idx on public.pf16_questions (position);

-- Purani answer sheets tab bhi sahi padhi ja sakein jab sawal badal diye jayen.
alter table public.pf16_attempts
  add column if not exists questions_snapshot jsonb;

-- ── RLS: sab padh sakte hain (sirf active), likh sirf admin sakta hai ──
alter table public.mind_check_questions enable row level security;
alter table public.mind_check_bands     enable row level security;
alter table public.pf16_questions       enable row level security;

create policy "mind_check_questions_public_read" on public.mind_check_questions
  for select using (is_active = true or public.is_admin(auth.uid()));
create policy "mind_check_questions_admin_write" on public.mind_check_questions
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "mind_check_bands_public_read" on public.mind_check_bands
  for select using (is_active = true or public.is_admin(auth.uid()));
create policy "mind_check_bands_admin_write" on public.mind_check_bands
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "pf16_questions_public_read" on public.pf16_questions
  for select using (is_active = true or public.is_admin(auth.uid()));
create policy "pf16_questions_admin_write" on public.pf16_questions
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
