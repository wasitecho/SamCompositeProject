package com.professionalplastics.service;

import com.professionalplastics.dtos.ProductDetailsThicknessDTO;
import com.professionalplastics.entity.ProductDetailsThickness;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.ProductDetailsThicknessRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductDetailsThicknessServiceTest {

    @Mock
    private ProductDetailsThicknessRepository thicknessRepository;

    @InjectMocks
    private ProductDetailsThicknessService thicknessService;

    private ProductDetailsThickness testThickness;
    private ProductDetailsThicknessDTO testThicknessDTO;

    @BeforeEach
    void setUp() {
        testThickness = new ProductDetailsThickness(2.5);
        testThickness.setId(1L);
        
        testThicknessDTO = new ProductDetailsThicknessDTO(1L, 2.5);
    }

    @Test
    void getById_WhenThicknessExists_ShouldReturnThicknessDTO() {
        // Given
        when(thicknessRepository.findById(1L)).thenReturn(Optional.of(testThickness));

        // When
        ProductDetailsThicknessDTO result = thicknessService.getById(1L);

        // Then
        assertNotNull(result);
        assertEquals(testThicknessDTO.getId(), result.getId());
        assertEquals(testThicknessDTO.getThickness(), result.getThickness());
    }

    @Test
    void getById_WhenThicknessDoesNotExist_ShouldThrowException() {
        // Given
        when(thicknessRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> thicknessService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllThicknesses() {
        // Given
        List<ProductDetailsThickness> thicknesses = Arrays.asList(testThickness);
        when(thicknessRepository.findAllByOrderByThicknessAsc()).thenReturn(thicknesses);

        // When
        List<ProductDetailsThicknessDTO> result = thicknessService.getAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testThicknessDTO.getId(), result.get(0).getId());
    }

    @Test
    void create_WithValidData_ShouldCreateAndReturnThicknessDTO() {
        // Given
        when(thicknessRepository.existsByThickness(2.5)).thenReturn(false);
        when(thicknessRepository.save(any(ProductDetailsThickness.class))).thenReturn(testThickness);

        // When
        ProductDetailsThicknessDTO result = thicknessService.create(testThicknessDTO);

        // Then
        assertNotNull(result);
        assertEquals(testThicknessDTO.getId(), result.getId());
        verify(thicknessRepository).save(any(ProductDetailsThickness.class));
    }

    @Test
    void create_WithInvalidThickness_ShouldThrowException() {
        // Given
        testThicknessDTO.setThickness(0.0);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> thicknessService.create(testThicknessDTO));
    }

    @Test
    void create_WithNegativeThickness_ShouldThrowException() {
        // Given
        testThicknessDTO.setThickness(-1.0);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> thicknessService.create(testThicknessDTO));
    }

    @Test
    void create_WithExistingThickness_ShouldThrowException() {
        // Given
        when(thicknessRepository.existsByThickness(2.5)).thenReturn(true);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> thicknessService.create(testThicknessDTO));
    }

    @Test
    void update_WhenThicknessExists_ShouldUpdateAndReturnThicknessDTO() {
        // Given
        when(thicknessRepository.findById(1L)).thenReturn(Optional.of(testThickness));
        when(thicknessRepository.save(any(ProductDetailsThickness.class))).thenReturn(testThickness);

        // When
        ProductDetailsThicknessDTO result = thicknessService.update(1L, testThicknessDTO);

        // Then
        assertNotNull(result);
        assertEquals(testThicknessDTO.getId(), result.getId());
        verify(thicknessRepository).save(testThickness);
    }

    @Test
    void update_WhenThicknessDoesNotExist_ShouldThrowException() {
        // Given
        when(thicknessRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> thicknessService.update(1L, testThicknessDTO));
    }

    @Test
    void delete_WhenThicknessExists_ShouldDeleteThickness() {
        // Given
        when(thicknessRepository.existsById(1L)).thenReturn(true);

        // When
        thicknessService.delete(1L);

        // Then
        verify(thicknessRepository).deleteById(1L);
    }

    @Test
    void delete_WhenThicknessDoesNotExist_ShouldThrowException() {
        // Given
        when(thicknessRepository.existsById(1L)).thenReturn(false);

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> thicknessService.delete(1L));
    }

    @Test
    void toResponse_ShouldReturnFormattedResponse() {
        // When
        Map<String, Object> result = thicknessService.toResponse(testThicknessDTO);

        // Then
        assertNotNull(result);
        assertTrue((Boolean) result.get("success"));
        assertEquals("Thickness added successfully", result.get("message"));
        assertEquals(testThicknessDTO, result.get("thickness"));
    }
}
