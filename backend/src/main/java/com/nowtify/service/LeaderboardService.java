package com.nowtify.service;

import com.nowtify.dto.LeaderboardEntryResponse;
import com.nowtify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class LeaderboardService {
    private final UserRepository userRepository;

    public List<LeaderboardEntryResponse> getLeaderboard() {
        AtomicInteger rank = new AtomicInteger(1);
        return userRepository.findAll().stream()
                .sorted(Comparator.comparingInt((com.nowtify.model.User u) -> u.getScore()).reversed()
                        .thenComparing(Comparator.comparingDouble(com.nowtify.model.User::getAccuracyPercentage).reversed()))
                .map(user -> LeaderboardEntryResponse.builder()
                        .rank(rank.getAndIncrement())
                        .userId(user.getId())
                        .email(user.getEmail())
                        .score(user.getScore())
                        .accuracyPercentage(user.getAccuracyPercentage())
                        .totalPredictions(user.getTotalPredictions())
                        .build())
                .toList();
    }
}
