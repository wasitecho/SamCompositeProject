package com.professionalplastics.repository;

import com.professionalplastics.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * Find category by name
     * @param name the category name
     * @return optional category
     */
    Optional<Category> findByName(String name);
    
    /**
     * Find all categories with their subcategories and products
     * @return list of categories with nested data
     */
    // @Query("SELECT DISTINCT c FROM Category c LEFT JOIN FETCH c.subCategories sc LEFT JOIN FETCH sc.products")
    // List<Category> findAllWithSubCategoriesAndProducts();
    
    /**
     * Find category by id with subcategories and products
     * @param id the category id
     * @return optional category with nested data
     */
    // @Query("SELECT DISTINCT c FROM Category c LEFT JOIN FETCH c.subCategories sc LEFT JOIN FETCH sc.products WHERE c.id = :id")
    // Optional<Category> findByIdWithSubCategoriesAndProducts(@Param("id") Long id);
}


