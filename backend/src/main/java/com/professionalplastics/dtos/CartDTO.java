package com.professionalplastics.dtos;

import java.math.BigDecimal;

public class CartDTO {
    private Long id;
    private Integer quantity;
    private BigDecimal totalPrice;
    private BigDecimal unitPrice;
    private String series;
    private String gradeName;
    private String thicknessName;
    private Integer length;
    private Integer breadth;
    private Long productPriceId;
    private BigDecimal discount;

    public CartDTO() {}

    public CartDTO(Long id, Integer quantity, BigDecimal totalPrice, BigDecimal unitPrice,
                   String series, String gradeName, String thicknessName, Integer length, Integer breadth, Long productPriceId) {
        this.id = id;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.unitPrice = unitPrice;
        this.series = series;
        this.gradeName = gradeName;
        this.thicknessName = thicknessName;
        this.length = length;
        this.breadth = breadth;
        this.productPriceId = productPriceId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getSeries() {
        return series;
    }

    public void setSeries(String series) {
        this.series = series;
    }

    public String getGradeName() {
        return gradeName;
    }

    public void setGradeName(String gradeName) {
        this.gradeName = gradeName;
    }

    public String getThicknessName() {
        return thicknessName;
    }

    public void setThicknessName(String thicknessName) {
        this.thicknessName = thicknessName;
    }

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public Integer getBreadth() {
        return breadth;
    }

    public void setBreadth(Integer breadth) {
        this.breadth = breadth;
    }

    public Long getProductPriceId() {
        return productPriceId;
    }

    public void setProductPriceId(Long productPriceId) {
        this.productPriceId = productPriceId;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }
}
