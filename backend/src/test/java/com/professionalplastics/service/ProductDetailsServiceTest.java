package com.professionalplastics.service;

import com.professionalplastics.dtos.ProductDetailsDTO;
import com.professionalplastics.entity.Category;
import com.professionalplastics.entity.Grade;
import com.professionalplastics.entity.ProductDetails;
import com.professionalplastics.entity.ProductDetailsSize;
import com.professionalplastics.entity.ProductDetailsThickness;
import com.professionalplastics.entity.ProductPrice;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.GradeRepository;
import com.professionalplastics.repository.ProductDetailsRepository;
import com.professionalplastics.repository.ProductPriceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductDetailsServiceTest {

    @Mock
    private ProductDetailsRepository productDetailsRepository;

    @Mock
    private GradeRepository gradeRepository;

    @Mock
    private ProductPriceRepository priceRepository;

    @InjectMocks
    private ProductDetailsService productDetailsService;

    private Grade testGrade;
    private ProductDetails testProductDetails;
    private ProductDetailsDTO testProductDetailsDTO;
    private ProductPrice testProductPrice;
    private ProductDetailsThickness testThickness;
    private ProductDetailsSize testSize;

    @BeforeEach
    void setUp() {
        Category testCategory = new Category("Test Category");
        testGrade = new Grade("TEST001", testCategory);
        testGrade.setId(1L);
        
        testProductDetails = new ProductDetails("Test Series", testGrade);
        testProductDetails.setId(1L);
        
        testProductDetailsDTO = new ProductDetailsDTO(1L, "Test Series", 1L, "TEST001");
        
        testThickness = new ProductDetailsThickness(2.5);
        testThickness.setId(1L);
        
        testSize = new ProductDetailsSize(100, 200);
        testSize.setId(1L);
        
        testProductPrice = new ProductPrice();
        testProductPrice.setId(1L);
        testProductPrice.setPrice(new BigDecimal("100.00"));
    }

    @Test
    void getById_WhenProductDetailsExists_ShouldReturnProductDetailsDTO() {
        // Given
        when(productDetailsRepository.findByIdWithGrade(1L)).thenReturn(Optional.of(testProductDetails));

        // When
        ProductDetailsDTO result = productDetailsService.getById(1L);

        // Then
        assertNotNull(result);
        assertEquals(testProductDetailsDTO.getId(), result.getId());
        assertEquals(testProductDetailsDTO.getSeries(), result.getSeries());
    }

    @Test
    void getById_WhenProductDetailsDoesNotExist_ShouldThrowException() {
        // Given
        when(productDetailsRepository.findByIdWithGrade(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> productDetailsService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllProductDetails() {
        // Given
        List<ProductDetails> productDetails = Arrays.asList(testProductDetails);
        when(productDetailsRepository.findAll()).thenReturn(productDetails);

        // When
        List<ProductDetailsDTO> result = productDetailsService.getAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProductDetailsDTO.getId(), result.get(0).getId());
    }

    @Test
    void getByGradeId_WhenGradeExists_ShouldReturnProductDetails() {
        // Given
        when(gradeRepository.findById(1L)).thenReturn(Optional.of(testGrade));
        List<ProductDetailsDTO> productDetailsDTOs = Arrays.asList(testProductDetailsDTO);
        when(productDetailsRepository.findDtoByGradeId(1L)).thenReturn(productDetailsDTOs);

        // When
        List<ProductDetailsDTO> result = productDetailsService.getByGradeId(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProductDetailsDTO.getId(), result.get(0).getId());
    }

    @Test
    void getByGradeId_WhenGradeDoesNotExist_ShouldThrowException() {
        // Given
        when(gradeRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> productDetailsService.getByGradeId(1L));
    }

    @Test
    void create_WithValidRequest_ShouldCreateProductDetails() {
        // Given
        Map<String, Object> request = new HashMap<>();
        request.put("gradeId", "1");
        request.put("series", "Test Series");
        
        when(gradeRepository.findById(1L)).thenReturn(Optional.of(testGrade));
        when(productDetailsRepository.existsByGradeIdAndSeries(1L, "Test Series")).thenReturn(false);
        when(productDetailsRepository.save(any(ProductDetails.class))).thenReturn(testProductDetails);

        // When
        Map<String, Object> result = productDetailsService.create(request);

        // Then
        assertNotNull(result);
        assertTrue((Boolean) result.get("success"));
        assertEquals("Product details added successfully", result.get("message"));
        verify(productDetailsRepository).save(any(ProductDetails.class));
    }

    @Test
    void create_WithEmptySeries_ShouldThrowException() {
        // Given
        Map<String, Object> request = new HashMap<>();
        request.put("gradeId", "1");
        request.put("series", "");

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> productDetailsService.create(request));
    }

    @Test
    void create_WithExistingSeries_ShouldThrowException() {
        // Given
        Map<String, Object> request = new HashMap<>();
        request.put("gradeId", "1");
        request.put("series", "Test Series");
        
        when(gradeRepository.findById(1L)).thenReturn(Optional.of(testGrade));
        when(productDetailsRepository.existsByGradeIdAndSeries(1L, "Test Series")).thenReturn(true);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> productDetailsService.create(request));
    }

    @Test
    void getWithPrices_ShouldReturnProductDetailsWithPrices() {
        // Given
        when(gradeRepository.findById(1L)).thenReturn(Optional.of(testGrade));
        List<ProductDetailsDTO> productDetailsDTOs = Arrays.asList(testProductDetailsDTO);
        when(productDetailsRepository.findDtoByGradeId(1L)).thenReturn(productDetailsDTOs);
        
        // Setup ProductPrice with proper relationships
        testProductPrice.setProductDetail(testProductDetails);
        testProductPrice.setThickness(testThickness);
        testProductPrice.setSize(testSize);
        List<ProductPrice> prices = Arrays.asList(testProductPrice);
        when(priceRepository.findByGradeId(1L)).thenReturn(prices);

        // When
        Map<String, Object> result = productDetailsService.getWithPrices(1L);

        // Then
        assertNotNull(result);
        assertTrue((Boolean) result.get("success"));
        assertNotNull(result.get("productDetails"));
    }

    @Test
    void update_WhenProductDetailsExists_ShouldUpdateAndReturnProductDetailsDTO() {
        // Given
        when(productDetailsRepository.findById(1L)).thenReturn(Optional.of(testProductDetails));
        when(productDetailsRepository.save(any(ProductDetails.class))).thenReturn(testProductDetails);

        // When
        ProductDetailsDTO result = productDetailsService.update(1L, testProductDetailsDTO);

        // Then
        assertNotNull(result);
        assertEquals(testProductDetailsDTO.getId(), result.getId());
        verify(productDetailsRepository).save(testProductDetails);
    }

    @Test
    void update_WhenProductDetailsDoesNotExist_ShouldThrowException() {
        // Given
        when(productDetailsRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> productDetailsService.update(1L, testProductDetailsDTO));
    }

    @Test
    void delete_WhenProductDetailsExists_ShouldDeleteProductDetails() {
        // Given
        when(productDetailsRepository.existsById(1L)).thenReturn(true);

        // When
        productDetailsService.delete(1L);

        // Then
        verify(productDetailsRepository).deleteById(1L);
    }

    @Test
    void delete_WhenProductDetailsDoesNotExist_ShouldThrowException() {
        // Given
        when(productDetailsRepository.existsById(1L)).thenReturn(false);

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> productDetailsService.delete(1L));
    }
}
