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

        // 4. Auth: Generate a JWT token for auto-login (FIXED VARIABLE NAME)
        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getRole());

        return new AuthResponse(savedUser.getId(), savedUser.getEmail(), token, savedUser.getRole());
    }

    @SuppressWarnings("rawtypes")
    public AuthResponse googleRegister(GoogleTokenRequest request) {
        RestTemplate restTemplate = new RestTemplate();
        String googleUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getToken();
        
        Map<?, ?> payload; 
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(googleUrl, Map.class);
            payload = response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Google token verification failed.");
        }

        String email = (String) payload.get("email");

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Account already exists. Please log in.");
        }

        String randomPassword = passwordEncoder.encode(UUID.randomUUID().toString());
        UserEntity user = new UserEntity(email, randomPassword, "Beginner");
        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(user.getId(), user.getEmail(), token, user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password.");
        }
        
        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(user.getId(), user.getEmail(), token, user.getRole());
    }

    @SuppressWarnings("rawtypes")
    public AuthResponse googleLogin(GoogleTokenRequest request) {
        RestTemplate restTemplate = new RestTemplate();
        String googleUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getToken();

        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(googleUrl, Map.class);
            Map<?, ?> payload = response.getBody();

            String email = (String) payload.get("email");
            
            UserEntity user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                String randomPassword = passwordEncoder.encode(UUID.randomUUID().toString());
                
                user = new UserEntity(email, randomPassword, "Beginner");
                user = userRepository.save(user);
            }

            String token = jwtService.generateToken(user.getEmail(), user.getRole());

            return new AuthResponse(user.getId(), user.getEmail(), token, user.getRole());

        } catch (Exception e) {
            throw new RuntimeException("Google token verification failed.");
        }
    }
}