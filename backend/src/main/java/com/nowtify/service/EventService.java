package com.nowtify.service;

import com.nowtify.dto.AdminCreateEventRequest;
import com.nowtify.dto.EventResponse;
import com.nowtify.dto.ResolveEventRequest;
import com.nowtify.dto.VoteStatsResponse;
import com.nowtify.model.Event;
import com.nowtify.model.EventStatus;
import com.nowtify.model.User;
import com.nowtify.model.Vote;
import com.nowtify.model.VoteOption;
import com.nowtify.repository.EventRepository;
import com.nowtify.repository.VoteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final VoteRepository voteRepository;
    private final RealtimeService realtimeService;

    public List<EventResponse> getAllEvents(String userId, UserService userService) {
        User user = userService.getOptionalUserById(userId);
        return eventRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(event -> toResponse(event, user))
                .toList();
    }

    public EventResponse getEvent(Long id, String userId, UserService userService) {
        Event event = getEventEntity(id);
        User user = userService.getOptionalUserById(userId);
        return toResponse(event, user);
    }

    @Transactional
    public EventResponse createEvent(AdminCreateEventRequest request) {
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setPredictionQuestion(request.getPredictionQuestion());
        event.setClosingTime(request.getClosingTime());
        event.setCreatedAt(Instant.now());
        event.setStatus(EventStatus.LIVE);

        Event saved = eventRepository.save(event);
        EventResponse response = toResponse(saved, null);
        realtimeService.broadcastUpdate("event-created", response);
        return response;
    }

    @Transactional
    public EventResponse resolveEvent(Long eventId, ResolveEventRequest request) {
        Event event = getEventEntity(eventId);
        if (event.getStatus() == EventStatus.RESOLVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event already resolved");
        }

        event.setStatus(EventStatus.RESOLVED);
        event.setOutcome(request.getOutcome());
        Event savedEvent = eventRepository.save(event);

        List<Vote> votes = voteRepository.findByEvent(savedEvent);
        votes.forEach(v -> v.setWasCorrect(v.getVoteOption() == request.getOutcome()));
        voteRepository.saveAll(votes);

        realtimeService.broadcastUpdate("event-resolved", toResponse(savedEvent, null));
        return toResponse(savedEvent, null);
    }

    public Event getEventEntity(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
    }

    public EventResponse toResponse(Event event, User user) {
        VoteStatsResponse stats = calculateVoteStats(event, user);
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .category(event.getCategory())
                .predictionQuestion(event.getPredictionQuestion())
                .status(event.getStatus())
                .outcome(event.getOutcome())
                .closingTime(event.getClosingTime())
                .createdAt(event.getCreatedAt())
                .totalVotes(stats.getTotalVotes())
                .yesPercentage(stats.getYesPercentage())
                .noPercentage(stats.getNoPercentage())
                .userVote(stats.getUserVote())
                .build();
    }

    public VoteStatsResponse calculateVoteStats(Event event, User user) {
        List<Vote> votes = voteRepository.findByEvent(event);
        long totalVotes = votes.size();
        long yesCount = votes.stream().filter(v -> v.getVoteOption() == VoteOption.YES).count();
        long noCount = votes.stream().filter(v -> v.getVoteOption() == VoteOption.NO).count();

        double yesPercent = totalVotes == 0 ? 0.0 : ((double) yesCount / totalVotes) * 100;
        double noPercent = totalVotes == 0 ? 0.0 : ((double) noCount / totalVotes) * 100;

        VoteOption userVote = null;
        if (user != null) {
            userVote = voteRepository.findByUserAndEvent(user, event)
                    .map(Vote::getVoteOption)
                    .orElse(null);
        }

        return VoteStatsResponse.builder()
                .totalVotes(totalVotes)
                .yesPercentage(Math.round(yesPercent * 10.0) / 10.0)
                .noPercentage(Math.round(noPercent * 10.0) / 10.0)
                .userVote(userVote)
                .build();
    }

    public List<EventResponse> getResolvedEventsSorted() {
        return eventRepository.findByStatus(EventStatus.RESOLVED).stream()
                .sorted(Comparator.comparing(Event::getCreatedAt).reversed())
                .map(e -> toResponse(e, null))
                .toList();
    }
}
