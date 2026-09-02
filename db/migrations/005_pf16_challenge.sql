-- Mind Veda — 16 PF "Mind Challenge" (paid ₹300). New table only.
-- Run this once in the Supabase SQL editor (this repo does not auto-apply migrations).
-- Needs public.is_admin(uuid) from 001_shop.sql.

create table public.pf16_attempts (
  id                  uuid primary key default gen_random_uuid(),
  full_name           text not null,
  email               text not null,
  mobile              text,
  amount              integer not null,                  -- paise
  status              text not null default 'created'
                      check (status in ('created', 'paid', 'submitted')),
  razorpay_order_id   text,
  razorpay_payment_id text,
  access_token        text not null,                     -- paid test kholne ke liye
  answers             jsonb,                             -- [0|1|2|null] x 187
  answered_count      integer,
  duration_seconds    integer,
  paid_at             timestamptz,
  submitted_at        timestamptz,
  created_at          timestamptz not null default now()
);

create index pf16_attempts_created_at_idx on public.pf16_attempts (created_at desc);
create index pf16_attempts_order_idx      on public.pf16_attempts (razorpay_order_id);
create index pf16_attempts_email_idx      on public.pf16_attempts (email);

alter table public.pf16_attempts enable row level security;

-- Sab kuch server-side (service role) se hota hai: /api/challenge/*.
-- Client se sirf admin padh/likh sakta hai.
create policy "pf16_attempts_admin_all" on public.pf16_attempts
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
