package com.nowtify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GuestUserRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String userId;
}
