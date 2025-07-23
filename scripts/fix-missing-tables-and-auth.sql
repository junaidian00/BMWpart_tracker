-- First, let's make sure all tables exist and fix auth issues

-- Create vehicles table if it doesn't exist
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  make TEXT NOT NULL DEFAULT 'BMW',
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  engine TEXT NOT NULL,
  vin TEXT,
  nickname TEXT,
  mileage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance_records table if it doesn't exist
CREATE TABLE IF NOT EXISTS maintenance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('oil_change', 'brake_service', 'tire_rotation', 'air_filter', 'spark_plugs', 'coolant_flush', 'transmission_service', 'suspension', 'modification', 'repair', 'inspection', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  mileage INTEGER NOT NULL,
  date_performed DATE NOT NULL,
  next_due_mileage INTEGER,
  next_due_date DATE,
  receipt_url TEXT,
  parts_used TEXT[],
  shop_name TEXT,
  performance_impact TEXT,
  reliability_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance_reminders table if it doesn't exist
CREATE TABLE IF NOT EXISTS maintenance_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('oil_change', 'brake_service', 'tire_rotation', 'air_filter', 'spark_plugs', 'coolant_flush', 'transmission_service', 'suspension', 'modification', 'repair', 'inspection', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  due_mileage INTEGER,
  due_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reminders ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies first
DROP POLICY IF EXISTS "profiles_all_access" ON profiles;
DROP POLICY IF EXISTS "vehicles_all_access" ON vehicles;
DROP POLICY IF EXISTS "maintenance_records_all_access" ON maintenance_records;
DROP POLICY IF EXISTS "maintenance_reminders_all_access" ON maintenance_reminders;

-- Create very permissive policies for development
CREATE POLICY "profiles_full_access" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "vehicles_full_access" ON vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "maintenance_records_full_access" ON maintenance_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "maintenance_reminders_full_access" ON maintenance_reminders FOR ALL USING (true) WITH CHECK (true);

-- Create or replace the updated_at function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS vehicles_updated_at ON vehicles;
CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS maintenance_records_updated_at ON maintenance_records;
CREATE TRIGGER maintenance_records_updated_at
  BEFORE UPDATE ON maintenance_records
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Fix profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, location, seller_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'location', 'Not specified'),
    COALESCE(NEW.raw_user_meta_data->>'seller_type', 'individual')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    location = COALESCE(EXCLUDED.location, profiles.location),
    seller_type = COALESCE(EXCLUDED.seller_type, profiles.seller_type),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Profile creation error for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant all necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Update all existing users to be confirmed
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW());

-- Create storage bucket for maintenance receipts if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('maintenance-receipts', 'maintenance-receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for maintenance receipts
DROP POLICY IF EXISTS "maintenance_receipts_all_access" ON storage.objects;
CREATE POLICY "maintenance_receipts_full_access" ON storage.objects 
FOR ALL USING (bucket_id = 'maintenance-receipts') 
WITH CHECK (bucket_id = 'maintenance-receipts');
