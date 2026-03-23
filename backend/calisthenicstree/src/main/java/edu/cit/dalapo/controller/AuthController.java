package edu.cit.dalapo.controller;

import edu.cit.dalapo.dto.AuthResponse;
import edu.cit.dalapo.dto.RegisterRequest;
import edu.cit.dalapo.dto.LoginRequest;
import edu.cit.dalapo.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import edu.cit.dalapo.dto.GoogleTokenRequest;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        System.out.println("🚨 REGISTER ENDPOINT WAS HIT! 🚨");
        try {
            AuthResponse responseData = authService.register(request);
            return ResponseEntity.status(201).body(responseData);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/google/register")
    public ResponseEntity<?> googleRegister(@RequestBody GoogleTokenRequest request) {
        try {
            AuthResponse responseData = authService.googleRegister(request);
            return ResponseEntity.status(201).body(responseData);
        } catch (RuntimeException e) {
            // Returns the "Account already exists" message to React
            return ResponseEntity.status(400).body(e.getMessage()); 
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

    @PostMapping("/google/login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleTokenRequest request) {
        try {
            AuthResponse responseData = authService.googleLogin(request);
            return ResponseEntity.ok(responseData);
        } catch (RuntimeException e) {
            // Returns the "Account not found" message to React
            return ResponseEntity.status(401).body(e.getMessage()); 
        }
    }
}