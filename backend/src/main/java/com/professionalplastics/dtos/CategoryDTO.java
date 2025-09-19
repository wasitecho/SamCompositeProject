package com.professionalplastics.dtos;

import java.util.List;

public class CategoryDTO {

    private Long id;
    private String name;
    private List<String> grades;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<String> getGrades() {
		return grades;
	}
	public void setGrades(List<String> grades) {
		this.grades = grades;
	} 

    
    
}
