-- Update product_details_thickness table structure to use numeric thickness instead of thicknessName
-- This script will migrate existing data and update the table structure

-- Step 1: Add new column for thickness
ALTER TABLE product_details_thickness 
ADD COLUMN thickness DECIMAL(5,2) NULL;

-- Step 2: Migrate existing data from thicknessName to thickness
-- This assumes existing thicknessName format contains numeric values (e.g., "2.5mm", "3mm", "1.5mm")
UPDATE product_details_thickness 
SET thickness = CAST(REGEXP_REPLACE(thicknessName, '[^0-9.]', '') AS DECIMAL(5,2))
WHERE thicknessName IS NOT NULL 
  AND thicknessName REGEXP '^[0-9]+(\.[0-9]+)?mm?$';

-- Step 3: Make thickness NOT NULL after data migration
ALTER TABLE product_details_thickness 
MODIFY COLUMN thickness DECIMAL(5,2) NOT NULL;

-- Step 4: Add unique constraint to prevent duplicate thickness values
ALTER TABLE product_details_thickness 
ADD CONSTRAINT uk_thickness UNIQUE (thickness);

-- Step 5: Drop the old thicknessName column
ALTER TABLE product_details_thickness 
DROP COLUMN thicknessName;

-- Step 6: Add index for better performance
CREATE INDEX idx_thickness_value ON product_details_thickness(thickness);

-- Add comment to table
ALTER TABLE product_details_thickness COMMENT = 'Product thickness dimensions in millimeters';
