-- Run this once in your Supabase project's SQL Editor.
-- Creates one simple key-value table that the app uses for everything
-- that needs to sync across your phone and laptop: your editable week
-- plan, logged workouts, and done/not-done toggles.

create table if not exists kv_store (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every write
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_kv_store_updated on kv_store;
create trigger trg_kv_store_updated
before update on kv_store
for each row execute function set_updated_at();

-- Row Level Security: since this app has no login system, we allow
-- the public "anon" key (which only you will have, in your deployed
-- site's code) to read and write. This is fine for a personal tool
-- but means anyone who somehow got your Supabase URL + anon key could
-- read/edit your training data. If that ever matters to you, add
-- Supabase Auth later and scope these policies to auth.uid().
alter table kv_store enable row level security;

drop policy if exists "allow all" on kv_store;
create policy "allow all" on kv_store
  for all
  using (true)
  with check (true);
