package com.professionalplastics.service;

import com.professionalplastics.dtos.ProductDetailsSizeDTO;
import com.professionalplastics.entity.ProductDetailsSize;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.ProductDetailsSizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductDetailsSizeService implements BaseCrudService<ProductDetailsSizeDTO> {

    @Autowired
    private ProductDetailsSizeRepository sizeRepository;

    // Repositories for cascade operations can be injected later if the deletion logic is moved here

    @Override
    public ProductDetailsSizeDTO getById(Long id) {
        ProductDetailsSize size = sizeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Size not found: " + id));
        return toDto(size);
    }

    @Override
    public List<ProductDetailsSizeDTO> getAll() {
        return sizeRepository.findAllByOrderByLengthAndBreadthAsc().stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ProductDetailsSizeDTO create(ProductDetailsSizeDTO dto) {
        if (dto.getLength() == null || dto.getBreadth() == null || dto.getLength() <= 0 || dto.getBreadth() <= 0) {
            throw new IllegalArgumentException("Valid length and breadth are required");
        }
        if (sizeRepository.existsByLengthAndBreadth(dto.getLength(), dto.getBreadth())) {
            throw new IllegalArgumentException("Size with these dimensions already exists");
        }
        ProductDetailsSize saved = sizeRepository.save(new ProductDetailsSize(dto.getLength(), dto.getBreadth()));
        return toDto(saved);
    }

    @Override
    public ProductDetailsSizeDTO update(Long id, ProductDetailsSizeDTO dto) {
        ProductDetailsSize existing = sizeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Size not found: " + id));
        existing.setLength(dto.getLength());
        existing.setBreadth(dto.getBreadth());
        return toDto(sizeRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!sizeRepository.existsById(id)) {
            throw new EntityNotFoundException("Size not found: " + id);
        }
        // Note: controller previously handled cascade deletions; consider moving here if desired
        sizeRepository.deleteById(id);
    }

    public Map<String, Object> toResponse(ProductDetailsSizeDTO dto) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Size added successfully");
        response.put("size", dto);
        return response;
    }

    private ProductDetailsSizeDTO toDto(ProductDetailsSize size) {
        return new ProductDetailsSizeDTO(size.getId(), size.getLength(), size.getBreadth());
    }
}


