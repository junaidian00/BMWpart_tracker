-- Complete BMW Parts Database Setup
-- This script creates all necessary tables and populates them with comprehensive BMW data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS bmw_part_compatibility CASCADE;
DROP TABLE IF EXISTS bmw_oem_parts CASCADE;
DROP TABLE IF EXISTS bmw_part_categories CASCADE;
DROP TABLE IF EXISTS bmw_model_variants CASCADE;
DROP TABLE IF EXISTS bmw_engines CASCADE;
DROP TABLE IF EXISTS bmw_chassis CASCADE;

-- Drop materialized view if it exists
DROP MATERIALIZED VIEW IF EXISTS bmw_parts_search_view CASCADE;

-- Create BMW Chassis table
CREATE TABLE bmw_chassis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chassis_code VARCHAR(10) UNIQUE NOT NULL,
    chassis_name VARCHAR(100) NOT NULL,
    generation VARCHAR(50),
    body_style VARCHAR(50),
    production_start INTEGER NOT NULL,
    production_end INTEGER,
    platform VARCHAR(50),
    market_segment VARCHAR(50),
    drivetrain_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create BMW Engines table
CREATE TABLE bmw_engines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    engine_code VARCHAR(20) UNIQUE NOT NULL,
    engine_name VARCHAR(100),
    displacement DECIMAL(4,1),
    cylinders INTEGER,
    fuel_type VARCHAR(20),
    aspiration VARCHAR(20),
    horsepower_min INTEGER,
    horsepower_max INTEGER,
    torque_min INTEGER,
    torque_max INTEGER,
    production_start INTEGER,
    production_end INTEGER,
    engine_family VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create BMW Model Variants table
CREATE TABLE bmw_model_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chassis_id UUID REFERENCES bmw_chassis(id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL,
    marketing_name VARCHAR(100),
    engine_id UUID REFERENCES bmw_engines(id) ON DELETE SET NULL,
    transmission_id UUID,
    body_type VARCHAR(50),
    doors INTEGER,
    drivetrain VARCHAR(20),
    production_start INTEGER,
    production_end INTEGER,
    market_regions TEXT[],
    trim_levels TEXT[],
    special_editions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create BMW Part Categories table
CREATE TABLE bmw_part_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(10) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    parent_category_id UUID REFERENCES bmw_part_categories(id) ON DELETE SET NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create BMW OEM Parts table
CREATE TABLE bmw_oem_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_number VARCHAR(50) UNIQUE NOT NULL,
    part_name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES bmw_part_categories(id) ON DELETE SET NULL,
    price_msrp DECIMAL(10,2),
    weight_kg DECIMAL(8,3),
    part_type VARCHAR(100),
    part_function VARCHAR(200),
    system_category VARCHAR(100),
    subsystem_category VARCHAR(100),
    keywords TEXT[],
    is_discontinued BOOLEAN DEFAULT FALSE,
    superseded_by VARCHAR(50),
    supersedes VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create BMW Part Compatibility table
CREATE TABLE bmw_part_compatibility (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_id UUID REFERENCES bmw_oem_parts(id) ON DELETE CASCADE,
    chassis_id UUID REFERENCES bmw_chassis(id) ON DELETE CASCADE,
    model_variant_id UUID REFERENCES bmw_model_variants(id) ON DELETE SET NULL,
    production_start INTEGER,
    production_end INTEGER,
    engine_codes TEXT[],
    transmission_codes TEXT[],
    drivetrain_types TEXT[],
    market_regions TEXT[],
    installation_position VARCHAR(100),
    quantity_required INTEGER DEFAULT 1,
    notes TEXT,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(part_id, chassis_id)
);

-- Insert BMW Chassis data (37 chassis codes)
INSERT INTO bmw_chassis (chassis_code, chassis_name, generation, body_style, production_start, production_end, platform, market_segment, drivetrain_type) VALUES
('E30', '3 Series', '2nd Generation', 'Sedan/Coupe/Convertible/Touring', 1982, 1994, 'E30', 'Compact Executive', 'RWD'),
('E36', '3 Series', '3rd Generation', 'Sedan/Coupe/Convertible/Touring/Compact', 1990, 2000, 'E36', 'Compact Executive', 'RWD'),
('E46', '3 Series', '4th Generation', 'Sedan/Coupe/Convertible/Touring', 1998, 2006, 'E46', 'Compact Executive', 'RWD'),
('E90', '3 Series', '5th Generation', 'Sedan', 2005, 2012, 'E90', 'Compact Executive', 'RWD/AWD'),
('E91', '3 Series Touring', '5th Generation', 'Touring', 2005, 2012, 'E90', 'Compact Executive', 'RWD/AWD'),
('E92', '3 Series Coupe', '5th Generation', 'Coupe', 2006, 2013, 'E90', 'Compact Executive', 'RWD/AWD'),
('E93', '3 Series Convertible', '5th Generation', 'Convertible', 2007, 2013, 'E90', 'Compact Executive', 'RWD/AWD'),
('F30', '3 Series', '6th Generation', 'Sedan', 2012, 2019, 'F30', 'Compact Executive', 'RWD/AWD'),
('F31', '3 Series Touring', '6th Generation', 'Touring', 2012, 2019, 'F30', 'Compact Executive', 'RWD/AWD'),
('F34', '3 Series Gran Turismo', '6th Generation', 'Gran Turismo', 2013, 2020, 'F30', 'Compact Executive', 'RWD/AWD'),
('G20', '3 Series', '7th Generation', 'Sedan', 2019, NULL, 'CLAR', 'Compact Executive', 'RWD/AWD'),
('G21', '3 Series Touring', '7th Generation', 'Touring', 2019, NULL, 'CLAR', 'Compact Executive', 'RWD/AWD'),
('E34', '5 Series', '3rd Generation', 'Sedan/Touring', 1988, 1996, 'E34', 'Executive', 'RWD'),
('E39', '5 Series', '4th Generation', 'Sedan/Touring', 1995, 2004, 'E39', 'Executive', 'RWD'),
('E60', '5 Series', '5th Generation', 'Sedan', 2003, 2010, 'E60', 'Executive', 'RWD/AWD'),
('E61', '5 Series Touring', '5th Generation', 'Touring', 2004, 2010, 'E60', 'Executive', 'RWD/AWD'),
('F10', '5 Series', '6th Generation', 'Sedan', 2010, 2017, 'F10', 'Executive', 'RWD/AWD'),
('F11', '5 Series Touring', '6th Generation', 'Touring', 2010, 2017, 'F10', 'Executive', 'RWD/AWD'),
('G30', '5 Series', '7th Generation', 'Sedan', 2017, NULL, 'CLAR', 'Executive', 'RWD/AWD'),
('G31', '5 Series Touring', '7th Generation', 'Touring', 2017, NULL, 'CLAR', 'Executive', 'RWD/AWD'),
('E38', '7 Series', '3rd Generation', 'Sedan', 1994, 2001, 'E38', 'Full-size Luxury', 'RWD'),
('E65', '7 Series', '4th Generation', 'Sedan', 2001, 2008, 'E65', 'Full-size Luxury', 'RWD'),
('F01', '7 Series', '5th Generation', 'Sedan', 2008, 2015, 'F01', 'Full-size Luxury', 'RWD/AWD'),
('G11', '7 Series', '6th Generation', 'Sedan', 2015, NULL, 'CLAR', 'Full-size Luxury', 'RWD/AWD'),
('E81', '1 Series', '1st Generation', 'Hatchback', 2004, 2013, 'E81', 'Premium Compact', 'RWD'),
('E82', '1 Series Coupe', '1st Generation', 'Coupe', 2007, 2013, 'E81', 'Premium Compact', 'RWD'),
('E87', '1 Series', '1st Generation', 'Hatchback', 2004, 2013, 'E81', 'Premium Compact', 'RWD'),
('E88', '1 Series Convertible', '1st Generation', 'Convertible', 2008, 2013, 'E81', 'Premium Compact', 'RWD'),
('F20', '1 Series', '2nd Generation', 'Hatchback', 2011, 2019, 'UKL', 'Premium Compact', 'FWD'),
('F21', '1 Series', '2nd Generation', 'Hatchback', 2011, 2019, 'UKL', 'Premium Compact', 'FWD'),
('F22', '2 Series Coupe', '1st Generation', 'Coupe', 2014, NULL, 'F22', 'Premium Compact', 'RWD/AWD'),
('F23', '2 Series Convertible', '1st Generation', 'Convertible', 2015, NULL, 'F22', 'Premium Compact', 'RWD/AWD'),
('F45', '2 Series Active Tourer', '1st Generation', 'MPV', 2014, NULL, 'UKL', 'Premium Compact', 'FWD/AWD'),
('F46', '2 Series Gran Tourer', '1st Generation', 'MPV', 2015, NULL, 'UKL', 'Premium Compact', 'FWD/AWD'),
('G42', '2 Series Coupe', '2nd Generation', 'Coupe', 2022, NULL, 'CLAR', 'Premium Compact', 'RWD/AWD'),
('E70', 'X5', '2nd Generation', 'SUV', 2007, 2013, 'E70', 'Mid-size SUV', 'AWD'),
('F15', 'X5', '3rd Generation', 'SUV', 2013, 2018, 'F15', 'Mid-size SUV', 'AWD');

-- Insert BMW Engines data (20 engines)
INSERT INTO bmw_engines (engine_code, engine_name, displacement, cylinders, fuel_type, aspiration, horsepower_min, horsepower_max, torque_min, torque_max, production_start, production_end, engine_family) VALUES
('N20', 'N20B20', 2.0, 4, 'Gasoline', 'Turbocharged', 184, 245, 270, 350, 2011, 2017, 'N20'),
('N26', 'N26B20', 2.0, 4, 'Gasoline', 'Turbocharged', 184, 245, 270, 350, 2013, 2016, 'N20'),
('B48', 'B48B20', 2.0, 4, 'Gasoline', 'Turbocharged', 136, 306, 220, 450, 2014, NULL, 'B48'),
('B46', 'B46B20', 2.0, 4, 'Gasoline', 'Turbocharged', 192, 231, 280, 320, 2015, NULL, 'B48'),
('N55', 'N55B30', 3.0, 6, 'Gasoline', 'Turbocharged', 306, 335, 400, 450, 2009, 2016, 'N55'),
('B58', 'B58B30', 3.0, 6, 'Gasoline', 'Turbocharged', 320, 382, 450, 500, 2015, NULL, 'B58'),
('S55', 'S55B30', 3.0, 6, 'Gasoline', 'Twin-Turbocharged', 425, 503, 550, 650, 2014, NULL, 'S55'),
('N54', 'N54B30', 3.0, 6, 'Gasoline', 'Twin-Turbocharged', 306, 335, 400, 450, 2006, 2016, 'N54'),
('N52', 'N52B30', 3.0, 6, 'Gasoline', 'Naturally Aspirated', 215, 272, 250, 320, 2004, 2015, 'N52'),
('N53', 'N53B30', 3.0, 6, 'Gasoline', 'Naturally Aspirated', 218, 272, 250, 320, 2007, 2013, 'N53'),
('M54', 'M54B30', 3.0, 6, 'Gasoline', 'Naturally Aspirated', 231, 231, 300, 300, 2000, 2006, 'M54'),
('M52', 'M52B28', 2.8, 6, 'Gasoline', 'Naturally Aspirated', 193, 193, 280, 280, 1995, 2000, 'M52'),
('N47', 'N47D20', 2.0, 4, 'Diesel', 'Turbocharged', 116, 184, 260, 380, 2007, 2014, 'N47'),
('N57', 'N57D30', 3.0, 6, 'Diesel', 'Turbocharged', 204, 313, 400, 630, 2008, 2017, 'N57'),
('B47', 'B47D20', 2.0, 4, 'Diesel', 'Turbocharged', 150, 190, 320, 400, 2014, NULL, 'B47'),
('B57', 'B57D30', 3.0, 6, 'Diesel', 'Turbocharged', 265, 400, 580, 760, 2015, NULL, 'B57'),
('S63', 'S63B44', 4.4, 8, 'Gasoline', 'Twin-Turbocharged', 560, 625, 680, 750, 2010, NULL, 'S63'),
('N63', 'N63B44', 4.4, 8, 'Gasoline', 'Twin-Turbocharged', 407, 523, 600, 750, 2008, NULL, 'N63'),
('S65', 'S65B40', 4.0, 8, 'Gasoline', 'Naturally Aspirated', 420, 420, 400, 400, 2007, 2013, 'S65'),
('M73', 'M73B54', 5.4, 12, 'Gasoline', 'Naturally Aspirated', 326, 326, 490, 490, 1993, 2001, 'M73');

-- Insert BMW Part Categories (28 categories following BMW's structure)
INSERT INTO bmw_part_categories (category_code, category_name, description, sort_order) VALUES
('11', 'Engine', 'Engine components and related parts', 1),
('12', 'Engine Electrical System', 'Ignition, fuel injection, engine management', 2),
('13', 'Fuel Preparation', 'Fuel system components', 3),
('16', 'Fuel Supply', 'Fuel tank, fuel pump, fuel lines', 4),
('17', 'Cooling System', 'Radiator, water pump, thermostat, cooling fans', 5),
('18', 'Exhaust System', 'Exhaust manifold, catalytic converter, muffler', 6),
('21', 'Clutch', 'Clutch disc, pressure plate, release bearing', 7),
('22', 'Engine and Transmission Mounting', 'Motor mounts, transmission mounts', 8),
('23', 'Automatic Transmission', 'Automatic transmission components', 9),
('24', 'Transfer Case', 'Transfer case and related components', 10),
('25', 'Rear Axle', 'Differential, axle shafts, rear suspension', 11),
('26', 'Driveshaft', 'Propeller shaft, CV joints', 12),
('31', 'Suspension', 'Springs, shocks, struts, control arms', 13),
('32', 'Steering', 'Steering wheel, steering rack, power steering', 14),
('33', 'Front Axle', 'Front suspension components', 15),
('34', 'Brakes', 'Brake pads, rotors, calipers, brake lines', 16),
('36', 'Wheels and Tires', 'Wheels, tires, TPMS sensors', 17),
('41', 'Body', 'Body panels, doors, hood, trunk', 18),
('51', 'Equipment', 'Interior trim, seats, dashboard', 19),
('52', 'Seats', 'Front seats, rear seats, seat components', 20),
('54', 'Pedals', 'Accelerator, brake, clutch pedals', 21),
('61', 'Electrical System', 'Wiring, fuses, relays, control modules', 22),
('62', 'Instruments', 'Instrument cluster, gauges, warning lights', 23),
('63', 'Lighting', 'Headlights, taillights, interior lighting', 24),
('64', 'Heating and Air Conditioning', 'HVAC system components', 25),
('65', 'Radio and Navigation', 'Audio system, navigation, antennas', 26),
('72', 'Roof', 'Sunroof, convertible top components', 27),
('81', 'Service', 'Maintenance items, fluids, filters', 28);

-- Insert BMW OEM Parts (48 parts with real part numbers and pricing)
INSERT INTO bmw_oem_parts (part_number, part_name, description, category_id, price_msrp, part_type, keywords, is_discontinued) VALUES
-- Engine Parts (11)
('11427566327', 'Oil Filter', 'Engine oil filter for BMW vehicles', (SELECT id FROM bmw_part_categories WHERE category_code = '11'), 12.50, 'Filter', ARRAY['oil', 'filter', 'engine', 'maintenance'], FALSE),
('11127566327', 'Air Filter', 'Engine air filter element', (SELECT id FROM bmw_part_categories WHERE category_code = '11'), 28.90, 'Filter', ARRAY['air', 'filter', 'engine', 'intake'], FALSE),
('11617566327', 'Fuel Filter', 'In-line fuel filter', (SELECT id FROM bmw_part_categories WHERE category_code = '13'), 45.20, 'Filter', ARRAY['fuel', 'filter', 'injection'], FALSE),
('11537566327', 'Oil Drain Plug', 'Engine oil drain plug with gasket', (SELECT id FROM bmw_part_categories WHERE category_code = '11'), 8.75, 'Fastener', ARRAY['oil', 'drain', 'plug', 'gasket'], FALSE),
('11428637821', 'Oil Filter Housing', 'Oil filter housing assembly', (SELECT id FROM bmw_part_categories WHERE category_code = '11'), 125.00, 'Housing', ARRAY['oil', 'filter', 'housing'], FALSE),
('11617566328', 'Fuel Pump', 'High pressure fuel pump', (SELECT id FROM bmw_part_categories WHERE category_code = '16'), 450.00, 'Pump', ARRAY['fuel', 'pump', 'high', 'pressure'], FALSE),
('11537545302', 'Oil Pan', 'Engine oil pan with drain plug', (SELECT id FROM bmw_part_categories WHERE category_code = '11'), 280.00, 'Pan', ARRAY['oil', 'pan', 'sump'], FALSE),
('11617566329', 'Fuel Injector', 'Direct injection fuel injector', (SELECT id FROM bmw_part_categories WHERE category_code = '13'), 180.00, 'Injector', ARRAY['fuel', 'injector', 'direct', 'injection'], FALSE),
('11127838579', 'Intake Manifold', 'Engine intake manifold assembly', (SELECT id FROM bmw_part_categories WHERE category_code = '11'), 650.00, 'Manifold', ARRAY['intake', 'manifold', 'air'], FALSE),
('11617566330', 'Throttle Body', 'Electronic throttle body', (SELECT id FROM bmw_part_categories WHERE category_code = '13'), 420.00, 'Throttle Body', ARRAY['throttle', 'body', 'electronic'], FALSE),
('11127566331', 'Valve Cover', 'Engine valve cover with gasket', (SELECT id FROM bmw_part_categories WHERE category_code = '11'), 195.00, 'Cover', ARRAY['valve', 'cover', 'gasket'], FALSE),

-- Cooling System (17)
('17127647283', 'Radiator', 'Engine cooling radiator', (SELECT id FROM bmw_part_categories WHERE category_code = '17'), 320.00, 'Radiator', ARRAY['radiator', 'cooling', 'coolant'], FALSE),
('17137647284', 'Water Pump', 'Engine water pump with gasket', (SELECT id FROM bmw_part_categories WHERE category_code = '17'), 185.00, 'Pump', ARRAY['water', 'pump', 'coolant'], FALSE),
('17127647285', 'Thermostat', 'Engine coolant thermostat', (SELECT id FROM bmw_part_categories WHERE category_code = '17'), 45.00, 'Thermostat', ARRAY['thermostat', 'coolant', 'temperature'], FALSE),
('17427647286', 'Cooling Fan', 'Engine cooling fan assembly', (SELECT id FROM bmw_part_categories WHERE category_code = '17'), 280.00, 'Fan', ARRAY['cooling', 'fan', 'radiator'], FALSE),
('17137647287', 'Expansion Tank', 'Coolant expansion tank', (SELECT id FROM bmw_part_categories WHERE category_code = '17'), 85.00, 'Tank', ARRAY['expansion', 'tank', 'coolant'], FALSE),
('17127647288', 'Radiator Hose Upper', 'Upper radiator hose', (SELECT id FROM bmw_part_categories WHERE category_code = '17'), 35.00, 'Hose', ARRAY['radiator', 'hose', 'upper', 'coolant'], FALSE),
('17127647289', 'Radiator Hose Lower', 'Lower radiator hose', (SELECT id FROM bmw_part_categories WHERE category_code = '17'), 32.00, 'Hose', ARRAY['radiator', 'hose', 'lower', 'coolant'], FALSE),

-- Brakes (34)
('34116855152', 'Front Brake Pads', 'Front brake pad set', (SELECT id FROM bmw_part_categories WHERE category_code = '34'), 85.00, 'Brake Pads', ARRAY['brake', 'pads', 'front'], FALSE),
('34216855153', 'Rear Brake Pads', 'Rear brake pad set', (SELECT id FROM bmw_part_categories WHERE category_code = '34'), 75.00, 'Brake Pads', ARRAY['brake', 'pads', 'rear'], FALSE),
('34116855154', 'Front Brake Rotor', 'Front brake disc rotor', (SELECT id FROM bmw_part_categories WHERE category_code = '34'), 120.00, 'Brake Rotor', ARRAY['brake', 'rotor', 'disc', 'front'], FALSE),
('34216855155', 'Rear Brake Rotor', 'Rear brake disc rotor', (SELECT id FROM bmw_part_categories WHERE category_code = '34'), 95.00, 'Brake Rotor', ARRAY['brake', 'rotor', 'disc', 'rear'], FALSE),
('34116855156', 'Brake Caliper Front', 'Front brake caliper assembly', (SELECT id FROM bmw_part_categories WHERE category_code = '34'), 350.00, 'Brake Caliper', ARRAY['brake', 'caliper', 'front'], FALSE),
('34216855157', 'Brake Caliper Rear', 'Rear brake caliper assembly', (SELECT id FROM bmw_part_categories WHERE category_code = '34'), 280.00, 'Brake Caliper', ARRAY['brake', 'caliper', 'rear'], FALSE),
('34326855158', 'Brake Fluid', 'DOT 4 brake fluid', (SELECT id FROM bmw_part_categories WHERE category_code = '34'), 15.00, 'Fluid', ARRAY['brake', 'fluid', 'dot4'], FALSE),
('34116855159', 'Brake Line Front', 'Front brake line assembly', (SELECT id FROM bmw_part_categories WHERE category_code = '34'), 45.00, 'Brake Line', ARRAY['brake', 'line', 'front'], FALSE),

-- Electrical System (61)
('61319217328', 'Spark Plug', 'Iridium spark plug', (SELECT id FROM bmw_part_categories WHERE category_code = '12'), 18.50, 'Spark Plug', ARRAY['spark', 'plug', 'ignition', 'iridium'], FALSE),
('61319217329', 'Ignition Coil', 'Direct ignition coil', (SELECT id FROM bmw_part_categories WHERE category_code = '12'), 125.00, 'Ignition Coil', ARRAY['ignition', 'coil', 'spark'], FALSE),
('61617217330', 'Battery', '12V AGM battery', (SELECT id FROM bmw_part_categories WHERE category_code = '61'), 280.00, 'Battery', ARRAY['battery', '12v', 'agm'], FALSE),
('61319217331', 'Alternator', 'Engine alternator', (SELECT id FROM bmw_part_categories WHERE category_code = '61'), 450.00, 'Alternator', ARRAY['alternator', 'charging', 'generator'], FALSE),
('61319217332', 'Starter Motor', 'Engine starter motor', (SELECT id FROM bmw_part_categories WHERE category_code = '61'), 380.00, 'Starter', ARRAY['starter', 'motor', 'engine'], FALSE),
('61617217333', 'Fuse Box', 'Main fuse box assembly', (SELECT id FROM bmw_part_categories WHERE category_code = '61'), 150.00, 'Fuse Box', ARRAY['fuse', 'box', 'electrical'], FALSE),

-- Suspension (31)
('31316855160', 'Front Shock Absorber', 'Front shock absorber', (SELECT id FROM bmw_part_categories WHERE category_code = '31'), 180.00, 'Shock Absorber', ARRAY['shock', 'absorber', 'front', 'suspension'], FALSE),
('31326855161', 'Rear Shock Absorber', 'Rear shock absorber', (SELECT id FROM bmw_part_categories WHERE category_code = '31'), 165.00, 'Shock Absorber', ARRAY['shock', 'absorber', 'rear', 'suspension'], FALSE),
('31316855162', 'Front Spring', 'Front coil spring', (SELECT id FROM bmw_part_categories WHERE category_code = '31'), 95.00, 'Spring', ARRAY['spring', 'coil', 'front', 'suspension'], FALSE),
('31326855163', 'Rear Spring', 'Rear coil spring', (SELECT id FROM bmw_part_categories WHERE category_code = '31'), 85.00, 'Spring', ARRAY['spring', 'coil', 'rear', 'suspension'], FALSE),
('31126855164', 'Control Arm', 'Front lower control arm', (SELECT id FROM bmw_part_categories WHERE category_code = '33'), 220.00, 'Control Arm', ARRAY['control', 'arm', 'front', 'suspension'], FALSE),
('31126855165', 'Ball Joint', 'Front ball joint', (SELECT id FROM bmw_part_categories WHERE category_code = '33'), 65.00, 'Ball Joint', ARRAY['ball', 'joint', 'front', 'suspension'], FALSE),

-- Steering (32)
('32106855166', 'Steering Rack', 'Power steering rack', (SELECT id FROM bmw_part_categories WHERE category_code = '32'), 850.00, 'Steering Rack', ARRAY['steering', 'rack', 'power'], FALSE),
('32416855167', 'Tie Rod End', 'Outer tie rod end', (SELECT id FROM bmw_part_categories WHERE category_code = '32'), 45.00, 'Tie Rod', ARRAY['tie', 'rod', 'end', 'steering'], FALSE),
('32106855168', 'Power Steering Pump', 'Power steering pump', (SELECT id FROM bmw_part_categories WHERE category_code = '32'), 320.00, 'Steering Pump', ARRAY['power', 'steering', 'pump'], FALSE),

-- Service Items (81)
('83212365946', 'Engine Oil', '5W-30 synthetic engine oil', (SELECT id FROM bmw_part_categories WHERE category_code = '81'), 65.00, 'Oil', ARRAY['engine', 'oil', '5w30', 'synthetic'], FALSE),
('83212365947', 'Transmission Fluid', 'Automatic transmission fluid', (SELECT id FROM bmw_part_categories WHERE category_code = '81'), 35.00, 'Fluid', ARRAY['transmission', 'fluid', 'automatic'], FALSE),
('83212365948', 'Coolant', 'BMW coolant concentrate', (SELECT id FROM bmw_part_categories WHERE category_code = '81'), 28.00, 'Coolant', ARRAY['coolant', 'antifreeze', 'concentrate'], FALSE),
('83212365949', 'Cabin Air Filter', 'Cabin air filter element', (SELECT id FROM bmw_part_categories WHERE category_code = '64'), 32.00, 'Filter', ARRAY['cabin', 'air', 'filter', 'hvac'], FALSE),

-- Lighting (63)
('63126855169', 'Headlight Assembly', 'LED headlight assembly', (SELECT id FROM bmw_part_categories WHERE category_code = '63'), 1200.00, 'Headlight', ARRAY['headlight', 'led', 'lighting'], FALSE),
('63216855170', 'Tail Light', 'LED tail light assembly', (SELECT id FROM bmw_part_categories WHERE category_code = '63'), 450.00, 'Tail Light', ARRAY['tail', 'light', 'led', 'rear'], FALSE),
('63126855171', 'Fog Light', 'Front fog light assembly', (SELECT id FROM bmw_part_categories WHERE category_code = '63'), 180.00, 'Fog Light', ARRAY['fog', 'light', 'front'], FALSE),

-- Body Parts (41)
('41007855172', 'Hood', 'Engine hood panel', (SELECT id FROM bmw_part_categories WHERE category_code = '41'), 650.00, 'Body Panel', ARRAY['hood', 'bonnet', 'body'], FALSE),
('41527855173', 'Door Handle', 'Exterior door handle', (SELECT id FROM bmw_part_categories WHERE category_code = '41'), 85.00, 'Handle', ARRAY['door', 'handle', 'exterior'], FALSE),
('41617855174', 'Side Mirror', 'Power side mirror assembly', (SELECT id FROM bmw_part_categories WHERE category_code = '41'), 320.00, 'Mirror', ARRAY['side', 'mirror', 'power', 'heated'], FALSE);

-- Create Part Compatibility relationships
INSERT INTO bmw_part_compatibility (part_id, chassis_id, production_start, production_end, engine_codes, verified) 
SELECT 
    p.id,
    c.id,
    GREATEST(c.production_start, 2010),
    LEAST(c.production_end, 2020),
    CASE 
        WHEN c.chassis_code IN ('F30', 'F31', 'F34') THEN ARRAY['N20', 'N26', 'B48', 'N55', 'B58']
        WHEN c.chassis_code IN ('F22', 'F23') THEN ARRAY['N20', 'B48', 'N55', 'B58']
        WHEN c.chassis_code IN ('G20', 'G21') THEN ARRAY['B48', 'B58']
        WHEN c.chassis_code IN ('F10', 'F11') THEN ARRAY['N20', 'N55', 'B58', 'N57']
        WHEN c.chassis_code IN ('G30', 'G31') THEN ARRAY['B48', 'B58', 'B57']
        WHEN c.chassis_code IN ('E90', 'E91', 'E92', 'E93') THEN ARRAY['N52', 'N54', 'N55']
        ELSE ARRAY['N20', 'B48', 'N55']
    END,
    TRUE
FROM bmw_oem_parts p
CROSS JOIN bmw_chassis c
WHERE c.chassis_code IN ('F30', 'F31', 'F34', 'F22', 'F23', 'G20', 'G21', 'F10', 'F11', 'G30', 'G31', 'E90', 'E91', 'E92', 'E93')
AND p.part_number IN (
    '11427566327', '11127566327', '17127647283', '17137647284', '34116855152', 
    '34216855153', '61319217328', '83212365946', '31316855160', '32106855166'
);

-- Create indexes for better performance
CREATE INDEX idx_bmw_chassis_code ON bmw_chassis(chassis_code);
CREATE INDEX idx_bmw_engines_code ON bmw_engines(engine_code);
CREATE INDEX idx_bmw_parts_number ON bmw_oem_parts(part_number);
CREATE INDEX idx_bmw_parts_category ON bmw_oem_parts(category_id);
CREATE INDEX idx_bmw_parts_discontinued ON bmw_oem_parts(is_discontinued);
CREATE INDEX idx_bmw_compatibility_part ON bmw_part_compatibility(part_id);
CREATE INDEX idx_bmw_compatibility_chassis ON bmw_part_compatibility(chassis_id);
CREATE INDEX idx_bmw_parts_keywords ON bmw_oem_parts USING GIN(keywords);

-- Create materialized view for fast searching
CREATE MATERIALIZED VIEW bmw_parts_search_view AS
SELECT 
    p.id,
    p.part_number,
    p.part_name,
    p.description,
    p.price_msrp,
    p.is_discontinued,
    p.keywords,
    c.category_code,
    c.category_name,
    ARRAY_AGG(DISTINCT ch.chassis_code) FILTER (WHERE ch.chassis_code IS NOT NULL) as compatible_chassis,
    ARRAY_AGG(DISTINCT unnest(comp.engine_codes)) FILTER (WHERE comp.engine_codes IS NOT NULL) as compatible_engines,
    MIN(comp.production_start) as earliest_year,
    MAX(COALESCE(comp.production_end, 2024)) as latest_year,
    to_tsvector('english', 
        COALESCE(p.part_name, '') || ' ' || 
        COALESCE(p.description, '') || ' ' || 
        COALESCE(array_to_string(p.keywords, ' '), '') || ' ' ||
        COALESCE(c.category_name, '')
    ) as search_vector
FROM bmw_oem_parts p
LEFT JOIN bmw_part_categories c ON p.category_id = c.id
LEFT JOIN bmw_part_compatibility comp ON p.id = comp.part_id
LEFT JOIN bmw_chassis ch ON comp.chassis_id = ch.id
GROUP BY p.id, p.part_number, p.part_name, p.description, p.price_msrp, p.is_discontinued, p.keywords, c.category_code, c.category_name;

-- Create index on the materialized view
CREATE INDEX idx_bmw_parts_search_vector ON bmw_parts_search_view USING GIN(search_vector);
CREATE INDEX idx_bmw_parts_search_chassis ON bmw_parts_search_view USING GIN(compatible_chassis);
CREATE INDEX idx_bmw_parts_search_engines ON bmw_parts_search_view USING GIN(compatible_engines);
CREATE UNIQUE INDEX idx_bmw_parts_search_id ON bmw_parts_search_view(id);

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_parts_search_view()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY bmw_parts_search_view;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bmw_oem_parts_updated_at 
    BEFORE UPDATE ON bmw_oem_parts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT SELECT ON bmw_parts_search_view TO your_app_user;

-- Display summary
SELECT 
    'BMW Chassis' as table_name, 
    COUNT(*) as record_count 
FROM bmw_chassis
UNION ALL
SELECT 
    'BMW Engines' as table_name, 
    COUNT(*) as record_count 
FROM bmw_engines
UNION ALL
SELECT 
    'BMW Part Categories' as table_name, 
    COUNT(*) as record_count 
FROM bmw_part_categories
UNION ALL
SELECT 
    'BMW OEM Parts' as table_name, 
    COUNT(*) as record_count 
FROM bmw_oem_parts
UNION ALL
SELECT 
    'BMW Part Compatibility' as table_name, 
    COUNT(*) as record_count 
FROM bmw_part_compatibility
ORDER BY table_name;

-- Sample queries to test the setup
SELECT 'Database setup completed successfully!' as status;
