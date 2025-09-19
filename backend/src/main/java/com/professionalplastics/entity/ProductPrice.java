package com.professionalplastics.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "product_price")
public class ProductPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_detail_id", nullable = false)
    @NotNull
    @JsonBackReference
    private ProductDetails productDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thickness_id", nullable = false)
    @NotNull
    @JsonBackReference
    private ProductDetailsThickness thickness;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "size_id", nullable = false)
    @NotNull
    @JsonBackReference
    private ProductDetailsSize size;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    public ProductPrice() {}

    public ProductPrice(ProductDetails productDetail, ProductDetailsThickness thickness, 
                       ProductDetailsSize size, BigDecimal price) {
        this.productDetail = productDetail;
        this.thickness = thickness;
        this.size = size;
        this.price = price;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductDetails getProductDetail() {
        return productDetail;
    }

    public void setProductDetail(ProductDetails productDetail) {
        this.productDetail = productDetail;
    }

    public ProductDetailsThickness getThickness() {
        return thickness;
    }

    public void setThickness(ProductDetailsThickness thickness) {
        this.thickness = thickness;
    }

    public ProductDetailsSize getSize() {
        return size;
    }

    public void setSize(ProductDetailsSize size) {
        this.size = size;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
