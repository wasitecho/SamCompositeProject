@echo off
echo Setting up Quotation Tables...
echo.

REM Check if MySQL is running
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL is not installed or not in PATH
    echo Please install MySQL and add it to your PATH
    pause
    exit /b 1
)

echo MySQL found. Setting up quotation tables...
echo.

REM Run the SQL script
mysql -u root -p plastics_demo < create-quotation-tables.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ Quotation tables created successfully!
    echo.
    echo Tables created:
    echo - full_sheets_quotation
    echo - cut_to_size_quotation
    echo.
) else (
    echo.
    echo ❌ Error creating quotation tables
    echo Please check your MySQL connection and try again
    echo.
)

pause
