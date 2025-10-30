package com.professionalplastics.service;

import com.professionalplastics.dtos.CartDTO;
import com.professionalplastics.entity.*;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.CartRepository;
import com.professionalplastics.repository.ProductPriceRepository;
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
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private ProductPriceRepository productPriceRepository;

    @InjectMocks
    private CartService cartService;

    private ProductPrice testProductPrice;
    private Cart testCart;
    private CartDTO testCartDTO;

    @BeforeEach
    void setUp() {
        // Setup entities
        Category testCategory = new Category("Test Category");
        Grade testGrade = new Grade("TEST001", testCategory);
        ProductDetails testProductDetails = new ProductDetails("Test Series", testGrade);
        ProductDetailsThickness testThickness = new ProductDetailsThickness(2.5);
        ProductDetailsSize testSize = new ProductDetailsSize(100, 200);
        
        testProductPrice = new ProductPrice(testProductDetails, testThickness, testSize, new BigDecimal("100.00"));
        testProductPrice.setId(1L);
        
        testCart = new Cart(2, new BigDecimal("200.00"), testProductPrice);
        testCart.setId(1L);
        
        testCartDTO = new CartDTO(1L, 2, new BigDecimal("200.00"), new BigDecimal("100.00"), 
                "Test Series", "TEST001", "2.5mm", 100, 200, 1L);
    }

    @Test
    void addToCart_WithNewItem_ShouldCreateCartItem() {
        // Given
        when(productPriceRepository.findById(1L)).thenReturn(Optional.of(testProductPrice));
        when(cartRepository.findByProductPriceId(1L)).thenReturn(null);
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // When
        Map<String, Object> result = cartService.addToCart(1L, 2, null);

        // Then
        assertNotNull(result);
        assertEquals("Item added to cart successfully", result.get("message"));
        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    void addToCart_WithExistingItem_ShouldUpdateQuantity() {
        // Given
        when(productPriceRepository.findById(1L)).thenReturn(Optional.of(testProductPrice));
        when(cartRepository.findByProductPriceId(1L)).thenReturn(testCart);
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // When
        Map<String, Object> result = cartService.addToCart(1L, 1, null);

        // Then
        assertNotNull(result);
        assertEquals("Item added to cart successfully", result.get("message"));
        verify(cartRepository).save(testCart);
    }

    @Test
    void addToCart_WithDiscount_ShouldApplyDiscount() {
        // Given
        when(productPriceRepository.findById(1L)).thenReturn(Optional.of(testProductPrice));
        when(cartRepository.findByProductPriceId(1L)).thenReturn(null);
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // When
        Map<String, Object> result = cartService.addToCart(1L, 2, new BigDecimal("10"));

        // Then
        assertNotNull(result);
        assertEquals("Item added to cart successfully", result.get("message"));
        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    void addToCart_WithNonExistentProductPrice_ShouldThrowException() {
        // Given
        when(productPriceRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> cartService.addToCart(1L, 2, null));
    }

    @Test
    void getCartItems_ShouldReturnAllCartItems() {
        // Given
        List<Cart> cartItems = Arrays.asList(testCart);
        when(cartRepository.findAllWithProductDetails()).thenReturn(cartItems);

        // When
        List<CartDTO> result = cartService.getCartItems();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testCartDTO.getId(), result.get(0).getId());
    }

    @Test
    void updateCartItem_WithValidQuantity_ShouldUpdateCartItem() {
        // Given
        when(cartRepository.findByIdWithProductPrice(1L)).thenReturn(Optional.of(testCart));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // When
        Map<String, Object> result = cartService.updateCartItem(1L, 3);

        // Then
        assertNotNull(result);
        assertEquals("Cart item updated successfully", result.get("message"));
        verify(cartRepository).save(testCart);
    }

    @Test
    void updateCartItem_WithInvalidQuantity_ShouldThrowException() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> cartService.updateCartItem(1L, 0));
    }

    @Test
    void updateCartItem_WithNonExistentCartItem_ShouldThrowException() {
        // Given
        when(cartRepository.findByIdWithProductPrice(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> cartService.updateCartItem(1L, 3));
    }

    @Test
    void updateCartItem_WithNullProductPrice_ShouldThrowException() {
        // Given
        testCart.setProductPrice(null);
        when(cartRepository.findByIdWithProductPrice(1L)).thenReturn(Optional.of(testCart));

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> cartService.updateCartItem(1L, 3));
    }

    @Test
    void removeCartItem_WhenCartItemExists_ShouldDeleteCartItem() {
        // Given
        when(cartRepository.existsById(1L)).thenReturn(true);

        // When
        cartService.removeCartItem(1L);

        // Then
        verify(cartRepository).deleteById(1L);
    }

    @Test
    void removeCartItem_WhenCartItemDoesNotExist_ShouldThrowException() {
        // Given
        when(cartRepository.existsById(1L)).thenReturn(false);

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> cartService.removeCartItem(1L));
    }
}
