# MindVeda Next.js Site (Scaffold)

This repository is a scaffold for the MindVeda website UI built with Next.js and Tailwind CSS. It includes a mock e-commerce style packages section, cart, checkout (mock payment UI), and a Supabase SQL schema for backend data.

What is included
- Next.js pages: Home, Packages, Package detail, Cart, Checkout
- Components: Header, Footer, PackageCard
- API routes (mock): `/api/packages`, `/api/auth`
- Supabase schema: `db/supabase.sql`
- Tailwind CSS configuration and global styles

Quick setup

1. Install dependencies
```
cd /home/athervi/projects/company/mindveda
npm install
```

2. Run dev server
```
npm run dev
```

Notes
- The Razorpay payment flow is intentionally mocked in `pages/checkout.js`. Integrate Razorpay server-side & client-side later.
- Replace mock API routes with Supabase SDK calls (using `@supabase/supabase-js`) and configure environment variables for Supabase.
- DB schema provided in `db/supabase.sql` to import into your Supabase project.

Next steps (suggested)
- Wire up Supabase client and replace mock endpoints
- Implement authentication with Supabase Auth and profile sync
- Add animations and improved hero images/assets
