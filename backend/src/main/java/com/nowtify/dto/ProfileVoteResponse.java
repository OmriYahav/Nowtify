package com.nowtify.dto;

import com.nowtify.model.EventStatus;
import com.nowtify.model.VoteOption;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ProfileVoteResponse {
    private Long voteId;
    private Long eventId;
    private String eventTitle;
    private EventStatus eventStatus;
    private VoteOption voteOption;
    private VoteOption outcome;
    private Boolean wasCorrect;
    private Instant votedAt;
}
