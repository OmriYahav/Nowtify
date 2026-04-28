package com.nowtify.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaderboardEntryResponse {
    private int rank;
    private String userId;
    private String email;
    private int score;
    private double accuracyPercentage;
    private int totalPredictions;
}
