-- Complete maintenance database setup with all required fields
-- This script creates all tables needed for the BMW maintenance tracking system

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create updated_at function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create vehicles table with all required fields
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  make TEXT NOT NULL DEFAULT 'BMW',
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  chassis_code TEXT,
  engine TEXT NOT NULL,
  transmission TEXT,
  body_type TEXT,
  mileage INTEGER NOT NULL DEFAULT 0,
  vin TEXT,
  nickname TEXT,
  color TEXT,
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance_records table with all required fields
CREATE TABLE IF NOT EXISTS maintenance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  date_performed DATE NOT NULL,
  mileage INTEGER NOT NULL DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  shop_name TEXT,
  shop_address TEXT,
  parts_used TEXT[],
  labor_hours DECIMAL(4,2),
  warranty_months INTEGER,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance_reminders table
CREATE TABLE IF NOT EXISTS maintenance_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  due_mileage INTEGER,
  interval_months INTEGER,
  interval_miles INTEGER,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_date DATE,
  completed_mileage INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reminders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can insert their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can update their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can delete their own vehicles" ON vehicles;

DROP POLICY IF EXISTS "Users can view their own maintenance records" ON maintenance_records;
DROP POLICY IF EXISTS "Users can insert their own maintenance records" ON maintenance_records;
DROP POLICY IF EXISTS "Users can update their own maintenance records" ON maintenance_records;
DROP POLICY IF EXISTS "Users can delete their own maintenance records" ON maintenance_records;

DROP POLICY IF EXISTS "Users can view their own maintenance reminders" ON maintenance_reminders;
DROP POLICY IF EXISTS "Users can insert their own maintenance reminders" ON maintenance_reminders;
DROP POLICY IF EXISTS "Users can update their own maintenance reminders" ON maintenance_reminders;
DROP POLICY IF EXISTS "Users can delete their own maintenance reminders" ON maintenance_reminders;

-- Create policies for vehicles
CREATE POLICY "Users can view their own vehicles" ON vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vehicles" ON vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicles" ON vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vehicles" ON vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for maintenance_records
CREATE POLICY "Users can view their own maintenance records" ON maintenance_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own maintenance records" ON maintenance_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maintenance records" ON maintenance_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maintenance records" ON maintenance_records
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for maintenance_reminders
CREATE POLICY "Users can view their own maintenance reminders" ON maintenance_reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own maintenance reminders" ON maintenance_reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maintenance reminders" ON maintenance_reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maintenance reminders" ON maintenance_reminders
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at triggers
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

DROP TRIGGER IF EXISTS maintenance_reminders_updated_at ON maintenance_reminders;
CREATE TRIGGER maintenance_reminders_updated_at
  BEFORE UPDATE ON maintenance_reminders
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS vehicles_user_id_idx ON vehicles (user_id);
CREATE INDEX IF NOT EXISTS vehicles_year_make_model_idx ON vehicles (year, make, model);
CREATE INDEX IF NOT EXISTS maintenance_records_vehicle_id_idx ON maintenance_records (vehicle_id);
CREATE INDEX IF NOT EXISTS maintenance_records_user_id_idx ON maintenance_records (user_id);
CREATE INDEX IF NOT EXISTS maintenance_records_date_performed_idx ON maintenance_records (date_performed);
CREATE INDEX IF NOT EXISTS maintenance_reminders_vehicle_id_idx ON maintenance_reminders (vehicle_id);
CREATE INDEX IF NOT EXISTS maintenance_reminders_user_id_idx ON maintenance_reminders (user_id);
CREATE INDEX IF NOT EXISTS maintenance_reminders_due_date_idx ON maintenance_reminders (due_date);

-- Create storage bucket for maintenance receipts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('maintenance-receipts', 'maintenance-receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own receipts" ON storage.objects;

-- Create storage policies for maintenance receipts
CREATE POLICY "Users can upload their own receipts" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'maintenance-receipts' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own receipts" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'maintenance-receipts' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own receipts" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'maintenance-receipts' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Grant necessary permissions
GRANT ALL ON vehicles TO anon, authenticated;
GRANT ALL ON maintenance_records TO anon, authenticated;
GRANT ALL ON maintenance_reminders TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Add helpful comments
COMMENT ON TABLE vehicles IS 'BMW vehicles owned by users for maintenance tracking';
COMMENT ON TABLE maintenance_records IS 'Service history records for vehicles';
COMMENT ON TABLE maintenance_reminders IS 'Upcoming maintenance reminders for vehicles';
COMMENT ON COLUMN vehicles.chassis_code IS 'BMW chassis code (e.g., F30, G20, etc.)';
COMMENT ON COLUMN maintenance_records.service_type IS 'Type of service performed (Oil Change, Brake Service, etc.)';
COMMENT ON COLUMN maintenance_records.parts_used IS 'Array of part names used in the service';
COMMENT ON COLUMN maintenance_records.receipt_url IS 'URL to uploaded receipt image in storage';
