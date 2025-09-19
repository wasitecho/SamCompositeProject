package com.professionalplastics.controller;

import com.professionalplastics.entity.Category;
import com.professionalplastics.entity.Grade;
import com.professionalplastics.repository.CategoryRepository;
import com.professionalplastics.repository.GradeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final GradeRepository gradeRepository;

    public CategoryController(CategoryRepository categoryRepository,
                              GradeRepository gradeRepository) {
        this.categoryRepository = categoryRepository;
        this.gradeRepository = gradeRepository;
    }

    /**
     * GET /categories - fetch all categories
     */
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories);
    }

    /**
     * GET /categories/{id} - fetch category by id
     */
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /categories/{id}/grades - get grades for a specific category
     */
    @GetMapping("/{id}/grades")
    public ResponseEntity<List<Grade>> getGradesByCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        List<Grade> grades = gradeRepository.findByCategoryId(id);
        return ResponseEntity.ok(grades);
    }

    /**
     * POST /categories - add new category
     */
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    /**
     * POST /categories/bulk - add multiple categories at once
     */
    @PostMapping("/bulk")
    public ResponseEntity<List<Category>> createCategories(@RequestBody List<Category> categories) {
        List<Category> savedCategories = categoryRepository.saveAll(categories);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategories);
    }

    /**
     * DELETE /categories - delete all categories
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAllCategories() {
        categoryRepository.deleteAll();
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /categories/{id} - delete a category by id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoryById(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
