-- Create Full Sheets Quotation Table
CREATE TABLE IF NOT EXISTS full_sheets_quotation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    series VARCHAR(255) NOT NULL,
    thickness DECIMAL(10,2) NOT NULL,
    size VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_detail_id BIGINT NOT NULL,
    thickness_id BIGINT NOT NULL,
    size_id BIGINT NOT NULL,
    product_price_id BIGINT NOT NULL,
    
    FOREIGN KEY (product_detail_id) REFERENCES product_details(id),
    FOREIGN KEY (thickness_id) REFERENCES product_details_thickness(id),
    FOREIGN KEY (size_id) REFERENCES product_details_size(id),
    FOREIGN KEY (product_price_id) REFERENCES product_price(id)
);

-- Create Cut-to-Size Quotation Table
CREATE TABLE IF NOT EXISTS cut_to_size_quotation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    series VARCHAR(255) NOT NULL,
    thickness DECIMAL(10,2) NOT NULL,
    size_full_sheet VARCHAR(255) NOT NULL,
    cut_length DECIMAL(10,2) NOT NULL,
    cut_width DECIMAL(10,2) NOT NULL,
    machining_cost DECIMAL(10,2) NOT NULL,
    cut_size_area DECIMAL(10,2) NOT NULL,
    quantity_per_sheet INT NOT NULL,
    num_full_sheets_required INT NOT NULL,
    quantity INT NOT NULL,
    base_price_full_sheet DECIMAL(10,2) NOT NULL,
    cut_to_size_price_per_unit DECIMAL(10,2) NOT NULL,
    total_calculated_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_detail_id BIGINT NOT NULL,
    product_price_id BIGINT NOT NULL,
    
    FOREIGN KEY (product_detail_id) REFERENCES product_details(id),
    FOREIGN KEY (product_price_id) REFERENCES product_price(id)
);

-- Add indexes for better performance
CREATE INDEX idx_full_sheets_quotation_created_at ON full_sheets_quotation(created_at);
CREATE INDEX idx_full_sheets_quotation_product_detail ON full_sheets_quotation(product_detail_id);
CREATE INDEX idx_cut_to_size_quotation_created_at ON cut_to_size_quotation(created_at);
CREATE INDEX idx_cut_to_size_quotation_product_detail ON cut_to_size_quotation(product_detail_id);
