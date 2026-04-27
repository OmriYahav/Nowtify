package com.nowtify.controller;

import com.nowtify.dto.UserProfileResponse;
import com.nowtify.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final ProfileService profileService;

    @GetMapping("/{userId}/profile")
    public UserProfileResponse getProfile(@PathVariable String userId) {
        return profileService.getProfile(userId);
    }
}
