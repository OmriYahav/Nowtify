package com.nowtify.dto;

import com.nowtify.model.EventStatus;
import com.nowtify.model.VoteOption;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String predictionQuestion;
    private EventStatus status;
    private VoteOption outcome;
    private Instant closingTime;
    private Instant createdAt;
    private long totalVotes;
    private double yesPercentage;
    private double noPercentage;
    private VoteOption userVote;
}
