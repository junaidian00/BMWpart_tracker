-- Create vehicles table
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

-- Create maintenance_records table
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

-- Create maintenance_reminders table
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

-- Enable Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reminders ENABLE ROW LEVEL SECURITY;

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
CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER maintenance_records_updated_at
  BEFORE UPDATE ON maintenance_records
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create storage bucket for maintenance receipts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('maintenance-receipts', 'maintenance-receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for maintenance receipts
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
