package com.nowtify.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class AdminCreateEventRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotBlank
    private String category;
    @NotBlank
    private String predictionQuestion;
    @NotNull
    @Future
    private Instant closingTime;
}
