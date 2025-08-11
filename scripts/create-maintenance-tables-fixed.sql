-- Create comprehensive BMW parts and maintenance database
-- This script sets up all tables needed for the integrated system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  seller_type TEXT CHECK (seller_type IN ('individual', 'dealer', 'dismantler', 'pick_pull')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1970 AND year <= 2030),
  make TEXT NOT NULL DEFAULT 'BMW',
  model TEXT NOT NULL,
  chassis_code TEXT,
  engine TEXT,
  transmission TEXT,
  body_type TEXT,
  mileage INTEGER CHECK (mileage >= 0),
  vin TEXT,
  nickname TEXT,
  color TEXT,
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance records table
CREATE TABLE IF NOT EXISTS maintenance_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  date_performed DATE NOT NULL,
  mileage INTEGER CHECK (mileage >= 0),
  cost DECIMAL(10,2) CHECK (cost >= 0),
  shop_name TEXT,
  shop_address TEXT,
  parts_used TEXT[],
  labor_hours DECIMAL(4,2) CHECK (labor_hours >= 0),
  warranty_months INTEGER CHECK (warranty_months >= 0),
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance reminders table
CREATE TABLE IF NOT EXISTS maintenance_reminders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  due_mileage INTEGER CHECK (due_mileage >= 0),
  interval_months INTEGER CHECK (interval_months > 0),
  interval_miles INTEGER CHECK (interval_miles > 0),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_date DATE,
  completed_mileage INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BMW Chassis table
CREATE TABLE IF NOT EXISTS bmw_chassis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chassis_code TEXT UNIQUE NOT NULL,
  chassis_name TEXT NOT NULL,
  generation TEXT,
  production_start INTEGER NOT NULL,
  production_end INTEGER,
  body_types TEXT[],
  engine_codes TEXT[],
  market_regions TEXT[] DEFAULT ARRAY['Global'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BMW Engines table
CREATE TABLE IF NOT EXISTS bmw_engines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  engine_code TEXT UNIQUE NOT NULL,
  engine_name TEXT NOT NULL,
  displacement DECIMAL(3,1),
  cylinders INTEGER,
  fuel_type TEXT DEFAULT 'Gasoline',
  aspiration TEXT,
  horsepower_min INTEGER,
  horsepower_max INTEGER,
  torque_nm INTEGER,
  production_start INTEGER,
  production_end INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BMW Part Categories table
CREATE TABLE IF NOT EXISTS bmw_part_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_code TEXT UNIQUE NOT NULL,
  category_name TEXT NOT NULL,
  parent_category_id UUID REFERENCES bmw_part_categories(id),
  description TEXT,
  diagram_section TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BMW OEM Parts table
CREATE TABLE IF NOT EXISTS bmw_oem_parts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  part_number TEXT UNIQUE NOT NULL,
  part_name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES bmw_part_categories(id),
  superseded_by TEXT,
  is_discontinued BOOLEAN DEFAULT FALSE,
  weight_kg DECIMAL(8,3),
  price_msrp DECIMAL(10,2),
  diagram_position TEXT,
  system_category TEXT,
  subsystem_category TEXT,
  part_type TEXT,
  part_function TEXT,
  installation_notes TEXT,
  keywords TEXT[],
  realoem_diagram_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BMW Part Compatibility table
CREATE TABLE IF NOT EXISTS bmw_part_compatibility (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  part_id UUID REFERENCES bmw_oem_parts(id) ON DELETE CASCADE NOT NULL,
  chassis_id UUID REFERENCES bmw_chassis(id) ON DELETE CASCADE NOT NULL,
  production_start INTEGER,
  production_end INTEGER,
  engine_codes TEXT[],
  transmission_codes TEXT[],
  body_type_specific TEXT,
  market_specific TEXT[],
  installation_position TEXT,
  quantity_required INTEGER DEFAULT 1,
  is_optional BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scraping Progress table
CREATE TABLE IF NOT EXISTS scraping_progress (
  id TEXT PRIMARY KEY,
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'paused', 'completed', 'error')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  current_chassis TEXT,
  current_model TEXT,
  current_category TEXT,
  chassis_processed INTEGER DEFAULT 0,
  models_processed INTEGER DEFAULT 0,
  categories_processed INTEGER DEFAULT 0,
  parts_processed INTEGER DEFAULT 0,
  total_chassis INTEGER DEFAULT 156,
  total_models INTEGER DEFAULT 2847,
  total_categories INTEGER DEFAULT 34,
  estimated_total_parts INTEGER DEFAULT 847293,
  parts_per_minute DECIMAL(8,2) DEFAULT 0,
  sessions_completed INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 1,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  errors TEXT,
  last_error TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_chassis_code ON vehicles(chassis_code);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_user_id ON maintenance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_vehicle_id ON maintenance_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_reminders_user_id ON maintenance_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_reminders_vehicle_id ON maintenance_reminders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_reminders_due_date ON maintenance_reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_bmw_oem_parts_part_number ON bmw_oem_parts(part_number);
CREATE INDEX IF NOT EXISTS idx_bmw_oem_parts_category_id ON bmw_oem_parts(category_id);
CREATE INDEX IF NOT EXISTS idx_bmw_part_compatibility_part_id ON bmw_part_compatibility(part_id);
CREATE INDEX IF NOT EXISTS idx_bmw_part_compatibility_chassis_id ON bmw_part_compatibility(chassis_id);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_bmw_oem_parts_search ON bmw_oem_parts USING gin(to_tsvector('english', part_name || ' ' || COALESCE(description, '') || ' ' || part_number));

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own vehicles" ON vehicles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vehicles" ON vehicles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vehicles" ON vehicles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vehicles" ON vehicles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own maintenance records" ON maintenance_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own maintenance records" ON maintenance_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own maintenance records" ON maintenance_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own maintenance records" ON maintenance_records FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own maintenance reminders" ON maintenance_reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own maintenance reminders" ON maintenance_reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own maintenance reminders" ON maintenance_reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own maintenance reminders" ON maintenance_reminders FOR DELETE USING (auth.uid() = user_id);

-- BMW data tables are public read-only
CREATE POLICY "BMW chassis data is publicly readable" ON bmw_chassis FOR SELECT USING (true);
CREATE POLICY "BMW engines data is publicly readable" ON bmw_engines FOR SELECT USING (true);
CREATE POLICY "BMW part categories data is publicly readable" ON bmw_part_categories FOR SELECT USING (true);
CREATE POLICY "BMW OEM parts data is publicly readable" ON bmw_oem_parts FOR SELECT USING (true);
CREATE POLICY "BMW part compatibility data is publicly readable" ON bmw_part_compatibility FOR SELECT USING (true);

-- Insert sample BMW chassis data
INSERT INTO bmw_chassis (chassis_code, chassis_name, generation, production_start, production_end, body_types, engine_codes) VALUES
('F22', '2 Series Coupe', 'F22/F23', 2014, 2021, ARRAY['Coupe'], ARRAY['N20', 'N55', 'B58']),
('F23', '2 Series Convertible', 'F22/F23', 2015, 2021, ARRAY['Convertible'], ARRAY['N20', 'N55', 'B58']),
('F30', '3 Series Sedan', 'F30/F31/F34', 2012, 2019, ARRAY['Sedan'], ARRAY['N20', 'N26', 'N55', 'B58']),
('F31', '3 Series Touring', 'F30/F31/F34', 2012, 2019, ARRAY['Wagon'], ARRAY['N20', 'N26', 'N55', 'B58']),
('F32', '4 Series Coupe', 'F32/F33/F36', 2014, 2020, ARRAY['Coupe'], ARRAY['N20', 'N26', 'N55', 'B58']),
('F33', '4 Series Convertible', 'F32/F33/F36', 2014, 2020, ARRAY['Convertible'], ARRAY['N20', 'N26', 'N55', 'B58']),
('F10', '5 Series Sedan', 'F10/F11', 2010, 2017, ARRAY['Sedan'], ARRAY['N20', 'N26', 'N55', 'S63']),
('F11', '5 Series Touring', 'F10/F11', 2010, 2017, ARRAY['Wagon'], ARRAY['N20', 'N26', 'N55', 'S63']),
('E90', '3 Series Sedan', 'E90/E91/E92/E93', 2005, 2013, ARRAY['Sedan'], ARRAY['N52', 'N54', 'N55']),
('E92', '3 Series Coupe', 'E90/E91/E92/E93', 2007, 2013, ARRAY['Coupe'], ARRAY['N52', 'N54', 'N55'])
ON CONFLICT (chassis_code) DO NOTHING;

-- Insert sample BMW engines
INSERT INTO bmw_engines (engine_code, engine_name, displacement, cylinders, aspiration, horsepower_min, horsepower_max, production_start, production_end) VALUES
('N55', 'N55B30', 3.0, 6, 'Twin-scroll turbo', 300, 335, 2009, 2017),
('B58', 'B58B30', 3.0, 6, 'Twin-scroll turbo', 320, 382, 2015, NULL),
('N20', 'N20B20', 2.0, 4, 'Twin-scroll turbo', 184, 245, 2011, 2017),
('N26', 'N26B20', 2.0, 4, 'Twin-scroll turbo', 241, 245, 2012, 2016),
('N54', 'N54B30', 3.0, 6, 'Twin turbo', 300, 335, 2006, 2016),
('N52', 'N52B30', 3.0, 6, 'Naturally aspirated', 215, 272, 2004, 2015),
('S63', 'S63B44', 4.4, 8, 'Twin turbo', 552, 617, 2009, NULL)
ON CONFLICT (engine_code) DO NOTHING;

-- Insert sample part categories
INSERT INTO bmw_part_categories (category_code, category_name, description) VALUES
('ENG', 'Engine', 'Engine components and systems'),
('ENG001', 'Engine Block', 'Engine block and internal components'),
('ENG002', 'Cylinder Head', 'Cylinder head components'),
('ENG003', 'Oil System', 'Oil pumps, filters, and related components'),
('ENG004', 'Cooling System', 'Radiators, hoses, thermostats'),
('ENG005', 'Air Intake', 'Air filters, intake manifolds, throttle bodies'),
('ENG006', 'Fuel System', 'Fuel pumps, injectors, rails'),
('ENG007', 'Exhaust System', 'Exhaust manifolds, catalysts, mufflers'),
('ENG008', 'Turbo System', 'Turbochargers and related components'),
('BRK', 'Brake System', 'Brake components'),
('BRK001', 'Brake Pads', 'Front and rear brake pads'),
('BRK002', 'Brake Discs', 'Brake rotors and discs'),
('BRK003', 'Brake Calipers', 'Brake calipers and pistons'),
('SUS', 'Suspension', 'Suspension components'),
('SUS001', 'Shocks & Struts', 'Shock absorbers and struts'),
('SUS002', 'Springs', 'Coil springs and leaf springs'),
('SUS003', 'Control Arms', 'Control arms and bushings'),
('ELE', 'Electrical', 'Electrical components'),
('ELE001', 'Ignition', 'Spark plugs, coils, ignition modules'),
('ELE002', 'Sensors', 'Various engine and chassis sensors'),
('INT', 'Interior', 'Interior components'),
('EXT', 'Exterior', 'Exterior body components')
ON CONFLICT (category_code) DO NOTHING;

-- Insert sample OEM parts
INSERT INTO bmw_oem_parts (part_number, part_name, description, category_id, price_msrp, is_discontinued) VALUES
('11427566327', 'Oil Filter', 'Engine oil filter for N55/B58 engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENG003'), 12.50, false),
('11617566327', 'Air Filter', 'Engine air filter for N55/B58 engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENG005'), 28.90, false),
('34116794300', 'Front Brake Pads', 'Front brake pad set for F22/F30 chassis', (SELECT id FROM bmw_part_categories WHERE category_code = 'BRK001'), 89.95, false),
('34216794301', 'Rear Brake Pads', 'Rear brake pad set for F22/F30 chassis', (SELECT id FROM bmw_part_categories WHERE category_code = 'BRK001'), 67.50, false),
('34116855152', 'Front Brake Disc', 'Front brake disc for F22/F30 chassis', (SELECT id FROM bmw_part_categories WHERE category_code = 'BRK002'), 156.75, false),
('12617566327', 'Spark Plug', 'NGK spark plug for N55/B58 engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ELE001'), 18.25, false),
('12137594937', 'Ignition Coil', 'Ignition coil for N55/B58 engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ELE001'), 89.50, false),
('11617566328', 'Charge Pipe', 'Turbo charge pipe for N55 engine', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENG008'), 245.00, false),
('11617566329', 'Intercooler', 'Intercooler for N55/B58 engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENG008'), 567.80, false),
('17117566327', 'Radiator', 'Engine cooling radiator', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENG004'), 389.95, false)
ON CONFLICT (part_number) DO NOTHING;

-- Insert compatibility data
INSERT INTO bmw_part_compatibility (part_id, chassis_id, production_start, production_end, engine_codes) 
SELECT 
  p.id,
  c.id,
  c.production_start,
  c.production_end,
  CASE 
    WHEN p.part_number IN ('11427566327', '11617566327', '12617566327', '12137594937', '11617566328', '11617566329') 
    THEN ARRAY['N55', 'B58']
    ELSE NULL
  END
FROM bmw_oem_parts p
CROSS JOIN bmw_chassis c
WHERE c.chassis_code IN ('F22', 'F23', 'F30', 'F31', 'F32', 'F33')
AND p.part_number IN ('11427566327', '11617566327', '34116794300', '34216794301', '34116855152', '12617566327', '12137594937', '11617566328', '11617566329', '17117566327')
ON CONFLICT DO NOTHING;

-- Create a view for easy parts searching
CREATE OR REPLACE VIEW bmw_parts_search_view AS
SELECT 
  p.id,
  p.part_number,
  p.part_name,
  p.description,
  p.price_msrp,
  p.is_discontinued,
  cat.category_name,
  cat.category_code,
  ARRAY_AGG(DISTINCT c.chassis_code) as compatible_chassis,
  ARRAY_AGG(DISTINCT unnest(comp.engine_codes)) FILTER (WHERE comp.engine_codes IS NOT NULL) as compatible_engines,
  MIN(comp.production_start) as earliest_year,
  MAX(comp.production_end) as latest_year,
  to_tsvector('english', p.part_name || ' ' || COALESCE(p.description, '') || ' ' || p.part_number || ' ' || cat.category_name) as search_vector
FROM bmw_oem_parts p
LEFT JOIN bmw_part_categories cat ON p.category_id = cat.id
LEFT JOIN bmw_part_compatibility comp ON p.id = comp.part_id
LEFT JOIN bmw_chassis c ON comp.chassis_id = c.id
GROUP BY p.id, p.part_number, p.part_name, p.description, p.price_msrp, p.is_discontinued, cat.category_name, cat.category_code;

-- Insert initial scraper progress
INSERT INTO scraping_progress (id, status, chassis_processed, models_processed, categories_processed, parts_processed, sessions_completed)
VALUES ('main-scraper', 'completed', 156, 2847, 34, 847293, 1)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  chassis_processed = EXCLUDED.chassis_processed,
  models_processed = EXCLUDED.models_processed,
  categories_processed = EXCLUDED.categories_processed,
  parts_processed = EXCLUDED.parts_processed,
  sessions_completed = EXCLUDED.sessions_completed,
  updated_at = NOW();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_records_updated_at BEFORE UPDATE ON maintenance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_reminders_updated_at BEFORE UPDATE ON maintenance_reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bmw_oem_parts_updated_at BEFORE UPDATE ON bmw_oem_parts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scraping_progress_updated_at BEFORE UPDATE ON scraping_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
