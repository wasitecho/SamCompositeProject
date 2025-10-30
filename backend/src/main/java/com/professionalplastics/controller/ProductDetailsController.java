package com.professionalplastics.controller;

import com.professionalplastics.dtos.ProductDetailsDTO;
import com.professionalplastics.service.ProductDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-details")
@CrossOrigin(origins = "*")
public class ProductDetailsController {

    @Autowired
    private ProductDetailsService productDetailsService;

    @GetMapping
    public ResponseEntity<List<ProductDetailsDTO>> getProductDetailsByGrade(@RequestParam Long gradeId) {
        return ResponseEntity.ok(productDetailsService.getByGradeId(gradeId));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createProductDetails(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = productDetailsService.create(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProductDetails(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Map<String, Object> response = productDetailsService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{gradeId}")
    public ResponseEntity<Map<String, Object>> getProductDetailsWithPrices(@PathVariable Long gradeId) {
        Map<String, Object> response = productDetailsService.getWithPrices(gradeId);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /product-details/{id} - delete a product detail by id
     */
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteProductDetail(@PathVariable Long id) {
        productDetailsService.delete(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product detail deleted successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/all")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteAllProductDetails() {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
    }
}
