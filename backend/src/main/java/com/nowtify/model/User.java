package com.nowtify.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private int score = 0;

    @Column(nullable = false)
    private int totalPredictions = 0;

    @Column(nullable = false)
    private int correctPredictions = 0;

    @Column(nullable = false)
    private int wrongPredictions = 0;

    @Column(nullable = false)
    private double accuracyPercentage = 0.0;
}
