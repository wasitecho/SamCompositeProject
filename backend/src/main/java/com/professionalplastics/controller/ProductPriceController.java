package com.professionalplastics.controller;

import com.professionalplastics.dtos.ProductPriceDTO;
import com.professionalplastics.entity.*;
import com.professionalplastics.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/product-price")
@CrossOrigin(origins = "*")
public class ProductPriceController {

    @Autowired
    private ProductPriceRepository priceRepository;

    @Autowired
    private ProductDetailsRepository productDetailsRepository;

    @Autowired
    private ProductDetailsThicknessRepository thicknessRepository;

    @Autowired
    private ProductDetailsSizeRepository sizeRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addPrice(@RequestBody Map<String, Object> request) {
        try {
            Long productDetailId = Long.valueOf(request.get("productDetailId").toString());
            Long thicknessId = Long.valueOf(request.get("thicknessId").toString());
            Long sizeId = Long.valueOf(request.get("sizeId").toString());
            BigDecimal price = new BigDecimal(request.get("price").toString());

            if (price.compareTo(BigDecimal.ZERO) <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Price must be greater than 0");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Get entities
            Optional<ProductDetails> productDetailOpt = productDetailsRepository.findById(productDetailId);
            Optional<ProductDetailsThickness> thicknessOpt = thicknessRepository.findById(thicknessId);
            Optional<ProductDetailsSize> sizeOpt = sizeRepository.findById(sizeId);

            if (productDetailOpt.isEmpty() || thicknessOpt.isEmpty() || sizeOpt.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Invalid product detail, thickness, or size ID");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Check if combination already exists
            Optional<ProductPrice> existingPrice = priceRepository.findByProductDetailAndThicknessAndSize(
                productDetailOpt.get(),
                thicknessOpt.get(),
                sizeOpt.get()
            );

            if (existingPrice.isPresent()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Combination of Product Detail, Thickness '" + thicknessOpt.get().getThicknessName() + 
                    "', and Size '" + sizeOpt.get().getLength() + "x" + sizeOpt.get().getBreadth() + "' already exists");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            ProductPrice productPrice = new ProductPrice(
                productDetailOpt.get(),
                thicknessOpt.get(),
                sizeOpt.get(),
                price
            );

            ProductPrice savedPrice = priceRepository.save(productPrice);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Price added successfully");
            response.put("price", new ProductPriceDTO(
                savedPrice.getId(),
                savedPrice.getProductDetail().getId(),
                savedPrice.getThickness().getId(),
                savedPrice.getSize().getId(),
                savedPrice.getPrice(),
                savedPrice.getThickness().getThicknessName(),
                savedPrice.getSize().getLength(),
                savedPrice.getSize().getBreadth()
            ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to add price: " + e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/grade/{gradeId}")
    public ResponseEntity<List<ProductPriceDTO>> getPricesByGrade(@PathVariable Long gradeId) {
        try {
            List<ProductPrice> prices = priceRepository.findByGradeId(gradeId);
            System.out.println("Found " + prices.size() + " prices for grade " + gradeId);
            
            List<ProductPriceDTO> priceDTOs = prices.stream()
                    .map(p -> new ProductPriceDTO(
                        p.getId(),
                        p.getProductDetail().getId(),
                        p.getThickness().getId(),
                        p.getSize().getId(),
                        p.getPrice(),
                        p.getThickness().getThicknessName(),
                        p.getSize().getLength(),
                        p.getSize().getBreadth()
                    ))
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(priceDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DELETE /product-price/{id} - delete a price by id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePrice(@PathVariable Long id) {
        try {
            if (!priceRepository.existsById(id)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Price not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            priceRepository.deleteById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Price deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete price: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * DELETE /product-price - delete all prices
     */
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteAllPrices() {
        try {
            long countBefore = priceRepository.count();
            priceRepository.deleteAll();
            long countAfter = priceRepository.count();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "All prices deleted successfully");
            response.put("deletedCount", countBefore);
            response.put("remainingCount", countAfter);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete all prices: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
