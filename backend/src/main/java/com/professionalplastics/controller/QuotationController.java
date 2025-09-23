package com.professionalplastics.controller;

import com.professionalplastics.dtos.*;
import com.professionalplastics.entity.*;
import com.professionalplastics.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quotations")
@CrossOrigin(origins = "http://localhost:5173")
public class QuotationController {

    @Autowired
    private FullSheetsQuotationRepository fullSheetsQuotationRepository;

    @Autowired
    private CutToSizeQuotationRepository cutToSizeQuotationRepository;

    @Autowired
    private ProductDetailsRepository productDetailsRepository;

    @Autowired
    private ProductDetailsThicknessRepository thicknessRepository;

    @Autowired
    private ProductDetailsSizeRepository sizeRepository;

    @Autowired
    private ProductPriceRepository productPriceRepository;

    // Full Sheets Quotation Endpoints

    @PostMapping("/full-sheets")
    public ResponseEntity<?> createFullSheetsQuotation(@Valid @RequestBody FullSheetsQuotationRequest request) {
        try {
            // Fetch related entities
            Optional<ProductDetails> productDetailOpt = productDetailsRepository.findById(request.getProductDetailId());
            Optional<ProductDetailsThickness> thicknessOpt = thicknessRepository.findById(request.getThicknessId());
            Optional<ProductDetailsSize> sizeOpt = sizeRepository.findById(request.getSizeId());
            Optional<ProductPrice> productPriceOpt = productPriceRepository.findById(request.getProductPriceId());

            if (productDetailOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("ProductDetails not found with ID: " + request.getProductDetailId());
            }
            if (thicknessOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("ProductDetailsThickness not found with ID: " + request.getThicknessId());
            }
            if (sizeOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("ProductDetailsSize not found with ID: " + request.getSizeId());
            }
            if (productPriceOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("ProductPrice not found with ID: " + request.getProductPriceId());
            }

            // Create quotation entity
            FullSheetsQuotation quotation = new FullSheetsQuotation(
                request.getSeries(),
                request.getThickness(),
                request.getSize(),
                request.getQuantity(),
                request.getBasePrice(),
                request.getTotalPrice(),
                productDetailOpt.get(),
                thicknessOpt.get(),
                sizeOpt.get(),
                productPriceOpt.get()
            );

            FullSheetsQuotation savedQuotation = fullSheetsQuotationRepository.save(quotation);

            // Create response
            FullSheetsQuotationResponse response = new FullSheetsQuotationResponse(
                savedQuotation.getId(),
                savedQuotation.getSeries(),
                savedQuotation.getThickness(),
                savedQuotation.getSize(),
                savedQuotation.getQuantity(),
                savedQuotation.getBasePrice(),
                savedQuotation.getTotalPrice(),
                savedQuotation.getCreatedAt(),
                productDetailOpt.get().getGrade().getTypeCode()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating full sheets quotation: " + e.getMessage());
        }
    }

    @GetMapping("/full-sheets")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAllFullSheetsQuotations() {
        try {
            List<FullSheetsQuotation> quotations = fullSheetsQuotationRepository.findAllWithGrade();
            
            List<FullSheetsQuotationResponse> responses = quotations.stream()
                .map(q -> new FullSheetsQuotationResponse(
                    q.getId(),
                    q.getSeries(),
                    q.getThickness(),
                    q.getSize(),
                    q.getQuantity(),
                    q.getBasePrice(),
                    q.getTotalPrice(),
                    q.getCreatedAt(),
                    q.getProductDetail().getGrade().getTypeCode()
                ))
                .collect(Collectors.toList());

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching full sheets quotations: " + e.getMessage());
        }
    }

    // Cut-to-Size Quotation Endpoints

    @PostMapping("/cut-to-size")
    public ResponseEntity<?> createCutToSizeQuotation(@Valid @RequestBody CutToSizeQuotationRequest request) {
        try {
            // Fetch related entities
            Optional<ProductDetails> productDetailOpt = productDetailsRepository.findById(request.getProductDetailId());
            Optional<ProductPrice> productPriceOpt = productPriceRepository.findById(request.getProductPriceId());

            if (productDetailOpt.isEmpty() || productPriceOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("One or more related entities not found");
            }

            // Create quotation entity
            CutToSizeQuotation quotation = new CutToSizeQuotation(
                request.getSeries(),
                request.getThickness(),
                request.getSizeFullSheet(),
                request.getCutLength(),
                request.getCutWidth(),
                request.getMachiningCost(),
                request.getCutSizeArea(),
                request.getQuantityPerSheet(),
                request.getNumFullSheetsRequired(),
                request.getQuantity(),
                request.getBasePriceFullSheet(),
                request.getCutToSizePricePerUnit(),
                request.getTotalCalculatedPrice(),
                productDetailOpt.get(),
                productPriceOpt.get()
            );

            CutToSizeQuotation savedQuotation = cutToSizeQuotationRepository.save(quotation);

            // Create response
            CutToSizeQuotationResponse response = new CutToSizeQuotationResponse(
                savedQuotation.getId(),
                savedQuotation.getSeries(),
                savedQuotation.getThickness(),
                savedQuotation.getSizeFullSheet(),
                savedQuotation.getCutLength(),
                savedQuotation.getCutWidth(),
                savedQuotation.getMachiningCost(),
                savedQuotation.getCutSizeArea(),
                savedQuotation.getQuantityPerSheet(),
                savedQuotation.getNumFullSheetsRequired(),
                savedQuotation.getQuantity(),
                savedQuotation.getBasePriceFullSheet(),
                savedQuotation.getCutToSizePricePerUnit(),
                savedQuotation.getTotalCalculatedPrice(),
                savedQuotation.getCreatedAt(),
                productDetailOpt.get().getGrade().getTypeCode()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating cut-to-size quotation: " + e.getMessage());
        }
    }

    @GetMapping("/cut-to-size")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAllCutToSizeQuotations() {
        try {
            List<CutToSizeQuotation> quotations = cutToSizeQuotationRepository.findAllWithGrade();
            
            List<CutToSizeQuotationResponse> responses = quotations.stream()
                .map(q -> new CutToSizeQuotationResponse(
                    q.getId(),
                    q.getSeries(),
                    q.getThickness(),
                    q.getSizeFullSheet(),
                    q.getCutLength(),
                    q.getCutWidth(),
                    q.getMachiningCost(),
                    q.getCutSizeArea(),
                    q.getQuantityPerSheet(),
                    q.getNumFullSheetsRequired(),
                    q.getQuantity(),
                    q.getBasePriceFullSheet(),
                    q.getCutToSizePricePerUnit(),
                    q.getTotalCalculatedPrice(),
                    q.getCreatedAt(),
                    q.getProductDetail().getGrade().getTypeCode()
                ))
                .collect(Collectors.toList());

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching cut-to-size quotations: " + e.getMessage());
        }
    }

    // Generic endpoint to get quotation by ID (works for both types)
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getQuotationById(@PathVariable Long id) {
        try {
            // Try full sheets first
            Optional<FullSheetsQuotation> fullSheetsOpt = fullSheetsQuotationRepository.findByIdWithGrade(id);
            if (fullSheetsOpt.isPresent()) {
                FullSheetsQuotation q = fullSheetsOpt.get();
                FullSheetsQuotationResponse response = new FullSheetsQuotationResponse(
                    q.getId(),
                    q.getSeries(),
                    q.getThickness(),
                    q.getSize(),
                    q.getQuantity(),
                    q.getBasePrice(),
                    q.getTotalPrice(),
                    q.getCreatedAt(),
                    q.getProductDetail().getGrade().getTypeCode()
                );
                return ResponseEntity.ok(response);
            }

            // Try cut-to-size
            Optional<CutToSizeQuotation> cutToSizeOpt = cutToSizeQuotationRepository.findByIdWithGrade(id);
            if (cutToSizeOpt.isPresent()) {
                CutToSizeQuotation q = cutToSizeOpt.get();
                CutToSizeQuotationResponse response = new CutToSizeQuotationResponse(
                    q.getId(),
                    q.getSeries(),
                    q.getThickness(),
                    q.getSizeFullSheet(),
                    q.getCutLength(),
                    q.getCutWidth(),
                    q.getMachiningCost(),
                    q.getCutSizeArea(),
                    q.getQuantityPerSheet(),
                    q.getNumFullSheetsRequired(),
                    q.getQuantity(),
                    q.getBasePriceFullSheet(),
                    q.getCutToSizePricePerUnit(),
                    q.getTotalCalculatedPrice(),
                    q.getCreatedAt(),
                    q.getProductDetail().getGrade().getTypeCode()
                );
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching quotation: " + e.getMessage());
        }
    }

    // Delete all quotations endpoints

    @DeleteMapping("/full-sheets/all")
    @Transactional
    public ResponseEntity<?> deleteAllFullSheetsQuotations() {
        try {
            long count = fullSheetsQuotationRepository.count();
            fullSheetsQuotationRepository.deleteAll();
            
            return ResponseEntity.ok(Map.of(
                "message", "All full sheets quotations deleted successfully",
                "deletedCount", count
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting all full sheets quotations: " + e.getMessage());
        }
    }

    @DeleteMapping("/cut-to-size/all")
    @Transactional
    public ResponseEntity<?> deleteAllCutToSizeQuotations() {
        try {
            long count = cutToSizeQuotationRepository.count();
            cutToSizeQuotationRepository.deleteAll();
            
            return ResponseEntity.ok(Map.of(
                "message", "All cut-to-size quotations deleted successfully",
                "deletedCount", count
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting all cut-to-size quotations: " + e.getMessage());
        }
    }
}