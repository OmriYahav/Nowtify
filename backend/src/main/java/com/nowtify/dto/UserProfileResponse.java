package com.nowtify.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {
    private int totalPredictions;
    private int correct;
    private int wrong;
    private double accuracy;
    private int score;
}
