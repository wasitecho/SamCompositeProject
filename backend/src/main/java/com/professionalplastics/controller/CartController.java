package com.professionalplastics.controller;

import com.professionalplastics.dtos.CartDTO;
import com.professionalplastics.entity.Cart;
import com.professionalplastics.entity.ProductPrice;
import com.professionalplastics.repository.CartRepository;
import com.professionalplastics.repository.ProductPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductPriceRepository productPriceRepository;

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
        try {
            // Validate product price exists
            Optional<ProductPrice> productPriceOpt = productPriceRepository.findById(request.getProductPriceId());
            if (productPriceOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Product price not found");
            }

            ProductPrice productPrice = productPriceOpt.get();
            
            // Check if item already exists in cart
            Cart existingCartItem = cartRepository.findByProductPriceId(request.getProductPriceId());
            
            // Calculate total price with discount
            BigDecimal baseTotal = productPrice.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
            BigDecimal totalPrice = baseTotal;
            
            // Apply discount if provided
            if (request.getDiscount() != null && request.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal discountAmount = baseTotal.multiply(request.getDiscount().divide(BigDecimal.valueOf(100)));
                totalPrice = baseTotal.subtract(discountAmount);
            }
            
            if (existingCartItem != null) {
                // Update existing item quantity
                existingCartItem.setQuantity(existingCartItem.getQuantity() + request.getQuantity());
                // Recalculate total price for the new total quantity
                BigDecimal newBaseTotal = productPrice.getPrice().multiply(BigDecimal.valueOf(existingCartItem.getQuantity()));
                BigDecimal newTotalPrice = newBaseTotal;
                if (request.getDiscount() != null && request.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal discountAmount = newBaseTotal.multiply(request.getDiscount().divide(BigDecimal.valueOf(100)));
                    newTotalPrice = newBaseTotal.subtract(discountAmount);
                }
                existingCartItem.setTotalPrice(newTotalPrice);
                existingCartItem.setDiscount(request.getDiscount());
                cartRepository.save(existingCartItem);
            } else {
                // Create new cart item
                Cart cartItem = new Cart(request.getQuantity(), totalPrice, productPrice);
                cartItem.setDiscount(request.getDiscount());
                cartRepository.save(cartItem);
            }

            return ResponseEntity.ok("Item added to cart successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding item to cart: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<CartDTO>> getCartItems() {
        try {
            List<Cart> cartItems = cartRepository.findAllWithProductDetails();
            List<CartDTO> cartDTOs = cartItems.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(cartDTOs);
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

            Optional<Cart> cartOpt = cartRepository.findByIdWithProductPrice(id);
            if (cartOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Cart cartItem = cartOpt.get();
            
            // Get the product price to calculate total
            ProductPrice productPrice = cartItem.getProductPrice();
            if (productPrice == null) {
                return ResponseEntity.badRequest().body("Product price not found for cart item");
            }
            
            cartItem.setQuantity(request.getQuantity());
            cartItem.setTotalPrice(productPrice.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
            cartRepository.save(cartItem);

            return ResponseEntity.ok("Cart item updated successfully");
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating cart item: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long id) {
        try {
            if (!cartRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            cartRepository.deleteById(id);
            return ResponseEntity.ok("Item removed from cart successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error removing item from cart: " + e.getMessage());
        }
    }

    private CartDTO convertToDTO(Cart cart) {
        CartDTO dto = new CartDTO(
                cart.getId(),
                cart.getQuantity(),
                cart.getTotalPrice(),
                cart.getProductPrice().getPrice(),
                cart.getProductPrice().getProductDetail().getSeries(),
                cart.getProductPrice().getProductDetail().getGrade().getTypeCode(),
                cart.getProductPrice().getThickness().getThicknessName(),
                cart.getProductPrice().getSize().getLength(),
                cart.getProductPrice().getSize().getBreadth(),
                cart.getProductPrice().getId()
        );
        dto.setDiscount(cart.getDiscount());
        return dto;
    }

    // Request DTOs
    public static class AddToCartRequest {
        private Long productPriceId;
        private Integer quantity;
        private BigDecimal discount; // Discount percentage (0-100)

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
