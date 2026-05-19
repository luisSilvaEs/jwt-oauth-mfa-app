// backend/src/main/java/com/yourapp/controller/HealthController.java
package com.luissilvacoding.jwt_oauth_mfa_app.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthController {

    // Reads the INSTANCE_ID env var injected by Docker Compose
    @Value("${INSTANCE_ID:unknown}")
    private String instanceId;

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of(
                "status", "UP",
                "instance", instanceId, // ← this is how you see which backend replied
                "timestamp", Instant.now().toString());
    }
}