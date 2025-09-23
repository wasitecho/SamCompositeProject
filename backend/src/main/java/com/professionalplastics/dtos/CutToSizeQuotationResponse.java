package com.professionalplastics.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CutToSizeQuotationResponse {

    private Long id;
    private String series;
    private BigDecimal thickness;
    private String sizeFullSheet;
    private BigDecimal cutLength;
    private BigDecimal cutWidth;
    private BigDecimal machiningCost;
    private BigDecimal cutSizeArea;
    private Integer quantityPerSheet;
    private Integer numFullSheetsRequired;
    private Integer quantity;
    private BigDecimal basePriceFullSheet;
    private BigDecimal cutToSizePricePerUnit;
    private BigDecimal totalCalculatedPrice;
    private LocalDateTime createdAt;
    private String gradeName;

    public CutToSizeQuotationResponse() {}

    public CutToSizeQuotationResponse(Long id, String series, BigDecimal thickness, String sizeFullSheet,
                                     BigDecimal cutLength, BigDecimal cutWidth, BigDecimal machiningCost,
                                     BigDecimal cutSizeArea, Integer quantityPerSheet, Integer numFullSheetsRequired,
                                     Integer quantity, BigDecimal basePriceFullSheet, BigDecimal cutToSizePricePerUnit,
                                     BigDecimal totalCalculatedPrice, LocalDateTime createdAt, String gradeName) {
        this.id = id;
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
        this.createdAt = createdAt;
        this.gradeName = gradeName;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getGradeName() {
        return gradeName;
    }

    public void setGradeName(String gradeName) {
        this.gradeName = gradeName;
    }
}
