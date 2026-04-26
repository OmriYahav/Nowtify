package com.nowtify.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "events")
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String predictionQuestion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.LIVE;

    @Enumerated(EnumType.STRING)
    private VoteOption outcome;

    @Column(nullable = false)
    private Instant closingTime;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
