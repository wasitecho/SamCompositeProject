package com.professionalplastics.service;

import com.professionalplastics.entity.User;
import com.professionalplastics.repository.UserRepository;
import com.professionalplastics.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public Map<String, Object> register(String username, String password, User.Role requestedRole) {
        Map<String, Object> response = new HashMap<>();
        
        // Check if user already exists
        if (userRepository.existsByUsername(username)) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return response;
        }
        
        // Determine role based on whether admin exists
        User.Role role = determineRole(requestedRole);
        
        // Create new user
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(username, role.name());
        
        response.put("success", true);
        response.put("message", "User registered successfully");
        response.put("token", token);
        response.put("role", role.name());
        response.put("username", username);
        
        return response;
    }
    
    public Map<String, Object> login(String username, String password) {
        Map<String, Object> response = new HashMap<>();
        
        User user = userRepository.findByUsername(username).orElse(null);
        
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid username or password");
            return response;
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(username, user.getRole().name());
        
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("role", user.getRole().name());
        response.put("username", username);
        
        return response;
    }
    
    private User.Role determineRole(User.Role requestedRole) {
        // If no admin exists, make the first user admin regardless of requested role
        if (!userRepository.existsByRole(User.Role.ROLE_ADMIN)) {
            return User.Role.ROLE_ADMIN;
        }
        
        // If admin exists, respect the requested role
        return requestedRole;
    }
}
