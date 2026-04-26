package com.nowtify.repository;

import com.nowtify.model.Event;
import com.nowtify.model.User;
import com.nowtify.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserAndEvent(User user, Event event);
    List<Vote> findByEvent(Event event);
    List<Vote> findByUser(User user);
}
