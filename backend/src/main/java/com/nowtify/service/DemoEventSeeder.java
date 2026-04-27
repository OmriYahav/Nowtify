package com.nowtify.service;

import com.nowtify.model.Event;
import com.nowtify.model.EventStatus;
import com.nowtify.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DemoEventSeeder implements CommandLineRunner {
    private final EventRepository eventRepository;

    @Override
    public void run(String... args) {
        if (eventRepository.count() > 0) {
            return;
        }

        Instant now = Instant.now();
        List<Event> demoEvents = List.of(
                createEvent(
                        "Security Alert Drill In Tel Aviv",
                        "Fictional scenario: Home Front Command is expected to publish guidance for a nationwide drill.",
                        "Security",
                        "Will a formal nationwide guidance update be published before evening?",
                        now.plus(6, ChronoUnit.HOURS),
                        now.minus(90, ChronoUnit.MINUTES)
                ),
                createEvent(
                        "Coalition Budget Vote Timing",
                        "Fictional scenario: coalition leaders are negotiating final timing for a key budget vote.",
                        "Politics",
                        "Will the budget vote be scheduled before midnight local time?",
                        now.plus(10, ChronoUnit.HOURS),
                        now.minus(2, ChronoUnit.HOURS)
                ),
                createEvent(
                        "Bank of Israel Rate Rumor",
                        "Fictional scenario: analysts expect an unscheduled statement related to inflation pressure.",
                        "Economy",
                        "Will the Bank of Israel issue a same-day policy clarification?",
                        now.plus(8, ChronoUnit.HOURS),
                        now.minus(3, ChronoUnit.HOURS)
                ),
                createEvent(
                        "Maccabi vs Hapoel Derby Kickoff Delay",
                        "Fictional sports desk update about possible late kickoff due to weather and logistics.",
                        "Sports",
                        "Will kickoff be delayed by more than 15 minutes?",
                        now.plus(4, ChronoUnit.HOURS),
                        now.minus(30, ChronoUnit.MINUTES)
                ),
                createEvent(
                        "Israeli AI Startup Mega Funding",
                        "Fictional scenario: a Tel Aviv startup is rumored to close a major Series C round.",
                        "Tech",
                        "Will the company announce a funding round above $150M today?",
                        now.plus(12, ChronoUnit.HOURS),
                        now.minus(4, ChronoUnit.HOURS)
                )
        );

        eventRepository.saveAll(demoEvents);
        log.info("Seeded {} demo events because database was empty", demoEvents.size());
    }

    private Event createEvent(String title,
                              String description,
                              String category,
                              String predictionQuestion,
                              Instant closingTime,
                              Instant createdAt) {
        Event event = new Event();
        event.setTitle(title);
        event.setDescription(description);
        event.setCategory(category);
        event.setPredictionQuestion(predictionQuestion);
        event.setStatus(EventStatus.LIVE);
        event.setClosingTime(closingTime);
        event.setCreatedAt(createdAt);
        return event;
    }
}
