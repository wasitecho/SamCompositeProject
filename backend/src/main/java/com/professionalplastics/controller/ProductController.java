package com.professionalplastics.controller;

import com.professionalplastics.dtos.ProductDTO;
import com.professionalplastics.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * GET /products/{id} - fetch product by id
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    /**
     * GET /products - get all products
     */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAll());
    }

    /**
     * POST /products - create a new product
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO product) {
        ProductDTO createdProduct = productService.create(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    /**
     * PUT /products/{id} - update a product
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id,
                                                 @Valid @RequestBody ProductDTO productDetails) {
        ProductDTO updated = productService.update(id, productDetails);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /products/{id} - delete a product
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /products - delete all products
     */
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAllProducts() {
        // Optional: keep an admin bulk-delete if needed via service; not required by base CRUD
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
    }

    /**
     * GET /products/category/{categoryName} - get products by category name
     */
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable String categoryName) {
        return ResponseEntity.ok(productService.getByCategoryName(categoryName));
    }

    /**
     * GET /products/search - search products by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProductsByName(@RequestParam String name) {
        return ResponseEntity.ok(productService.searchByName(name));
    }
}
