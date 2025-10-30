package com.professionalplastics.service;

import com.professionalplastics.dtos.GradeDTO;
import com.professionalplastics.entity.Category;
import com.professionalplastics.entity.Grade;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.CategoryRepository;
import com.professionalplastics.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GradeService implements BaseCrudService<GradeDTO> {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public GradeDTO getById(Long id) {
        Grade grade = gradeRepository.findByIdWithCategory(id)
                .orElseThrow(() -> new EntityNotFoundException("Grade not found: " + id));
        return toDto(grade);
    }

    @Override
    public List<GradeDTO> getAll() {
        return gradeRepository.findAllWithCategory().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public GradeDTO create(GradeDTO dto) {
        throw new IllegalArgumentException("Category ID is required to create a Grade");
    }

    public GradeDTO createWithCategory(Long categoryId, GradeDTO dto) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + categoryId));
        Grade grade = new Grade(dto.getTypeCode(), category);
        Grade saved = gradeRepository.save(grade);
        return toDto(saved);
    }

    @Override
    public GradeDTO update(Long id, GradeDTO dto) {
        Grade existing = gradeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Grade not found: " + id));
        existing.setTypeCode(dto.getTypeCode());
        return toDto(gradeRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!gradeRepository.existsById(id)) {
            throw new EntityNotFoundException("Grade not found: " + id);
        }
        gradeRepository.deleteById(id);
    }

    public List<GradeDTO> findByCategoryId(Long categoryId) {
        return gradeRepository.findDtoByCategoryId(categoryId);
    }

    public List<GradeDTO> findByTypeCode(String typeCode) {
        return gradeRepository.findByTypeCode(typeCode).stream().map(this::toDto).collect(Collectors.toList());
    }

    private GradeDTO toDto(Grade grade) {
        return new GradeDTO(grade.getId(), grade.getTypeCode());
    }
}


