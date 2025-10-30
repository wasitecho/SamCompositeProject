package com.professionalplastics.service;

import com.professionalplastics.dtos.CartDTO;
import com.professionalplastics.entity.Cart;
import com.professionalplastics.entity.ProductPrice;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.CartRepository;
import com.professionalplastics.repository.ProductPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductPriceRepository productPriceRepository;

    public Map<String, Object> addToCart(Long productPriceId, Integer quantity, BigDecimal discount, BigDecimal totalOverride) {
        ProductPrice productPrice = productPriceRepository.findById(productPriceId)
                .orElseThrow(() -> new EntityNotFoundException("Product price not found: " + productPriceId));

        Cart existingCartItem = cartRepository.findByProductPriceId(productPriceId);

        BigDecimal totalPrice = (totalOverride != null)
                ? totalOverride
                : productPrice.getPrice().multiply(BigDecimal.valueOf(quantity));

        // If client provided total, assume it's the final total (do not re-apply discount)
        if (totalOverride == null && discount != null && discount.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountAmount = totalPrice.multiply(discount.divide(BigDecimal.valueOf(100)));
            totalPrice = totalPrice.subtract(discountAmount);
        }

        if (existingCartItem != null) {
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            BigDecimal newTotalPrice;
            if (totalOverride != null) {
                newTotalPrice = totalOverride; // trust client total for this op
            } else {
                BigDecimal newBaseTotal = productPrice.getPrice().multiply(BigDecimal.valueOf(existingCartItem.getQuantity()));
                newTotalPrice = newBaseTotal;
                if (discount != null && discount.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal discountAmount = newBaseTotal.multiply(discount.divide(BigDecimal.valueOf(100)));
                    newTotalPrice = newBaseTotal.subtract(discountAmount);
                }
            }
            existingCartItem.setTotalPrice(newTotalPrice);
            existingCartItem.setDiscount(discount);
            cartRepository.save(existingCartItem);
        } else {
            Cart cartItem = new Cart(quantity, totalPrice, productPrice);
            cartItem.setDiscount(discount);
            cartRepository.save(cartItem);
        }

        return Map.of("message", "Item added to cart successfully");
    }

    public Map<String, Object> addToCart(Long productPriceId, Integer quantity, BigDecimal discount) {
        ProductPrice productPrice = productPriceRepository.findById(productPriceId)
                .orElseThrow(() -> new EntityNotFoundException("Product price not found: " + productPriceId));

        Cart existingCartItem = cartRepository.findByProductPriceId(productPriceId);

        BigDecimal baseTotal = productPrice.getPrice().multiply(BigDecimal.valueOf(quantity));
        BigDecimal totalPrice = baseTotal;

        if (discount != null && discount.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountAmount = baseTotal.multiply(discount.divide(BigDecimal.valueOf(100)));
            totalPrice = baseTotal.subtract(discountAmount);
        }

        if (existingCartItem != null) {
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            BigDecimal newBaseTotal = productPrice.getPrice().multiply(BigDecimal.valueOf(existingCartItem.getQuantity()));
            BigDecimal newTotalPrice = newBaseTotal;
            if (discount != null && discount.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal discountAmount = newBaseTotal.multiply(discount.divide(BigDecimal.valueOf(100)));
                newTotalPrice = newBaseTotal.subtract(discountAmount);
            }
            existingCartItem.setTotalPrice(newTotalPrice);
            existingCartItem.setDiscount(discount);
            cartRepository.save(existingCartItem);
        } else {
            Cart cartItem = new Cart(quantity, totalPrice, productPrice);
            cartItem.setDiscount(discount);
            cartRepository.save(cartItem);
        }

        return Map.of("message", "Item added to cart successfully");
    }

    public List<CartDTO> getCartItems() {
        List<Cart> cartItems = cartRepository.findAllWithProductDetails();
        return cartItems.stream().map(this::toDto).collect(Collectors.toList());
    }

    public Map<String, Object> updateCartItem(Long id, Integer quantity) {
        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        Cart cartItem = cartRepository.findByIdWithProductPrice(id)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found: " + id));
        ProductPrice productPrice = cartItem.getProductPrice();
        if (productPrice == null) {
            throw new IllegalArgumentException("Product price not found for cart item");
        }
        // Preserve per-unit price from the cart item's existing total (supports cut-to-size)
        BigDecimal existingTotal = cartItem.getTotalPrice();
        Integer existingQty = cartItem.getQuantity();
        BigDecimal newTotal;
        if (existingTotal != null && existingQty != null && existingQty > 0) {
            BigDecimal perUnit = existingTotal.divide(BigDecimal.valueOf(existingQty), 2, java.math.RoundingMode.HALF_UP);
            newTotal = perUnit.multiply(BigDecimal.valueOf(quantity));
        } else {
            // Fallback to full-sheet product unit price
            newTotal = productPrice.getPrice().multiply(BigDecimal.valueOf(quantity));
            // Apply discount only if it's not already baked into total
            BigDecimal discount = cartItem.getDiscount();
            if (discount != null && discount.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal discountAmount = newTotal.multiply(discount.divide(BigDecimal.valueOf(100)));
                newTotal = newTotal.subtract(discountAmount);
            }
        }
        cartItem.setQuantity(quantity);
        cartItem.setTotalPrice(newTotal);
        cartRepository.save(cartItem);
        return Map.of("message", "Cart item updated successfully");
    }

    public void removeCartItem(Long id) {
        if (!cartRepository.existsById(id)) {
            throw new EntityNotFoundException("Cart item not found: " + id);
        }
        cartRepository.deleteById(id);
    }

    private CartDTO toDto(Cart cart) {
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
}


