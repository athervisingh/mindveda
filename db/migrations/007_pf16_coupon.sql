-- Mind Veda — Mind Challenge (16 PF) par coupon code support.
-- Existing public.coupons table hi use hoti hai (wahi jo counseling checkout par hai).
-- Run this once in the Supabase SQL editor.

alter table public.pf16_attempts
  add column if not exists coupon_code     text,
  add column if not exists original_amount integer;
