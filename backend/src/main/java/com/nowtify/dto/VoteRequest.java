package com.nowtify.dto;

import com.nowtify.model.VoteOption;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VoteRequest {
    @NotBlank
    private String userId;

    @NotNull
    private VoteOption voteOption;
}
