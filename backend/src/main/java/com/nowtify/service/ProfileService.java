package com.nowtify.service;

import com.nowtify.dto.UserProfileResponse;
import com.nowtify.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserService userService;

    public UserProfileResponse getProfile(String userId) {
        User user = userService.getUserById(userId);

        return UserProfileResponse.builder()
                .totalPredictions(user.getTotalPredictions())
                .correct(user.getCorrectPredictions())
                .wrong(user.getWrongPredictions())
                .accuracy(user.getAccuracyPercentage())
                .score(user.getScore())
                .build();
    }
}
