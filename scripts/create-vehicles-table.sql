-- 🚗 CREATE vehicles TABLE  ────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- 1. Table definition
create table if not exists public.vehicles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  make         text    not null default 'BMW',
  model        text    not null,
  year         int     not null,
  engine       text    not null,
  vin          text,
  nickname     text,
  mileage      int     not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 2. Keep updated_at fresh
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists vehicles_updated_at on public.vehicles;
create trigger vehicles_updated_at
before update on public.vehicles
for each row execute function public.handle_updated_at();

-- 3. Row-level security (very permissive for development)
alter table public.vehicles enable row level security;

drop policy if exists "vehicles_full_access" on public.vehicles;
create policy "vehicles_full_access"
  on public.vehicles
  for all
  using  (true)
  with check (true);

-- 4. Basic index for look-ups
create index if not exists vehicles_user_idx on public.vehicles (user_id);

-- 5. Grant privileges to anon & authenticated (dev only)
grant all on public.vehicles to anon, authenticated;
