-- Run once if you already applied an older schema.sql (profiles had no INSERT policy).
-- Supabase Dashboard → SQL → New query → paste → Run

drop policy if exists "profiles_insert_own" on public.profiles;

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Backfill profiles for users created before the app wrote profiles rows
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do update
  set email = excluded.email,
      updated_at = now();
