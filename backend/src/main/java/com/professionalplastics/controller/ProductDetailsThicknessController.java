package com.professionalplastics.controller;

import com.professionalplastics.dtos.ProductDetailsThicknessDTO;
import com.professionalplastics.service.ProductDetailsThicknessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-thickness")
@CrossOrigin(origins = "*")
public class ProductDetailsThicknessController {

    @Autowired
    private ProductDetailsThicknessService thicknessService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addThickness(@RequestBody Map<String, Object> request) {
        try {
            Double thickness = request.get("thickness") != null ? Double.valueOf(request.get("thickness").toString()) : null;
            ProductDetailsThicknessDTO created = thicknessService.create(new ProductDetailsThicknessDTO(null, thickness));
            return ResponseEntity.ok(thicknessService.toResponse(created));
        } catch (NumberFormatException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid number format for thickness");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<List<ProductDetailsThicknessDTO>> getAllThicknesses() {
        return ResponseEntity.ok(thicknessService.getAll());
    }

    /**
     * DELETE /product-thickness/{id} - delete a thickness by id
     */
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteThickness(@PathVariable Long id) {
        thicknessService.delete(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Thickness deleted successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /product-thickness - delete all thicknesses
     */
    @DeleteMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteAllThicknesses() {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
    }
}
