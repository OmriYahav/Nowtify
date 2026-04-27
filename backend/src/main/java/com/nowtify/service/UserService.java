package com.nowtify.service;

import com.nowtify.dto.AuthLoginRequest;
import com.nowtify.dto.AuthRegisterRequest;
import com.nowtify.dto.AuthResponse;
import com.nowtify.dto.UserResponse;
import com.nowtify.model.User;
import com.nowtify.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(AuthRegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(Instant.now());

        User saved = userRepository.save(user);
        return AuthResponse.builder()
                .userId(saved.getId())
                .email(saved.getEmail())
                .build();
    }

    public AuthResponse login(AuthLoginRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return AuthResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .build();
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public User getOptionalUserById(String userId) {
        if (userId == null || userId.isBlank()) {
            return null;
        }

        return userRepository.findById(userId).orElse(null);
    }

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .score(user.getScore())
                .totalPredictions(user.getTotalPredictions())
                .correctPredictions(user.getCorrectPredictions())
                .wrongPredictions(user.getWrongPredictions())
                .accuracyPercentage(user.getAccuracyPercentage())
                .build();
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
