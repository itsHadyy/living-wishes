-- Step 4 & 5: Tables + RLS for Living Wishes
-- Run this in Supabase Dashboard → SQL Editor → New query

-- ---------------------------------------------------------------------------
-- 1. Public users table (profile per auth.users row)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  created_at timestamptz not null default now()
);

-- RLS: users can read/update their own row
alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. Wishes table
-- ---------------------------------------------------------------------------
create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient text,
  type text check (type in ('message', 'voice', 'video')),
  content_url text,
  trigger_date date,
  status text not null default 'scheduled' check (status in ('scheduled', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

-- RLS: user can only select/update/delete their own wishes (and insert their own)
alter table public.wishes enable row level security;

create policy "Users can select own wishes"
  on public.wishes for select
  using (auth.uid() = user_id);

create policy "Users can insert own wishes"
  on public.wishes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own wishes"
  on public.wishes for update
  using (auth.uid() = user_id);

create policy "Users can delete own wishes"
  on public.wishes for delete
  using (auth.uid() = user_id);

-- Optional: index for listing by user
create index if not exists wishes_user_id_idx on public.wishes(user_id);
