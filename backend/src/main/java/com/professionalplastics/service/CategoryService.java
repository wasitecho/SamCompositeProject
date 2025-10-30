package com.professionalplastics.service;

import com.professionalplastics.dtos.CategoryDTO;
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
public class CategoryService implements BaseCrudService<CategoryDTO> {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private GradeRepository gradeRepository;

    @Override
    public CategoryDTO getById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + id));
        return toDto(category);
    }

    @Override
    public List<CategoryDTO> getAll() {
        return categoryRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public CategoryDTO create(CategoryDTO dto) {
        Category category = new Category(dto.getName());
        Category saved = categoryRepository.save(category);
        return toDto(saved);
    }

    @Override
    public CategoryDTO update(Long id, CategoryDTO dto) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + id));
        existing.setName(dto.getName());
        return toDto(categoryRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Category not found: " + id);
        }
        categoryRepository.deleteById(id);
    }

    public List<CategoryDTO> getAllWithGrades() {
        return categoryRepository.findAll().stream().map(c -> {
            CategoryDTO dto = toDto(c);
            List<String> gradeNames = gradeRepository.findByCategoryId(c.getId())
                    .stream().map(Grade::getTypeCode).collect(Collectors.toList());
            dto.setGrades(gradeNames);
            return dto;
        }).collect(Collectors.toList());
    }

    private CategoryDTO toDto(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        return dto;
    }
}


