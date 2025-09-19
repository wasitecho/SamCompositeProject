@echo off
echo ========================================
echo   Starting Professional Plastics Backend
echo ========================================
echo.

REM Set Java environment
set JAVA_HOME=C:\Program Files\Java\jdk-17.0.12
set PATH=%JAVA_HOME%\bin;%PATH%

echo Java Environment:
echo JAVA_HOME = %JAVA_HOME%
echo.

echo Testing Java...
java -version
if %errorlevel% neq 0 (
    echo ❌ Java not found
    pause
    exit /b 1
)

echo.
echo Starting Spring Boot application...
echo This may take a few moments...
echo.

REM Run the application
mvnw.cmd spring-boot:run

echo.
echo Application stopped.
pause
