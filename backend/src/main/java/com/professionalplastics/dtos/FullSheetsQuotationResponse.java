package com.professionalplastics.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FullSheetsQuotationResponse {

    private Long id;
    private String series;
    private BigDecimal thickness;
    private String size;
    private Integer quantity;
    private BigDecimal basePrice;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
    private String gradeName;

    public FullSheetsQuotationResponse() {}

    public FullSheetsQuotationResponse(Long id, String series, BigDecimal thickness, String size,
                                      Integer quantity, BigDecimal basePrice, BigDecimal totalPrice,
                                      LocalDateTime createdAt, String gradeName) {
        this.id = id;
        this.series = series;
        this.thickness = thickness;
        this.size = size;
        this.quantity = quantity;
        this.basePrice = basePrice;
        this.totalPrice = totalPrice;
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

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
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
