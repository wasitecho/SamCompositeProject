package com.professionalplastics.dtos;

public class ProductDTO {
    private Long id;
    private String productName;
    private String description;
    private String categoryName;

    public ProductDTO() {}

    public ProductDTO(Long id, String productName, String description, String categoryName) {
        this.id = id;
        this.productName = productName;
        this.description = description;
        this.categoryName = categoryName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
}


