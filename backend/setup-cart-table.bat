@echo off
echo Setting up Cart table for Add to Cart functionality...
echo.

REM Check if MySQL is running
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL is not installed or not in PATH.
    echo Please install MySQL and add it to your PATH.
    pause
    exit /b 1
)

echo MySQL found. Creating cart table...
echo.

REM Run the SQL script
mysql -u root -p plastics_demo < create-cart-table.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ Cart table created successfully!
    echo.
    echo The cart table has been created with the following structure:
    echo - id (Primary Key)
    echo - quantity (Number of items)
    echo - total_price (Calculated price)
    echo - product_price_id (Foreign Key to product_price table)
    echo - created_at (Timestamp)
    echo - updated_at (Timestamp)
    echo.
    echo You can now use the Add to Cart functionality in your application.
) else (
    echo.
    echo ❌ Failed to create cart table.
    echo Please check your MySQL connection and try again.
)

echo.
pause
