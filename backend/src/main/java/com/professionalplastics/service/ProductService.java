package com.professionalplastics.service;

import com.professionalplastics.dtos.ProductDTO;
import com.professionalplastics.entity.Product;
import com.professionalplastics.exception.EntityNotFoundException;
import com.professionalplastics.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService implements BaseCrudService<ProductDTO> {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public ProductDTO getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));
        return toDto(product);
    }

    @Override
    public List<ProductDTO> getAll() {
        return productRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ProductDTO create(ProductDTO dto) {
        Product product = new Product(dto.getProductName(), dto.getDescription(), dto.getCategoryName());
        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    @Override
    public ProductDTO update(Long id, ProductDTO dto) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));
        existing.setProductName(dto.getProductName());
        existing.setDescription(dto.getDescription());
        existing.setCategoryName(dto.getCategoryName());
        return toDto(productRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }

    public List<ProductDTO> getByCategoryName(String categoryName) {
        return productRepository.findByCategoryNameIgnoreCase(categoryName)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ProductDTO> searchByName(String name) {
        return productRepository.findByProductNameContainingIgnoreCase(name)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private ProductDTO toDto(Product product) {
        return new ProductDTO(product.getId(), product.getProductName(), product.getDescription(), product.getCategoryName());
    }
}
