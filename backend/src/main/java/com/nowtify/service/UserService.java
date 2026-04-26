package com.nowtify.service;

import com.nowtify.dto.GuestUserRequest;
import com.nowtify.dto.UserResponse;
import com.nowtify.model.User;
import com.nowtify.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public UserResponse registerGuest(GuestUserRequest request) {
        if (userRepository.existsById(request.getUserId())) {
            User existingUser = userRepository.findById(request.getUserId()).orElseThrow();
            return toUserResponse(existingUser);
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }

        User user = new User();
        user.setId(request.getUserId());
        user.setUsername(request.getUsername());

        return toUserResponse(userRepository.save(user));
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .score(user.getScore())
                .totalPredictions(user.getTotalPredictions())
                .correctPredictions(user.getCorrectPredictions())
                .wrongPredictions(user.getWrongPredictions())
                .accuracyPercentage(user.getAccuracyPercentage())
                .build();
    }
}
