-- 🚗 COMPREHENSIVE BMW 2-SERIES DATA ────────────────────────────────────

-- Insert comprehensive 2-Series models with all variants and engines
INSERT INTO bmw_models (series_code, series_name, model_name, body_type, production_start, production_end, engine_codes, market_region) VALUES

-- 2 Series F22/F23 Generation (2014-2021) - Rear-wheel drive
('F22', '2 Series', '220i', 'Coupe', 2014, 2021, ARRAY['B48'], 'US'),
('F22', '2 Series', '228i', 'Coupe', 2014, 2016, ARRAY['N20'], 'US'),
('F22', '2 Series', '230i', 'Coupe', 2017, 2021, ARRAY['B48'], 'US'),
('F22', '2 Series', '235i', 'Coupe', 2014, 2016, ARRAY['N55'], 'US'),
('F22', '2 Series', '240i', 'Coupe', 2017, 2021, ARRAY['B58'], 'US'),
('F22', '2 Series', 'M235i', 'Coupe', 2014, 2016, ARRAY['N55'], 'US'),
('F22', '2 Series', 'M240i', 'Coupe', 2017, 2021, ARRAY['B58'], 'US'),

-- F22 European variants
('F22', '2 Series', '218i', 'Coupe', 2014, 2021, ARRAY['B38'], 'EU'),
('F22', '2 Series', '218d', 'Coupe', 2014, 2021, ARRAY['B47'], 'EU'),
('F22', '2 Series', '220d', 'Coupe', 2014, 2021, ARRAY['B47'], 'EU'),
('F22', '2 Series', '225d', 'Coupe', 2014, 2021, ARRAY['B47'], 'EU'),

-- F23 Convertible variants
('F23', '2 Series', '220i', 'Convertible', 2015, 2021, ARRAY['B48'], 'US'),
('F23', '2 Series', '228i', 'Convertible', 2015, 2016, ARRAY['N20'], 'US'),
('F23', '2 Series', '230i', 'Convertible', 2017, 2021, ARRAY['B48'], 'US'),
('F23', '2 Series', '235i', 'Convertible', 2015, 2016, ARRAY['N55'], 'US'),
('F23', '2 Series', '240i', 'Convertible', 2017, 2021, ARRAY['B58'], 'US'),
('F23', '2 Series', 'M235i', 'Convertible', 2015, 2016, ARRAY['N55'], 'US'),
('F23', '2 Series', 'M240i', 'Convertible', 2017, 2021, ARRAY['B58'], 'US'),

-- F23 European variants
('F23', '2 Series', '218i', 'Convertible', 2015, 2021, ARRAY['B38'], 'EU'),
('F23', '2 Series', '218d', 'Convertible', 2015, 2021, ARRAY['B47'], 'EU'),
('F23', '2 Series', '220d', 'Convertible', 2015, 2021, ARRAY['B47'], 'EU'),

-- 2 Series Active Tourer F45 Generation (2014-2021) - Front-wheel drive
('F45', '2 Series', '216i', 'Active Tourer', 2014, 2021, ARRAY['B38'], 'EU'),
('F45', '2 Series', '218i', 'Active Tourer', 2014, 2021, ARRAY['B38'], 'US'),
('F45', '2 Series', '220i', 'Active Tourer', 2014, 2021, ARRAY['B48'], 'US'),
('F45', '2 Series', '225i', 'Active Tourer', 2014, 2018, ARRAY['B48'], 'US'),
('F45', '2 Series', '225xe', 'Active Tourer', 2016, 2021, ARRAY['B38', 'Electric'], 'EU'),
('F45', '2 Series', '218d', 'Active Tourer', 2014, 2021, ARRAY['B47'], 'EU'),
('F45', '2 Series', '220d', 'Active Tourer', 2014, 2021, ARRAY['B47'], 'EU'),
('F45', '2 Series', '225d', 'Active Tourer', 2014, 2021, ARRAY['B47'], 'EU'),

-- 2 Series Gran Tourer F46 Generation (2015-2021) - Front-wheel drive
('F46', '2 Series', '216i', 'Gran Tourer', 2015, 2021, ARRAY['B38'], 'EU'),
('F46', '2 Series', '218i', 'Gran Tourer', 2015, 2021, ARRAY['B38'], 'US'),
('F46', '2 Series', '220i', 'Gran Tourer', 2015, 2021, ARRAY['B48'], 'US'),
('F46', '2 Series', '218d', 'Gran Tourer', 2015, 2021, ARRAY['B47'], 'EU'),
('F46', '2 Series', '220d', 'Gran Tourer', 2015, 2021, ARRAY['B47'], 'EU'),

-- M2 F87 Generation (2016-2020)
('F87', '2 Series', 'M2', 'Coupe', 2016, 2018, ARRAY['N55'], 'US'),
('F87', '2 Series', 'M2 Competition', 'Coupe', 2018, 2020, ARRAY['S55'], 'US'),
('F87', '2 Series', 'M2 CS', 'Coupe', 2020, 2020, ARRAY['S55'], 'US'),

-- 2 Series G42/G43 Generation (2021+) - Rear-wheel drive
('G42', '2 Series', '220i', 'Coupe', 2021, 2024, ARRAY['B48'], 'US'),
('G42', '2 Series', '230i', 'Coupe', 2021, 2024, ARRAY['B48'], 'US'),
('G42', '2 Series', 'M240i', 'Coupe', 2021, 2024, ARRAY['B58'], 'US'),

-- G42 European variants
('G42', '2 Series', '218i', 'Coupe', 2021, 2024, ARRAY['B38'], 'EU'),
('G42', '2 Series', '218d', 'Coupe', 2021, 2024, ARRAY['B47'], 'EU'),
('G42', '2 Series', '220d', 'Coupe', 2021, 2024, ARRAY['B47'], 'EU'),

-- G43 Convertible variants
('G43', '2 Series', '220i', 'Convertible', 2022, 2024, ARRAY['B48'], 'US'),
('G43', '2 Series', '230i', 'Convertible', 2022, 2024, ARRAY['B48'], 'US'),
('G43', '2 Series', 'M240i', 'Convertible', 2022, 2024, ARRAY['B58'], 'US'),

-- G43 European variants
('G43', '2 Series', '218i', 'Convertible', 2022, 2024, ARRAY['B38'], 'EU'),
('G43', '2 Series', '218d', 'Convertible', 2022, 2024, ARRAY['B47'], 'EU'),
('G43', '2 Series', '220d', 'Convertible', 2022, 2024, ARRAY['B47'], 'EU'),

-- 2 Series Active Tourer U06 Generation (2022+) - Front-wheel drive
('U06', '2 Series', '218i', 'Active Tourer', 2022, 2024, ARRAY['B38'], 'US'),
('U06', '2 Series', '220i', 'Active Tourer', 2022, 2024, ARRAY['B48'], 'US'),
('U06', '2 Series', '223i', 'Active Tourer', 2022, 2024, ARRAY['B48'], 'US'),
('U06', '2 Series', '218d', 'Active Tourer', 2022, 2024, ARRAY['B47'], 'EU'),
('U06', '2 Series', '220d', 'Active Tourer', 2022, 2024, ARRAY['B47'], 'EU'),

-- M2 G87 Generation (2023+)
('G87', '2 Series', 'M2', 'Coupe', 2023, 2024, ARRAY['S58'], 'US')

ON CONFLICT (series_code, model_name, body_type) DO UPDATE SET
  production_end = EXCLUDED.production_end,
  engine_codes = EXCLUDED.engine_codes,
  market_region = EXCLUDED.market_region;

-- Insert sample 2-Series specific parts
INSERT INTO bmw_oem_parts (part_number, part_name, description, category_id, price_msrp, notes) VALUES
('11617531423', 'Charge Pipe', 'Aluminum charge pipe for N55/B58 engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENGINE'), 189.99, 'Common upgrade from plastic OEM part'),
('34116794300', 'Front Brake Pads', 'Ceramic brake pads for 2-Series', (SELECT id FROM bmw_part_categories WHERE category_code = 'BRAKES'), 85.00, 'OEM replacement pads'),
('12617508003', 'Air Filter', 'Engine air filter for B48/B58 engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENGINE'), 25.99, 'Replace every 30,000 miles'),
('51117379434', 'Kidney Grille', 'Front kidney grille for F22/F23', (SELECT id FROM bmw_part_categories WHERE category_code = 'BODY'), 145.00, 'Left side grille'),
('51117379435', 'Kidney Grille', 'Front kidney grille for F22/F23', (SELECT id FROM bmw_part_categories WHERE category_code = 'BODY'), 145.00, 'Right side grille'),
('11427566327', 'Oil Filter', 'Engine oil filter for B48/B58/N55 engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENGINE'), 12.50, 'Replace with every oil change'),
('64119237555', 'A/C Condenser', 'Air conditioning condenser for F22/F23', (SELECT id FROM bmw_part_categories WHERE category_code = 'COOLING'), 285.00, 'Located in front of radiator'),
('18307616119', 'Exhaust Tip', 'Chrome exhaust tip for 2-Series', (SELECT id FROM bmw_part_categories WHERE category_code = 'EXHAUST'), 89.99, 'Single tip design')
ON CONFLICT (part_number) DO NOTHING;

-- Create compatibility entries for 2-Series parts
INSERT INTO bmw_part_compatibility (part_id, model_id, production_start, production_end, engine_specific, notes)
SELECT 
  p.id as part_id,
  m.id as model_id,
  m.production_start,
  m.production_end,
  CASE 
    WHEN p.part_number = '11617531423' THEN ARRAY['N55', 'B58']
    WHEN p.part_number = '12617508003' THEN ARRAY['B48', 'B58']
    WHEN p.part_number = '11427566327' THEN ARRAY['B48', 'B58', 'N55']
    ELSE NULL
  END as engine_specific,
  'Compatible with 2-Series models' as notes
FROM bmw_oem_parts p
CROSS JOIN bmw_models m
WHERE p.part_number IN ('11617531423', '34116794300', '12617508003', '51117379434', '51117379435', '11427566327', '64119237555', '18307616119')
  AND m.series_name = '2 Series'
  AND (
    (p.part_number = '11617531423' AND m.engine_codes && ARRAY['N55', 'B58']) OR
    (p.part_number = '12617508003' AND m.engine_codes && ARRAY['B48', 'B58']) OR
    (p.part_number = '11427566327' AND m.engine_codes && ARRAY['B48', 'B58', 'N55']) OR
    (p.part_number IN ('34116794300', '51117379434', '51117379435', '64119237555', '18307616119'))
  )
ON CONFLICT (part_id, model_id) DO NOTHING;

-- Add indexes for 2-Series specific queries
CREATE INDEX IF NOT EXISTS bmw_models_2_series_idx ON bmw_models(series_name) WHERE series_name = '2 Series';
CREATE INDEX IF NOT EXISTS bmw_models_engine_codes_idx ON bmw_models USING gin(engine_codes);

-- Update table comment to reflect comprehensive 2-Series coverage
COMMENT ON TABLE bmw_models IS 'Comprehensive BMW model database including all 2-Series variants (F22, F23, F45, F46, F87, G42, G43, G87, U06)';
