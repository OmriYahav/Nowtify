package com.nowtify.dto;

import com.nowtify.model.VoteOption;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VoteStatsResponse {
    private long totalVotes;
    private double yesPercentage;
    private double noPercentage;
    private VoteOption userVote;
}
