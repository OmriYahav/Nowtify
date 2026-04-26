package com.nowtify.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class RealtimeService {
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((ex) -> emitters.remove(emitter));

        try {
            emitter.send(SseEmitter.event().name("connected").data("Nowtify realtime stream connected"));
        } catch (IOException e) {
            emitter.completeWithError(e);
        }

        return emitter;
    }

    public void broadcastUpdate(String type, Object payload) {
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().name(type).data(payload));
            } catch (Exception e) {
                emitter.complete();
                emitters.remove(emitter);
            }
        });
    }
}
