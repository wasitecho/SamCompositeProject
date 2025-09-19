package com.professionalplastics.service;

import com.professionalplastics.entity.Product;
import com.professionalplastics.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    /**
     * Get all products
     * @return list of all products
     */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    /**
     * Get product by ID
     * @param id the product ID
     * @return optional product
     */
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    /**
     * Create a new product
     * @param product the product to create
     * @return the created product
     */
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    
    /**
     * Create multiple products
     * @param products list of products to create
     * @return list of created products
     */
    public List<Product> createProducts(List<Product> products) {
        return productRepository.saveAll(products);
    }
    
    /**
     * Update an existing product
     * @param id the product ID
     * @param productDetails the updated product details
     * @return the updated product
     */
    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setProductName(productDetails.getProductName());
            product.setDescription(productDetails.getDescription());
            product.setCategoryName(productDetails.getCategoryName());
            return productRepository.save(product);
        }
        return null;
    }
    
    /**
     * Delete a product by ID
     * @param id the product ID
     * @return true if deleted, false if not found
     */
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    /**
     * Delete all products
     */
    public void deleteAllProducts() {
        productRepository.deleteAll();
    }
    
    /**
     * Get products by category name
     * @param categoryName the category name
     * @return list of products in the category
     */
    public List<Product> getProductsByCategory(String categoryName) {
        return productRepository.findByCategoryNameIgnoreCase(categoryName);
    }
    
    /**
     * Search products by product name
     * @param productName the product name to search for
     * @return list of products matching the name
     */
    public List<Product> searchProductsByName(String productName) {
        return productRepository.findByProductNameContainingIgnoreCase(productName);
    }
}
