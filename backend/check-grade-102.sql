-- Check if grade ID 102 exists
USE plastics_demo;

-- Check if grade table exists
SHOW TABLES LIKE 'grade';

-- Check if grade ID 102 exists
SELECT * FROM grade WHERE id = 102;

-- Check all grades
SELECT id, type_code, description FROM grade ORDER BY id;

-- Check if product_details table exists
SHOW TABLES LIKE 'product_details';

-- Check product details for grade 102
SELECT * FROM product_details WHERE grade_id = 102;
