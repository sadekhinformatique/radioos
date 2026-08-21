# RadioOS - Supabase Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Choose your organization (or create one)
4. Fill in:
   - **Project name:** `radioos`
   - **Database password:** (choose a strong password)
   - **Region:** `Africa (Johannesburg)` or `Europe (West)`
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup to complete

### Step 2: Get Your Credentials

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)
   - **service_role key** (long string starting with `eyJ...`)

### Step 3: Configure Environment

Create `.env.local` in your project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxxxxx

# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxx.supabase.co:5432/postgres

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=RadioOS
NEXT_PUBLIC_DEFAULT_BITRATE=128
```

**⚠️ Never commit `.env.local` to git!**

### Step 4: Run Database Migrations

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and click **"Run"**
4. Copy the contents of `supabase/rls_policies.sql`
5. Paste and click **"Run"**
6. (Optional) Copy contents of `supabase/seed.sql` for demo data
7. Paste and click **"Run"**

### Step 5: Enable Auth Providers (Optional)

1. Go to **Authentication** → **Providers**
2. Enable **Google** if you want Google OAuth:
   - Create a Google Cloud project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/auth/callback` as authorized redirect URI
   - Copy Client ID and Client Secret to Supabase

### Step 6: Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` and register a new account!

---

## Manual Setup

### Database Schema

If you prefer to set up manually, run the SQL files in order:

1. `supabase/migrations/001_initial_schema.sql` - Creates all tables
2. `supabase/rls_policies.sql` - Sets up Row Level Security
3. `supabase/seed.sql` - (Optional) Demo data

### Auth Setup

1. **Email/Password** is enabled by default
2. **Email confirmations**: Go to Auth → Settings → Enable "Confirm email"
3. **Password reset**: Already configured in the app

### Storage Buckets

Create these storage buckets in Supabase Dashboard → Storage:

1. `avatars` - User profile pictures
2. `logos` - Radio station logos
3. `podcasts` - Podcast audio files
4. `media` - Images and other media

Set bucket policies:
- `avatars`: Public read, authenticated write
- `logos`: Public read, authenticated write
- `podcasts`: Public read, authenticated write
- `media`: Public read, authenticated write

---

## Troubleshooting

### "Invalid API key"
- Check that `.env.local` has the correct values
- Make sure you're using the **anon** key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Make sure you're using the **service_role** key for `SUPABASE_SERVICE_ROLE_KEY`

### "Permission denied"
- Run the RLS policies SQL
- Check that the user is authenticated
- Verify the user has the correct role

### "Relation does not exist"
- Run the database migration SQL
- Check that you're connected to the correct database

### Auth redirect not working
- Add `http://localhost:3000/**` to Redirect URLs in Auth → Settings
- For production, add your domain

---

## Production Deployment

For production (Vercel, Netlify, etc.):

1. Set environment variables in your hosting platform
2. Update `NEXT_PUBLIC_APP_URL` to your production domain
3. Update Supabase Redirect URLs to include your production domain
4. Enable Email confirmations
5. Set up proper CORS in Supabase

---

## API Reference

### Auth Endpoints (handled by Supabase)

- `POST /auth/v1/signup` - Register new user
- `POST /auth/v1/token?grant_type=password` - Login
- `POST /auth/v1/logout` - Logout
- `GET /auth/v1/user` - Get current user
- `POST /auth/v1/recover` - Password reset

### Database Tables

After running migrations, you'll have these tables:
- `users` - User profiles
- `radios` - Radio stations
- `radio_members` - User-radio relationships
- `streams` - Stream configurations
- `shows` - Radio shows
- `podcasts` - Podcast episodes
- `messages` - Listener messages
- `dedications` - Song dedications
- `polls` - Polls and surveys
- `analytics` - Listening analytics
- `campaigns` - Ad campaigns
- And more...

---

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [RadioOS Issues](https://github.com/your-repo/radioos/issues)
