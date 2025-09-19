@echo off
echo ========================================
echo   Running Spring Boot with MySQL
echo ========================================
echo.

REM Set Java environment
set JAVA_HOME=C:\Program Files\Java\jdk-17.0.12
set PATH=%JAVA_HOME%\bin;%PATH%

REM Set MySQL credentials (try different combinations)
set DB_USERNAME=root
set DB_PASSWORD=password

echo Java Environment:
echo JAVA_HOME = %JAVA_HOME%
echo.
echo MySQL Credentials:
echo DB_USERNAME = %DB_USERNAME%
echo DB_PASSWORD = %DB_PASSWORD%
echo.

echo Testing Java...
java -version
if %errorlevel% neq 0 (
    echo ❌ Java not found
    pause
    exit /b 1
)

echo ✅ Java is working!
echo.

echo Starting Spring Boot application...
echo If you get MySQL connection errors, try:
echo 1. Run fix-mysql-connection.bat first
echo 2. Or change DB_PASSWORD in this script
echo.

REM Run the application
mvnw.cmd spring-boot:run

echo.
echo Application stopped.
pause
