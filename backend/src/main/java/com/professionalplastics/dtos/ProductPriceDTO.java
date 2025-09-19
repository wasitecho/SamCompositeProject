package com.professionalplastics.dtos;

import java.math.BigDecimal;

public class ProductPriceDTO {
    private Long id;
    private Long productDetailId;
    private Long thicknessId;
    private Long sizeId;
    private BigDecimal price;
    private String thicknessName;
    private Integer length;
    private Integer breadth;

    public ProductPriceDTO() {}

    public ProductPriceDTO(Long id, Long productDetailId, Long thicknessId, Long sizeId, 
                          BigDecimal price, String thicknessName, Integer length, Integer breadth) {
        this.id = id;
        this.productDetailId = productDetailId;
        this.thicknessId = thicknessId;
        this.sizeId = sizeId;
        this.price = price;
        this.thicknessName = thicknessName;
        this.length = length;
        this.breadth = breadth;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
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
}
