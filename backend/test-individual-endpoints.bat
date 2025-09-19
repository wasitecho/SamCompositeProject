@echo off
echo Testing Individual Add Endpoints
echo ================================

echo.
echo 1. Testing Series (Product Details) Add:
curl -X POST http://localhost:8080/api/product-details ^
  -H "Content-Type: application/json" ^
  -d "{\"gradeId\": 1, \"series\": \"Test Series\"}"
echo.

echo.
echo 2. Testing Thickness Add:
curl -X POST http://localhost:8080/api/product-thickness ^
  -H "Content-Type: application/json" ^
  -d "{\"thicknessName\": \"Test Thickness\"}"
echo.

echo.
echo 3. Testing Size Add:
curl -X POST http://localhost:8080/api/product-size ^
  -H "Content-Type: application/json" ^
  -d "{\"sizeName\": \"Test Size\"}"
echo.

echo.
echo 4. Testing Price Add (requires existing product detail, thickness, and size):
curl -X POST http://localhost:8080/api/product-price ^
  -H "Content-Type: application/json" ^
  -d "{\"productDetailId\": 1, \"thicknessId\": 1, \"sizeId\": 1, \"type\": \"Test Type\", \"price\": 10.50}"
echo.

echo.
echo All individual endpoint tests completed!
pause
