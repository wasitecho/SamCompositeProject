package com.professionalplastics.repository;

import com.professionalplastics.dtos.GradeDTO;
import com.professionalplastics.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByCategoryId(Long categoryId);
    List<Grade> findByTypeCode(String typeCode); // add this
    @Query("SELECT new com.professionalplastics.dtos.GradeDTO(g.id,g.typeCode) " +
    "FROM Grade g WHERE g.category.id = :categoryId")
    List<GradeDTO> findDtoByCategoryId(@Param("categoryId") Long categoryId);
    @Query("SELECT DISTINCT g FROM Grade g LEFT JOIN FETCH g.category")
    List<Grade> findAllWithCategory();
    @Query("SELECT DISTINCT g FROM Grade g LEFT JOIN FETCH g.category WHERE g.id = :id")
    Optional<Grade> findByIdWithCategory(@Param("id") Long id);
  }
