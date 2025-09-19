package com.professionalplastics.dtos;

public class GradeDTO {
    private Long id;
    private String typeCode;

    public GradeDTO() {}

    public GradeDTO(Long id, String typeCode) {
        this.id = id;
        this.typeCode = typeCode;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }


    public String getTypeCode() { return typeCode; }
    public void setTypeCode(String typeCode) { this.typeCode = typeCode; }
    
}
