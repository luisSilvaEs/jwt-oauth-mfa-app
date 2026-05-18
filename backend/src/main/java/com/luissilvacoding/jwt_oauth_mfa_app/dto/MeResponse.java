package com.luissilvacoding.jwt_oauth_mfa_app.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Response returned for /me")
public class MeResponse {

    private Long id;
    private String email;
    private String provider;
    private String name;
    private boolean mfaEnabled;
    private LocalDateTime createdAt;

    public MeResponse(Long id, String email, String name, String provider, boolean mfaEnabled,
            LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.provider = provider;
        this.mfaEnabled = mfaEnabled;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getProvider() {
        return provider;
    }

    public boolean isMfaEnabled() {
        return mfaEnabled;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

}
