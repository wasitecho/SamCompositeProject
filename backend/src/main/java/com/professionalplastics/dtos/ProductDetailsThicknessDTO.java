package com.professionalplastics.dtos;

public class ProductDetailsThicknessDTO {
    private Long id;
    private Double thickness;
    private String thicknessName; // Computed field for display

    public ProductDetailsThicknessDTO() {}

    public ProductDetailsThicknessDTO(Long id, Double thickness) {
        this.id = id;
        this.thickness = thickness;
        this.thicknessName = thickness + "mm";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getThickness() {
        return thickness;
    }

    public void setThickness(Double thickness) {
        this.thickness = thickness;
        // Update thicknessName when thickness changes
        if (thickness != null) {
            this.thicknessName = thickness + "mm";
        }
    }

    public String getThicknessName() {
        return thicknessName;
    }

    public void setThicknessName(String thicknessName) {
        this.thicknessName = thicknessName;
    }
}
