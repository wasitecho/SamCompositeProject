package com.professionalplastics.service;

import com.professionalplastics.dtos.ProductDetailsThicknessDTO;
import com.professionalplastics.entity.ProductDetailsThickness;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.ProductDetailsThicknessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductDetailsThicknessService implements BaseCrudService<ProductDetailsThicknessDTO> {

    @Autowired
    private ProductDetailsThicknessRepository thicknessRepository;

    @Override
    public ProductDetailsThicknessDTO getById(Long id) {
        ProductDetailsThickness t = thicknessRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Thickness not found: " + id));
        return toDto(t);
    }

    @Override
    public List<ProductDetailsThicknessDTO> getAll() {
        return thicknessRepository.findAllByOrderByThicknessAsc().stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ProductDetailsThicknessDTO create(ProductDetailsThicknessDTO dto) {
        if (dto.getThickness() == null || dto.getThickness() <= 0) {
            throw new IllegalArgumentException("Valid thickness value is required");
        }
        if (thicknessRepository.existsByThickness(dto.getThickness())) {
            throw new IllegalArgumentException("Thickness with this value already exists");
        }
        ProductDetailsThickness saved = thicknessRepository.save(new ProductDetailsThickness(dto.getThickness()));
        return toDto(saved);
    }

    @Override
    public ProductDetailsThicknessDTO update(Long id, ProductDetailsThicknessDTO dto) {
        ProductDetailsThickness existing = thicknessRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Thickness not found: " + id));
        existing.setThickness(dto.getThickness());
        return toDto(thicknessRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!thicknessRepository.existsById(id)) {
            throw new EntityNotFoundException("Thickness not found: " + id);
        }
        thicknessRepository.deleteById(id);
    }

    public Map<String, Object> toResponse(ProductDetailsThicknessDTO dto) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Thickness added successfully");
        response.put("thickness", dto);
        return response;
    }

    private ProductDetailsThicknessDTO toDto(ProductDetailsThickness t) {
        return new ProductDetailsThicknessDTO(t.getId(), t.getThickness());
    }
}


