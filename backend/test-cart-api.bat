@echo off
echo Testing Cart API endpoints...
echo.

REM Test if the cart table exists
echo 1. Checking if cart table exists...
mysql -u root -p -e "USE plastics_demo; DESCRIBE cart;" 2>nul
if %errorlevel% neq 0 (
    echo ❌ Cart table does not exist!
    echo Please run: setup-cart-table.bat
    pause
    exit /b 1
) else (
    echo ✅ Cart table exists
)

echo.
echo 2. Testing Cart API endpoints...
echo.

REM Test GET /api/cart
echo Testing GET /api/cart...
curl -X GET http://localhost:8080/api/cart -H "Content-Type: application/json" 2>nul
if %errorlevel% neq 0 (
    echo ❌ GET /api/cart failed - Make sure the Spring Boot app is running
) else (
    echo ✅ GET /api/cart working
)

echo.
echo 3. Testing POST /api/cart (this will fail if no product_price data exists)...
echo Testing POST /api/cart...
curl -X POST http://localhost:8080/api/cart -H "Content-Type: application/json" -d "{\"productPriceId\": 1, \"quantity\": 1}" 2>nul
if %errorlevel% neq 0 (
    echo ❌ POST /api/cart failed
) else (
    echo ✅ POST /api/cart working
)

echo.
echo Test completed. Check the output above for any errors.
pause
