@echo off
echo Testing Product Details Endpoint Fix
echo ====================================

echo.
echo Testing GET /api/product-details/102 (the endpoint that was failing):
curl -X GET http://localhost:8080/api/product-details/102
echo.

echo.
echo Testing GET /api/product-details?gradeId=102:
curl -X GET "http://localhost:8080/api/product-details?gradeId=102"
echo.

echo.
echo Testing GET /api/product-price/grade/102:
curl -X GET http://localhost:8080/api/product-price/grade/102
echo.

echo.
echo All tests completed!
pause
