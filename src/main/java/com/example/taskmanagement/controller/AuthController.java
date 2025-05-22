package com.example.taskmanagement.controller;

import com.example.taskmanagement.model.User;
import com.example.taskmanagement.model.UserDTO;
import com.example.taskmanagement.model.UserMapper;
import com.example.taskmanagement.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;
    @Autowired
    private UserMapper userMapper;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> signupRequest) {
        try {
            logger.info("Received signup request for email: {}", signupRequest.get("email"));
            
            if (signupRequest.get("name") == null || signupRequest.get("email") == null || signupRequest.get("password") == null) {
                logger.error("Missing required fields in signup request");
                return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields"));
            }

            User user = authService.registerUser(
                signupRequest.get("name"),
                signupRequest.get("email"),
                signupRequest.get("password")
            );

            logger.info("User registered successfully: {}", user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("user", userMapper.toDto(user));
            response.put("token", "dummy-token"); // In a real app, generate a JWT token here

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error during user registration: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        try {
            logger.info("Received login request for email: {}", loginRequest.get("email"));
            
            if (loginRequest.get("email") == null || loginRequest.get("password") == null) {
                logger.error("Missing required fields in login request");
                return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields"));
            }

            User user = authService.loginUser(
                loginRequest.get("email"),
                loginRequest.get("password")
            );

            logger.info("User logged in successfully: {}", user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("user", userMapper.toDto(user));
            response.put("token", "dummy-token"); // In a real app, generate a JWT token here

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error during user login: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
} 