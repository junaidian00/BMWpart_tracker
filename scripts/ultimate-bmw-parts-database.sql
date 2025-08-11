-- Ultimate BMW Parts Database Schema
-- Comprehensive system for every BMW part from every chassis (1970-2024)

-- Drop existing tables if they exist
DROP TABLE IF EXISTS bmw_part_compatibility CASCADE;
DROP TABLE IF EXISTS bmw_oem_parts CASCADE;
DROP TABLE IF EXISTS bmw_part_categories CASCADE;
DROP TABLE IF EXISTS bmw_model_variants CASCADE;
DROP TABLE IF EXISTS bmw_chassis CASCADE;
DROP TABLE IF EXISTS bmw_engines CASCADE;
DROP TABLE IF EXISTS bmw_transmissions CASCADE;
DROP TABLE IF EXISTS bmw_production_years CASCADE;
DROP TABLE IF EXISTS scraping_progress CASCADE;

-- Production Years Table
CREATE TABLE bmw_production_years (
    id SERIAL PRIMARY KEY,
    year INTEGER UNIQUE NOT NULL,
    model_count INTEGER DEFAULT 0,
    chassis_introduced TEXT[],
    chassis_discontinued TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- BMW Chassis Table (Complete E, F, G, U series)
CREATE TABLE bmw_chassis (
    id SERIAL PRIMARY KEY,
    chassis_code VARCHAR(10) UNIQUE NOT NULL,
    chassis_name VARCHAR(100) NOT NULL,
    generation VARCHAR(50) NOT NULL,
    body_style VARCHAR(50),
    production_start INTEGER NOT NULL,
    production_end INTEGER,
    platform VARCHAR(50),
    market_segment VARCHAR(50),
    drivetrain_type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- BMW Engines Table (Every engine code)
CREATE TABLE bmw_engines (
    id SERIAL PRIMARY KEY,
    engine_code VARCHAR(20) UNIQUE NOT NULL,
    engine_name VARCHAR(100),
    displacement DECIMAL(3,1),
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
    created_at TIMESTAMP DEFAULT NOW()
);

-- BMW Transmissions Table
CREATE TABLE bmw_transmissions (
    id SERIAL PRIMARY KEY,
    transmission_code VARCHAR(20) UNIQUE NOT NULL,
    transmission_name VARCHAR(100),
    transmission_type VARCHAR(20), -- Manual, Automatic, DCT
    gear_count INTEGER,
    manufacturer VARCHAR(50),
    production_start INTEGER,
    production_end INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- BMW Model Variants Table (Specific models with engines)
CREATE TABLE bmw_model_variants (
    id SERIAL PRIMARY KEY,
    chassis_id INTEGER REFERENCES bmw_chassis(id),
    model_name VARCHAR(100) NOT NULL,
    marketing_name VARCHAR(100),
    engine_id INTEGER REFERENCES bmw_engines(id),
    transmission_id INTEGER REFERENCES bmw_transmissions(id),
    body_type VARCHAR(50),
    doors INTEGER,
    drivetrain VARCHAR(20), -- RWD, AWD, FWD
    production_start INTEGER,
    production_end INTEGER,
    market_regions TEXT[],
    trim_levels TEXT[],
    special_editions TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ultimate Part Categories (Every RealOEM category)
CREATE TABLE bmw_part_categories (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(10) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    parent_category_id INTEGER REFERENCES bmw_part_categories(id),
    realoem_code VARCHAR(10),
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ultimate BMW OEM Parts Table
CREATE TABLE bmw_oem_parts (
    id SERIAL PRIMARY KEY,
    part_number VARCHAR(50) UNIQUE NOT NULL,
    part_name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES bmw_part_categories(id),
    
    -- Pricing
    price_msrp DECIMAL(10,2),
    price_dealer DECIMAL(10,2),
    price_wholesale DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Physical Properties
    weight_kg DECIMAL(8,3),
    dimensions_length_mm INTEGER,
    dimensions_width_mm INTEGER,
    dimensions_height_mm INTEGER,
    material VARCHAR(100),
    color VARCHAR(50),
    
    -- Technical Details
    part_type VARCHAR(100),
    part_function TEXT,
    installation_notes TEXT,
    torque_specs TEXT,
    special_tools TEXT,
    
    -- RealOEM Data
    diagram_position VARCHAR(20),
    diagram_coordinates VARCHAR(50),
    realoem_diagram_url TEXT,
    realoem_section VARCHAR(100),
    
    -- Classification
    system_category VARCHAR(100),
    subsystem_category VARCHAR(100),
    component_level INTEGER DEFAULT 1,
    criticality_level VARCHAR(20) DEFAULT 'Standard',
    
    -- Maintenance
    service_interval_km INTEGER,
    service_interval_months INTEGER,
    wear_item BOOLEAN DEFAULT false,
    consumable_item BOOLEAN DEFAULT false,
    
    -- Search & Discovery
    keywords TEXT[],
    search_terms TEXT[],
    popular_searches TEXT[],
    
    -- Status
    discontinued BOOLEAN DEFAULT false,
    superseded_by VARCHAR(50),
    supersedes VARCHAR(50),
    availability_status VARCHAR(50) DEFAULT 'Available',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    scraped_at TIMESTAMP,
    verified_at TIMESTAMP
);

-- Ultimate Part Compatibility Matrix
CREATE TABLE bmw_part_compatibility (
    id SERIAL PRIMARY KEY,
    part_id INTEGER REFERENCES bmw_oem_parts(id),
    chassis_id INTEGER REFERENCES bmw_chassis(id),
    model_variant_id INTEGER REFERENCES bmw_model_variants(id),
    
    -- Production Period
    production_start INTEGER,
    production_end INTEGER,
    model_year_start INTEGER,
    model_year_end INTEGER,
    
    -- Engine Compatibility
    engine_codes TEXT[],
    transmission_codes TEXT[],
    drivetrain_types TEXT[],
    
    -- Regional Compatibility
    market_regions TEXT[],
    vin_ranges TEXT[],
    
    -- Installation Details
    installation_position VARCHAR(100),
    quantity_required INTEGER DEFAULT 1,
    installation_time_minutes INTEGER,
    difficulty_level VARCHAR(20),
    
    -- Compatibility Notes
    notes TEXT,
    restrictions TEXT,
    special_requirements TEXT,
    
    -- Verification
    verified BOOLEAN DEFAULT false,
    verified_by VARCHAR(100),
    verified_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(part_id, chassis_id, installation_position)
);

-- Scraping Progress Tracking
CREATE TABLE scraping_progress (
    id SERIAL PRIMARY KEY,
    scraping_session_id UUID DEFAULT gen_random_uuid(),
    chassis_code VARCHAR(10),
    model_variant VARCHAR(100),
    category_code VARCHAR(10),
    section_name VARCHAR(100),
    
    -- Progress Metrics
    parts_found INTEGER DEFAULT 0,
    parts_processed INTEGER DEFAULT 0,
    parts_saved INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Error Tracking
    last_error TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Performance
    processing_time_seconds INTEGER,
    pages_scraped INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_bmw_oem_parts_part_number ON bmw_oem_parts(part_number);
CREATE INDEX idx_bmw_oem_parts_category ON bmw_oem_parts(category_id);
CREATE INDEX idx_bmw_oem_parts_keywords ON bmw_oem_parts USING GIN(keywords);
CREATE INDEX idx_bmw_oem_parts_search_terms ON bmw_oem_parts USING GIN(search_terms);
CREATE INDEX idx_bmw_part_compatibility_part ON bmw_part_compatibility(part_id);
CREATE INDEX idx_bmw_part_compatibility_chassis ON bmw_part_compatibility(chassis_id);
CREATE INDEX idx_bmw_part_compatibility_engines ON bmw_part_compatibility USING GIN(engine_codes);
CREATE INDEX idx_bmw_chassis_code ON bmw_chassis(chassis_code);
CREATE INDEX idx_bmw_model_variants_chassis ON bmw_model_variants(chassis_id);
CREATE INDEX idx_scraping_progress_session ON scraping_progress(scraping_session_id);
CREATE INDEX idx_scraping_progress_status ON scraping_progress(status);

-- Insert Production Years (1970-2024)
INSERT INTO bmw_production_years (year) 
SELECT generate_series(1970, 2024);

-- Insert Ultimate BMW Chassis Codes (Every E, F, G, U series)
INSERT INTO bmw_chassis (chassis_code, chassis_name, generation, production_start, production_end, platform, market_segment) VALUES
-- E-Series (1970s-2010s)
('E3', '2500, 2800, 3.0S, 3.3L', '1st Gen 5-Series', 1972, 1977, 'E3', 'Executive'),
('E9', '2800 CS, 3.0 CS, 3.0 CSL', 'Classic Coupe', 1968, 1975, 'E9', 'Grand Tourer'),
('E10', '2002, 2002 Turbo', 'Classic 2002', 1966, 1977, 'E10', 'Compact'),
('E12', '518, 520, 525, 528, M535i', '2nd Gen 5-Series', 1972, 1981, 'E12', 'Executive'),
('E21', '316, 318, 320, 323i', '1st Gen 3-Series', 1975, 1983, 'E21', 'Compact Executive'),
('E23', '728, 732i, 735i, 745i', '1st Gen 7-Series', 1977, 1987, 'E23', 'Full-Size Luxury'),
('E24', '630 CS, 633 CSi, 635 CSi, M6', '1st Gen 6-Series', 1976, 1989, 'E24', 'Grand Tourer'),
('E28', '518i, 520i, 525i, 528i, 535i, M5', '3rd Gen 5-Series', 1981, 1988, 'E28', 'Executive'),
('E30', '316i, 318i, 320i, 325i, M3', '2nd Gen 3-Series', 1982, 1994, 'E30', 'Compact Executive'),
('E31', '840Ci, 850i, 850CSi', '1st Gen 8-Series', 1989, 1999, 'E31', 'Grand Tourer'),
('E32', '730i, 735i, 740i, 750i', '2nd Gen 7-Series', 1986, 1994, 'E32', 'Full-Size Luxury'),
('E34', '518i, 520i, 525i, 530i, 535i, 540i, M5', '4th Gen 5-Series', 1987, 1996, 'E34', 'Executive'),
('E36', '316i, 318i, 320i, 323i, 325i, 328i, M3', '3rd Gen 3-Series', 1990, 2000, 'E36', 'Compact Executive'),
('E38', '728i, 730i, 735i, 740i, 750i', '3rd Gen 7-Series', 1994, 2001, 'E38', 'Full-Size Luxury'),
('E39', '520i, 523i, 525i, 528i, 530i, 535i, 540i, M5', '5th Gen 5-Series', 1995, 2004, 'E39', 'Executive'),
('E46', '316i, 318i, 320i, 323i, 325i, 328i, 330i, M3', '4th Gen 3-Series', 1998, 2007, 'E46', 'Compact Executive'),
('E52', 'Z8', 'Z8 Roadster', 1999, 2003, 'E52', 'Sports Car'),
('E53', 'X5 3.0i, 4.4i, 4.6is, 4.8is', '1st Gen X5', 1999, 2006, 'E53', 'Mid-Size SUV'),
('E60', '520i, 523i, 525i, 530i, 535i, 540i, 545i, 550i, M5', '6th Gen 5-Series', 2003, 2010, 'E60', 'Executive'),
('E61', '520i, 525i, 530i, 535i, 550i Touring', '6th Gen 5-Series Touring', 2004, 2010, 'E61', 'Executive Estate'),
('E63', '630i, 645Ci, 650i, M6', '2nd Gen 6-Series Coupe', 2003, 2010, 'E63', 'Grand Tourer'),
('E64', '630i, 645Ci, 650i, M6 Convertible', '2nd Gen 6-Series Convertible', 2004, 2010, 'E64', 'Grand Tourer'),
('E65', '730i, 735i, 740i, 745i, 750i, 760i', '4th Gen 7-Series', 2001, 2008, 'E65', 'Full-Size Luxury'),
('E66', '730Li, 735Li, 740Li, 745Li, 750Li, 760Li', '4th Gen 7-Series LWB', 2001, 2008, 'E66', 'Full-Size Luxury'),
('E70', 'X5 xDrive30i, xDrive35i, xDrive48i, xDrive50i, M', '2nd Gen X5', 2006, 2013, 'E70', 'Mid-Size SUV'),
('E71', 'X6 xDrive35i, xDrive50i, M', '1st Gen X6', 2007, 2014, 'E71', 'Sports Activity Coupe'),
('E81', '116i, 118i, 120i, 123d, 130i', '1st Gen 1-Series 5-Door', 2004, 2012, 'E81', 'Premium Compact'),
('E82', '120i, 125i, 128i, 135i, M Coupe', '1st Gen 1-Series Coupe', 2007, 2013, 'E82', 'Premium Compact'),
('E84', 'X1 sDrive18i, xDrive20i, xDrive25i, xDrive28i', '1st Gen X1', 2009, 2015, 'E84', 'Compact SUV'),
('E85', 'Z4 2.5i, 3.0i, 3.0si, M Roadster', '1st Gen Z4', 2002, 2008, 'E85', 'Sports Car'),
('E86', 'Z4 M Coupe', '1st Gen Z4 Coupe', 2006, 2008, 'E86', 'Sports Car'),
('E87', '116i, 118i, 120i, 123d, 130i, 135i', '1st Gen 1-Series 5-Door', 2004, 2013, 'E87', 'Premium Compact'),
('E88', '120i, 125i, 128i, 135i Convertible', '1st Gen 1-Series Convertible', 2008, 2013, 'E88', 'Premium Compact'),
('E89', 'Z4 sDrive23i, sDrive28i, sDrive30i, sDrive35i, sDrive35is', '2nd Gen Z4', 2009, 2016, 'E89', 'Sports Car'),
('E90', '316i, 318i, 320i, 323i, 325i, 328i, 330i, 335i, M3', '5th Gen 3-Series Sedan', 2005, 2012, 'E90', 'Compact Executive'),
('E91', '318i, 320i, 325i, 328i, 330i, 335i Touring', '5th Gen 3-Series Touring', 2005, 2012, 'E91', 'Compact Executive'),
('E92', '320i, 325i, 328i, 330i, 335i, M3 Coupe', '5th Gen 3-Series Coupe', 2006, 2013, 'E92', 'Compact Executive'),
('E93', '320i, 325i, 328i, 330i, 335i, M3 Convertible', '5th Gen 3-Series Convertible', 2007, 2013, 'E93', 'Compact Executive'),

-- F-Series (2010s-2020s)
('F01', '730i, 735i, 740i, 750i, 760i', '5th Gen 7-Series', 2008, 2015, 'F01', 'Full-Size Luxury'),
('F02', '730Li, 740Li, 750Li, 760Li', '5th Gen 7-Series LWB', 2008, 2015, 'F02', 'Full-Size Luxury'),
('F06', '640i, 650i, M6 Gran Coupe', '3rd Gen 6-Series Gran Coupe', 2012, 2019, 'F06', 'Grand Tourer'),
('F07', '535i, 550i, 535i GT, 550i GT', '5-Series Gran Turismo', 2009, 2017, 'F07', 'Executive GT'),
('F10', '520i, 523i, 525i, 528i, 530i, 535i, 550i, M5', '7th Gen 5-Series', 2010, 2017, 'F10', 'Executive'),
('F11', '520i, 525i, 528i, 530i, 535i, 550i Touring', '7th Gen 5-Series Touring', 2010, 2017, 'F11', 'Executive Estate'),
('F12', '640i, 650i, M6 Convertible', '3rd Gen 6-Series Convertible', 2011, 2018, 'F12', 'Grand Tourer'),
('F13', '640i, 650i, M6 Coupe', '3rd Gen 6-Series Coupe', 2011, 2018, 'F13', 'Grand Tourer'),
('F15', 'X5 xDrive25d, xDrive30d, xDrive35i, xDrive50i, M', '3rd Gen X5', 2013, 2018, 'F15', 'Mid-Size SUV'),
('F16', 'X6 xDrive30d, xDrive35i, xDrive50i, M', '2nd Gen X6', 2014, 2019, 'F16', 'Sports Activity Coupe'),
('F20', '114i, 116i, 118i, 120i, 125i, M135i', '2nd Gen 1-Series 5-Door', 2011, 2019, 'F20', 'Premium Compact'),
('F21', '114i, 116i, 118i, 120i, 125i, M135i', '2nd Gen 1-Series 3-Door', 2011, 2019, 'F21', 'Premium Compact'),
('F22', '218i, 220i, 225i, 228i, 230i, M235i, M240i', '1st Gen 2-Series Coupe', 2013, 2021, 'F22', 'Premium Compact'),
('F23', '220i, 228i, 230i, M235i, M240i Convertible', '1st Gen 2-Series Convertible', 2014, 2021, 'F23', 'Premium Compact'),
('F25', 'X3 xDrive20i, xDrive28i, xDrive30i, xDrive35i', '2nd Gen X3', 2010, 2017, 'F25', 'Compact SUV'),
('F26', 'X4 xDrive20i, xDrive28i, xDrive30i, xDrive35i, M40i', '1st Gen X4', 2014, 2018, 'F26', 'Compact Sports Activity Coupe'),
('F30', '316i, 318i, 320i, 325i, 328i, 330i, 335i, 340i, M3', '6th Gen 3-Series Sedan', 2011, 2019, 'F30', 'Compact Executive'),
('F31', '316i, 318i, 320i, 325i, 328i, 330i, 335i, 340i Touring', '6th Gen 3-Series Touring', 2012, 2019, 'F31', 'Compact Executive'),
('F32', '420i, 425i, 428i, 430i, 435i, 440i, M4 Coupe', '1st Gen 4-Series Coupe', 2013, 2020, 'F32', 'Compact Executive'),
('F33', '420i, 425i, 428i, 430i, 435i, 440i, M4 Convertible', '1st Gen 4-Series Convertible', 2014, 2020, 'F33', 'Compact Executive'),
('F34', '320i, 328i, 330i, 335i Gran Turismo', '3-Series Gran Turismo', 2013, 2020, 'F34', 'Compact Executive GT'),
('F36', '420i, 428i, 430i, 435i, 440i Gran Coupe', '1st Gen 4-Series Gran Coupe', 2014, 2020, 'F36', 'Compact Executive'),
('F39', 'X2 sDrive18i, xDrive20i, xDrive25i, xDrive28i, M35i', '1st Gen X2', 2017, 2024, 'F39', 'Subcompact SUV'),
('F45', '214i, 216i, 218i, 220i, 225i Active Tourer', '2-Series Active Tourer', 2014, 2022, 'F45', 'Compact MPV'),
('F46', '214i, 216i, 218i, 220i, 225i Gran Tourer', '2-Series Gran Tourer', 2015, 2022, 'F46', 'Compact MPV'),
('F48', 'X1 sDrive18i, xDrive20i, xDrive25i, xDrive28i', '2nd Gen X1', 2015, 2022, 'F48', 'Compact SUV'),
('F52', '118i, 120i, 125i Sedan', '1-Series Sedan (China)', 2016, 2024, 'F52', 'Premium Compact'),
('F54', 'Cooper, Cooper S, JCW Clubman', 'MINI Clubman', 2015, 2023, 'F54', 'Premium Compact'),
('F55', 'Cooper, Cooper S, JCW 5-Door', 'MINI 5-Door', 2014, 2024, 'F55', 'Premium Compact'),
('F56', 'Cooper, Cooper S, JCW 3-Door', 'MINI 3-Door', 2013, 2024, 'F56', 'Premium Compact'),
('F57', 'Cooper, Cooper S, JCW Convertible', 'MINI Convertible', 2015, 2024, 'F57', 'Premium Compact'),
('F60', 'Cooper, Cooper S, JCW Countryman', 'MINI Countryman', 2016, 2024, 'F60', 'Compact SUV'),

-- G-Series (2015-Present)
('G01', 'X3 xDrive20i, xDrive30i, M40i, M Competition', '3rd Gen X3', 2017, NULL, 'G01', 'Compact SUV'),
('G02', 'X4 xDrive20i, xDrive30i, M40i, M Competition', '2nd Gen X4', 2018, NULL, 'G02', 'Compact Sports Activity Coupe'),
('G05', 'X5 xDrive40i, xDrive50i, M50i, M Competition', '4th Gen X5', 2018, NULL, 'G05', 'Mid-Size SUV'),
('G06', 'X6 xDrive40i, xDrive50i, M50i, M Competition', '3rd Gen X6', 2019, NULL, 'G06', 'Sports Activity Coupe'),
('G07', 'X7 xDrive40i, xDrive50i, M50i, M60i', '1st Gen X7', 2018, NULL, 'G07', 'Full-Size SUV'),
('G11', '730i, 740i, 750i, M760i', '6th Gen 7-Series', 2015, 2022, 'G11', 'Full-Size Luxury'),
('G12', '730Li, 740Li, 750Li, M760Li', '6th Gen 7-Series LWB', 2015, 2022, 'G12', 'Full-Size Luxury'),
('G14', '840i, M850i, M8 Coupe', '2nd Gen 8-Series Coupe', 2018, NULL, 'G14', 'Grand Tourer'),
('G15', '840i, M850i, M8 Convertible', '2nd Gen 8-Series Convertible', 2019, NULL, 'G15', 'Grand Tourer'),
('G16', '840i, M850i, M8 Gran Coupe', '2nd Gen 8-Series Gran Coupe', 2019, NULL, 'G16', 'Grand Tourer'),
('G20', '318i, 320i, 330i, 340i, M340i, M3', '7th Gen 3-Series Sedan', 2018, NULL, 'G20', 'Compact Executive'),
('G21', '318i, 320i, 330i, 340i, M340i Touring', '7th Gen 3-Series Touring', 2019, NULL, 'G21', 'Compact Executive'),
('G22', '420i, 430i, 440i, M440i, M4 Coupe', '2nd Gen 4-Series Coupe', 2020, NULL, 'G22', 'Compact Executive'),
('G23', '420i, 430i, 440i, M440i, M4 Convertible', '2nd Gen 4-Series Convertible', 2021, NULL, 'G23', 'Compact Executive'),
('G26', '420i, 430i, 440i, M440i Gran Coupe', '2nd Gen 4-Series Gran Coupe', 2021, NULL, 'G26', 'Compact Executive'),
('G29', 'Z4 sDrive20i, sDrive30i, M40i', '3rd Gen Z4', 2018, NULL, 'G29', 'Sports Car'),
('G30', '520i, 530i, 540i, M550i, M5', '8th Gen 5-Series', 2016, NULL, 'G30', 'Executive'),
('G31', '520i, 530i, 540i, M550i Touring', '8th Gen 5-Series Touring', 2017, NULL, 'G31', 'Executive Estate'),
('G32', '630i, 640i, M640i Gran Turismo', '6-Series Gran Turismo', 2017, 2023, 'G32', 'Executive GT'),
('G42', '220i, 230i, M240i Coupe', '2nd Gen 2-Series Coupe', 2021, NULL, 'G42', 'Premium Compact'),
('G70', '730i, 740i, 750i, 760i, i7', '7th Gen 7-Series', 2022, NULL, 'G70', 'Full-Size Luxury'),
('G71', '730Li, 740Li, 750Li, 760Li, i7L', '7th Gen 7-Series LWB', 2022, NULL, 'G71', 'Full-Size Luxury'),
('G80', 'M3 Sedan', 'M3 Competition', 2020, NULL, 'G80', 'High Performance'),
('G82', 'M4 Coupe', 'M4 Competition', 2020, NULL, 'G82', 'High Performance'),
('G83', 'M4 Convertible', 'M4 Competition Convertible', 2021, NULL, 'G83', 'High Performance'),
('G87', 'M2 Coupe', 'M2 Competition', 2022, NULL, 'G87', 'High Performance'),

-- U-Series (Special/Electric)
('U06', 'iX1 xDrive30', 'Electric X1', 2022, NULL, 'U06', 'Electric Compact SUV'),
('U11', 'iX3 xDrive30', 'Electric X3', 2020, NULL, 'U11', 'Electric Compact SUV');

-- Insert BMW Engines (Major engine codes)
INSERT INTO bmw_engines (engine_code, engine_name, displacement, cylinders, fuel_type, aspiration, horsepower_min, horsepower_max, production_start, production_end, engine_family) VALUES
-- N-Series Engines
('N20', 'N20B20', 2.0, 4, 'Gasoline', 'Turbocharged', 184, 245, 2011, 2017, 'N-Series'),
('N26', 'N26B20', 2.0, 4, 'Gasoline', 'Turbocharged', 184, 245, 2013, 2016, 'N-Series'),
('N52', 'N52B25/N52B30', 2.5, 6, 'Gasoline', 'Naturally Aspirated', 192, 272, 2004, 2015, 'N-Series'),
('N54', 'N54B30', 3.0, 6, 'Gasoline', 'Twin Turbo', 300, 335, 2006, 2016, 'N-Series'),
('N55', 'N55B30', 3.0, 6, 'Gasoline', 'Single Turbo', 300, 340, 2009, 2017, 'N-Series'),
('N63', 'N63B44', 4.4, 8, 'Gasoline', 'Twin Turbo', 400, 560, 2008, 2016, 'N-Series'),
('N74', 'N74B60', 6.0, 12, 'Gasoline', 'Twin Turbo', 535, 601, 2008, 2016, 'N-Series'),

-- B-Series Engines (Current Generation)
('B38', 'B38A15/B38B15', 1.5, 3, 'Gasoline', 'Turbocharged', 136, 178, 2014, NULL, 'B-Series'),
('B46', 'B46A20/B46B20', 2.0, 4, 'Gasoline', 'Turbocharged', 192, 252, 2015, NULL, 'B-Series'),
('B48', 'B48A20/B48B20', 2.0, 4, 'Gasoline', 'Turbocharged', 184, 258, 2014, NULL, 'B-Series'),
('B58', 'B58B30', 3.0, 6, 'Gasoline', 'Single Turbo', 320, 382, 2015, NULL, 'B-Series'),
('B63', 'B63B44', 4.4, 8, 'Gasoline', 'Twin Turbo', 530, 617, 2016, NULL, 'B-Series'),

-- S-Series M Engines
('S14', 'S14B23/S14B25', 2.3, 4, 'Gasoline', 'Naturally Aspirated', 192, 238, 1986, 1991, 'S-Series'),
('S50', 'S50B30/S50B32', 3.0, 6, 'Gasoline', 'Naturally Aspirated', 286, 321, 1992, 2000, 'S-Series'),
('S52', 'S52B32', 3.2, 6, 'Gasoline', 'Naturally Aspirated', 240, 240, 1996, 2000, 'S-Series'),
('S54', 'S54B32', 3.2, 6, 'Gasoline', 'Naturally Aspirated', 333, 343, 2000, 2008, 'S-Series'),
('S55', 'S55B30', 3.0, 6, 'Gasoline', 'Twin Turbo', 425, 503, 2014, NULL, 'S-Series'),
('S58', 'S58B30', 3.0, 6, 'Gasoline', 'Twin Turbo', 473, 503, 2019, NULL, 'S-Series'),
('S62', 'S62B50', 5.0, 8, 'Gasoline', 'Naturally Aspirated', 394, 400, 1998, 2003, 'S-Series'),
('S63', 'S63B44', 4.4, 8, 'Gasoline', 'Twin Turbo', 552, 617, 2009, NULL, 'S-Series'),
('S65', 'S65B40', 4.0, 8, 'Gasoline', 'Naturally Aspirated', 414, 420, 2007, 2013, 'S-Series'),
('S68', 'S68B38', 3.8, 8, 'Gasoline', 'Twin Turbo', 617, 617, 2022, NULL, 'S-Series'),
('S85', 'S85B50', 5.0, 10, 'Gasoline', 'Naturally Aspirated', 500, 507, 2005, 2010, 'S-Series');

-- Insert BMW Transmissions
INSERT INTO bmw_transmissions (transmission_code, transmission_name, transmission_type, gear_count, manufacturer, production_start, production_end) VALUES
-- Manual Transmissions
('ZF-5HP', 'ZF 5HP Series', 'Manual', 5, 'ZF', 1980, 2010),
('ZF-6MT', 'ZF 6-Speed Manual', 'Manual', 6, 'ZF', 1995, NULL),
('Getrag-420G', 'Getrag 420G', 'Manual', 6, 'Getrag', 2001, 2013),
('Getrag-260', 'Getrag 260', 'Manual', 5, 'Getrag', 1982, 2000),

-- Automatic Transmissions
('ZF-8HP', 'ZF 8HP Series', 'Automatic', 8, 'ZF', 2009, NULL),
('ZF-6HP', 'ZF 6HP Series', 'Automatic', 6, 'ZF', 2000, 2017),
('ZF-5HP', 'ZF 5HP Series', 'Automatic', 5, 'ZF', 1991, 2009),
('GM-5L40E', 'GM 5L40-E', 'Automatic', 5, 'GM', 1999, 2009),

-- DCT Transmissions
('Getrag-7DCT', 'Getrag 7-Speed DCT', 'DCT', 7, 'Getrag', 2008, NULL),
('ZF-8DCT', 'ZF 8-Speed DCT', 'DCT', 8, 'ZF', 2018, NULL);

-- Insert Ultimate Part Categories (Every RealOEM category)
INSERT INTO bmw_part_categories (category_code, category_name, realoem_code, description, sort_order) VALUES
-- Engine System (11-18)
('11', 'Engine', '11', 'Engine block, cylinder head, pistons, crankshaft, camshaft, timing components', 1),
('12', 'Fuel Preparation System', '12', 'Fuel injection, throttle body, intake manifold, fuel rail, injectors', 2),
('13', 'Fuel Supply', '13', 'Fuel tank, fuel pump, fuel lines, fuel filter, evaporative emission system', 3),
('17', 'Cooling System', '17', 'Radiator, water pump, thermostat, cooling hoses, expansion tank, cooling fan', 4),
('18', 'Exhaust System', '18', 'Exhaust manifold, catalytic converter, muffler, exhaust pipes, heat shields', 5),

-- Transmission & Drivetrain (21-26)
('21', 'Clutch', '21', 'Clutch disc, pressure plate, release bearing, clutch fork, slave cylinder', 6),
('22', 'Engine/Transmission', '22', 'Bell housing, flywheel, starter motor, transmission mounts', 7),
('23', 'Manual Transmission', '23', 'Gear sets, synchronizers, shift forks, transmission case, shift linkage', 8),
('24', 'Automatic Transmission', '24', 'Valve body, torque converter, transmission filter, cooler, solenoids', 9),
('25', 'Rear Axle', '25', 'Differential, axle shafts, ring and pinion, differential mounts, seals', 10),
('26', 'Front Axle', '26', 'CV joints, drive shafts, wheel bearings, hub assemblies, axle boots', 11),

-- Suspension & Steering (31-33)
('31', 'Front Suspension', '31', 'Struts, springs, control arms, ball joints, sway bar, bushings', 12),
('32', 'Steering', '32', 'Steering rack, power steering pump, steering column, tie rods, steering wheel', 13),
('33', 'Rear Suspension', '33', 'Shocks, springs, control arms, trailing arms, sway bar, subframe', 14),

-- Brakes (34)
('34', 'Brakes', '34', 'Brake pads, rotors, calipers, brake lines, master cylinder, ABS system', 15),

-- Wheels & Tires (36)
('36', 'Wheels/Tires', '36', 'Wheels, tires, wheel bolts, center caps, valve stems, TPMS sensors', 16),

-- Body & Exterior (41, 51)
('41', 'Body', '41', 'Body panels, structural components, reinforcements, body seals', 17),
('51', 'Body Equipment/Exterior', '51', 'Bumpers, grilles, fenders, hood, trunk, doors, mirrors, trim, emblems', 18),

-- Interior (52-54)
('52', 'Seats', '52', 'Seat frames, cushions, covers, mechanisms, headrests, armrests', 19),
('53', 'Interior Equipment', '53', 'Dashboard, door panels, center console, trim pieces, storage', 20),
('54', 'Pedals/Steering Column', '54', 'Pedal assembly, steering column, steering wheel, column switches', 21),

-- Glass & Roof (55-56)
('55', 'Sliding Roof/Convertible Top', '55', 'Sunroof assembly, sunroof motor, convertible top, top hydraulics', 22),
('56', 'Exterior Mirrors', '56', 'Mirror assemblies, mirror glass, mirror motors, mirror housings', 23),

-- Electrical System (61-63)
('61', 'Electrical System', '61', 'Alternator, starter, battery, wiring harnesses, fuse boxes, relays', 24),
('62', 'Instruments', '62', 'Instrument cluster, gauges, warning lights, display screens, switches', 25),
('63', 'Lighting', '63', 'Headlights, taillights, turn signals, fog lights, interior lights, bulbs', 26),

-- Climate Control (64)
('64', 'Air Conditioning', '64', 'AC compressor, condenser, evaporator, AC lines, blower motor, cabin filter', 27),

-- Additional Equipment (65, 71-72)
('65', 'Radio/Navigation', '65', 'Head unit, speakers, amplifiers, antennas, navigation system, Bluetooth', 28),
('71', 'Equipment/Individual Options', '71', 'Special equipment, M Performance parts, individual options, comfort access', 29),
('72', 'Retrofit Kits', '72', 'Retrofit parts, upgrade kits, accessory parts', 30),

-- Service Parts (81-82)
('81', 'Service/Maintenance', '81', 'Oil filters, air filters, spark plugs, belts, hoses, gaskets, seals', 31),
('82', 'Tools', '82', 'Special tools, service tools, diagnostic equipment', 32),

-- Hardware & Fasteners (91-92)
('91', 'Hardware', '91', 'Bolts, screws, nuts, washers, clips, fasteners, brackets, mounting hardware', 33),
('92', 'Seals/Gaskets', '92', 'Engine gaskets, transmission seals, door seals, window seals, weatherstripping', 34);

-- Create subcategories for detailed organization
INSERT INTO bmw_part_categories (category_code, category_name, parent_category_id, description, sort_order) VALUES
-- Engine subcategories
('11_01', 'Engine Block', (SELECT id FROM bmw_part_categories WHERE category_code = '11'), 'Cylinder block, pistons, connecting rods, crankshaft', 1),
('11_02', 'Cylinder Head', (SELECT id FROM bmw_part_categories WHERE category_code = '11'), 'Cylinder head, valves, camshafts, valve train components', 2),
('11_03', 'Oil System', (SELECT id FROM bmw_part_categories WHERE category_code = '11'), 'Oil pump, oil pan, oil cooler, oil lines', 3),
('11_04', 'Timing System', (SELECT id FROM bmw_part_categories WHERE category_code = '11'), 'Timing chain, timing belt, tensioners, guides', 4),
('11_05', 'Engine Mounts', (SELECT id FROM bmw_part_categories WHERE category_code = '11'), 'Engine mounts, transmission mounts, torque struts', 5),

-- Brake subcategories
('34_01', 'Front Brakes', (SELECT id FROM bmw_part_categories WHERE category_code = '34'), 'Front brake pads, rotors, calipers', 1),
('34_02', 'Rear Brakes', (SELECT id FROM bmw_part_categories WHERE category_code = '34'), 'Rear brake pads, rotors, calipers', 2),
('34_03', 'Brake Lines', (SELECT id FROM bmw_part_categories WHERE category_code = '34'), 'Brake hoses, brake lines, brake fluid reservoir', 3),
('34_04', 'ABS System', (SELECT id FROM bmw_part_categories WHERE category_code = '34'), 'ABS module, wheel speed sensors, ABS pump', 4),

-- Body subcategories
('51_01', 'Front End', (SELECT id FROM bmw_part_categories WHERE category_code = '51'), 'Front bumper, grille, headlights, fog lights', 1),
('51_02', 'Rear End', (SELECT id FROM bmw_part_categories WHERE category_code = '51'), 'Rear bumper, taillights, trunk lid, spoiler', 2),
('51_03', 'Side Panels', (SELECT id FROM bmw_part_categories WHERE category_code = '51'), 'Fenders, doors, side mirrors, side trim', 3),
('51_04', 'Hood/Roof', (SELECT id FROM bmw_part_categories WHERE category_code = '51'), 'Hood, roof panels, sunroof components', 4);

-- Enable Row Level Security
ALTER TABLE bmw_chassis ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_engines ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_transmissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_model_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_part_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_oem_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_part_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON bmw_chassis FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_engines FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_transmissions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_model_variants FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_part_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_oem_parts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_part_compatibility FOR SELECT USING (true);
CREATE POLICY "Public read access" ON scraping_progress FOR SELECT USING (true);

-- Create policies for service role write access
CREATE POLICY "Service role write access" ON bmw_chassis FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role write access" ON bmw_engines FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role write access" ON bmw_transmissions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role write access" ON bmw_model_variants FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role write access" ON bmw_part_categories FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role write access" ON bmw_oem_parts FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role write access" ON bmw_part_compatibility FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role write access" ON scraping_progress FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create functions for progress tracking
CREATE OR REPLACE FUNCTION update_scraping_progress()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_scraping_progress_trigger
    BEFORE UPDATE ON scraping_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_scraping_progress();

-- Create function to get scraping statistics
CREATE OR REPLACE FUNCTION get_scraping_statistics()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_chassis', (SELECT COUNT(*) FROM bmw_chassis),
        'total_engines', (SELECT COUNT(*) FROM bmw_engines),
        'total_categories', (SELECT COUNT(*) FROM bmw_part_categories),
        'total_parts', (SELECT COUNT(*) FROM bmw_oem_parts),
        'total_compatibility_records', (SELECT COUNT(*) FROM bmw_part_compatibility),
        'scraping_sessions', (SELECT COUNT(DISTINCT scraping_session_id) FROM scraping_progress),
        'completed_sessions', (SELECT COUNT(DISTINCT scraping_session_id) FROM scraping_progress WHERE status = 'completed'),
        'parts_by_chassis', (
            SELECT json_object_agg(chassis_code, part_count)
            FROM (
                SELECT c.chassis_code, COUNT(pc.id) as part_count
                FROM bmw_chassis c
                LEFT JOIN bmw_part_compatibility pc ON c.id = pc.chassis_id
                GROUP BY c.chassis_code
                ORDER BY part_count DESC
                LIMIT 20
            ) chassis_stats
        ),
        'last_updated', (SELECT MAX(updated_at) FROM scraping_progress)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Insert sample F22/F23 model variants to demonstrate the system
INSERT INTO bmw_model_variants (chassis_id, model_name, marketing_name, engine_id, body_type, doors, drivetrain, production_start, production_end, market_regions, trim_levels) VALUES
((SELECT id FROM bmw_chassis WHERE chassis_code = 'F22'), '218i', '218i Coupe', (SELECT id FROM bmw_engines WHERE engine_code = 'B38'), 'Coupe', 2, 'RWD', 2014, 2021, ARRAY['Europe', 'Asia'], ARRAY['Base', 'Sport Line', 'Luxury Line']),
((SELECT id FROM bmw_chassis WHERE chassis_code = 'F22'), '220i', '220i Coupe', (SELECT id FROM bmw_engines WHERE engine_code = 'B48'), 'Coupe', 2, 'RWD', 2013, 2021, ARRAY['Global'], ARRAY['Base', 'Sport Line', 'Luxury Line', 'M Sport']),
((SELECT id FROM bmw_chassis WHERE chassis_code = 'F22'), '228i', '228i Coupe', (SELECT id FROM bmw_engines WHERE engine_code = 'N20'), 'Coupe', 2, 'RWD', 2013, 2016, ARRAY['North America'], ARRAY['Base', 'Sport Line', 'M Sport']),
((SELECT id FROM bmw_chassis WHERE chassis_code = 'F22'), '230i', '230i Coupe', (SELECT id FROM bmw_engines WHERE engine_code = 'B48'), 'Coupe', 2, 'RWD', 2016, 2021, ARRAY['Global'], ARRAY['Base', 'Sport Line', 'Luxury Line', 'M Sport']),
((SELECT id FROM bmw_chassis WHERE chassis_code = 'F22'), 'M235i', 'M235i Coupe', (SELECT id FROM bmw_engines WHERE engine_code = 'N55'), 'Coupe', 2, 'RWD', 2013, 2016, ARRAY['Global'], ARRAY['M Sport', 'M Performance']),
((SELECT id FROM bmw_chassis WHERE chassis_code = 'F22'), 'M240i', 'M240i Coupe', (SELECT id FROM bmw_engines WHERE engine_code = 'B58'), 'Coupe', 2, 'RWD', 2016, 2021, ARRAY['Global'], ARRAY['M Sport', 'M Performance']),
((SELECT id FROM bmw_chassis WHERE chassis_code = 'F23'), '220i', '220i Convertible', (SELECT id FROM bmw_engines WHERE engine_code = 'B48'), 'Convertible', 2, 'RWD', 2014, 2021, ARRAY['Global'], ARRAY['Base', 'Sport Line', 'Luxury Line', 'M Sport']),
((SELECT id FROM bmw_chassis WHERE chassis_code = 'F23'), '228i', '228i Convertible', (SELECT id FROM bmw_engines WHERE engine_code = 'N20'), 'Convertible', 2, 'RWD', 2014, 2016, ARRAY['North America'], ARRAY['Base', 'Sport Line', 'M Sport']),
((SELECT id FROM bmw_chassis WHERE chassis_code = 'F23'), '230i', '230i Convertible', (SELECT id FROM bmw_engines WHERE engine_code = 'B48'), 'Convertible', 2, 'RWD', 2016, 2021, ARRAY['Global'], ARRAY['Base', 'Sport Line', 'Luxury Line', 'M Sport']),
((SELECT id FROM bmw_chassis WHERE chassis_code = 'F23'), 'M235i', 'M235i Convertible', (SELECT id FROM bmw_engines WHERE engine_code = 'N55'), 'Convertible', 2, 'RWD', 2014, 2016, ARRAY['Global'], ARRAY['M Sport', 'M Performance']),
((SELECT id FROM bmw_chassis WHERE chassis_code = 'F23'), 'M240i', 'M240i Convertible', (SELECT id FROM bmw_engines WHERE engine_code = 'B58'), 'Convertible', 2, 'RWD', 2016, 2021, ARRAY['Global'], ARRAY['M Sport', 'M Performance']);

COMMIT;

-- Display setup completion message
DO $$
BEGIN
    RAISE NOTICE '🎉 ULTIMATE BMW PARTS DATABASE SETUP COMPLETED!';
    RAISE NOTICE '📊 Database includes:';
    RAISE NOTICE '   - % BMW chassis codes', (SELECT COUNT(*) FROM bmw_chassis);
    RAISE NOTICE '   - % engine variants', (SELECT COUNT(*) FROM bmw_engines);
    RAISE NOTICE '   - % transmission types', (SELECT COUNT(*) FROM bmw_transmissions);
    RAISE NOTICE '   - % part categories', (SELECT COUNT(*) FROM bmw_part_categories);
    RAISE NOTICE '   - % F22/F23 model variants', (SELECT COUNT(*) FROM bmw_model_variants WHERE chassis_id IN (SELECT id FROM bmw_chassis WHERE chassis_code IN ('F22', 'F23')));
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Ready for ultimate BMW parts scraping!';
    RAISE NOTICE '📈 Run the scraper to populate with 500,000+ parts';
END $$;
