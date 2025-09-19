package com.professionalplastics.controller;

import com.professionalplastics.entity.Grade;
import com.professionalplastics.dtos.GradeDTO;
import com.professionalplastics.entity.Category;
import com.professionalplastics.repository.CategoryRepository;
import com.professionalplastics.repository.GradeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
// removed incorrect import of java.util.Locale.Category

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "*")
public class GradeController {

    private final GradeRepository gradeRepository;
    private final CategoryRepository categoryRepository;

    public GradeController(GradeRepository gradeRepository,
                           CategoryRepository categoryRepository) {
        this.gradeRepository = gradeRepository;
        this.categoryRepository = categoryRepository;
    }

   
    @GetMapping
    public ResponseEntity<List<Grade>> getAllGrades() {
        List<Grade> grades = gradeRepository.findAllWithCategory();
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Grade> getGradeById(@PathVariable Long id) {
        Optional<Grade> grade = gradeRepository.findByIdWithCategory(id);
        return grade.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<List<GradeDTO>> getGradesByCategory(@PathVariable Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            return ResponseEntity.notFound().build();
        }
        List<GradeDTO> grades = gradeRepository.findDtoByCategoryId(categoryId);
        return ResponseEntity.ok(grades);
    }

    /**
     * GET /grades/by-type/{typeCode} - get grades by type code
     */
    @GetMapping("/by-type/{typeCode}")
    public ResponseEntity<List<Grade>> getGradesByTypeCode(@PathVariable String typeCode) {
        List<Grade> grades = gradeRepository.findByTypeCode(typeCode);
        return ResponseEntity.ok(grades);
    }

    /**
     * POST /grades - create a new grade
     */
    @PostMapping
    public ResponseEntity<Grade> createGrade(@RequestParam Long categoryId,
                                             @RequestBody Grade grade) {
        Optional<Category> category = categoryRepository.findById(categoryId);
        if (category.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        grade.setCategory(category.get());
        Grade created = gradeRepository.save(grade);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    @PostMapping("/bulk")
    public ResponseEntity<List<Grade>> createGradesBulk(
            @RequestParam Long categoryId,
            @RequestBody List<Grade> grades) {

        Optional<Category> categoryOpt = categoryRepository.findById(categoryId);
        if (categoryOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Category category = categoryOpt.get();

        // Attach category to each grade before saving
        for (Grade grade : grades) {
            grade.setCategory(category);
    }

    List<Grade> savedGrades = gradeRepository.saveAll(grades);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedGrades);
}


    /**
     * PUT /grades/{id} - update a grade
     */
    @PutMapping("/{id}")
    public ResponseEntity<Grade> updateGrade(@PathVariable Long id,
                                             @RequestBody Grade gradeDetails) {
        Optional<Grade> existingGrade = gradeRepository.findById(id);
        if (existingGrade.isPresent()) {
            Grade grade = existingGrade.get();
            grade.setTypeCode(gradeDetails.getTypeCode());
            grade.setCategory(gradeDetails.getCategory());
            
            Grade updatedGrade = gradeRepository.save(grade);
            return ResponseEntity.ok(updatedGrade);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * DELETE /grades/{id} - delete a grade
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id) {
        if (gradeRepository.existsById(id)) {
            gradeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * DELETE /grades - delete all grades
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAllGrades() {
        gradeRepository.deleteAll();
        return ResponseEntity.noContent().build();
    }
}
