@echo off
echo ========================================
echo   Starting MySQL Workbench
echo ========================================
echo.

REM Add MySQL to PATH
set PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin;%PATH%

echo Starting MySQL Workbench...
start "" "C:\Program Files\MySQL\MySQL Workbench 8.0 CE\MySQLWorkbench.exe"

echo.
echo MySQL Workbench is starting...
echo.
echo Connection Details for MySQL Workbench:
echo ========================================
echo Connection Name: Local MySQL - Plastics Demo
echo Hostname: localhost
echo Port: 3306
echo Username: root
echo Password: [your MySQL root password]
echo Database: plastics_demo
echo ========================================
echo.
echo If you haven't created the database yet, run: create-database.bat
echo.
pause
