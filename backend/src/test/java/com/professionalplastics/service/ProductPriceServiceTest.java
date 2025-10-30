package com.professionalplastics.service;

import com.professionalplastics.dtos.ProductPriceDTO;
import com.professionalplastics.entity.*;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductPriceServiceTest {

    @Mock
    private ProductPriceRepository priceRepository;
    @Mock
    private ProductDetailsRepository productDetailsRepository;
    @Mock
    private ProductDetailsThicknessRepository thicknessRepository;
    @Mock
    private ProductDetailsSizeRepository sizeRepository;

    @InjectMocks
    private ProductPriceService priceService;

    private ProductDetails testProductDetails;
    private ProductDetailsThickness testThickness;
    private ProductDetailsSize testSize;
    private ProductPrice testProductPrice;
    private ProductPriceDTO testProductPriceDTO;

    @BeforeEach
    void setUp() {
        testProductDetails = new ProductDetails("Test Series", new Grade("TEST001", new Category("Test Category")));
        testProductDetails.setId(1L);
        
        testThickness = new ProductDetailsThickness(2.5);
        testThickness.setId(1L);
        
        testSize = new ProductDetailsSize(100, 200);
        testSize.setId(1L);
        
        testProductPrice = new ProductPrice(testProductDetails, testThickness, testSize, new BigDecimal("100.00"));
        testProductPrice.setId(1L);
        
        testProductPriceDTO = new ProductPriceDTO(1L, 1L, 1L, 1L, new BigDecimal("100.00"), "2.5mm", 100, 200);
    }

    @Test
    void getById_WhenPriceExists_ShouldReturnPriceDTO() {
        // Given
        when(priceRepository.findById(1L)).thenReturn(Optional.of(testProductPrice));

        // When
        ProductPriceDTO result = priceService.getById(1L);

        // Then
        assertNotNull(result);
        assertEquals(testProductPriceDTO.getId(), result.getId());
        assertEquals(testProductPriceDTO.getPrice(), result.getPrice());
    }

    @Test
    void getById_WhenPriceDoesNotExist_ShouldThrowException() {
        // Given
        when(priceRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> priceService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllPrices() {
        // Given
        List<ProductPrice> prices = Arrays.asList(testProductPrice);
        when(priceRepository.findAll()).thenReturn(prices);

        // When
        List<ProductPriceDTO> result = priceService.getAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProductPriceDTO.getId(), result.get(0).getId());
    }

    @Test
    void create_WithValidData_ShouldCreateAndReturnPriceDTO() {
        // Given
        when(productDetailsRepository.findById(1L)).thenReturn(Optional.of(testProductDetails));
        when(thicknessRepository.findById(1L)).thenReturn(Optional.of(testThickness));
        when(sizeRepository.findById(1L)).thenReturn(Optional.of(testSize));
        when(priceRepository.findByProductDetailAndThicknessAndSize(testProductDetails, testThickness, testSize))
                .thenReturn(Optional.empty());
        when(priceRepository.save(any(ProductPrice.class))).thenReturn(testProductPrice);

        // When
        ProductPriceDTO result = priceService.create(testProductPriceDTO);

        // Then
        assertNotNull(result);
        assertEquals(testProductPriceDTO.getId(), result.getId());
        verify(priceRepository).save(any(ProductPrice.class));
    }

    @Test
    void create_WithInvalidPrice_ShouldThrowException() {
        // Given
        testProductPriceDTO.setPrice(BigDecimal.ZERO);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> priceService.create(testProductPriceDTO));
    }

    @Test
    void create_WithNonExistentProductDetails_ShouldThrowException() {
        // Given
        when(productDetailsRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> priceService.create(testProductPriceDTO));
    }

    @Test
    void create_WithExistingCombination_ShouldThrowException() {
        // Given
        when(productDetailsRepository.findById(1L)).thenReturn(Optional.of(testProductDetails));
        when(thicknessRepository.findById(1L)).thenReturn(Optional.of(testThickness));
        when(sizeRepository.findById(1L)).thenReturn(Optional.of(testSize));
        when(priceRepository.findByProductDetailAndThicknessAndSize(testProductDetails, testThickness, testSize))
                .thenReturn(Optional.of(testProductPrice));

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> priceService.create(testProductPriceDTO));
    }

    @Test
    void update_WhenPriceExists_ShouldUpdateAndReturnPriceDTO() {
        // Given
        when(priceRepository.findById(1L)).thenReturn(Optional.of(testProductPrice));
        when(priceRepository.save(any(ProductPrice.class))).thenReturn(testProductPrice);

        // When
        ProductPriceDTO result = priceService.update(1L, testProductPriceDTO);

        // Then
        assertNotNull(result);
        assertEquals(testProductPriceDTO.getId(), result.getId());
        verify(priceRepository).save(testProductPrice);
    }

    @Test
    void update_WhenPriceDoesNotExist_ShouldThrowException() {
        // Given
        when(priceRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> priceService.update(1L, testProductPriceDTO));
    }

    @Test
    void delete_WhenPriceExists_ShouldDeletePrice() {
        // Given
        when(priceRepository.existsById(1L)).thenReturn(true);

        // When
        priceService.delete(1L);

        // Then
        verify(priceRepository).deleteById(1L);
    }

    @Test
    void delete_WhenPriceDoesNotExist_ShouldThrowException() {
        // Given
        when(priceRepository.existsById(1L)).thenReturn(false);

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> priceService.delete(1L));
    }

    @Test
    void getByGrade_ShouldReturnPricesForGrade() {
        // Given
        List<ProductPrice> prices = Arrays.asList(testProductPrice);
        when(priceRepository.findByGradeId(1L)).thenReturn(prices);

        // When
        List<ProductPriceDTO> result = priceService.getByGrade(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProductPriceDTO.getId(), result.get(0).getId());
    }

    @Test
    void toCreateResponse_ShouldReturnFormattedResponse() {
        // When
        Map<String, Object> result = priceService.toCreateResponse(testProductPriceDTO);

        // Then
        assertNotNull(result);
        assertTrue((Boolean) result.get("success"));
        assertEquals("Price added successfully", result.get("message"));
        assertEquals(testProductPriceDTO, result.get("price"));
    }
}
