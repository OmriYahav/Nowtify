package com.nowtify.controller;

import com.nowtify.dto.AdminCreateEventRequest;
import com.nowtify.dto.EventResponse;
import com.nowtify.dto.ResolveEventRequest;
import com.nowtify.service.EventService;
import com.nowtify.service.VoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {
    private final EventService eventService;
    private final VoteService voteService;

    @PostMapping
    public EventResponse createEvent(@Valid @RequestBody AdminCreateEventRequest request) {
        return eventService.createEvent(request);
    }

    @PostMapping("/{eventId}/resolve")
    public EventResponse resolveEvent(@PathVariable Long eventId, @Valid @RequestBody ResolveEventRequest request) {
        EventResponse response = eventService.resolveEvent(eventId, request);
        voteService.recalculateAllUserScores();
        return response;
    }
}
