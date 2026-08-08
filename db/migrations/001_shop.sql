-- Mind Veda Shop — new tables only. Does not modify any existing table.
-- Run this once in the Supabase SQL editor (this repo does not auto-apply migrations).
-- Also create a public storage bucket named "product-images" (see comments at bottom).

create or replace function public.is_admin(uid uuid)
returns boolean language sql security definer stable as $$
  select exists(select 1 from public.users where id = uid and role = 'admin');
$$;

create table public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text,
  price         integer not null check (price >= 0),   -- paise
  category      text not null default 'general',
  stock         integer not null default 0 check (stock >= 0),
  images        text[] not null default '{}',           -- exactly 3 public URLs
  weight_grams  integer not null default 250,
  length_cm     integer not null default 10,
  breadth_cm    integer not null default 10,
  height_cm     integer not null default 10,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.orders (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references public.users(id),
  status                 text not null default 'pending'
                         check (status in ('pending','paid','processing','shipped','delivered','cancelled','failed','refunded')),
  subtotal               integer not null,
  shipping_fee           integer not null default 0,
  total_amount           integer not null,
  razorpay_order_id      text,
  razorpay_payment_id    text,
  payment_status         text not null default 'created' check (payment_status in ('created','paid','failed')),
  shipping_name          text not null,
  shipping_phone         text not null,
  shipping_email         text not null,
  shipping_line1         text not null,
  shipping_line2         text,
  shipping_city          text not null,
  shipping_state         text not null,
  shipping_pincode       text not null,
  shipping_country       text not null default 'India',
  shiprocket_order_id    text,
  shiprocket_shipment_id text,
  awb_code               text,
  courier_name           text,
  tracking_url           text,
  shipment_status        text,
  admin_note             text,
  created_at             timestamptz not null default now(),
  paid_at                timestamptz,
  updated_at             timestamptz not null default now()
);

create table public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  product_id    uuid references public.products(id) on delete restrict,
  product_name  text not null,
  product_image text,
  unit_price    integer not null,
  quantity      integer not null check (quantity > 0),
  line_total    integer not null
);

alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

create policy "products_public_read_active" on public.products
  for select using (is_active = true or public.is_admin(auth.uid()));
create policy "products_admin_write" on public.products
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "orders_owner_or_admin_read" on public.orders
  for select using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
-- No insert policy: orders/order_items are only ever created server-side via
-- /api/shop/create-order.js using supabaseAdmin (service role bypasses RLS),
-- mirroring how bookings are only created via /api/payments/create-order.js.

create policy "order_items_owner_or_admin_read" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id
            and (o.user_id = auth.uid() or public.is_admin(auth.uid())))
  );

-- ─────────────────────────────────────────────────────────────
-- Storage bucket (do this in the Supabase dashboard, Storage tab):
-- 1. Create a new PUBLIC bucket named "product-images".
-- 2. Add these policies on storage.objects (SQL editor):
--
-- create policy "product_images_public_read" on storage.objects
--   for select using (bucket_id = 'product-images');
--
-- create policy "product_images_admin_write" on storage.objects
--   for insert with check (bucket_id = 'product-images' and public.is_admin(auth.uid()));
--
-- create policy "product_images_admin_update" on storage.objects
--   for update using (bucket_id = 'product-images' and public.is_admin(auth.uid()));
--
-- create policy "product_images_admin_delete" on storage.objects
--   for delete using (bucket_id = 'product-images' and public.is_admin(auth.uid()));
