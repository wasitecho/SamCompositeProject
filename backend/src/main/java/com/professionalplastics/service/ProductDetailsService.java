package com.professionalplastics.service;

import com.professionalplastics.dtos.ProductDetailsDTO;
import com.professionalplastics.dtos.ProductPriceDTO;
import com.professionalplastics.entity.Grade;
import com.professionalplastics.entity.ProductDetails;
import com.professionalplastics.entity.ProductPrice;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.GradeRepository;
import com.professionalplastics.repository.ProductDetailsRepository;
import com.professionalplastics.repository.ProductPriceRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductDetailsService implements BaseCrudService<ProductDetailsDTO> {

    @Autowired
    private ProductDetailsRepository productDetailsRepository;

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private ProductPriceRepository priceRepository;

    @Override
    public ProductDetailsDTO getById(Long id) {
        ProductDetails pd = productDetailsRepository.findByIdWithGrade(id)
                .orElseThrow(() -> new EntityNotFoundException("ProductDetails not found: " + id));
        return toDto(pd);
    }

    @Override
    public List<ProductDetailsDTO> getAll() {
        return productDetailsRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ProductDetailsDTO> getByGradeId(Long gradeId) {
        // Validate grade
        gradeRepository.findById(gradeId)
                .orElseThrow(() -> new EntityNotFoundException("Grade not found: " + gradeId));
        return productDetailsRepository.findDtoByGradeId(gradeId);
    }

    public Map<String, Object> create(Map<String, Object> request) {
        Long gradeId = Long.valueOf(request.get("gradeId").toString());
        String series = request.get("series").toString();

        if (series == null || series.trim().isEmpty()) {
            throw new IllegalArgumentException("Series is required");
        }

        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new EntityNotFoundException("Grade not found: " + gradeId));

        if (productDetailsRepository.existsByGradeIdAndSeries(gradeId, series.trim())) {
            throw new IllegalArgumentException("Series '" + series.trim() + "' already exists for this grade");
        }

        ProductDetails productDetails = new ProductDetails(series.trim(), grade);
        ProductDetails savedProductDetails = productDetailsRepository.save(productDetails);

        return Map.of(
                "success", true,
                "message", "Product details added successfully",
                "productDetails", new ProductDetailsDTO(
                        savedProductDetails.getId(),
                        savedProductDetails.getSeries(),
                        savedProductDetails.getGrade().getId(),
                        savedProductDetails.getGrade().getTypeCode()
                )
        );
    }
    @Transactional
    public Map<String, Object> update(Long id, Map<String, Object> request) {
        String series = request.get("series").toString();

        if (series == null || series.trim().isEmpty()) {
            throw new IllegalArgumentException("Series is required");
        }

        ProductDetails existing = productDetailsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ProductDetails not found: " + id));

        // Check if series already exists for the same grade (excluding current record)
        if (productDetailsRepository.existsByGradeIdAndSeriesAndIdNot(existing.getGrade().getId(), series.trim(), id)) {
            throw new IllegalArgumentException("Series '" + series.trim() + "' already exists for this grade");
        }

        existing.setSeries(series.trim());
        ProductDetails saved = productDetailsRepository.save(existing);

        return Map.of(
                "success", true,
                "message", "Product details updated successfully",
                "productDetails", new ProductDetailsDTO(
                        saved.getId(),
                        saved.getSeries(),
                        saved.getGrade().getId(),
                        saved.getGrade().getTypeCode()
                )
        );
    }

    public Map<String, Object> getWithPrices(Long gradeId) {
        // Validate grade
        gradeRepository.findById(gradeId)
                .orElseThrow(() -> new EntityNotFoundException("Grade not found: " + gradeId));

        List<ProductDetailsDTO> productDetailsDTOs = productDetailsRepository.findDtoByGradeId(gradeId);

        List<ProductPriceDTO> allPrices = new ArrayList<>();
        List<ProductPrice> prices = priceRepository.findByGradeId(gradeId);
        for (ProductPrice pp : prices) {
            allPrices.add(new ProductPriceDTO(
                    pp.getId(),
                    pp.getProductDetail().getId(),
                    pp.getThickness().getId(),
                    pp.getSize().getId(),
                    pp.getPrice(),
                    pp.getThickness().getThicknessName(),
                    pp.getSize().getLength(),
                    pp.getSize().getBreadth()
            ));
        }

        Map<Long, List<ProductPriceDTO>> pricesByProductDetail = allPrices.stream()
                .collect(Collectors.groupingBy(ProductPriceDTO::getProductDetailId));

        productDetailsDTOs.forEach(pd -> pd.setPrices(pricesByProductDetail.getOrDefault(pd.getId(), new ArrayList<>())));

        return Map.of(
                "success", true,
                "productDetails", productDetailsDTOs
        );
    }

    @Override
    public ProductDetailsDTO create(ProductDetailsDTO dto) {
        throw new IllegalArgumentException("Use create(Map request) for ProductDetails creation");
    }

    @Override
    public ProductDetailsDTO update(Long id, ProductDetailsDTO dto) {
        ProductDetails existing = productDetailsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ProductDetails not found: " + id));
        existing.setSeries(dto.getSeries());
        return toDto(productDetailsRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!productDetailsRepository.existsById(id)) {
            throw new EntityNotFoundException("ProductDetails not found: " + id);
        }
        productDetailsRepository.deleteById(id);
    }

    public void deleteCascade(Long productDetailsId) {
        // Deletion ordering is handled at controller level previously; keep repository-only here
        delete(productDetailsId);
    }

    private ProductDetailsDTO toDto(ProductDetails pd) {
        return new ProductDetailsDTO(pd.getId(), pd.getSeries(), pd.getGrade().getId(), pd.getGrade().getTypeCode());
    }
}


