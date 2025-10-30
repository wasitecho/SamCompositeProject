package com.professionalplastics.service;

import com.professionalplastics.dtos.CutToSizeQuotationRequest;
import com.professionalplastics.dtos.CutToSizeQuotationResponse;
import com.professionalplastics.dtos.FullSheetsQuotationRequest;
import com.professionalplastics.dtos.FullSheetsQuotationResponse;
import com.professionalplastics.entity.*;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuotationServiceTest {

    @Mock
    private FullSheetsQuotationRepository fullSheetsQuotationRepository;
    @Mock
    private CutToSizeQuotationRepository cutToSizeQuotationRepository;
    @Mock
    private ProductDetailsRepository productDetailsRepository;
    @Mock
    private ProductDetailsThicknessRepository thicknessRepository;
    @Mock
    private ProductDetailsSizeRepository sizeRepository;
    @Mock
    private ProductPriceRepository productPriceRepository;
    @Mock
    private GradeRepository gradeRepository;

    @InjectMocks
    private QuotationService quotationService;

    private ProductDetails testProductDetails;
    private ProductDetailsThickness testThickness;
    private ProductDetailsSize testSize;
    private ProductPrice testProductPrice;
    private Grade testGrade;
    private FullSheetsQuotation testFullSheetsQuotation;
    private CutToSizeQuotation testCutToSizeQuotation;

    @BeforeEach
    void setUp() {
        // Setup entities
        Category testCategory = new Category("Test Category");
        testGrade = new Grade("TEST001", testCategory);
        testGrade.setId(1L);
        testProductDetails = new ProductDetails("Test Series", testGrade);
        testProductDetails.setId(1L);
        
        testThickness = new ProductDetailsThickness(2.5);
        testThickness.setId(1L);
        
        testSize = new ProductDetailsSize(100, 200);
        testSize.setId(1L);
        
        testProductPrice = new ProductPrice(testProductDetails, testThickness, testSize, new BigDecimal("100.00"));
        testProductPrice.setId(1L);
        
        testFullSheetsQuotation = new FullSheetsQuotation(
                "Test Series", new BigDecimal("2.5"), "100x200", 10, 
                new BigDecimal("100.00"), new BigDecimal("1000.00"),
                testProductDetails, testThickness, testSize, testProductPrice
        );
        testFullSheetsQuotation.setId(1L);
        testFullSheetsQuotation.setCreatedAt(LocalDateTime.now());
        
        testCutToSizeQuotation = new CutToSizeQuotation(
                "Test Series", new BigDecimal("2.5"), "100x200", 
                new BigDecimal("50"), new BigDecimal("25"), 
                new BigDecimal("10.00"), new BigDecimal("1250"), 2, 5, 10,
                new BigDecimal("100.00"), new BigDecimal("12.50"), new BigDecimal("125.00"),
                testProductDetails, testProductPrice
        );
        testCutToSizeQuotation.setId(1L);
        testCutToSizeQuotation.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createFullSheetsQuotation_WithValidRequest_ShouldCreateQuotation() {
        // Given
        FullSheetsQuotationRequest request = new FullSheetsQuotationRequest();
        request.setProductDetailId(1L);
        request.setThicknessId(1L);
        request.setSizeId(1L);
        request.setProductPriceId(1L);
        request.setSeries("Test Series");
        request.setThickness(new BigDecimal("2.5"));
        request.setSize("100x200");
        request.setQuantity(10);
        request.setBasePrice(new BigDecimal("100.00"));
        request.setTotalPrice(new BigDecimal("1000.00"));
        
        when(productDetailsRepository.findById(1L)).thenReturn(Optional.of(testProductDetails));
        when(thicknessRepository.findById(1L)).thenReturn(Optional.of(testThickness));
        when(sizeRepository.findById(1L)).thenReturn(Optional.of(testSize));
        when(productPriceRepository.findById(1L)).thenReturn(Optional.of(testProductPrice));
        when(gradeRepository.findById(1L)).thenReturn(Optional.of(testGrade));
        when(fullSheetsQuotationRepository.save(any(FullSheetsQuotation.class))).thenReturn(testFullSheetsQuotation);

        // When
        FullSheetsQuotationResponse result = quotationService.createFullSheetsQuotation(request);

        // Then
        assertNotNull(result);
        assertEquals(testFullSheetsQuotation.getId(), result.getId());
        assertEquals("Test Series", result.getSeries());
        verify(fullSheetsQuotationRepository).save(any(FullSheetsQuotation.class));
    }

    @Test
    void createFullSheetsQuotation_WithNonExistentProductDetails_ShouldThrowException() {
        // Given
        FullSheetsQuotationRequest request = new FullSheetsQuotationRequest();
        request.setProductDetailId(1L);
        when(productDetailsRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> quotationService.createFullSheetsQuotation(request));
    }

    @Test
    void getAllFullSheetsQuotations_ShouldReturnAllQuotations() {
        // Given
        List<FullSheetsQuotation> quotations = Arrays.asList(testFullSheetsQuotation);
        when(fullSheetsQuotationRepository.findAllWithGrade()).thenReturn(quotations);

        // When
        List<FullSheetsQuotationResponse> result = quotationService.getAllFullSheetsQuotations();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testFullSheetsQuotation.getId(), result.get(0).getId());
    }

    @Test
    void createCutToSizeQuotation_WithValidRequest_ShouldCreateQuotation() {
        // Given
        CutToSizeQuotationRequest request = new CutToSizeQuotationRequest();
        request.setProductDetailId(1L);
        request.setProductPriceId(1L);
        request.setSeries("Test Series");
        request.setThickness(new BigDecimal("2.5"));
        request.setSizeFullSheet("100x200");
        request.setCutLength(new BigDecimal("50"));
        request.setCutWidth(new BigDecimal("25"));
        request.setMachiningCost(new BigDecimal("10.00"));
        request.setCutSizeArea(new BigDecimal("1250"));
        request.setQuantityPerSheet(2);
        request.setNumFullSheetsRequired(5);
        request.setQuantity(10);
        request.setBasePriceFullSheet(new BigDecimal("100.00"));
        request.setCutToSizePricePerUnit(new BigDecimal("12.50"));
        request.setTotalCalculatedPrice(new BigDecimal("125.00"));
        
        when(productDetailsRepository.findById(1L)).thenReturn(Optional.of(testProductDetails));
        when(productPriceRepository.findById(1L)).thenReturn(Optional.of(testProductPrice));
        when(gradeRepository.findById(1L)).thenReturn(Optional.of(testGrade));
        when(cutToSizeQuotationRepository.save(any(CutToSizeQuotation.class))).thenReturn(testCutToSizeQuotation);

        // When
        CutToSizeQuotationResponse result = quotationService.createCutToSizeQuotation(request);

        // Then
        assertNotNull(result);
        assertEquals(testCutToSizeQuotation.getId(), result.getId());
        assertEquals("Test Series", result.getSeries());
        verify(cutToSizeQuotationRepository).save(any(CutToSizeQuotation.class));
    }

    @Test
    void getAllCutToSizeQuotations_ShouldReturnAllQuotations() {
        // Given
        List<CutToSizeQuotation> quotations = Arrays.asList(testCutToSizeQuotation);
        when(cutToSizeQuotationRepository.findAllWithGrade()).thenReturn(quotations);

        // When
        List<CutToSizeQuotationResponse> result = quotationService.getAllCutToSizeQuotations();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testCutToSizeQuotation.getId(), result.get(0).getId());
    }

    @Test
    void getQuotationById_WithFullSheetsQuotation_ShouldReturnFullSheetsResponse() {
        // Given
        when(fullSheetsQuotationRepository.findByIdWithGrade(1L)).thenReturn(Optional.of(testFullSheetsQuotation));

        // When
        Object result = quotationService.getQuotationById(1L);

        // Then
        assertNotNull(result);
        assertTrue(result instanceof FullSheetsQuotationResponse);
        FullSheetsQuotationResponse response = (FullSheetsQuotationResponse) result;
        assertEquals(testFullSheetsQuotation.getId(), response.getId());
    }

    @Test
    void getQuotationById_WithCutToSizeQuotation_ShouldReturnCutToSizeResponse() {
        // Given
        when(fullSheetsQuotationRepository.findByIdWithGrade(1L)).thenReturn(Optional.empty());
        when(cutToSizeQuotationRepository.findByIdWithGrade(1L)).thenReturn(Optional.of(testCutToSizeQuotation));

        // When
        Object result = quotationService.getQuotationById(1L);

        // Then
        assertNotNull(result);
        assertTrue(result instanceof CutToSizeQuotationResponse);
        CutToSizeQuotationResponse response = (CutToSizeQuotationResponse) result;
        assertEquals(testCutToSizeQuotation.getId(), response.getId());
    }

    @Test
    void getQuotationById_WithNonExistentQuotation_ShouldThrowException() {
        // Given
        when(fullSheetsQuotationRepository.findByIdWithGrade(1L)).thenReturn(Optional.empty());
        when(cutToSizeQuotationRepository.findByIdWithGrade(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> quotationService.getQuotationById(1L));
    }

    @Test
    void deleteAllFullSheets_ShouldDeleteAllAndReturnCount() {
        // Given
        when(fullSheetsQuotationRepository.count()).thenReturn(5L);

        // When
        long result = quotationService.deleteAllFullSheets();

        // Then
        assertEquals(5L, result);
        verify(fullSheetsQuotationRepository).deleteAll();
    }

    @Test
    void deleteAllCutToSize_ShouldDeleteAllAndReturnCount() {
        // Given
        when(cutToSizeQuotationRepository.count()).thenReturn(3L);

        // When
        long result = quotationService.deleteAllCutToSize();

        // Then
        assertEquals(3L, result);
        verify(cutToSizeQuotationRepository).deleteAll();
    }
}
