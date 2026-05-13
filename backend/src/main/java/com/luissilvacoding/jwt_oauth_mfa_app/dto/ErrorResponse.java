package com.luissilvacoding.jwt_oauth_mfa_app.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Error response")
public class ErrorResponse {

    @Schema(description = "Error message", example = "Invalid credentials")
    public String error;

    public ErrorResponse(String error) {
        this.error = error;
    }
}