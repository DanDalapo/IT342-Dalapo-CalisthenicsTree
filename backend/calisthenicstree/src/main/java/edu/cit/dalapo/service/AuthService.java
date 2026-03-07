package edu.cit.dalapo.service;

import edu.cit.dalapo.dto.AuthResponse;
import edu.cit.dalapo.entity.UserEntity;
import edu.cit.dalapo.repository.UserRepository;
import edu.cit.dalapo.dto.LoginRequest;
import edu.cit.dalapo.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use.");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match.");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword()); 

        UserEntity newUser = new UserEntity(request.getEmail(), hashedPassword, request.getFitnessLevel());
        UserEntity savedUser = userRepository.save(newUser);

        String token = jwtService.generateToken(savedUser.getEmail());

        return new AuthResponse(savedUser.getId(), savedUser.getEmail(), token);
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
}