package com.professionalplastics.service;

import com.professionalplastics.dtos.ProductDetailsSizeDTO;
import com.professionalplastics.entity.ProductDetailsSize;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.ProductDetailsSizeRepository;
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
class ProductDetailsSizeServiceTest {

    @Mock
    private ProductDetailsSizeRepository sizeRepository;

    @InjectMocks
    private ProductDetailsSizeService sizeService;

    private ProductDetailsSize testSize;
    private ProductDetailsSizeDTO testSizeDTO;

    @BeforeEach
    void setUp() {
        testSize = new ProductDetailsSize(100, 200);
        testSize.setId(1L);
        
        testSizeDTO = new ProductDetailsSizeDTO(1L, 100, 200);
    }

    @Test
    void getById_WhenSizeExists_ShouldReturnSizeDTO() {
        // Given
        when(sizeRepository.findById(1L)).thenReturn(Optional.of(testSize));

        // When
        ProductDetailsSizeDTO result = sizeService.getById(1L);

        // Then
        assertNotNull(result);
        assertEquals(testSizeDTO.getId(), result.getId());
        assertEquals(testSizeDTO.getLength(), result.getLength());
        assertEquals(testSizeDTO.getBreadth(), result.getBreadth());
    }

    @Test
    void getById_WhenSizeDoesNotExist_ShouldThrowException() {
        // Given
        when(sizeRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> sizeService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllSizes() {
        // Given
        List<ProductDetailsSize> sizes = Arrays.asList(testSize);
        when(sizeRepository.findAllByOrderByLengthAndBreadthAsc()).thenReturn(sizes);

        // When
        List<ProductDetailsSizeDTO> result = sizeService.getAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testSizeDTO.getId(), result.get(0).getId());
    }

    @Test
    void create_WithValidData_ShouldCreateAndReturnSizeDTO() {
        // Given
        when(sizeRepository.existsByLengthAndBreadth(100, 200)).thenReturn(false);
        when(sizeRepository.save(any(ProductDetailsSize.class))).thenReturn(testSize);

        // When
        ProductDetailsSizeDTO result = sizeService.create(testSizeDTO);

        // Then
        assertNotNull(result);
        assertEquals(testSizeDTO.getId(), result.getId());
        verify(sizeRepository).save(any(ProductDetailsSize.class));
    }

    @Test
    void create_WithInvalidLength_ShouldThrowException() {
        // Given
        testSizeDTO.setLength(0);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> sizeService.create(testSizeDTO));
    }

    @Test
    void create_WithInvalidBreadth_ShouldThrowException() {
        // Given
        testSizeDTO.setBreadth(-1);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> sizeService.create(testSizeDTO));
    }

    @Test
    void create_WithExistingSize_ShouldThrowException() {
        // Given
        when(sizeRepository.existsByLengthAndBreadth(100, 200)).thenReturn(true);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> sizeService.create(testSizeDTO));
    }

    @Test
    void update_WhenSizeExists_ShouldUpdateAndReturnSizeDTO() {
        // Given
        when(sizeRepository.findById(1L)).thenReturn(Optional.of(testSize));
        when(sizeRepository.save(any(ProductDetailsSize.class))).thenReturn(testSize);

        // When
        ProductDetailsSizeDTO result = sizeService.update(1L, testSizeDTO);

        // Then
        assertNotNull(result);
        assertEquals(testSizeDTO.getId(), result.getId());
        verify(sizeRepository).save(testSize);
    }

    @Test
    void update_WhenSizeDoesNotExist_ShouldThrowException() {
        // Given
        when(sizeRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> sizeService.update(1L, testSizeDTO));
    }

    @Test
    void delete_WhenSizeExists_ShouldDeleteSize() {
        // Given
        when(sizeRepository.existsById(1L)).thenReturn(true);

        // When
        sizeService.delete(1L);

        // Then
        verify(sizeRepository).deleteById(1L);
    }

    @Test
    void delete_WhenSizeDoesNotExist_ShouldThrowException() {
        // Given
        when(sizeRepository.existsById(1L)).thenReturn(false);

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> sizeService.delete(1L));
    }

    @Test
    void toResponse_ShouldReturnFormattedResponse() {
        // When
        Map<String, Object> result = sizeService.toResponse(testSizeDTO);

        // Then
        assertNotNull(result);
        assertTrue((Boolean) result.get("success"));
        assertEquals("Size added successfully", result.get("message"));
        assertEquals(testSizeDTO, result.get("size"));
    }
}
