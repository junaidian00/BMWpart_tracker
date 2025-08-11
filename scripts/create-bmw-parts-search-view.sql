-- Create the materialized view for BMW parts search
-- This view combines parts data with categories and compatibility for efficient searching

-- First, ensure we have the base tables
-- This script assumes the main tables exist from create-maintenance-tables-fixed.sql

-- Create the materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS bmw_parts_search_view AS
SELECT 
  p.id,
  p.part_number,
  p.part_name,
  p.description,
  p.price_msrp,
  p.is_discontinued,
  cat.category_name,
  cat.category_code,
  ARRAY_AGG(DISTINCT c.chassis_code) FILTER (WHERE c.chassis_code IS NOT NULL) as compatible_chassis,
  ARRAY_AGG(DISTINCT unnest(comp.engine_codes)) FILTER (WHERE comp.engine_codes IS NOT NULL) as compatible_engines,
  MIN(comp.production_start) as earliest_year,
  MAX(comp.production_end) as latest_year,
  to_tsvector('english', p.part_name || ' ' || COALESCE(p.description, '') || ' ' || p.part_number || ' ' || COALESCE(cat.category_name, '')) as search_vector
FROM bmw_oem_parts p
LEFT JOIN bmw_part_categories cat ON p.category_id = cat.id
LEFT JOIN bmw_part_compatibility comp ON p.id = comp.part_id
LEFT JOIN bmw_chassis c ON comp.chassis_id = c.id
GROUP BY p.id, p.part_number, p.part_name, p.description, p.price_msrp, p.is_discontinued, cat.category_name, cat.category_code;

-- Create indexes on the materialized view
CREATE INDEX IF NOT EXISTS idx_bmw_parts_search_view_search_vector ON bmw_parts_search_view USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_bmw_parts_search_view_part_number ON bmw_parts_search_view(part_number);
CREATE INDEX IF NOT EXISTS idx_bmw_parts_search_view_category_code ON bmw_parts_search_view(category_code);
CREATE INDEX IF NOT EXISTS idx_bmw_parts_search_view_compatible_chassis ON bmw_parts_search_view USING gin(compatible_chassis);
CREATE INDEX IF NOT EXISTS idx_bmw_parts_search_view_compatible_engines ON bmw_parts_search_view USING gin(compatible_engines);

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW bmw_parts_search_view;

-- Insert additional sample BMW parts if the table is empty
INSERT INTO bmw_oem_parts (part_number, part_name, description, category_id, price_msrp, is_discontinued) 
SELECT * FROM (VALUES
  ('11427566327', 'Oil Filter Element', 'Engine oil filter for N55/B58 engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENG003' LIMIT 1), 24.95, false),
  ('34116855152', 'Front Brake Pad Set', 'Front brake pads for F22/F30 chassis', (SELECT id FROM bmw_part_categories WHERE category_code = 'BRK001' LIMIT 1), 89.95, false),
  ('17127647283', 'Radiator', 'Engine cooling radiator for BMW F-series', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENG004' LIMIT 1), 245.00, false),
  ('11127566327', 'Air Filter', 'Engine air filter for N55/B58 engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENG005' LIMIT 1), 32.50, false),
  ('34356789012', 'Rear Brake Pad Set', 'Rear brake pads for F22/F30 chassis', (SELECT id FROM bmw_part_categories WHERE category_code = 'BRK001' LIMIT 1), 65.95, false),
  ('17137647284', 'Water Pump', 'Electric water pump for BMW turbo engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENG004' LIMIT 1), 189.95, false),
  ('12617566327', 'Spark Plug', 'NGK spark plug for N55/B58 engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ELE001' LIMIT 1), 18.25, false),
  ('12137594937', 'Ignition Coil', 'Ignition coil for N55/B58 engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ELE001' LIMIT 1), 89.50, false),
  ('11617566328', 'Charge Pipe', 'Turbo charge pipe for N55 engine', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENG008' LIMIT 1), 245.00, false),
  ('11617566329', 'Intercooler', 'Intercooler for N55/B58 engines', (SELECT id FROM bmw_part_categories WHERE category_code = 'ENG008' LIMIT 1), 567.80, false)
) AS new_parts(part_number, part_name, description, category_id, price_msrp, is_discontinued)
WHERE NOT EXISTS (SELECT 1 FROM bmw_oem_parts WHERE part_number = new_parts.part_number);

-- Insert additional compatibility data
INSERT INTO bmw_part_compatibility (part_id, chassis_id, production_start, production_end, engine_codes) 
SELECT 
  p.id,
  c.id,
  c.production_start,
  c.production_end,
  CASE 
    WHEN p.part_number IN ('11427566327', '11127566327', '12617566327', '12137594937', '11617566328', '11617566329') 
    THEN ARRAY['N55', 'B58']
    ELSE NULL
  END
FROM bmw_oem_parts p
CROSS JOIN bmw_chassis c
WHERE c.chassis_code IN ('F22', 'F23', 'F30', 'F31', 'F32', 'F33')
AND p.part_number IN ('11427566327', '34116855152', '17127647283', '11127566327', '34356789012', '17137647284', '12617566327', '12137594937', '11617566328', '11617566329')
AND NOT EXISTS (
  SELECT 1 FROM bmw_part_compatibility 
  WHERE part_id = p.id AND chassis_id = c.id
);

-- Refresh the materialized view again after inserting new data
REFRESH MATERIALIZED VIEW bmw_parts_search_view;

-- Create a function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_parts_search_view()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW bmw_parts_search_view;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to refresh the view when parts data changes
CREATE OR REPLACE FUNCTION trigger_refresh_parts_search_view()
RETURNS trigger AS $$
BEGIN
  -- Refresh the materialized view in the background
  PERFORM refresh_parts_search_view();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'refresh_parts_search_on_parts_change') THEN
    CREATE TRIGGER refresh_parts_search_on_parts_change
      AFTER INSERT OR UPDATE OR DELETE ON bmw_oem_parts
      FOR EACH STATEMENT EXECUTE FUNCTION trigger_refresh_parts_search_view();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'refresh_parts_search_on_compatibility_change') THEN
    CREATE TRIGGER refresh_parts_search_on_compatibility_change
      AFTER INSERT OR UPDATE OR DELETE ON bmw_part_compatibility
      FOR EACH STATEMENT EXECUTE FUNCTION trigger_refresh_parts_search_view();
  END IF;
END $$;
