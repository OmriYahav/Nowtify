package com.nowtify.service;

import com.nowtify.dto.ProfileVoteResponse;
import com.nowtify.dto.UserProfileResponse;
import com.nowtify.model.User;
import com.nowtify.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserService userService;
    private final VoteRepository voteRepository;

    @Transactional
    public UserProfileResponse getProfile(String userId) {
        User user = userService.getUserById(userId);

        return UserProfileResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .score(user.getScore())
                .totalPredictions(user.getTotalPredictions())
                .correctPredictions(user.getCorrectPredictions())
                .wrongPredictions(user.getWrongPredictions())
                .accuracyPercentage(user.getAccuracyPercentage())
                .votes(voteRepository.findByUser(user).stream()
                        .sorted(Comparator.comparing(v -> v.getCreatedAt(), Comparator.reverseOrder()))
                        .map(vote -> ProfileVoteResponse.builder()
                                .voteId(vote.getId())
                                .eventId(vote.getEvent().getId())
                                .eventTitle(vote.getEvent().getTitle())
                                .eventStatus(vote.getEvent().getStatus())
                                .voteOption(vote.getVoteOption())
                                .outcome(vote.getEvent().getOutcome())
                                .wasCorrect(vote.getWasCorrect())
                                .votedAt(vote.getCreatedAt())
                                .build())
                        .toList())
                .build();
    }
}
