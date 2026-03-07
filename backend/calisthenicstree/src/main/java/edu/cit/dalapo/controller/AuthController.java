package edu.cit.dalapo.controller;

import edu.cit.dalapo.dto.AuthResponse;
import edu.cit.dalapo.dto.RegisterRequest;
import edu.cit.dalapo.dto.LoginRequest;
import edu.cit.dalapo.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            AuthResponse responseData = authService.register(request);
            // In a full implementation, you'd wrap this in your API Standard JSON format
            return ResponseEntity.status(201).body(responseData);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        try {
            AuthResponse responseData = authService.login(request);
            return ResponseEntity.ok(responseData);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}