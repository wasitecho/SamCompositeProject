package com.professionalplastics.controller;

import com.professionalplastics.dtos.*;
import com.professionalplastics.service.QuotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/quotations")
@CrossOrigin(origins = "*")
public class QuotationController {

    @Autowired
    private QuotationService quotationService;

    // Full Sheets Quotation Endpoints

    @PostMapping("/full-sheets")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES')")
    @Transactional
    public ResponseEntity<?> createFullSheetsQuotation(@Valid @RequestBody FullSheetsQuotationRequest request) {
        FullSheetsQuotationResponse response = quotationService.createFullSheetsQuotation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/full-sheets")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES')")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAllFullSheetsQuotations() {
        return ResponseEntity.ok(quotationService.getAllFullSheetsQuotations());
    }

    // Cut-to-Size Quotation Endpoints

    @PostMapping("/cut-to-size")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES')")
    @Transactional
    public ResponseEntity<?> createCutToSizeQuotation(@Valid @RequestBody CutToSizeQuotationRequest request) {
        CutToSizeQuotationResponse response = quotationService.createCutToSizeQuotation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/cut-to-size")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES')")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAllCutToSizeQuotations() {
        return ResponseEntity.ok(quotationService.getAllCutToSizeQuotations());
    }

    // Generic endpoint to get quotation by ID (works for both types)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES')")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getQuotationById(@PathVariable Long id) {
        Object response = quotationService.getQuotationById(id);
        return ResponseEntity.ok(response);
    }

    // Delete all quotations endpoints

    @DeleteMapping("/full-sheets/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteAllFullSheetsQuotations() {
        long count = quotationService.deleteAllFullSheets();
        return ResponseEntity.ok(Map.of("message", "All full sheets quotations deleted successfully", "deletedCount", count));
    }

    @DeleteMapping("/cut-to-size/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteAllCutToSizeQuotations() {
        long count = quotationService.deleteAllCutToSize();
        return ResponseEntity.ok(Map.of("message", "All cut-to-size quotations deleted successfully", "deletedCount", count));
    }
}