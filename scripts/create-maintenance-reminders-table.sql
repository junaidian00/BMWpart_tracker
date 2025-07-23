-- 📅 CREATE maintenance_reminders TABLE ────────────────────────────────────
--  Run this once in Supabase SQL Editor or the CLI  ------------------------

create extension if not exists "pgcrypto";

------------------------------------------------------------
-- 1.  Table definition
------------------------------------------------------------
create table if not exists public.maintenance_reminders (
  id           uuid primary key default gen_random_uuid(),
  vehicle_id   uuid references public.vehicles(id) on delete cascade not null,
  user_id      uuid references auth.users(id)        on delete cascade not null,
  type         text not null check (type in (
                'oil_change','brake_service','tire_rotation','air_filter',
                'spark_plugs','coolant_flush','transmission_service',
                'suspension','modification','repair','inspection','other')),
  title        text not null,
  description  text,
  due_mileage  int,
  due_date     date,
  is_completed boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

------------------------------------------------------------
-- 2.  updated_at trigger
------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists maintenance_reminders_updated_at on public.maintenance_reminders;
create trigger maintenance_reminders_updated_at
before update on public.maintenance_reminders
for each row execute function public.handle_updated_at();

------------------------------------------------------------
-- 3.  Row-level security (permissive for development)
------------------------------------------------------------
alter table public.maintenance_reminders enable row level security;

drop policy if exists "maintenance_reminders_full_access"
  on public.maintenance_reminders;

create policy "maintenance_reminders_full_access"
  on public.maintenance_reminders
  for all
  using  (true)
  with check (true);

------------------------------------------------------------
-- 4.  Helpful indexes
------------------------------------------------------------
create index if not exists maintenance_reminders_vehicle_idx
  on public.maintenance_reminders(vehicle_id);

create index if not exists maintenance_reminders_user_idx
  on public.maintenance_reminders(user_id);

------------------------------------------------------------
-- 5.  Grant privileges (dev only)
------------------------------------------------------------
grant all on public.maintenance_reminders to anon, authenticated;

------------------------------------------------------------
-- 6.  Comment to force Supabase schema cache refresh
------------------------------------------------------------
comment on table public.maintenance_reminders
  is 'Upcoming maintenance reminders for user vehicles';
