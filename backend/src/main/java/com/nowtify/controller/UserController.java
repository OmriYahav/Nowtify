package com.nowtify.controller;

import com.nowtify.dto.GuestUserRequest;
import com.nowtify.dto.UserProfileResponse;
import com.nowtify.dto.UserResponse;
import com.nowtify.service.ProfileService;
import com.nowtify.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;
    private final ProfileService profileService;

    @PostMapping("/guest")
    public UserResponse registerGuest(@Valid @RequestBody GuestUserRequest request) {
        return userService.registerGuest(request);
    }

    @GetMapping("/{userId}/profile")
    public UserProfileResponse getProfile(@PathVariable String userId) {
        return profileService.getProfile(userId);
    }
}
