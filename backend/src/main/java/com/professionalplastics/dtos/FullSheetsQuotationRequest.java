package com.professionalplastics.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class FullSheetsQuotationRequest {

    @NotBlank(message = "Series is required")
    private String series;

    @NotNull(message = "Thickness is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Thickness must be greater than 0")
    private BigDecimal thickness;

    @NotBlank(message = "Size is required")
    private String size;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than 0")
    private BigDecimal basePrice;

    @NotNull(message = "Total price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total price must be greater than 0")
    private BigDecimal totalPrice;

    @NotNull(message = "Product detail ID is required")
    private Long productDetailId;

    @NotNull(message = "Thickness ID is required")
    private Long thicknessId;

    @NotNull(message = "Size ID is required")
    private Long sizeId;

    @NotNull(message = "Product price ID is required")
    private Long productPriceId;

    public FullSheetsQuotationRequest() {}

    public FullSheetsQuotationRequest(String series, BigDecimal thickness, String size, 
                                     Integer quantity, BigDecimal basePrice, BigDecimal totalPrice,
                                     Long productDetailId, Long thicknessId, Long sizeId, Long productPriceId) {
        this.series = series;
        this.thickness = thickness;
        this.size = size;
        this.quantity = quantity;
        this.basePrice = basePrice;
        this.totalPrice = totalPrice;
        this.productDetailId = productDetailId;
        this.thicknessId = thicknessId;
        this.sizeId = sizeId;
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

    public Long getProductDetailId() {
        return productDetailId;
    }

    public void setProductDetailId(Long productDetailId) {
        this.productDetailId = productDetailId;
    }

    public Long getThicknessId() {
        return thicknessId;
    }

    public void setThicknessId(Long thicknessId) {
        this.thicknessId = thicknessId;
    }

    public Long getSizeId() {
        return sizeId;
    }

    public void setSizeId(Long sizeId) {
        this.sizeId = sizeId;
    }

    public Long getProductPriceId() {
        return productPriceId;
    }

    public void setProductPriceId(Long productPriceId) {
        this.productPriceId = productPriceId;
    }

    @Override
    public String toString() {
        return "FullSheetsQuotationRequest{" +
                "series='" + series + '\'' +
                ", thickness=" + thickness +
                ", size='" + size + '\'' +
                ", quantity=" + quantity +
                ", basePrice=" + basePrice +
                ", totalPrice=" + totalPrice +
                ", productDetailId=" + productDetailId +
                ", thicknessId=" + thicknessId +
                ", sizeId=" + sizeId +
                ", productPriceId=" + productPriceId +
                '}';
    }
}
