@echo off
echo Testing Cart Functionality...
echo.

echo 1. Testing GET /api/cart (should return empty array if no items)
curl -X GET http://localhost:8080/api/cart -H "Content-Type: application/json"
echo.
echo.

echo 2. Testing POST /api/cart (add item)
echo Adding item with productPriceId=1, quantity=2...
curl -X POST http://localhost:8080/api/cart -H "Content-Type: application/json" -d "{\"productPriceId\": 1, \"quantity\": 2}"
echo.
echo.

echo 3. Testing GET /api/cart (should return the added item)
curl -X GET http://localhost:8080/api/cart -H "Content-Type: application/json"
echo.
echo.

echo 4. Testing PUT /api/cart/1 (update quantity)
echo Updating cart item 1 with quantity=3...
curl -X PUT http://localhost:8080/api/cart/1 -H "Content-Type: application/json" -d "{\"quantity\": 3}"
echo.
echo.

echo 5. Testing DELETE /api/cart/1 (remove item)
echo Removing cart item 1...
curl -X DELETE http://localhost:8080/api/cart/1 -H "Content-Type: application/json"
echo.
echo.

echo Test completed!
pause
