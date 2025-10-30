package com.professionalplastics.controller;

import com.professionalplastics.dtos.CategoryDTO;
import com.professionalplastics.dtos.GradeDTO;
import com.professionalplastics.service.CategoryService;
import com.professionalplastics.service.GradeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;
    private final GradeService gradeService;

    public CategoryController(CategoryService categoryService,
                              GradeService gradeService) {
        this.categoryService = categoryService;
        this.gradeService = gradeService;
    }

    /**
     * GET /categories - fetch all categories
     */
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    /**
     * GET /categories/test - test endpoint to verify controller is accessible
     */
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Category controller is working!");
    }

    /**
     * GET /categories/{id} - fetch category by id
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getById(id));
    }

    /**
     * GET /categories/{id}/grades - get grades for a specific category
     */
    @GetMapping("/{id}/grades")
    public ResponseEntity<List<GradeDTO>> getGradesByCategory(@PathVariable Long id) {
        return ResponseEntity.ok(gradeService.findByCategoryId(id));
    }

    /**
     * POST /categories - add new category
     */
    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryDTO category) {
        CategoryDTO savedCategory = categoryService.create(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    /**
     * POST /categories/bulk - add multiple categories at once
     */
    @PostMapping("/bulk")
    public ResponseEntity<Void> createCategories(@RequestBody List<CategoryDTO> categories) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
    }

    /**
     * DELETE /categories - delete all categories
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAllCategories() {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
    }

    /**
     * DELETE /categories/{id} - delete a category by id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoryById(@PathVariable Long id) {
        try {
            categoryService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error deleting category: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
