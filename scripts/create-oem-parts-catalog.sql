-- 🔧 BMW OEM PARTS CATALOG INTEGRATION ────────────────────────────────────

-- 1. BMW Models/Series table
CREATE TABLE IF NOT EXISTS bmw_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_code TEXT NOT NULL, -- E90, F30, G20, etc.
  series_name TEXT NOT NULL, -- 3 Series, 5 Series, etc.
  model_name TEXT NOT NULL, -- 335i, M3, etc.
  body_type TEXT, -- Sedan, Coupe, Wagon, etc.
  production_start INTEGER,
  production_end INTEGER,
  engine_codes TEXT[], -- N55, S55, etc.
  market_region TEXT DEFAULT 'US', -- US, EU, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(series_code, model_name, body_type)
);

-- 2. BMW Parts Categories
CREATE TABLE IF NOT EXISTS bmw_part_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code TEXT UNIQUE NOT NULL,
  category_name TEXT NOT NULL,
  parent_category_id UUID REFERENCES bmw_part_categories(id),
  description TEXT,
  diagram_section TEXT, -- Engine, Body, Interior, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BMW OEM Parts master table
CREATE TABLE IF NOT EXISTS bmw_oem_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number TEXT UNIQUE NOT NULL, -- BMW part number
  part_name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES bmw_part_categories(id),
  superseded_by TEXT, -- If part is replaced by newer part number
  is_discontinued BOOLEAN DEFAULT FALSE,
  weight_kg DECIMAL(8,3),
  price_msrp DECIMAL(10,2),
  diagram_position TEXT, -- Position reference in BMW diagrams
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Part compatibility with BMW models
CREATE TABLE IF NOT EXISTS bmw_part_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID REFERENCES bmw_oem_parts(id) ON DELETE CASCADE,
  model_id UUID REFERENCES bmw_models(id) ON DELETE CASCADE,
  production_start INTEGER, -- Model year start for this part
  production_end INTEGER, -- Model year end for this part
  engine_specific TEXT[], -- Specific engines if applicable
  transmission_specific TEXT[], -- Manual, Auto, etc.
  market_specific TEXT[], -- US, EU, etc.
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(part_id, model_id)
);

-- 5. Alternative/Cross-reference parts
CREATE TABLE IF NOT EXISTS bmw_part_alternatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_part_id UUID REFERENCES bmw_oem_parts(id) ON DELETE CASCADE,
  alternative_part_id UUID REFERENCES bmw_oem_parts(id) ON DELETE CASCADE,
  relationship_type TEXT CHECK (relationship_type IN ('superseded', 'alternative', 'upgrade', 'downgrade')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(primary_part_id, alternative_part_id)
);

-- 6. Enable RLS
ALTER TABLE bmw_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_part_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_oem_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_part_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_part_alternatives ENABLE ROW LEVEL SECURITY;

-- 7. Create permissive policies (read-only for most users)
CREATE POLICY "bmw_models_read" ON bmw_models FOR SELECT USING (true);
CREATE POLICY "bmw_part_categories_read" ON bmw_part_categories FOR SELECT USING (true);
CREATE POLICY "bmw_oem_parts_read" ON bmw_oem_parts FOR SELECT USING (true);
CREATE POLICY "bmw_part_compatibility_read" ON bmw_part_compatibility FOR SELECT USING (true);
CREATE POLICY "bmw_part_alternatives_read" ON bmw_part_alternatives FOR SELECT USING (true);

-- 8. Create indexes for fast searching
CREATE INDEX IF NOT EXISTS bmw_oem_parts_part_number_idx ON bmw_oem_parts(part_number);
CREATE INDEX IF NOT EXISTS bmw_oem_parts_name_idx ON bmw_oem_parts USING gin(to_tsvector('english', part_name));
CREATE INDEX IF NOT EXISTS bmw_oem_parts_description_idx ON bmw_oem_parts USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS bmw_part_compatibility_part_idx ON bmw_part_compatibility(part_id);
CREATE INDEX IF NOT EXISTS bmw_part_compatibility_model_idx ON bmw_part_compatibility(model_id);
CREATE INDEX IF NOT EXISTS bmw_models_series_idx ON bmw_models(series_code);

-- 9. Grant permissions
GRANT SELECT ON bmw_models TO anon, authenticated;
GRANT SELECT ON bmw_part_categories TO anon, authenticated;
GRANT SELECT ON bmw_oem_parts TO anon, authenticated;
GRANT SELECT ON bmw_part_compatibility TO anon, authenticated;
GRANT SELECT ON bmw_part_alternatives TO anon, authenticated;

-- 10. Insert sample categories
INSERT INTO bmw_part_categories (category_code, category_name, diagram_section) VALUES
('ENGINE', 'Engine Components', 'Engine'),
('BRAKES', 'Brake System', 'Brakes'),
('SUSPENSION', 'Suspension & Steering', 'Suspension'),
('ELECTRICAL', 'Electrical Components', 'Electrical'),
('BODY', 'Body & Exterior', 'Body'),
('INTERIOR', 'Interior Components', 'Interior'),
('TRANSMISSION', 'Transmission & Drivetrain', 'Transmission'),
('COOLING', 'Cooling System', 'Engine'),
('EXHAUST', 'Exhaust System', 'Engine'),
('FUEL', 'Fuel System', 'Engine')
ON CONFLICT (category_code) DO NOTHING;

-- 11. Insert sample BMW models (updated with comprehensive 2-Series coverage)
INSERT INTO bmw_models (series_code, series_name, model_name, body_type, production_start, production_end, engine_codes) VALUES
-- 2 Series F22/F23 Generation (2014-2021)
('F22', '2 Series', '220i', 'Coupe', 2014, 2021, ARRAY['B48']),
('F22', '2 Series', '228i', 'Coupe', 2014, 2016, ARRAY['N20']),
('F22', '2 Series', '230i', 'Coupe', 2017, 2021, ARRAY['B48']),
('F22', '2 Series', '235i', 'Coupe', 2014, 2016, ARRAY['N55']),
('F22', '2 Series', '240i', 'Coupe', 2017, 2021, ARRAY['B58']),
('F22', '2 Series', 'M235i', 'Coupe', 2014, 2016, ARRAY['N55']),
('F22', '2 Series', 'M240i', 'Coupe', 2017, 2021, ARRAY['B58']),
('F23', '2 Series', '220i', 'Convertible', 2015, 2021, ARRAY['B48']),
('F23', '2 Series', '228i', 'Convertible', 2015, 2016, ARRAY['N20']),
('F23', '2 Series', '230i', 'Convertible', 2017, 2021, ARRAY['B48']),
('F23', '2 Series', '235i', 'Convertible', 2015, 2016, ARRAY['N55']),
('F23', '2 Series', '240i', 'Convertible', 2017, 2021, ARRAY['B58']),
('F23', '2 Series', 'M235i', 'Convertible', 2015, 2016, ARRAY['N55']),
('F23', '2 Series', 'M240i', 'Convertible', 2017, 2021, ARRAY['B58']),

-- 2 Series Active Tourer F45/F46 Generation (2014-2021)
('F45', '2 Series', '216i', 'Active Tourer', 2014, 2021, ARRAY['B38']),
('F45', '2 Series', '218i', 'Active Tourer', 2014, 2021, ARRAY['B38']),
('F45', '2 Series', '220i', 'Active Tourer', 2014, 2021, ARRAY['B48']),
('F45', '2 Series', '225i', 'Active Tourer', 2014, 2018, ARRAY['B48']),
('F45', '2 Series', '225xe', 'Active Tourer', 2016, 2021, ARRAY['B38', 'Electric']),
('F45', '2 Series', '218d', 'Active Tourer', 2014, 2021, ARRAY['B47']),
('F45', '2 Series', '220d', 'Active Tourer', 2014, 2021, ARRAY['B47']),
('F46', '2 Series', '216i', 'Gran Tourer', 2015, 2021, ARRAY['B38']),
('F46', '2 Series', '218i', 'Gran Tourer', 2015, 2021, ARRAY['B38']),
('F46', '2 Series', '220i', 'Gran Tourer', 2015, 2021, ARRAY['B48']),
('F46', '2 Series', '218d', 'Gran Tourer', 2015, 2021, ARRAY['B47']),
('F46', '2 Series', '220d', 'Gran Tourer', 2015, 2021, ARRAY['B47']),

-- 2 Series G42/G43 Generation (2021+)
('G42', '2 Series', '220i', 'Coupe', 2021, 2024, ARRAY['B48']),
('G42', '2 Series', '230i', 'Coupe', 2021, 2024, ARRAY['B48']),
('G42', '2 Series', 'M240i', 'Coupe', 2021, 2024, ARRAY['B58']),
('G43', '2 Series', '220i', 'Convertible', 2022, 2024, ARRAY['B48']),
('G43', '2 Series', '230i', 'Convertible', 2022, 2024, ARRAY['B48']),
('G43', '2 Series', 'M240i', 'Convertible', 2022, 2024, ARRAY['B58']),

-- 2 Series Active Tourer U06 Generation (2022+)
('U06', '2 Series', '218i', 'Active Tourer', 2022, 2024, ARRAY['B38']),
('U06', '2 Series', '220i', 'Active Tourer', 2022, 2024, ARRAY['B48']),
('U06', '2 Series', '223i', 'Active Tourer', 2022, 2024, ARRAY['B48']),
('U06', '2 Series', '218d', 'Active Tourer', 2022, 2024, ARRAY['B47']),
('U06', '2 Series', '220d', 'Active Tourer', 2022, 2024, ARRAY['B47']),

-- M2 Models
('F87', '2 Series', 'M2', 'Coupe', 2016, 2018, ARRAY['N55']),
('F87', '2 Series', 'M2 Competition', 'Coupe', 2018, 2020, ARRAY['S55']),
('F87', '2 Series', 'M2 CS', 'Coupe', 2020, 2020, ARRAY['S55']),
('G87', '2 Series', 'M2', 'Coupe', 2023, 2024, ARRAY['S58']),

-- Existing 3 Series and other models...
('E90', '3 Series', '335i', 'Sedan', 2007, 2012, ARRAY['N54', 'N55']),
('E92', '3 Series', '335i', 'Coupe', 2007, 2013, ARRAY['N54', 'N55']),
('F30', '3 Series', '335i', 'Sedan', 2012, 2015, ARRAY['N55']),
('F32', '4 Series', '435i', 'Coupe', 2014, 2016, ARRAY['N55']),
('G20', '3 Series', '330i', 'Sedan', 2019, 2024, ARRAY['B48']),
('F80', '3 Series', 'M3', 'Sedan', 2014, 2018, ARRAY['S55']),
('E46', '3 Series', '330i', 'Sedan', 2001, 2006, ARRAY['M54'])
ON CONFLICT (series_code, model_name, body_type) DO NOTHING;
