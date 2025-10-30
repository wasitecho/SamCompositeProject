package com.professionalplastics.service;

import java.util.List;

public interface BaseCrudService<DTO> {
    DTO getById(Long id);
    List<DTO> getAll();
    DTO create(DTO dto);
    DTO update(Long id, DTO dto);
    void delete(Long id);
}


