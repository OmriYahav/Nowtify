package com.nowtify.controller;

import com.nowtify.dto.LeaderboardEntryResponse;
import com.nowtify.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/leaderboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LeaderboardController {
    private final LeaderboardService leaderboardService;

    @GetMapping
    public List<LeaderboardEntryResponse> getLeaderboard() {
        return leaderboardService.getLeaderboard();
    }
}
