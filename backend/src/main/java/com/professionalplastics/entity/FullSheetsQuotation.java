package com.professionalplastics.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "full_sheets_quotation")
public class FullSheetsQuotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String series;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal thickness;

    @NotBlank
    @Column(nullable = false)
    private String size;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer quantity;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_detail_id", nullable = false)
    @NotNull
    @JsonBackReference
    private ProductDetails productDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thickness_id", nullable = false)
    @NotNull
    @JsonBackReference
    private ProductDetailsThickness thicknessEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "size_id", nullable = false)
    @NotNull
    @JsonBackReference
    private ProductDetailsSize sizeEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_price_id", nullable = false)
    @NotNull
    @JsonBackReference
    private ProductPrice productPrice;

    public FullSheetsQuotation() {
        this.createdAt = LocalDateTime.now();
    }

    public FullSheetsQuotation(String series, BigDecimal thickness, String size, 
                               Integer quantity, BigDecimal basePrice, BigDecimal totalPrice,
                               ProductDetails productDetail, ProductDetailsThickness thicknessEntity,
                               ProductDetailsSize sizeEntity, ProductPrice productPrice) {
        this();
        this.series = series;
        this.thickness = thickness;
        this.size = size;
        this.quantity = quantity;
        this.basePrice = basePrice;
        this.totalPrice = totalPrice;
        this.productDetail = productDetail;
        this.thicknessEntity = thicknessEntity;
        this.sizeEntity = sizeEntity;
        this.productPrice = productPrice;
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

    public ProductDetails getProductDetail() {
        return productDetail;
    }

    public void setProductDetail(ProductDetails productDetail) {
        this.productDetail = productDetail;
    }

    public ProductDetailsThickness getThicknessEntity() {
        return thicknessEntity;
    }

    public void setThicknessEntity(ProductDetailsThickness thicknessEntity) {
        this.thicknessEntity = thicknessEntity;
    }

    public ProductDetailsSize getSizeEntity() {
        return sizeEntity;
    }

    public void setSizeEntity(ProductDetailsSize sizeEntity) {
        this.sizeEntity = sizeEntity;
    }

    public ProductPrice getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(ProductPrice productPrice) {
        this.productPrice = productPrice;
    }
}
