package com.professionalplastics.dtos;

import java.math.BigDecimal;
import java.util.List;

public class ProductDetailsDTO {
    private Long id;
    private String series;
    private Long gradeId;
    private String gradeTypeCode;
    private List<ProductPriceDTO> prices;

    public ProductDetailsDTO() {}

    public ProductDetailsDTO(Long id, String series, Long gradeId, String gradeTypeCode) {
        this.id = id;
        this.series = series;
        this.gradeId = gradeId;
        this.gradeTypeCode = gradeTypeCode;
    }

    public ProductDetailsDTO(Long id, String series, Long gradeId, String gradeTypeCode, List<ProductPriceDTO> prices) {
        this.id = id;
        this.series = series;
        this.gradeId = gradeId;
        this.gradeTypeCode = gradeTypeCode;
        this.prices = prices;
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

    public Long getGradeId() {
        return gradeId;
    }

    public void setGradeId(Long gradeId) {
        this.gradeId = gradeId;
    }

    public String getGradeTypeCode() {
        return gradeTypeCode;
    }

    public void setGradeTypeCode(String gradeTypeCode) {
        this.gradeTypeCode = gradeTypeCode;
    }

    public List<ProductPriceDTO> getPrices() {
        return prices;
    }

    public void setPrices(List<ProductPriceDTO> prices) {
        this.prices = prices;
    }
}

