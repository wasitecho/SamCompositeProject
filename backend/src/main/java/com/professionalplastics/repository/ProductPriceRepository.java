package com.professionalplastics.repository;

import com.professionalplastics.entity.ProductPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductPriceRepository extends JpaRepository<ProductPrice, Long> {
    
    @Query("SELECT pp FROM ProductPrice pp " +
           "WHERE pp.productDetail = :productDetail " +
           "AND pp.thickness = :thickness " +
           "AND pp.size = :size")
    Optional<ProductPrice> findByProductDetailAndThicknessAndSize(@Param("productDetail") com.professionalplastics.entity.ProductDetails productDetail,
                                                                 @Param("thickness") com.professionalplastics.entity.ProductDetailsThickness thickness,
                                                                 @Param("size") com.professionalplastics.entity.ProductDetailsSize size);
    
    @Query("SELECT pp FROM ProductPrice pp " +
           "JOIN FETCH pp.productDetail pd " +
           "JOIN FETCH pp.thickness t " +
           "JOIN FETCH pp.size s " +
           "WHERE pd.grade.id = :gradeId")
    List<ProductPrice> findByGradeId(@Param("gradeId") Long gradeId);
    
    @Query("SELECT pp FROM ProductPrice pp " +
           "JOIN pp.productDetail pd " +
           "WHERE pd.id = :productDetailId")
    List<ProductPrice> findByProductDetailId(@Param("productDetailId") Long productDetailId);
    
    @Query("SELECT pp FROM ProductPrice pp " +
           "JOIN FETCH pp.productDetail pd " +
           "JOIN FETCH pp.thickness t " +
           "JOIN FETCH pp.size s " +
           "WHERE pp.id = :id")
    Optional<ProductPrice> findByIdWithRelations(@Param("id") Long id);
}
