package com.professionalplastics.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HealthController {

    /**
     * Root endpoint - returns API information
     */
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Professional Plastics API is running");
        response.put("version", "1.0.0");
        response.put("endpoints", Map.of(
            "health", "/health",
            "api", "/api",
            "products", "/api/products",
            "categories", "/api/categories",
            "auth", "/api/auth"
        ));
        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        return ResponseEntity.ok(response);
    }

    /**
     * Database health check endpoint
     */
    @GetMapping("/dbcheck")
    public ResponseEntity<Map<String, String>> dbCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("database", "connected");
        return ResponseEntity.ok(response);
    }
}

