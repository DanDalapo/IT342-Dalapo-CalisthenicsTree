package edu.cit.dalapo.service;

import edu.cit.dalapo.dto.AuthResponse;
import edu.cit.dalapo.dto.GoogleTokenRequest;
import edu.cit.dalapo.entity.UserEntity;
import edu.cit.dalapo.repository.UserRepository;
import edu.cit.dalapo.dto.LoginRequest;
import edu.cit.dalapo.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        
        // 1. Database validation: Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use.");
        }

        // 2. Security: Hash the password
        String hashedPassword = passwordEncoder.encode(request.getPassword()); 

        // 3. Database: Save the new user
        UserEntity newUser = new UserEntity(request.getEmail(), hashedPassword, request.getFitnessLevel());
        UserEntity savedUser = userRepository.save(newUser);

        // 4. Auth: Generate a JWT token for auto-login
        String token = jwtService.generateToken(savedUser.getEmail());

        return new AuthResponse(savedUser.getId(), savedUser.getEmail(), token);
    }

    public AuthResponse googleRegister(GoogleTokenRequest request) {
        RestTemplate restTemplate = new RestTemplate();
        String googleUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getToken();
        
        Map<String, Object> payload;
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(googleUrl, Map.class);
            payload = response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Google token verification failed.");
        }

        String email = (String) payload.get("email");

        // THE CHECK: Does this Google user already exist?
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Account already exists. Please log in.");
        }

        // If they don't exist, create them!
        String randomPassword = passwordEncoder.encode(UUID.randomUUID().toString());
        UserEntity user = new UserEntity(email, randomPassword, "Beginner");
        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(user.getId(), user.getEmail(), token);
    }

    public AuthResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password.");
        }
        
        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(user.getId(), user.getEmail(), token);
    }

    public AuthResponse googleLogin(GoogleTokenRequest request) {
        // 1. Send the token directly to Google's verification endpoint
        RestTemplate restTemplate = new RestTemplate();
        String googleUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getToken();

        try {
            // Google will return a JSON object with the user's verified details
            ResponseEntity<Map> response = restTemplate.getForEntity(googleUrl, Map.class);
            Map<String, Object> payload = response.getBody();

            String email = (String) payload.get("email");
            
            // 2. Check if this Google user already exists in your Supabase database
            UserEntity user = userRepository.findByEmail(email).orElse(null);

            // 3. Auto-Registration: If they don't exist, create an account for them instantly!
            if (user == null) {
                // We generate a random, impossible password since they log in via Google
                String randomPassword = passwordEncoder.encode(UUID.randomUUID().toString());
                
                // Set "Beginner" as the default fitness level for auto-created accounts
                user = new UserEntity(email, randomPassword, "Beginner");
                user = userRepository.save(user);
            }

            // 4. Generate YOUR Calisthenics Tree JWT for them
            String token = jwtService.generateToken(user.getEmail());

            // 5. Return success!
            return new AuthResponse(user.getId(), user.getEmail(), token);

        } catch (Exception e) {
            throw new RuntimeException("Google token verification failed.");
        }
    }
}