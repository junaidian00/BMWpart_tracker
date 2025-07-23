-- 🔧 CREATE ALL MAINTENANCE TABLES WITH PROPER RELATIONSHIPS

create extension if not exists "pgcrypto";

-- 1. Create vehicles table (if not exists)
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

-- 2. Create maintenance_records table
create table if not exists public.maintenance_records (
  id                  uuid primary key default gen_random_uuid(),
  vehicle_id          uuid references public.vehicles(id) on delete cascade not null,
  user_id             uuid references auth.users(id) on delete cascade not null,
  type                text not null check (type in ('oil_change', 'brake_service', 'tire_rotation', 'air_filter', 'spark_plugs', 'coolant_flush', 'transmission_service', 'suspension', 'modification', 'repair', 'inspection', 'other')),
  title               text not null,
  description         text,
  cost                decimal(10,2) not null default 0,
  mileage             int not null,
  date_performed      date not null,
  next_due_mileage    int,
  next_due_date       date,
  receipt_url         text,
  parts_used          text[],
  shop_name           text,
  performance_impact  text,
  reliability_notes   text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 3. Create maintenance_reminders table
create table if not exists public.maintenance_reminders (
  id           uuid primary key default gen_random_uuid(),
  vehicle_id   uuid references public.vehicles(id) on delete cascade not null,
  user_id      uuid references auth.users(id) on delete cascade not null,
  type         text not null check (type in ('oil_change', 'brake_service', 'tire_rotation', 'air_filter', 'spark_plugs', 'coolant_flush', 'transmission_service', 'suspension', 'modification', 'repair', 'inspection', 'other')),
  title        text not null,
  description  text,
  due_mileage  int,
  due_date     date,
  is_completed boolean not null default false,
  created_at   timestamptz not null default now()
);

-- 4. Create updated_at function and triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply triggers
drop trigger if exists vehicles_updated_at on public.vehicles;
create trigger vehicles_updated_at
  before update on public.vehicles
  for each row execute function public.handle_updated_at();

drop trigger if exists maintenance_records_updated_at on public.maintenance_records;
create trigger maintenance_records_updated_at
  before update on public.maintenance_records
  for each row execute function public.handle_updated_at();

-- 5. Enable RLS and create permissive policies
alter table public.vehicles enable row level security;
alter table public.maintenance_records enable row level security;
alter table public.maintenance_reminders enable row level security;

-- Drop existing policies
drop policy if exists "vehicles_full_access" on public.vehicles;
drop policy if exists "maintenance_records_full_access" on public.maintenance_records;
drop policy if exists "maintenance_reminders_full_access" on public.maintenance_reminders;

-- Create new permissive policies
create policy "vehicles_full_access"
  on public.vehicles for all using (true) with check (true);

create policy "maintenance_records_full_access"
  on public.maintenance_records for all using (true) with check (true);

create policy "maintenance_reminders_full_access"
  on public.maintenance_reminders for all using (true) with check (true);

-- 6. Create indexes for performance
create index if not exists vehicles_user_idx on public.vehicles (user_id);
create index if not exists maintenance_records_vehicle_idx on public.maintenance_records (vehicle_id);
create index if not exists maintenance_records_user_idx on public.maintenance_records (user_id);
create index if not exists maintenance_reminders_vehicle_idx on public.maintenance_reminders (vehicle_id);
create index if not exists maintenance_reminders_user_idx on public.maintenance_reminders (user_id);

-- 7. Grant permissions
grant all on public.vehicles to anon, authenticated;
grant all on public.maintenance_records to anon, authenticated;
grant all on public.maintenance_reminders to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

-- 8. Force schema cache refresh by updating table comments
comment on table public.vehicles is 'BMW vehicles for maintenance tracking';
comment on table public.maintenance_records is 'Maintenance history records';
comment on table public.maintenance_reminders is 'Upcoming maintenance reminders';
