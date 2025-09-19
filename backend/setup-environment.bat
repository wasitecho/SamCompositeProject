@echo off
echo ========================================
echo   Java and Maven Environment Setup
echo ========================================
echo.

REM Set Java environment
set JAVA_HOME=C:\Program Files\Java\jdk-17.0.12
set PATH=%JAVA_HOME%\bin;%PATH%

echo Java Configuration:
echo JAVA_HOME = %JAVA_HOME%
echo.

REM Test Java
echo Testing Java...
"%JAVA_HOME%\bin\java.exe" -version
if %errorlevel% neq 0 (
    echo ERROR: Java not found at %JAVA_HOME%
    echo Please check your Java installation
    pause
    exit /b 1
)
echo.

REM Check for Maven
echo Checking for Maven...
where mvn >nul 2>&1
if %errorlevel% neq 0 (
    echo Maven not found in PATH
    echo.
    echo Please install Maven:
    echo 1. Download from: https://maven.apache.org/download.cgi
    echo 2. Extract to C:\Program Files\Apache\maven
    echo 3. Add C:\Program Files\Apache\maven\bin to your PATH
    echo.
    echo Or install using Chocolatey: choco install maven
    echo.
    pause
    exit /b 1
) else (
    echo Maven found!
    mvn -version
    echo.
)

REM Test project compilation
echo Testing project compilation...
mvn clean compile
if %errorlevel% neq 0 (
    echo ERROR: Project compilation failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo You can now run:
echo   mvn spring-boot:run
echo.
pause
