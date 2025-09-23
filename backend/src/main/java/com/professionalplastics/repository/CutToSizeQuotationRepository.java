package com.professionalplastics.repository;

import com.professionalplastics.entity.CutToSizeQuotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CutToSizeQuotationRepository extends JpaRepository<CutToSizeQuotation, Long> {

    @Query("SELECT c FROM CutToSizeQuotation c " +
           "JOIN FETCH c.productDetail pd " +
           "JOIN FETCH pd.grade g " +
           "JOIN FETCH g.category cat " +
           "ORDER BY c.createdAt DESC")
    List<CutToSizeQuotation> findAllWithGrade();

    @Query("SELECT c FROM CutToSizeQuotation c " +
           "JOIN FETCH c.productDetail pd " +
           "JOIN FETCH pd.grade g " +
           "JOIN FETCH g.category cat " +
           "WHERE c.id = :id")
    Optional<CutToSizeQuotation> findByIdWithGrade(@Param("id") Long id);

    @Query("SELECT c FROM CutToSizeQuotation c " +
           "JOIN FETCH c.productDetail pd " +
           "JOIN FETCH pd.grade g " +
           "JOIN FETCH g.category cat " +
           "WHERE pd.grade.id = :gradeId " +
           "ORDER BY c.createdAt DESC")
    List<CutToSizeQuotation> findByGradeId(@Param("gradeId") Long gradeId);
}
