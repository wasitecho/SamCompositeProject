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
@Table(name = "cut_to_size_quotation")
public class CutToSizeQuotation {

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
    private String sizeFullSheet;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cutLength;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cutWidth;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal machiningCost;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cutSizeArea;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer quantityPerSheet;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer numFullSheetsRequired;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer quantity;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basePriceFullSheet;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cutToSizePricePerUnit;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalCalculatedPrice;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_detail_id", nullable = false)
    @NotNull
    @JsonBackReference
    private ProductDetails productDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_price_id", nullable = false)
    @NotNull
    @JsonBackReference
    private ProductPrice productPrice;

    public CutToSizeQuotation() {
        this.createdAt = LocalDateTime.now();
    }

    public CutToSizeQuotation(String series, BigDecimal thickness, String sizeFullSheet,
                              BigDecimal cutLength, BigDecimal cutWidth, BigDecimal machiningCost,
                              BigDecimal cutSizeArea, Integer quantityPerSheet, Integer numFullSheetsRequired,
                              Integer quantity, BigDecimal basePriceFullSheet, BigDecimal cutToSizePricePerUnit,
                              BigDecimal totalCalculatedPrice, ProductDetails productDetail, ProductPrice productPrice) {
        this();
        this.series = series;
        this.thickness = thickness;
        this.sizeFullSheet = sizeFullSheet;
        this.cutLength = cutLength;
        this.cutWidth = cutWidth;
        this.machiningCost = machiningCost;
        this.cutSizeArea = cutSizeArea;
        this.quantityPerSheet = quantityPerSheet;
        this.numFullSheetsRequired = numFullSheetsRequired;
        this.quantity = quantity;
        this.basePriceFullSheet = basePriceFullSheet;
        this.cutToSizePricePerUnit = cutToSizePricePerUnit;
        this.totalCalculatedPrice = totalCalculatedPrice;
        this.productDetail = productDetail;
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

    public String getSizeFullSheet() {
        return sizeFullSheet;
    }

    public void setSizeFullSheet(String sizeFullSheet) {
        this.sizeFullSheet = sizeFullSheet;
    }

    public BigDecimal getCutLength() {
        return cutLength;
    }

    public void setCutLength(BigDecimal cutLength) {
        this.cutLength = cutLength;
    }

    public BigDecimal getCutWidth() {
        return cutWidth;
    }

    public void setCutWidth(BigDecimal cutWidth) {
        this.cutWidth = cutWidth;
    }

    public BigDecimal getMachiningCost() {
        return machiningCost;
    }

    public void setMachiningCost(BigDecimal machiningCost) {
        this.machiningCost = machiningCost;
    }

    public BigDecimal getCutSizeArea() {
        return cutSizeArea;
    }

    public void setCutSizeArea(BigDecimal cutSizeArea) {
        this.cutSizeArea = cutSizeArea;
    }

    public Integer getQuantityPerSheet() {
        return quantityPerSheet;
    }

    public void setQuantityPerSheet(Integer quantityPerSheet) {
        this.quantityPerSheet = quantityPerSheet;
    }

    public Integer getNumFullSheetsRequired() {
        return numFullSheetsRequired;
    }

    public void setNumFullSheetsRequired(Integer numFullSheetsRequired) {
        this.numFullSheetsRequired = numFullSheetsRequired;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getBasePriceFullSheet() {
        return basePriceFullSheet;
    }

    public void setBasePriceFullSheet(BigDecimal basePriceFullSheet) {
        this.basePriceFullSheet = basePriceFullSheet;
    }

    public BigDecimal getCutToSizePricePerUnit() {
        return cutToSizePricePerUnit;
    }

    public void setCutToSizePricePerUnit(BigDecimal cutToSizePricePerUnit) {
        this.cutToSizePricePerUnit = cutToSizePricePerUnit;
    }

    public BigDecimal getTotalCalculatedPrice() {
        return totalCalculatedPrice;
    }

    public void setTotalCalculatedPrice(BigDecimal totalCalculatedPrice) {
        this.totalCalculatedPrice = totalCalculatedPrice;
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

    public ProductPrice getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(ProductPrice productPrice) {
        this.productPrice = productPrice;
    }
}
