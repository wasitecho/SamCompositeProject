package com.professionalplastics.controller;

import com.professionalplastics.dtos.CartDTO;
import com.professionalplastics.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
        try {
            Map<String, Object> response = cartService.addToCart(
                    request.getProductPriceId(),
                    request.getQuantity(),
                    request.getDiscount(),
                    request.getTotalPrice()
            );
            return ResponseEntity.ok(response.get("message"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding item to cart: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<CartDTO>> getCartItems() {
        try {
            return ResponseEntity.ok(cartService.getCartItems());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long id, @RequestBody UpdateCartRequest request) {
        try {
            // Validate quantity
            if (request.getQuantity() == null || request.getQuantity() < 1) {
                return ResponseEntity.badRequest().body("Quantity must be at least 1");
            }

            Map<String, Object> response = cartService.updateCartItem(id, request.getQuantity());
            return ResponseEntity.ok(response.get("message"));
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating cart item: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long id) {
        try {
            cartService.removeCartItem(id);
            return ResponseEntity.ok("Item removed from cart successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error removing item from cart: " + e.getMessage());
        }
    }

    // Request DTOs
    public static class AddToCartRequest {
        private Long productPriceId;
        private Integer quantity;
        private BigDecimal discount; // Discount percentage (0-100)
        private BigDecimal totalPrice; // Optional client-calculated total

        public AddToCartRequest() {}

        public AddToCartRequest(Long productPriceId, Integer quantity) {
            this.productPriceId = productPriceId;
            this.quantity = quantity;
        }

        public Long getProductPriceId() {
            return productPriceId;
        }

        public void setProductPriceId(Long productPriceId) {
            this.productPriceId = productPriceId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public BigDecimal getDiscount() {
            return discount;
        }

        public void setDiscount(BigDecimal discount) {
            this.discount = discount;
        }

        public BigDecimal getTotalPrice() {
            return totalPrice;
        }

        public void setTotalPrice(BigDecimal totalPrice) {
            this.totalPrice = totalPrice;
        }
    }

    public static class UpdateCartRequest {
        private Integer quantity;

        public UpdateCartRequest() {}

        public UpdateCartRequest(Integer quantity) {
            this.quantity = quantity;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
