# Professional Plastics Demo - Backend

This is the backend service for the Professional Plastics demo application, built with Spring Boot 3.x and Java 21.

## Features

- RESTful API for product management
- MySQL database integration
- JPA/Hibernate for data persistence
- Input validation
- Sample data initialization

## Prerequisites

- Java 21
- Maven 3.6+
- MySQL 8.0+

## Setup

1. Create a MySQL database named `plastics_demo`
2. Update the database credentials in `src/main/resources/application.properties`
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/search?name={name}` - Search products by name
- `GET /api/products/price-range?minPrice={min}&maxPrice={max}` - Get products by price range

## Sample Data

The application includes sample data with 5 example products across different categories (Sheets, Rods, Tubing).
