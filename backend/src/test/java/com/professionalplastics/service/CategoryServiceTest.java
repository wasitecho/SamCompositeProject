package com.professionalplastics.service;

import com.professionalplastics.dtos.CategoryDTO;
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
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private GradeRepository gradeRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category testCategory;
    private CategoryDTO testCategoryDTO;
    private Grade testGrade;

    @BeforeEach
    void setUp() {
        testCategory = new Category("Test Category");
        testCategory.setId(1L);
        
        testCategoryDTO = new CategoryDTO();
        testCategoryDTO.setId(1L);
        testCategoryDTO.setName("Test Category");
        
        testGrade = new Grade("TEST001", testCategory);
        testGrade.setId(1L);
    }

    @Test
    void getById_WhenCategoryExists_ShouldReturnCategoryDTO() {
        // Given
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));

        // When
        CategoryDTO result = categoryService.getById(1L);

        // Then
        assertNotNull(result);
        assertEquals(testCategoryDTO.getId(), result.getId());
        assertEquals(testCategoryDTO.getName(), result.getName());
    }

    @Test
    void getById_WhenCategoryDoesNotExist_ShouldThrowException() {
        // Given
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> categoryService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllCategories() {
        // Given
        List<Category> categories = Arrays.asList(testCategory);
        when(categoryRepository.findAll()).thenReturn(categories);

        // When
        List<CategoryDTO> result = categoryService.getAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testCategoryDTO.getId(), result.get(0).getId());
    }

    @Test
    void create_ShouldCreateAndReturnCategoryDTO() {
        // Given
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);

        // When
        CategoryDTO result = categoryService.create(testCategoryDTO);

        // Then
        assertNotNull(result);
        assertEquals(testCategoryDTO.getId(), result.getId());
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void update_WhenCategoryExists_ShouldUpdateAndReturnCategoryDTO() {
        // Given
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);

        // When
        CategoryDTO result = categoryService.update(1L, testCategoryDTO);

        // Then
        assertNotNull(result);
        assertEquals(testCategoryDTO.getId(), result.getId());
        verify(categoryRepository).save(testCategory);
    }

    @Test
    void update_WhenCategoryDoesNotExist_ShouldThrowException() {
        // Given
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> categoryService.update(1L, testCategoryDTO));
    }

    @Test
    void delete_WhenCategoryExists_ShouldDeleteCategory() {
        // Given
        when(categoryRepository.existsById(1L)).thenReturn(true);

        // When
        categoryService.delete(1L);

        // Then
        verify(categoryRepository).deleteById(1L);
    }

    @Test
    void delete_WhenCategoryDoesNotExist_ShouldThrowException() {
        // Given
        when(categoryRepository.existsById(1L)).thenReturn(false);

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> categoryService.delete(1L));
    }

    @Test
    void getAllWithGrades_ShouldReturnCategoriesWithGrades() {
        // Given
        List<Category> categories = Arrays.asList(testCategory);
        List<Grade> grades = Arrays.asList(testGrade);
        when(categoryRepository.findAll()).thenReturn(categories);
        when(gradeRepository.findByCategoryId(1L)).thenReturn(grades);

        // When
        List<CategoryDTO> result = categoryService.getAllWithGrades();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getGrades().size());
        assertEquals("TEST001", result.get(0).getGrades().get(0));
    }
}
