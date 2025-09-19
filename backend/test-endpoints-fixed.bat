@echo off
echo Testing fixed API endpoints...
echo.

echo 1. Testing product thickness endpoint...
curl -s http://localhost:8080/api/product-thickness
echo.

echo 2. Testing product size endpoint...
curl -s http://localhost:8080/api/product-size
echo.

echo 3. Testing product price endpoint for grade 102...
curl -s http://localhost:8080/api/product-price/grade/102
echo.

echo 4. Testing product details endpoint for grade 102...
curl -s http://localhost:8080/api/product-details/102
echo.

echo.
echo All endpoint tests completed.
echo Check the output above for any errors.
pause
