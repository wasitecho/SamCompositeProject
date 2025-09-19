-- Remove type column from product_price table
-- This script removes the type column from the product_price table

-- First, check if the column exists
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'product_price' 
AND COLUMN_NAME = 'type';

-- Remove the type column
ALTER TABLE product_price DROP COLUMN IF EXISTS type;

-- Verify the column has been removed
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'product_price';
