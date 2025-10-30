package com.professionalplastics.service;

import com.professionalplastics.dtos.CutToSizeQuotationRequest;
import com.professionalplastics.dtos.CutToSizeQuotationResponse;
import com.professionalplastics.dtos.FullSheetsQuotationRequest;
import com.professionalplastics.dtos.FullSheetsQuotationResponse;
import com.professionalplastics.entity.*;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuotationService {

    @Autowired private FullSheetsQuotationRepository fullSheetsQuotationRepository;
    @Autowired private CutToSizeQuotationRepository cutToSizeQuotationRepository;
    @Autowired private ProductDetailsRepository productDetailsRepository;
    @Autowired private ProductDetailsThicknessRepository thicknessRepository;
    @Autowired private ProductDetailsSizeRepository sizeRepository;
    @Autowired private ProductPriceRepository productPriceRepository;
    @Autowired private GradeRepository gradeRepository;

    @Transactional
    public FullSheetsQuotationResponse createFullSheetsQuotation(FullSheetsQuotationRequest request) {
        ProductDetails productDetail = productDetailsRepository.findById(request.getProductDetailId())
                .orElseThrow(() -> new EntityNotFoundException("ProductDetails not found: " + request.getProductDetailId()));
        ProductDetailsThickness thickness = thicknessRepository.findById(request.getThicknessId())
                .orElseThrow(() -> new EntityNotFoundException("Thickness not found: " + request.getThicknessId()));
        ProductDetailsSize size = sizeRepository.findById(request.getSizeId())
                .orElseThrow(() -> new EntityNotFoundException("Size not found: " + request.getSizeId()));
        ProductPrice productPrice = productPriceRepository.findById(request.getProductPriceId())
                .orElseThrow(() -> new EntityNotFoundException("ProductPrice not found: " + request.getProductPriceId()));

        Long gradeId = productDetail.getGrade().getId();
        String gradeName = gradeRepository.findById(gradeId).map(Grade::getTypeCode).orElse("Unknown");

        FullSheetsQuotation quotation = new FullSheetsQuotation(
                request.getSeries(),
                request.getThickness(),
                request.getSize(),
                request.getQuantity(),
                request.getBasePrice(),
                request.getTotalPrice(),
                productDetail,
                thickness,
                size,
                productPrice
        );

        FullSheetsQuotation saved = fullSheetsQuotationRepository.save(quotation);
        return new FullSheetsQuotationResponse(
                saved.getId(),
                saved.getSeries(),
                saved.getThickness(),
                saved.getSize(),
                saved.getQuantity(),
                saved.getBasePrice(),
                saved.getTotalPrice(),
                saved.getCreatedAt(),
                gradeName
        );
    }

    @Transactional(readOnly = true)
    public List<FullSheetsQuotationResponse> getAllFullSheetsQuotations() {
        return fullSheetsQuotationRepository.findAllWithGrade().stream()
                .map(q -> new FullSheetsQuotationResponse(
                        q.getId(), q.getSeries(), q.getThickness(), q.getSize(), q.getQuantity(),
                        q.getBasePrice(), q.getTotalPrice(), q.getCreatedAt(), q.getProductDetail().getGrade().getTypeCode()))
                .collect(Collectors.toList());
    }

    @Transactional
    public CutToSizeQuotationResponse createCutToSizeQuotation(CutToSizeQuotationRequest request) {
        ProductDetails productDetail = productDetailsRepository.findById(request.getProductDetailId())
                .orElseThrow(() -> new EntityNotFoundException("ProductDetails not found: " + request.getProductDetailId()));
        ProductPrice productPrice = productPriceRepository.findById(request.getProductPriceId())
                .orElseThrow(() -> new EntityNotFoundException("ProductPrice not found: " + request.getProductPriceId()));

        Long gradeId = productDetail.getGrade().getId();
        String gradeName = gradeRepository.findById(gradeId).map(Grade::getTypeCode).orElse("Unknown");

        CutToSizeQuotation quotation = new CutToSizeQuotation(
                request.getSeries(), request.getThickness(), request.getSizeFullSheet(), request.getCutLength(),
                request.getCutWidth(), request.getMachiningCost(), request.getCutSizeArea(), request.getQuantityPerSheet(),
                request.getNumFullSheetsRequired(), request.getQuantity(), request.getBasePriceFullSheet(),
                request.getCutToSizePricePerUnit(), request.getTotalCalculatedPrice(), productDetail, productPrice
        );

        CutToSizeQuotation saved = cutToSizeQuotationRepository.save(quotation);
        return new CutToSizeQuotationResponse(
                saved.getId(), saved.getSeries(), saved.getThickness(), saved.getSizeFullSheet(), saved.getCutLength(),
                saved.getCutWidth(), saved.getMachiningCost(), saved.getCutSizeArea(), saved.getQuantityPerSheet(),
                saved.getNumFullSheetsRequired(), saved.getQuantity(), saved.getBasePriceFullSheet(),
                saved.getCutToSizePricePerUnit(), saved.getTotalCalculatedPrice(), saved.getCreatedAt(), gradeName
        );
    }

    @Transactional(readOnly = true)
    public List<CutToSizeQuotationResponse> getAllCutToSizeQuotations() {
        return cutToSizeQuotationRepository.findAllWithGrade().stream()
                .map(q -> new CutToSizeQuotationResponse(
                        q.getId(), q.getSeries(), q.getThickness(), q.getSizeFullSheet(), q.getCutLength(), q.getCutWidth(),
                        q.getMachiningCost(), q.getCutSizeArea(), q.getQuantityPerSheet(), q.getNumFullSheetsRequired(),
                        q.getQuantity(), q.getBasePriceFullSheet(), q.getCutToSizePricePerUnit(), q.getTotalCalculatedPrice(),
                        q.getCreatedAt(), q.getProductDetail().getGrade().getTypeCode()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Object getQuotationById(Long id) {
        Optional<FullSheetsQuotation> fullSheetsOpt = fullSheetsQuotationRepository.findByIdWithGrade(id);
        if (fullSheetsOpt.isPresent()) {
            FullSheetsQuotation q = fullSheetsOpt.get();
            return new FullSheetsQuotationResponse(
                    q.getId(), q.getSeries(), q.getThickness(), q.getSize(), q.getQuantity(),
                    q.getBasePrice(), q.getTotalPrice(), q.getCreatedAt(), q.getProductDetail().getGrade().getTypeCode());
        }

        Optional<CutToSizeQuotation> cutToSizeOpt = cutToSizeQuotationRepository.findByIdWithGrade(id);
        if (cutToSizeOpt.isPresent()) {
            CutToSizeQuotation q = cutToSizeOpt.get();
            return new CutToSizeQuotationResponse(
                    q.getId(), q.getSeries(), q.getThickness(), q.getSizeFullSheet(), q.getCutLength(), q.getCutWidth(),
                    q.getMachiningCost(), q.getCutSizeArea(), q.getQuantityPerSheet(), q.getNumFullSheetsRequired(),
                    q.getQuantity(), q.getBasePriceFullSheet(), q.getCutToSizePricePerUnit(), q.getTotalCalculatedPrice(),
                    q.getCreatedAt(), q.getProductDetail().getGrade().getTypeCode());
        }

        throw new EntityNotFoundException("Quotation not found: " + id);
    }

    @Transactional
    public long deleteAllFullSheets() {
        long count = fullSheetsQuotationRepository.count();
        fullSheetsQuotationRepository.deleteAll();
        return count;
    }

    @Transactional
    public long deleteAllCutToSize() {
        long count = cutToSizeQuotationRepository.count();
        cutToSizeQuotationRepository.deleteAll();
        return count;
    }
}


