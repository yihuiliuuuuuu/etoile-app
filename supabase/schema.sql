-- Run in Supabase SQL Editor (Dashboard → SQL → New query)
--
-- Auth: Dashboard → Authentication → Providers → Email → disable "Confirm email"
-- so sign-up completes immediately (email + password + confirm password only).

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  avatar_url text,
  sign_up_prompt_shown boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Practice log
create table if not exists public.practice_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date_iso timestamptz not null,
  duration_minutes integer not null check (duration_minutes > 0),
  techniques text[] not null default '{}',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists practice_entries_user_id_idx on public.practice_entries (user_id);
create index if not exists practice_entries_date_idx on public.practice_entries (user_id, date_iso desc);

-- Class log
create table if not exists public.class_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date_time_iso timestamptz not null,
  school text not null,
  techniques text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists class_entries_user_id_idx on public.class_entries (user_id);
create index if not exists class_entries_date_idx on public.class_entries (user_id, date_time_iso desc);

-- Goals (one row per user)
create table if not exists public.user_goals (
  user_id uuid primary key references auth.users (id) on delete cascade,
  practice_cycle text not null check (practice_cycle in ('weekly', 'monthly', 'yearly')),
  practice_target_hours numeric not null check (practice_target_hours > 0),
  class_cycle text not null check (class_cycle in ('weekly', 'monthly', 'yearly')),
  class_target_classes integer not null check (class_target_classes > 0),
  updated_at timestamptz not null default now()
);

-- Saved studio names
create table if not exists public.user_schools (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create index if not exists user_schools_user_id_idx on public.user_schools (user_id);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.practice_entries enable row level security;
alter table public.class_entries enable row level security;
alter table public.user_goals enable row level security;
alter table public.user_schools enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "practice_select_own" on public.practice_entries for select using (auth.uid() = user_id);
create policy "practice_insert_own" on public.practice_entries for insert with check (auth.uid() = user_id);
create policy "practice_update_own" on public.practice_entries for update using (auth.uid() = user_id);
create policy "practice_delete_own" on public.practice_entries for delete using (auth.uid() = user_id);

create policy "class_select_own" on public.class_entries for select using (auth.uid() = user_id);
create policy "class_insert_own" on public.class_entries for insert with check (auth.uid() = user_id);
create policy "class_update_own" on public.class_entries for update using (auth.uid() = user_id);
create policy "class_delete_own" on public.class_entries for delete using (auth.uid() = user_id);

create policy "goals_select_own" on public.user_goals for select using (auth.uid() = user_id);
create policy "goals_insert_own" on public.user_goals for insert with check (auth.uid() = user_id);
create policy "goals_update_own" on public.user_goals for update using (auth.uid() = user_id);

create policy "schools_select_own" on public.user_schools for select using (auth.uid() = user_id);
create policy "schools_insert_own" on public.user_schools for insert with check (auth.uid() = user_id);
create policy "schools_delete_own" on public.user_schools for delete using (auth.uid() = user_id);

-- Avatar storage (run after creating bucket "avatars" as public in Dashboard → Storage)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
