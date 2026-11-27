-- Teachers Kingdom — Cloud Synchronization Schema (Supabase / PostgreSQL)
-- Run this SQL once in your Supabase Project → SQL Editor.

create table if not exists public.user_cloud_states (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  display_name text not null default '',
  role_preview text not null default 'student' check (role_preview in ('student', 'teacher')),
  prefs jsonb not null default '{}'::jsonb,
  progress_a1 jsonb not null default '{}'::jsonb,
  progress_a2 jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.user_cloud_states enable row level security;

drop policy if exists "Users can read own cloud state" on public.user_cloud_states;
create policy "Users can read own cloud state"
  on public.user_cloud_states
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own cloud state" on public.user_cloud_states;
create policy "Users can insert own cloud state"
  on public.user_cloud_states
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own cloud state" on public.user_cloud_states;
create policy "Users can update own cloud state"
  on public.user_cloud_states
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own cloud state" on public.user_cloud_states;
create policy "Users can delete own cloud state"
  on public.user_cloud_states
  for delete
  using (auth.uid() = user_id);

create index if not exists idx_user_cloud_states_updated_at
  on public.user_cloud_states (updated_at desc);
