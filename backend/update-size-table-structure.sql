-- Update product_details_size table structure to use length and breadth instead of sizeName
-- This script will migrate existing data and update the table structure

-- Step 1: Add new columns for length and breadth
ALTER TABLE product_details_size 
ADD COLUMN length INT NULL,
ADD COLUMN breadth INT NULL;

-- Step 2: Migrate existing data from sizeName to length and breadth
-- This assumes existing sizeName format is "lengthxbreadth" (e.g., "1220x2420")
UPDATE product_details_size 
SET 
    length = CAST(SUBSTRING_INDEX(sizeName, 'x', 1) AS UNSIGNED),
    breadth = CAST(SUBSTRING_INDEX(sizeName, 'x', -1) AS UNSIGNED)
WHERE sizeName IS NOT NULL 
  AND sizeName REGEXP '^[0-9]+x[0-9]+$';

-- Step 3: Make length and breadth NOT NULL after data migration
ALTER TABLE product_details_size 
MODIFY COLUMN length INT NOT NULL,
MODIFY COLUMN breadth INT NOT NULL;

-- Step 4: Add unique constraint to prevent duplicate length/breadth combinations
ALTER TABLE product_details_size 
ADD CONSTRAINT uk_length_breadth UNIQUE (length, breadth);

-- Step 5: Drop the old sizeName column
ALTER TABLE product_details_size 
DROP COLUMN sizeName;

-- Step 6: Add indexes for better performance
CREATE INDEX idx_size_length_breadth ON product_details_size(length, breadth);

-- Add comment to table
ALTER TABLE product_details_size COMMENT = 'Product size dimensions with length and breadth only';
