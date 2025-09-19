package com.professionalplastics.dtos;

public class ProductDetailsSizeDTO {
    private Long id;
    private Integer length;
    private Integer breadth;

    public ProductDetailsSizeDTO() {}

    public ProductDetailsSizeDTO(Long id, Integer length, Integer breadth) {
        this.id = id;
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
