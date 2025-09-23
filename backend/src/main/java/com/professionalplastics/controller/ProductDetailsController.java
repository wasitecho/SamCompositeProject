package com.professionalplastics.controller;

import com.professionalplastics.dtos.ProductDetailsDTO;
import com.professionalplastics.dtos.ProductPriceDTO;
import com.professionalplastics.entity.Grade;
import com.professionalplastics.entity.ProductDetails;
import com.professionalplastics.repository.GradeRepository;
import com.professionalplastics.repository.ProductDetailsRepository;
import com.professionalplastics.repository.ProductPriceRepository;
import com.professionalplastics.repository.FullSheetsQuotationRepository;
import com.professionalplastics.repository.CutToSizeQuotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/product-details")
@CrossOrigin(origins = "*")
public class ProductDetailsController {

    @Autowired
    private ProductDetailsRepository productDetailsRepository;

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private ProductPriceRepository priceRepository;

    @Autowired
    private FullSheetsQuotationRepository fullSheetsQuotationRepository;

    @Autowired
    private CutToSizeQuotationRepository cutToSizeQuotationRepository;

    @GetMapping
    public ResponseEntity<List<ProductDetailsDTO>> getProductDetailsByGrade(@RequestParam Long gradeId) {
        try {
            // Check if grade exists first
            Optional<Grade> gradeOpt = gradeRepository.findById(gradeId);
            if (gradeOpt.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            List<ProductDetailsDTO> productDetails = productDetailsRepository.findDtoByGradeId(gradeId);
            return ResponseEntity.ok(productDetails);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createProductDetails(@RequestBody Map<String, Object> request) {
        try {
            Long gradeId = Long.valueOf(request.get("gradeId").toString());
            String series = request.get("series").toString();

            if (series == null || series.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Series is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Validate grade exists
            Optional<Grade> gradeOpt = gradeRepository.findById(gradeId);
            if (gradeOpt.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Grade not found");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Grade grade = gradeOpt.get();

            // Check if series already exists for this grade
            if (productDetailsRepository.existsByGradeIdAndSeries(gradeId, series.trim())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Series '" + series.trim() + "' already exists for this grade");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Note: Since we removed the type field, we no longer check for price combinations
            // during product details creation. Price combinations are checked when adding prices.

            // Create new ProductDetails entity
            ProductDetails productDetails = new ProductDetails(series.trim(), grade);
            ProductDetails savedProductDetails = productDetailsRepository.save(productDetails);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product details added successfully");
            response.put("productDetails", new ProductDetailsDTO(
                savedProductDetails.getId(),
                savedProductDetails.getSeries(),
                savedProductDetails.getGrade().getId(),
                savedProductDetails.getGrade().getTypeCode()
            ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to add product details: " + e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{gradeId}")
    public ResponseEntity<Map<String, Object>> getProductDetailsWithPrices(@PathVariable Long gradeId) {
        try {
            // First check if grade exists
            Optional<Grade> gradeOpt = gradeRepository.findById(gradeId);
            if (gradeOpt.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Grade with ID " + gradeId + " not found");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Use the simple query approach to avoid lazy loading issues
            List<ProductDetailsDTO> productDetailsDTOs = productDetailsRepository.findDtoByGradeId(gradeId);
            System.out.println("Found " + productDetailsDTOs.size() + " product details for grade " + gradeId);
            
            // Get prices separately to avoid lazy loading issues
            List<ProductPriceDTO> allPrices = new ArrayList<>();
            try {
                allPrices = priceRepository.findByGradeId(gradeId).stream()
                        .map(pp -> new ProductPriceDTO(
                            pp.getId(),
                            pp.getProductDetail().getId(),
                            pp.getThickness().getId(),
                            pp.getSize().getId(),
                            pp.getPrice(),
                            pp.getThickness().getThicknessName(),
                            pp.getSize().getLength(),
                            pp.getSize().getBreadth()
                        ))
                        .collect(Collectors.toList());
            } catch (Exception e) {
                System.out.println("Error fetching prices: " + e.getMessage());
                // Continue with empty prices list
            }
            
            // Group prices by product detail ID
            Map<Long, List<ProductPriceDTO>> pricesByProductDetail = allPrices.stream()
                    .collect(Collectors.groupingBy(ProductPriceDTO::getProductDetailId));
            
            // Add prices to product details
            productDetailsDTOs.forEach(pd -> {
                List<ProductPriceDTO> prices = pricesByProductDetail.getOrDefault(pd.getId(), new ArrayList<>());
                pd.setPrices(prices);
            });

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("productDetails", productDetailsDTOs);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch product details: " + e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * DELETE /product-details/{id} - delete a product detail by id
     */
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteProductDetail(@PathVariable Long id) {
        try {
            if (!productDetailsRepository.existsById(id)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Product detail not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            // Delete in proper order to avoid foreign key constraint violations
            // 1. First delete all quotations that reference this product detail's prices
            fullSheetsQuotationRepository.deleteAll(
                fullSheetsQuotationRepository.findAll().stream()
                    .filter(q -> q.getProductDetail().getId().equals(id))
                    .collect(Collectors.toList())
            );
            cutToSizeQuotationRepository.deleteAll(
                cutToSizeQuotationRepository.findAll().stream()
                    .filter(q -> q.getProductDetail().getId().equals(id))
                    .collect(Collectors.toList())
            );
            
            // 2. Then delete all product prices for this product detail
            priceRepository.deleteAll(
                priceRepository.findAll().stream()
                    .filter(p -> p.getProductDetail().getId().equals(id))
                    .collect(Collectors.toList())
            );
            
            // 3. Finally delete the product detail
            productDetailsRepository.deleteById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product detail deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete product detail: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/all")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteAllProductDetails() {
        try {
            long countBefore = productDetailsRepository.count();
            
            // Delete in proper order to avoid foreign key constraint violations
            // 1. First delete all quotations that reference product prices
            fullSheetsQuotationRepository.deleteAll();
            cutToSizeQuotationRepository.deleteAll();
            
            // 2. Then delete all product prices
            priceRepository.deleteAll();
            
            // 3. Finally delete all product details
            productDetailsRepository.deleteAll();
            
            long countAfter = productDetailsRepository.count();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "All product details deleted successfully");
            response.put("deletedCount", countBefore);
            response.put("remainingCount", countAfter);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete all product details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
