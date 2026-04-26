package com.nowtify.repository;

import com.nowtify.model.Event;
import com.nowtify.model.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByOrderByCreatedAtDesc();
    List<Event> findByStatus(EventStatus status);
}
