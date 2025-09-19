-- SQL script to remove quantity column from product_details table
-- This script can be run manually if needed, but Hibernate should handle it automatically

-- Remove the quantity column from product_details table
ALTER TABLE product_details DROP COLUMN quantity;

-- Note: This script is optional since Hibernate with ddl-auto=update will handle the schema changes automatically
