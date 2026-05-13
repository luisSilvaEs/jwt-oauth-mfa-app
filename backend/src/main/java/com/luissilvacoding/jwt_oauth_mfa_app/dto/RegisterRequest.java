package com.luissilvacoding.jwt_oauth_mfa_app.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request body for registering a new user")
public class RegisterRequest {

    @Schema(description = "User's email address", example = "luis@example.com")
    public String email;

    @Schema(description = "User's password (will be hashed)", example = "123456")
    public String password;

    @Schema(description = "User's display name", example = "Luis")
    public String name;
}