@echo off
echo Testing API endpoints...
echo.

echo 1. Testing if backend is running...
curl -s http://localhost:8080/api/product-thickness
if %errorlevel% neq 0 (
    echo ERROR: Backend server is not running on port 8080
    echo Please start the backend server first
    pause
    exit /b 1
)

echo.
echo 2. Testing product thickness endpoint...
curl -s http://localhost:8080/api/product-thickness
echo.

echo 3. Testing product size endpoint...
curl -s http://localhost:8080/api/product-size
echo.

echo 4. Testing product details endpoint (this might fail if no grade exists)...
curl -s "http://localhost:8080/api/product-details?gradeId=1"
echo.

echo.
echo API endpoint test completed.
pause
