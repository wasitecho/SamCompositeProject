package com.professionalplastics.repository;

import com.professionalplastics.entity.FullSheetsQuotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FullSheetsQuotationRepository extends JpaRepository<FullSheetsQuotation, Long> {

    @Query("SELECT f FROM FullSheetsQuotation f " +
           "JOIN FETCH f.productDetail pd " +
           "JOIN FETCH pd.grade g " +
           "JOIN FETCH g.category c " +
           "ORDER BY f.createdAt DESC")
    List<FullSheetsQuotation> findAllWithGrade();

    @Query("SELECT f FROM FullSheetsQuotation f " +
           "JOIN FETCH f.productDetail pd " +
           "JOIN FETCH pd.grade g " +
           "JOIN FETCH g.category c " +
           "WHERE f.id = :id")
    Optional<FullSheetsQuotation> findByIdWithGrade(@Param("id") Long id);

    @Query("SELECT f FROM FullSheetsQuotation f " +
           "JOIN FETCH f.productDetail pd " +
           "JOIN FETCH pd.grade g " +
           "JOIN FETCH g.category c " +
           "WHERE pd.grade.id = :gradeId " +
           "ORDER BY f.createdAt DESC")
    List<FullSheetsQuotation> findByGradeId(@Param("gradeId") Long gradeId);
}
