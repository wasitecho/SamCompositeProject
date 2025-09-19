package com.professionalplastics.repository;

import com.professionalplastics.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    /**
     * Find products by category name (case-insensitive)
     * @param categoryName the category name
     * @return list of products in the specified category
     */
    List<Product> findByCategoryNameIgnoreCase(String categoryName);
    
    /**
     * Find products by product name containing the given string (case-insensitive)
     * @param productName the product name to search for
     * @return list of products with names containing the search string
     */
    List<Product> findByProductNameContainingIgnoreCase(String productName);
}
