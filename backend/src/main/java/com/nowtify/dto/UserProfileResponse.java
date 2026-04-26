package com.nowtify.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserProfileResponse {
    private UserResponse user;
    private List<ProfileVoteResponse> votes;
}
