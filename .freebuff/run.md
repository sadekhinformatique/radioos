# RadioOS — Run Guide

## How to reproduce the artifacts

1. Copy `.env.local` from the main checkout (it contains the Supabase credentials)
2. Install dependencies: `npm install`
3. Run database migrations in Supabase SQL Editor (see `supabase/migrations/` folder)

## How to run the server

```bash
npm run dev
```

The server starts on port 3000 by default. Next.js will auto-pick another port if 3000 is busy.

## Current Preview

- **URL:** http://localhost:51389
- **Port:** 51389 (auto-picked)
- **PID:** 14084 (detached, survives conversation)
