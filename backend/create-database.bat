@echo off
echo ========================================
echo   Creating Database for Plastics Demo
echo ========================================
echo.

REM Add MySQL to PATH
set PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin;%PATH%

echo MySQL is running! Now creating the database...
echo.
echo Please enter your MySQL root password when prompted.
echo.

mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS plastics_demo;"
if %errorlevel% neq 0 (
    echo.
    echo ❌ Failed to create database
    echo Please check your MySQL password and try again
    pause
    exit /b 1
)

echo.
echo ✅ Database 'plastics_demo' created successfully!
echo.

echo Testing database connection...
mysql -u root -p -e "USE plastics_demo; SELECT 'Database connection successful!' as status;"
if %errorlevel% neq 0 (
    echo ❌ Database connection test failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Database Setup Complete!
echo ========================================
echo.
echo Database Details:
echo   Name: plastics_demo
echo   Host: localhost
echo   Port: 3306
echo   Username: root
echo.
echo Next steps:
echo 1. Open MySQL Workbench
echo 2. Connect to localhost:3306 with root user
echo 3. Run your Spring Boot app: mvnw.cmd spring-boot:run
echo.
pause
