package com.professionalplastics.controller;

import com.professionalplastics.dtos.ProductPriceDTO;
import com.professionalplastics.service.ProductPriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-price")
@CrossOrigin(origins = "*")
public class ProductPriceController {

    @Autowired
    private ProductPriceService priceService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addPrice(@RequestBody Map<String, Object> request) {
        Long productDetailId = Long.valueOf(request.get("productDetailId").toString());
        Long thicknessId = Long.valueOf(request.get("thicknessId").toString());
        Long sizeId = Long.valueOf(request.get("sizeId").toString());
        BigDecimal price = new BigDecimal(request.get("price").toString());

        ProductPriceDTO created = priceService.create(new ProductPriceDTO(null, productDetailId, thicknessId, sizeId, price, null, null, null));
        return ResponseEntity.ok(priceService.toCreateResponse(created));
    }

    @GetMapping("/grade/{gradeId}")
    public ResponseEntity<List<ProductPriceDTO>> getPricesByGrade(@PathVariable Long gradeId) {
        return ResponseEntity.ok(priceService.getByGrade(gradeId));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProductPriceDTO> updatePrice(
            @PathVariable Long id,
            @RequestBody ProductPriceDTO dto
    ) {
        ProductPriceDTO updated = priceService.update(id, dto);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * DELETE /product-price/{id} - delete a price by id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePrice(@PathVariable Long id) {
        priceService.delete(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Price deleted successfully"));
    }

    /**
     * DELETE /product-price - delete all prices
     */
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteAllPrices() {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
    }
}
