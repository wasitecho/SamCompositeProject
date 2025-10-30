package com.professionalplastics.controller;

import com.professionalplastics.dtos.GradeDTO;
import com.professionalplastics.service.GradeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// removed incorrect import of java.util.Locale.Category

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "*")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

   
    @GetMapping
    public ResponseEntity<List<GradeDTO>> getAllGrades() {
        return ResponseEntity.ok(gradeService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GradeDTO> getGradeById(@PathVariable Long id) {
        return ResponseEntity.ok(gradeService.getById(id));
    }

    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<List<GradeDTO>> getGradesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(gradeService.findByCategoryId(categoryId));
    }

    /**
     * GET /grades/by-type/{typeCode} - get grades by type code
     */
    @GetMapping("/by-type/{typeCode}")
    public ResponseEntity<List<GradeDTO>> getGradesByTypeCode(@PathVariable String typeCode) {
        return ResponseEntity.ok(gradeService.findByTypeCode(typeCode));
    }

    /**
     * POST /grades - create a new grade
     */
    @PostMapping
    public ResponseEntity<GradeDTO> createGrade(@RequestParam Long categoryId,
                                             @RequestBody GradeDTO grade) {
        GradeDTO created = gradeService.createWithCategory(categoryId, grade);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    @PostMapping("/bulk")
    public ResponseEntity<Void> createGradesBulk(
            @RequestParam Long categoryId,
            @RequestBody List<GradeDTO> grades) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
}


    /**
     * PUT /grades/{id} - update a grade
     */
    @PutMapping("/{id}")
    public ResponseEntity<GradeDTO> updateGrade(@PathVariable Long id,
                                             @RequestBody GradeDTO gradeDetails) {
        return ResponseEntity.ok(gradeService.update(id, gradeDetails));
    }

    /**
     * DELETE /grades/{id} - delete a grade
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id) {
        gradeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /grades - delete all grades
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAllGrades() {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
    }
}
