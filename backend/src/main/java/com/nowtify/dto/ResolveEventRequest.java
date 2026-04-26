package com.nowtify.dto;

import com.nowtify.model.VoteOption;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResolveEventRequest {
    @NotNull
    private VoteOption outcome;
}
