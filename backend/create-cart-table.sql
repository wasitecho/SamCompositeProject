-- Create cart table for Add to Cart functionality
CREATE TABLE IF NOT EXISTS cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL CHECK (quantity >= 1),
    total_price DECIMAL(10,2) NOT NULL,
    product_price_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_price_id) REFERENCES product_price(id) ON DELETE CASCADE
);

-- Add index for better performance
CREATE INDEX idx_cart_product_price ON cart(product_price_id);

-- Add comment to table
ALTER TABLE cart COMMENT = 'Shopping cart items linked to product prices';
