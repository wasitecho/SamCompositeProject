@echo off
echo ========================================
echo   Professional Plastics Backend
echo ========================================
echo.

REM Set Java environment
set JAVA_HOME=C:\Program Files\Java\jdk-17.0.12
set PATH=%JAVA_HOME%\bin;%PATH%

echo Setting up Java environment...
echo JAVA_HOME = %JAVA_HOME%
echo.

REM Test Java
echo Testing Java installation...
"%JAVA_HOME%\bin\java.exe" -version
if %errorlevel% neq 0 (
    echo ERROR: Java not found at %JAVA_HOME%
    echo Please install Java 17 or update the path in this script
    pause
    exit /b 1
)
echo.

REM Check if Maven wrapper exists
if exist "mvnw.cmd" (
    echo Using Maven wrapper...
    call mvnw.cmd clean compile
    if %errorlevel% neq 0 (
        echo ERROR: Maven compilation failed
        pause
        exit /b 1
    )
    echo.
    echo Starting Spring Boot application...
    call mvnw.cmd spring-boot:run
) else (
    echo Maven wrapper not found. Please install Maven or run setup-environment.bat
    echo.
    echo To install Maven:
    echo 1. Download from: https://maven.apache.org/download.cgi
    echo 2. Extract to C:\Program Files\Apache\maven
    echo 3. Add C:\Program Files\Apache\maven\bin to your PATH
    echo 4. Restart this script
    pause
    exit /b 1
)

echo.
echo Application started! Check http://localhost:8080
pause
