@echo off
echo ========================================
echo Updating Product Details Size Table Structure
echo ========================================
echo.
echo This script will update the product_details_size table to use length and breadth columns
echo instead of the sizeName column.
echo.
echo WARNING: This will modify your database structure!
echo Make sure you have a backup before proceeding.
echo.
pause

echo.
echo Running database migration...
echo.

mysql -u root -p professional_plastics < update-size-table-structure.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Database migration completed successfully!
    echo ========================================
    echo.
    echo The product_details_size table has been updated to use:
    echo - length (INT) - Product length in mm
    echo - breadth (INT) - Product breadth in mm
    echo - sizeName is now computed as "length x breadth"
    echo.
    echo You can now restart your Spring Boot application.
) else (
    echo.
    echo ========================================
    echo Database migration failed!
    echo ========================================
    echo.
    echo Please check the error messages above and try again.
    echo Make sure MySQL is running and you have the correct credentials.
)

echo.
pause
