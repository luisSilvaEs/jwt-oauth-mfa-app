package com.luissilvacoding.jwt_oauth_mfa_app.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Response returned for /me")
public class MeResponse {

    protected Long id;
    protected String email;
    protected String provider;
    protected String name;
    protected boolean mfaEnabled;
    protected LocalDateTime createdAt;

    public MeResponse(Long id, String email, String name, String provider, boolean mfaEnabled,
            LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.provider = provider;
        this.mfaEnabled = mfaEnabled;
        this.createdAt = createdAt;
    }
}
