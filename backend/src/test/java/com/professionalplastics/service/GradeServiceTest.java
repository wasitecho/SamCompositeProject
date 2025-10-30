package com.professionalplastics.service;

import com.professionalplastics.dtos.GradeDTO;
import com.professionalplastics.entity.Category;
import com.professionalplastics.entity.Grade;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.CategoryRepository;
import com.professionalplastics.repository.GradeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GradeServiceTest {

    @Mock
    private GradeRepository gradeRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private GradeService gradeService;

    private Category testCategory;
    private Grade testGrade;
    private GradeDTO testGradeDTO;

    @BeforeEach
    void setUp() {
        testCategory = new Category("Test Category");
        testCategory.setId(1L);
        
        testGrade = new Grade("TEST001", testCategory);
        testGrade.setId(1L);
        
        testGradeDTO = new GradeDTO(1L, "TEST001");
    }

    @Test
    void getById_WhenGradeExists_ShouldReturnGradeDTO() {
        // Given
        when(gradeRepository.findByIdWithCategory(1L)).thenReturn(Optional.of(testGrade));

        // When
        GradeDTO result = gradeService.getById(1L);

        // Then
        assertNotNull(result);
        assertEquals(testGradeDTO.getId(), result.getId());
        assertEquals(testGradeDTO.getTypeCode(), result.getTypeCode());
    }

    @Test
    void getById_WhenGradeDoesNotExist_ShouldThrowException() {
        // Given
        when(gradeRepository.findByIdWithCategory(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> gradeService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllGrades() {
        // Given
        List<Grade> grades = Arrays.asList(testGrade);
        when(gradeRepository.findAllWithCategory()).thenReturn(grades);

        // When
        List<GradeDTO> result = gradeService.getAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testGradeDTO.getId(), result.get(0).getId());
    }

    @Test
    void create_ShouldThrowException() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> gradeService.create(testGradeDTO));
    }

    @Test
    void createWithCategory_WhenCategoryExists_ShouldCreateAndReturnGradeDTO() {
        // Given
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(gradeRepository.save(any(Grade.class))).thenReturn(testGrade);

        // When
        GradeDTO result = gradeService.createWithCategory(1L, testGradeDTO);

        // Then
        assertNotNull(result);
        assertEquals(testGradeDTO.getId(), result.getId());
        verify(gradeRepository).save(any(Grade.class));
    }

    @Test
    void createWithCategory_WhenCategoryDoesNotExist_ShouldThrowException() {
        // Given
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> gradeService.createWithCategory(1L, testGradeDTO));
    }

    @Test
    void update_WhenGradeExists_ShouldUpdateAndReturnGradeDTO() {
        // Given
        when(gradeRepository.findById(1L)).thenReturn(Optional.of(testGrade));
        when(gradeRepository.save(any(Grade.class))).thenReturn(testGrade);

        // When
        GradeDTO result = gradeService.update(1L, testGradeDTO);

        // Then
        assertNotNull(result);
        assertEquals(testGradeDTO.getId(), result.getId());
        verify(gradeRepository).save(testGrade);
    }

    @Test
    void update_WhenGradeDoesNotExist_ShouldThrowException() {
        // Given
        when(gradeRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> gradeService.update(1L, testGradeDTO));
    }

    @Test
    void delete_WhenGradeExists_ShouldDeleteGrade() {
        // Given
        when(gradeRepository.existsById(1L)).thenReturn(true);

        // When
        gradeService.delete(1L);

        // Then
        verify(gradeRepository).deleteById(1L);
    }

    @Test
    void delete_WhenGradeDoesNotExist_ShouldThrowException() {
        // Given
        when(gradeRepository.existsById(1L)).thenReturn(false);

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> gradeService.delete(1L));
    }

    @Test
    void findByCategoryId_ShouldReturnGradesInCategory() {
        // Given
        List<GradeDTO> gradeDTOs = Arrays.asList(testGradeDTO);
        when(gradeRepository.findDtoByCategoryId(1L)).thenReturn(gradeDTOs);

        // When
        List<GradeDTO> result = gradeService.findByCategoryId(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testGradeDTO.getId(), result.get(0).getId());
    }

    @Test
    void findByTypeCode_ShouldReturnGradesWithTypeCode() {
        // Given
        List<Grade> grades = Arrays.asList(testGrade);
        when(gradeRepository.findByTypeCode("TEST001")).thenReturn(grades);

        // When
        List<GradeDTO> result = gradeService.findByTypeCode("TEST001");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("TEST001", result.get(0).getTypeCode());
    }
}
