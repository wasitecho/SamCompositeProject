-- Check if database exists and create if needed
CREATE DATABASE IF NOT EXISTS plastics_demo;

USE plastics_demo;

-- Check if tables exist
SHOW TABLES;

-- If tables don't exist, they will be created automatically by Hibernate
-- due to spring.jpa.hibernate.ddl-auto=update

-- Check current database connection
SELECT 'Database connection successful' as status;
