package com.nowtify.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private String id;
    private String email;
    private int score;
    private int totalPredictions;
    private int correctPredictions;
    private int wrongPredictions;
    private double accuracyPercentage;
}
