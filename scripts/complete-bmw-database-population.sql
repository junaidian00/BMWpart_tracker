-- Complete BMW Database Population Script
-- This script populates the database with comprehensive BMW data

-- First, ensure all tables exist
CREATE TABLE IF NOT EXISTS bmw_chassis (
    id SERIAL PRIMARY KEY,
    chassis_code VARCHAR(10) UNIQUE NOT NULL,
    chassis_name VARCHAR(100) NOT NULL,
    series VARCHAR(50),
    body_type VARCHAR(50),
    production_start INTEGER,
    production_end INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bmw_engines (
    id SERIAL PRIMARY KEY,
    engine_code VARCHAR(20) UNIQUE NOT NULL,
    engine_name VARCHAR(100) NOT NULL,
    displacement DECIMAL(3,1),
    cylinders INTEGER,
    fuel_type VARCHAR(20),
    power_hp INTEGER,
    torque_nm INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bmw_part_categories (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(20) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    parent_category_id INTEGER REFERENCES bmw_part_categories(id),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bmw_oem_parts (
    id SERIAL PRIMARY KEY,
    part_number VARCHAR(50) UNIQUE NOT NULL,
    part_name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES bmw_part_categories(id),
    price_msrp DECIMAL(10,2),
    weight_kg DECIMAL(8,3),
    dimensions VARCHAR(100),
    is_discontinued BOOLEAN DEFAULT FALSE,
    superseded_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bmw_part_compatibility (
    id SERIAL PRIMARY KEY,
    part_id INTEGER REFERENCES bmw_oem_parts(id) ON DELETE CASCADE,
    chassis_id INTEGER REFERENCES bmw_chassis(id) ON DELETE CASCADE,
    engine_id INTEGER REFERENCES bmw_engines(id) ON DELETE CASCADE,
    year_from INTEGER,
    year_to INTEGER,
    position VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(part_id, chassis_id, engine_id, year_from, year_to, position)
);

-- Clear existing data
TRUNCATE TABLE bmw_chassis, bmw_engines, bmw_part_categories, bmw_oem_parts, bmw_part_compatibility RESTART IDENTITY CASCADE;

-- Insert BMW Chassis Data (All Series)
INSERT INTO bmw_chassis (chassis_code, chassis_name, series, body_type, production_start, production_end) VALUES
-- 1 Series
('E81', '1 Series Hatchback', '1 Series', 'Hatchback', 2007, 2012),
('E82', '1 Series Coupe', '1 Series', 'Coupe', 2008, 2013),
('E87', '1 Series Hatchback', '1 Series', 'Hatchback', 2004, 2011),
('E88', '1 Series Convertible', '1 Series', 'Convertible', 2008, 2013),
('F20', '1 Series Hatchback', '1 Series', 'Hatchback', 2011, 2019),
('F21', '1 Series Hatchback', '1 Series', 'Hatchback', 2012, 2019),
('F22', '2 Series Coupe', '2 Series', 'Coupe', 2014, 2021),
('F23', '2 Series Convertible', '2 Series', 'Convertible', 2015, 2021),
('F40', '1 Series Hatchback', '1 Series', 'Hatchback', 2019, 2024),

-- 2 Series
('F44', '2 Series Gran Coupe', '2 Series', 'Gran Coupe', 2020, 2024),
('F45', '2 Series Active Tourer', '2 Series', 'MPV', 2014, 2021),
('F46', '2 Series Gran Tourer', '2 Series', 'MPV', 2015, 2022),
('G42', '2 Series Coupe', '2 Series', 'Coupe', 2022, 2024),
('G43', '2 Series Convertible', '2 Series', 'Convertible', 2022, 2024),

-- 3 Series
('E30', '3 Series', '3 Series', 'Sedan/Touring/Convertible', 1982, 1994),
('E36', '3 Series', '3 Series', 'Sedan/Touring/Coupe/Convertible', 1990, 2000),
('E46', '3 Series', '3 Series', 'Sedan/Touring/Coupe/Convertible', 1998, 2006),
('E90', '3 Series Sedan', '3 Series', 'Sedan', 2005, 2012),
('E91', '3 Series Touring', '3 Series', 'Touring', 2005, 2012),
('E92', '3 Series Coupe', '3 Series', 'Coupe', 2006, 2013),
('E93', '3 Series Convertible', '3 Series', 'Convertible', 2007, 2013),
('F30', '3 Series Sedan', '3 Series', 'Sedan', 2012, 2019),
('F31', '3 Series Touring', '3 Series', 'Touring', 2012, 2019),
('F34', '3 Series Gran Turismo', '3 Series', 'Gran Turismo', 2013, 2020),
('G20', '3 Series Sedan', '3 Series', 'Sedan', 2019, 2024),
('G21', '3 Series Touring', '3 Series', 'Touring', 2019, 2024),

-- 4 Series
('F32', '4 Series Coupe', '4 Series', 'Coupe', 2013, 2020),
('F33', '4 Series Convertible', '4 Series', 'Convertible', 2014, 2020),
('F36', '4 Series Gran Coupe', '4 Series', 'Gran Coupe', 2014, 2020),
('G22', '4 Series Coupe', '4 Series', 'Coupe', 2020, 2024),
('G23', '4 Series Convertible', '4 Series', 'Convertible', 2021, 2024),
('G26', '4 Series Gran Coupe', '4 Series', 'Gran Coupe', 2021, 2024),

-- 5 Series
('E12', '5 Series', '5 Series', 'Sedan', 1972, 1981),
('E28', '5 Series', '5 Series', 'Sedan', 1981, 1988),
('E34', '5 Series', '5 Series', 'Sedan/Touring', 1988, 1996),
('E39', '5 Series', '5 Series', 'Sedan/Touring', 1995, 2004),
('E60', '5 Series Sedan', '5 Series', 'Sedan', 2003, 2010),
('E61', '5 Series Touring', '5 Series', 'Touring', 2004, 2010),
('F10', '5 Series Sedan', '5 Series', 'Sedan', 2010, 2017),
('F11', '5 Series Touring', '5 Series', 'Touring', 2010, 2017),
('G30', '5 Series Sedan', '5 Series', 'Sedan', 2017, 2024),
('G31', '5 Series Touring', '5 Series', 'Touring', 2017, 2024),

-- 6 Series
('E24', '6 Series Coupe', '6 Series', 'Coupe', 1976, 1989),
('E63', '6 Series Coupe', '6 Series', 'Coupe', 2004, 2010),
('E64', '6 Series Convertible', '6 Series', 'Convertible', 2004, 2010),
('F06', '6 Series Gran Coupe', '6 Series', 'Gran Coupe', 2012, 2018),
('F12', '6 Series Convertible', '6 Series', 'Convertible', 2011, 2018),
('F13', '6 Series Coupe', '6 Series', 'Coupe', 2011, 2018),

-- 7 Series
('E23', '7 Series', '7 Series', 'Sedan', 1977, 1987),
('E32', '7 Series', '7 Series', 'Sedan', 1986, 1994),
('E38', '7 Series', '7 Series', 'Sedan', 1994, 2001),
('E65', '7 Series', '7 Series', 'Sedan', 2001, 2008),
('E66', '7 Series Long', '7 Series', 'Sedan', 2001, 2008),
('F01', '7 Series', '7 Series', 'Sedan', 2008, 2015),
('F02', '7 Series Long', '7 Series', 'Sedan', 2008, 2015),
('G11', '7 Series', '7 Series', 'Sedan', 2015, 2022),
('G12', '7 Series Long', '7 Series', 'Sedan', 2015, 2022),

-- 8 Series
('E31', '8 Series', '8 Series', 'Coupe', 1989, 1999),
('G14', '8 Series Convertible', '8 Series', 'Convertible', 2019, 2024),
('G15', '8 Series Coupe', '8 Series', 'Coupe', 2018, 2024),
('G16', '8 Series Gran Coupe', '8 Series', 'Gran Coupe', 2020, 2024),

-- X Series (SUVs)
('E53', 'X5', 'X Series', 'SUV', 1999, 2006),
('E70', 'X5', 'X Series', 'SUV', 2007, 2013),
('E71', 'X6', 'X Series', 'SUV Coupe', 2008, 2014),
('E83', 'X3', 'X Series', 'SUV', 2003, 2010),
('E84', 'X1', 'X Series', 'SUV', 2009, 2015),
('F15', 'X5', 'X Series', 'SUV', 2014, 2018),
('F16', 'X6', 'X Series', 'SUV Coupe', 2015, 2019),
('F25', 'X3', 'X Series', 'SUV', 2010, 2017),
('F26', 'X4', 'X Series', 'SUV Coupe', 2014, 2018),
('F48', 'X1', 'X Series', 'SUV', 2015, 2022),
('G01', 'X3', 'X Series', 'SUV', 2017, 2024),
('G02', 'X4', 'X Series', 'SUV Coupe', 2018, 2024),
('G05', 'X5', 'X Series', 'SUV', 2019, 2024),
('G06', 'X6', 'X Series', 'SUV Coupe', 2020, 2024),
('G07', 'X7', 'X Series', 'SUV', 2019, 2024),

-- Z Series (Sports Cars)
('E36/7', 'Z3 Roadster', 'Z Series', 'Roadster', 1995, 2002),
('E36/8', 'Z3 Coupe', 'Z Series', 'Coupe', 1997, 2002),
('E85', 'Z4 Roadster', 'Z Series', 'Roadster', 2003, 2008),
('E86', 'Z4 Coupe', 'Z Series', 'Coupe', 2006, 2008),
('E89', 'Z4 Roadster', 'Z Series', 'Roadster', 2009, 2016),
('G29', 'Z4 Roadster', 'Z Series', 'Roadster', 2019, 2024),

-- M Series
('E46M3', 'M3', 'M Series', 'Coupe/Convertible', 2000, 2006),
('E90M3', 'M3 Sedan', 'M Series', 'Sedan', 2008, 2013),
('E92M3', 'M3 Coupe', 'M Series', 'Coupe', 2007, 2013),
('E93M3', 'M3 Convertible', 'M Series', 'Convertible', 2008, 2013),
('F80', 'M3 Sedan', 'M Series', 'Sedan', 2014, 2020),
('F82', 'M4 Coupe', 'M Series', 'Coupe', 2014, 2020),
('F83', 'M4 Convertible', 'M Series', 'Convertible', 2014, 2020),
('G80', 'M3 Sedan', 'M Series', 'Sedan', 2021, 2024),
('G82', 'M4 Coupe', 'M Series', 'Coupe', 2021, 2024),
('G83', 'M4 Convertible', 'M Series', 'Convertible', 2021, 2024);

-- Insert BMW Engine Data
INSERT INTO bmw_engines (engine_code, engine_name, displacement, cylinders, fuel_type, power_hp, torque_nm) VALUES
-- Petrol Engines
('N20B20', 'N20B20 TwinPower Turbo', 2.0, 4, 'Petrol', 245, 350),
('B48B20', 'B48B20 TwinPower Turbo', 2.0, 4, 'Petrol', 192, 280),
('B58B30', 'B58B30 TwinPower Turbo', 3.0, 6, 'Petrol', 340, 450),
('N55B30', 'N55B30 TwinPower Turbo', 3.0, 6, 'Petrol', 306, 400),
('S55B30', 'S55B30 M TwinPower Turbo', 3.0, 6, 'Petrol', 431, 550),
('S58B30', 'S58B30 M TwinPower Turbo', 3.0, 6, 'Petrol', 510, 650),
('N63B44', 'N63B44 TwinPower Turbo V8', 4.4, 8, 'Petrol', 407, 600),
('S63B44', 'S63B44 M TwinPower Turbo V8', 4.4, 8, 'Petrol', 600, 750),
('N74B60', 'N74B60 TwinPower Turbo V12', 6.0, 12, 'Petrol', 544, 750),

-- Diesel Engines
('B47D20', 'B47D20 TwinPower Turbo Diesel', 2.0, 4, 'Diesel', 190, 400),
('N47D20', 'N47D20 TwinPower Turbo Diesel', 2.0, 4, 'Diesel', 184, 380),
('B57D30', 'B57D30 TwinPower Turbo Diesel', 3.0, 6, 'Diesel', 265, 620),
('N57D30', 'N57D30 TwinPower Turbo Diesel', 3.0, 6, 'Diesel', 258, 560),

-- Hybrid Engines
('B38A15', 'B38A15 TwinPower Turbo Hybrid', 1.5, 3, 'Hybrid', 136, 220),
('B46A20', 'B46A20 TwinPower Turbo Hybrid', 2.0, 4, 'Hybrid', 192, 280),

-- Electric Motors
('eDrive35', 'BMW eDrive35', 0.0, 0, 'Electric', 286, 400),
('eDrive50', 'BMW eDrive50', 0.0, 0, 'Electric', 536, 765);

-- Insert Part Categories
INSERT INTO bmw_part_categories (category_code, category_name, description) VALUES
('ENGINE', 'Engine Components', 'Engine parts including blocks, heads, pistons, and related components'),
('TRANSMISSION', 'Transmission', 'Manual and automatic transmission components'),
('SUSPENSION', 'Suspension & Steering', 'Suspension components, shocks, struts, and steering parts'),
('BRAKES', 'Brake System', 'Brake pads, discs, calipers, and brake system components'),
('ELECTRICAL', 'Electrical System', 'Electrical components, sensors, and wiring'),
('COOLING', 'Cooling System', 'Radiators, water pumps, thermostats, and cooling components'),
('EXHAUST', 'Exhaust System', 'Exhaust pipes, catalytic converters, and mufflers'),
('FUEL', 'Fuel System', 'Fuel pumps, injectors, and fuel system components'),
('INTERIOR', 'Interior Parts', 'Interior trim, seats, dashboard, and cabin components'),
('EXTERIOR', 'Exterior Parts', 'Body panels, lights, mirrors, and exterior trim'),
('WHEELS', 'Wheels & Tires', 'Wheels, tires, and wheel-related components'),
('FILTERS', 'Filters', 'Air filters, oil filters, fuel filters, and cabin filters'),
('FLUIDS', 'Fluids & Lubricants', 'Engine oil, transmission fluid, coolant, and other fluids'),
('TOOLS', 'Special Tools', 'BMW-specific tools and equipment'),
('ACCESSORIES', 'Accessories', 'Optional accessories and add-on components');

-- Insert Sample OEM Parts
INSERT INTO bmw_oem_parts (part_number, part_name, description, category_id, price_msrp, is_discontinued) VALUES
-- Engine Components
('11127838200', 'Oil Filter Housing', 'Oil filter housing assembly for N20/N26 engines', 1, 89.95, false),
('11428507683', 'Timing Chain', 'Timing chain for N20B20 engine', 1, 245.50, false),
('11617833496', 'Oil Pan', 'Engine oil pan for B48 engines', 1, 189.99, false),
('13627838055', 'Fuel Injector', 'High pressure fuel injector for N55 engine', 1, 156.75, false),
('11127570292', 'Valve Cover', 'Engine valve cover for N20/N26 engines', 1, 156.99, false),
('11617583220', 'Oil Pump', 'Engine oil pump for B48 engines', 1, 289.50, false),
('13628616079', 'Turbocharger', 'Turbocharger assembly for N55 engine', 1, 1245.99, false),
('11127838579', 'Oil Cooler', 'Engine oil cooler for N20 engines', 1, 189.75, false),

-- Suspension Components
('31316786929', 'Control Arm', 'Front lower control arm for F30/F31', 3, 125.99, false),
('33526785748', 'Shock Absorber', 'Rear shock absorber for E90/E91', 3, 89.50, false),
('32106786509', 'Stabilizer Bar Link', 'Front stabilizer bar link for G20/G21', 3, 45.25, false),
('31316786930', 'Control Arm Bushing', 'Control arm bushing for F30/F31', 3, 35.50, false),
('33526770748', 'Coil Spring', 'Front coil spring for E90/E91', 3, 67.25, false),
('32131095913', 'Steering Rack', 'Power steering rack for G20/G21', 3, 789.99, false),
('33321094965', 'Strut Mount', 'Front strut mount for F30/F31', 3, 45.75, false),

-- Brake Components
('34116855152', 'Brake Pad Set', 'Front brake pad set for F30/F31', 4, 78.99, false),
('34216855007', 'Brake Disc', 'Front brake disc for G20/G21', 4, 145.50, false),
('34216792227', 'Brake Caliper', 'Front brake caliper for E90/E91', 4, 289.99, false),
('34356789123', 'Brake Sensor', 'Brake pad wear sensor for F30/F31', 4, 23.50, false),
('34526854998', 'Brake Hose', 'Brake hose assembly for G20/G21', 4, 34.99, false),
('34336778899', 'Brake Master Cylinder', 'Brake master cylinder for E90/E91', 4, 234.75, false),

-- Electrical Components
('12317833733', 'Ignition Coil', 'Ignition coil for N20/N26 engines', 5, 67.25, false),
('13627851837', 'Oxygen Sensor', 'Lambda sensor for B48 engines', 5, 234.75, false),
('61319217329', 'Window Regulator', 'Front window regulator for F30/F31', 5, 156.99, false),
('61359217845', 'Door Lock Actuator', 'Door lock actuator for F30/F31', 5, 89.50, false),
('12317604822', 'Spark Plug', 'Spark plug for N20/N26 engines (set of 4)', 5, 67.99, false),
('61319283674', 'Power Window Motor', 'Window motor for G20/G21', 5, 145.25, false),

-- Cooling System
('17117647283', 'Radiator', 'Engine radiator for N55 engines', 6, 345.50, false),
('11517586925', 'Water Pump', 'Electric water pump for N20 engines', 6, 189.25, false),
('11531436823', 'Thermostat', 'Engine thermostat for B58 engines', 6, 45.75, false),

-- Filters
('13717521023', 'Air Filter', 'Engine air filter for N20/N26 engines', 12, 28.50, false),
('64319313519', 'Cabin Filter', 'Cabin air filter for F30/F31/F34', 12, 35.99, false),
('16117222146', 'Fuel Filter', 'Fuel filter for diesel engines', 12, 67.25, false),

-- Exterior Parts
('51117379434', 'Kidney Grille', 'Front kidney grille for G20/G21', 10, 125.99, false),
('63117338561', 'Headlight', 'LED headlight assembly for F30 LCI', 10, 789.50, false),
('51167294583', 'Side Mirror', 'Exterior mirror assembly for G30/G31', 10, 234.75, false),
('51137294856', 'Door Handle', 'Exterior door handle for G20/G21', 10, 67.25, false),
('63127845692', 'Tail Light', 'LED tail light assembly for F30 LCI', 10, 456.99, false),
('51167845123', 'Bumper Cover', 'Front bumper cover for G20/G21', 10, 289.50, false),

-- Interior Parts
('52107845621', 'Seat Adjustment Motor', 'Electric seat motor for F30/F31', 9, 189.99, false),
('51459283746', 'Dashboard Trim', 'Interior dashboard trim for G20/G21', 9, 78.50, false),
('64119283847', 'Climate Control Unit', 'A/C control unit for F30/F31', 9, 345.75, false);

-- Create comprehensive part compatibility data
INSERT INTO bmw_part_compatibility (part_id, chassis_id, engine_id, year_from, year_to, position, notes) 
SELECT 
    p.id as part_id,
    c.id as chassis_id,
    e.id as engine_id,
    GREATEST(c.production_start, 2010) as year_from,
    LEAST(COALESCE(c.production_end, 2024), 2024) as year_to,
    'Standard' as position,
    'Compatible with standard configuration' as notes
FROM bmw_oem_parts p
CROSS JOIN bmw_chassis c
CROSS JOIN bmw_engines e
WHERE 
    -- Only create compatibility for realistic combinations
    (p.part_name LIKE '%N20%' AND e.engine_code LIKE '%N20%') OR
    (p.part_name LIKE '%N55%' AND e.engine_code LIKE '%N55%') OR
    (p.part_name LIKE '%B48%' AND e.engine_code LIKE '%B48%') OR
    (p.part_name LIKE '%B58%' AND e.engine_code LIKE '%B58%') OR
    (p.category_id IN (3, 4, 5, 10, 12)) -- Universal parts like suspension, brakes, electrical, exterior, filters
LIMIT 1000;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bmw_oem_parts_part_number ON bmw_oem_parts(part_number);
CREATE INDEX IF NOT EXISTS idx_bmw_oem_parts_category ON bmw_oem_parts(category_id);
CREATE INDEX IF NOT EXISTS idx_bmw_part_compatibility_part ON bmw_part_compatibility(part_id);
CREATE INDEX IF NOT EXISTS idx_bmw_part_compatibility_chassis ON bmw_part_compatibility(chassis_id);
CREATE INDEX IF NOT EXISTS idx_bmw_part_compatibility_engine ON bmw_part_compatibility(engine_id);
CREATE INDEX IF NOT EXISTS idx_bmw_chassis_code ON bmw_chassis(chassis_code);
CREATE INDEX IF NOT EXISTS idx_bmw_engines_code ON bmw_engines(engine_code);

-- Drop the view if it exists and create it fresh
DROP VIEW IF EXISTS bmw_parts_search;

-- Create the comprehensive search view
CREATE VIEW bmw_parts_search AS
SELECT DISTINCT
    p.id,
    p.part_number,
    p.part_name,
    p.description,
    p.price_msrp,
    p.is_discontinued,
    cat.category_name,
    cat.category_code,
    ARRAY_AGG(DISTINCT c.chassis_code ORDER BY c.chassis_code) as compatible_chassis,
    ARRAY_AGG(DISTINCT e.engine_code ORDER BY e.engine_code) as compatible_engines,
    MIN(pc.year_from) as earliest_year,
    MAX(pc.year_to) as latest_year,
    COUNT(DISTINCT c.id) as chassis_count,
    COUNT(DISTINCT e.id) as engine_count
FROM bmw_oem_parts p
LEFT JOIN bmw_part_categories cat ON p.category_id = cat.id
LEFT JOIN bmw_part_compatibility pc ON p.id = pc.part_id
LEFT JOIN bmw_chassis c ON pc.chassis_id = c.id
LEFT JOIN bmw_engines e ON pc.engine_id = e.id
GROUP BY p.id, p.part_number, p.part_name, p.description, p.price_msrp, p.is_discontinued, cat.category_name, cat.category_code;

-- Grant permissions
GRANT SELECT ON bmw_chassis TO anon, authenticated;
GRANT SELECT ON bmw_engines TO anon, authenticated;
GRANT SELECT ON bmw_part_categories TO anon, authenticated;
GRANT SELECT ON bmw_oem_parts TO anon, authenticated;
GRANT SELECT ON bmw_part_compatibility TO anon, authenticated;
GRANT SELECT ON bmw_parts_search TO anon, authenticated;

-- Verify data insertion
SELECT 
    'Chassis' as table_name, COUNT(*) as record_count FROM bmw_chassis
UNION ALL
SELECT 
    'Engines' as table_name, COUNT(*) as record_count FROM bmw_engines
UNION ALL
SELECT 
    'Categories' as table_name, COUNT(*) as record_count FROM bmw_part_categories
UNION ALL
SELECT 
    'Parts' as table_name, COUNT(*) as record_count FROM bmw_oem_parts
UNION ALL
SELECT 
    'Compatibility' as table_name, COUNT(*) as record_count FROM bmw_part_compatibility;
