@echo off
echo ========================================
echo Updating Product Details Thickness Table Structure
echo ========================================
echo.
echo This script will update the product_details_thickness table to use numeric thickness
echo instead of the thicknessName column.
echo.
echo WARNING: This will modify your database structure!
echo Make sure you have a backup before proceeding.
echo.
pause

echo.
echo Running database migration...
echo.

mysql -u root -p professional_plastics < update-thickness-table-structure.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Database migration completed successfully!
    echo ========================================
    echo.
    echo The product_details_thickness table has been updated to use:
    echo - thickness (DECIMAL) - Product thickness in mm
    echo - thicknessName is now computed as "thickness + mm"
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
