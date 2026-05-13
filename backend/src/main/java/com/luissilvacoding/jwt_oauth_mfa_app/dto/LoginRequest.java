package com.luissilvacoding.jwt_oauth_mfa_app.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body for logging in")
public class LoginRequest {

    @Schema(description = "User's email address", example = "luis@example.com")
    public String email;

    @Schema(description = "User's password", example = "123456")
    public String password;
}