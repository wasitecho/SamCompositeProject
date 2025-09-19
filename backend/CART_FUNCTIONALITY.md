# 🛒 Add to Cart Functionality

This document describes the implementation of the Add to Cart functionality for the Professional Plastics application.

## 📋 Overview

The Add to Cart feature allows users to:
- Add products to a shopping cart with specific configurations (Series, Thickness, Size)
- View all cart items with detailed product information
- Update quantities and recalculate total prices
- Remove items from the cart
- Work independently from the quotation system

## 🗄️ Database Schema

### Cart Table
```sql
CREATE TABLE cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL CHECK (quantity >= 1),
    total_price DECIMAL(10,2) NOT NULL,
    product_price_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_price_id) REFERENCES product_price(id) ON DELETE CASCADE
);
```

### Relationships
- **Cart** → **ProductPrice** (Many-to-One)
- **ProductPrice** → **ProductDetails** (Many-to-One)
- **ProductPrice** → **ProductDetailsThickness** (Many-to-One)
- **ProductPrice** → **ProductDetailsSize** (Many-to-One)

## 🔧 Backend Implementation

### 1. Entity Classes
- **Cart.java** - JPA entity for cart items
- **CartDTO.java** - Data Transfer Object for API responses

### 2. Repository
- **CartRepository.java** - JPA repository with custom queries

### 3. Controller
- **CartController.java** - REST API endpoints

### 4. API Endpoints

#### Add Item to Cart
```
POST /api/cart
Content-Type: application/json

{
    "productPriceId": 1,
    "quantity": 2
}
```

#### Get Cart Items
```
GET /api/cart
```

#### Update Cart Item
```
PUT /api/cart/{id}
Content-Type: application/json

{
    "quantity": 3
}
```

#### Remove Cart Item
```
DELETE /api/cart/{id}
```

## 🎨 Frontend Implementation

### 1. Services
- **cart.js** - API service functions for cart operations

### 2. Components
- **ProductDetailsPage.jsx** - Updated with Add to Cart button and modal
- **CartPage.jsx** - New page for cart management
- **Navbar.jsx** - Updated with Cart navigation link

### 3. Features

#### ProductDetailsPage
- Add to Cart button next to Get Quotation button
- Modal popup for quantity selection
- Real-time price calculation
- Success/error messaging

#### CartPage
- Table view of all cart items
- Quantity adjustment with +/- buttons
- Remove item functionality
- Total price calculation
- Responsive design with Bootstrap

## 🚀 Setup Instructions

### 1. Database Setup
```bash
# Run the cart table creation script
mysql -u root -p plastics_demo < create-cart-table.sql

# Or use the batch file
setup-cart-table.bat
```

### 2. Backend Setup
The cart functionality is automatically available once the Spring Boot application starts. No additional configuration is required.

### 3. Frontend Setup
The cart functionality is integrated into the existing React application. No additional setup is required.

## 🔄 Workflow

1. **User browses products** → Selects Series, Thickness, Size
2. **Clicks "Add to Cart"** → Modal opens with quantity selection
3. **Confirms quantity** → Item added to cart via API
4. **Views cart** → Navigate to Cart page via Navbar
5. **Manages cart** → Update quantities or remove items
6. **Independent operation** → Cart works separately from quotations

## 💡 Key Features

- **Auto-calculation**: Total price = unit price × quantity
- **Duplicate handling**: Adding same product increases quantity
- **Real-time updates**: Cart updates immediately after changes
- **Error handling**: Comprehensive error messages and validation
- **Responsive design**: Works on desktop and mobile devices
- **Independent operation**: Cart and quotation systems work separately

## 🧪 Testing

### Backend Testing
Test the API endpoints using:
- Postman
- curl commands
- Frontend integration

### Frontend Testing
1. Navigate to a product details page
2. Select product configuration
3. Click "Add to Cart"
4. Verify modal functionality
5. Navigate to Cart page
6. Test quantity updates and item removal

## 📝 Notes

- Cart items are stored in the database (not session-based)
- Total price is automatically calculated on the backend
- Cart functionality is independent of the quotation system
- All cart operations include proper error handling and validation
- The implementation follows REST API best practices
- Frontend uses Bootstrap for consistent styling
