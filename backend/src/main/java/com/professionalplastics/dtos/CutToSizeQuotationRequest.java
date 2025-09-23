package com.professionalplastics.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class CutToSizeQuotationRequest {

    @NotBlank(message = "Series is required")
    private String series;

    @NotNull(message = "Thickness is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Thickness must be greater than 0")
    private BigDecimal thickness;

    @NotBlank(message = "Full sheet size is required")
    private String sizeFullSheet;

    @NotNull(message = "Cut length is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Cut length must be greater than 0")
    private BigDecimal cutLength;

    @NotNull(message = "Cut width is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Cut width must be greater than 0")
    private BigDecimal cutWidth;

    @NotNull(message = "Machining cost is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Machining cost must be 0 or greater")
    private BigDecimal machiningCost;

    @NotNull(message = "Cut size area is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Cut size area must be greater than 0")
    private BigDecimal cutSizeArea;

    @NotNull(message = "Quantity per sheet is required")
    @Positive(message = "Quantity per sheet must be positive")
    private Integer quantityPerSheet;

    @NotNull(message = "Number of full sheets required is required")
    @Positive(message = "Number of full sheets required must be positive")
    private Integer numFullSheetsRequired;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @NotNull(message = "Base price full sheet is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price full sheet must be greater than 0")
    private BigDecimal basePriceFullSheet;

    @NotNull(message = "Cut to size price per unit is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Cut to size price per unit must be greater than 0")
    private BigDecimal cutToSizePricePerUnit;

    @NotNull(message = "Total calculated price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total calculated price must be greater than 0")
    private BigDecimal totalCalculatedPrice;

    @NotNull(message = "Product detail ID is required")
    private Long productDetailId;

    @NotNull(message = "Product price ID is required")
    private Long productPriceId;

    public CutToSizeQuotationRequest() {}

    public CutToSizeQuotationRequest(String series, BigDecimal thickness, String sizeFullSheet,
                                     BigDecimal cutLength, BigDecimal cutWidth, BigDecimal machiningCost,
                                     BigDecimal cutSizeArea, Integer quantityPerSheet, Integer numFullSheetsRequired,
                                     Integer quantity, BigDecimal basePriceFullSheet, BigDecimal cutToSizePricePerUnit,
                                     BigDecimal totalCalculatedPrice, Long productDetailId, Long productPriceId) {
        this.series = series;
        this.thickness = thickness;
        this.sizeFullSheet = sizeFullSheet;
        this.cutLength = cutLength;
        this.cutWidth = cutWidth;
        this.machiningCost = machiningCost;
        this.cutSizeArea = cutSizeArea;
        this.quantityPerSheet = quantityPerSheet;
        this.numFullSheetsRequired = numFullSheetsRequired;
        this.quantity = quantity;
        this.basePriceFullSheet = basePriceFullSheet;
        this.cutToSizePricePerUnit = cutToSizePricePerUnit;
        this.totalCalculatedPrice = totalCalculatedPrice;
        this.productDetailId = productDetailId;
        this.productPriceId = productPriceId;
    }

    // Getters and Setters
    public String getSeries() {
        return series;
    }

    public void setSeries(String series) {
        this.series = series;
    }

    public BigDecimal getThickness() {
        return thickness;
    }

    public void setThickness(BigDecimal thickness) {
        this.thickness = thickness;
    }

    public String getSizeFullSheet() {
        return sizeFullSheet;
    }

    public void setSizeFullSheet(String sizeFullSheet) {
        this.sizeFullSheet = sizeFullSheet;
    }

    public BigDecimal getCutLength() {
        return cutLength;
    }

    public void setCutLength(BigDecimal cutLength) {
        this.cutLength = cutLength;
    }

    public BigDecimal getCutWidth() {
        return cutWidth;
    }

    public void setCutWidth(BigDecimal cutWidth) {
        this.cutWidth = cutWidth;
    }

    public BigDecimal getMachiningCost() {
        return machiningCost;
    }

    public void setMachiningCost(BigDecimal machiningCost) {
        this.machiningCost = machiningCost;
    }

    public BigDecimal getCutSizeArea() {
        return cutSizeArea;
    }

    public void setCutSizeArea(BigDecimal cutSizeArea) {
        this.cutSizeArea = cutSizeArea;
    }

    public Integer getQuantityPerSheet() {
        return quantityPerSheet;
    }

    public void setQuantityPerSheet(Integer quantityPerSheet) {
        this.quantityPerSheet = quantityPerSheet;
    }

    public Integer getNumFullSheetsRequired() {
        return numFullSheetsRequired;
    }

    public void setNumFullSheetsRequired(Integer numFullSheetsRequired) {
        this.numFullSheetsRequired = numFullSheetsRequired;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getBasePriceFullSheet() {
        return basePriceFullSheet;
    }

    public void setBasePriceFullSheet(BigDecimal basePriceFullSheet) {
        this.basePriceFullSheet = basePriceFullSheet;
    }

    public BigDecimal getCutToSizePricePerUnit() {
        return cutToSizePricePerUnit;
    }

    public void setCutToSizePricePerUnit(BigDecimal cutToSizePricePerUnit) {
        this.cutToSizePricePerUnit = cutToSizePricePerUnit;
    }

    public BigDecimal getTotalCalculatedPrice() {
        return totalCalculatedPrice;
    }

    public void setTotalCalculatedPrice(BigDecimal totalCalculatedPrice) {
        this.totalCalculatedPrice = totalCalculatedPrice;
    }

    public Long getProductDetailId() {
        return productDetailId;
    }

    public void setProductDetailId(Long productDetailId) {
        this.productDetailId = productDetailId;
    }

    public Long getProductPriceId() {
        return productPriceId;
    }

    public void setProductPriceId(Long productPriceId) {
        this.productPriceId = productPriceId;
    }
}
