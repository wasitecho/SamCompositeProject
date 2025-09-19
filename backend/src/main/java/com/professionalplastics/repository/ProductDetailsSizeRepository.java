package com.professionalplastics.repository;

import com.professionalplastics.entity.ProductDetailsSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDetailsSizeRepository extends JpaRepository<ProductDetailsSize, Long> {
    
    @Query("SELECT s FROM ProductDetailsSize s ORDER BY s.length ASC, s.breadth ASC")
    List<ProductDetailsSize> findAllByOrderByLengthAndBreadthAsc();
    
    boolean existsByLengthAndBreadth(Integer length, Integer breadth);
}
