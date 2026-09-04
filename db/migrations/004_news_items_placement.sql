-- News marquee ko kisi bhi route par dikhane ke liye do naye columns.
-- Sirf columns add karta hai — existing rows ka behaviour same rehta hai (home page, hero ke baad).
-- Ise ek baar Supabase SQL editor me run karein.

alter table public.news_items
  add column if not exists route     text not null default '/',
  add column if not exists placement text not null default 'after_hero';

-- route: '*' = sab pages, '/retreat' = exact page, '/blog/*' = us section ke saare pages
-- placement: 'top' (header ke upar) ya 'after_hero' (hero image ke turant baad)
alter table public.news_items
  drop constraint if exists news_items_placement_check;
alter table public.news_items
  add constraint news_items_placement_check check (placement in ('top', 'after_hero'));

comment on column public.news_items.route is 'Kis route par dikhe: * (sab), /retreat (exact), /blog/* (prefix)';
comment on column public.news_items.placement is 'top = page ke bilkul upar, after_hero = hero image ke baad';
