package com.fooddelivery.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/sse")
public class SseController {

    // Map of orderId -> SseEmitter (one per order being watched)
    private static final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<Long, SseEmitter>();

    /**
     * User subscribes to live updates for a specific order.
     * Frontend calls: GET /api/sse/orders/{orderId}
     */
    @GetMapping(value = "/orders/{orderId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Long orderId) {
        SseEmitter emitter = new SseEmitter(0L); // 0 = no timeout
        emitters.put(orderId, emitter);

        // Clean up when connection closes
        emitter.onCompletion(() -> emitters.remove(orderId));
        emitter.onTimeout(() -> emitters.remove(orderId));
        emitter.onError(e -> emitters.remove(orderId));

        return emitter;
    }

    /**
     * Called by OrderService when admin updates an order status.
     * Pushes the new status to the connected user (if any).
     */
    public static void pushStatusUpdate(Long orderId, String newStatus) {
        SseEmitter emitter = emitters.get(orderId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("status-update")
                        .data(newStatus));
            } catch (IOException e) {
                emitters.remove(orderId);
            }
        }
    }
}
