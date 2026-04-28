package com.nowtify.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserProfileResponse {
    private String userId;
    private String email;
    private int score;
    private int totalPredictions;
    private int correctPredictions;
    private int wrongPredictions;
    private double accuracyPercentage;
    private List<ProfileVoteResponse> votes;
}
