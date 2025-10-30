package com.professionalplastics.controller;

import com.professionalplastics.dtos.ProductDetailsSizeDTO;
import com.professionalplastics.service.ProductDetailsSizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-size")
@CrossOrigin(origins = "*")
public class ProductDetailsSizeController {

    @Autowired
    private ProductDetailsSizeService sizeService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addSize(@RequestBody Map<String, Object> request) {
        try {
            Integer length = request.get("length") != null ? Integer.valueOf(request.get("length").toString()) : null;
            Integer breadth = request.get("breadth") != null ? Integer.valueOf(request.get("breadth").toString()) : null;
            ProductDetailsSizeDTO created = sizeService.create(new ProductDetailsSizeDTO(null, length, breadth));
            return ResponseEntity.ok(sizeService.toResponse(created));
        } catch (NumberFormatException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid number format for length or breadth");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<List<ProductDetailsSizeDTO>> getAllSizes() {
        return ResponseEntity.ok(sizeService.getAll());
    }

    /**
     * DELETE /product-size/{id} - delete a size by id
     */
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteSize(@PathVariable Long id) {
        sizeService.delete(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Size deleted successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /product-size - delete all sizes
     */
    @DeleteMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteAllSizes() {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
    }
}
