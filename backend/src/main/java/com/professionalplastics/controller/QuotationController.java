package com.professionalplastics.controller;

import com.professionalplastics.dtos.ProductPriceDTO;
import com.professionalplastics.repository.ProductPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/quotation")
@CrossOrigin(origins = "*")
public class QuotationController {

    @Autowired
    private ProductPriceRepository productPriceRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createQuotation(@RequestBody Map<String, Object> quotationRequest) {
        try {
            // Extract parameters from request
            Long gradeId = Long.valueOf(quotationRequest.get("gradeId").toString());
            String quantity = quotationRequest.get("quantity").toString();
            String thickness = quotationRequest.get("thickness").toString();
            String size = quotationRequest.get("size").toString();
            String basePrice = quotationRequest.get("basePrice") != null ? quotationRequest.get("basePrice").toString() : "";
            String totalPrice = quotationRequest.get("totalPrice") != null ? quotationRequest.get("totalPrice").toString() : "";

            // Find the product price by grade, thickness, and size
            List<com.professionalplastics.entity.ProductPrice> prices = productPriceRepository.findByGradeId(gradeId);
            Optional<com.professionalplastics.entity.ProductPrice> productPriceOpt = prices.stream()
                .filter(p -> p.getThickness().getThicknessName().equals(thickness) && 
                           (p.getSize().getLength() + "x" + p.getSize().getBreadth()).equals(size))
                .findFirst();

            if (productPriceOpt.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Product price not found for the selected specifications");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            com.professionalplastics.entity.ProductPrice productPrice = productPriceOpt.get();

            // Create ProductPriceDTO for response
            ProductPriceDTO priceDTO = new ProductPriceDTO(
                productPrice.getId(),
                productPrice.getProductDetail().getId(),
                productPrice.getThickness().getId(),
                productPrice.getSize().getId(),
                productPrice.getPrice(),
                productPrice.getThickness().getThicknessName(),
                productPrice.getSize().getLength(),
                productPrice.getSize().getBreadth()
            );

            // Create quotation response
            Map<String, Object> quotationResponse = new HashMap<>();
            quotationResponse.put("success", true);
            quotationResponse.put("message", "Quotation generated successfully");
            quotationResponse.put("quotationId", "QUO-" + System.currentTimeMillis());
            quotationResponse.put("quantity", quantity);
            quotationResponse.put("productPrice", priceDTO);
            quotationResponse.put("basePrice", basePrice);
            quotationResponse.put("unitPrice", productPrice.getPrice());
            quotationResponse.put("totalPrice", totalPrice);
            quotationResponse.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(quotationResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to generate quotation: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * DELETE /quotation/{id} - delete a quotation by id
     * Note: This is a placeholder method since quotations are typically not stored persistently
     * but generated on-demand. This method could be used if quotations are stored in a database.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteQuotation(@PathVariable String id) {
        try {
            // Since quotations are typically generated on-demand and not stored,
            // this method returns a success response indicating the quotation is "deleted"
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Quotation " + id + " deleted successfully");
            response.put("note", "Quotations are generated on-demand and not stored persistently");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete quotation: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * DELETE /quotation - delete all quotations
     * Note: This is a placeholder method since quotations are typically not stored persistently
     * but generated on-demand. This method could be used if quotations are stored in a database.
     */
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteAllQuotations() {
        try {
            // Since quotations are typically generated on-demand and not stored,
            // this method returns a success response indicating all quotations are "deleted"
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "All quotations deleted successfully");
            response.put("note", "Quotations are generated on-demand and not stored persistently");
            response.put("deletedCount", 0);
            response.put("remainingCount", 0);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete all quotations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}

