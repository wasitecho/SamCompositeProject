package com.professionalplastics.service;

import com.professionalplastics.dtos.ProductPriceDTO;
import com.professionalplastics.entity.ProductDetails;
import com.professionalplastics.entity.ProductDetailsSize;
import com.professionalplastics.entity.ProductDetailsThickness;
import com.professionalplastics.entity.ProductPrice;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.ProductDetailsRepository;
import com.professionalplastics.repository.ProductDetailsSizeRepository;
import com.professionalplastics.repository.ProductDetailsThicknessRepository;
import com.professionalplastics.repository.ProductPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class              ProductPriceService implements BaseCrudService<ProductPriceDTO> {

    @Autowired
    private ProductPriceRepository priceRepository;
    @Autowired
    private ProductDetailsRepository productDetailsRepository;
    @Autowired
    private ProductDetailsThicknessRepository thicknessRepository;
    @Autowired
    private ProductDetailsSizeRepository sizeRepository;

    @Override
    public ProductPriceDTO getById(Long id) {
        ProductPrice p = priceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Price not found: " + id));
        return toDto(p);
    }

    @Override
    public List<ProductPriceDTO> getAll() {
        return priceRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ProductPriceDTO create(ProductPriceDTO dto) {
        if (dto.getPrice() == null || dto.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }

        ProductDetails productDetail = productDetailsRepository.findById(dto.getProductDetailId())
                .orElseThrow(() -> new EntityNotFoundException("ProductDetails not found: " + dto.getProductDetailId()));
        ProductDetailsThickness thickness = thicknessRepository.findById(dto.getThicknessId())
                .orElseThrow(() -> new EntityNotFoundException("Thickness not found: " + dto.getThicknessId()));
        ProductDetailsSize size = sizeRepository.findById(dto.getSizeId())
                .orElseThrow(() -> new EntityNotFoundException("Size not found: " + dto.getSizeId()));

        Optional<ProductPrice> existing = priceRepository.findByProductDetailAndThicknessAndSize(productDetail, thickness, size);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Combination of Product Detail, Thickness '" + thickness.getThicknessName() +
                    "', and Size '" + size.getLength() + "x" + size.getBreadth() + "' already exists");
        }

        ProductPrice saved = priceRepository.save(new ProductPrice(productDetail, thickness, size, dto.getPrice()));
        return toDto(saved);
    }

    @Override
    @Transactional
    public ProductPriceDTO update(Long id, ProductPriceDTO dto) {
        ProductPrice existing = priceRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new EntityNotFoundException("Price not found: " + id));
        if (dto.getPrice() != null) {
            existing.setPrice(dto.getPrice());
        }
        ProductPrice saved = priceRepository.save(existing);
        return toDto(saved);
    }

    @Override
    public void delete(Long id) {
        if (!priceRepository.existsById(id)) {
            throw new EntityNotFoundException("Price not found: " + id);
        }
        priceRepository.deleteById(id);
    }

    public List<ProductPriceDTO> getByGrade(Long gradeId) {
        return priceRepository.findByGradeId(gradeId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public Map<String, Object> toCreateResponse(ProductPriceDTO dto) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Price added successfully");
        response.put("price", dto);
        return response;
    }

    private ProductPriceDTO toDto(ProductPrice p) {
        return new ProductPriceDTO(
                p.getId(),
                p.getProductDetail().getId(),
                p.getThickness().getId(),
                p.getSize().getId(),
                p.getPrice(),
                p.getThickness().getThicknessName(),
                p.getSize().getLength(),
                p.getSize().getBreadth()
        );
    }
}


