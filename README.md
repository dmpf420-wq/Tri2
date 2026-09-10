# Tri Log — hosted setup

This turns your dashboard into a real website that works the same on
your phone and laptop, pulling directly from intervals.icu.

## What you're setting up
- **Supabase** — free database. Holds your week plan, logged sessions, and done-toggles so they're identical on every device.
- **Vercel** — free hosting. Serves the site and runs one small backend function that talks to intervals.icu.
- **intervals.icu API key** — lets the site pull your synced Garmin data automatically.

## Steps

### 1. Create a Supabase project
1. Go to supabase.com → sign up (free) → "New project".
2. Once it's created, go to the **SQL Editor** and paste in the contents of `supabase-schema.sql` from this folder. Click Run.
3. Go to **Project Settings → API**. Copy the **Project URL** and the **anon public key** — you'll need both in step 4.

### 2. Get your intervals.icu API key
1. Log into intervals.icu → **Settings → Developer Settings**.
2. Generate an API key. Copy it.
3. Also note your athlete ID — it's in your intervals.icu URL, looks like `i123456`.

### 3. Put this project on GitHub
1. Create a new (private is fine) GitHub repo.
2. Upload everything in this folder to it (drag-and-drop works on github.com, or `git push` if you're comfortable with git).

### 4. Deploy to Vercel
1. Go to vercel.com → sign up with your GitHub account → "Add New Project" → import the repo you just made.
2. Before deploying, add these **Environment Variables** in the Vercel project settings:
   - `INTERVALS_API_KEY` = your intervals.icu API key
   - `INTERVALS_ATHLETE_ID` = your athlete ID (e.g. `i123456`)
3. Click Deploy. You'll get a URL like `tri-log-yourname.vercel.app`.

### 5. Connect the site to Supabase
1. Open `public/index.html` in the repo (edit directly on github.com is fine).
2. Find these two lines near the top of the `<script>` section:
   ```js
   const SUPABASE_URL = "YOUR_SUPABASE_URL";
   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
   ```
3. Replace with the values from step 1.3. Save/commit — Vercel will auto-redeploy.

### 6. Install it on your phone
1. Open your Vercel URL in Safari (iPhone) or Chrome (Android).
2. Safari: Share → "Add to Home Screen". Chrome: menu → "Install app".
3. It'll now open full-screen like a normal app, no browser bar.

## Using it day to day
- Open the site on your phone or laptop — same data either way.
- Hit **"⟲ Sync intervals.icu"** in the sidebar to pull your latest Garmin-synced workouts and wellness numbers.
- Editing the week, logging sessions, and toggling done all save to Supabase instantly, so they show up on your other device next time you open it there.

## Notes / limitations
- The `kv_store` table has no login system — anyone with your exact Supabase URL + anon key could read/write it. Fine for a personal tool, but don't publish those values anywhere public.
- Sync is manual (button) or on page load — not real-time push. Good enough for daily check-ins; if you ever want it fully automatic, that's a small follow-up (a scheduled Vercel Cron job).
- If something breaks, the site falls back to locally cached data so you're never staring at a blank page.
