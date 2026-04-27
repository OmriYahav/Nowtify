package com.nowtify.service;

import com.nowtify.dto.EventResponse;
import com.nowtify.dto.VoteRequest;
import com.nowtify.model.Event;
import com.nowtify.model.EventStatus;
import com.nowtify.model.User;
import com.nowtify.model.Vote;
import com.nowtify.repository.UserRepository;
import com.nowtify.repository.VoteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final EventService eventService;
    private final RealtimeService realtimeService;

    @Transactional
    public EventResponse castVote(Long eventId, VoteRequest request) {
        Event event = eventService.getEventEntity(eventId);
        User user = userService.getUserById(request.getUserId());

        if (event.getStatus() == EventStatus.RESOLVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event already resolved");
        }

        Vote vote = voteRepository.findByUserAndEvent(user, event).orElseGet(() -> {
            Vote createdVote = new Vote();
            createdVote.setEvent(event);
            createdVote.setUser(user);
            createdVote.setCreatedAt(Instant.now());
            return createdVote;
        });

        vote.setVoteOption(request.getVote());
        voteRepository.save(vote);

        EventResponse updated = eventService.toResponse(event, user);
        realtimeService.broadcastUpdate("vote-updated", updated);
        return updated;
    }

    @Transactional
    public void recalculateAllUserScores() {
        userRepository.findAll().forEach(user -> {
            List<Vote> votes = voteRepository.findByUser(user);
            int correct = (int) votes.stream().filter(v -> Boolean.TRUE.equals(v.getWasCorrect())).count();
            int wrong = (int) votes.stream().filter(v -> Boolean.FALSE.equals(v.getWasCorrect())).count();
            int totalResolvedPredictions = correct + wrong;

            user.setCorrectPredictions(correct);
            user.setWrongPredictions(wrong);
            user.setTotalPredictions(votes.size());
            user.setScore((correct * 10) - (wrong * 3));
            user.setAccuracyPercentage(totalResolvedPredictions == 0
                    ? 0.0
                    : Math.round(((double) correct / totalResolvedPredictions) * 1000.0) / 10.0);
        });
        userRepository.flush();
    }
}
