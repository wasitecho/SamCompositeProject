package com.professionalplastics.controller;

import com.professionalplastics.dtos.ProductDetailsSizeDTO;
import com.professionalplastics.entity.ProductDetailsSize;
import com.professionalplastics.repository.ProductDetailsSizeRepository;
import com.professionalplastics.repository.ProductPriceRepository;
import com.professionalplastics.repository.FullSheetsQuotationRepository;
import com.professionalplastics.repository.CutToSizeQuotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/product-size")
@CrossOrigin(origins = "*")
public class ProductDetailsSizeController {

    @Autowired
    private ProductDetailsSizeRepository sizeRepository;

    @Autowired
    private ProductPriceRepository priceRepository;

    @Autowired
    private FullSheetsQuotationRepository fullSheetsQuotationRepository;

    @Autowired
    private CutToSizeQuotationRepository cutToSizeQuotationRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addSize(@RequestBody Map<String, Object> request) {
        try {
            Integer length = null;
            Integer breadth = null;
            
            // Handle both string and integer inputs
            Object lengthObj = request.get("length");
            Object breadthObj = request.get("breadth");
            
            if (lengthObj instanceof String) {
                length = Integer.parseInt((String) lengthObj);
            } else if (lengthObj instanceof Integer) {
                length = (Integer) lengthObj;
            }
            
            if (breadthObj instanceof String) {
                breadth = Integer.parseInt((String) breadthObj);
            } else if (breadthObj instanceof Integer) {
                breadth = (Integer) breadthObj;
            }
            
            if (length == null || breadth == null || length <= 0 || breadth <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Valid length and breadth are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Check if size already exists
            if (sizeRepository.existsByLengthAndBreadth(length, breadth)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Size with these dimensions already exists");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            ProductDetailsSize size = new ProductDetailsSize(length, breadth);
            ProductDetailsSize savedSize = sizeRepository.save(size);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Size added successfully");
            response.put("size", new ProductDetailsSizeDTO(savedSize.getId(), savedSize.getLength(), savedSize.getBreadth()));

            return ResponseEntity.ok(response);
        } catch (NumberFormatException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid number format for length or breadth");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to add size: " + e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<List<ProductDetailsSizeDTO>> getAllSizes() {
        try {
            List<ProductDetailsSize> sizes = sizeRepository.findAllByOrderByLengthAndBreadthAsc();
            List<ProductDetailsSizeDTO> sizeDTOs = sizes.stream()
                    .map(s -> new ProductDetailsSizeDTO(s.getId(), s.getLength(), s.getBreadth()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(sizeDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DELETE /product-size/{id} - delete a size by id
     */
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteSize(@PathVariable Long id) {
        try {
            if (!sizeRepository.existsById(id)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Size not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            // Delete in proper order to avoid foreign key constraint violations
            // 1. First delete all quotations that reference this size
            fullSheetsQuotationRepository.deleteAll(
                fullSheetsQuotationRepository.findAll().stream()
                    .filter(q -> q.getSizeEntity().getId().equals(id))
                    .collect(Collectors.toList())
            );
            
            // 2. Then delete all product prices that reference this size
            priceRepository.deleteAll(
                priceRepository.findAll().stream()
                    .filter(p -> p.getSize().getId().equals(id))
                    .collect(Collectors.toList())
            );
            
            // 3. Finally delete the size
            sizeRepository.deleteById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Size deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete size: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * DELETE /product-size - delete all sizes
     */
    @DeleteMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteAllSizes() {
        try {
            long countBefore = sizeRepository.count();
            
            // Delete in proper order to avoid foreign key constraint violations
            // 1. First delete all quotations that reference sizes
            fullSheetsQuotationRepository.deleteAll();
            cutToSizeQuotationRepository.deleteAll();
            
            // 2. Then delete all product prices
            priceRepository.deleteAll();
            
            // 3. Finally delete all sizes
            sizeRepository.deleteAll();
            
            long countAfter = sizeRepository.count();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "All sizes deleted successfully");
            response.put("deletedCount", countBefore);
            response.put("remainingCount", countAfter);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete all sizes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
