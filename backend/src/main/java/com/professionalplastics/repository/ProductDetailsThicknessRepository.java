package com.professionalplastics.repository;

import com.professionalplastics.entity.ProductDetailsThickness;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDetailsThicknessRepository extends JpaRepository<ProductDetailsThickness, Long> {
    
    List<ProductDetailsThickness> findAllByOrderByThicknessAsc();
    
    boolean existsByThickness(Double thickness);
}
