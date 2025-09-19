package com.professionalplastics.controller;

import com.professionalplastics.dtos.ProductDetailsThicknessDTO;
import com.professionalplastics.entity.ProductDetailsThickness;
import com.professionalplastics.repository.ProductDetailsThicknessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/product-thickness")
@CrossOrigin(origins = "*")
public class ProductDetailsThicknessController {

    @Autowired
    private ProductDetailsThicknessRepository thicknessRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addThickness(@RequestBody Map<String, Object> request) {
        try {
            Double thickness = null;
            
            // Handle both string and double inputs
            Object thicknessObj = request.get("thickness");
            
            if (thicknessObj instanceof String) {
                thickness = Double.parseDouble((String) thicknessObj);
            } else if (thicknessObj instanceof Double) {
                thickness = (Double) thicknessObj;
            } else if (thicknessObj instanceof Integer) {
                thickness = ((Integer) thicknessObj).doubleValue();
            }
            
            if (thickness == null || thickness <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Valid thickness value is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Check if thickness already exists
            if (thicknessRepository.existsByThickness(thickness)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Thickness with this value already exists");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            ProductDetailsThickness thicknessEntity = new ProductDetailsThickness(thickness);
            ProductDetailsThickness savedThickness = thicknessRepository.save(thicknessEntity);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thickness added successfully");
            response.put("thickness", new ProductDetailsThicknessDTO(savedThickness.getId(), savedThickness.getThickness()));

            return ResponseEntity.ok(response);
        } catch (NumberFormatException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid number format for thickness");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to add thickness: " + e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<List<ProductDetailsThicknessDTO>> getAllThicknesses() {
        try {
            List<ProductDetailsThickness> thicknesses = thicknessRepository.findAllByOrderByThicknessAsc();
            List<ProductDetailsThicknessDTO> thicknessDTOs = thicknesses.stream()
                    .map(t -> new ProductDetailsThicknessDTO(t.getId(), t.getThickness()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(thicknessDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DELETE /product-thickness/{id} - delete a thickness by id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteThickness(@PathVariable Long id) {
        try {
            if (!thicknessRepository.existsById(id)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Thickness not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            thicknessRepository.deleteById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thickness deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete thickness: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * DELETE /product-thickness - delete all thicknesses
     */
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteAllThicknesses() {
        try {
            long countBefore = thicknessRepository.count();
            thicknessRepository.deleteAll();
            long countAfter = thicknessRepository.count();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "All thicknesses deleted successfully");
            response.put("deletedCount", countBefore);
            response.put("remainingCount", countAfter);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete all thicknesses: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
