package com.professionalplastics.service;

import com.professionalplastics.dtos.ProductDTO;
import com.professionalplastics.entity.Product;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.ProductRepository;
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
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;
    private ProductDTO testProductDTO;

    @BeforeEach
    void setUp() {
        testProduct = new Product("Test Product", "Test Description", "Test Category");
        testProduct.setId(1L);
        
        testProductDTO = new ProductDTO(1L, "Test Product", "Test Description", "Test Category");
    }

    @Test
    void getById_WhenProductExists_ShouldReturnProductDTO() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // When
        ProductDTO result = productService.getById(1L);

        // Then
        assertNotNull(result);
        assertEquals(testProductDTO.getId(), result.getId());
        assertEquals(testProductDTO.getProductName(), result.getProductName());
        assertEquals(testProductDTO.getDescription(), result.getDescription());
        assertEquals(testProductDTO.getCategoryName(), result.getCategoryName());
    }

    @Test
    void getById_WhenProductDoesNotExist_ShouldThrowException() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> productService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllProducts() {
        // Given
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findAll()).thenReturn(products);

        // When
        List<ProductDTO> result = productService.getAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProductDTO.getId(), result.get(0).getId());
    }

    @Test
    void create_ShouldCreateAndReturnProductDTO() {
        // Given
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        ProductDTO result = productService.create(testProductDTO);

        // Then
        assertNotNull(result);
        assertEquals(testProductDTO.getId(), result.getId());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void update_WhenProductExists_ShouldUpdateAndReturnProductDTO() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        ProductDTO result = productService.update(1L, testProductDTO);

        // Then
        assertNotNull(result);
        assertEquals(testProductDTO.getId(), result.getId());
        verify(productRepository).save(testProduct);
    }

    @Test
    void update_WhenProductDoesNotExist_ShouldThrowException() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> productService.update(1L, testProductDTO));
    }

    @Test
    void delete_WhenProductExists_ShouldDeleteProduct() {
        // Given
        when(productRepository.existsById(1L)).thenReturn(true);

        // When
        productService.delete(1L);

        // Then
        verify(productRepository).deleteById(1L);
    }

    @Test
    void delete_WhenProductDoesNotExist_ShouldThrowException() {
        // Given
        when(productRepository.existsById(1L)).thenReturn(false);

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> productService.delete(1L));
    }

    @Test
    void getByCategoryName_ShouldReturnProductsInCategory() {
        // Given
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findByCategoryNameIgnoreCase("Test Category")).thenReturn(products);

        // When
        List<ProductDTO> result = productService.getByCategoryName("Test Category");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Category", result.get(0).getCategoryName());
    }

    @Test
    void searchByName_ShouldReturnMatchingProducts() {
        // Given
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findByProductNameContainingIgnoreCase("Test")).thenReturn(products);

        // When
        List<ProductDTO> result = productService.searchByName("Test");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Product", result.get(0).getProductName());
    }
}
