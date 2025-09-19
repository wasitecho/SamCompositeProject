@echo off
echo ========================================
echo   Fixing MySQL Connection
echo ========================================
echo.

REM Add MySQL to PATH
set PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin;%PATH%

echo Testing MySQL connection...
echo.

echo Option 1: Try connecting without password
mysql -u root -e "SELECT 'Connection successful!' as status;"
if %errorlevel% equ 0 (
    echo ✅ Connected without password!
    echo.
    echo Creating database...
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS plastics_demo;"
    echo ✅ Database created!
    goto :success
)

echo.
echo Option 2: Try connecting with password 'password'
mysql -u root -ppassword -e "SELECT 'Connection successful!' as status;"
if %errorlevel% equ 0 (
    echo ✅ Connected with password 'password'!
    echo.
    echo Creating database...
    mysql -u root -ppassword -e "CREATE DATABASE IF NOT EXISTS plastics_demo;"
    echo ✅ Database created!
    goto :success
)

echo.
echo Option 3: Try connecting with password 'root'
mysql -u root -proot -e "SELECT 'Connection successful!' as status;"
if %errorlevel% equ 0 (
    echo ✅ Connected with password 'root'!
    echo.
    echo Creating database...
    mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS plastics_demo;"
    echo ✅ Database created!
    goto :success
)

echo.
echo ❌ Could not connect to MySQL
echo.
echo Please try one of these solutions:
echo.
echo 1. Reset MySQL root password:
echo    mysql -u root -p
echo    ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
echo.
echo 2. Create a new user:
echo    mysql -u root -p
echo    CREATE USER 'plastics'@'localhost' IDENTIFIED BY 'password';
echo    GRANT ALL PRIVILEGES ON *.* TO 'plastics'@'localhost';
echo    FLUSH PRIVILEGES;
echo.
echo 3. Use MySQL Workbench to reset password
echo.
pause
exit /b 1

:success
echo.
echo ========================================
echo   MySQL Connection Fixed!
echo ========================================
echo.
echo Database: plastics_demo
echo Host: localhost
echo Port: 3306
echo.
echo You can now run your Spring Boot application:
echo   mvnw.cmd spring-boot:run
echo.
pause
