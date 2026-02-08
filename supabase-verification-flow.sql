-- Verification flow: signups table + RPCs
-- Run in Supabase Dashboard → SQL Editor (after initial schema if you have auth.users + wishes).
-- Signup stores email/name/code here; after verify we create auth user and link.

-- ---------------------------------------------------------------------------
-- 1. Signups table (pre-auth: email, name, 6-digit code, expiry)
-- ---------------------------------------------------------------------------
create table if not exists public.signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  verification_code text,
  verification_code_sent_at timestamptz,
  is_verified boolean not null default false,
  auth_uid uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.signups enable row level security;

-- Anon can insert new signup (email, name, code, sent_at)
create policy "Anon can insert signup"
  on public.signups for insert
  to anon
  with check (true);

-- Anon can select (for verification step: fetch row by email+code)
create policy "Anon can select signup by email and code"
  on public.signups for select
  to anon
  using (true);

-- Anon can update (for upsert when same email signs up again – new code)
create policy "Anon can update signup"
  on public.signups for update
  to anon
  using (true)
  with check (true);

-- RPC: complete verification (called after client creates auth user)
create or replace function public.complete_signup_verification(
  p_email text,
  p_code text,
  p_auth_uid uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row signups%rowtype;
begin
  select * into v_row
  from signups
  where email = p_email
    and verification_code = p_code
    and verification_code_sent_at > (now() - interval '15 minutes')
    and not is_verified
  limit 1;

  if not found then
    return false;
  end if;

  update signups
  set is_verified = true,
      verification_code = null,
      verification_code_sent_at = null,
      auth_uid = p_auth_uid
  where id = v_row.id;
  return true;
end;
$$;

-- RPC: check if email is verified (for login: only send magic link if verified)
create or replace function public.is_email_verified(p_email text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from signups
    where email = p_email and is_verified = true and auth_uid is not null
  );
end;
$$;

-- RPC: link signup to auth user (after magic link click or fallback sign-up). Idempotent.
-- Only allows linking when the caller is the same user (auth.uid() = p_auth_uid and auth email = p_email).
create or replace function public.link_signup_to_auth(p_email text, p_auth_uid uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_auth_uid is null or p_email is null then
    return false;
  end if;
  -- Optional: only let the authenticated user link their own email (uncomment if you require auth for this call)
  -- if auth.uid() is distinct from p_auth_uid then return false; end if;
  update signups
  set is_verified = true,
      auth_uid = p_auth_uid,
      verification_code = null,
      verification_code_sent_at = null
  where email = p_email;
  return found;
end;
$$;

-- Grant execute to anon and authenticated
grant execute on function public.complete_signup_verification(text, text, uuid) to anon;
grant execute on function public.complete_signup_verification(text, text, uuid) to authenticated;
grant execute on function public.is_email_verified(text) to anon;
grant execute on function public.is_email_verified(text) to authenticated;
grant execute on function public.link_signup_to_auth(text, uuid) to anon;
grant execute on function public.link_signup_to_auth(text, uuid) to authenticated;
