@echo off
echo ========================================
echo   Quick MySQL Setup for Workbench
echo ========================================
echo.

echo Checking for MySQL installation...
where mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ MySQL not found!
    echo.
    echo Please install MySQL first:
    echo 1. Go to: https://dev.mysql.com/downloads/installer/
    echo 2. Download "MySQL Installer for Windows"
    echo 3. Install "MySQL Community Server"
    echo 4. Remember the root password you set
    echo 5. Run this script again
    echo.
    echo Alternative: Install via Chocolatey
    echo   choco install mysql
    echo.
    pause
    exit /b 1
)

echo ✅ MySQL found! Checking if running...
net start | findstr -i mysql >nul
if %errorlevel% neq 0 (
    echo Starting MySQL service...
    net start mysql
    if %errorlevel% neq 0 (
        echo ❌ Failed to start MySQL service
        echo Please start it manually:
        echo 1. Press Win+R, type "services.msc"
        echo 2. Find "MySQL" service and start it
        pause
        exit /b 1
    )
    echo ✅ MySQL service started!
) else (
    echo ✅ MySQL service is already running!
)

echo.
echo Testing MySQL connection...
mysql -u root -p -e "SELECT 'MySQL is working!' as status;" 2>nul
if %errorlevel% neq 0 (
    echo ❌ Cannot connect to MySQL
    echo Please check your root password
    echo.
    echo Try connecting manually:
    echo   mysql -u root -p
    pause
    exit /b 1
)

echo ✅ MySQL connection successful!
echo.

echo Creating database...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS plastics_demo;"
if %errorlevel% neq 0 (
    echo ❌ Failed to create database
    echo Please create it manually in MySQL Workbench
    pause
    exit /b 1
)

echo ✅ Database 'plastics_demo' created!
echo.

echo ========================================
echo   MySQL Workbench Connection Details
echo ========================================
echo.
echo Connection Name: Local MySQL - Plastics Demo
echo Hostname: localhost
echo Port: 3306
echo Username: root
echo Password: [your MySQL password]
echo Database: plastics_demo
echo.
echo Next steps:
echo 1. Open MySQL Workbench
echo 2. Create new connection with above details
echo 3. Test connection
echo 4. Run your Spring Boot app: mvnw.cmd spring-boot:run
echo.
pause
