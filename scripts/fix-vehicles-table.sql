-- Fix vehicles table to ensure all columns exist
-- This script adds missing columns if they don't exist

-- Add body_type column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicles' AND column_name = 'body_type') THEN
        ALTER TABLE vehicles ADD COLUMN body_type TEXT;
    END IF;
END $$;

-- Add chassis_code column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicles' AND column_name = 'chassis_code') THEN
        ALTER TABLE vehicles ADD COLUMN chassis_code TEXT;
    END IF;
END $$;

-- Add transmission column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicles' AND column_name = 'transmission') THEN
        ALTER TABLE vehicles ADD COLUMN transmission TEXT;
    END IF;
END $$;

-- Add other missing columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicles' AND column_name = 'color') THEN
        ALTER TABLE vehicles ADD COLUMN color TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicles' AND column_name = 'purchase_date') THEN
        ALTER TABLE vehicles ADD COLUMN purchase_date DATE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicles' AND column_name = 'purchase_price') THEN
        ALTER TABLE vehicles ADD COLUMN purchase_price DECIMAL(10,2);
    END IF;
END $$;

-- Update existing vehicles to have default values for new columns
UPDATE vehicles 
SET body_type = 'Unknown' 
WHERE body_type IS NULL;

-- Add helpful comment
COMMENT ON COLUMN vehicles.body_type IS 'Body type of the vehicle (Sedan, Coupe, Convertible, etc.)';
</sql>
