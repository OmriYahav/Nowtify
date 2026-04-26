package com.nowtify.controller;

import com.nowtify.dto.EventResponse;
import com.nowtify.dto.VoteRequest;
import com.nowtify.service.EventService;
import com.nowtify.service.UserService;
import com.nowtify.service.VoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {
    private final EventService eventService;
    private final VoteService voteService;
    private final UserService userService;
    private final com.nowtify.service.RealtimeService realtimeService;

    @GetMapping
    public List<EventResponse> getAllEvents(@RequestParam(required = false) String userId) {
        return eventService.getAllEvents(userId, userService);
    }

    @GetMapping("/{id}")
    public EventResponse getEvent(@PathVariable Long id, @RequestParam(required = false) String userId) {
        return eventService.getEvent(id, userId, userService);
    }

    @PostMapping("/{id}/vote")
    public EventResponse vote(@PathVariable Long id, @Valid @RequestBody VoteRequest request) {
        return voteService.castVote(id, request);
    }

    @GetMapping("/stream")
    public SseEmitter stream() {
        return realtimeService.subscribe();
    }
}
