-- Add discount column to cart table
ALTER TABLE cart ADD COLUMN discount DECIMAL(5,2) DEFAULT 0.00;

-- Add comment to the column
ALTER TABLE cart MODIFY COLUMN discount DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Discount percentage (0-100)';
