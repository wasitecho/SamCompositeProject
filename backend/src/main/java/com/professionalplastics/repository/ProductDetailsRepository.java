package com.professionalplastics.repository;

import com.professionalplastics.dtos.ProductDetailsDTO;
import com.professionalplastics.entity.ProductDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductDetailsRepository extends JpaRepository<ProductDetails, Long> {
    
    // Find all product details for a specific grade
    @Query("SELECT new com.professionalplastics.dtos.ProductDetailsDTO(pd.id, pd.series, pd.grade.id, pd.grade.typeCode) " +
           "FROM ProductDetails pd WHERE pd.grade.id = :gradeId")
    List<ProductDetailsDTO> findDtoByGradeId(@Param("gradeId") Long gradeId);
    
    // Find all product details for a grade (with prices and grade)
    @Query("SELECT pd FROM ProductDetails pd LEFT JOIN FETCH pd.productPrices LEFT JOIN FETCH pd.grade WHERE pd.grade.id = :gradeId")
    List<ProductDetails> findByGradeIdWithPrices(@Param("gradeId") Long gradeId);
    
    // Find all product details for a grade
    List<ProductDetails> findByGradeId(Long gradeId);
    
    // Check if series already exists for a grade
    boolean existsByGradeIdAndSeries(Long gradeId, String series);
    
    // Check if series already exists for a grade excluding current record
    boolean existsByGradeIdAndSeriesAndIdNot(Long gradeId, String series, Long id);
    
    // Find product details by series and grade
    Optional<ProductDetails> findByGradeIdAndSeries(Long gradeId, String series);
    
    // Find product details by ID with grade eagerly loaded
    @Query("SELECT pd FROM ProductDetails pd JOIN FETCH pd.grade WHERE pd.id = :id")
    Optional<ProductDetails> findByIdWithGrade(@Param("id") Long id);
}
