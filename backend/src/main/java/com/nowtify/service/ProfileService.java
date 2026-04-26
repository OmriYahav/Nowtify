package com.nowtify.service;

import com.nowtify.dto.ProfileVoteResponse;
import com.nowtify.dto.UserProfileResponse;
import com.nowtify.model.User;
import com.nowtify.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserService userService;
    private final VoteRepository voteRepository;

    public UserProfileResponse getProfile(String userId) {
        User user = userService.getUserById(userId);
        return UserProfileResponse.builder()
                .user(userService.toUserResponse(user))
                .votes(voteRepository.findByUser(user).stream().map(v -> ProfileVoteResponse.builder()
                        .voteId(v.getId())
                        .eventId(v.getEvent().getId())
                        .eventTitle(v.getEvent().getTitle())
                        .eventStatus(v.getEvent().getStatus())
                        .voteOption(v.getVoteOption())
                        .outcome(v.getEvent().getOutcome())
                        .wasCorrect(v.getWasCorrect())
                        .votedAt(v.getCreatedAt())
                        .build()).toList())
                .build();
    }
}
