@echo off
echo Adding discount column to cart table...
echo.

REM Check if MySQL is running
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL is not installed or not in PATH.
    echo Please install MySQL and add it to your PATH.
    pause
    exit /b 1
)

echo MySQL found. Adding discount column to cart table...
echo.

REM Run the SQL script
mysql -u root -p plastics_demo < add-discount-column.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ Discount column added successfully!
    echo.
    echo The cart table now includes:
    echo - discount column (DECIMAL(5,2)) for storing discount percentage
    echo - Default value: 0.00
    echo.
    echo Cart total prices will now match ProductDetailsPage calculations.
) else (
    echo.
    echo ❌ Failed to add discount column.
    echo Please check your MySQL connection and try again.
)

echo.
pause
