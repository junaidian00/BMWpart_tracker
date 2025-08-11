-- COMPREHENSIVE REALOEM BMW DATABASE SCHEMA
-- This schema handles every possible BMW part from RealOEM with full compatibility tracking

-- Drop existing tables to recreate with enhanced structure
DROP TABLE IF EXISTS bmw_part_supersessions CASCADE;
DROP TABLE IF EXISTS bmw_part_alternatives CASCADE;
DROP TABLE IF EXISTS bmw_part_compatibility CASCADE;
DROP TABLE IF EXISTS bmw_part_diagrams CASCADE;
DROP TABLE IF EXISTS bmw_oem_parts CASCADE;
DROP TABLE IF EXISTS bmw_part_categories CASCADE;
DROP TABLE IF EXISTS bmw_model_variants CASCADE;
DROP TABLE IF EXISTS bmw_models CASCADE;
DROP TABLE IF EXISTS bmw_series CASCADE;

-- BMW Series master table
CREATE TABLE bmw_series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    series_code VARCHAR(10) UNIQUE NOT NULL,
    series_name VARCHAR(100) NOT NULL,
    generation VARCHAR(50),
    production_start INTEGER,
    production_end INTEGER,
    chassis_type VARCHAR(50), -- E, F, G, U series classification
    market_introduction DATE,
    market_discontinuation DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BMW Models with comprehensive details
CREATE TABLE bmw_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    series_id UUID REFERENCES bmw_series(id) ON DELETE CASCADE,
    series_code VARCHAR(10) NOT NULL,
    model_code VARCHAR(20), -- Internal BMW model code
    model_name VARCHAR(100) NOT NULL,
    body_type VARCHAR(50), -- Sedan, Coupe, Convertible, Touring, SAV, SAC, etc.
    doors INTEGER,
    engine_displacement DECIMAL(4,1), -- Engine size in liters
    engine_configuration VARCHAR(20), -- I4, I6, V8, V12, etc.
    fuel_type VARCHAR(20), -- Gasoline, Diesel, Hybrid, Electric
    transmission_type VARCHAR(20), -- Manual, Automatic, CVT
    drive_type VARCHAR(20), -- RWD, FWD, AWD, xDrive
    production_start INTEGER,
    production_end INTEGER,
    market_region VARCHAR(50) DEFAULT 'Global',
    vin_pattern VARCHAR(100), -- VIN pattern for identification
    realoem_url TEXT, -- Direct link to RealOEM page
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(series_code, model_name, body_type, production_start)
);

-- BMW Model Variants (specific engine/trim combinations)
CREATE TABLE bmw_model_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES bmw_models(id) ON DELETE CASCADE,
    variant_code VARCHAR(50), -- e.g., "335i", "M3", "xDrive28i"
    engine_code VARCHAR(20), -- N54, N55, B58, S65, etc.
    engine_name VARCHAR(100), -- Full engine description
    horsepower INTEGER,
    torque INTEGER, -- in lb-ft
    fuel_system VARCHAR(50), -- Direct Injection, Port Injection, etc.
    aspiration VARCHAR(20), -- Naturally Aspirated, Turbocharged, Supercharged
    compression_ratio DECIMAL(4,2),
    bore_stroke VARCHAR(20), -- e.g., "84.0 x 89.6"
    displacement_cc INTEGER, -- Engine displacement in cc
    production_start INTEGER,
    production_end INTEGER,
    market_specific JSONB, -- Market-specific availability
    performance_data JSONB, -- 0-60, top speed, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comprehensive part categories with hierarchy
CREATE TABLE bmw_part_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_code VARCHAR(20) UNIQUE NOT NULL,
    category_name VARCHAR(200) NOT NULL,
    parent_category_id UUID REFERENCES bmw_part_categories(id),
    category_level INTEGER DEFAULT 1, -- 1=main, 2=sub, 3=detail
    realoem_section VARCHAR(100), -- RealOEM diagram section name
    diagram_group VARCHAR(100), -- Grouping within diagrams
    sort_order INTEGER DEFAULT 0,
    description TEXT,
    icon_name VARCHAR(50), -- For UI icons
    color_code VARCHAR(7), -- Hex color for UI
    is_maintenance_item BOOLEAN DEFAULT FALSE,
    maintenance_interval_miles INTEGER, -- For maintenance parts
    maintenance_interval_months INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BMW OEM Parts with comprehensive details
CREATE TABLE bmw_oem_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_number VARCHAR(50) UNIQUE NOT NULL,
    part_name VARCHAR(500) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES bmw_part_categories(id),
    
    -- Pricing and availability
    price_msrp DECIMAL(10,2),
    price_dealer DECIMAL(10,2),
    price_wholesale DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    is_discontinued BOOLEAN DEFAULT FALSE,
    discontinuation_date DATE,
    superseded_by VARCHAR(50), -- Part number that replaces this one
    supersession_date DATE,
    
    -- Physical properties
    weight_kg DECIMAL(8,3),
    dimensions_mm VARCHAR(50), -- L x W x H
    material VARCHAR(100),
    color VARCHAR(50),
    finish VARCHAR(50),
    
    -- Technical specifications
    specifications JSONB, -- Technical specs as JSON
    torque_specs JSONB, -- Torque specifications
    installation_notes TEXT,
    special_tools TEXT, -- Required special tools
    
    -- RealOEM specific data
    diagram_position VARCHAR(20), -- Position number in diagram
    diagram_group VARCHAR(50), -- Group within diagram
    quantity_per_vehicle INTEGER DEFAULT 1,
    realoem_diagram_url TEXT,
    realoem_part_url TEXT,
    
    -- Additional metadata
    oem_manufacturer VARCHAR(100), -- Actual manufacturer (Bosch, Continental, etc.)
    manufacturing_country VARCHAR(50),
    quality_grade VARCHAR(20), -- OEM, OES, Aftermarket
    warranty_months INTEGER,
    
    -- Search and classification
    keywords TEXT[], -- Search keywords
    tags TEXT[], -- Classification tags
    notes TEXT,
    internal_notes TEXT, -- For admin use
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_price_update TIMESTAMP WITH TIME ZONE,
    last_availability_check TIMESTAMP WITH TIME ZONE
);

-- Part compatibility with detailed specifications
CREATE TABLE bmw_part_compatibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id UUID REFERENCES bmw_oem_parts(id) ON DELETE CASCADE,
    model_id UUID REFERENCES bmw_models(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES bmw_model_variants(id) ON DELETE CASCADE,
    
    -- Production period compatibility
    production_start INTEGER,
    production_end INTEGER,
    production_month_start VARCHAR(7), -- YYYY-MM format for precise dating
    production_month_end VARCHAR(7),
    
    -- Technical compatibility
    engine_specific TEXT[], -- Specific engine codes
    transmission_specific TEXT[], -- Manual, Automatic, specific codes
    market_specific TEXT[], -- US, EU, etc.
    body_type_specific TEXT[], -- Sedan, Coupe, etc.
    trim_specific TEXT[], -- Base, Sport, M-Sport, etc.
    option_specific TEXT[], -- Specific option codes
    
    -- VIN compatibility
    vin_range_start VARCHAR(17),
    vin_range_end VARCHAR(17),
    vin_position_check JSONB, -- Specific VIN position checks
    
    -- Installation details
    installation_position VARCHAR(100), -- Front, Rear, Left, Right, etc.
    installation_notes TEXT,
    requires_coding BOOLEAN DEFAULT FALSE, -- Requires BMW coding
    requires_programming BOOLEAN DEFAULT FALSE,
    labor_hours DECIMAL(4,2), -- Estimated labor time
    
    -- Compatibility confidence
    confidence_level INTEGER DEFAULT 100, -- 0-100% confidence
    verification_source VARCHAR(100), -- RealOEM, BMW TIS, etc.
    verification_date DATE,
    
    -- Additional metadata
    notes TEXT,
    warnings TEXT, -- Important compatibility warnings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Part diagrams and visual references
CREATE TABLE bmw_part_diagrams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id UUID REFERENCES bmw_oem_parts(id) ON DELETE CASCADE,
    model_id UUID REFERENCES bmw_models(id) ON DELETE CASCADE,
    
    diagram_name VARCHAR(200),
    diagram_section VARCHAR(100), -- Engine, Body, Interior, etc.
    diagram_subsection VARCHAR(100),
    diagram_number VARCHAR(50),
    position_number VARCHAR(20), -- Position in diagram
    
    -- Visual data
    diagram_image_url TEXT,
    diagram_svg_data TEXT, -- SVG diagram data
    hotspot_coordinates JSONB, -- Clickable area coordinates
    zoom_level INTEGER DEFAULT 1,
    
    -- RealOEM references
    realoem_diagram_id VARCHAR(100),
    realoem_diagram_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Part supersessions and replacements
CREATE TABLE bmw_part_supersessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_part_id UUID REFERENCES bmw_oem_parts(id) ON DELETE CASCADE,
    replacement_part_id UUID REFERENCES bmw_oem_parts(id) ON DELETE CASCADE,
    supersession_type VARCHAR(50), -- Direct, Improved, Alternative
    supersession_date DATE,
    reason TEXT, -- Reason for supersession
    compatibility_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(original_part_id, replacement_part_id)
);

-- Alternative and cross-reference parts
CREATE TABLE bmw_part_alternatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_part_id UUID REFERENCES bmw_oem_parts(id) ON DELETE CASCADE,
    alternative_part_id UUID REFERENCES bmw_oem_parts(id) ON DELETE CASCADE,
    alternative_type VARCHAR(50), -- OEM Alternative, Aftermarket, Upgraded
    compatibility_level INTEGER DEFAULT 100, -- 0-100% compatibility
    price_difference DECIMAL(10,2), -- Price difference
    quality_difference VARCHAR(50), -- Better, Same, Lower
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(primary_part_id, alternative_part_id)
);

-- Indexes for optimal performance
CREATE INDEX idx_bmw_series_code ON bmw_series(series_code);
CREATE INDEX idx_bmw_models_series ON bmw_models(series_code);
CREATE INDEX idx_bmw_models_production ON bmw_models(production_start, production_end);
CREATE INDEX idx_bmw_model_variants_engine ON bmw_model_variants(engine_code);
CREATE INDEX idx_bmw_part_categories_code ON bmw_part_categories(category_code);
CREATE INDEX idx_bmw_part_categories_parent ON bmw_part_categories(parent_category_id);
CREATE INDEX idx_bmw_oem_parts_number ON bmw_oem_parts(part_number);
CREATE INDEX idx_bmw_oem_parts_category ON bmw_oem_parts(category_id);
CREATE INDEX idx_bmw_oem_parts_name_gin ON bmw_oem_parts USING gin(to_tsvector('english', part_name));
CREATE INDEX idx_bmw_oem_parts_description_gin ON bmw_oem_parts USING gin(to_tsvector('english', description));
CREATE INDEX idx_bmw_oem_parts_keywords_gin ON bmw_oem_parts USING gin(keywords);
CREATE INDEX idx_bmw_oem_parts_price ON bmw_oem_parts(price_msrp) WHERE price_msrp IS NOT NULL;
CREATE INDEX idx_bmw_oem_parts_discontinued ON bmw_oem_parts(is_discontinued);
CREATE INDEX idx_bmw_part_compatibility_part ON bmw_part_compatibility(part_id);
CREATE INDEX idx_bmw_part_compatibility_model ON bmw_part_compatibility(model_id);
CREATE INDEX idx_bmw_part_compatibility_variant ON bmw_part_compatibility(variant_id);
CREATE INDEX idx_bmw_part_compatibility_production ON bmw_part_compatibility(production_start, production_end);
CREATE INDEX idx_bmw_part_compatibility_engines_gin ON bmw_part_compatibility USING gin(engine_specific);
CREATE INDEX idx_bmw_part_diagrams_part ON bmw_part_diagrams(part_id);
CREATE INDEX idx_bmw_part_diagrams_model ON bmw_part_diagrams(model_id);
CREATE INDEX idx_bmw_part_supersessions_original ON bmw_part_supersessions(original_part_id);
CREATE INDEX idx_bmw_part_supersessions_replacement ON bmw_part_supersessions(replacement_part_id);
CREATE INDEX idx_bmw_part_alternatives_primary ON bmw_part_alternatives(primary_part_id);
CREATE INDEX idx_bmw_part_alternatives_alternative ON bmw_part_alternatives(alternative_part_id);

-- Enable Row Level Security
ALTER TABLE bmw_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_model_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_part_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_oem_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_part_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_part_diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_part_supersessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmw_part_alternatives ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON bmw_series FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_models FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_model_variants FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_part_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_oem_parts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_part_compatibility FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_part_diagrams FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_part_supersessions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bmw_part_alternatives FOR SELECT USING (true);

-- Create functions for advanced searching
CREATE OR REPLACE FUNCTION search_bmw_parts(
    search_query TEXT DEFAULT NULL,
    part_number_query TEXT DEFAULT NULL,
    category_codes TEXT[] DEFAULT NULL,
    series_codes TEXT[] DEFAULT NULL,
    engine_codes TEXT[] DEFAULT NULL,
    year_from INTEGER DEFAULT NULL,
    year_to INTEGER DEFAULT NULL,
    include_discontinued BOOLEAN DEFAULT FALSE,
    limit_count INTEGER DEFAULT 100,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    part_id UUID,
    part_number VARCHAR(50),
    part_name VARCHAR(500),
    description TEXT,
    category_name VARCHAR(200),
    price_msrp DECIMAL(10,2),
    is_discontinued BOOLEAN,
    compatible_models TEXT[],
    compatible_engines TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        p.id,
        p.part_number,
        p.part_name,
        p.description,
        c.category_name,
        p.price_msrp,
        p.is_discontinued,
        ARRAY_AGG(DISTINCT m.model_name) as compatible_models,
        ARRAY_AGG(DISTINCT unnest(pc.engine_specific)) as compatible_engines
    FROM bmw_oem_parts p
    LEFT JOIN bmw_part_categories c ON p.category_id = c.id
    LEFT JOIN bmw_part_compatibility pc ON p.id = pc.part_id
    LEFT JOIN bmw_models m ON pc.model_id = m.id
    WHERE
        (search_query IS NULL OR 
         p.part_name ILIKE '%' || search_query || '%' OR
         p.description ILIKE '%' || search_query || '%' OR
         p.part_number ILIKE '%' || search_query || '%')
        AND (part_number_query IS NULL OR p.part_number = part_number_query)
        AND (category_codes IS NULL OR c.category_code = ANY(category_codes))
        AND (series_codes IS NULL OR m.series_code = ANY(series_codes))
        AND (engine_codes IS NULL OR pc.engine_specific && engine_codes)
        AND (year_from IS NULL OR pc.production_end >= year_from)
        AND (year_to IS NULL OR pc.production_start <= year_to)
        AND (include_discontinued = TRUE OR p.is_discontinued = FALSE)
    GROUP BY p.id, p.part_number, p.part_name, p.description, c.category_name, p.price_msrp, p.is_discontinued
    ORDER BY p.part_name
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get parts for specific vehicle
CREATE OR REPLACE FUNCTION get_vehicle_parts(
    vehicle_series_code TEXT,
    vehicle_model_name TEXT,
    vehicle_year INTEGER,
    vehicle_engine_code TEXT DEFAULT NULL,
    category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    part_id UUID,
    part_number VARCHAR(50),
    part_name VARCHAR(500),
    description TEXT,
    category_name VARCHAR(200),
    price_msrp DECIMAL(10,2),
    installation_notes TEXT,
    diagram_position VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        p.id,
        p.part_number,
        p.part_name,
        p.description,
        c.category_name,
        p.price_msrp,
        p.installation_notes,
        p.diagram_position
    FROM bmw_oem_parts p
    JOIN bmw_part_categories c ON p.category_id = c.id
    JOIN bmw_part_compatibility pc ON p.id = pc.part_id
    JOIN bmw_models m ON pc.model_id = m.id
    WHERE
        m.series_code = vehicle_series_code
        AND m.model_name ILIKE '%' || vehicle_model_name || '%'
        AND pc.production_start <= vehicle_year
        AND pc.production_end >= vehicle_year
        AND (vehicle_engine_code IS NULL OR vehicle_engine_code = ANY(pc.engine_specific))
        AND (category_filter IS NULL OR c.category_code = category_filter)
        AND p.is_discontinued = FALSE
    ORDER BY c.category_name, p.part_name;
END;
$$ LANGUAGE plpgsql;

-- Create materialized view for fast part searching
CREATE MATERIALIZED VIEW bmw_parts_search_view AS
SELECT 
    p.id,
    p.part_number,
    p.part_name,
    p.description,
    p.price_msrp,
    p.is_discontinued,
    c.category_code,
    c.category_name,
    ARRAY_AGG(DISTINCT m.series_code) as compatible_series,
    ARRAY_AGG(DISTINCT m.model_name) as compatible_models,
    ARRAY_AGG(DISTINCT unnest(pc.engine_specific)) as compatible_engines,
    MIN(pc.production_start) as earliest_year,
    MAX(pc.production_end) as latest_year,
    to_tsvector('english', p.part_name || ' ' || COALESCE(p.description, '') || ' ' || p.part_number) as search_vector
FROM bmw_oem_parts p
LEFT JOIN bmw_part_categories c ON p.category_id = c.id
LEFT JOIN bmw_part_compatibility pc ON p.id = pc.part_id
LEFT JOIN bmw_models m ON pc.model_id = m.id
GROUP BY p.id, p.part_number, p.part_name, p.description, p.price_msrp, p.is_discontinued, c.category_code, c.category_name;

-- Create index on materialized view
CREATE INDEX idx_bmw_parts_search_vector ON bmw_parts_search_view USING gin(search_vector);
CREATE INDEX idx_bmw_parts_search_series ON bmw_parts_search_view USING gin(compatible_series);
CREATE INDEX idx_bmw_parts_search_engines ON bmw_parts_search_view USING gin(compatible_engines);

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_parts_search_view()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY bmw_parts_search_view;
END;
$$ LANGUAGE plpgsql;

-- Summary of database structure
SELECT 
    'BMW REALOEM DATABASE SCHEMA CREATED!' as status,
    'Ready for comprehensive BMW parts data from RealOEM scraping' as message,
    ::text as status,
    'Ready for comprehensive BMW parts data from RealOEM scraping'::text as message,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name LIKE 'bmw_%') as tables_created,
    'Run the RealOEM scraper to populate with hundreds of thousands of BMW parts'::text as next_step;
